import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listCuentas } from "@/lib/empleados/contabilidad-queries"
import { PortalHeader } from "../../../portal-header"
import { RecurrentesClient } from "./recurrentes-client"

export const dynamic = "force-dynamic"

export default async function RecurrentesPage() {
  const sesion = await requireCEO()
  const [ceo, cuentas] = await Promise.all([getEmpleadoById(sesion.sub), listCuentas().catch(() => [])])

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <RecurrentesClient cuentas={cuentas} />
      </main>
    </>
  )
}
