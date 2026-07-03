import Link from "next/link"
import { ArrowLeft, Target } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listRecibidas } from "@/lib/empleados/evaluacion-queries"
import { COMPETENCIAS, ratingLabel, periodoLabel, type Competencias } from "@/lib/empleados/evaluacion"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

export default async function EvaluacionesEmpleadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  let evaluaciones: Awaited<ReturnType<typeof listRecibidas>> = []
  let sinConfigurar = false
  try {
    evaluaciones = await listRecibidas(sesion.sub, true)
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
          <Target size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Mis evaluaciones</h1>
        </div>

        {sinConfigurar ? (
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-6 py-10 text-center text-sm text-amber-200/90">
            La sección aún no está habilitada. (En Supabase, corre <code className="mx-1 rounded bg-black/30 px-1">NOTIFY pgrst, 'reload schema';</code> si la tabla existe.)
          </div>
        ) : evaluaciones.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-[#fff]/55">
            Aún no tienes evaluaciones publicadas. Cuando tu líder complete una, aparecerá aquí.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {evaluaciones.map((e) => {
              const comp = (e.puntajes?.competencias as Competencias) ?? {}
              const global = e.puntajes?.global ?? 0
              return (
                <div key={e.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#fff]">{periodoLabel(e.periodo)}</p>
                      <p className="text-xs text-[#fff]/50">Evaluado por {e.evaluador?.nombre ?? "tu líder"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-[var(--cyan)]">{global}<span className="text-sm text-[#fff]/40">/5</span></p>
                      <p className="text-[11px] text-[#fff]/50">{ratingLabel(global)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-white/10 pt-3 sm:grid-cols-2">
                    {COMPETENCIAS.map((c) => (
                      <div key={c.clave} className="flex items-center justify-between text-sm">
                        <span className="text-[#fff]/60">{c.etiqueta}</span>
                        <span className="font-semibold text-[#fff]">{comp[c.clave] ? `${comp[c.clave]}/5` : "—"}</span>
                      </div>
                    ))}
                  </div>
                  {(e.puntos_criticos || e.puntos_mejora || e.comentarios) && (
                    <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm text-[#fff]/70">
                      {e.puntos_criticos && <p><b className="text-[#fff]/90">Fortalezas:</b> {e.puntos_criticos}</p>}
                      {e.puntos_mejora && <p><b className="text-[#fff]/90">Áreas de mejora:</b> {e.puntos_mejora}</p>}
                      {e.comentarios && <p><b className="text-[#fff]/90">Plan de acción:</b> {e.comentarios}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
