import Link from "next/link"
import { ArrowLeft, Download, PiggyBank } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listCesantiasEmpleado } from "@/lib/empleados/contrato-queries"
import { formatCOP } from "@/lib/empleados/desprendible"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

export default async function CesantiasEmpleadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  let cesantias: Awaited<ReturnType<typeof listCesantiasEmpleado>> = []
  let sinConfigurar = false
  try {
    cesantias = await listCesantiasEmpleado(sesion.sub, true)
  } catch {
    sinConfigurar = true
  }

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-8 flex items-center gap-2.5">
          <PiggyBank size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Cesantías</h1>
        </div>

        {sinConfigurar ? (
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-6 py-10 text-center text-sm text-amber-200/90">
            La sección aún no está habilitada. (Falta correr <code className="mx-1 rounded bg-black/30 px-1">schema-fase5-cesantias.sql</code> en Supabase.)
          </div>
        ) : cesantias.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-[#fff]/55">
            Aún no hay cesantías publicadas. Cuando se liquiden, aparecerán aquí para descargar.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cesantias.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <div>
                  <p className="font-semibold text-[#fff]">Cesantías {c.anio}</p>
                  <p className="text-xs text-[#fff]/50">
                    Fondo {c.fondo || "—"} · Total {formatCOP((Number(c.cesantias) || 0) + (Number(c.intereses) || 0))}
                  </p>
                </div>
                <a
                  href={`/api/empleados/cesantias/${c.id}/pdf`}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110"
                >
                  <Download size={15} /> Descargar PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
