"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Plus, Pencil, Trash2, X, Wallet, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight,
  CheckCircle2, Clock, Landmark,
} from "lucide-react"
import {
  type Cuenta, type Movimiento, type TipoMovimiento, type Moneda,
  CATEGORIAS, CATEGORIA_LABEL, TIPO_MOV_LABEL, MONEDAS_ORDEN, formatMoneda, resumen,
} from "@/lib/empleados/contabilidad"
import { MESES } from "@/lib/empleados/desprendible"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const anioActual = new Date().getFullYear()
const mesActual = new Date().getMonth() + 1
function hoyISO() {
  const d = new Date(); const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

type CuentaForm = { id?: string; nombre: string; banco: string; moneda: Moneda; saldo_inicial: number; activa: boolean }
type MovForm = {
  id?: string; cuenta_id: string; cuenta_destino_id: string; fecha: string; tipo: TipoMovimiento
  categoria: string; concepto: string; contraparte: string; valor: number; estado: "pendiente" | "realizado"; referencia: string
}

export function ContabilidadClient() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [anio, setAnio] = useState(anioActual)
  const [mes, setMes] = useState(mesActual)
  const [formCuenta, setFormCuenta] = useState<CuentaForm | null>(null)
  const [formMov, setFormMov] = useState<MovForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<null | { titulo: string; mensaje: string; run: () => Promise<void> }>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true); setError("")
    try {
      const [rc, rm] = await Promise.all([
        fetch("/api/empleados/admin/contabilidad/cuentas"),
        fetch("/api/empleados/admin/contabilidad/movimientos"),
      ])
      const dc = await rc.json(); const dm = await rm.json()
      if (!rc.ok) throw new Error(dc.error)
      if (!rm.ok) throw new Error(dm.error)
      setCuentas(dc.cuentas ?? []); setMovimientos(dm.movimientos ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  const res = useMemo(() => resumen(cuentas, movimientos, { anio, mes }), [cuentas, movimientos, anio, mes])
  const saldoPorCuenta = useMemo(() => new Map(res.porCuenta.map((p) => [p.cuenta.id, p.saldo])), [res])
  const nombreCuenta = useMemo(() => new Map(cuentas.map((c) => [c.id, c.nombre])), [cuentas])
  const monedaCuenta = useMemo(() => new Map(cuentas.map((c) => [c.id, c.moneda])), [cuentas])
  const movMes = useMemo(
    () => movimientos.filter((m) => Number(m.fecha.slice(0, 4)) === anio && Number(m.fecha.slice(5, 7)) === mes),
    [movimientos, anio, mes],
  )
  const monedasUsadas = MONEDAS_ORDEN.filter((mo) => cuentas.some((c) => c.moneda === mo))

  // ── Cuentas ────────────────────────────────────────────────────────────────
  async function guardarCuenta(e: React.FormEvent) {
    e.preventDefault(); if (!formCuenta) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/cuentas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formCuenta.id ? { id: formCuenta.id } : {}),
          nombre: formCuenta.nombre, banco: formCuenta.banco || null, moneda: formCuenta.moneda,
          saldo_inicial: formCuenta.saldo_inicial, activa: formCuenta.activa,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setFormCuenta(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la cuenta.")
    } finally { setSaving(false) }
  }

  function pedirEliminarCuenta(c: Cuenta) {
    setConfirmar({
      titulo: "Eliminar cuenta",
      mensaje: `¿Eliminar la cuenta "${c.nombre}"? Se borrarán también sus movimientos. Esta acción no se puede deshacer.`,
      run: async () => {
        setConfirmLoading(true)
        try {
          const res = await fetch(`/api/empleados/admin/contabilidad/cuentas?id=${c.id}`, { method: "DELETE" })
          const data = await res.json(); if (!res.ok) throw new Error(data.error)
          await cargar(); setConfirmar(null)
        } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
        finally { setConfirmLoading(false) }
      },
    })
  }

  // ── Movimientos ───────────────────────────────────────────────────────────
  function nuevoMov() {
    setError("")
    setFormMov({
      cuenta_id: cuentas[0]?.id ?? "", cuenta_destino_id: "", fecha: hoyISO(), tipo: "ingreso",
      categoria: "", concepto: "", contraparte: "", valor: 0, estado: "realizado", referencia: "",
    })
  }
  function editarMov(m: Movimiento) {
    setError("")
    setFormMov({
      id: m.id, cuenta_id: m.cuenta_id, cuenta_destino_id: m.cuenta_destino_id ?? "", fecha: m.fecha, tipo: m.tipo,
      categoria: m.categoria ?? "", concepto: m.concepto ?? "", contraparte: m.contraparte ?? "",
      valor: Number(m.valor) || 0, estado: m.estado, referencia: m.referencia ?? "",
    })
  }

  async function guardarMov(e: React.FormEvent) {
    e.preventDefault(); if (!formMov) return
    if (!formMov.cuenta_id) return setError("Selecciona una cuenta.")
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/movimientos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formMov.id ? { id: formMov.id } : {}),
          cuenta_id: formMov.cuenta_id,
          cuenta_destino_id: formMov.tipo === "traslado" ? formMov.cuenta_destino_id || null : null,
          fecha: formMov.fecha, tipo: formMov.tipo, categoria: formMov.categoria || null,
          concepto: formMov.concepto || null, contraparte: formMov.contraparte || null,
          valor: formMov.valor, estado: formMov.estado, referencia: formMov.referencia || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setFormMov(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el movimiento.")
    } finally { setSaving(false) }
  }

  async function toggleEstado(m: Movimiento) {
    setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/movimientos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: m.id, cuenta_id: m.cuenta_id, cuenta_destino_id: m.cuenta_destino_id,
          fecha: m.fecha, tipo: m.tipo, categoria: m.categoria, concepto: m.concepto,
          contraparte: m.contraparte, valor: Number(m.valor) || 0,
          estado: m.estado === "realizado" ? "pendiente" : "realizado", referencia: m.referencia,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setMovimientos((prev) => prev.map((x) => (x.id === m.id ? (data.movimiento as Movimiento) : x)))
    } catch (e) { setError(e instanceof Error ? e.message : "Error.") }
  }

  function pedirEliminarMov(m: Movimiento) {
    setConfirmar({
      titulo: "Eliminar movimiento",
      mensaje: "¿Eliminar este movimiento? Esta acción no se puede deshacer.",
      run: async () => {
        setConfirmLoading(true)
        try {
          const res = await fetch(`/api/empleados/admin/contabilidad/movimientos?id=${m.id}`, { method: "DELETE" })
          const data = await res.json(); if (!res.ok) throw new Error(data.error)
          setMovimientos((prev) => prev.filter((x) => x.id !== m.id)); setConfirmar(null)
        } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
        finally { setConfirmLoading(false) }
      },
    })
  }

  const TipoIcon = { ingreso: ArrowDownCircle, egreso: ArrowUpCircle, traslado: ArrowLeftRight }
  const tipoColor = { ingreso: "text-emerald-300", egreso: "text-red-300", traslado: "text-[var(--cyan)]" }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Wallet size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Contabilidad</h1>
        </div>
        <div className="flex items-center gap-2">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={`${inputCls} w-auto`}>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} w-24`} />
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Resumen por moneda */}
          {monedasUsadas.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-[#fff]/50">
              Crea tu primera cuenta para empezar a llevar la contabilidad.
            </div>
          ) : (
            monedasUsadas.map((mo) => {
              const r = res.porMoneda[mo]
              return (
                <div key={mo} className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-5">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-sm font-semibold text-[#fff]/80">Saldo total {mo}</h2>
                    <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatMoneda(r.saldo, mo)}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#fff]/60 sm:grid-cols-3 lg:grid-cols-5">
                    <span>Ingresos mes: <b className="text-emerald-300/90">{formatMoneda(r.ingresosMes, mo)}</b></span>
                    <span>Egresos mes: <b className="text-red-300/90">{formatMoneda(r.egresosMes, mo)}</b></span>
                    <span>Por cobrar: <b className="text-[#fff]/85">{formatMoneda(r.porCobrar, mo)}</b></span>
                    <span>Por pagar: <b className="text-[#fff]/85">{formatMoneda(r.porPagar, mo)}</b></span>
                    <span>Por trasladar: <b className="text-[#fff]/85">{formatMoneda(r.porTrasladar, mo)}</b></span>
                  </div>
                </div>
              )
            })
          )}

          {/* Cuentas */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><Landmark size={15} /> Cuentas</h2>
              <button onClick={() => setFormCuenta({ nombre: "", banco: "", moneda: "COP", saldo_inicial: 0, activa: true })} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cyan)] hover:underline">
                <Plus size={13} /> Nueva cuenta
              </button>
            </div>
            {cuentas.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-[#fff]/45">Aún no hay cuentas.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {cuentas.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{c.nombre} {!c.activa && <span className="text-[10px] text-[#fff]/40">(inactiva)</span>}</p>
                      <p className="text-xs text-[#fff]/50">{c.banco || "—"} · {c.moneda}</p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--cyan)]">{formatMoneda(saldoPorCuenta.get(c.id) ?? 0, c.moneda)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setFormCuenta({ id: c.id, nombre: c.nombre, banco: c.banco ?? "", moneda: c.moneda, saldo_inicial: Number(c.saldo_inicial) || 0, activa: c.activa })} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                      <button onClick={() => pedirEliminarCuenta(c)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Movimientos del mes */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#fff]/80">Movimientos · {MESES[mes - 1]} {anio}</h2>
              <button onClick={nuevoMov} disabled={cuentas.length === 0} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cyan)] px-3 py-1.5 text-xs font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-40">
                <Plus size={13} /> Nuevo movimiento
              </button>
            </div>
            {movMes.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-[#fff]/45">No hay movimientos en {MESES[mes - 1]} {anio}.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {movMes.map((m) => {
                  const Icon = TipoIcon[m.tipo]
                  const mo = monedaCuenta.get(m.cuenta_id) ?? "COP"
                  return (
                    <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={tipoColor[m.tipo]} />
                        <div>
                          <p className="text-sm font-medium">
                            {m.concepto || CATEGORIA_LABEL[m.categoria ?? ""] || TIPO_MOV_LABEL[m.tipo]}
                            {m.tipo === "traslado" && <span className="text-[#fff]/50"> → {nombreCuenta.get(m.cuenta_destino_id ?? "") ?? "—"}</span>}
                          </p>
                          <p className="text-xs text-[#fff]/50">
                            {m.fecha} · {nombreCuenta.get(m.cuenta_id) ?? "—"}
                            {m.contraparte ? ` · ${m.contraparte}` : ""}
                            {m.categoria ? ` · ${CATEGORIA_LABEL[m.categoria] ?? m.categoria}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${tipoColor[m.tipo]}`}>
                          {m.tipo === "egreso" ? "−" : m.tipo === "ingreso" ? "+" : ""}{formatMoneda(m.valor, mo)}
                        </span>
                        <button onClick={() => toggleEstado(m)} title={m.estado === "realizado" ? "Marcar pendiente" : "Marcar realizado"} className={`rounded-full p-1 ${m.estado === "realizado" ? "text-emerald-300" : "text-amber-300"}`}>
                          {m.estado === "realizado" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </button>
                        <button onClick={() => editarMov(m)} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                        <button onClick={() => pedirEliminarMov(m)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal cuenta */}
      {formCuenta && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarCuenta} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{formCuenta.id ? "Editar cuenta" : "Nueva cuenta"}</h2>
              <button type="button" onClick={() => setFormCuenta(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Nombre</span>
                <input required value={formCuenta.nombre} onChange={(e) => setFormCuenta({ ...formCuenta, nombre: e.target.value })} className={inputCls} placeholder="Cuenta principal" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Banco</span>
                <input value={formCuenta.banco} onChange={(e) => setFormCuenta({ ...formCuenta, banco: e.target.value })} className={inputCls} placeholder="Bancolombia…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                <select value={formCuenta.moneda} onChange={(e) => setFormCuenta({ ...formCuenta, moneda: e.target.value as Moneda })} className={inputCls}>
                  {MONEDAS_ORDEN.map((m) => <option key={m} value={m}>{m}</option>)}
                </select></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Saldo inicial (punto de partida)</span>
                <input type="number" step="0.01" value={formCuenta.saldo_inicial || ""} onChange={(e) => setFormCuenta({ ...formCuenta, saldo_inicial: Number(e.target.value) })} className={inputCls} placeholder="0" /></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75 sm:col-span-2">
                <input type="checkbox" checked={formCuenta.activa} onChange={(e) => setFormCuenta({ ...formCuenta, activa: e.target.checked })} className="h-4 w-4 accent-[var(--cyan)]" /> Cuenta activa
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormCuenta(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal movimiento */}
      {formMov && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarMov} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{formMov.id ? "Editar movimiento" : "Nuevo movimiento"}</h2>
              <button type="button" onClick={() => setFormMov(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Tipo</span>
                <select value={formMov.tipo} onChange={(e) => setFormMov({ ...formMov, tipo: e.target.value as TipoMovimiento })} className={inputCls}>
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                  <option value="traslado">Traslado entre cuentas</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha</span>
                <input type="date" value={formMov.fecha} onChange={(e) => setFormMov({ ...formMov, fecha: e.target.value })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>{formMov.tipo === "traslado" ? "Cuenta origen" : "Cuenta"}</span>
                <select value={formMov.cuenta_id} onChange={(e) => setFormMov({ ...formMov, cuenta_id: e.target.value })} className={inputCls}>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
              {formMov.tipo === "traslado" && (
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Cuenta destino</span>
                  <select value={formMov.cuenta_destino_id} onChange={(e) => setFormMov({ ...formMov, cuenta_destino_id: e.target.value })} className={inputCls}>
                    <option value="">— Selecciona —</option>
                    {cuentas.filter((c) => c.id !== formMov.cuenta_id).map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                  </select></label>
              )}
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor</span>
                <input type="number" step="0.01" min="0" value={formMov.valor || ""} onChange={(e) => setFormMov({ ...formMov, valor: Number(e.target.value) })} className={inputCls} placeholder="0" /></label>
              {formMov.tipo !== "traslado" && (
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Categoría</span>
                  <select value={formMov.categoria} onChange={(e) => setFormMov({ ...formMov, categoria: e.target.value })} className={inputCls}>
                    <option value="">— Sin categoría —</option>
                    {CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
                  </select></label>
              )}
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Concepto</span>
                <input value={formMov.concepto} onChange={(e) => setFormMov({ ...formMov, concepto: e.target.value })} className={inputCls} placeholder="Descripción" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Contraparte</span>
                <input value={formMov.contraparte} onChange={(e) => setFormMov({ ...formMov, contraparte: e.target.value })} className={inputCls} placeholder="De quién / a quién" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Referencia</span>
                <input value={formMov.referencia} onChange={(e) => setFormMov({ ...formMov, referencia: e.target.value })} className={inputCls} placeholder="N.º transferencia / factura" /></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Estado</span>
                <select value={formMov.estado} onChange={(e) => setFormMov({ ...formMov, estado: e.target.value as "pendiente" | "realizado" })} className={inputCls}>
                  <option value="realizado">Realizado</option>
                  <option value="pendiente">Pendiente (por cobrar / pagar / trasladar)</option>
                </select></label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormMov(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo={confirmar?.titulo ?? ""}
        mensaje={confirmar?.mensaje ?? ""}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar?.run()}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
