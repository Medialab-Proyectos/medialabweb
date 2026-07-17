import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { generarCertificadoPDF } from "@/lib/empleados/certificado-pdf"
import { esVinculacionPorFactura } from "@/lib/empleados/types"

export const runtime = "nodejs"

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const url = new URL(req.url)
  const pedido = url.searchParams.get("empleado_id")
  // Un empleado solo puede pedir el suyo; el CEO puede pedir el de cualquiera.
  const empleadoId = pedido && s.rol === "ceo" ? pedido : s.sub
  try {
    const [empleado, contratos] = await Promise.all([getEmpleadoById(empleadoId), listContratos(empleadoId)])
    if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

    // Freelance/prestación: certificado SIEMPRE sin valor (solo vinculación y fechas).
    const conValor = url.searchParams.get("valor") === "1" && !esVinculacionPorFactura(empleado.tipo_vinculacion)

    const bytes = await generarCertificadoPDF(
      {
        nombre: empleado.nombre,
        cedula: empleado.cedula,
        cargo: empleado.cargo,
        fecha_ingreso: empleado.fecha_ingreso,
        fecha_egreso: empleado.fecha_egreso,
        estado: empleado.estado,
      },
      contratos,
      { conValor },
    )
    const nombreArchivo = `certificado-laboral-${empleado.cedula}${conValor ? "-con-valor" : ""}.pdf`
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr la migración de contratos (schema-fase3) en Supabase." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}
