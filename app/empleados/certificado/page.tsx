import Link from "next/link"
import { ArrowLeft, BadgeCheck, Download, FileText } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

export default async function CertificadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <BadgeCheck size={20} className="text-[var(--magenta)]" />
          <h1 className="font-display text-2xl font-bold">Certificado laboral</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Genera tu certificación laboral con tus fechas de vinculación, el historial de contratos y tu cargo.
          Elige si quieres que incluya tu asignación salarial.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/api/empleados/certificado?valor=0"
            className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[var(--cyan)]/40 hover:bg-white/[0.06]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--cyan)]/15">
              <FileText size={20} className="text-[var(--cyan)]" />
            </span>
            <h3 className="text-base font-semibold">Sin valor salarial</h3>
            <p className="text-sm text-[#fff]/55">Certifica tu vinculación y cargo, sin mencionar el salario.</p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cyan)]">
              <Download size={15} /> Descargar
            </span>
          </a>

          <a
            href="/api/empleados/certificado?valor=1"
            className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[var(--magenta)]/40 hover:bg-white/[0.06]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--magenta)]/15">
              <BadgeCheck size={20} className="text-[var(--magenta)]" />
            </span>
            <h3 className="text-base font-semibold">Con valor salarial</h3>
            <p className="text-sm text-[#fff]/55">Incluye tu asignación mensual (para bancos, arriendos, visas…).</p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--magenta)]">
              <Download size={15} /> Descargar
            </span>
          </a>
        </div>

        <p className="mt-8 text-xs text-[#fff]/40">
          El certificado se genera con tus datos actuales y el historial de contratos registrado. Si algo no
          coincide, avísale a Recursos Humanos.
        </p>
      </main>
    </>
  )
}
