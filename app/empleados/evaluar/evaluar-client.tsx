"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Save, CheckCircle2, ClipboardList, ArrowLeft } from "lucide-react"
import {
  COMPETENCIAS, NIVELES, calcularGlobal, ratingLabel, periodoActual, periodosRecientes, periodoLabel,
  type Competencias,
} from "@/lib/empleados/evaluacion"

type Persona = { id: string; nombre: string; cedula: string }
type Evaluacion = {
  id: string; evaluado_id: string; estado: "abierta" | "completada"
  puntajes: { competencias?: Competencias; global?: number } | null
  puntos_mejora: string | null; puntos_criticos: string | null; comentarios: string | null
  evaluado?: { nombre: string } | null
}

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function EvaluarClient() {
  const [periodo, setPeriodo] = useState(periodoActual())
  const [equipo, setEquipo] = useState<Persona[]>([])
  const [evals, setEvals] = useState<Evaluacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [sel, setSel] = useState<Persona | null>(null)

  const [comp, setComp] = useState<Competencias>({})
  const [fortalezas, setFortalezas] = useState("")
  const [mejoras, setMejoras] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch(`/api/empleados/evaluar?periodo=${periodo}`)
      const data = await res.json()
      if (res.ok) { setEquipo(data.equipo ?? []); setEvals(data.evaluaciones ?? []) }
      else setError(data.error || "Error al cargar.")
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [periodo])

  const evalPorId = useMemo(() => {
    const m = new Map<string, Evaluacion>()
    evals.forEach((e) => m.set(e.evaluado_id, e))
    return m
  }, [evals])

  function abrir(p: Persona) {
    setError(""); setMsg("")
    const ev = evalPorId.get(p.id)
    setComp((ev?.puntajes?.competencias as Competencias) ?? {})
    setFortalezas(ev?.puntos_criticos ?? "")
    setMejoras(ev?.puntos_mejora ?? "")
    setComentarios(ev?.comentarios ?? "")
    setSel(p)
  }

  const global = useMemo(() => calcularGlobal(comp), [comp])

  async function guardar(completar: boolean) {
    if (!sel) return
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/evaluar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluado_id: sel.id, periodo, competencias: comp,
          fortalezas: fortalezas || null, mejoras: mejoras || null, comentarios: comentarios || null,
          completar,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg(completar ? "✓ Evaluación completada." : "✓ Guardada como borrador.")
      await cargar()
      if (completar) setSel(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally { setGuardando(false) }
  }

  // ── Vista de formulario ─────────────────────────────────────────────────────
  if (sel) {
    return (
      <div>
        <button onClick={() => setSel(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver al equipo
        </button>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">{sel.nombre}</h2>
              <p className="text-xs text-[#fff]/50">{periodoLabel(periodo)}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-[var(--cyan)]">{global || "—"}<span className="text-sm text-[#fff]/40">/5</span></p>
              <p className="text-[11px] text-[#fff]/50">{ratingLabel(global)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {COMPETENCIAS.map((c) => (
              <div key={c.clave} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-sm text-[#fff]/80">{c.etiqueta}</span>
                <select
                  value={comp[c.clave] ?? 0}
                  onChange={(e) => setComp({ ...comp, [c.clave]: Number(e.target.value) })}
                  className={`${inputCls} w-full sm:w-48 sm:shrink-0`}
                >
                  <option value={0}>— Sin calificar —</option>
                  {NIVELES.map((n) => <option key={n.v} value={n.v}>{n.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Fortalezas / puntos fuertes</span>
              <textarea rows={2} value={fortalezas} onChange={(e) => setFortalezas(e.target.value)} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Áreas de mejora</span>
              <textarea rows={2} value={mejoras} onChange={(e) => setMejoras(e.target.value)} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Plan de acción / recomendaciones</span>
              <textarea rows={2} value={comentarios} onChange={(e) => setComentarios(e.target.value)} className={inputCls} />
            </label>
          </div>

          {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
          {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => guardar(true)} disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
              {guardando ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Completar evaluación
            </button>
            <button onClick={() => guardar(false)} disabled={guardando} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5 disabled:opacity-60">
              Guardar borrador
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#fff]/40">Al completar, la evaluación se hace visible para el empleado.</p>
        </div>
      </div>
    )
  }

  // ── Vista de equipo ─────────────────────────────────────────────────────────
  return (
    <div>
      <label className="mb-6 flex max-w-xs flex-col gap-1.5">
        <span className={lblCls}>Trimestre</span>
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={inputCls}>
          {periodosRecientes().map((p) => <option key={p} value={p}>{periodoLabel(p)}</option>)}
        </select>
      </label>

      {cargando ? (
        <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : equipo.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No tienes personas a cargo para evaluar.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {equipo.map((p) => {
            const ev = evalPorId.get(p.id)
            const estado = !ev ? "sin" : ev.estado
            return (
              <button key={p.id} onClick={() => abrir(p)} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-[var(--cyan)]/40 hover:bg-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <ClipboardList size={16} className="text-[#fff]/40" />
                  <div>
                    <p className="text-sm font-medium">{p.nombre}</p>
                    <p className="text-xs text-[#fff]/45">CC {p.cedula}</p>
                  </div>
                </div>
                {estado === "completada" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                    <CheckCircle2 size={11} /> {ev?.puntajes?.global ?? "—"}/5
                  </span>
                ) : estado === "abierta" ? (
                  <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">Borrador</span>
                ) : (
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#fff]/50">Sin evaluar</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
