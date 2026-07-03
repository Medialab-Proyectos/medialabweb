"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Check, X, CalendarCog, Clock, CheckCircle2, XCircle } from "lucide-react"
import { type SolicitudAusencia, TIPO_AUSENCIA_LABEL, ESTADO_AUSENCIA_LABEL } from "@/lib/empleados/ausencia"

type Sol = SolicitudAusencia & { empleado: { nombre: string; cedula: string } | null }
type Emp = { id: string; nombre: string; cedula: string }

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"
const estadoStyle: Record<string, string> = {
  pendiente: "bg-amber-400/10 text-amber-300",
  aprobada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
}
const EstadoIcon = { pendiente: Clock, aprobada: CheckCircle2, rechazada: XCircle }

export function AprobacionesClient({ esCEO, empleados }: { esCEO: boolean; empleados: Emp[] }) {
  const [sols, setSols] = useState<Sol[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [procesando, setProcesando] = useState<string | null>(null)

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

  async function decidir(id: string, estado: "aprobada" | "rechazada") {
    const comentario = estado === "rechazada" ? window.prompt("Motivo del rechazo (opcional):") ?? "" : window.prompt("Comentario (opcional):") ?? ""
    setProcesando(id)
    try {
      const res = await fetch(`/api/empleados/ausencias/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, comentario: comentario || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.")
    } finally { setProcesando(null) }
  }

  return (
    <div className="flex flex-col gap-6">
      {esCEO && <SaldoInicial empleados={empleados} />}

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
                  <div className="flex gap-2">
                    <button onClick={() => decidir(s.id, "aprobada")} disabled={procesando === s.id} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
                      {procesando === s.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Aprobar
                    </button>
                    <button onClick={() => decidir(s.id, "rechazada")} disabled={procesando === s.id} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25 disabled:opacity-50">
                      <X size={13} /> Rechazar
                    </button>
                  </div>
                </div>
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

function SaldoInicial({ empleados }: { empleados: Emp[] }) {
  const [empleadoId, setEmpleadoId] = useState("")
  const [saldo, setSaldo] = useState(0)
  const [corte, setCorte] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!empleadoId) return setError("Selecciona un empleado.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/admin/vacaciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empleado_id: empleadoId, saldo_inicial: Number(saldo) || 0, corte: corte || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Saldo inicial guardado.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.")
    } finally { setGuardando(false) }
  }

  return (
    <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#fff]/80">
        <CalendarCog size={16} className="text-[var(--cyan)]" /> Configurar saldo inicial de vacaciones (CEO)
      </summary>
      <form onSubmit={guardar} className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 sm:col-span-3">
          <span className={lblCls}>Empleado</span>
          <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
            <option value="">— Selecciona —</option>
            {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Días pendientes (año anterior)</span>
          <input type="number" step="0.5" value={saldo} onChange={(e) => setSaldo(Number(e.target.value))} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Fecha de corte (acumula desde)</span>
          <input type="date" value={corte} onChange={(e) => setCorte(e.target.value)} className={inputCls} />
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
          </button>
        </div>
        {error && <p className="text-sm text-red-300 sm:col-span-3">{error}</p>}
        {msg && <p className="text-sm text-emerald-300 sm:col-span-3">{msg}</p>}
        <p className="text-[11px] text-[#fff]/40 sm:col-span-3">Si no defines fecha de corte, se usa la fecha de ingreso del empleado. La acumulación es de 15 días hábiles/año.</p>
      </form>
    </details>
  )
}
