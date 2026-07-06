import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getFactura } from "@/lib/empleados/freelance-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarFacturaFreelancePDF } from "@/lib/empleados/factura-freelance-pdf"

export const runtime = "nodejs"

/** Descarga la factura del freelance en PDF. Dueño (freelancer) o CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const factura = await getFactura(id)
  if (!factura) return NextResponse.json({ error: "Factura no encontrada." }, { status: 404 })
  if (s.rol !== "ceo" && factura.empleado_id !== s.sub) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  const emp = await getEmpleadoById(factura.empleado_id)
  if (!emp) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarFacturaFreelancePDF(factura, { nombre: emp.nombre, cedula: emp.cedula })
  const nombreArchivo = `factura-${factura.numero || `${factura.anio}-${factura.mes}`}-${emp.cedula}.pdf`
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
