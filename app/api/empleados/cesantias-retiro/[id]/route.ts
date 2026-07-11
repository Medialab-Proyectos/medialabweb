import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getSolicitudCesantias, decidirSolicitudCesantias, eliminarSolicitudCesantias } from "@/lib/empleados/cesantias-solicitud-queries"

export const runtime = "nodejs"

const schema = z.object({
  estado: z.enum(["aprobada", "rechazada"]),
  comentario: z.string().max(500).optional().nullable(),
})

/** Líder del solicitante (o CEO) aprueba/rechaza la solicitud de retiro de cesantías. */
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

  const sol = await getSolicitudCesantias(id)
  if (!sol) return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 })
  if (sol.estado !== "pendiente") return NextResponse.json({ error: "Esta solicitud ya fue decidida." }, { status: 400 })

  const solicitante = await getEmpleadoById(sol.empleado_id)
  if (s.rol !== "ceo" && solicitante?.lider_id !== s.sub) {
    return NextResponse.json({ error: "Solo el líder de este empleado puede decidir la solicitud." }, { status: 403 })
  }

  const solicitud = await decidirSolicitudCesantias(id, {
    estado: b.estado,
    aprobado_por: s.sub,
    comentario: b.comentario ?? null,
  })
  return NextResponse.json({ solicitud })
}

/** El empleado puede borrar su solicitud mientras siga pendiente. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  const { id } = await params

  const sol = await getSolicitudCesantias(id)
  if (!sol) return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 })
  if (sol.empleado_id !== s.sub && s.rol !== "ceo") {
    return NextResponse.json({ error: "No puedes borrar una solicitud que no es tuya." }, { status: 403 })
  }
  if (sol.estado !== "pendiente") {
    return NextResponse.json({ error: "Solo puedes borrar una solicitud mientras esté pendiente." }, { status: 400 })
  }
  await eliminarSolicitudCesantias(id)
  return NextResponse.json({ ok: true })
}
