import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listPrimasEmpleado, upsertPrima, eliminarPrima } from "@/lib/empleados/contrato-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

const schema = z.object({
  empleado_id: z.string().uuid(),
  anio: z.number().int().min(2000).max(2100),
  semestre: z.union([z.literal(1), z.literal(2)]),
  dias: z.number().min(0).max(180).default(180),
  base: z.number().min(0).default(0),
  valor: z.number().min(0).default(0),
  observaciones: z.string().max(1000).nullable().optional(),
  publicado: z.boolean().default(false),
})

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const empleadoId = new URL(req.url).searchParams.get("empleado_id")
  if (!empleadoId) return NextResponse.json({ error: "Indica empleado_id." }, { status: 400 })
  try {
    const primas = await listPrimasEmpleado(empleadoId, false)
    return NextResponse.json({ primas })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /does not exist|column|schema cache|relation/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr la migración schema-fase3-contratos.sql en Supabase." : msg, primas: [] },
      { status: falta ? 409 : 500 },
    )
  }
}

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

  const prima = await upsertPrima({
    empleado_id: b.empleado_id,
    anio: b.anio,
    semestre: b.semestre,
    dias: b.dias,
    base: b.base,
    valor: b.valor,
    observaciones: b.observaciones ?? null,
    publicado: b.publicado,
  })
  return NextResponse.json({ prima })
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  await eliminarPrima(id)
  return NextResponse.json({ ok: true })
}
