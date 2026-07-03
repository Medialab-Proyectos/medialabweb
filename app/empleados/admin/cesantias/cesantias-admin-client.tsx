"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Save, Download, Calculator, PiggyBank, CheckCircle2 } from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import { formatCOP } from "@/lib/empleados/desprendible"
import {
  type CesantiasDoc, type Contrato, condicionesVigentes, calcularCesantias, calcularInteresesCesantias,
} from "@/lib/empleados/contrato"
import { FONDOS_CESANTIAS } from "@/lib/empleados/catalogos-co"
import { MoneyInput } from "../../money-input"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"
const anioActual = new Date().getFullYear()

export function CesantiasAdminClient({ empleados }: { empleados: Empleado[] }) {
  const [empleadoId, setEmpleadoId] = useState("")
  const [anio, setAnio] = useState(anioActual)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const [dias, setDias] = useState(360)
  const [base, setBase] = useState(0)
  const [cesantias, setCesantias] = useState(0)
  const [intereses, setIntereses] = useState(0)
  const [fondo, setFondo] = useState("")
  const [obs, setObs] = useState("")
  const [publicado, setPublicado] = useState(false)

  function reset() {
    setExistingId(null); setDias(360); setBase(0); setCesantias(0); setIntereses(0); setFondo(""); setObs(""); setPublicado(false)
  }
  function cargarDesde(c: CesantiasDoc) {
    setExistingId(c.id)
    setDias(Number(c.dias) || 360); setBase(Number(c.base) || 0)
    setCesantias(Number(c.cesantias) || 0); setIntereses(Number(c.intereses) || 0)
    setFondo(c.fondo ?? ""); setObs(c.observaciones ?? ""); setPublicado(c.publicado)
  }

  useEffect(() => {
    setMsg(""); setError("")
    if (!empleadoId) return
    let cancel = false
    ;(async () => {
      setCargando(true)
      try {
        const res = await fetch(`/api/empleados/admin/cesantias?empleado_id=${empleadoId}`)
        const data = await res.json()
        if (cancel) return
        if (!res.ok) { setError(data.error); reset(); return }
        const found = (data.cesantias as CesantiasDoc[] | undefined)?.find((x) => x.anio === anio)
        if (found) cargarDesde(found); else reset()
      } finally {
        if (!cancel) setCargando(false)
      }
    })()
    return () => { cancel = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoId, anio])

  async function calcularDesdeContrato() {
    if (!empleadoId) return setError("Selecciona un empleado.")
    setError(""); setMsg("")
    try {
      const res = await fetch(`/api/empleados/admin/contratos?empleado_id=${empleadoId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const vigente = condicionesVigentes((data.contratos ?? []) as Contrato[])
      if (!vigente) return setError("Este empleado no tiene contrato definido todavía.")
      const b = (Number(vigente.salario_basico) || 0) + (Number(vigente.auxilio_transporte) || 0)
      const ces = calcularCesantias(b, dias)
      setBase(b); setCesantias(ces); setIntereses(calcularInteresesCesantias(ces, dias))
      setMsg("✓ Calculadas desde el contrato vigente. Puedes ajustar los días o los valores.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al calcular.")
    }
  }

  function recalcular(nuevaBase: number, nuevosDias: number) {
    const ces = calcularCesantias(nuevaBase, nuevosDias)
    setCesantias(ces)
    setIntereses(calcularInteresesCesantias(ces, nuevosDias))
  }

  const total = (Number(cesantias) || 0) + (Number(intereses) || 0)

  async function guardar(publicar: boolean) {
    if (!empleadoId) return setError("Selecciona un empleado.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/admin/cesantias", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleado_id: empleadoId, anio, dias: Number(dias) || 0, base: Number(base) || 0,
          cesantias: Number(cesantias) || 0, intereses: Number(intereses) || 0,
          fondo: fondo || null, observaciones: obs || null, publicado: publicar,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setExistingId(data.cesantias.id)
      setPublicado(publicar)
      setMsg(publicar ? "✓ Guardadas y publicadas. El empleado ya puede descargarlas." : "✓ Guardadas como borrador.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-6 flex items-center gap-2.5">
        <PiggyBank size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Cesantías</h1>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Empleado</span>
          <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
            <option value="">— Selecciona —</option>
            {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Año a liquidar</span>
          <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} w-32`} />
        </label>
      </div>

      {!empleadoId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-[#fff]/50">
          Selecciona un empleado y el año para liquidar sus cesantías.
        </div>
      ) : cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#fff]/80">Liquidación anual</h2>
            <button onClick={calcularDesdeContrato} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20">
              <Calculator size={12} /> Calcular desde contrato
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Base (básico + auxilio)</span>
              <MoneyInput value={base} onChange={(v) => { setBase(v); recalcular(v, dias) }} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Días trabajados (máx 360)</span>
              <input type="number" value={dias} onChange={(e) => { const v = Number(e.target.value); setDias(v); recalcular(base, v) }} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Cesantías (consignadas al fondo)</span>
              <MoneyInput value={cesantias} onChange={(v) => { setCesantias(v); setIntereses(calcularInteresesCesantias(v, dias)) }} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Intereses (12% anual)</span>
              <MoneyInput value={intereses} onChange={setIntereses} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={lblCls}>Fondo de cesantías</span>
              <input list="cat-fondos-cesantias" value={fondo} onChange={(e) => setFondo(e.target.value)} placeholder="Elige o escribe…" className={inputCls} />
              <datalist id="cat-fondos-cesantias">{FONDOS_CESANTIAS.map((x) => <option key={x} value={x} />)}</datalist>
            </label>
          </div>
          <div className="mt-3">
            <span className={lblCls}>Observaciones</span>
            <textarea rows={2} value={obs} onChange={(e) => setObs(e.target.value)} className={`${inputCls} mt-1.5`} />
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs text-[#fff]/50">Total (cesantías + intereses)</p>
            <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatCOP(total)}</p>
            {publicado ? (
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"><CheckCircle2 size={11} /> Publicadas</p>
            ) : (
              <p className="mt-2 text-[11px] text-[#fff]/40">Borrador — no visible para el empleado.</p>
            )}
          </div>

          {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
          {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={() => guardar(true)} disabled={guardando} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
              {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar y publicar
            </button>
            <button onClick={() => guardar(false)} disabled={guardando} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5 disabled:opacity-60">
              Guardar borrador
            </button>
            {existingId && (
              <a href={`/api/empleados/cesantias/${existingId}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5">
                <Download size={14} /> Ver PDF
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
