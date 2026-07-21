import Link from "next/link"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { CursosClient } from "./cursos-client"

export const dynamic = "force-dynamic"

export default async function CursosPage() {
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
          <GraduationCap size={20} className="text-[#8b5cf6]" />
          <h1 className="font-display text-2xl font-bold">Cursos y formación</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Rutas de estudio y cursos en plataformas externas, abiertos para todo el equipo. Abre el enlace y registra tu avance en la plataforma.
        </p>
        <CursosClient esCEO={sesion.rol === "ceo"} />
      </main>
    </>
  )
}
