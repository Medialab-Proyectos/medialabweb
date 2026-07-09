import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { contarFacturasPorPagar } from "@/lib/empleados/freelance-queries"
import { contarAusenciasPendientes, listAusentesHoy } from "@/lib/empleados/ausencia-queries"
import { contarCuentasCobroPorPasar } from "@/lib/empleados/cuenta-cobro-queries"
import { contarPendientesFlujo, contarInversionesPorVencer } from "@/lib/empleados/contabilidad-queries"

export const runtime = "nodejs"

const VACIO = {
  facturasPorPagar: 0, ausenciasPendientes: 0, cuentasCobroPorPasar: 0,
  ausentesHoy: [] as { nombre: string; tipo: string }[], pagosPendientes: 0, cuentasPorCobrar: 0,
  inversionesPorVencer: 0,
}

/** Conteos de pendientes para el panel de decisiones del CEO. Nunca falla por tabla faltante. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json(VACIO)
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const [facturasPorPagar, ausenciasPendientes, cuentasCobroPorPasar, ausentesHoy, flujo, inversionesPorVencer] = await Promise.all([
    contarFacturasPorPagar().catch(() => 0),
    contarAusenciasPendientes().catch(() => 0),
    contarCuentasCobroPorPasar().catch(() => 0),
    listAusentesHoy().catch(() => []),
    contarPendientesFlujo().catch(() => ({ porPagar: 0, porCobrar: 0 })),
    contarInversionesPorVencer().catch(() => 0),
  ])
  return NextResponse.json({
    facturasPorPagar, ausenciasPendientes, cuentasCobroPorPasar,
    ausentesHoy, pagosPendientes: flujo.porPagar, cuentasPorCobrar: flujo.porCobrar,
    inversionesPorVencer,
  })
}
