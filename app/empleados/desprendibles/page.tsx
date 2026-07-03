import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { listDesprendiblesEmpleado } from "@/lib/empleados/desprendible-queries"
import { MESES, formatCOP, totales } from "@/lib/empleados/desprendible"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

export default async function DesprendiblesEmpleadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  let desprendibles: Awaited<ReturnType<typeof listDesprendiblesEmpleado>> = []
  let sinConfigurar = false
  try {
    desprendibles = await listDesprendiblesEmpleado(sesion.sub, true)
  } catch {
    sinConfigurar = true
  }

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/pagos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver a Desprendibles
        </Link>
        <div className="mb-8 flex items-center gap-2.5">
          <FileText size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Desprendibles de pago</h1>
        </div>

        {sinConfigurar ? (
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-6 py-10 text-center text-sm text-amber-200/90">
            La sección de desprendibles aún no está habilitada. (Falta correr la migración
            <code className="mx-1 rounded bg-black/30 px-1">schema-fase2-desprendibles.sql</code> en Supabase.)
          </div>
        ) : desprendibles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-[#fff]/55">
            Aún no hay desprendibles disponibles. Cuando se publiquen, aparecerán aquí para descargar.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {desprendibles.map((d) => {
              const { neto } = totales(d)
              return (
                <div key={d.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                  <div>
                    <p className="font-semibold text-[#fff]">{MESES[(d.mes || 1) - 1]} {d.anio}</p>
                    <p className="text-xs text-[#fff]/50">{d.cargo || "—"} · Neto {formatCOP(neto)}</p>
                  </div>
                  <a
                    href={`/api/empleados/desprendibles/${d.id}/pdf`}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110"
                  >
                    <Download size={15} /> Descargar PDF
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
