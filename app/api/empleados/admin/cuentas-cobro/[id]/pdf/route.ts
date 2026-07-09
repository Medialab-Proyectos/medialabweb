import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getCuentaCobro } from "@/lib/empleados/cuenta-cobro-queries"
import { getEmpresa, getCuenta } from "@/lib/empleados/contabilidad-queries"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { generarCuentaCobroPDF, type DatosCuentaCobroPDF } from "@/lib/empleados/cuenta-cobro-pdf"

export const runtime = "nodejs"

/** Descarga el PDF de la cuenta de cobro. Solo el CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const { id } = await params
  const cc = await getCuentaCobro(id)
  if (!cc) return NextResponse.json({ error: "Cuenta de cobro no encontrada." }, { status: 404 })

  const [empresa, cuenta, emisorEmp] = await Promise.all([
    cc.empresa_id ? getEmpresa(cc.empresa_id) : Promise.resolve(null),
    cc.cuenta_id ? getCuenta(cc.cuenta_id) : Promise.resolve(null),
    cc.emisor === "personal" && cc.creado_por ? getEmpleadoById(cc.creado_por) : Promise.resolve(null),
  ])

  const datos: DatosCuentaCobroPDF = {
    empresa: empresa ? { nombre: empresa.nombre, nit: empresa.nit, direccion: empresa.direccion, ciudad: empresa.ciudad } : null,
    cuenta: cuenta ? { nombre: cuenta.nombre, plataforma: cuenta.plataforma, banco: cuenta.banco, numero_cuenta: cuenta.numero_cuenta, moneda: cuenta.moneda } : null,
    emisorPersonal: emisorEmp ? { nombre: emisorEmp.nombre, cedula: emisorEmp.cedula } : null,
  }

  const bytes = await generarCuentaCobroPDF(cc, datos)
  const nombreArchivo = `cuenta-cobro-${cc.numero || cc.id.slice(0, 8)}.pdf`
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
