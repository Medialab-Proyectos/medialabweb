"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Clock, CheckCircle2, XCircle, Trash2, Info } from "lucide-react"
import { type SolicitudCesantias, type CausalCesantias, CAUSAL_CESANTIAS_LABEL, ESTADO_SOLICITUD_CESANTIAS_LABEL } from "@/lib/empleados/cesantias-solicitud"
import { formatCOP } from "@/lib/empleados/desprendible"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const estadoStyle: Record<string, string> = {
  pendiente: "bg-amber-400/10 text-amber-300",
  aprobada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
}
const EstadoIcon: Record<string, typeof Clock> = { pendiente: Clock, aprobada: CheckCircle2, rechazada: XCircle }

export function CesantiasRetiroClient() {
  const [solicitudes, setSolicitudes] = useState<SolicitudCesantias[]>([])
  const [fondo, setFondo] = useState<string | null>(null)
  const [tieneLider, setTieneLider] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [borrando, setBorrando] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const [causal, setCausal] = useState<CausalCesantias>("compra_vivienda")
  const [valorStr, setValorStr] = useState("")
  const [detalle, setDetalle] = useState("")

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch("/api/empleados/cesantias-retiro")
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Error al cargar."); return }
      setSolicitudes(data.solicitudes ?? [])
      setFondo(data.fondo ?? null)
      setTieneLider(!!data.tieneLider)
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const valor = Number(valorStr.replace(/[^\d]/g, "")) || 0

  async function solicitar() {
    if (valor <= 0) return setError("Indica el valor a retirar.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/cesantias-retiro", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ causal, valor, detalle: detalle.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Solicitud enviada. Tu líder la revisará y la empresa emitirá la carta al fondo.")
      setValorStr(""); setDetalle("")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al solicitar.")
    } finally { setGuardando(false) }
  }

  async function borrar(id: string) {
    setBorrando(id); setError("")
    try {
      const res = await fetch(`/api/empleados/cesantias-retiro/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al borrar.")
    } finally { setBorrando(null) }
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-lg font-bold">Solicitar retiro parcial</h2>
      </div>
      <p className="-mt-3 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#fff]/60">
        <Info size={15} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
        <span>
          Las cesantías solo se retiran por <b className="text-[#fff]/80">causales de ley</b> (vivienda o educación). Tu líder aprueba la
          solicitud y la empresa emite la carta dirigida a tu fondo{fondo ? ` (${fondo})` : ""} para que tramites el retiro.
        </span>
      </p>

      {!tieneLider && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-200">
          <Info size={15} className="mt-0.5 shrink-0" /> No tienes un líder asignado para aprobar la solicitud. Contacta a RRHH.
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Causal (destino)</span>
            <select value={causal} onChange={(e) => setCausal(e.target.value as CausalCesantias)} className={inputCls}>
              {(Object.keys(CAUSAL_CESANTIAS_LABEL) as CausalCesantias[]).map((c) => (
                <option key={c} value={c}>{CAUSAL_CESANTIAS_LABEL[c]}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={lblCls}>Valor a retirar</span>
            <input
              type="text" inputMode="numeric" value={valorStr}
              onChange={(e) => setValorStr(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Ej: 3800000" className={inputCls}
            />
            {valor > 0 && <span className="text-[11px] text-[#fff]/45">{formatCOP(valor)}</span>}
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={lblCls}>Detalle (opcional)</span>
            <input value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Ej: cuota inicial de vivienda, matrícula semestre…" className={inputCls} />
          </label>
        </div>
        <div className="mt-4">
          <button onClick={solicitar} disabled={guardando || !tieneLider} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Solicitar retiro
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-[#fff]/80">Mis solicitudes</h3>
        {cargando ? (
          <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
        ) : solicitudes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">Aún no has solicitado retiros de cesantías.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {solicitudes.map((s) => {
              const Icon = EstadoIcon[s.estado] ?? Clock
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{CAUSAL_CESANTIAS_LABEL[s.causal]} · {formatCOP(Number(s.valor) || 0)}</p>
                    <p className="text-xs text-[#fff]/50">{s.creado_en.slice(0, 10)}{s.detalle ? ` · ${s.detalle}` : ""}{s.comentario ? ` · "${s.comentario}"` : ""}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[s.estado]}`}>
                      <Icon size={11} /> {ESTADO_SOLICITUD_CESANTIAS_LABEL[s.estado]}
                    </span>
                    {s.estado === "pendiente" && (
                      <button onClick={() => borrar(s.id)} disabled={borrando === s.id} className="rounded-lg p-2 text-red-300/70 hover:bg-red-500/10 disabled:opacity-50" title="Borrar solicitud">
                        {borrando === s.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
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
