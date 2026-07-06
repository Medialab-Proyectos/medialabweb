import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { contarFacturasPorPagar } from "@/lib/empleados/freelance-queries"
import { contarAusenciasPendientes } from "@/lib/empleados/ausencia-queries"
import { contarCuentasCobroPorPasar } from "@/lib/empleados/cuenta-cobro-queries"

export const runtime = "nodejs"

/** Conteos de pendientes para las cajas de alerta del CEO. Nunca falla por tabla faltante. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ facturasPorPagar: 0, ausenciasPendientes: 0, cuentasCobroPorPasar: 0 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const [facturasPorPagar, ausenciasPendientes, cuentasCobroPorPasar] = await Promise.all([
    contarFacturasPorPagar().catch(() => 0),
    contarAusenciasPendientes().catch(() => 0),
    contarCuentasCobroPorPasar().catch(() => 0),
  ])
  return NextResponse.json({ facturasPorPagar, ausenciasPendientes, cuentasCobroPorPasar })
}
