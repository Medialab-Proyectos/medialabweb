import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { HorarioClient } from "./horario-client"

export const dynamic = "force-dynamic"

export default async function HorarioPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <Clock size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Mi horario</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Registra tu horario de lunes a viernes (con tu hora de almuerzo). Tu líder lo aprueba y, solo entonces, entra en vigencia.
        </p>
        <HorarioClient />
      </main>
    </>
  )
}
