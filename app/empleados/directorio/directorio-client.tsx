"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Trash2, Pencil, Phone, Mail, Building2, Save, X } from "lucide-react"

type Contacto = { id: string; nombre: string; rol: string | null; empresa: string | null; telefono: string | null; email: string | null; notas: string | null; orden: number }
type Form = { id?: string; nombre: string; rol: string; empresa: string; telefono: string; email: string; notas: string }

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const vacío: Form = { nombre: "", rol: "", empresa: "", telefono: "", email: "", notas: "" }

export function DirectorioClient({ esCEO }: { esCEO: boolean }) {
  const [items, setItems] = useState<Contacto[]>([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function cargar() {
    setCargando(true)
    try {
      const r = await fetch("/api/empleados/contactos")
      const d = await r.json()
      setItems(d.contactos ?? [])
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  async function guardar() {
    if (!form?.nombre.trim()) return setError("El nombre es obligatorio.")
    setSaving(true); setError("")
    try {
      const r = await fetch("/api/empleados/contactos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id, nombre: form.nombre, rol: form.rol || null, empresa: form.empresa || null, telefono: form.telefono || null, email: form.email || null, notas: form.notas || null }),
      })
      const d = await r.json(); if (!r.ok) throw new Error(d.error)
      setForm(null); await cargar()
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setSaving(false) }
  }
  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este contacto?")) return
    await fetch(`/api/empleados/contactos?id=${id}`, { method: "DELETE" }); await cargar()
  }

  if (cargando) return <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>

  return (
    <div className="flex flex-col gap-4">
      {esCEO && !form && (
        <button onClick={() => setForm({ ...vacío })} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110">
          <Plus size={15} /> Agregar contacto
        </button>
      )}

      {esCEO && form && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre *" className={inputCls} />
            <input value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} placeholder="Rol (Contador, Medicina prepagada…)" className={inputCls} />
            <input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Empresa" className={inputCls} />
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Teléfono / WhatsApp" className={inputCls} />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo" className={inputCls} />
            <input value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Notas" className={inputCls} />
          </div>
          {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
          <div className="mt-3 flex gap-2">
            <button onClick={guardar} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cyan)] px-3 py-2 text-sm font-semibold text-[#04191b] disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar</button>
            <button onClick={() => { setForm(null); setError("") }} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm text-[#fff]/75"><X size={14} /> Cancelar</button>
          </div>
        </section>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay contactos en el directorio.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((c) => (
            <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{c.nombre}</p>
                  {c.rol && <p className="text-[11px] font-medium text-[var(--cyan)]/80">{c.rol}</p>}
                </div>
                {esCEO && (
                  <div className="flex shrink-0 gap-1">
                    <button onClick={() => setForm({ id: c.id, nombre: c.nombre, rol: c.rol ?? "", empresa: c.empresa ?? "", telefono: c.telefono ?? "", email: c.email ?? "", notas: c.notas ?? "" })} className="rounded-lg p-1.5 text-[#fff]/50 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                    <button onClick={() => eliminar(c.id)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-1 text-xs text-[#fff]/65">
                {c.empresa && <p className="flex items-center gap-1.5"><Building2 size={12} className="text-[#fff]/40" /> {c.empresa}</p>}
                {c.telefono && <a href={`tel:${c.telefono}`} className="flex items-center gap-1.5 hover:text-[var(--cyan)]"><Phone size={12} className="text-[#fff]/40" /> {c.telefono}</a>}
                {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 break-all hover:text-[var(--cyan)]"><Mail size={12} className="text-[#fff]/40" /> {c.email}</a>}
                {c.notas && <p className="text-[#fff]/45">{c.notas}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
