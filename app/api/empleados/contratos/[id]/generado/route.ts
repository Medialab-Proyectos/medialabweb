import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getContrato, listContratos } from "@/lib/empleados/contrato-queries"
import { getEmpleadoById, getConfigEmpresa } from "@/lib/empleados/queries"
import { getRolFunciones } from "@/lib/empleados/roles-funciones-queries"
import { generarContratoPDF } from "@/lib/empleados/contrato-pdf"

export const runtime = "nodejs"

/** GET: genera el PDF del contrato/otrosí (para descargar y firmar). Dueño o CEO. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  const { id } = await params
  const contrato = await getContrato(id)
  if (!contrato) return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 })
  if (s.rol !== "ceo" && contrato.empleado_id !== s.sub) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  const [empleado, config, funcionesRol] = await Promise.all([
    getEmpleadoById(contrato.empleado_id),
    getConfigEmpresa().catch(() => ({ caja_compensacion: null, arl: null })),
    contrato.rol_funciones_id ? getRolFunciones(contrato.rol_funciones_id).catch(() => null) : Promise.resolve(null),
  ])
  if (!empleado) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  // Para un otrosí: fecha del contrato original (el inicial firmado) para la narrativa.
  let fechaOriginal: string | null = null
  if (contrato.tipo === "otrosi") {
    try {
      const todos = await listContratos(contrato.empleado_id)
      const inicial = todos.find((c) => c.tipo === "inicial")
      fechaOriginal = inicial?.fecha_ingreso ?? inicial?.vigente_desde ?? null
    } catch { /* opcional */ }
  }

  try {
    const bytes = await generarContratoPDF(
      { nombre: empleado.nombre, cedula: empleado.cedula, direccion: empleado.direccion, telefono: empleado.telefono, email: empleado.email },
      contrato,
      { arl: config.arl, caja: config.caja_compensacion, funciones: funcionesRol?.funciones ?? [], fechaOriginal },
    )
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contrato-${contrato.tipo}-${contrato.vigente_desde}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
