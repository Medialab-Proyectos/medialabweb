import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { getLiquidacionDeEmpleado } from "@/lib/empleados/liquidacion-queries"
import { generarLiquidacionPDF } from "@/lib/empleados/liquidacion-pdf"

export const runtime = "nodejs"

/** PDF de la liquidación de un empleado (buscada por empleado_id). Solo el CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  const { id } = await params
  const empleado = await getEmpleadoById(id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })
  const l = await getLiquidacionDeEmpleado(id)
  if (!l) return NextResponse.json({ error: "Este empleado no tiene liquidación." }, { status: 404 })

  const bytes = await generarLiquidacionPDF(l, {
    nombre: empleado.nombre, cedula: empleado.cedula, cargo: empleado.cargo,
    eps: empleado.eps, fondo_pension: empleado.fondo_pension, fondo_cesantias: empleado.fondo_cesantias,
  })
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="liquidacion-${empleado.cedula}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
