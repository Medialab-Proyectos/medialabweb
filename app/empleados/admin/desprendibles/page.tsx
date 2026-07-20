import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { DesprendiblesAdminClient } from "./desprendibles-admin-client"

export const dynamic = "force-dynamic"

export default async function AdminDesprendiblesPage() {
  const sesion = await requireCEO()
  const [ceo, empleados] = await Promise.all([getEmpleadoById(sesion.sub), listEmpleados()])

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver a administración
        </Link>
        <DesprendiblesAdminClient empleados={empleados} />
      </main>
    </>
  )
}
