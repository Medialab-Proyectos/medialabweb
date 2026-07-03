import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getCesantias } from "@/lib/empleados/contrato-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarCesantiasPDF } from "@/lib/empleados/cesantias-pdf"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const c = await getCesantias(id)
  if (!c) return NextResponse.json({ error: "Cesantías no encontradas." }, { status: 404 })

  if (s.rol !== "ceo" && (c.empleado_id !== s.sub || !c.publicado)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  const empleado = await getEmpleadoById(c.empleado_id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarCesantiasPDF(c, { nombre: empleado.nombre, cedula: empleado.cedula, cargo: empleado.cargo })
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cesantias-${c.anio}-${empleado.cedula}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
