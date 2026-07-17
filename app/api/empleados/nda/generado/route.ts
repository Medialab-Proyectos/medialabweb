import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
import { generarNdaPDF } from "@/lib/empleados/nda-pdf"

export const runtime = "nodejs"

/** PDF del Acuerdo de Confidencialidad para firmar. El empleado descarga el suyo (o el CEO el de otro). */
export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  const pedido = new URL(req.url).searchParams.get("empleado_id")
  const empleadoId = pedido && s.rol === "ceo" ? pedido : s.sub

  const empleado = await getEmpleadoById(empleadoId)
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const bytes = await generarNdaPDF({
    nombre: empleado.nombre,
    cedula: empleado.cedula,
    esColaborador: esVinculacionPorFactura(empleado.tipo_vinculacion ?? "empleado"),
  })
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="acuerdo-confidencialidad-${empleado.cedula}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
