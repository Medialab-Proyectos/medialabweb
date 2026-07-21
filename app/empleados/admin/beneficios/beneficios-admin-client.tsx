"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Loader2, CheckCircle2, XCircle, RotateCcw, Plus, Pencil, Trash2, X, Save } from "lucide-react"
import {
  type Beneficio, type BeneficioTipo, type EstadoBeneficio, TIPO_BENEFICIO_LABEL, ESTADO_BENEFICIO_LABEL, TIPO_MEDICINA,
} from "@/lib/empleados/beneficio"
import { ConfirmDialog } from "../../confirm-dialog"

type BeneficioRow = Beneficio & { empleado: { nombre: string; cedula: string } | null }

const estadoStyle: Record<EstadoBeneficio, string> = {
  solicitado: "bg-amber-400/10 text-amber-300",
  activo: "bg-emerald-400/10 text-emerald-300",
  inactivo: "bg-white/5 text-[#fff]/50",
}

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

type TipoForm = { id?: string; nombre: string; descripcion: string; proveedor: string; activo: boolean }

export function BeneficiosAdminClient() {
  const [rows, setRows] = useState<BeneficioRow[]>([])
  const [tipos, setTipos] = useState<BeneficioTipo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [guardandoId, setGuardandoId] = useState<string | null>(null)
  const [form, setForm] = useState<TipoForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<BeneficioTipo | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const nombreTipo = (slug: string) => tipos.find((t) => t.slug === slug)?.nombre ?? TIPO_BENEFICIO_LABEL[slug]

  async function cargar() {
    setCargando(true)
    try {
      const [rb, rt] = await Promise.all([
        fetch("/api/empleados/admin/beneficios"),
        fetch("/api/empleados/admin/beneficios/tipos"),
      ])
      const db = await rb.json()
      if (rb.ok) setRows(db.beneficios ?? []); else setError(db.error || "Error al cargar.")
      const dt = await rt.json(); if (rt.ok) setTipos(dt.tipos ?? [])
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function setEstado(id: string, estado: EstadoBeneficio) {
    setError(""); setGuardandoId(id)
    try {
      const res = await fetch("/api/empleados/admin/beneficios", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...(data.beneficio as Beneficio) } : r)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardandoId(null)
    }
  }

  async function guardarTipo(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/beneficios/tipos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          nombre: form.nombre, descripcion: form.descripcion || null, proveedor: form.proveedor || null, activo: form.activo,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar el beneficio.") }
    finally { setSaving(false) }
  }

  async function eliminarTipo(t: BeneficioTipo) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/beneficios/tipos?id=${t.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setTipos((prev) => prev.filter((x) => x.id !== t.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  return (
    <div>
      <Link href="/empleados/admin/talento" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Talento Humano
      </Link>
      <div className="mb-6 flex items-center gap-2.5">
        <Gift size={20} className="text-[#E8751A]" />
        <h1 className="font-display text-xl font-bold">Beneficios</h1>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Catálogo de beneficios */}
          <section>
            {/* En móvil el botón va debajo del título y la descripción, a todo el ancho. */}
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#fff]/85">Catálogo de beneficios</h2>
                <p className="text-xs text-[#fff]/50">Crea los beneficios que la empresa ofrece. Solo tú los activas por empleado.</p>
              </div>
              <button onClick={() => { setError(""); setForm({ nombre: "", descripcion: "", proveedor: "", activo: true }) }} className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#E8751A] px-4 py-2.5 text-sm font-semibold text-[#1a0f04] transition hover:brightness-110 sm:w-auto sm:py-2">
                <Plus size={15} /> Nuevo beneficio
              </button>
            </div>
            {tipos.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">Aún no hay beneficios en el catálogo.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {tipos.map((t) => (
                  <div key={t.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.nombre} {!t.activo && <span className="text-[10px] text-[#fff]/40">(inactivo)</span>}</p>
                      {t.descripcion && <p className="text-xs text-[#fff]/50">{t.descripcion}</p>}
                      {t.proveedor && <p className="text-[11px] text-[#fff]/40">Proveedor: {t.proveedor}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => { setError(""); setForm({ id: t.id, nombre: t.nombre, descripcion: t.descripcion ?? "", proveedor: t.proveedor ?? "", activo: t.activo }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                      {t.slug !== TIPO_MEDICINA && (
                        <button onClick={() => setConfirmar(t)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Activaciones por empleado */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#fff]/85">Activaciones por empleado</h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{rows.length}</span>
            </div>
            {rows.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">
                Aún no hay beneficios asignados. Asígnalos desde <b className="text-[#fff]/70">Gestión de empleados</b> (botón 🎁 en la fila).
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {rows.map((r) => (
                  <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">{r.empleado?.nombre ?? "—"} <span className="text-[#fff]/45">· CC {r.empleado?.cedula ?? "—"}</span></p>
                      <p className="text-xs text-[#fff]/55">
                        {nombreTipo(r.tipo)}{r.proveedor ? ` · ${r.proveedor}` : ""}
                        {(() => {
                          const d = (r.datos ?? {}) as { plan?: string }
                          return d.plan ? ` · ${d.plan}` : ""
                        })()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[r.estado]}`}>
                        {ESTADO_BENEFICIO_LABEL[r.estado]}
                      </span>
                      {guardandoId === r.id ? (
                        <Loader2 size={15} className="animate-spin text-[#fff]/50" />
                      ) : (
                        <div className="flex items-center gap-1">
                          {r.estado !== "activo" && (
                            <button onClick={() => setEstado(r.id, "activo")} title="Marcar activo" className="rounded-lg p-1.5 text-emerald-300/70 hover:bg-emerald-500/10 hover:text-emerald-300"><CheckCircle2 size={15} /></button>
                          )}
                          {r.estado !== "inactivo" && (
                            <button onClick={() => setEstado(r.id, "inactivo")} title="Dar de baja" className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><XCircle size={15} /></button>
                          )}
                          {r.estado === "inactivo" && (
                            <button onClick={() => setEstado(r.id, "solicitado")} title="Reabrir solicitud" className="rounded-lg p-1.5 text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-300"><RotateCcw size={15} /></button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal tipo de beneficio */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarTipo} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar beneficio" : "Nuevo beneficio"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Nombre</span>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="Gimnasio, bono, seguro de vida…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Descripción</span>
                <textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className={inputCls} placeholder="Qué incluye el beneficio…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Proveedor (opcional)</span>
                <input value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} className={inputCls} placeholder="Nombre del proveedor" /></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 accent-[#E8751A]" /> Disponible para asignar
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#E8751A] px-5 py-2 text-sm font-semibold text-[#1a0f04] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo="Eliminar beneficio del catálogo"
        mensaje={`¿Eliminar "${confirmar?.nombre}" del catálogo? Las activaciones ya asignadas a empleados no se borran.`}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminarTipo(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
