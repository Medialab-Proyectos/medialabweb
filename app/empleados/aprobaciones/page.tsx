import Link from "next/link"
import { ArrowLeft, ClipboardCheck } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById, listReportes } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { AprobacionesClient } from "./aprobaciones-client"

export const dynamic = "force-dynamic"

export default async function AprobacionesPage() {
  const sesion = await requireEmpleado()
  const esCEO = sesion.rol === "ceo"
  const [empleado, reportes] = await Promise.all([
    getEmpleadoById(sesion.sub),
    esCEO ? Promise.resolve([]) : listReportes(sesion.sub),
  ])
  const sinEquipo = !esCEO && reportes.length === 0

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <ClipboardCheck size={20} className="text-[var(--magenta)]" />
          <h1 className="font-display text-2xl font-bold">Aprobaciones</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Revisa y decide las solicitudes de ausencia y las horas extra de {esCEO ? "todo el equipo" : "las personas a tu cargo"}.
        </p>

        {sinEquipo ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-[#fff]/60">
            <p className="font-medium text-[#fff]/80">Aún no tienes personas a tu cargo.</p>
            <p className="mt-1 text-[#fff]/55">
              Cada empleado se asigna a un líder en su <b className="text-[#fff]/75">Contrato</b> (campo “Líder / a quién reporta”).
              Cuando alguien te tenga como líder, sus solicitudes aparecerán aquí.
            </p>
          </div>
        ) : (
          <AprobacionesClient esCEO={esCEO} />
        )}
      </main>
    </>
  )
}
