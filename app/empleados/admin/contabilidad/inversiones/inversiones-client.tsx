"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Loader2, Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react"
import type { Inversion, EstadoInversion, Cuenta } from "@/lib/empleados/contabilidad"
import { formatMoneda } from "@/lib/empleados/contabilidad"
import type { Moneda } from "@/lib/empleados/freelance"
import { MoneyInput } from "../../../money-input"
import { ConfirmDialog } from "../../../confirm-dialog"
import { EstrategiaPanel, type DatosEstrategia } from "./estrategia-panel"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

function hoyISO() { const d = new Date(); const p = (x: number) => String(x).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }
function diasHasta(iso: string | null): number | null {
  if (!iso) return null
  return Math.ceil((Date.parse(iso) - Date.now()) / 86_400_000)
}

type Form = {
  id?: string; entidad: string; tipo: string; monto: number; moneda: Moneda; tasa: number
  rendimiento_esperado: number; rendimiento_real: number; fecha_apertura: string; fecha_vencimiento: string
  cuenta_id: string; estado: EstadoInversion; notas: string
}
const vacio: Form = {
  entidad: "", tipo: "CDT", monto: 0, moneda: "COP", tasa: 0, rendimiento_esperado: 0, rendimiento_real: 0,
  fecha_apertura: hoyISO(), fecha_vencimiento: "", cuenta_id: "", estado: "abierta", notas: "",
}

export function InversionesClient({ estrategia }: { estrategia?: DatosEstrategia }) {
  const [items, setItems] = useState<Inversion[]>([])
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<Inversion | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const [ri, rc] = await Promise.all([
        fetch("/api/empleados/admin/contabilidad/inversiones"),
        fetch("/api/empleados/admin/contabilidad/cuentas"),
      ])
      const di = await ri.json(); if (ri.ok) setItems(di.inversiones ?? []); else setError(di.error || "Error al cargar.")
      const dc = await rc.json(); if (rc.ok) setCuentas(dc.cuentas ?? [])
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/inversiones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          entidad: form.entidad, tipo: form.tipo || null, monto: form.monto, moneda: form.moneda,
          tasa: form.tasa || null, rendimiento_esperado: form.rendimiento_esperado,
          rendimiento_real: form.estado === "cerrada" ? form.rendimiento_real : null,
          fecha_apertura: form.fecha_apertura, fecha_vencimiento: form.fecha_vencimiento || null,
          cuenta_id: form.cuenta_id || null, estado: form.estado, notas: form.notas || null,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setSaving(false) }
  }

  async function eliminar(x: Inversion) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/contabilidad/inversiones?id=${x.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.filter((i) => i.id !== x.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  const abiertas = items.filter((i) => i.estado === "abierta")
  const totalInvertido = abiertas.reduce((a, i) => a + (Number(i.monto) || 0), 0)

  return (
    <div>
      <Link href="/empleados/admin/contabilidad" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contabilidad
      </Link>
      <div className="mb-3 flex items-center gap-2.5">
        <TrendingUp size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Inversiones</h1>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{items.length}</span>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">CDTs y otras inversiones. Al cerrarlas, registra el rendimiento real (cuéntalo como ingreso en Movimientos). Total abierto: <b className="text-[var(--cyan)]">{formatMoneda(totalInvertido, "COP")}</b> en {abiertas.length} inversión(es).</p>

      {/* Estrategia de tesorería: qué corresponde hacer ANTES de invertir, con datos reales. */}
      {estrategia && <EstrategiaPanel datos={estrategia} />}
      {/* En móvil el botón va debajo del título y la descripción, a todo el ancho. */}
      <button onClick={() => { setError(""); setForm({ ...vacio }) }} className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 sm:w-auto sm:py-2">
        <Plus size={15} /> Nueva inversión
      </button>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay inversiones registradas.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((x) => {
            const dias = x.estado === "abierta" ? diasHasta(x.fecha_vencimiento) : null
            const porVencer = dias !== null && dias <= 15
            return (
              <div key={x.id} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${porVencer ? "border-amber-400/30 bg-amber-400/[0.06]" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {x.entidad}{x.tipo ? ` · ${x.tipo}` : ""} · <span className="text-[var(--cyan)]">{formatMoneda(Number(x.monto) || 0, x.moneda)}</span>
                    {x.estado === "cerrada" && <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[#fff]/50">cerrada</span>}
                  </p>
                  <p className="text-xs text-[#fff]/50">
                    {x.tasa ? `${x.tasa}% E.A. · ` : ""}Intereses esperados {formatMoneda(Number(x.rendimiento_esperado) || 0, x.moneda)}
                    {x.fecha_vencimiento ? ` · vence ${x.fecha_vencimiento}` : ""}
                    {x.estado === "cerrada" && x.rendimiento_real != null ? ` · rend. real ${formatMoneda(Number(x.rendimiento_real) || 0, x.moneda)}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {porVencer && <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300"><AlertTriangle size={10} /> {dias! < 0 ? "vencida" : `${dias}d`}</span>}
                  <button onClick={() => { setError(""); setForm({ id: x.id, entidad: x.entidad, tipo: x.tipo ?? "", monto: Number(x.monto) || 0, moneda: x.moneda, tasa: Number(x.tasa) || 0, rendimiento_esperado: Number(x.rendimiento_esperado) || 0, rendimiento_real: Number(x.rendimiento_real) || 0, fecha_apertura: x.fecha_apertura, fecha_vencimiento: x.fecha_vencimiento ?? "", cuenta_id: x.cuenta_id ?? "", estado: x.estado, notas: x.notas ?? "" }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                  <button onClick={() => setConfirmar(x)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar inversión" : "Nueva inversión"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Entidad</span>
                <input required value={form.entidad} onChange={(e) => setForm({ ...form, entidad: e.target.value })} className={inputCls} placeholder="Bancolombia" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Tipo</span>
                <input value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className={inputCls} placeholder="CDT, fondo…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Monto</span>
                <MoneyInput value={form.monto} onChange={(n) => setForm({ ...form, monto: n })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value as Moneda })} className={inputCls}>
                  <option value="COP">COP</option><option value="USD">USD</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Tasa (% E.A.)</span>
                <input type="number" step="0.01" min="0" value={form.tasa || ""} onChange={(e) => setForm({ ...form, tasa: Number(e.target.value) })} className={inputCls} placeholder="0" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Intereses que esperas ganar</span>
                <MoneyInput value={form.rendimiento_esperado} onChange={(n) => setForm({ ...form, rendimiento_esperado: n })} className={inputCls} />
                <span className="text-[10px] leading-relaxed text-[#fff]/40">
                  Cuánto dinero <b className="text-[#fff]/60">extra</b> esperas recibir al vencimiento, aparte del monto invertido.
                  Ej.: si inviertes $10.000.000 al 10% E.A. a un año, aquí van $1.000.000 (al final recibes $11.000.000).
                </span></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha de apertura</span>
                <input type="date" value={form.fecha_apertura} onChange={(e) => setForm({ ...form, fecha_apertura: e.target.value })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha de vencimiento</span>
                <input type="date" value={form.fecha_vencimiento} onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Cuenta origen (opcional)</span>
                <select value={form.cuenta_id} onChange={(e) => setForm({ ...form, cuenta_id: e.target.value })} className={inputCls}>
                  <option value="">— Ninguna —</option>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Estado</span>
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoInversion })} className={inputCls}>
                  <option value="abierta">Abierta</option><option value="cerrada">Cerrada</option>
                </select></label>
              {form.estado === "cerrada" && (
                <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Rendimiento real (cuéntalo como ingreso en Movimientos)</span>
                  <MoneyInput value={form.rendimiento_real} onChange={(n) => setForm({ ...form, rendimiento_real: n })} className={inputCls} /></label>
              )}
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Notas</span>
                <input value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className={inputCls} placeholder="Opcional" /></label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog abierto={!!confirmar} titulo="Eliminar inversión" mensaje="¿Eliminar esta inversión? Esta acción no se puede deshacer." confirmLabel="Eliminar" tone="danger" cargando={confirmLoading} onConfirm={() => confirmar && eliminar(confirmar)} onCancel={() => setConfirmar(null)} />
    </div>
  )
}
