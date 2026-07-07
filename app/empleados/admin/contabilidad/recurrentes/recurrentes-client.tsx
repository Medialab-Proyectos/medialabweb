"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Repeat, Plus, Pencil, Trash2, X, Save, CircleDollarSign } from "lucide-react"
import type { Cuenta, GastoRecurrente, Moneda } from "@/lib/empleados/contabilidad"
import { CATEGORIAS, CATEGORIA_LABEL, formatMoneda } from "@/lib/empleados/contabilidad"
import { MoneyInput } from "../../../money-input"
import { ConfirmDialog } from "../../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

function hoyISO() {
  const d = new Date(); const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

type Form = { id?: string; nombre: string; categoria: string; proveedor: string; moneda: Moneda; valor: number; cuenta_id: string; activo: boolean }
const vacio: Form = { nombre: "", categoria: "suscripcion", proveedor: "", moneda: "COP", valor: 0, cuenta_id: "", activo: true }

// Sugerencias frecuentes (el CEO puede crear cualquier otro).
const SUGERIDOS = ["Google Workspace", "Dominio", "ChatGPT", "Claude", "Figma", "Contador"]

export function RecurrentesClient({ cuentas }: { cuentas: Cuenta[] }) {
  const [items, setItems] = useState<GastoRecurrente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [pagar, setPagar] = useState<GastoRecurrente | null>(null)
  const [pagoFecha, setPagoFecha] = useState(hoyISO())
  const [pagoCuenta, setPagoCuenta] = useState("")
  const [pagoValor, setPagoValor] = useState(0)
  const [pagando, setPagando] = useState(false)
  const [confirmar, setConfirmar] = useState<GastoRecurrente | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const nombreCuenta = useMemo(() => new Map(cuentas.map((c) => [c.id, c.nombre])), [cuentas])

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/gastos-recurrentes")
      const data = await res.json()
      if (res.ok) setItems(data.gastos ?? []); else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/gastos-recurrentes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "guardar", ...(form.id ? { id: form.id } : {}),
          nombre: form.nombre, categoria: form.categoria || null, proveedor: form.proveedor || null,
          moneda: form.moneda, valor: form.valor, cuenta_id: form.cuenta_id || null, activo: form.activo,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setSaving(false) }
  }

  function abrirPago(g: GastoRecurrente) {
    setError(""); setMsg("")
    setPagar(g); setPagoFecha(hoyISO()); setPagoCuenta(g.cuenta_id ?? cuentas[0]?.id ?? ""); setPagoValor(Number(g.valor) || 0)
  }

  async function registrarPago() {
    if (!pagar) return
    if (!pagoCuenta) return setError("Elige la cuenta.")
    setPagando(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/gastos-recurrentes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "pagar", id: pagar.id, fecha: pagoFecha, cuenta_id: pagoCuenta, valor: pagoValor, estado: "realizado" }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setMsg(`✓ Pago de ${pagar.nombre} registrado como egreso.`)
      setPagar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al registrar el pago.") }
    finally { setPagando(false) }
  }

  async function eliminar(g: GastoRecurrente) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/contabilidad/gastos-recurrentes?id=${g.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.filter((x) => x.id !== g.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  return (
    <div>
      <Link href="/empleados/admin/contabilidad" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contabilidad
      </Link>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Repeat size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Gastos recurrentes</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{items.length}</span>
        </div>
        <button onClick={() => { setError(""); setForm({ ...vacio }) }} className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110">
          <Plus size={15} /> Nuevo gasto
        </button>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">Suscripciones y servicios que se pagan cada mes (Google, dominio, ChatGPT, Claude, Figma, contador…). Crea cada uno y usa <b className="text-[#fff]/75">Registrar pago</b> cada mes para crear el egreso.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="mb-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay gastos recurrentes.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((g) => (
            <div key={g.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{g.nombre} {!g.activo && <span className="text-[10px] text-[#fff]/40">(inactivo)</span>}</p>
                <p className="text-xs text-[#fff]/50">
                  {formatMoneda(Number(g.valor) || 0, g.moneda)}{g.categoria ? ` · ${CATEGORIA_LABEL[g.categoria] ?? g.categoria}` : ""}
                  {g.cuenta_id ? ` · ${nombreCuenta.get(g.cuenta_id) ?? ""}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => abrirPago(g)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20"><CircleDollarSign size={13} /> Registrar pago</button>
                <button onClick={() => { setError(""); setForm({ id: g.id, nombre: g.nombre, categoria: g.categoria ?? "", proveedor: g.proveedor ?? "", moneda: g.moneda, valor: Number(g.valor) || 0, cuenta_id: g.cuenta_id ?? "", activo: g.activo }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                <button onClick={() => setConfirmar(g)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar gasto" : "Nuevo gasto recurrente"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Nombre</span>
                <input required list="cat-recurrentes" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="Google Workspace, dominio…" />
                <datalist id="cat-recurrentes">{SUGERIDOS.map((s) => <option key={s} value={s} />)}</datalist>
              </label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Categoría</span>
                <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={inputCls}>
                  <option value="">— Sin categoría —</option>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Proveedor (opcional)</span>
                <input value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} className={inputCls} placeholder="Google, OpenAI…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value as Moneda })} className={inputCls}>
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor mensual ({form.moneda})</span>
                <MoneyInput value={form.valor} onChange={(n) => setForm({ ...form, valor: n })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Cuenta habitual (opcional)</span>
                <select value={form.cuenta_id} onChange={(e) => setForm({ ...form, cuenta_id: e.target.value })} className={inputCls}>
                  <option value="">— Elegir al pagar —</option>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75 sm:col-span-2">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 accent-[var(--cyan)]" /> Activo
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal registrar pago */}
      {pagar && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Registrar pago · {pagar.nombre}</h2>
              <button onClick={() => setPagar(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha</span>
                <input type="date" value={pagoFecha} onChange={(e) => setPagoFecha(e.target.value)} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor ({pagar.moneda})</span>
                <MoneyInput value={pagoValor} onChange={setPagoValor} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Sale de la cuenta</span>
                <select value={pagoCuenta} onChange={(e) => setPagoCuenta(e.target.value)} className={inputCls}>
                  <option value="">— Elige —</option>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setPagar(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button onClick={registrarPago} disabled={pagando} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {pagando ? <Loader2 size={14} className="animate-spin" /> : <CircleDollarSign size={14} />} Registrar egreso
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo="Eliminar gasto recurrente"
        mensaje={`¿Eliminar "${confirmar?.nombre}"? Los egresos ya registrados no se borran.`}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminar(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
