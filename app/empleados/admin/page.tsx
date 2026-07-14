import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { AdminClient } from "./admin-client"
import { ModuleNav } from "./module-nav"
import { AlertBoxes } from "./alert-boxes"
import { ActividadWidget } from "./actividad-widget"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const sesion = await requireCEO()
  const [empleado, empleados] = await Promise.all([getEmpleadoById(sesion.sub), listEmpleados()])

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <ModuleNav active="empleados" />
        <AlertBoxes />
        <ActividadWidget />
        <AdminClient inicial={empleados} ceoId={sesion.sub} />
      </main>
    </>
  )
}
