"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Users, CheckCircle2, ShieldCheck, Plus, Gift, PiggyBank } from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import type { Cuenta, Movimiento } from "@/lib/empleados/contabilidad"
import { formatMoneda } from "@/lib/empleados/contabilidad"
import { calcularPrima, calcularCesantias, calcularInteresesCesantias } from "@/lib/empleados/contrato"
import { dias360 } from "@/lib/empleados/liquidacion"
import { MESES } from "@/lib/empleados/desprendible"
import { MoneyInput } from "../../../money-input"

/** Datos por empleado para sugerir el valor a pagar y estimar prima/cesantías. */
export type SugeridoNomina = {
  id: string; salarioBasico: number; auxilio: number; devengado: number
  seguridadSocial: number; neto: number; fechaIngreso: string | null
}

/** Obligación prestacional del MES seleccionado (prima en jun/dic, cesantías/intereses en ene/feb). */
type Prestacional = { key: "prima" | "cesantias" | "intereses_cesantias"; titulo: string; nota: string; icon: typeof Gift }
function prestacionalDelMes(mes: number): Prestacional | null {
  if (mes === 6) return { key: "prima", titulo: "Prima de servicios · primer semestre", nota: "Se paga a más tardar el 30 de junio (ene–jun).", icon: Gift }
  if (mes === 12) return { key: "prima", titulo: "Prima de servicios · segundo semestre", nota: "Se paga a más tardar el 20 de diciembre (jul–dic).", icon: Gift }
  if (mes === 2) return { key: "cesantias", titulo: "Cesantías al fondo (año anterior)", nota: "Se consignan al fondo a más tardar el 14 de febrero.", icon: PiggyBank }
  if (mes === 1) return { key: "intereses_cesantias", titulo: "Intereses de cesantías (año anterior)", nota: "Se pagan al empleado a más tardar el 31 de enero.", icon: PiggyBank }
  return null
}

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const anioActual = new Date().getFullYear()
const mesActual = new Date().getMonth() + 1
function hoyISO() {
  const d = new Date(); const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function NominaClient({ empleados, cuentas, sugeridos }: { empleados: Empleado[]; cuentas: Cuenta[]; sugeridos: SugeridoNomina[] }) {
  const sugMap = useMemo(() => new Map(sugeridos.map((s) => [s.id, s])), [sugeridos])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [anio, setAnio] = useState(anioActual)
  const [mes, setMes] = useState(mesActual)
  const [busy, setBusy] = useState<string | null>(null)
  // Formulario por empleado: monto + cuenta seleccionada.
  const [montos, setMontos] = useState<Record<string, number>>({})
  const [cuentaSel, setCuentaSel] = useState<Record<string, string>>({})
  // Seguridad social (sale de una sola cuenta).
  const [ssMonto, setSsMonto] = useState(0)
  const [ssCuenta, setSsCuenta] = useState("")

  const cuentaCOP = useMemo(() => cuentas[0]?.id ?? "", [cuentas])

  async function cargar() {
    setCargando(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/movimientos")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMovimientos(data.movimientos ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  const nombreCuenta = useMemo(() => new Map(cuentas.map((c) => [c.id, c.nombre])), [cuentas])
  const delMes = (m: Movimiento) => Number(m.fecha.slice(0, 4)) === anio && Number(m.fecha.slice(5, 7)) === mes

  // Pagos de salario del mes por empleado.
  const pagosPorEmpleado = useMemo(() => {
    const map = new Map<string, Movimiento[]>()
    for (const m of movimientos) {
      if (m.tipo !== "egreso" || m.categoria !== "salario" || !m.empleado_id || !delMes(m)) continue
      const arr = map.get(m.empleado_id) ?? []; arr.push(m); map.set(m.empleado_id, arr)
    }
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimientos, anio, mes])

  const ssDelMes = useMemo(
    () => movimientos.filter((m) => m.tipo === "egreso" && m.categoria === "seguridad_social" && delMes(m)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [movimientos, anio, mes],
  )
  const ssPagado = ssDelMes.reduce((a, m) => a + (Number(m.valor) || 0), 0)

  // Prestación social del mes seleccionado (prima/cesantías/intereses), con valor estimado por empleado.
  const prestacional = useMemo(() => prestacionalDelMes(mes), [mes])
  /** Valor estimado de la prestación del mes para un empleado (0 si no aplica o sin datos). */
  function estimarPrestacion(s: SugeridoNomina | undefined): number {
    if (!s || !prestacional || !s.fechaIngreso) return 0
    const base = s.salarioBasico + s.auxilio
    const p = (a: string, b: string) => dias360(s.fechaIngreso! > a ? s.fechaIngreso! : a, b)
    if (prestacional.key === "prima") {
      // Semestre según el mes: junio → ene-jun del año; diciembre → jul-dic del año.
      const [ini, fin] = mes === 6 ? [`${anio}-01-01`, `${anio}-06-30`] : [`${anio}-07-01`, `${anio}-12-31`]
      return calcularPrima({ basico: s.salarioBasico, auxilio: s.auxilio, dias: p(ini, fin) })
    }
    // Cesantías e intereses: sobre el AÑO ANTERIOR (ene-dic).
    const y = anio - 1
    const ces = calcularCesantias(base, p(`${y}-01-01`, `${y}-12-31`))
    return prestacional.key === "cesantias" ? ces : calcularInteresesCesantias(ces, p(`${y}-01-01`, `${y}-12-31`))
  }
  // Pagos prestacionales ya registrados este mes (para marcar "Pagado").
  const prestacionPorEmpleado = useMemo(() => {
    const map = new Map<string, number>()
    if (!prestacional) return map
    for (const m of movimientos) {
      if (m.tipo !== "egreso" || m.categoria !== prestacional.key || !m.empleado_id || !delMes(m)) continue
      map.set(m.empleado_id, (map.get(m.empleado_id) ?? 0) + (Number(m.valor) || 0))
    }
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimientos, anio, mes, prestacional])

  async function registrarPago(empleadoId: string | null, valor: number, cuentaId: string, categoria: "salario" | "seguridad_social" | "prima" | "cesantias" | "intereses_cesantias", concepto: string, busyKey?: string) {
    if (!cuentaId) return setError("Elige la cuenta de la que sale el dinero.")
    if (!valor || valor <= 0) return setError("Indica el valor del pago.")
    setError(""); setMsg(""); setBusy(busyKey ?? empleadoId ?? "ss")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/movimientos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuenta_id: cuentaId, fecha: hoyISO(), tipo: "egreso", categoria,
          concepto, empleado_id: empleadoId, valor, estado: "realizado",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Pago registrado como egreso.")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al registrar el pago.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <Link href="/empleados/admin/contabilidad" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contabilidad
      </Link>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Users size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Pagos a empleados</h1>
        </div>
        <div className="flex items-center gap-2">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={`${inputCls} w-auto`}>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} w-24`} />
        </div>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">Registra el pago de salario de cada empleado y de qué cuenta salió. Un salario puede pagarse desde <b className="text-[#fff]/75">más de una cuenta</b> (registra un pago por cada una). Los freelance se pagan por sus facturas.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="mb-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {cuentas.length === 0 && <p className="mb-4 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200">Primero crea al menos una cuenta en Contabilidad.</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Seguridad social (una sola cuenta) */}
          <section className="rounded-2xl border border-[#00BFA6]/25 bg-[#00BFA6]/[0.05] p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#00BFA6]" />
              <h2 className="text-sm font-semibold text-[#fff]/85">Seguridad social · {MESES[mes - 1]} {anio}</h2>
              {ssPagado > 0 && <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Pagado {formatMoneda(ssPagado, "COP")}</span>}
            </div>
            <p className="mb-3 text-[11px] text-[#fff]/45">El pago de seguridad social sale de una sola cuenta.</p>
            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor</span>
                <div className="w-40"><MoneyInput value={ssMonto} onChange={setSsMonto} className={inputCls} /></div></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Cuenta</span>
                <select value={ssCuenta} onChange={(e) => setSsCuenta(e.target.value)} className={`${inputCls} w-52`}>
                  <option value="">— Elige —</option>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
              <button
                onClick={() => registrarPago(null, ssMonto, ssCuenta, "seguridad_social", `Seguridad social ${MESES[mes - 1]} ${anio}`)}
                disabled={busy === "ss"}
                className="inline-flex items-center gap-2 rounded-lg bg-[#00BFA6] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60"
              >
                {busy === "ss" ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Registrar
              </button>
            </div>
          </section>

          {/* Empleados */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Salarios · {MESES[mes - 1]} {anio} <span className="text-[#fff]/45">({empleados.length})</span></h2>
            {empleados.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">No hay empleados laborales activos.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {empleados.map((e) => {
                  const pagos = pagosPorEmpleado.get(e.id) ?? []
                  const pagado = pagos.reduce((a, m) => a + (Number(m.valor) || 0), 0)
                  return (
                    <div key={e.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{e.nombre} <span className="text-[#fff]/45">· {e.cargo || "—"}</span></p>
                          {(() => { const s = sugMap.get(e.id); return s && s.devengado > 0 ? (
                            <p className="mt-0.5 text-[11px] text-[#fff]/45">
                              Según contrato: devengado {formatMoneda(s.devengado, "COP")} − seg. social {formatMoneda(s.seguridadSocial, "COP")} = <b className="text-[var(--cyan)]/90">neto {formatMoneda(s.neto, "COP")}</b>
                            </p>
                          ) : null })()}
                          {pagado > 0 && (
                            <p className="mt-0.5 text-xs text-emerald-300/90">
                              Pagado {formatMoneda(pagado, "COP")}
                              <span className="text-[#fff]/45"> · {pagos.map((p) => nombreCuenta.get(p.cuenta_id) ?? "—").join(", ")}</span>
                            </p>
                          )}
                        </div>
                        {pagado > 0 && <CheckCircle2 size={16} className="text-emerald-300" />}
                      </div>
                      <div className="mt-2 flex flex-wrap items-end gap-2 border-t border-white/[0.06] pt-2">
                        <label className="flex flex-col gap-1"><span className={lblCls}>Valor</span>
                          <div className="w-36"><MoneyInput value={montos[e.id] ?? sugMap.get(e.id)?.neto ?? 0} onChange={(n) => setMontos({ ...montos, [e.id]: n })} className={inputCls} /></div></label>
                        <label className="flex flex-col gap-1"><span className={lblCls}>Sale de la cuenta</span>
                          <select value={cuentaSel[e.id] ?? cuentaCOP} onChange={(ev) => setCuentaSel({ ...cuentaSel, [e.id]: ev.target.value })} className={`${inputCls} w-48`}>
                            <option value="">— Elige —</option>
                            {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                          </select></label>
                        <button
                          onClick={() => registrarPago(e.id, montos[e.id] ?? sugMap.get(e.id)?.neto ?? 0, cuentaSel[e.id] ?? cuentaCOP, "salario", `Salario ${e.nombre} · ${MESES[mes - 1]} ${anio}`)}
                          disabled={busy === e.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-3 py-2 text-xs font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60"
                        >
                          {busy === e.id ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Registrar pago
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Prestaciones sociales: solo aparece en su mes de ley (prima jun/dic, cesantías/intereses ene/feb). */}
          {prestacional && empleados.length > 0 && (
            <section className="rounded-2xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/[0.05] p-5">
              <div className="mb-1 flex items-center gap-2">
                <prestacional.icon size={16} className="text-[#8b5cf6]" />
                <h2 className="text-sm font-semibold text-[#fff]/85">{prestacional.titulo}</h2>
              </div>
              <p className="mb-3 text-[11px] text-[#fff]/45">{prestacional.nota} El valor es un estimado por contrato (base salarial × días ÷ 360); ajústalo si tienes variables (comisiones, horas extra).</p>
              <div className="flex flex-col gap-2">
                {empleados.map((e) => {
                  const s = sugMap.get(e.id)
                  const sugerido = estimarPrestacion(s)
                  const pagado = prestacionPorEmpleado.get(e.id) ?? 0
                  const busyKey = `prest-${e.id}`
                  const concepto = `${prestacional.titulo} · ${e.nombre} · ${anio}`
                  return (
                    <div key={e.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{e.nombre} <span className="text-[#fff]/45">· {e.cargo || "—"}</span></p>
                          <p className="mt-0.5 text-[11px] text-[#fff]/45">Estimado: <b className="text-[#8b5cf6]">{formatMoneda(sugerido, "COP")}</b>{!s?.fechaIngreso ? " · falta fecha de ingreso" : ""}</p>
                          {pagado > 0 && <p className="mt-0.5 text-xs text-emerald-300/90">Pagado {formatMoneda(pagado, "COP")}</p>}
                        </div>
                        {pagado > 0 && <CheckCircle2 size={16} className="text-emerald-300" />}
                      </div>
                      <div className="mt-2 flex flex-wrap items-end gap-2 border-t border-white/[0.06] pt-2">
                        <label className="flex flex-col gap-1"><span className={lblCls}>Valor</span>
                          <div className="w-36"><MoneyInput value={montos[busyKey] ?? sugerido} onChange={(n) => setMontos({ ...montos, [busyKey]: n })} className={inputCls} /></div></label>
                        <label className="flex flex-col gap-1"><span className={lblCls}>Sale de la cuenta</span>
                          <select value={cuentaSel[busyKey] ?? cuentaCOP} onChange={(ev) => setCuentaSel({ ...cuentaSel, [busyKey]: ev.target.value })} className={`${inputCls} w-48`}>
                            <option value="">— Elige —</option>
                            {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                          </select></label>
                        <button
                          onClick={() => registrarPago(e.id, montos[busyKey] ?? sugerido, cuentaSel[busyKey] ?? cuentaCOP, prestacional.key, concepto, busyKey)}
                          disabled={busy === busyKey}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-3 py-2 text-xs font-semibold text-[#0d0a1a] transition hover:brightness-110 disabled:opacity-60"
                        >
                          {busy === busyKey ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Registrar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
