"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Loader2, Plus, Pencil, Trash2, X } from "lucide-react"
import type { Empresa } from "@/lib/empleados/contabilidad"
import { formatMoneda } from "@/lib/empleados/contabilidad"
import type { Moneda } from "@/lib/empleados/freelance"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

type Modo = "por_hora" | "por_mes" | ""
type Form = { id?: string; nombre: string; nit: string; contacto: string; notas: string; modo: Modo; tarifa: number; moneda: Moneda }
const vacio: Form = { nombre: "", nit: "", contacto: "", notas: "", modo: "", tarifa: 0, moneda: "COP" }

export function EmpresasClient() {
  const [items, setItems] = useState<Empresa[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<Empresa | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/empresas")
      const data = await res.json()
      if (res.ok) setItems(data.empresas ?? [])
      else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/empresas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          nombre: form.nombre, nit: form.nit || null, contacto: form.contacto || null, notas: form.notas || null,
          modo: form.modo || null, tarifa: form.tarifa, moneda: form.moneda,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally { setSaving(false) }
  }

  async function eliminar(x: Empresa) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/contabilidad/empresas?id=${x.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.filter((e) => e.id !== x.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  const modoTxt = (x: Empresa) =>
    x.modo ? `${x.modo === "por_hora" ? "Por hora" : "Por mes"}: ${formatMoneda(Number(x.tarifa) || 0, x.moneda)}` : "Sin tarifa definida"

  return (
    <div>
      <Link href="/empleados/admin/contabilidad" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contabilidad
      </Link>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Building2 size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Empresas</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{items.length}</span>
        </div>
        <button onClick={() => { setError(""); setForm({ ...vacio }) }} className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110">
          <Plus size={15} /> Nueva empresa
        </button>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">Clientes/contrapartes con su NIT y sus condiciones de facturación (por hora o por mes). Las cuentas de cobro heredan estos valores.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay empresas. Crea la primera.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((x) => (
            <div key={x.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{x.nombre}</p>
                <p className="text-xs text-[#fff]/50">{x.nit ? `NIT ${x.nit}` : "Sin NIT"}{x.contacto ? ` · ${x.contacto}` : ""}</p>
                <p className="mt-0.5 text-xs text-[var(--cyan)]">{modoTxt(x)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => { setError(""); setForm({ id: x.id, nombre: x.nombre, nit: x.nit ?? "", contacto: x.contacto ?? "", notas: x.notas ?? "", modo: (x.modo ?? "") as Modo, tarifa: Number(x.tarifa) || 0, moneda: x.moneda }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={15} /></button>
                <button onClick={() => setConfirmar(x)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar empresa" : "Nueva empresa"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Nombre / razón social</span>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="Empresa S.A.S" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>NIT (si tiene)</span>
                <input value={form.nit} onChange={(e) => setForm({ ...form, nit: e.target.value })} className={inputCls} placeholder="900.123.456-7" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Contacto</span>
                <input value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} className={inputCls} placeholder="Correo / teléfono" /></label>

              <div className="sm:col-span-2 mt-1 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50">Condiciones de facturación (opcional)</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>Modo</span>
                    <select value={form.modo} onChange={(e) => setForm({ ...form, modo: e.target.value as Modo })} className={inputCls}>
                      <option value="">— Sin definir —</option>
                      <option value="por_mes">Por mes</option>
                      <option value="por_hora">Por hora</option>
                    </select></label>
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>{form.modo === "por_hora" ? "Valor hora" : "Valor mes"}</span>
                    <input type="number" step="0.01" min="0" value={form.tarifa || ""} onChange={(e) => setForm({ ...form, tarifa: Number(e.target.value) })} className={inputCls} placeholder="0" /></label>
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                    <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value as Moneda })} className={inputCls}>
                      <option value="COP">COP</option>
                      <option value="USD">USD</option>
                    </select></label>
                </div>
              </div>

              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Notas</span>
                <input value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className={inputCls} placeholder="Opcional" /></label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo="Eliminar empresa"
        mensaje={`¿Eliminar "${confirmar?.nombre ?? ""}"? Los movimientos y cuentas de cobro que la referencian quedarán sin empresa.`}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminar(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
