import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listCuentasCobro, upsertCuentaCobro, eliminarCuentaCobro } from "@/lib/empleados/cuenta-cobro-queries"

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
  return { msg: falta ? "Falta correr schema-fase15-cuentas-cobro.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ cuentasCobro: await listCuentasCobro() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, cuentasCobro: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  numero: z.string().max(60).nullable().optional(),
  emisor: z.enum(["empresa", "personal"]).default("empresa"),
  empresa_id: z.string().uuid().nullable().optional(),
  contrato_empresa_id: z.string().uuid().nullable().optional(),
  modo: z.enum(["por_hora", "por_mes"]).default("por_mes"),
  cantidad: z.number().min(0).default(1),
  tarifa: z.number().min(0).default(0),
  moneda: z.enum(["COP", "USD"]).default("COP"),
  mes_servicio: z.string().max(60).nullable().optional(),
  concepto: z.string().max(300).nullable().optional(),
  cuenta_id: z.string().uuid().nullable().optional(),
  fecha_emision: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  fecha_pago: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  observaciones: z.string().max(1000).nullable().optional(),
  iva_tipo: z.enum(["na", "incluido", "exento"]).nullable().optional(),
  iva_valor: z.number().min(0).nullable().optional(),
  fee: z.number().min(0).nullable().optional(),
  estado: z.enum(["borrador", "emitida", "pagada"]).default("borrador"),
})

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
    const cuentaCobro = await upsertCuentaCobro({
      ...(b.id ? { id: b.id } : {}),
      numero: b.numero ?? null, emisor: b.emisor, empresa_id: b.empresa_id ?? null,
      contrato_empresa_id: b.contrato_empresa_id ?? null,
      modo: b.modo, cantidad: b.cantidad, tarifa: b.tarifa, moneda: b.moneda,
      mes_servicio: b.mes_servicio ?? null, concepto: b.concepto ?? null, cuenta_id: b.cuenta_id ?? null,
      fecha_emision: b.fecha_emision ?? null, fecha_pago: b.fecha_pago ?? null,
      observaciones: b.observaciones ?? null,
      iva_tipo: b.iva_tipo ?? null, iva_valor: b.iva_valor ?? null, fee: b.fee ?? null,
      estado: b.estado, creado_por: g.session!.sub,
    })
    return NextResponse.json({ cuentaCobro })
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
    await eliminarCuentaCobro(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
