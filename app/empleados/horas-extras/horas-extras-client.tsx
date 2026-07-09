"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Plus, Clock, CheckCircle2, XCircle, Trash2, Info } from "lucide-react"
import { type HoraExtra, type TipoHoraExtra, RECARGO, ESTADO_HORA_EXTRA_LABEL } from "@/lib/empleados/horas-extras"
import { formatCOP } from "@/lib/empleados/desprendible"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const estadoStyle: Record<string, string> = {
  pendiente: "bg-amber-400/10 text-amber-300",
  aprobada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
  pagada: "bg-[var(--cyan)]/10 text-[var(--cyan)]",
}
const EstadoIcon: Record<string, typeof Clock> = { pendiente: Clock, aprobada: CheckCircle2, rechazada: XCircle, pagada: CheckCircle2 }

function hoyISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
}

export function HorasExtrasClient() {
  const [horas, setHoras] = useState<HoraExtra[]>([])
  const [valorHora, setValorHora] = useState(0)
  const [tieneLider, setTieneLider] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [borrando, setBorrando] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const [fecha, setFecha] = useState(hoyISO())
  const [tipo, setTipo] = useState<TipoHoraExtra>("diurna")
  const [cantidad, setCantidad] = useState("")

  const [motivo, setMotivo] = useState("")

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch("/api/empleados/horas-extras")
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Error al cargar."); return }
      setHoras(data.horas ?? [])
      setValorHora(Number(data.valorHora) || 0)
      setTieneLider(!!data.tieneLider)
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const horasNum = Number(cantidad.replace(",", ".")) || 0
  const estimado = useMemo(() => Math.round(valorHora * RECARGO[tipo].factor * horasNum), [valorHora, tipo, horasNum])

  async function reportar() {
    if (horasNum <= 0) return setError("Indica cuántas horas trabajaste.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/horas-extras", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, tipo, horas: horasNum, motivo: motivo.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Reporte enviado. Tu líder lo revisará.")
      setCantidad(""); setMotivo("")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reportar.")
    } finally { setGuardando(false) }
  }

  async function borrar(id: string) {
    setBorrando(id); setError("")
    try {
      const res = await fetch(`/api/empleados/horas-extras/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al borrar.")
    } finally { setBorrando(null) }
  }

  return (
    <div className="flex flex-col gap-6">
      {!tieneLider && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-200">
          <Info size={15} className="mt-0.5 shrink-0" /> No tienes un líder asignado para aprobar tus reportes. Contacta a RRHH.
        </p>
      )}

      {/* Formulario */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[#fff]/85">Reportar horas extra</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Fecha</span>
            <input type="date" max={hoyISO()} value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Tipo de recargo</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoHoraExtra)} className={inputCls}>
              {(Object.keys(RECARGO) as TipoHoraExtra[]).map((t) => (
                <option key={t} value={t}>{RECARGO[t].label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Horas</span>
            <input
              type="text" inputMode="decimal" value={cantidad}
              onChange={(e) => setCantidad(e.target.value.replace(/[^\d.,]/g, ""))}
              placeholder="Ej: 2 o 1,5" className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Motivo (opcional)</span>
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: entrega urgente del proyecto X" className={inputCls} />
          </label>
        </div>
        <p className="mt-3 text-xs text-[#fff]/55">
          {RECARGO[tipo].descripcion}. Valor estimado: <b className="text-[#fff]/85">{formatCOP(estimado)}</b>
          {valorHora > 0 && <span className="text-[#fff]/40"> · hora ordinaria {formatCOP(valorHora)}</span>}
        </p>
        <div className="mt-4">
          <button onClick={reportar} disabled={guardando || !tieneLider} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Reportar
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}
      </section>

      {/* Historial */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Mis reportes</h2>
        {cargando ? (
          <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
        ) : horas.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">Aún no has reportado horas extra.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {horas.map((h) => {
              const Icon = EstadoIcon[h.estado] ?? Clock
              return (
                <div key={h.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{RECARGO[h.tipo].label} · {h.horas} h</p>
                    <p className="text-xs text-[#fff]/50">{h.fecha} · {formatCOP(h.valor)}{h.comentario ? ` · "${h.comentario}"` : ""}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[h.estado]}`}>
                      <Icon size={11} /> {ESTADO_HORA_EXTRA_LABEL[h.estado]}
                    </span>
                    {h.estado === "pendiente" && (
                      <button onClick={() => borrar(h.id)} disabled={borrando === h.id} className="rounded-lg p-2 text-red-300/70 hover:bg-red-500/10 disabled:opacity-50" title="Borrar reporte">
                        {borrando === h.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
