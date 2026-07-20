import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
import { PortalHeader } from "../../portal-header"
import { IngresosRetencionesAdminClient } from "./ingresos-retenciones-client"

export const dynamic = "force-dynamic"

export default async function IngresosRetencionesAdminPage() {
  const sesion = await requireCEO()
  const [ceo, empleados] = await Promise.all([getEmpleadoById(sesion.sub), listEmpleados()])
  // Aplica a empleados laborales (los que declaran ingresos y retenciones).
  const laborales = empleados.filter((e) => !esVinculacionPorFactura(e.tipo_vinculacion))

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <IngresosRetencionesAdminClient empleados={laborales} />
      </main>
    </>
  )
}
