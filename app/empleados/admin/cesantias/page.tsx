import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { CesantiasAdminClient } from "./cesantias-admin-client"

export const dynamic = "force-dynamic"

export default async function AdminCesantiasPage() {
  const sesion = await requireCEO()
  const [ceo, empleados] = await Promise.all([getEmpleadoById(sesion.sub), listEmpleados()])

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <CesantiasAdminClient empleados={empleados} />
      </main>
    </>
  )
}
