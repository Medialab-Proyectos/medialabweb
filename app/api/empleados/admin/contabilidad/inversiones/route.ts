import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listInversiones, upsertInversion, eliminarInversion } from "@/lib/empleados/contabilidad-queries"

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
  return { msg: falta ? "Falta correr schema-fase32-inversiones.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ inversiones: await listInversiones() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, inversiones: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  entidad: z.string().trim().min(1).max(160),
  tipo: z.string().max(60).nullable().optional(),
  monto: z.number().min(0).default(0),
  moneda: z.enum(["COP", "USD"]).default("COP"),
  tasa: z.number().min(0).nullable().optional(),
  rendimiento_esperado: z.number().min(0).default(0),
  rendimiento_real: z.number().min(0).nullable().optional(),
  fecha_apertura: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  cuenta_id: z.string().uuid().nullable().optional(),
  estado: z.enum(["abierta", "cerrada"]).default("abierta"),
  notas: z.string().max(1000).nullable().optional(),
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
    const inversion = await upsertInversion({
      ...(b.id ? { id: b.id } : {}),
      entidad: b.entidad, tipo: b.tipo ?? null, monto: b.monto, moneda: b.moneda, tasa: b.tasa ?? null,
      rendimiento_esperado: b.rendimiento_esperado, rendimiento_real: b.rendimiento_real ?? null,
      fecha_apertura: b.fecha_apertura, fecha_vencimiento: b.fecha_vencimiento ?? null,
      cuenta_id: b.cuenta_id ?? null, estado: b.estado, notas: b.notas ?? null,
      creado_por: g.session!.sub,
    })
    return NextResponse.json({ inversion })
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
    await eliminarInversion(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
