import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ClipboardCheck } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados, listReportes } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { AprobacionesClient } from "./aprobaciones-client"

export const dynamic = "force-dynamic"

export default async function AprobacionesPage() {
  const sesion = await requireEmpleado()
  const esCEO = sesion.rol === "ceo"
  const [empleado, reportes, empleados] = await Promise.all([
    getEmpleadoById(sesion.sub),
    esCEO ? Promise.resolve([]) : listReportes(sesion.sub),
    esCEO ? listEmpleados() : Promise.resolve([]),
  ])
  // Solo el CEO o quien tenga personas a cargo entra aquí.
  if (!esCEO && reportes.length === 0) redirect("/empleados/inicio")

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <ClipboardCheck size={20} className="text-[var(--magenta)]" />
          <h1 className="font-display text-2xl font-bold">Aprobaciones de ausencias</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Revisa y decide las solicitudes de {esCEO ? "todo el equipo" : "las personas a tu cargo"}.
        </p>
        <AprobacionesClient esCEO={esCEO} empleados={empleados.map((e) => ({ id: e.id, nombre: e.nombre, cedula: e.cedula }))} />
      </main>
    </>
  )
}
