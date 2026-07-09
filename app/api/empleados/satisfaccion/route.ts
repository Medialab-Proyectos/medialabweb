import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getRespuestaEmpleado, upsertRespuestaEmpleado } from "@/lib/empleados/satisfaccion-queries"
import { periodoActual } from "@/lib/empleados/satisfaccion"

export const runtime = "nodejs"

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase34-satisfaccion.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  const periodo = periodoActual()
  try {
    const respuesta = await getRespuestaEmpleado(s.sub, periodo)
    return NextResponse.json({ periodo, respuesta })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, periodo, respuesta: null }, { status: f.status })
  }
}

const schema = z.object({
  puntaje: z.number().min(0).max(100),
  recomendacion: z.number().int().min(0).max(10).nullable().optional(),
  comentario: z.string().max(1000).nullable().optional(),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  try {
    const respuesta = await upsertRespuestaEmpleado({
      empleado_id: s.sub, periodo: periodoActual(),
      puntaje: b.puntaje, recomendacion: b.recomendacion ?? null, comentario: b.comentario ?? null,
    })
    return NextResponse.json({ respuesta })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
