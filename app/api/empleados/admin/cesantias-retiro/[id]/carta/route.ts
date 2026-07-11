import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getSolicitudCesantias } from "@/lib/empleados/cesantias-solicitud-queries"
import { inversionDeCausal } from "@/lib/empleados/cesantias-solicitud"
import { generarCartaRetiroParcialPDF } from "@/lib/empleados/carta-cesantias-pdf"

export const runtime = "nodejs"

/** Carta de autorización de retiro PARCIAL de cesantías (dirigida al fondo). Solo el CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  const { id } = await params
  const sol = await getSolicitudCesantias(id)
  if (!sol) return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 })
  if (sol.estado !== "aprobada") return NextResponse.json({ error: "La carta solo se emite cuando la solicitud está aprobada." }, { status: 400 })

  const empleado = await getEmpleadoById(sol.empleado_id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarCartaRetiroParcialPDF(
    { nombre: empleado.nombre, cedula: empleado.cedula, fondo_cesantias: empleado.fondo_cesantias },
    { valorSolicitado: Number(sol.valor) || 0, inversion: inversionDeCausal(sol.causal) },
  )
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="carta-retiro-parcial-cesantias-${empleado.cedula}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
