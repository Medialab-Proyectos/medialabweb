import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { PrimasAdminClient } from "./primas-admin-client"

export const dynamic = "force-dynamic"

export default async function PrimasAdminPage() {
  const sesion = await requireCEO()
  const [empleado, empleados] = await Promise.all([getEmpleadoById(sesion.sub), listEmpleados()])

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <PrimasAdminClient empleados={empleados} />
      </main>
    </>
  )
}
