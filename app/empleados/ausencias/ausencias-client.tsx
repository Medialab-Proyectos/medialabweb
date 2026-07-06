"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Plane, Send, CheckCircle2, XCircle, Clock } from "lucide-react"
import {
  type SolicitudAusencia, type SaldoVacaciones, type TipoAusencia,
  TIPO_AUSENCIA_LABEL, ESTADO_AUSENCIA_LABEL, DIAS_ADELANTO, esMediaJornada,
} from "@/lib/empleados/ausencia"
import { contarDiasHabiles, contarDiasCalendario } from "@/lib/empleados/festivos-co"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const TIPOS: TipoAusencia[] = [
  "vacaciones", "adelanto_vacaciones", "permiso_no_remunerado", "licencia_maternidad", "licencia_paternidad",
  "licencia_luto", "dia_familia", "dia_votacion", "media_jornada_cumpleanos", "media_jornada_evento", "otra",
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

  const media = esMediaJornada(tipo)
  const esVacacional = tipo === "vacaciones" || tipo === "adelanto_vacaciones"

  // La media jornada se pide sobre un solo día: mantenemos fin = inicio.
  useEffect(() => {
    if (media && inicio) setFin(inicio)
  }, [media, inicio])

  const preview = useMemo(() => {
    if (media) return inicio ? { habiles: 0.5, calendario: 1 } : null
    if (!inicio || !fin || fin < inicio) return null
    return { habiles: contarDiasHabiles(inicio, fin), calendario: contarDiasCalendario(inicio, fin) }
  }, [inicio, fin, media])

  // Validaciones de la solicitud (espejo de las del servidor)
  const validacion = useMemo(() => {
    if (media) return { ok: !!inicio, aviso: null as string | null }
    if (!inicio || !fin) return { ok: false, aviso: "" as string | null }
    if (fin < inicio) return { ok: false, aviso: "La fecha final no puede ser anterior a la inicial." }
    if (tipo === "adelanto_vacaciones") {
      if (!preview || preview.habiles <= 0) return { ok: false, aviso: "El rango elegido no tiene días hábiles (solo fines de semana o festivos)." }
      if (preview.habiles > DIAS_ADELANTO) return { ok: false, aviso: `El adelanto de vacaciones es máximo ${DIAS_ADELANTO} días hábiles.` }
    }
    if (tipo === "vacaciones") {
      if (!preview || preview.habiles <= 0) return { ok: false, aviso: "El rango elegido no tiene días hábiles (solo fines de semana o festivos)." }
      if (saldo && preview.habiles > saldo.maxSolicitable) {
        return { ok: false, aviso: `Solicitas ${preview.habiles} días hábiles pero solo tienes ${saldo.disponible} disponibles. Para hasta ${DIAS_ADELANTO} días extra usa “Adelanto de vacaciones”.` }
      }
    }
    return { ok: true, aviso: null }
  }, [inicio, fin, tipo, preview, saldo, media])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!validacion.ok) { setError(validacion.aviso || "Revisa los datos de la solicitud."); return }
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
          <div className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-2">
            <p className="font-display text-3xl font-bold text-[var(--cyan)]">{saldo.disponible} <span className="text-base font-medium text-[#fff]/50">días disponibles</span></p>
            {saldo.noDisponible > 0 && (
              <p className="font-display text-xl font-bold text-[#fff]/50">+{saldo.noDisponible} <span className="text-sm font-medium text-[#fff]/40">en curso (aún no disponibles)</span></p>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#fff]/55 sm:grid-cols-3 lg:grid-cols-5">
            <span>Año anterior: <b className="text-[#fff]/80">{saldo.saldoInicial}</b></span>
            <span>Causadas: <b className="text-[#fff]/80">{saldo.vencido}</b></span>
            <span>Este año: <b className="text-[#fff]/80">{saldo.enCurso}</b></span>
            <span>Pendiente: <b className="text-[#fff]/80">{saldo.pendiente}</b></span>
            <span>Tomado: <b className="text-[#fff]/80">{saldo.tomado}</b></span>
          </div>
          <p className="mt-2 text-[11px] text-[#fff]/40">
            Puedes solicitar hasta {saldo.disponible} días disponibles. Si necesitas hasta {DIAS_ADELANTO} días extra, usa el tipo “Adelanto de vacaciones”. Lo de “este año” se libera al cerrar el año.
          </p>
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
            <span className={lblCls}>{media ? "Día" : "Desde"}</span>
            <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required className={inputCls} />
          </label>
          {!media && (
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Hasta</span>
              <input type="date" value={fin} min={inicio} onChange={(e) => setFin(e.target.value)} required className={inputCls} />
            </label>
          )}
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={lblCls}>Motivo (opcional)</span>
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Breve descripción" className={inputCls} />
          </label>
        </div>

        {preview && (
          media ? (
            <p className="mt-3 text-xs text-[#fff]/55">
              Permiso de <b className="text-[var(--cyan)]">media jornada</b> (0.5 día). Es un beneficio interno; no descuenta de tu saldo de vacaciones.
            </p>
          ) : (
            <p className="mt-3 text-xs text-[#fff]/55">
              <b className="text-[var(--cyan)]">{preview.habiles}</b> días hábiles ({preview.calendario} calendario), descontando fines de semana y festivos colombianos.
            </p>
          )
        )}
        {!media && !esVacacional && preview && (
          <p className="mt-2 text-[11px] text-[#fff]/45">
            Este permiso/licencia no descuenta de tu saldo de vacaciones; lo aprueba tu líder directo.
          </p>
        )}
        {inicio && fin && validacion.aviso && (
          <p className="mt-3 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200">{validacion.aviso}</p>
        )}
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

        <button type="submit" disabled={enviando || !validacion.ok} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed">
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
