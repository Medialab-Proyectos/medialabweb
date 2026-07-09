import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getConfigEmpresa, setConfigEmpresa } from "@/lib/empleados/queries"

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
  return { msg: falta ? "Falta correr schema-fase19-datos-personales.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ config: await getConfigEmpresa() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, config: { caja_compensacion: null, arl: null, fecha_fundacion: null } }, { status: f.status })
  }
}

const schema = z.object({
  caja_compensacion: z.string().max(120).nullable().optional(),
  arl: z.string().max(120).nullable().optional(),
  fecha_fundacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
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
    return NextResponse.json({ config: await setConfigEmpresa({ caja_compensacion: b.caja_compensacion ?? null, arl: b.arl ?? null, fecha_fundacion: b.fecha_fundacion ?? null }) })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
