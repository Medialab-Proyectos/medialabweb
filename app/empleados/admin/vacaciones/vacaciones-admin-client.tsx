"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Save, Plane, CheckCircle2, Info } from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import type { SaldoVacaciones } from "@/lib/empleados/ausencia"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function VacacionesAdminClient({ empleados }: { empleados: Empleado[] }) {
  const [empleadoId, setEmpleadoId] = useState("")
  const [saldoInicial, setSaldoInicial] = useState(0)
  const [corte, setCorte] = useState("")
  const [fechaIngreso, setFechaIngreso] = useState<string | null>(null)
  const [yaConfigurado, setYaConfigurado] = useState(false)
  const [saldo, setSaldo] = useState<SaldoVacaciones | null>(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    setMsg(""); setError("")
    if (!empleadoId) { setSaldo(null); return }
    let cancel = false
    ;(async () => {
      setCargando(true)
      try {
        const res = await fetch(`/api/empleados/admin/vacaciones?empleado_id=${empleadoId}`)
        const data = await res.json()
        if (cancel) return
        if (!res.ok) { setError(data.error || "Error al cargar."); setSaldo(null); return }
        const cfgCorte = data.config?.corte ?? null
        setSaldoInicial(Number(data.config?.saldo_inicial) || 0)
        setFechaIngreso(data.config?.fecha_ingreso ?? null)
        setYaConfigurado(!!cfgCorte)
        // Si nunca se configuró el corte, prellenamos con la fecha de ingreso como sugerencia.
        setCorte(cfgCorte ?? data.config?.fecha_ingreso ?? "")
        setSaldo(data.saldo ?? null)
      } finally {
        if (!cancel) setCargando(false)
      }
    })()
    return () => { cancel = true }
  }, [empleadoId])

  async function guardar() {
    if (!empleadoId) return setError("Selecciona un empleado.")
    if (corte && !/^\d{4}-\d{2}-\d{2}$/.test(corte)) return setError("La fecha de corte no es válida.")
    if (saldoInicial < 0 || saldoInicial > 365) return setError("El saldo del año anterior debe estar entre 0 y 365 días.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/admin/vacaciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empleado_id: empleadoId, saldo_inicial: Number(saldoInicial) || 0, corte: corte || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setYaConfigurado(!!corte)
      setMsg("✓ Configuración inicial guardada. De aquí en adelante el sistema lleva el saldo automáticamente.")
      // Recargar el saldo recalculado
      const res2 = await fetch(`/api/empleados/admin/vacaciones?empleado_id=${empleadoId}`)
      const data2 = await res2.json()
      if (res2.ok) setSaldo(data2.saldo ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-2 flex items-center gap-2.5">
        <Plane size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Vacaciones · configuración inicial</h1>
      </div>
      <p className="mb-6 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#fff]/60">
        <Info size={15} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
        <span>
          Esto se configura <b>una sola vez</b> por empleado. Después el sistema causa 15 días hábiles por año
          (por año calendario) y descuenta automáticamente lo que el empleado toma. No hay que “cerrar año” a mano.
        </span>
      </p>

      <label className="mb-6 flex max-w-md flex-col gap-1.5">
        <span className={lblCls}>Empleado</span>
        <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
          <option value="">— Selecciona —</option>
          {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
        </select>
      </label>

      {!empleadoId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-[#fff]/50">
          Selecciona un empleado para ver y ajustar su saldo de vacaciones.
        </div>
      ) : cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Configuración */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-[#fff]/85">Punto de partida</h2>
              {yaConfigurado && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <CheckCircle2 size={11} /> Ya configurado
                </span>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Días acumulados antes del corte</span>
                <input
                  type="number" inputMode="numeric" min={0} max={365} value={saldoInicial}
                  onChange={(e) => setSaldoInicial(Number(e.target.value))} className={inputCls}
                />
                <span className="text-[11px] text-[#fff]/40">Saldo que el empleado traía a la fecha de corte (0 si arranca desde cero).</span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fecha de corte</span>
                <input type="date" value={corte} onChange={(e) => setCorte(e.target.value)} className={inputCls} />
                <span className="text-[11px] text-[#fff]/40">
                  Desde esta fecha el sistema empieza a causar vacaciones{fechaIngreso ? ` (sugerido: ingreso ${fechaIngreso})` : ""}.
                </span>
              </label>
            </div>

            <div className="mt-4">
              <button onClick={guardar} disabled={guardando} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {yaConfigurado ? "Actualizar configuración" : "Guardar configuración inicial"}
              </button>
              {yaConfigurado && <p className="mt-2 text-[11px] text-[#fff]/40">Solo cámbialo si necesitas corregir un dato; en la operación normal no hace falta tocarlo.</p>}
            </div>

            {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
            {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}
          </section>

          {/* Saldo calculado */}
          <aside>
            <div className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-5">
              <div className="flex items-center gap-2">
                <Plane size={16} className="text-[var(--cyan)]" />
                <h2 className="text-sm font-semibold">Saldo actual</h2>
              </div>
              {saldo ? (
                <>
                  <p className="mt-2 font-display text-3xl font-bold text-[var(--cyan)]">{saldo.disponible} <span className="text-sm font-medium text-[#fff]/50">disponibles</span></p>
                  {saldo.noDisponible > 0 && (
                    <p className="text-sm font-semibold text-[#fff]/50">+{saldo.noDisponible} en curso (aún no disponibles)</p>
                  )}
                  <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs text-[#fff]/60">
                    <Row k="Año anterior" v={saldo.saldoInicial} />
                    <Row k="Causadas (años previos)" v={saldo.vencido} />
                    <Row k="Este año (en curso)" v={saldo.enCurso} />
                    <Row k="Pendiente por aprobar" v={saldo.pendiente} />
                    <Row k="Tomado" v={saldo.tomado} />
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-[#fff]/45">Sin datos.</p>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function Row({ k, v }: { k: string; v: number }) {
  return <div className="flex items-center justify-between"><span>{k}</span><b className="text-[#fff]/85">{v}</b></div>
}
