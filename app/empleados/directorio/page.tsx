import Link from "next/link"
import { ArrowLeft, Contact } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { DirectorioClient } from "./directorio-client"

export const dynamic = "force-dynamic"

export default async function DirectorioPage() {
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
          <Contact size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Directorio de contactos</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Contactos de las empresas aliadas en la gestión (contador, medicina prepagada, ARL…).
        </p>
        <DirectorioClient esCEO={sesion.rol === "ceo"} />
      </main>
    </>
  )
}
