import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getLiquidacion, reabrirLiquidacion } from "@/lib/empleados/liquidacion-queries"
import { anularEgresoLiquidacion } from "@/lib/empleados/contabilidad-queries"
import { getEmpleadoById, actualizarEmpleado } from "@/lib/empleados/queries"

export const runtime = "nodejs"

/**
 * Reliquidar: reabre una liquidación generada. La vuelve a 'borrador', anula el egreso que
 * quedó en contabilidad y reactiva al empleado (si estaba 'terminado'). SOLO el CEO.
 * Después el CEO recalcula y la vuelve a generar.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  const { id } = await params
  const l = await getLiquidacion(id)
  if (!l) return NextResponse.json({ error: "Liquidación no encontrada." }, { status: 404 })
  if (l.estado !== "generada") {
    return NextResponse.json({ error: "Esta liquidación no está generada; edítala directamente." }, { status: 409 })
  }

  try {
    // 1) Anular el egreso en contabilidad.
    let contab: { borrados: number; habiaPagado: boolean } = { borrados: 0, habiaPagado: false }
    try {
      contab = await anularEgresoLiquidacion(l.empleado_id)
    } catch {
      // Contabilidad opcional: si falla, seguimos reabriendo (el CEO lo ajusta a mano).
    }

    // 2) Reactivar al empleado si el vínculo se había cerrado.
    const empleado = await getEmpleadoById(l.empleado_id)
    if (empleado && empleado.estado === "terminado") {
      await actualizarEmpleado(l.empleado_id, { estado: "activo", fecha_egreso: null })
    }

    // 3) Reabrir la liquidación a borrador.
    const liquidacion = await reabrirLiquidacion(id)

    const aviso = contab.habiaPagado
      ? "El egreso de la liquidación ya estaba marcado como pagado en contabilidad y se eliminó: revisa el saldo de la cuenta."
      : undefined
    return NextResponse.json({ liquidacion, egresosAnulados: contab.borrados, aviso })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al reabrir la liquidación."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
