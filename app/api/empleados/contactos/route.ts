import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listContactos, upsertContacto, eliminarContacto } from "@/lib/empleados/contacto-queries"

export const runtime = "nodejs"

function falta(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  return /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
}

/** Directorio de contactos aliados: lo LEE todo el equipo; el CEO lo edita. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  try {
    return NextResponse.json({ contactos: await listContactos() })
  } catch (e) {
    return NextResponse.json({ contactos: [], error: falta(e) ? "Falta correr schema-fase42-horarios.sql." : "Error" })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1).max(120),
  rol: z.string().max(80).nullable().optional(),
  empresa: z.string().max(120).nullable().optional(),
  telefono: z.string().max(60).nullable().optional(),
  email: z.string().max(160).nullable().optional(),
  notas: z.string().max(500).nullable().optional(),
  orden: z.number().int().optional(),
})

export async function POST(req: Request) {
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })
  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) } catch (e) {
    return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos." }, { status: 400 })
  }
  try {
    const contacto = await upsertContacto({
      id: b.id, nombre: b.nombre, rol: b.rol ?? null, empresa: b.empresa ?? null,
      telefono: b.telefono ?? null, email: b.email ?? null, notas: b.notas ?? null, orden: b.orden ?? 0,
    })
    return NextResponse.json({ contacto })
  } catch (e) {
    return NextResponse.json({ error: falta(e) ? "Falta correr schema-fase42-horarios.sql en Supabase." : "Error al guardar." }, { status: falta(e) ? 409 : 500 })
  }
}

export async function DELETE(req: Request) {
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  await eliminarContacto(id)
  return NextResponse.json({ ok: true })
}
