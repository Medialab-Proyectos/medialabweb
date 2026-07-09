import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listSatisfaccion, crearSatisfaccionEmpresa, eliminarSatisfaccion, promedioSatisfaccion } from "@/lib/empleados/satisfaccion-queries"
import { listEmpleados } from "@/lib/empleados/queries"
import { notificarEmpleado } from "@/lib/empleados/notificar"
import { periodoActual } from "@/lib/empleados/satisfaccion"

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
  return { msg: falta ? "Falta correr schema-fase34-satisfaccion.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    const [todos, promEmpleados, promEmpresas] = await Promise.all([
      listSatisfaccion(),
      promedioSatisfaccion("empleado"),
      promedioSatisfaccion("empresa"),
    ])
    // Las respuestas de empleados se muestran ANÓNIMAS (sin nombre) para fomentar honestidad.
    const empleados = todos.filter((x) => x.origen === "empleado").map((x) => ({ id: x.id, periodo: x.periodo, puntaje: x.puntaje, recomendacion: x.recomendacion, comentario: x.comentario }))
    const empresas = todos.filter((x) => x.origen === "empresa").map((x) => ({ id: x.id, empresa: x.empresa, periodo: x.periodo, puntaje: x.puntaje, comentario: x.comentario }))
    return NextResponse.json({ promEmpleados, promEmpresas, totalEmpleados: empleados.length, empleados, empresas })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, promEmpleados: null, promEmpresas: null, empleados: [], empresas: [] }, { status: f.status })
  }
}

const empresaSchema = z.object({
  accion: z.literal("empresa"),
  empresa: z.string().trim().min(1).max(160),
  periodo: z.string().regex(/^\d{4}-\d{2}$/),
  puntaje: z.number().min(0).max(100),
  comentario: z.string().max(1000).nullable().optional(),
})
const enviarSchema = z.object({ accion: z.literal("enviar") })
const schema = z.discriminatedUnion("accion", [empresaSchema, enviarSchema])

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
    if (b.accion === "empresa") {
      const registro = await crearSatisfaccionEmpresa({ empresa: b.empresa, periodo: b.periodo, puntaje: b.puntaje, comentario: b.comentario ?? null, creado_por: g.session!.sub })
      return NextResponse.json({ registro })
    }

    // Enviar la encuesta a los empleados activos (a su correo empresarial, o personal como respaldo).
    const empleados = (await listEmpleados()).filter((e) => e.estado === "activo")
    const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://medialab.design") + "/empleados/satisfaccion"
    let enviados = 0
    await Promise.all(empleados.map(async (e) => {
      const to = e.email_empresarial || e.email
      if (!to) return
      const r = await notificarEmpleado(to, "Encuesta de satisfacción · MediaLab", `Hola ${e.nombre},\n\nNos encantaría saber cómo te sientes trabajando en MediaLab. Responde la encuesta (toma 1 minuto) desde tu portal:\n${url}\n\nGracias,\nMediaLab`)
      if (r.sent) enviados++
    }))
    return NextResponse.json({ enviados, total: empleados.length })
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
    await eliminarSatisfaccion(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
