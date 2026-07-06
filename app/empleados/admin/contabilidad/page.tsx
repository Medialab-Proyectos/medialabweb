import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { ContabilidadClient } from "./contabilidad-client"

export const dynamic = "force-dynamic"

export default async function AdminContabilidadPage() {
  const sesion = await requireCEO()
  const ceo = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <ContabilidadClient />
      </main>
    </>
  )
}
