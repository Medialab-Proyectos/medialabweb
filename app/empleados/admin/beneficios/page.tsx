import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { BeneficiosAdminClient } from "./beneficios-admin-client"
import { ModuleNav } from "../module-nav"

export const dynamic = "force-dynamic"

export default async function AdminBeneficiosPage() {
  const sesion = await requireCEO()
  const ceo = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <ModuleNav active="talento" />
        <BeneficiosAdminClient />
      </main>
    </>
  )
}
