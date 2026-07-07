import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
import {
  getPerfilFreelance, upsertPerfilFreelance, listFacturasEmpleado, crearFactura,
} from "@/lib/empleados/freelance-queries"
import { formatMoneda } from "@/lib/empleados/freelance"
import { MESES } from "@/lib/empleados/desprendible"
import { notificarCEO } from "@/lib/empleados/notificar"

export const runtime = "nodejs"

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase10-freelance.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

/** Autoriza solo a empleados con vinculación freelance. */
async function guardFreelance() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  const emp = await getEmpleadoById(s.sub)
  if (!emp) return { error: NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 }) }
  if (!esVinculacionPorFactura(emp.tipo_vinculacion)) {
    return { error: NextResponse.json({ error: "Este módulo es solo para vinculación freelance o prestación de servicios." }, { status: 403 }) }
  }
  return { session: s, empleado: emp }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardFreelance()
  if (g.error) return g.error
  try {
    const [perfil, facturas] = await Promise.all([
      getPerfilFreelance(g.session!.sub),
      listFacturasEmpleado(g.session!.sub),
    ])
    const pago = g.empleado!.freelance_modo
      ? { modo: g.empleado!.freelance_modo, tarifa: Number(g.empleado!.freelance_tarifa) || 0, moneda: g.empleado!.freelance_moneda ?? "COP" }
      : null
    return NextResponse.json({ perfil, facturas, pago })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, perfil: null, facturas: [] }, { status: f.status })
  }
}

const perfilSchema = z.object({
  accion: z.literal("perfil"),
  moneda: z.enum(["COP", "USD"]),
  banco: z.string().max(120).nullable().optional(),
  cuenta: z.string().max(120).nullable().optional(),
  tipo_cuenta: z.string().max(60).nullable().optional(),
  titular: z.string().max(120).nullable().optional(),
  documento: z.string().max(60).nullable().optional(),
  notas: z.string().max(500).nullable().optional(),
})

const facturaSchema = z.object({
  accion: z.literal("factura"),
  anio: z.number().int().min(2000).max(2100),
  mes: z.number().int().min(1).max(12),
  numero: z.string().max(60).nullable().optional(),
  concepto: z.string().trim().min(1, "El concepto es obligatorio.").max(1000),
  moneda: z.enum(["COP", "USD"]),
  valor: z.number().min(0),
  horas: z.number().min(0).nullable().optional(),
  banco: z.string().max(120).nullable().optional(),
  cuenta: z.string().max(120).nullable().optional(),
  tipo_cuenta: z.string().max(60).nullable().optional(),
  titular: z.string().max(120).nullable().optional(),
  firmante: z.string().trim().min(3).max(120), // firma electrónica: nombre completo
})

const schema = z.discriminatedUnion("accion", [perfilSchema, facturaSchema])

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardFreelance()
  if (g.error) return g.error

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    if (b.accion === "perfil") {
      const perfil = await upsertPerfilFreelance({
        empleado_id: g.session!.sub,
        moneda: b.moneda,
        banco: b.banco ?? null,
        cuenta: b.cuenta ?? null,
        tipo_cuenta: b.tipo_cuenta ?? null,
        titular: b.titular ?? null,
        documento: b.documento ?? null,
        notas: b.notas ?? null,
      })
      return NextResponse.json({ perfil })
    }

    // Factura: se firma dentro de la plataforma al enviarla.
    const factura = await crearFactura({
      empleado_id: g.session!.sub,
      anio: b.anio,
      mes: b.mes,
      numero: b.numero ?? null,
      concepto: b.concepto ?? null,
      moneda: b.moneda,
      valor: b.valor,
      horas: b.horas ?? null,
      banco: b.banco ?? null,
      cuenta: b.cuenta ?? null,
      tipo_cuenta: b.tipo_cuenta ?? null,
      titular: b.titular ?? null,
      firmado: true,
      firmante: b.firmante,
      firmado_en: new Date().toISOString(),
    })
    // Aviso al CEO de que hay una nueva factura por revisar/pagar (best-effort).
    await notificarCEO(
      `Nueva factura de ${g.empleado!.nombre}`,
      `${g.empleado!.nombre} envió una factura por ${formatMoneda(factura.valor, factura.moneda)} (${MESES[factura.mes - 1]} ${factura.anio}).\n\nRevísala en el portal: /empleados/admin/freelance`,
    )
    return NextResponse.json({ factura })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
