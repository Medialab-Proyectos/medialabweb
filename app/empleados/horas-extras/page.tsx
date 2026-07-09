import Link from "next/link"
import { ArrowLeft, Timer } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { HorasExtrasClient } from "./horas-extras-client"

export const dynamic = "force-dynamic"

export default async function HorasExtrasPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <Timer size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Horas extra</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Reporta las horas extra que trabajaste durante el mes. Tu líder las aprueba y se pagan en la nómina.
        </p>
        <HorasExtrasClient />
      </main>
    </>
  )
}
