"use client"

import { useEffect, useState } from "react"
import { Loader2, Save, Info, CheckCircle2, Clock } from "lucide-react"
import {
  type Horario, type DiaSemana, type DiaHorario, type EstadoHorario,
  DIAS_SEMANA, DIA_LABEL, horarioVacio, horasSemana, minutosDia, validarHorario, normaJornada, ESTADO_HORARIO_LABEL,
} from "@/lib/empleados/horario"

const timeCls = "w-full rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60 disabled:opacity-40"
const fieldLbl = "text-[10px] font-semibold uppercase tracking-wide text-[#fff]/40"

export function HorarioClient() {
  const [horario, setHorario] = useState<Horario>(horarioVacio())
  const [estado, setEstado] = useState<EstadoHorario | null>(null)
  const [tieneLider, setTieneLider] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch("/api/empleados/horario")
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Error al cargar."); return }
      const fuente = data.pendiente ?? data.vigente
      if (fuente?.horario) setHorario(fuente.horario)
      setEstado(fuente?.estado ?? null)
      setTieneLider(!!data.tieneLider)
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  function setDia(d: DiaSemana, campo: keyof DiaHorario, valor: string | boolean) {
    setHorario((h) => ({ ...h, [d]: { ...h[d], [campo]: valor } }))
  }
  function toggleAlmuerzo(d: DiaSemana, on: boolean) {
    setHorario((h) => ({ ...h, [d]: { ...h[d], almuerzoInicio: on ? "12:00" : "", almuerzoFin: on ? "13:00" : "" } }))
  }

  const val = validarHorario(horario)
  const total = horasSemana(horario)

  async function guardar() {
    if (!val.ok) return setError(val.error || "Revisa el horario.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/horario", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horario }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Horario enviado. Tu líder lo revisará; entra en vigencia al aprobarse.")
      setEstado("pendiente")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.")
    } finally { setGuardando(false) }
  }

  if (cargando) return <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>

  return (
    <div className="flex flex-col gap-5">
      {estado && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${estado === "aprobado" ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200" : estado === "pendiente" ? "border-amber-400/25 bg-amber-400/[0.07] text-amber-200" : "border-red-500/25 bg-red-500/[0.07] text-red-300"}`}>
          <CheckCircle2 size={15} className="shrink-0" /> {ESTADO_HORARIO_LABEL[estado]}
        </div>
      )}
      {!tieneLider && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-200">
          <Info size={15} className="mt-0.5 shrink-0" /> No tienes un líder asignado para aprobar tu horario. Contacta a RRHH.
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/85">Lunes a viernes</h2>

        <div className="space-y-2.5">
          {DIAS_SEMANA.map((d) => {
            const day = horario[d]
            const conAlmuerzo = !!(day.almuerzoInicio && day.almuerzoFin)
            return (
              <div key={d} className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={day.activo} onChange={(e) => setDia(d, "activo", e.target.checked)} className="h-4 w-4 accent-[var(--cyan)]" />
                    <span className={day.activo ? "font-medium text-[#fff]/85" : "text-[#fff]/40"}>{DIA_LABEL[d]}</span>
                  </label>
                  {day.activo && <span className="text-[11px] font-medium text-[var(--cyan)]/80">{(minutosDia(day) / 60).toFixed(1)} h</span>}
                </div>

                {day.activo && (
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <label className="flex flex-col gap-1">
                      <span className={fieldLbl}>Entrada</span>
                      <input type="time" value={day.entrada} onChange={(e) => setDia(d, "entrada", e.target.value)} className={timeCls} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={fieldLbl}>Salida</span>
                      <input type="time" value={day.salida} onChange={(e) => setDia(d, "salida", e.target.value)} className={timeCls} />
                    </label>

                    <label className="col-span-2 flex items-center gap-2 text-xs text-[#fff]/60">
                      <input type="checkbox" checked={conAlmuerzo} onChange={(e) => toggleAlmuerzo(d, e.target.checked)} className="h-3.5 w-3.5 accent-[var(--cyan)]" />
                      Incluir hora de almuerzo (no cuenta dentro de la jornada)
                    </label>
                    {conAlmuerzo && (
                      <>
                        <label className="flex flex-col gap-1">
                          <span className={fieldLbl}>Almuerzo desde</span>
                          <input type="time" value={day.almuerzoInicio} onChange={(e) => setDia(d, "almuerzoInicio", e.target.value)} className={timeCls} />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className={fieldLbl}>Almuerzo hasta</span>
                          <input type="time" value={day.almuerzoFin} onChange={(e) => setDia(d, "almuerzoFin", e.target.value)} className={timeCls} />
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Total semanal + validación */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-[#fff]/70"><Clock size={15} className="text-[var(--cyan)]" /> Total semanal (sin almuerzo)</span>
          <span className={`font-display text-lg font-bold ${val.ok ? "text-[var(--cyan)]" : "text-red-300"}`}>{total.toFixed(1)} h <span className="text-xs font-medium text-[#fff]/40">/ {val.cap} h máx.</span></span>
        </div>
        {!val.ok && <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{val.error}</p>}

        <div className="mt-4">
          <button onClick={guardar} disabled={guardando || !val.ok || !tieneLider} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-50 sm:w-auto">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enviar para aprobación
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[#fff]/40">
          <Info size={13} className="mt-0.5 shrink-0" /> {normaJornada()}
        </p>
      </section>
    </div>
  )
}
