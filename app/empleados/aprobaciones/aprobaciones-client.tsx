"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Check, X, Clock, CheckCircle2, XCircle } from "lucide-react"
import { type SolicitudAusencia, TIPO_AUSENCIA_LABEL, ESTADO_AUSENCIA_LABEL } from "@/lib/empleados/ausencia"

type Sol = SolicitudAusencia & { empleado: { nombre: string; cedula: string } | null }

const estadoStyle: Record<string, string> = {
  pendiente: "bg-amber-400/10 text-amber-300",
  aprobada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
}
const EstadoIcon = { pendiente: Clock, aprobada: CheckCircle2, rechazada: XCircle }

export function AprobacionesClient() {
  const [sols, setSols] = useState<Sol[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [procesando, setProcesando] = useState<string | null>(null)
  const [decision, setDecision] = useState<{ id: string; estado: "aprobada" | "rechazada" } | null>(null)
  const [comentario, setComentario] = useState("")

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch("/api/empleados/aprobaciones")
      const data = await res.json()
      if (res.ok) setSols(data.solicitudes ?? [])
      else setError(data.error || "Error al cargar.")
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const pendientes = useMemo(() => sols.filter((s) => s.estado === "pendiente"), [sols])
  const decididas = useMemo(() => sols.filter((s) => s.estado !== "pendiente"), [sols])

  function abrirDecision(id: string, estado: "aprobada" | "rechazada") {
    setError("")
    setDecision({ id, estado })
    setComentario("")
  }
  function cancelarDecision() {
    setDecision(null)
    setComentario("")
  }

  async function confirmarDecision() {
    if (!decision) return
    const { id, estado } = decision
    setProcesando(id)
    try {
      const res = await fetch(`/api/empleados/ausencias/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, comentario: comentario.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDecision(null); setComentario("")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la decisión.")
    } finally { setProcesando(null) }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Pendientes ({pendientes.length})</h2>
        {cargando ? (
          <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
        ) : pendientes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No hay solicitudes pendientes.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {pendientes.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{s.empleado?.nombre ?? "—"}</p>
                    <p className="text-xs text-[#fff]/55">{TIPO_AUSENCIA_LABEL[s.tipo]} · {s.dias_habiles} días háb. · {s.fecha_inicio} → {s.fecha_fin}</p>
                    {s.motivo && <p className="mt-1 text-xs text-[#fff]/45">Motivo: {s.motivo}</p>}
                  </div>
                  {decision?.id !== s.id && (
                    <div className="flex gap-2">
                      <button onClick={() => abrirDecision(s.id, "aprobada")} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
                        <Check size={13} /> Aprobar
                      </button>
                      <button onClick={() => abrirDecision(s.id, "rechazada")} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25 disabled:opacity-50">
                        <X size={13} /> Rechazar
                      </button>
                    </div>
                  )}
                </div>

                {decision?.id === s.id && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50">
                      {decision.estado === "rechazada" ? "Motivo del rechazo (opcional)" : "Comentario para el empleado (opcional)"}
                    </label>
                    <textarea
                      rows={2}
                      autoFocus
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder={decision.estado === "rechazada" ? "Ej: no hay cobertura del equipo en esas fechas." : "Notas o condiciones de la aprobación."}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={confirmarDecision}
                        disabled={procesando === s.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                          decision.estado === "rechazada"
                            ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                            : "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                        }`}
                      >
                        {procesando === s.id ? <Loader2 size={13} className="animate-spin" /> : decision.estado === "rechazada" ? <X size={13} /> : <Check size={13} />}
                        {decision.estado === "rechazada" ? "Confirmar rechazo" : "Confirmar aprobación"}
                      </button>
                      <button onClick={cancelarDecision} disabled={procesando === s.id} className="rounded-lg px-3 py-2 text-xs text-[#fff]/60 hover:text-[#fff] disabled:opacity-50">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {decididas.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Decididas</h2>
          <div className="flex flex-col gap-2">
            {decididas.map((s) => {
              const Icon = EstadoIcon[s.estado]
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm">{s.empleado?.nombre ?? "—"} · {TIPO_AUSENCIA_LABEL[s.tipo]}</p>
                    <p className="text-xs text-[#fff]/45">{s.fecha_inicio} → {s.fecha_fin} · {s.dias_habiles} días{s.comentario ? ` · "${s.comentario}"` : ""}</p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[s.estado]}`}>
                    <Icon size={11} /> {ESTADO_AUSENCIA_LABEL[s.estado]}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
