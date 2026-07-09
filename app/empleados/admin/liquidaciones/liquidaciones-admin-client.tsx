"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Save, Download, Calculator, FileWarning, CheckCircle2, Plus, Trash2, Upload, Paperclip, ShieldAlert,
} from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import type { LineaNomina } from "@/lib/empleados/desprendible"
import { formatCOP } from "@/lib/empleados/desprendible"
import { type Contrato, condicionesVigentes } from "@/lib/empleados/contrato"
import {
  type Liquidacion, type TipoTerminacion, type CausaTerminacion, CAUSA_TERMINACION_LABEL, causaConIndemnizacion, precalcularLiquidacion, sumaOtros, categoriaContrato, descansoFinDeSemana,
} from "@/lib/empleados/liquidacion"
import { TIPOS_CONTRATO } from "@/lib/empleados/catalogos-co"
import type { Cuenta } from "@/lib/empleados/contabilidad"
import type { HoraExtra } from "@/lib/empleados/horas-extras"
import { MoneyInput } from "../../money-input"
import { ConfirmDialog } from "../../confirm-dialog"

/** Concepto de la línea auto de horas extra (para poder refrescarla sin duplicar). */
const HX_CONCEPTO = "Horas extra aprobadas del período"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

function hoyISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function LiquidacionesAdminClient({ empleados, empleadoInicial = "" }: { empleados: Empleado[]; empleadoInicial?: string }) {
  const [empleadoId, setEmpleadoId] = useState(empleadoInicial)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [estado, setEstado] = useState<"borrador" | "generada">("borrador")
  const [cartaPath, setCartaPath] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [vacSugerido, setVacSugerido] = useState<number | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  const [cuentasCOP, setCuentasCOP] = useState<Cuenta[]>([])
  const [cuentaEgreso, setCuentaEgreso] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  // Terminación + fechas
  const [causa, setCausa] = useState<CausaTerminacion>("renuncia")
  const tipoTerminacion: TipoTerminacion = causaConIndemnizacion(causa) ? "sin_justa_causa" : "justa_causa"
  const [motivo, setMotivo] = useState("")
  const [fechaIngreso, setFechaIngreso] = useState("")
  const [fechaEgreso, setFechaEgreso] = useState(hoyISO())
  const [tipoContrato, setTipoContrato] = useState("")
  const [fechaFinContrato, setFechaFinContrato] = useState("")

  // Base salarial
  const [salarioBasico, setSalarioBasico] = useState(0)
  const [auxilio, setAuxilio] = useState(0)

  // Rubros
  const [salarioDias, setSalarioDias] = useState(0)
  const [salario, setSalario] = useState(0)
  const [cesantiasDias, setCesantiasDias] = useState(0)
  const [cesantias, setCesantias] = useState(0)
  const [intereses, setIntereses] = useState(0)
  const [primaDias, setPrimaDias] = useState(0)
  const [prima, setPrima] = useState(0)
  const [vacDias, setVacDias] = useState(0)
  const [vacaciones, setVacaciones] = useState(0)
  const [indemDias, setIndemDias] = useState(0)
  const [indem, setIndem] = useState(0)
  const [otros, setOtros] = useState<LineaNomina[]>([])
  const [horasExtraIds, setHorasExtraIds] = useState<string[]>([])
  // Deducciones de ley
  const [saludEmpleado, setSaludEmpleado] = useState(0)
  const [pensionEmpleado, setPensionEmpleado] = useState(0)
  const [retencionFuente, setRetencionFuente] = useState(0)

  // Seguridad social + notas
  const [ssPagada, setSsPagada] = useState(false)
  const [ssSaldo, setSsSaldo] = useState(0)
  const [obs, setObs] = useState("")

  // Dispara el auto-cálculo cuando se carga una liquidación nueva (sin guardar).
  const [autoCalcTick, setAutoCalcTick] = useState(0)
  const [reabriendo, setReabriendo] = useState(false)
  const [confirmarReabrir, setConfirmarReabrir] = useState(false)

  const empleado = useMemo(() => empleados.find((e) => e.id === empleadoId) ?? null, [empleados, empleadoId])
  const esObraOFijo = categoriaContrato(tipoContrato) !== "indefinido"

  const total = useMemo(
    () => salario + cesantias + intereses + prima + vacaciones + (tipoTerminacion === "sin_justa_causa" ? indem : 0) + sumaOtros(otros)
      - saludEmpleado - pensionEmpleado - retencionFuente,
    [salario, cesantias, intereses, prima, vacaciones, indem, otros, tipoTerminacion, saludEmpleado, pensionEmpleado, retencionFuente],
  )

  // Cuentas COP de Contabilidad (para registrar el egreso al generar).
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await fetch("/api/empleados/admin/contabilidad/cuentas")
        const data = await res.json()
        if (!cancel && res.ok) setCuentasCOP(((data.cuentas ?? []) as Cuenta[]).filter((c) => c.moneda === "COP" && c.activa))
      } catch { /* contabilidad opcional */ }
    })()
    return () => { cancel = true }
  }, [])

  function resetRubros(ingreso: string) {
    setExistingId(null); setEstado("borrador"); setCartaPath(null)
    setCausa("renuncia"); setMotivo("")
    setFechaIngreso(ingreso); setFechaEgreso(hoyISO())
    setTipoContrato(""); setFechaFinContrato("")
    setSalarioBasico(0); setAuxilio(0)
    setSalarioDias(0); setSalario(0)
    setCesantiasDias(0); setCesantias(0); setIntereses(0)
    setPrimaDias(0); setPrima(0); setVacDias(vacSugerido ?? 0); setVacaciones(0)
    setIndemDias(0); setIndem(0); setOtros([])
    setSaludEmpleado(0); setPensionEmpleado(0); setRetencionFuente(0)
    setSsPagada(false); setSsSaldo(0); setObs("")
  }

  function cargarDesde(l: Liquidacion) {
    setExistingId(l.id); setEstado(l.estado); setCartaPath(l.carta_path)
    setCausa(l.causa_terminacion ?? (l.tipo_terminacion === "sin_justa_causa" ? "despido_sin_justa" : "renuncia")); setMotivo(l.motivo ?? "")
    setFechaIngreso(l.fecha_ingreso ?? ""); setFechaEgreso(l.fecha_egreso)
    setTipoContrato(l.tipo_contrato ?? ""); setFechaFinContrato(l.fecha_fin_contrato ?? "")
    setSalarioBasico(Number(l.salario_basico) || 0); setAuxilio(Number(l.auxilio_transporte) || 0)
    setSalarioDias(Number(l.salario_dias) || 0); setSalario(Number(l.salario) || 0)
    setCesantiasDias(Number(l.cesantias_dias) || 0); setCesantias(Number(l.cesantias) || 0)
    setIntereses(Number(l.intereses_cesantias) || 0)
    setPrimaDias(Number(l.prima_dias) || 0); setPrima(Number(l.prima) || 0)
    setVacDias(Number(l.vacaciones_dias) || 0); setVacaciones(Number(l.vacaciones) || 0)
    setIndemDias(Number(l.indemnizacion_dias) || 0); setIndem(Number(l.indemnizacion) || 0)
    setOtros(l.otros_conceptos ?? [])
    setSaludEmpleado(Number(l.salud_empleado) || 0); setPensionEmpleado(Number(l.pension_empleado) || 0); setRetencionFuente(Number(l.retencion_fuente) || 0)
    setSsPagada(l.seguridad_social_pagada); setSsSaldo(Number(l.seguridad_social_saldo) || 0)
    setObs(l.observaciones ?? "")
  }

  useEffect(() => {
    setMsg(""); setError("")
    if (!empleadoId) return
    let cancel = false
    ;(async () => {
      setCargando(true)
      try {
        const res = await fetch(`/api/empleados/admin/liquidaciones?empleado_id=${empleadoId}`)
        const data = await res.json()
        if (cancel) return
        setVacSugerido(typeof data.vacacionesPendientes === "number" ? data.vacacionesPendientes : null)
        if (!res.ok) { setError(data.error); resetRubros(empleado?.fecha_ingreso ?? ""); return }
        if (data.liquidacion) cargarDesde(data.liquidacion as Liquidacion)
        else {
          resetRubros(empleado?.fecha_ingreso ?? "")
          if (typeof data.vacacionesPendientes === "number") setVacDias(data.vacacionesPendientes)
          setAutoCalcTick((t) => t + 1) // liquidación nueva: calcular solo
        }
      } finally {
        if (!cancel) setCargando(false)
      }
    })()
    return () => { cancel = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoId])

  async function calcular(silent = false) {
    if (!empleadoId) { if (!silent) setError("Selecciona un empleado."); return }
    if (!fechaIngreso) { if (!silent) setError("Falta la fecha de ingreso del empleado."); return }
    setError(""); setMsg("")
    try {
      const res = await fetch(`/api/empleados/admin/contratos?empleado_id=${empleadoId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const vigente = condicionesVigentes((data.contratos ?? []) as Contrato[])
      if (!vigente) return setError("Este empleado aún no tiene contrato (condiciones salariales) registrado. Créalo en Gestión de empleados → Contratos, o escribe el salario a mano abajo.")

      const basico = Number(vigente.salario_basico) || 0
      const aux = Number(vigente.auxilio_transporte) || 0
      const tipoC = vigente.tipo_contrato ?? tipoContrato
      setSalarioBasico(basico); setAuxilio(aux); setTipoContrato(tipoC)

      // Horas extra aprobadas del empleado (para promediar en la base y pagar las pendientes).
      let horasExtras: HoraExtra[] = []
      try {
        const rhx = await fetch(`/api/empleados/admin/horas-extras?empleado_id=${empleadoId}`)
        const dhx = await rhx.json()
        if (rhx.ok) horasExtras = (dhx.horas ?? []) as HoraExtra[]
      } catch { /* horas extra opcionales */ }

      const pre = precalcularLiquidacion({
        tipoTerminacion, salarioBasico: basico, auxilioTransporte: aux,
        fechaIngreso, fechaEgreso, tipoContrato: tipoC, fechaFinContrato: fechaFinContrato || null,
        // Vacaciones: el saldo FRESCO del módulo de Vacaciones (no un valor viejo guardado).
        // Salario: sin diasSalarioPendiente, precalc asume nómina a mes vencido (días del mes de egreso).
        diasVacacionesPendientes: vacSugerido ?? vacDias,
        horasExtras,
      })
      setSalarioDias(pre.salarioDias); setSalario(pre.salario)
      setCesantiasDias(pre.cesantiasDias); setCesantias(pre.cesantias); setIntereses(pre.interesesCesantias)
      setPrimaDias(pre.primaDias); setPrima(pre.prima)
      setVacDias(pre.vacacionesDias); setVacaciones(pre.vacaciones)
      setIndemDias(pre.indemnizacionDias); setIndem(pre.indemnizacion)
      setSaludEmpleado(pre.saludEmpleado); setPensionEmpleado(pre.pensionEmpleado)
      // Horas extra aprobadas y no pagadas → línea de devengado (se marcan pagadas al generar).
      setHorasExtraIds(pre.extrasHorasExtraIds ?? [])
      setOtros((prev) => {
        const rest = prev.filter((o) => o.concepto !== HX_CONCEPTO)
        return pre.extrasHorasExtra > 0 ? [...rest, { concepto: HX_CONCEPTO, valor: pre.extrasHorasExtra }] : rest
      })
      if (!silent) setMsg("✓ Pre-calculado desde el contrato vigente. Revisa y ajusta cada rubro antes de generar.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al calcular.")
    }
  }

  // Reliquidar: reabre una liquidación GENERADA a borrador (anula el egreso en contabilidad y
  // reactiva al empleado), y deja los rubros recalculados para revisarlos y volver a generar.
  async function reabrir() {
    if (!existingId) return
    setError(""); setMsg(""); setReabriendo(true)
    try {
      const res = await fetch(`/api/empleados/admin/liquidaciones/${existingId}/reabrir`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudo reabrir.")
      setConfirmarReabrir(false)
      setEstado("borrador")
      await calcular(true)
      setMsg(`✓ Liquidación reabierta a borrador${data.aviso ? ` · ${data.aviso}` : ". Revisa los rubros y vuelve a generarla."}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo reabrir.")
    } finally {
      setReabriendo(false)
    }
  }

  // Auto-cálculo: recalcula solo (silencioso) al cargar una liquidación nueva y cada vez que
  // cambian los datos que mueven toda la cuenta (fecha de egreso o causa). Nunca toca una
  // liquidación ya guardada/generada — ahí el CEO usa el botón "Calcular" a propósito.
  const calcularRef = useRef(calcular)
  calcularRef.current = calcular
  useEffect(() => {
    if (existingId !== null || estado === "generada") return
    if (!empleadoId || !fechaIngreso || !/^\d{4}-\d{2}-\d{2}$/.test(fechaEgreso)) return
    const t = setTimeout(() => { calcularRef.current(true) }, 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCalcTick, fechaEgreso, causa])

  function payload(generar: boolean) {
    return {
      empleado_id: empleadoId, generar,
      cuenta_id: generar ? (cuentaEgreso || null) : null,
      tipo_terminacion: tipoTerminacion, causa_terminacion: causa, motivo: motivo || null,
      fecha_ingreso: fechaIngreso || null, fecha_egreso: fechaEgreso,
      salario_basico: salarioBasico, auxilio_transporte: auxilio, base: salarioBasico + auxilio,
      tipo_contrato: tipoContrato || null, fecha_fin_contrato: fechaFinContrato || null,
      salario_dias: salarioDias, salario,
      cesantias_dias: cesantiasDias, cesantias, intereses_cesantias: intereses,
      prima_dias: primaDias, prima, vacaciones_dias: vacDias, vacaciones,
      indemnizacion_dias: tipoTerminacion === "sin_justa_causa" ? indemDias : 0,
      indemnizacion: tipoTerminacion === "sin_justa_causa" ? indem : 0,
      otros_conceptos: otros.filter((o) => o.concepto?.trim()),
      salud_empleado: saludEmpleado, pension_empleado: pensionEmpleado, retencion_fuente: retencionFuente,
      seguridad_social_pagada: ssPagada, seguridad_social_saldo: ssPagada ? 0 : ssSaldo,
      observaciones: obs || null,
      // Horas extra incluidas: al generar se marcan como pagadas para no volver a liquidarlas.
      horas_extra_ids: horasExtraIds,
    }
  }

  async function guardar(generar: boolean) {
    if (!empleadoId) return setError("Selecciona un empleado.")
    if (!fechaEgreso) return setError("Indica la fecha de egreso (corte).")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const res = await fetch("/api/empleados/admin/liquidaciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(generar)),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      cargarDesde(data.liquidacion as Liquidacion)
      const avisoContab = generar
        ? data.contabilidad?.ok
          ? " Egreso registrado en Contabilidad."
          : data.contabilidad?.aviso
            ? ` ${data.contabilidad.aviso}`
            : ""
        : ""
      setMsg(generar
        ? `✓ Liquidación generada. El contrato quedó cerrado y el empleado perdió el acceso. Descarga el PDF y envíalo.${avisoContab}`
        : "✓ Guardada como borrador. Puedes adjuntar la carta y descargar el PDF.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardando(false)
      setConfirmar(false)
    }
  }

  async function subirCarta(file: File) {
    if (!existingId) return
    setError(""); setMsg("")
    const fd = new FormData(); fd.append("archivo", file)
    try {
      const res = await fetch(`/api/empleados/admin/liquidaciones/${existingId}/archivo`, { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCartaPath((data.liquidacion as Liquidacion).carta_path)
      setMsg("✓ Carta adjuntada.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir la carta.")
    }
  }

  const bloqueado = estado === "generada"

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-2 flex items-center gap-2.5">
        <FileWarning size={20} className="text-[var(--magenta)]" />
        <h1 className="font-display text-xl font-bold">Liquidaciones</h1>
      </div>
      <p className="mb-6 text-sm text-[#fff]/55">
        Liquidación definitiva al finalizar un contrato. Solo la ve el administrador; al generarla, el vínculo se cierra y el empleado pierde el acceso.
      </p>

      <label className="mb-6 flex max-w-sm flex-col gap-1.5">
        <span className={lblCls}>Empleado</span>
        <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
          <option value="">— Selecciona —</option>
          {empleados.filter((e) => e.tipo_vinculacion === "empleado").map((e) => (
            <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}{e.estado === "terminado" ? " · terminado" : ""}</option>
          ))}
        </select>
        <span className="text-[11px] text-[#fff]/40">Solo vinculación laboral. Freelance y prestación de servicios no llevan liquidación (cobran por factura).</span>
      </label>

      {!empleadoId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-[#fff]/50">
          Selecciona un empleado para liquidar su contrato.
        </div>
      ) : cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <section className="space-y-5">
          {bloqueado && (
            <div className="flex flex-col gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-200 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2"><CheckCircle2 size={15} /> Esta liquidación ya fue generada. Puedes descargar el PDF o reliquidarla si hay un error.</span>
              <button
                onClick={() => setConfirmarReabrir(true)}
                disabled={reabriendo}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/20 disabled:opacity-50"
              >
                {reabriendo ? <Loader2 size={13} className="animate-spin" /> : <Calculator size={13} />} Reliquidar
              </button>
            </div>
          )}

          {/* Terminación */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#fff]/80">Terminación</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Causa de terminación</span>
                <select disabled={bloqueado} value={causa} onChange={(e) => setCausa(e.target.value as CausaTerminacion)} className={inputCls}>
                  {(Object.keys(CAUSA_TERMINACION_LABEL) as CausaTerminacion[]).map((c) => (
                    <option key={c} value={c}>{CAUSA_TERMINACION_LABEL[c]}</option>
                  ))}
                </select>
                <span className="text-[11px] text-[#fff]/40">Solo el despido sin justa causa genera indemnización.</span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Observación de la causa (opcional)</span>
                <input disabled={bloqueado} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Detalle interno del retiro…" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fecha de ingreso</span>
                <input disabled={bloqueado} type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fecha de egreso (corte)</span>
                <input disabled={bloqueado} type="date" value={fechaEgreso} onChange={(e) => setFechaEgreso(e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Tipo de contrato</span>
                <input disabled={bloqueado} list="cat-tipos-contrato" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} placeholder="Elige o escribe…" className={inputCls} />
                <datalist id="cat-tipos-contrato">{TIPOS_CONTRATO.map((x) => <option key={x} value={x} />)}</datalist>
              </label>
              {esObraOFijo && (
                <label className="flex flex-col gap-1.5">
                  <span className={lblCls}>Fin del plazo/obra (indemnización)</span>
                  <input disabled={bloqueado} type="date" value={fechaFinContrato} onChange={(e) => setFechaFinContrato(e.target.value)} className={inputCls} />
                </label>
              )}
            </div>
          </div>

          {/* Base + botón calcular */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#fff]/80">Base salarial</h2>
              <button onClick={() => calcular()} disabled={bloqueado} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20 disabled:opacity-40">
                <Calculator size={12} /> Recalcular
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Salario básico</span>
                <MoneyInput value={salarioBasico} onChange={setSalarioBasico} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Auxilio de transporte</span>
                <MoneyInput value={auxilio} onChange={setAuxilio} className={inputCls} />
              </label>
            </div>
            {vacSugerido !== null && (
              <p className="mt-3 text-xs text-[#fff]/45">Las vacaciones se llenan con el <b className="text-[#fff]/70">saldo pendiente</b> del módulo de Vacaciones (días acumulados antes del corte + causadas − tomadas): <b className="text-[#fff]/70">{vacSugerido} días</b>. Puedes ajustarlo (admite decimales).</p>
            )}
          </div>

          {/* Rubros */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#fff]/80">Rubros de la liquidación</h2>
            <div className="space-y-3">
              <RubroRow
                label="Salario del último periodo (días no pagados)"
                dias={salarioDias}
                setDias={(d) => {
                  setSalarioDias(d)
                  const v = Math.round((salarioBasico * d) / 30)
                  setSalario(v); setSaludEmpleado(Math.round(v * 0.04)); setPensionEmpleado(Math.round(v * 0.04))
                }}
                valor={salario}
                setValor={(v) => { setSalario(v); setSaludEmpleado(Math.round(v * 0.04)); setPensionEmpleado(Math.round(v * 0.04)) }}
                disabled={bloqueado}
              />
              {fechaEgreso && descansoFinDeSemana(fechaEgreso) > 0 && (
                <p className="-mt-1 pl-1 text-[11px] text-[#fff]/45">
                  Incluye <b className="text-[#fff]/70">{descansoFinDeSemana(fechaEgreso)} día(s) de descanso dominical remunerado</b>: el egreso completa la semana laboral, así que se paga el fin de semana ganado.
                </p>
              )}
              <RubroRow label="Cesantías" dias={cesantiasDias} setDias={setCesantiasDias} valor={cesantias} setValor={setCesantias} disabled={bloqueado} />
              <RubroRow label="Intereses a las cesantías (12%)" valor={intereses} setValor={setIntereses} disabled={bloqueado} />
              <RubroRow label="Prima de servicios proporcional" dias={primaDias} setDias={setPrimaDias} valor={prima} setValor={setPrima} disabled={bloqueado} />
              <RubroRow label="Vacaciones compensadas (días acumulados, 15/año)" dias={vacDias} setDias={setVacDias} valor={vacaciones} setValor={setVacaciones} disabled={bloqueado} />
              {tipoTerminacion === "sin_justa_causa" && (
                <RubroRow label="Indemnización por despido (art. 64 CST)" dias={indemDias} setDias={setIndemDias} valor={indem} setValor={setIndem} disabled={bloqueado} />
              )}
            </div>

            {/* Otros conceptos */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className={lblCls}>Otros conceptos (bonos + / deducciones −)</span>
                <button onClick={() => setOtros([...otros, { concepto: "", valor: 0 }])} disabled={bloqueado} className="inline-flex items-center gap-1 text-xs text-[var(--cyan)] hover:underline disabled:opacity-40">
                  <Plus size={12} /> Agregar
                </button>
              </div>
              {otros.map((o, i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                  <input disabled={bloqueado} value={o.concepto} onChange={(e) => { const c = [...otros]; c[i] = { ...c[i], concepto: e.target.value }; setOtros(c) }} placeholder="Concepto" className={`${inputCls} flex-1`} />
                  <input disabled={bloqueado} type="number" value={o.valor} onChange={(e) => { const c = [...otros]; c[i] = { ...c[i], valor: Number(e.target.value) }; setOtros(c) }} placeholder="Valor (− para deducir)" className={`${inputCls} w-40`} />
                  <button onClick={() => setOtros(otros.filter((_, j) => j !== i))} disabled={bloqueado} className="rounded-lg p-2 text-red-300/70 hover:bg-red-500/10 disabled:opacity-40"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            {/* Deducciones de ley (se restan del neto) */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <span className={lblCls}>Deducciones de ley (se restan del neto)</span>
              <p className="mb-3 mt-1 text-[11px] text-[#fff]/45">Salud y pensión = 4% sobre el salario del periodo (editables). <b>Retención en la fuente:</b> normalmente queda en $0 — solo aplica si el pago total del mes supera ~$7.000.000 (≈95 UVT). Un pago alto de vacaciones puede empujar el mes por encima de ese umbral; en ese caso el contador calcula el valor y lo pones aquí.</p>
              <div className="space-y-3">
                <RubroRow label="Salud empleado (4%)" valor={saludEmpleado} setValor={setSaludEmpleado} disabled={bloqueado} />
                <RubroRow label="Pensión empleado (4%)" valor={pensionEmpleado} setValor={setPensionEmpleado} disabled={bloqueado} />
                <RubroRow label="Retención en la fuente" valor={retencionFuente} setValor={setRetencionFuente} disabled={bloqueado} />
              </div>
            </div>
          </div>

          {/* Seguridad social + notas */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#fff]/80">Seguridad social (informativo)</h2>
            <label className="flex items-center gap-2 text-sm text-[#fff]/75">
              <input type="checkbox" disabled={bloqueado} checked={ssPagada} onChange={(e) => setSsPagada(e.target.checked)} className="h-4 w-4 accent-[var(--cyan)]" />
              La seguridad social del periodo está al día.
            </label>
            {!ssPagada && (
              <label className="mt-3 flex max-w-xs flex-col gap-1.5">
                <span className={lblCls}>Saldo pendiente de aportar (mes de egreso)</span>
                <MoneyInput value={ssSaldo} onChange={setSsSaldo} className={inputCls} />
              </label>
            )}
            <div className="mt-4">
              <span className={lblCls}>Observaciones</span>
              <textarea disabled={bloqueado} rows={2} value={obs} onChange={(e) => setObs(e.target.value)} className={`${inputCls} mt-1.5`} />
            </div>
          </div>

          {/* Total */}
          <div className="rounded-2xl border border-[var(--magenta)]/25 bg-[var(--magenta)]/[0.06] p-5">
            <p className="text-xs text-[#fff]/55">Total neto a pagar al empleado</p>
            <p className="font-display text-3xl font-bold text-[var(--magenta)]">{formatCOP(total)}</p>
            {estado === "generada"
              ? <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300"><CheckCircle2 size={11} /> Generada</p>
              : <p className="mt-2 text-[11px] text-[#fff]/40">Borrador — no visible para el empleado.</p>}
          </div>

          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          {msg && <p className="rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

          {/* Registrar egreso en Contabilidad al generar */}
          {!bloqueado && cuentasCOP.length > 0 && (
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Registrar egreso en Contabilidad (al generar)</span>
              <select value={cuentaEgreso} onChange={(e) => setCuentaEgreso(e.target.value)} className={`${inputCls} sm:max-w-sm`}>
                <option value="">— No registrar —</option>
                {cuentasCOP.map((c) => <option key={c.id} value={c.id}>{c.nombre} (COP)</option>)}
              </select>
            </label>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => guardar(false)} disabled={guardando || bloqueado} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-[#fff]/85 hover:bg-white/5 disabled:opacity-50">
              {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar borrador
            </button>
            {existingId && (
              <>
                <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) subirCarta(f); e.target.value = "" }} />
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5">
                  <Upload size={14} /> {cartaPath ? "Reemplazar carta" : "Adjuntar carta"}
                </button>
                {cartaPath && (
                  <a href={`/api/empleados/admin/liquidaciones/${existingId}/archivo`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm text-[#fff]/75 hover:bg-white/5">
                    <Paperclip size={13} /> Ver carta
                  </a>
                )}
                <a href={`/api/empleados/admin/liquidaciones/${existingId}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5">
                  <Download size={14} /> Ver PDF
                </a>
              </>
            )}
            {!bloqueado && (
              <button onClick={() => setConfirmar(true)} disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-[var(--magenta)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
                <ShieldAlert size={14} /> Generar liquidación
              </button>
            )}
          </div>
        </section>
      )}

      <ConfirmDialog
        abierto={confirmar}
        titulo="Generar liquidación"
        mensaje={`Se generará la liquidación definitiva de ${empleado?.nombre ?? "el empleado"} por ${formatCOP(total)}. El contrato quedará CERRADO (fecha de egreso ${fechaEgreso}) y el empleado perderá el acceso al portal. ¿Continuar?`}
        confirmLabel="Generar y cerrar contrato"
        tone="danger"
        cargando={guardando}
        onConfirm={() => guardar(true)}
        onCancel={() => setConfirmar(false)}
      />

      <ConfirmDialog
        abierto={confirmarReabrir}
        titulo="Reliquidar"
        mensaje={`Se reabrirá la liquidación de ${empleado?.nombre ?? "el empleado"} a borrador: se anulará el egreso registrado en contabilidad y el empleado volverá a estar activo. Después podrás recalcular y volver a generarla. ¿Continuar?`}
        confirmLabel="Sí, reliquidar"
        tone="danger"
        cargando={reabriendo}
        onConfirm={reabrir}
        onCancel={() => setConfirmarReabrir(false)}
      />
    </div>
  )
}

/** Campo de días con separador flexible (coma o punto) y sin stepper. */
function DiasInput({ dias, setDias, disabled }: { dias: number; setDias: (n: number) => void; disabled?: boolean }) {
  const [str, setStr] = useState(String(dias))
  useEffect(() => {
    // Solo se sincroniza desde afuera (p. ej. al "Calcular"); no interrumpe lo que se está escribiendo.
    if (Number(str.replace(",", ".")) !== dias) setStr(String(dias))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dias])
  return (
    <label className="flex w-24 flex-col gap-1.5">
      <span className={lblCls}>Días</span>
      <input
        disabled={disabled} type="text" inputMode="decimal" value={str}
        onChange={(e) => { const raw = e.target.value.replace(/[^\d.,]/g, ""); setStr(raw); setDias(Number(raw.replace(",", ".")) || 0) }}
        placeholder="0" className={inputCls}
      />
    </label>
  )
}

function RubroRow({
  label, dias, setDias, valor, setValor, disabled,
}: {
  label: string
  dias?: number
  setDias?: (n: number) => void
  valor: number
  setValor: (n: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-end gap-2">
      <label className="flex flex-1 flex-col gap-1.5">
        <span className={lblCls}>{label}</span>
        <MoneyInput value={valor} onChange={setValor} className={inputCls} />
      </label>
      {setDias && <DiasInput dias={dias ?? 0} setDias={setDias} disabled={disabled} />}
    </div>
  )
}
