"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Wrench, Loader2, Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react"
import { type Herramienta, type TipoHerramienta, TIPO_HERRAMIENTA_LABEL } from "@/lib/empleados/herramienta"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

type Form = {
  id?: string; nombre: string; tipo: TipoHerramienta; url: string; usuario: string; clave: string; indicaciones: string; activa: boolean
}
const vacio: Form = { nombre: "", tipo: "compartida", url: "", usuario: "", clave: "", indicaciones: "", activa: true }

export function HerramientasAdminClient() {
  const [items, setItems] = useState<Herramienta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<Herramienta | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/admin/herramientas")
      const data = await res.json()
      if (res.ok) setItems(data.herramientas ?? [])
      else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError(""); setMsg("")
    try {
      const res = await fetch("/api/empleados/admin/herramientas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          nombre: form.nombre, tipo: form.tipo, url: form.url || null,
          usuario: form.tipo === "compartida" ? form.usuario || null : null,
          clave: form.tipo === "compartida" ? form.clave || null : null,
          indicaciones: form.indicaciones || null, activa: form.activa,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
      setMsg(data.notificado ? "✓ Guardada. Se notificó a los empleados activos." : "✓ Guardada.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally { setSaving(false) }
  }

  async function eliminar(h: Herramienta) {
    setConfirmLoading(true); setMsg("")
    try {
      const res = await fetch(`/api/empleados/admin/herramientas?id=${h.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.filter((x) => x.id !== h.id)); setConfirmar(null)
      setMsg(data.notificado ? "✓ Herramienta dada de baja. Se notificó a los empleados." : "✓ Herramienta dada de baja.")
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  return (
    <div>
      <Link href="/empleados/admin/talento" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Talento Humano
      </Link>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Wrench size={20} className="text-[#8b5cf6]" />
          <h1 className="font-display text-xl font-bold">Herramientas</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{items.length}</span>
        </div>
        <button onClick={() => { setError(""); setMsg(""); setForm({ ...vacio }) }} className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110">
          <Plus size={15} /> Nueva herramienta
        </button>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">Al agregar, cambiar credenciales o dar de baja una herramienta, se notifica por correo a los empleados activos.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="mb-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay herramientas. Crea la primera.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {h.nombre}
                  {!h.activa && <span className="text-[10px] text-[#fff]/40">(inactiva)</span>}
                  {h.url && <a href={h.url} target="_blank" rel="noreferrer" className="text-[#8b5cf6]"><ExternalLink size={12} /></a>}
                </p>
                <p className="text-xs text-[#fff]/50">
                  {TIPO_HERRAMIENTA_LABEL[h.tipo]}{h.tipo === "compartida" && h.usuario ? ` · ${h.usuario}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => { setError(""); setMsg(""); setForm({ id: h.id, nombre: h.nombre, tipo: h.tipo, url: h.url ?? "", usuario: h.usuario ?? "", clave: h.clave ?? "", indicaciones: h.indicaciones ?? "", activa: h.activa }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={15} /></button>
                <button onClick={() => setConfirmar(h)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar herramienta" : "Nueva herramienta"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Nombre</span>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="ChatGPT, Claude…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Tipo</span>
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoHerramienta })} className={inputCls}>
                  <option value="compartida">Cuenta compartida (usuario y clave)</option>
                  <option value="libre">Acceso libre (solo indicaciones)</option>
                </select></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>URL</span>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://…" /></label>
              {form.tipo === "compartida" && (
                <>
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>Usuario / correo</span>
                    <input value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} className={inputCls} placeholder="equipo@medialab.design" /></label>
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>Contraseña</span>
                    <input value={form.clave} onChange={(e) => setForm({ ...form, clave: e.target.value })} className={inputCls} placeholder="Clave compartida" /></label>
                </>
              )}
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Indicaciones / normas</span>
                <textarea rows={3} value={form.indicaciones} onChange={(e) => setForm({ ...form, indicaciones: e.target.value })} className={inputCls} placeholder="Cómo usarla, límites de tokens, etc." /></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75 sm:col-span-2">
                <input type="checkbox" checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} className="h-4 w-4 accent-[var(--cyan)]" /> Activa (visible para los empleados)
              </label>
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
        titulo="Dar de baja herramienta"
        mensaje={`¿Terminar el uso de "${confirmar?.nombre ?? ""}"? Se quitará del portal y se notificará a los empleados activos.`}
        confirmLabel="Dar de baja"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminar(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
