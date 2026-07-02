import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getPrima } from "@/lib/empleados/contrato-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarPrimaPDF } from "@/lib/empleados/prima-pdf"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const p = await getPrima(id)
  if (!p) return NextResponse.json({ error: "Prima no encontrada." }, { status: 404 })

  // Solo el dueño (y publicada) o el CEO pueden descargarla.
  if (s.rol !== "ceo") {
    if (p.empleado_id !== s.sub || !p.publicado) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 })
    }
  }

  const empleado = await getEmpleadoById(p.empleado_id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarPrimaPDF(p, { nombre: empleado.nombre, cedula: empleado.cedula, cargo: empleado.cargo })
  const nombreArchivo = `prima-${p.anio}-S${p.semestre}-${empleado.cedula}.pdf`

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
