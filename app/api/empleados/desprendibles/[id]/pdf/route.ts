import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getDesprendible } from "@/lib/empleados/desprendible-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarDesprendiblePDF } from "@/lib/empleados/desprendible-pdf"
import { MESES } from "@/lib/empleados/desprendible"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const d = await getDesprendible(id)
  if (!d) return NextResponse.json({ error: "Desprendible no encontrado." }, { status: 404 })

  // Solo el dueño (y publicado) o el CEO pueden descargarlo.
  if (s.rol !== "ceo") {
    if (d.empleado_id !== s.sub || !d.publicado) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 })
    }
  }

  const empleado = await getEmpleadoById(d.empleado_id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarDesprendiblePDF(d, { nombre: empleado.nombre, cedula: empleado.cedula })
  const nombreArchivo = `desprendible-${d.anio}-${MESES[(d.mes || 1) - 1]}-${empleado.cedula}.pdf`

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
