import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listFacturas, setEstadoFactura, getFactura } from "@/lib/empleados/freelance-queries"
import { upsertMovimiento, getCuenta } from "@/lib/empleados/contabilidad-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"

export const runtime = "nodejs"

/** Fecha de hoy en zona horaria de Colombia (YYYY-MM-DD). */
function hoyBogota(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
}

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    const facturas = await listFacturas()
    return NextResponse.json({ facturas })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase10-freelance.sql en Supabase." : msg, facturas: [] },
      { status: falta ? 409 : 500 },
    )
  }
}

const schema = z.object({
  id: z.string().uuid(),
  estado: z.enum(["enviada", "pagada", "rechazada"]),
  observaciones: z.string().max(1000).nullable().optional(),
  // Si viene al marcar 'pagada', registra el egreso en Contabilidad desde esta cuenta.
  cuenta_id: z.string().uuid().nullable().optional(),
})

export async function PATCH(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // Estado previo (para no duplicar el egreso si ya estaba pagada).
  const previa = await getFactura(b.id)
  // Prestación de servicios: no se puede pagar sin el soporte de seguridad social (planilla).
  if (b.estado === "pagada" && previa && !previa.soporte_path) {
    const emp = await getEmpleadoById(previa.empleado_id)
    if (emp?.tipo_vinculacion === "prestacion_servicios") {
      return NextResponse.json({ error: "Esta factura es de prestación de servicios y no tiene el soporte de seguridad social (planilla). Pídele al proveedor que lo adjunte antes de pagarla." }, { status: 400 })
    }
  }
  const factura = await setEstadoFactura(b.id, { estado: b.estado, observaciones: b.observaciones })

  // Auto-registro del egreso en Contabilidad (solo en la transición → pagada).
  let contabilidad: { ok: boolean; aviso?: string } | undefined
  if (b.estado === "pagada" && b.cuenta_id && previa?.estado !== "pagada") {
    try {
      // La cuenta debe existir y su moneda coincidir con la de la factura.
      const cuenta = await getCuenta(b.cuenta_id)
      if (!cuenta) {
        contabilidad = { ok: false, aviso: "La factura quedó pagada, pero la cuenta indicada no existe." }
      } else if (cuenta.moneda !== factura.moneda) {
        contabilidad = { ok: false, aviso: `La factura quedó pagada, pero la cuenta está en ${cuenta.moneda} y la factura en ${factura.moneda}: no se registró el egreso.` }
      } else {
        const emp = await getEmpleadoById(factura.empleado_id)
        await upsertMovimiento({
          cuenta_id: b.cuenta_id,
          cuenta_destino_id: null,
          fecha: hoyBogota(),
          tipo: "egreso",
          categoria: "factura_freelance",
          concepto: `Pago factura freelance${factura.numero ? ` N.º ${factura.numero}` : ""}`,
          contraparte: emp?.nombre ?? null,
          empresa_id: null,
          empleado_id: factura.empleado_id,
          valor: Number(factura.valor) || 0,
          tasa: null,
          costo: 0,
          valor_destino: null,
          iva_tipo: null,
          iva_valor: null,
          estado: "realizado",
          referencia: factura.numero ?? null,
          creado_por: g.session!.sub,
        })
        contabilidad = { ok: true }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error"
      const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
      contabilidad = { ok: false, aviso: falta ? "La factura quedó pagada, pero falta correr schema-fase11-contabilidad.sql para registrar el egreso." : "La factura quedó pagada, pero no se pudo registrar el egreso en contabilidad." }
    }
  }

  return NextResponse.json({ factura, contabilidad })
}
