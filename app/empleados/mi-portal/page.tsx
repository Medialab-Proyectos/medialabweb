import { redirect } from "next/navigation"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { ModuleNav } from "../admin/module-nav"
import { PortalHeader } from "../portal-header"
import { CambiarClaveCard } from "../cambiar-clave-card"
import { PortalGrid } from "../portal-grid"

export const dynamic = "force-dynamic"

/** Portal personal del colaborador. Para el CEO es una opción de menú (su inicio es el panel de decisiones). */
export default async function MiPortalPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  if (!empleado) redirect("/empleados")

  return (
    <>
      <PortalHeader nombre={empleado.nombre} rol={empleado.rol} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {empleado.rol === "ceo" && <ModuleNav active="empleado" />}
        <div className="mb-8">
          <p className="text-sm text-[#fff]/50">Mi portal</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{empleado.nombre}</h1>
          <p className="mt-1 text-sm text-[#fff]/60">{empleado.cargo || "Colaborador"}</p>
        </div>
        <CambiarClaveCard obligatorio={empleado.must_change_password} />
        <PortalGrid rol={empleado.rol} tipoVinculacion={empleado.tipo_vinculacion} />
      </main>
    </>
  )
}
