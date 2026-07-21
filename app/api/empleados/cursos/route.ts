import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listCursos, listCursosActivos, upsertCurso, eliminarCurso } from "@/lib/empleados/cursos-queries"

export const runtime = "nodejs"

function fallaEsquema(msg: string) {
  return /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
}

// GET: todos los usuarios ven los cursos ACTIVOS; el CEO ve todos (para gestionarlos).
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    const cursos = s.rol === "ceo" ? await listCursos() : await listCursosActivos()
    return NextResponse.json({ cursos, esCEO: s.rol === "ceo" })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: fallaEsquema(msg) ? "Falta correr schema-fase43-aprendizaje-cursos.sql en Supabase." : msg, cursos: [] }, { status: fallaEsquema(msg) ? 409 : 500 })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  titulo: z.string().trim().min(2).max(160),
  descripcion: z.string().trim().max(600).optional().nullable(),
  plataforma: z.string().trim().max(80).optional().nullable(),
  url: z.string().trim().url("La URL del curso no es válida.").max(600),
  categoria: z.string().trim().max(80).optional().nullable(),
  activo: z.boolean().default(true),
})

// POST: solo el CEO crea/edita cursos.
export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO puede gestionar cursos." }, { status: 403 })
  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  try {
    const curso = await upsertCurso({
      ...(b.id ? { id: b.id } : {}),
      titulo: b.titulo, descripcion: b.descripcion?.trim() || null, plataforma: b.plataforma?.trim() || null,
      url: b.url, categoria: b.categoria?.trim() || null, activo: b.activo, orden: 0,
    })
    return NextResponse.json({ curso })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: fallaEsquema(msg) ? "Falta correr schema-fase43-aprendizaje-cursos.sql en Supabase." : msg }, { status: fallaEsquema(msg) ? 409 : 500 })
  }
}

// DELETE: solo el CEO.
export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  try {
    await eliminarCurso(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 })
  }
}
