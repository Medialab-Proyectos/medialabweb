import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import {
  listGastosRecurrentes, upsertGastoRecurrente, eliminarGastoRecurrente, upsertMovimiento,
} from "@/lib/empleados/contabilidad-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase26-contabilidad-nomina-certificados.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ gastos: await listGastosRecurrentes() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, gastos: [] }, { status: f.status })
  }
}

const guardarSchema = z.object({
  accion: z.literal("guardar").optional(),
  id: z.string().uuid().optional(),
  nombre: z.string().trim().min(2, "El nombre es obligatorio.").max(120),
  categoria: z.string().max(60).nullable().optional(),
  proveedor: z.string().max(120).nullable().optional(),
  moneda: z.enum(["COP", "USD"]).default("COP"),
  valor: z.number().min(0).default(0),
  cuenta_id: z.string().uuid().nullable().optional(),
  activo: z.boolean().default(true),
  dia_cobro: z.number().int().min(1).max(31).nullable().optional(),
  debito_automatico: z.boolean().default(false),
})

// Registrar el pago del mes de un gasto recurrente → crea un egreso.
const pagarSchema = z.object({
  accion: z.literal("pagar"),
  id: z.string().uuid(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cuenta_id: z.string().uuid(),
  valor: z.number().min(0),
  estado: z.enum(["pendiente", "realizado"]).default("realizado"),
})

const schema = z.union([pagarSchema, guardarSchema])

export async function POST(req: Request) {
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

  try {
    if (b.accion === "pagar") {
      const gastos = await listGastosRecurrentes()
      const gasto = gastos.find((x) => x.id === b.id)
      if (!gasto) return NextResponse.json({ error: "Gasto no encontrado." }, { status: 404 })
      const movimiento = await upsertMovimiento({
        cuenta_id: b.cuenta_id,
        cuenta_destino_id: null,
        fecha: b.fecha,
        tipo: "egreso",
        categoria: gasto.categoria ?? "suscripcion",
        concepto: gasto.nombre,
        contraparte: gasto.proveedor ?? null,
        empresa_id: null,
        empleado_id: null,
        valor: b.valor,
        tasa: null,
        costo: 0,
        valor_destino: null,
        iva_tipo: null,
        iva_valor: null,
        estado: b.estado,
        referencia: null,
        creado_por: g.session!.sub,
      })
      return NextResponse.json({ movimiento })
    }

    const gasto = await upsertGastoRecurrente({
      ...(b.id ? { id: b.id } : {}),
      nombre: b.nombre, categoria: b.categoria ?? null, proveedor: b.proveedor ?? null,
      moneda: b.moneda, valor: b.valor, cuenta_id: b.cuenta_id ?? null, activo: b.activo, orden: 0,
      dia_cobro: b.dia_cobro ?? null, debito_automatico: b.debito_automatico,
    })
    return NextResponse.json({ gasto })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  try {
    await eliminarGastoRecurrente(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
