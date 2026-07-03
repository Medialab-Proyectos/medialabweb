import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Target } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById, listReportes } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { EvaluarClient } from "./evaluar-client"

export const dynamic = "force-dynamic"

export default async function EvaluarPage() {
  const sesion = await requireEmpleado()
  const esCEO = sesion.rol === "ceo"
  const [empleado, reportes] = await Promise.all([
    getEmpleadoById(sesion.sub),
    esCEO ? Promise.resolve([]) : listReportes(sesion.sub),
  ])
  if (!esCEO && reportes.length === 0) redirect("/empleados/inicio")

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <Target size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Evaluación de desempeño</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Evalúa a {esCEO ? "tu equipo y líderes" : "las personas a tu cargo"} cada trimestre. Califica de 1 a 5 y deja recomendaciones.
        </p>
        <EvaluarClient />
      </main>
    </>
  )
}
