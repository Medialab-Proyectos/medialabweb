import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getLiquidacion } from "@/lib/empleados/liquidacion-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarLiquidacionPDF } from "@/lib/empleados/liquidacion-pdf"

export const runtime = "nodejs"

/** Descarga el PDF de la liquidación. SOLO el CEO — el empleado nunca la ve. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const { id } = await params
  const l = await getLiquidacion(id)
  if (!l) return NextResponse.json({ error: "Liquidación no encontrada." }, { status: 404 })

  const empleado = await getEmpleadoById(l.empleado_id)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarLiquidacionPDF(l, {
    nombre: empleado.nombre, cedula: empleado.cedula, cargo: empleado.cargo,
    eps: empleado.eps, fondo_pension: empleado.fondo_pension, fondo_cesantias: empleado.fondo_cesantias,
  })
  const nombreArchivo = `liquidacion-${empleado.cedula}.pdf`

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
