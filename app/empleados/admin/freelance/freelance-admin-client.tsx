"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, FileText, CheckCircle2, XCircle, Paperclip, RotateCcw, X, Wallet, Download } from "lucide-react"
import {
  type FacturaFreelance, type EstadoFactura, ESTADO_FACTURA_LABEL, formatMoneda,
} from "@/lib/empleados/freelance"
import type { Cuenta } from "@/lib/empleados/contabilidad"
import { MESES } from "@/lib/empleados/desprendible"

type FacturaRow = FacturaFreelance & { empleado: { nombre: string; cedula: string } | null }

const estadoStyle: Record<EstadoFactura, string> = {
  enviada: "bg-amber-400/10 text-amber-300",
  pagada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
}

export function FreelanceAdminClient() {
  const [rows, setRows] = useState<FacturaRow[]>([])
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [guardandoId, setGuardandoId] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<"todas" | EstadoFactura>("todas")
  const [pagar, setPagar] = useState<FacturaRow | null>(null)
  const [cuentaSel, setCuentaSel] = useState("")
  const [rechazar, setRechazar] = useState<FacturaRow | null>(null)
  const [motivo, setMotivo] = useState("")

  async function cargar() {
    setCargando(true)
    try {
      const [rf, rc] = await Promise.all([
        fetch("/api/empleados/admin/freelance"),
        fetch("/api/empleados/admin/contabilidad/cuentas"),
      ])
      const df = await rf.json()
      if (rf.ok) setRows(df.facturas ?? [])
      else setError(df.error || "Error al cargar.")
      const dc = await rc.json()
      if (rc.ok) setCuentas(dc.cuentas ?? [])
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  const visibles = useMemo(() => (filtro === "todas" ? rows : rows.filter((r) => r.estado === filtro)), [rows, filtro])

  async function setEstado(id: string, estado: EstadoFactura, cuentaId?: string | null, obs?: string | null) {
    setError(""); setMsg(""); setGuardandoId(id)
    try {
      const res = await fetch("/api/empleados/admin/freelance", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado, cuenta_id: cuentaId ?? null, observaciones: obs ?? undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...(data.factura as FacturaFreelance) } : r)))
      if (data.contabilidad?.ok) setMsg("✓ Factura pagada y egreso registrado en Contabilidad.")
      else if (data.contabilidad?.aviso) setMsg(data.contabilidad.aviso)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardandoId(null)
    }
  }

  function abrirPagar(r: FacturaRow) {
    setError(""); setMsg("")
    const compatible = cuentas.find((c) => c.moneda === r.moneda && c.activa)
    setCuentaSel(compatible?.id ?? "")
    setPagar(r)
  }

  async function confirmarPago(registrar: boolean) {
    if (!pagar) return
    const f = pagar
    setPagar(null)
    await setEstado(f.id, "pagada", registrar ? cuentaSel : null)
  }

  function abrirRechazo(r: FacturaRow) {
    setError(""); setMsg(""); setMotivo(r.observaciones ?? ""); setRechazar(r)
  }

  async function confirmarRechazo() {
    if (!rechazar) return
    const f = rechazar
    setRechazar(null)
    await setEstado(f.id, "rechazada", null, motivo || null)
  }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileText size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Facturas de freelance</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{rows.length}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 p-0.5 text-xs">
          {(["todas", "enviada", "pagada", "rechazada"] as const).map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className={`rounded-full px-3 py-1.5 font-medium capitalize transition ${filtro === f ? "bg-white/10 text-[#fff]" : "text-[#fff]/55 hover:text-[#fff]"}`}>
              {f === "todas" ? "Todas" : ESTADO_FACTURA_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="mb-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : visibles.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">No hay facturas en este filtro.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibles.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {r.empleado?.nombre ?? "—"} <span className="text-[#fff]/45">· CC {r.empleado?.cedula ?? "—"}</span>
                  </p>
                  <p className="text-xs text-[#fff]/55">
                    {MESES[r.mes - 1]} {r.anio} · <b className="text-[#fff]/80">{formatMoneda(r.valor, r.moneda)}</b>
                    {r.numero ? ` · N.º ${r.numero}` : ""}{r.concepto ? ` · ${r.concepto}` : ""}
                  </p>
                  <p className="mt-1 text-[11px] text-[#fff]/45">
                    Pago a: {r.banco || "—"} · {r.cuenta || "—"} {r.tipo_cuenta ? `(${r.tipo_cuenta})` : ""} · {r.titular || "—"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#fff]/40">
                    {r.firmado ? `Firmada por ${r.firmante ?? "—"}` : "Sin firma"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a href={`/api/empleados/freelance/${r.id}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-[#fff]/75 hover:bg-white/5">
                    <Download size={12} /> Factura PDF
                  </a>
                  {r.soporte_path && (
                    <a href={`/api/empleados/freelance/${r.id}/soporte`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-200/90 hover:bg-emerald-400/10">
                      <Paperclip size={12} /> Soporte
                    </a>
                  )}
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[r.estado]}`}>
                    {ESTADO_FACTURA_LABEL[r.estado]}
                  </span>
                  {guardandoId === r.id ? (
                    <Loader2 size={15} className="animate-spin text-[#fff]/50" />
                  ) : (
                    <div className="flex items-center gap-1">
                      {r.estado !== "pagada" && (
                        <button onClick={() => abrirPagar(r)} title="Marcar pagada" className="rounded-lg p-1.5 text-emerald-300/70 hover:bg-emerald-500/10 hover:text-emerald-300"><CheckCircle2 size={15} /></button>
                      )}
                      {r.estado !== "rechazada" && (
                        <button onClick={() => abrirRechazo(r)} title="Rechazar con motivo" className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><XCircle size={15} /></button>
                      )}
                      {r.estado !== "enviada" && (
                        <button onClick={() => setEstado(r.id, "enviada")} title="Volver a enviada" className="rounded-lg p-1.5 text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-300"><RotateCcw size={15} /></button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: marcar pagada + registrar egreso en Contabilidad */}
      {pagar && (() => {
        const compatibles = cuentas.filter((c) => c.moneda === pagar.moneda && c.activa)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-semibold"><Wallet size={17} className="text-[var(--cyan)]" /> Marcar factura pagada</h2>
                <button onClick={() => setPagar(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={17} /></button>
              </div>
              <p className="text-sm text-[#fff]/65">
                {pagar.empleado?.nombre ?? "Freelance"} · <b className="text-[#fff]">{formatMoneda(pagar.valor, pagar.moneda)}</b>
                {" "}({MESES[pagar.mes - 1]} {pagar.anio}).
              </p>
              <div className="mt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50">Registrar el egreso desde la cuenta ({pagar.moneda})</span>
                {compatibles.length === 0 ? (
                  <p className="mt-1.5 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
                    No hay cuentas en {pagar.moneda} en Contabilidad. Puedes marcarla pagada igual y registrar el egreso luego.
                  </p>
                ) : (
                  <select value={cuentaSel} onChange={(e) => setCuentaSel(e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60">
                    <option value="">— No registrar en contabilidad —</option>
                    {compatibles.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                  </select>
                )}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setPagar(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
                <button onClick={() => confirmarPago(false)} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/80 hover:bg-white/5">Solo marcar pagada</button>
                <button onClick={() => confirmarPago(true)} disabled={!cuentaSel} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-50">
                  Pagar y registrar
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modal: rechazar con motivo */}
      {rechazar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold"><XCircle size={17} className="text-red-300" /> Rechazar factura</h2>
              <button onClick={() => setRechazar(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={17} /></button>
            </div>
            <p className="text-sm text-[#fff]/65">{rechazar.empleado?.nombre ?? "Freelance"} · {formatMoneda(rechazar.valor, rechazar.moneda)} ({MESES[rechazar.mes - 1]} {rechazar.anio})</p>
            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50">Motivo del rechazo (lo verá el freelance)</span>
              <textarea rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: falta el soporte de prestaciones sociales; corrige la cuenta bancaria…" className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60" />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setRechazar(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button onClick={confirmarRechazo} disabled={!motivo.trim()} className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-[#fff] transition hover:bg-red-500 disabled:opacity-50">Rechazar y avisar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
