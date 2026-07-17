"use client"

import { useEffect, useState } from "react"
import { Loader2, Save, Info, CheckCircle2, Clock, Repeat } from "lucide-react"
import {
  type Horario, type DiaSemana, type DiaHorario, type EstadoHorario,
  DIAS_SEMANA, DIA_LABEL, horarioVacio, horasSemana, minutosDia, validarHorario, normaJornada, ESTADO_HORARIO_LABEL,
} from "@/lib/empleados/horario"

const timeCls = "w-full rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60 disabled:opacity-40"
const fieldLbl = "text-[10px] font-semibold uppercase tracking-wide text-[#fff]/40"

/** Resumen legible del horario: "Lun 08:00–17:00 · Mar …" (solo días activos). */
function resumenHorario(h: Horario): string {
  const dias = DIAS_SEMANA.filter((d) => h[d]?.activo).map((d) => `${DIA_LABEL[d].slice(0, 3)} ${h[d].entrada}–${h[d].salida}`)
  return dias.length ? dias.join(" · ") : "Sin días activos"
}

export function HorarioClient() {
  const [horario, setHorario] = useState<Horario>(horarioVacio())
  const [horarioB, setHorarioB] = useState<Horario>(horarioVacio())
  const [alterna, setAlterna] = useState(false)
  const [semana, setSemana] = useState<"A" | "B">("A")
  const [estado, setEstado] = useState<EstadoHorario | null>(null)
  const [motivoRechazo, setMotivoRechazo] = useState<string | null>(null)
  const [tieneLider, setTieneLider] = useState(true)
  const [esLaboral, setEsLaboral] = useState(true)
  const [permitido, setPermitido] = useState(true)
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
      // Prioridad para prellenar el formulario: pendiente → rechazado (para corregir) → vigente.
      const fuente = data.pendiente ?? data.rechazado ?? data.vigente
      if (fuente?.horario) setHorario(fuente.horario)
      setHorarioB(fuente?.horario_b ?? horarioVacio())
      setAlterna(!!fuente?.alterna)
      setEstado(fuente?.estado ?? null)
      setMotivoRechazo(data.rechazado && !data.pendiente ? (data.rechazado.comentario ?? "Sin motivo indicado.") : null)
      setTieneLider(!!data.tieneLider)
      setEsLaboral(data.esLaboral !== false)
      setPermitido(data.permitido !== false)
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  // Semana que se está editando (A siempre; B solo si alterna).
  const editando = semana === "B" && alterna ? horarioB : horario
  const setEditando = semana === "B" && alterna ? setHorarioB : setHorario

  function setDia(d: DiaSemana, campo: keyof DiaHorario, valor: string | boolean) {
    setEditando((h) => ({ ...h, [d]: { ...h[d], [campo]: valor } }))
  }
  function toggleAlmuerzo(d: DiaSemana, on: boolean) {
    setEditando((h) => ({ ...h, [d]: { ...h[d], almuerzoInicio: on ? "12:00" : "", almuerzoFin: on ? "13:00" : "" } }))
  }

  const val = validarHorario(editando, { conNorma: esLaboral })
  const total = horasSemana(editando)
  const valA = validarHorario(horario, { conNorma: esLaboral })
  const valB = validarHorario(horarioB, { conNorma: true })
  // Con una propuesta pendiente NO se puede enviar otra hasta que el líder la resuelva.
  const pendiente = estado === "pendiente"
  // Sin líder no se bloquea: el horario lo aprueba el CEO por defecto.
  const listoParaEnviar = valA.ok && (!alterna || valB.ok) && !pendiente

  async function guardar() {
    if (pendiente) return setError("Ya tienes un horario pendiente de aprobación. Espera la decisión de tu líder antes de enviar otro.")
    if (!valA.ok) { setSemana("A"); return setError(`Semana A · ${valA.error}`) }
    if (alterna && !valB.ok) { setSemana("B"); return setError(`Semana B · ${valB.error}`) }
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/horario", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horario, alterna, horario_b: alterna ? horarioB : null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const nuevoEstado = (data.horario?.estado as EstadoHorario | undefined) ?? "pendiente"
      setEstado(nuevoEstado)
      setMotivoRechazo(null)
      setMsg(nuevoEstado === "aprobado"
        ? "✓ Horario establecido y vigente. Ya apareces en «Actividad ahora» según tu jornada."
        : "✓ Horario enviado. Tu líder lo revisará; entra en vigencia al aprobarse.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.")
    } finally { setGuardando(false) }
  }

  if (cargando) return <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
  if (!permitido) return (
    <p className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-[#fff]/60">
      <Info size={16} className="mt-0.5 shrink-0" /> El registro de horario no está habilitado para tu vínculo. Si crees que deberías tenerlo, contacta a RRHH; el CEO lo activa desde tu contrato.
    </p>
  )

  return (
    <div className="flex flex-col gap-5">
      {estado && (
        <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${estado === "aprobado" ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200" : estado === "pendiente" ? "border-amber-400/25 bg-amber-400/[0.07] text-amber-200" : "border-red-500/25 bg-red-500/[0.07] text-red-300"}`}>
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
          <span>
            {ESTADO_HORARIO_LABEL[estado]}{pendiente && " · No puedes enviar otro horario hasta que tu líder apruebe o rechace este."}
            {estado === "aprobado" && (
              <>
                {" "}· <b>{horasSemana(horario).toFixed(1)} h/semana</b>{alterna ? " · alternado" : ""}
                <br />{alterna ? "Semana A: " : ""}{resumenHorario(horario)}
                {alterna && <><br />Semana B: {resumenHorario(horarioB)}</>}
              </>
            )}
            {estado === "rechazado" && motivoRechazo && <><br /><b>Motivo del líder:</b> {motivoRechazo} Corrige tu horario y vuelve a enviarlo.</>}
          </span>
        </div>
      )}
      {!tieneLider && (
        <p className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#fff]/60">
          <Info size={15} className="mt-0.5 shrink-0" /> No tienes un líder asignado: tu horario lo revisará y aprobará el CEO.
        </p>
      )}

      {/* Horario alternado (beneficio) — solo para contratos laborales. */}
      {esLaboral && (
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <label className="flex items-start gap-2.5 text-sm text-[#fff]/80">
          <input type="checkbox" checked={alterna} onChange={(e) => { setAlterna(e.target.checked); if (!e.target.checked) setSemana("A") }} className="mt-0.5 h-4 w-4 accent-[var(--cyan)]" />
          <span>
            <span className="flex items-center gap-1.5 font-medium"><Repeat size={14} className="text-[var(--cyan)]" /> Horario alternado (cambia cada semana)</span>
            <span className="text-xs text-[#fff]/50">Registras dos horarios que se turnan. El de la <b>Semana A</b> es el de <b>esta</b> semana; la próxima rige la <b>Semana B</b>, y así se alterna solo.</span>
          </span>
        </label>

        {alterna && (
          <div className="mt-3 inline-flex rounded-lg border border-white/10 bg-black/20 p-0.5 text-sm">
            {(["A", "B"] as const).map((k) => (
              <button key={k} onClick={() => setSemana(k)} className={`rounded-md px-3 py-1.5 font-medium transition-colors ${semana === k ? "bg-[var(--cyan)]/15 text-[var(--cyan)]" : "text-[#fff]/50 hover:text-[#fff]/80"}`}>
                Semana {k}{k === "A" ? " · esta" : " · siguiente"}
              </button>
            ))}
          </div>
        )}
      </section>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/85">
          {alterna ? `Semana ${semana} · lunes a viernes` : "Lunes a viernes"}
        </h2>

        <div className="space-y-2.5">
          {DIAS_SEMANA.map((d) => {
            const day = editando[d]
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

        {/* Total semanal + validación (de la semana que se edita) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-[#fff]/70"><Clock size={15} className="text-[var(--cyan)]" /> Total {alterna ? `Semana ${semana}` : "semanal"} (sin almuerzo)</span>
          <span className={`font-display text-lg font-bold ${val.ok ? "text-[var(--cyan)]" : "text-red-300"}`}>{total.toFixed(1)} h {esLaboral && <span className="text-xs font-medium text-[#fff]/40">/ {val.cap} h máx.</span>}</span>
        </div>
        {!val.ok && <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{val.error}</p>}
        {alterna && (
          <p className="mt-2 text-[11px] text-[#fff]/45">
            Semana A: {valA.ok ? `${horasSemana(horario).toFixed(1)} h ✓` : "revisar"} · Semana B: {valB.ok ? `${horasSemana(horarioB).toFixed(1)} h ✓` : "revisar"}
          </p>
        )}

        <div className="mt-4">
          <button onClick={guardar} disabled={guardando || !listoParaEnviar} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-50 sm:w-auto">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enviar para aprobación
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[#fff]/40">
          <Info size={13} className="mt-0.5 shrink-0" /> {esLaboral ? normaJornada() : "Tu horario es referencial (vínculo por prestación de servicios/freelance): no aplica el tope de jornada de la Ley 2101."}
        </p>
      </section>
    </div>
  )
}
