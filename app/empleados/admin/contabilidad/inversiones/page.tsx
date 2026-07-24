import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { listCuentas, listMovimientos } from "@/lib/empleados/contabilidad-queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { condicionesVigentesFirmadas, totalMensualContrato } from "@/lib/empleados/contrato"
import { saldoCuenta } from "@/lib/empleados/contabilidad"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
import { PortalHeader } from "../../../portal-header"
import { InversionesClient } from "./inversiones-client"
import type { DatosEstrategia } from "./estrategia-panel"

export const dynamic = "force-dynamic"

export default async function AdminInversionesPage() {
  const sesion = await requireCEO()
  const [ceo, empleados, cuentas, movimientos] = await Promise.all([
    getEmpleadoById(sesion.sub),
    listEmpleados().catch(() => []),
    listCuentas().catch(() => []),
    listMovimientos().catch(() => []),
  ])

  // Caja disponible en COP (solo cuentas activas de la empresa).
  const caja = cuentas
    .filter((c) => c.activa && c.moneda === "COP")
    .reduce((a, c) => a + saldoCuenta(c, movimientos), 0)

  // Costo fijo: devengado laboral (con contrato firmado) + freelance por mes.
  const activos = empleados.filter((e) => e.estado === "activo")
  let devengadoMes = 0
  for (const e of activos.filter((x) => !esVinculacionPorFactura(x.tipo_vinculacion))) {
    const vigente = condicionesVigentesFirmadas(await listContratos(e.id).catch(() => []))
    if (vigente) devengadoMes += totalMensualContrato(vigente)
  }
  const freelanceMes = activos
    .filter((e) => esVinculacionPorFactura(e.tipo_vinculacion) && e.freelance_modo === "por_mes" && e.freelance_moneda === "COP")
    .reduce((a, e) => a + (Number(e.freelance_tarifa) || 0), 0)

  const datos: DatosEstrategia = {
    caja,
    devengadoMes,
    freelanceMes,
    tieneMovimientos: movimientos.some((m) => m.estado === "realizado"),
  }

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <InversionesClient estrategia={datos} />
      </main>
    </>
  )
}
