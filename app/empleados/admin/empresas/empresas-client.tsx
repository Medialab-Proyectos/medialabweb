"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Loader2, Plus, Pencil, Trash2, X, FileSignature } from "lucide-react"
import type { Empresa, ContratoEmpresa, ModoFacturacion } from "@/lib/empleados/contabilidad"
import { formatMoneda, PAISES } from "@/lib/empleados/contabilidad"
import type { Moneda } from "@/lib/empleados/freelance"
import { MoneyInput } from "../../money-input"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

type EmpresaForm = { id?: string; nombre: string; nit: string; correo: string; pais: string; telefono: string }
type ContratoForm = { id?: string; empresa_id: string; nombre: string; modo: ModoFacturacion; tarifa: number; moneda: Moneda; activo: boolean }

export function EmpresasClient() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [contratos, setContratos] = useState<ContratoEmpresa[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [formEmpresa, setFormEmpresa] = useState<EmpresaForm | null>(null)
  const [formContrato, setFormContrato] = useState<ContratoForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<null | { titulo: string; mensaje: string; run: () => Promise<void> }>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const contratosPorEmpresa = useMemo(() => {
    const m = new Map<string, ContratoEmpresa[]>()
    contratos.forEach((c) => { const arr = m.get(c.empresa_id) ?? []; arr.push(c); m.set(c.empresa_id, arr) })
    return m
  }, [contratos])

  async function cargar() {
    setCargando(true)
    try {
      const [re, rc] = await Promise.all([
        fetch("/api/empleados/admin/contabilidad/empresas"),
        fetch("/api/empleados/admin/contabilidad/contratos-empresa"),
      ])
      const de = await re.json(); if (re.ok) setEmpresas(de.empresas ?? []); else setError(de.error || "Error al cargar.")
      const dc = await rc.json(); if (rc.ok) setContratos(dc.contratos ?? [])
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardarEmpresa(e: React.FormEvent) {
    e.preventDefault(); if (!formEmpresa) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/empresas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(formEmpresa.id ? { id: formEmpresa.id } : {}), nombre: formEmpresa.nombre, nit: formEmpresa.nit || null, correo: formEmpresa.correo || null, pais: formEmpresa.pais || null, telefono: formEmpresa.telefono || null }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await cargar(); setFormEmpresa(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar la empresa.") }
    finally { setSaving(false) }
  }

  async function guardarContrato(e: React.FormEvent) {
    e.preventDefault(); if (!formContrato) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/contratos-empresa", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formContrato.id ? { id: formContrato.id } : {}),
          empresa_id: formContrato.empresa_id, nombre: formContrato.nombre || null,
          modo: formContrato.modo, tarifa: formContrato.tarifa, moneda: formContrato.moneda, activo: formContrato.activo,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await cargar(); setFormContrato(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar el contrato.") }
    finally { setSaving(false) }
  }

  function pedirEliminarEmpresa(x: Empresa) {
    setConfirmar({
      titulo: "Eliminar empresa", mensaje: `¿Eliminar "${x.nombre}"? Se borran también sus contratos.`,
      run: async () => {
        setConfirmLoading(true)
        try { const r = await fetch(`/api/empleados/admin/contabilidad/empresas?id=${x.id}`, { method: "DELETE" }); const d = await r.json(); if (!r.ok) throw new Error(d.error); await cargar(); setConfirmar(null) }
        catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) } finally { setConfirmLoading(false) }
      },
    })
  }
  function pedirEliminarContrato(c: ContratoEmpresa) {
    setConfirmar({
      titulo: "Eliminar contrato", mensaje: "¿Eliminar este contrato con la empresa?",
      run: async () => {
        setConfirmLoading(true)
        try { const r = await fetch(`/api/empleados/admin/contabilidad/contratos-empresa?id=${c.id}`, { method: "DELETE" }); const d = await r.json(); if (!r.ok) throw new Error(d.error); await cargar(); setConfirmar(null) }
        catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) } finally { setConfirmLoading(false) }
      },
    })
  }

  const modoTxt = (c: ContratoEmpresa) => `${c.modo === "por_hora" ? "Por hora" : "Por mes"}: ${formatMoneda(Number(c.tarifa) || 0, c.moneda)}`

  return (
    <div>
      <Link href="/empleados/admin/contabilidad" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contabilidad
      </Link>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Building2 size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Gestionar empresas</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{empresas.length}</span>
        </div>
        <button onClick={() => { setError(""); setFormEmpresa({ nombre: "", nit: "", correo: "", pais: "Colombia", telefono: "" }) }} className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110">
          <Plus size={15} /> Nueva empresa
        </button>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">La empresa lleva solo nombre, NIT y correo. Sus <b className="text-[#fff]/75">contratos</b> definen cómo se le factura (por hora o por mes). Las cuentas de cobro se emiten sobre un contrato.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : empresas.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay empresas. Crea la primera.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {empresas.map((x) => {
            const cts = contratosPorEmpresa.get(x.id) ?? []
            return (
              <div key={x.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{x.nombre}</p>
                    <p className="text-xs text-[#fff]/50">{x.nit ? `NIT ${x.nit}` : "Sin NIT"}{x.pais ? ` · ${x.pais}` : ""}{x.correo ? ` · ${x.correo}` : ""}{x.telefono ? ` · ${x.telefono}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => { setError(""); setFormContrato({ empresa_id: x.id, nombre: "", modo: "por_mes", tarifa: 0, moneda: "COP", activo: true }) }} className="inline-flex items-center gap-1 rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20"><Plus size={12} /> Contrato</button>
                    <button onClick={() => { setError(""); setFormEmpresa({ id: x.id, nombre: x.nombre, nit: x.nit ?? "", correo: x.correo ?? "", pais: x.pais ?? "", telefono: x.telefono ?? "" }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                    <button onClick={() => pedirEliminarEmpresa(x)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                </div>
                {cts.length > 0 && (
                  <div className="mt-3 flex flex-col gap-1.5 border-t border-white/[0.06] pt-3">
                    {cts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1.5 text-[#fff]/70">
                          <FileSignature size={12} className="text-[var(--cyan)]" />
                          {c.nombre || "Contrato"} · <b className="text-[var(--cyan)]">{modoTxt(c)}</b>
                          {!c.activo && <span className="text-[10px] text-[#fff]/40">(inactivo)</span>}
                        </span>
                        <span className="flex items-center gap-1">
                          <button onClick={() => { setError(""); setFormContrato({ id: c.id, empresa_id: c.empresa_id, nombre: c.nombre ?? "", modo: c.modo, tarifa: Number(c.tarifa) || 0, moneda: c.moneda, activo: c.activo }) }} className="rounded-lg p-1 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={13} /></button>
                          <button onClick={() => pedirEliminarContrato(c)} className="rounded-lg p-1 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={13} /></button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal empresa */}
      {formEmpresa && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarEmpresa} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{formEmpresa.id ? "Editar empresa" : "Nueva empresa"}</h2>
              <button type="button" onClick={() => setFormEmpresa(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Nombre / razón social</span>
                <input required value={formEmpresa.nombre} onChange={(e) => setFormEmpresa({ ...formEmpresa, nombre: e.target.value })} className={inputCls} placeholder="Empresa S.A.S" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>NIT (si tiene)</span>
                <input value={formEmpresa.nit} onChange={(e) => setFormEmpresa({ ...formEmpresa, nit: e.target.value })} className={inputCls} placeholder="900.123.456-7" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Correo</span>
                <input type="email" value={formEmpresa.correo} onChange={(e) => setFormEmpresa({ ...formEmpresa, correo: e.target.value })} className={inputCls} placeholder="contacto@empresa.com" /></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5"><span className={lblCls}>País</span>
                  <input list="cat-paises" value={formEmpresa.pais} onChange={(e) => setFormEmpresa({ ...formEmpresa, pais: e.target.value })} className={inputCls} placeholder="Elige o escribe…" />
                  <datalist id="cat-paises">{PAISES.map((p) => <option key={p} value={p} />)}</datalist>
                </label>
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Teléfono (si tiene)</span>
                  <input value={formEmpresa.telefono} onChange={(e) => setFormEmpresa({ ...formEmpresa, telefono: e.target.value })} className={inputCls} placeholder="+57 ..." /></label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormEmpresa(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal contrato con empresa */}
      {formContrato && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarContrato} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{formContrato.id ? "Editar contrato" : "Nuevo contrato"}</h2>
              <button type="button" onClick={() => setFormContrato(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <p className="mb-4 text-xs text-[#fff]/50">{empresas.find((e) => e.id === formContrato.empresa_id)?.nombre}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Nombre del contrato (opcional)</span>
                <input value={formContrato.nombre} onChange={(e) => setFormContrato({ ...formContrato, nombre: e.target.value })} className={inputCls} placeholder="Ej: Soporte mensual 2026" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Modo</span>
                <select value={formContrato.modo} onChange={(e) => setFormContrato({ ...formContrato, modo: e.target.value as ModoFacturacion })} className={inputCls}>
                  <option value="por_mes">Por mes</option>
                  <option value="por_hora">Por hora</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                <select value={formContrato.moneda} onChange={(e) => setFormContrato({ ...formContrato, moneda: e.target.value as Moneda })} className={inputCls}>
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                </select></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>{formContrato.modo === "por_hora" ? "Valor por hora" : "Valor por mes"} ({formContrato.moneda})</span>
                <MoneyInput value={formContrato.tarifa} onChange={(n) => setFormContrato({ ...formContrato, tarifa: n })} className={inputCls} /></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75 sm:col-span-2">
                <input type="checkbox" checked={formContrato.activo} onChange={(e) => setFormContrato({ ...formContrato, activo: e.target.checked })} className="h-4 w-4 accent-[var(--cyan)]" /> Contrato activo
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormContrato(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog abierto={!!confirmar} titulo={confirmar?.titulo ?? ""} mensaje={confirmar?.mensaje ?? ""} confirmLabel="Eliminar" tone="danger" cargando={confirmLoading} onConfirm={() => confirmar?.run()} onCancel={() => setConfirmar(null)} />
    </div>
  )
}
