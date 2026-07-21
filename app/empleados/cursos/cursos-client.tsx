"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Plus, Pencil, Trash2, X, Save, ExternalLink, GraduationCap, EyeOff } from "lucide-react"

type Curso = {
  id: string; titulo: string; descripcion: string | null; plataforma: string | null
  url: string; categoria: string | null; activo: boolean; orden: number; creado_en: string
}
type Form = { id?: string; titulo: string; descripcion: string; plataforma: string; url: string; categoria: string; activo: boolean }
const vacio: Form = { titulo: "", descripcion: "", plataforma: "", url: "", categoria: "", activo: true }

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[#8b5cf6]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function CursosClient({ esCEO }: { esCEO: boolean }) {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  async function cargar() {
    setCargando(true); setError("")
    try {
      const r = await fetch("/api/empleados/cursos")
      const data = await r.json()
      if (r.ok) setCursos(data.cursos ?? []); else setError(data.error || "Error al cargar.")
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  // Agrupa por categoría para que la lista se lea ordenada.
  const porCategoria = useMemo(() => {
    const map = new Map<string, Curso[]>()
    for (const c of cursos) {
      const k = c.categoria?.trim() || "General"
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(c)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [cursos])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    if (!form.titulo.trim() || !form.url.trim()) { setError("Título y enlace son obligatorios."); return }
    setSaving(true); setError("")
    try {
      const r = await fetch("/api/empleados/cursos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(form.id ? { id: form.id } : {}), titulo: form.titulo, descripcion: form.descripcion || null, plataforma: form.plataforma || null, url: form.url, categoria: form.categoria || null, activo: form.activo }),
      })
      const data = await r.json(); if (!r.ok) throw new Error(data.error)
      setForm(null); await cargar()
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setSaving(false) }
  }

  async function eliminar(id: string) {
    setBusy(id)
    try {
      const r = await fetch(`/api/empleados/cursos?id=${id}`, { method: "DELETE" })
      if (r.ok) setCursos((prev) => prev.filter((c) => c.id !== id))
    } finally { setBusy(null) }
  }

  return (
    <div className="flex flex-col gap-5">
      {esCEO && (
        <button onClick={() => { setError(""); setForm({ ...vacio }) }} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-[#0d0a1a] transition hover:brightness-110 sm:w-auto sm:py-2">
          <Plus size={15} /> Nuevo curso
        </button>
      )}

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : cursos.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">
          {esCEO ? "Aún no hay cursos. Crea el primero con «Nuevo curso»." : "Aún no hay cursos publicados. Cuando el equipo los active, aparecerán aquí."}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {porCategoria.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#fff]/40">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((c) => (
                  <div key={c.id} className={`flex flex-col gap-2 rounded-2xl border p-4 ${c.activo ? "border-white/10 bg-white/[0.04]" : "border-white/[0.06] bg-white/[0.02] opacity-70"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8b5cf6]/15"><GraduationCap size={17} className="text-[#8b5cf6]" /></span>
                      <div className="flex items-center gap-1">
                        {!c.activo && <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[#fff]/45"><EyeOff size={10} /> Oculto</span>}
                        {esCEO && (
                          <>
                            <button onClick={() => { setError(""); setForm({ id: c.id, titulo: c.titulo, descripcion: c.descripcion ?? "", plataforma: c.plataforma ?? "", url: c.url, categoria: c.categoria ?? "", activo: c.activo }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                            <button onClick={() => eliminar(c.id)} disabled={busy === c.id} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-[#fff]">{c.titulo}</h3>
                    {c.descripcion && <p className="text-sm text-[#fff]/55">{c.descripcion}</p>}
                    <div className="mt-1 flex items-center justify-between gap-2">
                      {c.plataforma && <span className="text-[11px] text-[#fff]/40">{c.plataforma}</span>}
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b5cf6] hover:underline">
                        Abrir curso <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modal de gestión (CEO) */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar curso" : "Nuevo curso"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Título *</span>
                <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className={inputCls} placeholder="Ej: Fundamentos de UX" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Enlace (URL) *</span>
                <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://…" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Plataforma</span>
                  <input value={form.plataforma} onChange={(e) => setForm({ ...form, plataforma: e.target.value })} className={inputCls} placeholder="Platzi, Coursera…" /></label>
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Categoría</span>
                  <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={inputCls} placeholder="Diseño, Liderazgo…" /></label>
              </div>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Descripción</span>
                <textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className={inputCls} placeholder="De qué trata el curso (opcional)" /></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 accent-[#8b5cf6]" />
                Publicado (visible para todo el equipo)
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-5 py-2 text-sm font-semibold text-[#0d0a1a] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
