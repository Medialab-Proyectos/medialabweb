import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { listCuentas } from "@/lib/empleados/contabilidad-queries"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
import { PortalHeader } from "../../../portal-header"
import { NominaClient } from "./nomina-client"

export const dynamic = "force-dynamic"

export default async function NominaPage() {
  const sesion = await requireCEO()
  const [ceo, empleados, cuentas] = await Promise.all([
    getEmpleadoById(sesion.sub),
    listEmpleados(),
    listCuentas().catch(() => []),
  ])
  // Nómina = empleados laborales activos (los freelance se pagan por sus facturas).
  const laborales = empleados.filter((e) => e.estado === "activo" && !esVinculacionPorFactura(e.tipo_vinculacion))

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <NominaClient empleados={laborales} cuentas={cuentas} />
      </main>
    </>
  )
}
