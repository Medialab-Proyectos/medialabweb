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
      <main className="mx-auto max-w-3xl px-6 py-10">
        <CesantiasAdminClient empleados={empleados} />
      </main>
    </>
  )
}
