"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Loader2, Plus, Pencil, Trash2, X, Download } from "lucide-react"
import {
  type CuentaCobro, type EmisorCuentaCobro, type ModoCuentaCobro, type EstadoCuentaCobro,
  EMISOR_LABEL, MODO_LABEL, ESTADO_CC_LABEL, totalCuentaCobro, netoCuentaCobro,
} from "@/lib/empleados/cuenta-cobro"
import type { Empresa, Cuenta, ContratoEmpresa, TipoIVA } from "@/lib/empleados/contabilidad"
import { IVA_LABEL } from "@/lib/empleados/contabilidad"
import type { Moneda } from "@/lib/empleados/freelance"
import { formatMoneda } from "@/lib/empleados/freelance"
import { MoneyInput } from "../../money-input"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

function hoyISO() {
  const d = new Date(); const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

type Form = {
  id?: string; numero: string; emisor: EmisorCuentaCobro; empresa_id: string; contrato_empresa_id: string; modo: ModoCuentaCobro
  cantidad: number; tarifa: number; moneda: Moneda; mes_servicio: string; concepto: string
  cuenta_id: string; fecha_emision: string; fecha_pago: string; observaciones: string
  iva_tipo: TipoIVA; iva_valor: number; fee: number; estado: EstadoCuentaCobro
}
const vacio: Form = {
  numero: "", emisor: "empresa", empresa_id: "", contrato_empresa_id: "", modo: "por_mes", cantidad: 1, tarifa: 0, moneda: "COP",
  mes_servicio: "", concepto: "", cuenta_id: "", fecha_emision: hoyISO(), fecha_pago: "", observaciones: "",
  iva_tipo: "na", iva_valor: 0, fee: 0, estado: "borrador",
}

/** Consecutivo automático: toma el mayor número existente y suma 1 (CC-001, CC-002…). */
function siguienteNumero(items: { numero: string | null }[]): string {
  const max = items.reduce((acc, it) => {
    const n = Number(String(it.numero ?? "").match(/(\d+)\s*$/)?.[1] ?? 0)
    return n > acc ? n : acc
  }, 0)
  return `CC-${String(max + 1).padStart(3, "0")}`
}

const estadoStyle: Record<EstadoCuentaCobro, string> = {
  borrador: "bg-white/5 text-[#fff]/55",
  emitida: "bg-amber-400/10 text-amber-300",
  pagada: "bg-emerald-400/10 text-emerald-300",
}

export function CuentasCobroClient() {
  const [items, setItems] = useState<CuentaCobro[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [contratos, setContratos] = useState<ContratoEmpresa[]>([])
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<CuentaCobro | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const nombreEmpresa = useMemo(() => new Map(empresas.map((x) => [x.id, x.nombre])), [empresas])

  async function cargar() {
    setCargando(true)
    try {
      const [rc, re, rct, rcu] = await Promise.all([
        fetch("/api/empleados/admin/cuentas-cobro"),
        fetch("/api/empleados/admin/contabilidad/empresas"),
        fetch("/api/empleados/admin/contabilidad/contratos-empresa"),
        fetch("/api/empleados/admin/contabilidad/cuentas"),
      ])
      const dc = await rc.json()
      if (rc.ok) setItems(dc.cuentasCobro ?? []); else setError(dc.error || "Error al cargar.")
      const de = await re.json(); if (re.ok) setEmpresas(de.empresas ?? [])
      const dct = await rct.json(); if (rct.ok) setContratos(dct.contratos ?? [])
      const dcu = await rcu.json(); if (rcu.ok) setCuentas(dcu.cuentas ?? [])
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/cuentas-cobro", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          numero: form.numero || null, emisor: form.emisor, empresa_id: form.empresa_id || null,
          contrato_empresa_id: form.contrato_empresa_id || null,
          modo: form.modo, cantidad: form.cantidad, tarifa: form.tarifa, moneda: form.moneda,
          mes_servicio: form.mes_servicio || null, concepto: form.concepto || null, cuenta_id: form.cuenta_id || null,
          fecha_emision: form.fecha_emision || null, fecha_pago: form.fecha_pago || null,
          observaciones: form.observaciones || null,
          iva_tipo: form.iva_tipo, iva_valor: form.iva_valor || null, fee: form.fee || null,
          estado: form.estado,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally { setSaving(false) }
  }

  async function cambiarEstado(cc: CuentaCobro, estado: EstadoCuentaCobro) {
    setError("")
    try {
      const res = await fetch("/api/empleados/admin/cuentas-cobro", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cc.id, numero: cc.numero, emisor: cc.emisor, empresa_id: cc.empresa_id,
          contrato_empresa_id: cc.contrato_empresa_id, modo: cc.modo, cantidad: cc.cantidad, tarifa: cc.tarifa,
          moneda: cc.moneda, mes_servicio: cc.mes_servicio, concepto: cc.concepto, cuenta_id: cc.cuenta_id,
          fecha_emision: cc.fecha_emision, fecha_pago: cc.fecha_pago, observaciones: cc.observaciones,
          iva_tipo: cc.iva_tipo, iva_valor: cc.iva_valor, fee: cc.fee, estado,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.map((x) => (x.id === cc.id ? (data.cuentaCobro as CuentaCobro) : x)))
    } catch (e) { setError(e instanceof Error ? e.message : "Error al cambiar el estado.") }
  }

  async function eliminar(cc: CuentaCobro) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/cuentas-cobro?id=${cc.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.filter((x) => x.id !== cc.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  const total = form ? totalCuentaCobro(form) : 0

  return (
    <div>
      <Link href="/empleados/admin/contabilidad" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Contabilidad
      </Link>
      <div className="mb-3 flex items-center gap-2.5">
        <FileText size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Cuentas de cobro</h1>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{items.length}</span>
      </div>
      <p className="mb-4 text-sm text-[#fff]/55">La cuenta de cobro se emite sobre un <b className="text-[#fff]/75">contrato con una empresa</b>: al elegirlo se heredan su modo, tarifa y moneda; tú solo pones la cantidad.</p>
      {/* En móvil el botón va debajo del título y la descripción, a todo el ancho. */}
      <button onClick={() => { setError(""); setForm({ ...vacio, numero: siguienteNumero(items) }) }} disabled={contratos.length === 0} className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-40 sm:w-auto sm:py-2">
        <Plus size={15} /> Nueva cuenta de cobro
      </button>
      {contratos.length === 0 && <p className="mb-4 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200">Primero crea una empresa y un contrato en <b>Empresas y contratos</b> para poder emitir cuentas de cobro.</p>}

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay cuentas de cobro.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((cc) => (
            <div key={cc.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {cc.numero ? `N.º ${cc.numero} · ` : ""}{nombreEmpresa.get(cc.empresa_id ?? "") ?? "Sin empresa"} · <span className="text-[var(--cyan)]">{formatMoneda(totalCuentaCobro(cc), cc.moneda)}</span>
                </p>
                <p className="text-xs text-[#fff]/50">
                  {MODO_LABEL[cc.modo]} · {cc.cantidad} × {formatMoneda(cc.tarifa, cc.moneda)}
                  {cc.mes_servicio ? ` · ${cc.mes_servicio}` : ""}
                  {cc.fecha_pago ? ` · pago ${cc.fecha_pago}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <select value={cc.estado} onChange={(e) => cambiarEstado(cc, e.target.value as EstadoCuentaCobro)} title="Cambiar estado" className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${estadoStyle[cc.estado]}`}>
                  {(["borrador", "emitida", "pagada"] as EstadoCuentaCobro[]).map((s) => <option key={s} value={s} className="bg-[#12151c] text-[#fff]">{ESTADO_CC_LABEL[s]}</option>)}
                </select>
                <a href={`/api/empleados/admin/cuentas-cobro/${cc.id}/pdf`} target="_blank" rel="noreferrer" title="Descargar PDF" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Download size={15} /></a>
                <button onClick={() => { setError(""); setForm({ id: cc.id, numero: cc.numero ?? "", emisor: cc.emisor, empresa_id: cc.empresa_id ?? "", contrato_empresa_id: cc.contrato_empresa_id ?? "", modo: cc.modo, cantidad: Number(cc.cantidad) || 0, tarifa: Number(cc.tarifa) || 0, moneda: cc.moneda, mes_servicio: cc.mes_servicio ?? "", concepto: cc.concepto ?? "", cuenta_id: cc.cuenta_id ?? "", fecha_emision: cc.fecha_emision ?? "", fecha_pago: cc.fecha_pago ?? "", observaciones: cc.observaciones ?? "", iva_tipo: cc.iva_tipo ?? "na", iva_valor: Number(cc.iva_valor) || 0, fee: Number(cc.fee) || 0, estado: cc.estado }) }} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={15} /></button>
                <button onClick={() => setConfirmar(cc)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
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
              <h2 className="text-lg font-semibold">{form.id ? "Editar cuenta de cobro" : "Nueva cuenta de cobro"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Emisor</span>
                <select value={form.emisor} onChange={(e) => setForm({ ...form, emisor: e.target.value as EmisorCuentaCobro })} className={inputCls}>
                  <option value="empresa">{EMISOR_LABEL.empresa}</option>
                  <option value="personal">{EMISOR_LABEL.personal}</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>N.º (automático)</span>
                <input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className={inputCls} placeholder="CC-001" />
                <span className="text-[10px] text-[#fff]/40">Se numera solo (consecutivo). Puedes editarlo si lo necesitas.</span></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Contrato (empresa)</span>
                <select
                  value={form.contrato_empresa_id}
                  onChange={(e) => {
                    const ct = contratos.find((x) => x.id === e.target.value)
                    // Hereda empresa, modo, tarifa y moneda del contrato.
                    setForm({
                      ...form,
                      contrato_empresa_id: e.target.value,
                      ...(ct ? { empresa_id: ct.empresa_id, modo: ct.modo, tarifa: Number(ct.tarifa) || 0, moneda: ct.moneda } : {}),
                    })
                  }}
                  className={inputCls}
                >
                  <option value="">— Selecciona —</option>
                  {contratos.filter((c) => (c.requiere_cuenta_cobro !== false && c.activo) || c.id === form.contrato_empresa_id).map((c) => {
                    const emp = empresas.find((x) => x.id === c.empresa_id)
                    return <option key={c.id} value={c.id}>{emp?.nombre ?? "Empresa"}{c.nombre ? ` · ${c.nombre}` : ""} · {c.modo === "por_hora" ? "x hora" : "x mes"} {formatMoneda(Number(c.tarifa) || 0, c.moneda)}</option>
                  })}
                </select>
                <span className="text-[10px] text-[#fff]/40">Al elegir el contrato se cargan empresa, modo, tarifa y moneda; solo ajustas la cantidad.</span>
              </label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Modo</span>
                <select value={form.modo} onChange={(e) => setForm({ ...form, modo: e.target.value as ModoCuentaCobro })} className={inputCls}>
                  <option value="por_mes">Por mes</option>
                  <option value="por_hora">Por hora</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value as Moneda })} className={inputCls}>
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>{form.modo === "por_hora" ? "N.º de horas" : "N.º de meses"}</span>
                <input type="number" step="0.01" min="0" value={form.cantidad || ""} onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })} className={inputCls} placeholder="1" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>{form.modo === "por_hora" ? "Valor por hora" : "Valor por mes"} ({form.moneda})</span>
                <MoneyInput value={form.tarifa} onChange={(n) => setForm({ ...form, tarifa: n })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Mes / periodo de servicio</span>
                <input value={form.mes_servicio} onChange={(e) => setForm({ ...form, mes_servicio: e.target.value })} className={inputCls} placeholder="Julio 2026" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Consignar a (cuenta)</span>
                <select value={form.cuenta_id} onChange={(e) => setForm({ ...form, cuenta_id: e.target.value })} className={inputCls}>
                  <option value="">— Selecciona —</option>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Concepto</span>
                <input value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} className={inputCls} placeholder="Servicios de diseño UX…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha de emisión</span>
                <input type="date" value={form.fecha_emision} onChange={(e) => setForm({ ...form, fecha_emision: e.target.value })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha de pago (opcional)</span>
                <input type="date" value={form.fecha_pago} onChange={(e) => setForm({ ...form, fecha_pago: e.target.value })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>IVA</span>
                <select value={form.iva_tipo} onChange={(e) => setForm({ ...form, iva_tipo: e.target.value as TipoIVA })} className={inputCls}>
                  <option value="na">{IVA_LABEL.na}</option>
                  <option value="incluido">{IVA_LABEL.incluido}</option>
                  <option value="exento">{IVA_LABEL.exento}</option>
                </select></label>
              {form.iva_tipo === "incluido" ? (
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor del IVA ({form.moneda})</span>
                  <MoneyInput value={form.iva_valor} onChange={(n) => setForm({ ...form, iva_valor: n })} className={inputCls} /></label>
              ) : <div className="hidden sm:block" />}
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fee / costo bancario ({form.moneda})</span>
                <MoneyInput value={form.fee} onChange={(n) => setForm({ ...form, fee: n })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Estado</span>
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoCuentaCobro })} className={inputCls}>
                  <option value="borrador">Borrador</option>
                  <option value="emitida">Emitida</option>
                  <option value="pagada">Pagada</option>
                </select></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Observaciones</span>
                <input value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className={inputCls} placeholder="Opcional" /></label>
            </div>

            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#fff]/50">Total</span>
                <span className="font-display text-xl font-bold text-[var(--cyan)]">{formatMoneda(total, form.moneda)}</span>
              </div>
              {form.fee > 0 && (
                <div className="mt-1 flex items-center justify-between text-xs text-[#fff]/55">
                  <span>Neto tras fee (−{formatMoneda(form.fee, form.moneda)})</span>
                  <span className="font-semibold text-[#fff]/80">{formatMoneda(netoCuentaCobro(form), form.moneda)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
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
        titulo="Eliminar cuenta de cobro"
        mensaje="¿Eliminar esta cuenta de cobro? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminar(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
