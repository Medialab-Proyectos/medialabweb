import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { ModuleNav } from "../module-nav"
import { HerramientasAdminClient } from "./herramientas-admin-client"

export const dynamic = "force-dynamic"

export default async function AdminHerramientasPage() {
  const sesion = await requireCEO()
  const ceo = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <ModuleNav active="talento" />
        <HerramientasAdminClient />
      </main>
    </>
  )
}
