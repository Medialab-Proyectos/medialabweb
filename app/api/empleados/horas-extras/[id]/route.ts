import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getHoraExtra, decidirHoraExtra, eliminarHoraExtra } from "@/lib/empleados/horas-extras-queries"

export const runtime = "nodejs"

const schema = z.object({
  estado: z.enum(["aprobada", "rechazada"]),
  comentario: z.string().max(500).optional().nullable(),
})

/** Líder del solicitante (o CEO) aprueba/rechaza un reporte de horas extra. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  const { id } = await params

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
  }

  const hora = await getHoraExtra(id)
  if (!hora) return NextResponse.json({ error: "Reporte no encontrado." }, { status: 404 })
  if (hora.estado !== "pendiente") return NextResponse.json({ error: "Este reporte ya fue decidido." }, { status: 400 })

  const solicitante = await getEmpleadoById(hora.empleado_id)
  if (s.rol !== "ceo" && solicitante?.lider_id !== s.sub) {
    return NextResponse.json({ error: "Solo el líder de este empleado puede decidir el reporte." }, { status: 403 })
  }

  const actualizado = await decidirHoraExtra(id, {
    estado: b.estado,
    aprobado_por: s.sub,
    comentario: b.comentario ?? null,
  })
  return NextResponse.json({ hora: actualizado })
}

/** El empleado puede borrar su propio reporte mientras siga pendiente. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  const { id } = await params

  const hora = await getHoraExtra(id)
  if (!hora) return NextResponse.json({ error: "Reporte no encontrado." }, { status: 404 })
  if (hora.empleado_id !== s.sub && s.rol !== "ceo") {
    return NextResponse.json({ error: "No puedes borrar un reporte que no es tuyo." }, { status: 403 })
  }
  if (hora.estado !== "pendiente") {
    return NextResponse.json({ error: "Solo puedes borrar un reporte mientras esté pendiente." }, { status: 400 })
  }
  await eliminarHoraExtra(id)
  return NextResponse.json({ ok: true })
}
