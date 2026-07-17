"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Check, X, Download } from "lucide-react"
import { type SolicitudAusencia, TIPO_AUSENCIA_LABEL, ESTADO_AUSENCIA_LABEL } from "@/lib/empleados/ausencia"
import { type HoraExtra, RECARGO, ESTADO_HORA_EXTRA_LABEL } from "@/lib/empleados/horas-extras"
import { type SolicitudCesantias, CAUSAL_CESANTIAS_LABEL, ESTADO_SOLICITUD_CESANTIAS_LABEL } from "@/lib/empleados/cesantias-solicitud"
import { type Horario, DIAS_SEMANA, DIA_LABEL } from "@/lib/empleados/horario"
import { formatCOP } from "@/lib/empleados/desprendible"

type Sol = SolicitudAusencia & { empleado: { nombre: string; cedula: string } | null }
type Hx = HoraExtra & { empleado: { nombre: string; cedula: string } | null }
type Ces = SolicitudCesantias & { empleado: { nombre: string; cedula: string } | null }
type Hor = { id: string; empleado_id: string; horario: Horario; horario_b?: Horario | null; alterna?: boolean; horas_semana: number; estado: string; comentario?: string | null; decidido_en?: string | null; creado_en?: string; empleado: { nombre: string; cedula: string } | null }

type Categoria = "ausencia" | "hora_extra" | "cesantias" | "horario"
const CAT_LABEL: Record<Categoria, string> = {
  ausencia: "Permisos y ausencias",
  hora_extra: "Horas extra",
  cesantias: "Retiro de cesantías",
  horario: "Horarios",
}
type HistItem = { id: string; cat: Categoria; empleado: string; titulo: string; detalle: string; estado: string; fecha: string; descarga?: string }

/** Estilo de la píldora de estado a partir del texto (aprobado/rechazado). */
function estadoPill(estado: string) {
  if (/aprob/i.test(estado)) return "bg-emerald-400/10 text-emerald-300"
  if (/rechaz/i.test(estado)) return "bg-red-500/10 text-red-300"
  return "bg-white/10 text-[#fff]/70"
}
const HIST_POR_PAGINA = 15

function resumenHorario(h: Horario): string {
  return DIAS_SEMANA.filter((d) => h[d]?.activo).map((d) => `${DIA_LABEL[d].slice(0, 3)} ${h[d].entrada}–${h[d].salida}`).join(" · ")
}

export function AprobacionesClient({ esCEO = false }: { esCEO?: boolean }) {
  const [sols, setSols] = useState<Sol[]>([])
  const [hxs, setHxs] = useState<Hx[]>([])
  const [cess, setCess] = useState<Ces[]>([])
  const [hors, setHors] = useState<Hor[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [procesando, setProcesando] = useState<string | null>(null)
  const [decision, setDecision] = useState<{ id: string; estado: "aprobada" | "rechazada" } | null>(null)
  const [comentario, setComentario] = useState("")
  const [vista, setVista] = useState<"pendientes" | "historial">("pendientes")
  const [filtro, setFiltro] = useState<"todos" | Categoria>("todos")
  const [pag, setPag] = useState(1)
  useEffect(() => { setPag(1) }, [filtro, vista])

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch("/api/empleados/aprobaciones")
      const data = await res.json()
      if (res.ok) { setSols(data.solicitudes ?? []); setHxs(data.horasExtras ?? []); setCess(data.cesantias ?? []); setHors(data.horarios ?? []) }
      else setError(data.error || "Error al cargar.")
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const pendientes = useMemo(() => sols.filter((s) => s.estado === "pendiente"), [sols])
  const hxPendientes = useMemo(() => hxs.filter((h) => h.estado === "pendiente"), [hxs])
  const cesPendientes = useMemo(() => cess.filter((c) => c.estado === "pendiente"), [cess])
  const horPendientes = useMemo(() => hors.filter((h) => h.estado === "pendiente"), [hors])
  const totalPendientes = pendientes.length + hxPendientes.length + cesPendientes.length + horPendientes.length

  // ── Historial unificado (decididas de todos los módulos), ordenado por fecha de decisión ──
  const historial = useMemo<HistItem[]>(() => {
    const items: HistItem[] = []
    for (const s of sols) if (s.estado !== "pendiente") items.push({ id: `a-${s.id}`, cat: "ausencia", empleado: s.empleado?.nombre ?? "—", titulo: TIPO_AUSENCIA_LABEL[s.tipo], detalle: `${s.fecha_inicio} → ${s.fecha_fin} · ${s.dias_habiles} días${s.comentario ? ` · "${s.comentario}"` : ""}`, estado: ESTADO_AUSENCIA_LABEL[s.estado], fecha: s.decidido_en ?? s.creado_en })
    for (const h of hxs) if (h.estado !== "pendiente") items.push({ id: `h-${h.id}`, cat: "hora_extra", empleado: h.empleado?.nombre ?? "—", titulo: RECARGO[h.tipo].label, detalle: `${h.fecha} · ${h.horas} h · ${formatCOP(h.valor)}${h.comentario ? ` · "${h.comentario}"` : ""}`, estado: ESTADO_HORA_EXTRA_LABEL[h.estado], fecha: h.decidido_en ?? h.creado_en })
    for (const c of cess) if (c.estado !== "pendiente") items.push({ id: `c-${c.id}`, cat: "cesantias", empleado: c.empleado?.nombre ?? "—", titulo: CAUSAL_CESANTIAS_LABEL[c.causal], detalle: `${formatCOP(Number(c.valor) || 0)}${c.detalle ? ` · ${c.detalle}` : ""}`, estado: ESTADO_SOLICITUD_CESANTIAS_LABEL[c.estado], fecha: c.decidido_en ?? c.creado_en, descarga: esCEO && c.estado === "aprobada" ? `/api/empleados/admin/cesantias-retiro/${c.id}/carta` : undefined })
    for (const h of hors) if (h.estado !== "pendiente") items.push({ id: `ho-${h.id}`, cat: "horario", empleado: h.empleado?.nombre ?? "—", titulo: `${Number(h.horas_semana).toFixed(1)} h/semana${h.alterna ? " · Alternado" : ""}`, detalle: `${resumenHorario(h.horario)}${h.comentario ? ` · "${h.comentario}"` : ""}`, estado: h.estado === "aprobado" ? "Aprobado" : "Rechazado", fecha: h.decidido_en ?? h.creado_en ?? "" })
    return items.sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? ""))
  }, [sols, hxs, cess, hors, esCEO])

  const historialFiltrado = useMemo(() => (filtro === "todos" ? historial : historial.filter((i) => i.cat === filtro)), [historial, filtro])
  const totalPaginas = Math.max(1, Math.ceil(historialFiltrado.length / HIST_POR_PAGINA))
  const pagActual = Math.min(pag, totalPaginas)
  const historialPagina = historialFiltrado.slice((pagActual - 1) * HIST_POR_PAGINA, pagActual * HIST_POR_PAGINA)

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

  // Decisión de horas extra (bloque propio).
  const [hxDecision, setHxDecision] = useState<{ id: string; estado: "aprobada" | "rechazada" } | null>(null)
  const [hxComentario, setHxComentario] = useState("")
  async function decidirHx(id: string, estado: "aprobada" | "rechazada") {
    setProcesando(id)
    try {
      const res = await fetch(`/api/empleados/horas-extras/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, comentario: hxComentario.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHxDecision(null); setHxComentario("")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la decisión.")
    } finally { setProcesando(null) }
  }

  // Decisión de solicitudes de retiro de cesantías.
  async function decidirCes(id: string, estado: "aprobada" | "rechazada") {
    setProcesando(id)
    try {
      const res = await fetch(`/api/empleados/cesantias-retiro/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, comentario: null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la decisión.")
    } finally { setProcesando(null) }
  }

  // Decisión de horarios (aprobado = entra en vigencia). Al rechazar, el motivo es obligatorio.
  const [horDecision, setHorDecision] = useState<{ id: string; estado: "aprobado" | "rechazado" } | null>(null)
  const [horComentario, setHorComentario] = useState("")
  async function aprobarHor(id: string) {
    setError(""); setProcesando(id)
    try {
      const res = await fetch(`/api/empleados/horario/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "aprobado", comentario: null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la decisión.")
    } finally { setProcesando(null) }
  }
  async function decidirHor() {
    if (!horDecision) return
    const { id, estado } = horDecision
    if (estado === "rechazado" && !horComentario.trim()) { setError("Indica el motivo del rechazo para que el empleado sepa qué corregir."); return }
    setError(""); setProcesando(id)
    try {
      const res = await fetch(`/api/empleados/horario/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, comentario: horComentario.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHorDecision(null); setHorComentario("")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la decisión.")
    } finally { setProcesando(null) }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {/* Pestañas: pendientes por decidir vs. historial de decisiones */}
      <div className="inline-flex self-start rounded-lg border border-white/10 bg-black/20 p-0.5 text-sm">
        <button onClick={() => setVista("pendientes")} className={`rounded-md px-3.5 py-1.5 font-medium transition-colors ${vista === "pendientes" ? "bg-[var(--cyan)]/15 text-[var(--cyan)]" : "text-[#fff]/50 hover:text-[#fff]/80"}`}>
          Por aprobar{totalPendientes > 0 ? ` (${totalPendientes})` : ""}
        </button>
        <button onClick={() => setVista("historial")} className={`rounded-md px-3.5 py-1.5 font-medium transition-colors ${vista === "historial" ? "bg-[var(--cyan)]/15 text-[var(--cyan)]" : "text-[#fff]/50 hover:text-[#fff]/80"}`}>
          Historial ({historial.length})
        </button>
      </div>

      {vista === "pendientes" && (<>
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

      {/* ── Horas extra ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Horas extra pendientes ({hxPendientes.length})</h2>
        {cargando ? null : hxPendientes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No hay horas extra pendientes.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {hxPendientes.map((h) => (
              <div key={h.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{h.empleado?.nombre ?? "—"}</p>
                    <p className="text-xs text-[#fff]/55">{RECARGO[h.tipo].label} · {h.horas} h · {h.fecha} · <b className="text-[#fff]/75">{formatCOP(h.valor)}</b></p>
                    {h.motivo && <p className="mt-1 text-xs text-[#fff]/45">Motivo: {h.motivo}</p>}
                  </div>
                  {hxDecision?.id !== h.id && (
                    <div className="flex gap-2">
                      <button onClick={() => { setHxDecision({ id: h.id, estado: "aprobada" }); setHxComentario("") }} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
                        <Check size={13} /> Aprobar
                      </button>
                      <button onClick={() => { setHxDecision({ id: h.id, estado: "rechazada" }); setHxComentario("") }} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25 disabled:opacity-50">
                        <X size={13} /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
                {hxDecision?.id === h.id && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50">
                      {hxDecision.estado === "rechazada" ? "Motivo del rechazo (opcional)" : "Comentario (opcional)"}
                    </label>
                    <textarea
                      rows={2}
                      autoFocus
                      value={hxComentario}
                      onChange={(e) => setHxComentario(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => decidirHx(h.id, hxDecision.estado)}
                        disabled={procesando === h.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                          hxDecision.estado === "rechazada" ? "bg-red-500/20 text-red-200 hover:bg-red-500/30" : "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                        }`}
                      >
                        {procesando === h.id ? <Loader2 size={13} className="animate-spin" /> : hxDecision.estado === "rechazada" ? <X size={13} /> : <Check size={13} />}
                        {hxDecision.estado === "rechazada" ? "Confirmar rechazo" : "Confirmar aprobación"}
                      </button>
                      <button onClick={() => { setHxDecision(null); setHxComentario("") }} disabled={procesando === h.id} className="rounded-lg px-3 py-2 text-xs text-[#fff]/60 hover:text-[#fff] disabled:opacity-50">
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

      {/* ── Horarios ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Horarios pendientes ({horPendientes.length})</h2>
        {cargando ? null : horPendientes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No hay horarios pendientes.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {horPendientes.map((h) => (
              <div key={h.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{h.empleado?.nombre ?? "—"} · <span className="text-[#fff]/60">{Number(h.horas_semana).toFixed(1)} h/semana</span>{h.alterna && <span className="ml-1.5 rounded-full bg-[var(--cyan)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--cyan)]">Alternado</span>}</p>
                    <p className="mt-0.5 text-xs text-[#fff]/50">{h.alterna ? "Sem. A: " : ""}{resumenHorario(h.horario)}</p>
                    {h.alterna && h.horario_b && <p className="mt-0.5 text-xs text-[#fff]/50">Sem. B: {resumenHorario(h.horario_b)}</p>}
                  </div>
                  {horDecision?.id !== h.id && (
                    <div className="flex gap-2">
                      <button onClick={() => aprobarHor(h.id)} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
                        {procesando === h.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Aprobar
                      </button>
                      <button onClick={() => { setHorDecision({ id: h.id, estado: "rechazado" }); setHorComentario(""); setError("") }} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25 disabled:opacity-50">
                        <X size={13} /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
                {horDecision?.id === h.id && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50">Motivo del rechazo (obligatorio)</label>
                    <textarea rows={2} autoFocus value={horComentario} onChange={(e) => setHorComentario(e.target.value)} placeholder="Ej: ajusta la salida del viernes; supera el tope de la jornada." className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60" />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button onClick={decidirHor} disabled={procesando === h.id || !horComentario.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30 disabled:opacity-50">
                        {procesando === h.id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />} Confirmar rechazo
                      </button>
                      <button onClick={() => { setHorDecision(null); setHorComentario("") }} disabled={procesando === h.id} className="rounded-lg px-3 py-2 text-xs text-[#fff]/60 hover:text-[#fff] disabled:opacity-50">Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Retiro de cesantías ─────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Retiro de cesantías pendientes ({cesPendientes.length})</h2>
        {cargando ? null : cesPendientes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No hay solicitudes de cesantías pendientes.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {cesPendientes.map((c) => (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{c.empleado?.nombre ?? "—"}</p>
                    <p className="text-xs text-[#fff]/55">{CAUSAL_CESANTIAS_LABEL[c.causal]} · <b className="text-[#fff]/75">{formatCOP(Number(c.valor) || 0)}</b></p>
                    {c.detalle && <p className="mt-1 text-xs text-[#fff]/45">Detalle: {c.detalle}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => decidirCes(c.id, "aprobada")} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
                      {procesando === c.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Aprobar
                    </button>
                    <button onClick={() => decidirCes(c.id, "rechazada")} disabled={!!procesando} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25 disabled:opacity-50">
                      <X size={13} /> Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      </>)}

      {/* ── Historial de decisiones (con filtro por tipo y paginación) ─────────── */}
      {vista === "historial" && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(["todos", "ausencia", "hora_extra", "cesantias", "horario"] as const).map((f) => (
              <button key={f} onClick={() => setFiltro(f)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filtro === f ? "bg-[var(--cyan)]/15 text-[var(--cyan)]" : "border border-white/10 text-[#fff]/55 hover:text-[#fff]/85"}`}>
                {f === "todos" ? "Todos" : CAT_LABEL[f]}
              </button>
            ))}
          </div>

          {cargando ? (
            <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
          ) : historialFiltrado.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No hay decisiones en el historial{filtro !== "todos" ? ` de "${CAT_LABEL[filtro]}"` : ""}.</p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {historialPagina.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm"><span className="text-[10px] font-semibold uppercase tracking-wide text-[#fff]/35">{CAT_LABEL[it.cat]}</span> · {it.empleado} · {it.titulo}</p>
                      <p className="truncate text-xs text-[#fff]/45">{it.detalle}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {it.descarga && (
                        <a href={it.descarga} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20" title="Descargar carta para el fondo">
                          <Download size={12} /> Carta
                        </a>
                      )}
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoPill(it.estado)}`}>{it.estado}</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-[#fff]/45">{historialFiltrado.length} decisiones · página {pagActual} de {totalPaginas}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setPag((p) => Math.max(1, p - 1))} disabled={pagActual <= 1} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#fff]/70 hover:bg-white/5 disabled:opacity-40">Anterior</button>
                    <button onClick={() => setPag((p) => Math.min(totalPaginas, p + 1))} disabled={pagActual >= totalPaginas} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#fff]/70 hover:bg-white/5 disabled:opacity-40">Siguiente</button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  )
}
