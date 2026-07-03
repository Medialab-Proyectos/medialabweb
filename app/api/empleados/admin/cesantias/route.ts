import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listCesantiasEmpleado, upsertCesantias } from "@/lib/empleados/contrato-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

function fallaEsquema(msg: string) {
  return /does not exist|column|schema cache|relation|PGRST205/i.test(msg)
}

const schema = z.object({
  empleado_id: z.string().uuid(),
  anio: z.number().int().min(2000).max(2100),
  dias: z.number().min(0).max(366).default(360),
  base: z.number().min(0).default(0),
  cesantias: z.number().min(0).default(0),
  intereses: z.number().min(0).default(0),
  fondo: z.string().max(120).nullable().optional(),
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
    const cesantias = await listCesantiasEmpleado(empleadoId, false)
    return NextResponse.json({ cesantias })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase5-cesantias.sql en Supabase." : msg, cesantias: [] },
      { status: fallaEsquema(msg) ? 409 : 500 },
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

  try {
    const cesantias = await upsertCesantias({
      empleado_id: b.empleado_id,
      anio: b.anio,
      dias: b.dias,
      base: b.base,
      cesantias: b.cesantias,
      intereses: b.intereses,
      fondo: b.fondo ?? null,
      observaciones: b.observaciones ?? null,
      publicado: b.publicado,
    })
    return NextResponse.json({ cesantias })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json(
      { error: fallaEsquema(msg) ? "Falta correr schema-fase5-cesantias.sql en Supabase." : msg },
      { status: fallaEsquema(msg) ? 409 : 500 },
    )
  }
}
