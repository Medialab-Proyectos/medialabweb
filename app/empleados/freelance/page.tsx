import { redirect } from "next/navigation"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { FreelanceClient } from "./freelance-client"

export const dynamic = "force-dynamic"

export default async function FreelancePage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  if (!empleado) redirect("/empleados")
  // Solo freelancers usan este módulo.
  if (empleado.tipo_vinculacion !== "freelance") redirect("/empleados/inicio")

  return (
    <>
      <PortalHeader nombre={empleado.nombre} rol={empleado.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <FreelanceClient nombre={empleado.nombre} />
      </main>
    </>
  )
}
