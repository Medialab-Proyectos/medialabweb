import Link from "next/link"
import { ArrowLeft, CalendarClock } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { AusenciasClient } from "./ausencias-client"

export const dynamic = "force-dynamic"

export default async function AusenciasPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <CalendarClock size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Vacaciones y ausencias</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Solicita vacaciones, permisos o licencias. Tu líder las aprueba o rechaza.
        </p>
        <AusenciasClient />
      </main>
    </>
  )
}
