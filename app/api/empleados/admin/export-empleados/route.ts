import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpleados } from "@/lib/empleados/queries"
import { generarEmpleadosActivosPDF } from "@/lib/empleados/empleados-pdf"

export const runtime = "nodejs"

/** PDF con los empleados activos (nombre, correo, celular, dirección). Solo CEO. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const empleados = (await listEmpleados())
    .filter((e) => e.estado === "activo")
    .map((e) => ({ cedula: e.cedula, nombre: e.nombre, email: e.email, telefono: e.telefono, direccion: e.direccion }))

  const bytes = await generarEmpleadosActivosPDF(empleados)
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="empleados-activos-${hoy}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
