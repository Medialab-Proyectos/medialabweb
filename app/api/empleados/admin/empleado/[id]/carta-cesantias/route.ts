import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarCartaRetiroCesantiasPDF } from "@/lib/empleados/carta-cesantias-pdf"

export const runtime = "nodejs"

/** Carta de retiro TOTAL de cesantías (terminación) dirigida al fondo. Solo el CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  const { id } = await params
  const empleado = await getEmpleadoById(id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarCartaRetiroCesantiasPDF({
    nombre: empleado.nombre,
    cedula: empleado.cedula,
    fondo_cesantias: empleado.fondo_cesantias,
    fecha_egreso: empleado.fecha_egreso,
  })
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="carta-retiro-cesantias-${empleado.cedula}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
