import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById, getConvenioEmpleado } from "@/lib/empleados/queries"

export const runtime = "nodejs"

/** GET: el empleado descarga su propio convenio/contrato adjunto. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const empleado = await getEmpleadoById(s.sub)
  if (!empleado?.convenio_path) return NextResponse.json({ error: "Sin convenio adjunto." }, { status: 404 })

  const { bytes, mime } = await getConvenioEmpleado(empleado.convenio_path)
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename="convenio-${empleado.cedula}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
