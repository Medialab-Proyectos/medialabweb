"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Plane, Send, CheckCircle2, XCircle, Clock } from "lucide-react"
import {
  type SolicitudAusencia, type SaldoVacaciones, type TipoAusencia,
  TIPO_AUSENCIA_LABEL, ESTADO_AUSENCIA_LABEL,
} from "@/lib/empleados/ausencia"
import { contarDiasHabiles, contarDiasCalendario } from "@/lib/empleados/festivos-co"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const TIPOS: TipoAusencia[] = [
  "vacaciones", "permiso_no_remunerado", "licencia_maternidad", "licencia_paternidad",
  "licencia_luto", "dia_familia", "dia_votacion", "otra",
]

const estadoStyle: Record<string, string> = {
  pendiente: "bg-amber-400/10 text-amber-300",
  aprobada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
}
const EstadoIcon = { pendiente: Clock, aprobada: CheckCircle2, rechazada: XCircle }

export function AusenciasClient() {
  const [saldo, setSaldo] = useState<SaldoVacaciones | null>(null)
  const [solicitudes, setSolicitudes] = useState<SolicitudAusencia[]>([])
  const [cargando, setCargando] = useState(true)
  const [tipo, setTipo] = useState<TipoAusencia>("vacaciones")
  const [inicio, setInicio] = useState("")
  const [fin, setFin] = useState("")
  const [motivo, setMotivo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/ausencias")
      const data = await res.json()
      if (res.ok) { setSaldo(data.saldo); setSolicitudes(data.solicitudes ?? []) }
      else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  const preview = useMemo(() => {
    if (!inicio || !fin || fin < inicio) return null
    return { habiles: contarDiasHabiles(inicio, fin), calendario: contarDiasCalendario(inicio, fin) }
  }, [inicio, fin])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(""); setMsg(""); setEnviando(true)
    try {
      const res = await fetch("/api/empleados/ausencias", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, fecha_inicio: inicio, fecha_fin: fin, motivo: motivo || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Solicitud enviada. Tu líder la revisará.")
      setInicio(""); setFin(""); setMotivo("")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Saldo de vacaciones */}
      {saldo && (
        <div className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-5">
          <div className="flex items-center gap-2">
            <Plane size={16} className="text-[var(--cyan)]" />
            <h2 className="text-sm font-semibold">Saldo de vacaciones</h2>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-[var(--cyan)]">{saldo.disponible} <span className="text-base font-medium text-[#fff]/50">días hábiles disponibles</span></p>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#fff]/55 sm:grid-cols-4">
            <span>Inicial: <b className="text-[#fff]/80">{saldo.saldoInicial}</b></span>
            <span>Acumulado: <b className="text-[#fff]/80">{saldo.acumulado}</b></span>
            <span>Pendiente: <b className="text-[#fff]/80">{saldo.pendiente}</b></span>
            <span>Tomado: <b className="text-[#fff]/80">{saldo.tomado}</b></span>
          </div>
          <p className="mt-2 text-[11px] text-[#fff]/40">Puedes solicitar hasta {saldo.maxSolicitable} días (incluye 2 adelantados).</p>
        </div>
      )}

      {/* Formulario de solicitud */}
      <form onSubmit={enviar} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[#fff]/80">Nueva solicitud</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={lblCls}>Tipo</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoAusencia)} className={inputCls}>
              {TIPOS.map((t) => <option key={t} value={t}>{TIPO_AUSENCIA_LABEL[t]}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Desde</span>
            <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Hasta</span>
            <input type="date" value={fin} min={inicio} onChange={(e) => setFin(e.target.value)} required className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={lblCls}>Motivo (opcional)</span>
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Breve descripción" className={inputCls} />
          </label>
        </div>

        {preview && (
          <p className="mt-3 text-xs text-[#fff]/55">
            <b className="text-[var(--cyan)]">{preview.habiles}</b> días hábiles ({preview.calendario} calendario), descontando fines de semana y festivos colombianos.
          </p>
        )}
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

        <button type="submit" disabled={enviando} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
          {enviando ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Enviar solicitud
        </button>
      </form>

      {/* Historial */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Mis solicitudes</h2>
        {cargando ? (
          <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
        ) : solicitudes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">Aún no tienes solicitudes.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {solicitudes.map((s) => {
              const Icon = EstadoIcon[s.estado]
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{TIPO_AUSENCIA_LABEL[s.tipo]} · {s.dias_habiles} días háb.</p>
                    <p className="text-xs text-[#fff]/50">{s.fecha_inicio} → {s.fecha_fin}{s.comentario ? ` · "${s.comentario}"` : ""}</p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[s.estado]}`}>
                    <Icon size={11} /> {ESTADO_AUSENCIA_LABEL[s.estado]}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
