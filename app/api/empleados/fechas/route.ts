import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listFechasEspeciales, crearFechaEspecial, eliminarFechaEspecial } from "@/lib/empleados/fechas-queries"

export const runtime = "nodejs"

function fallaEsquema(msg: string) {
  return /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
}

// GET: cualquier usuario autenticado ve las fechas especiales.
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    return NextResponse.json({ fechas: await listFechasEspeciales() })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: fallaEsquema(msg) ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg, fechas: [] }, { status: fallaEsquema(msg) ? 409 : 500 })
  }
}

const schema = z.object({
  titulo: z.string().trim().min(2).max(120),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recurrente: z.boolean().default(true),
  nota: z.string().trim().max(300).optional().nullable(),
})

// POST: solo el CEO agrega fechas especiales.
export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO puede gestionar fechas." }, { status: 403 })
  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  try {
    const fecha = await crearFechaEspecial({ titulo: b.titulo, fecha: b.fecha, recurrente: b.recurrente, nota: b.nota?.trim() || null })
    return NextResponse.json({ fecha })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: fallaEsquema(msg) ? "Falta correr schema-fase42-horarios.sql en Supabase." : msg }, { status: fallaEsquema(msg) ? 409 : 500 })
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
    await eliminarFechaEspecial(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 })
  }
}
