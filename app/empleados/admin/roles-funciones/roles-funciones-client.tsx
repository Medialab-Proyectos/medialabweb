"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, ListChecks, Plus, Pencil, Trash2, X, Save } from "lucide-react"
import type { RolFunciones } from "@/lib/empleados/roles-funciones"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

type Form = { id?: string; nombre: string; funcionesTexto: string }

export function RolesFuncionesClient() {
  const [roles, setRoles] = useState<RolFunciones[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<RolFunciones | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/admin/roles-funciones")
      const data = await res.json()
      if (res.ok) setRoles(data.roles ?? []); else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      // Una función por línea.
      const funciones = form.funcionesTexto.split("\n").map((l) => l.trim()).filter(Boolean)
      const res = await fetch("/api/empleados/admin/roles-funciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(form.id ? { id: form.id } : {}), nombre: form.nombre, funciones }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setSaving(false) }
  }

  async function eliminar(r: RolFunciones) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/roles-funciones?id=${r.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setRoles((prev) => prev.filter((x) => x.id !== r.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  return (
    <div>
      <Link href="/empleados/admin/contratos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contratos
      </Link>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ListChecks size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Funciones por rol</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{roles.length}</span>
        </div>
        <button onClick={() => { setError(""); setForm({ nombre: "", funcionesTexto: "" }) }} className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110">
          <Plus size={15} /> Nuevo rol
        </button>
      </div>
      <p className="mb-6 text-sm text-[#fff]/55">Define las funciones de cada cargo (Junior/Middle/Senior/Lead UX y de desarrollo). Al generar un contrato u otrosí de cambio de rol, se insertan las funciones del cargo elegido.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : roles.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay roles definidos.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {roles.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{r.nombre}</p>
                  <p className="text-xs text-[#fff]/50">{r.funciones.length} función{r.funciones.length === 1 ? "" : "es"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => { setError(""); setForm({ id: r.id, nombre: r.nombre, funcionesTexto: r.funciones.join("\n") }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                  <button onClick={() => setConfirmar(r)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              </div>
              {r.funciones.length > 0 && (
                <ul className="mt-2 flex list-disc flex-col gap-1 border-t border-white/[0.06] pt-2 pl-5 text-xs text-[#fff]/60">
                  {r.funciones.slice(0, 3).map((f, i) => <li key={i} className="line-clamp-1">{f}</li>)}
                  {r.funciones.length > 3 && <li className="list-none text-[#fff]/40">…y {r.funciones.length - 3} más</li>}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar rol" : "Nuevo rol"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Nombre del rol</span>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="Ej: Senior UX, Lead de Desarrollo…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Funciones (una por línea)</span>
                <textarea rows={10} value={form.funcionesTexto} onChange={(e) => setForm({ ...form, funcionesTexto: e.target.value })} className={inputCls} placeholder={"Crear flujos de usuario…\nMantener el sistema de diseño…\nLiderar validaciones con clientes…"} /></label>
              <p className="text-[11px] text-[#fff]/40">Cada línea será un punto de la cláusula de funciones en el contrato/otrosí.</p>
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

      <ConfirmDialog
        abierto={!!confirmar}
        titulo="Eliminar rol"
        mensaje={`¿Eliminar el rol "${confirmar?.nombre}" y sus funciones? Los contratos ya generados no cambian.`}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminar(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
