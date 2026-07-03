import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { getSolicitud, decidirSolicitud, getEmpleadoVacacion } from "@/lib/empleados/ausencia-queries"

export const runtime = "nodejs"

const schema = z.object({
  estado: z.enum(["aprobada", "rechazada"]),
  comentario: z.string().max(500).optional().nullable(),
})

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

  const sol = await getSolicitud(id)
  if (!sol) return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 })
  if (sol.estado !== "pendiente") return NextResponse.json({ error: "Esta solicitud ya fue decidida." }, { status: 400 })

  // Solo el líder del solicitante (o el CEO) puede aprobar/rechazar.
  const solicitante = await getEmpleadoVacacion(sol.empleado_id)
  if (s.rol !== "ceo" && solicitante?.lider_id !== s.sub) {
    return NextResponse.json({ error: "Solo el líder de este empleado puede decidir la solicitud." }, { status: 403 })
  }

  const solicitud = await decidirSolicitud(id, {
    estado: b.estado,
    aprobado_por: s.sub,
    comentario: b.comentario ?? null,
  })
  return NextResponse.json({ solicitud })
}
