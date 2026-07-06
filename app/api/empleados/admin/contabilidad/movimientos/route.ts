import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listMovimientos, upsertMovimiento, eliminarMovimiento, getMovimiento } from "@/lib/empleados/contabilidad-queries"

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
  return { msg: falta ? "Falta correr schema-fase11-contabilidad.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    const movimientos = await listMovimientos()
    return NextResponse.json({ movimientos })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, movimientos: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  cuenta_id: z.string().uuid(),
  cuenta_destino_id: z.string().uuid().nullable().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tipo: z.enum(["ingreso", "egreso", "traslado"]),
  categoria: z.string().max(60).nullable().optional(),
  concepto: z.string().max(300).nullable().optional(),
  contraparte: z.string().max(160).nullable().optional(),
  empresa_id: z.string().uuid().nullable().optional(),
  valor: z.number().min(0),
  tasa: z.number().min(0).nullable().optional(),
  costo: z.number().min(0).default(0),
  valor_destino: z.number().min(0).nullable().optional(),
  estado: z.enum(["pendiente", "realizado"]).default("realizado"),
  referencia: z.string().max(120).nullable().optional(),
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

  if (b.tipo === "traslado") {
    if (!b.cuenta_destino_id) return NextResponse.json({ error: "Un traslado necesita cuenta destino." }, { status: 400 })
    if (b.cuenta_destino_id === b.cuenta_id) return NextResponse.json({ error: "La cuenta destino debe ser distinta a la de origen." }, { status: 400 })
  }

  // Al editar, se preserva el creador original; solo se setea en el alta.
  const creadoPor = b.id ? (await getMovimiento(b.id))?.creado_por ?? g.session!.sub : g.session!.sub

  try {
    const esTraslado = b.tipo === "traslado"
    const movimiento = await upsertMovimiento({
      ...(b.id ? { id: b.id } : {}),
      cuenta_id: b.cuenta_id,
      cuenta_destino_id: esTraslado ? b.cuenta_destino_id ?? null : null,
      fecha: b.fecha,
      tipo: b.tipo,
      categoria: b.categoria ?? null,
      concepto: b.concepto ?? null,
      contraparte: b.contraparte ?? null,
      empresa_id: b.empresa_id ?? null,
      valor: b.valor,
      tasa: esTraslado ? b.tasa ?? null : null,
      costo: esTraslado ? b.costo : 0,
      valor_destino: esTraslado ? b.valor_destino ?? null : null,
      estado: b.estado,
      referencia: b.referencia ?? null,
      creado_por: creadoPor,
    })
    return NextResponse.json({ movimiento })
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
    await eliminarMovimiento(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
