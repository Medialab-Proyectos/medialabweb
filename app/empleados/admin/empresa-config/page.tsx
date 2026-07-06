import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { ModuleNav } from "../module-nav"
import { EmpresaConfigClient } from "./empresa-config-client"

export const dynamic = "force-dynamic"

export default async function AdminEmpresaConfigPage() {
  const sesion = await requireCEO()
  const ceo = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <ModuleNav active="talento" />
        <EmpresaConfigClient />
      </main>
    </>
  )
}
