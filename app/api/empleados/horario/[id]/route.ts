import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getHorarioRow, decidirHorario } from "@/lib/empleados/horario-queries"

export const runtime = "nodejs"

const schema = z.object({
  estado: z.enum(["aprobado", "rechazado"]),
  comentario: z.string().max(500).optional().nullable(),
})

/** El líder del empleado (o el CEO) aprueba/rechaza el horario. Solo al aprobar entra en vigencia. */
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

  const row = await getHorarioRow(id)
  if (!row) return NextResponse.json({ error: "Horario no encontrado." }, { status: 404 })
  if (row.estado !== "pendiente") return NextResponse.json({ error: "Este horario ya fue decidido." }, { status: 400 })

  const solicitante = await getEmpleadoById(row.empleado_id)
  if (s.rol !== "ceo" && solicitante?.lider_id !== s.sub) {
    return NextResponse.json({ error: "Solo el líder de este empleado puede decidir su horario." }, { status: 403 })
  }

  const horario = await decidirHorario(id, { estado: b.estado, aprobado_por: s.sub, comentario: b.comentario ?? null })
  return NextResponse.json({ horario })
}
