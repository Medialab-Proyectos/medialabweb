"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, Plus, Trash2, Download, Save, Calculator, FileText, CheckCircle2, FileSignature, ArrowLeft } from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import type { Desprendible } from "@/lib/empleados/desprendible"
import { MESES, formatCOP, totales, numeroALetras } from "@/lib/empleados/desprendible"
import { type Contrato, condicionesVigentes } from "@/lib/empleados/contrato"
import { FONDOS_PENSION, EPS_CO, BANCOS_CO } from "@/lib/empleados/catalogos-co"
import { MoneyInput } from "../../money-input"
import { aportesEmpleado } from "@/lib/empleados/nomina-co"

type Linea = { concepto: string; valor: number; codigo?: string }

const hoy = new Date()
const ultimoDia = (anio: number, mes: number) => new Date(anio, mes, 0).getDate()
const AUXILIOS = ["Auxilio de transporte", "Auxilio conectividad", "Bonificación no prestacional", "Auxilio PC", "Horas extra", "Comisiones"]

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function DesprendiblesAdminClient({ empleados }: { empleados: Empleado[] }) {
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [empleadoId, setEmpleadoId] = useState("")
  const [existingId, setExistingId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const [fechaNomina, setFechaNomina] = useState("")
  const [cargo, setCargo] = useState("")
  const [dias, setDias] = useState(30)
  const [basico, setBasico] = useState(0)
  const [fondoPension, setFondoPension] = useState("")
  const [epsSalud, setEpsSalud] = useState("")
  const [banco, setBanco] = useState("")
  const [cuenta, setCuenta] = useState("")
  const [devengos, setDevengos] = useState<Linea[]>([])
  const [deducciones, setDeducciones] = useState<Linea[]>([])
  const [baseSal, setBaseSal] = useState<number | "">("")
  const [basePen, setBasePen] = useState<number | "">("")
  const [baseRet, setBaseRet] = useState<number | "">("")
  const [porcRet, setPorcRet] = useState(0)
  const [diasVac, setDiasVac] = useState(0)
  const [obs, setObs] = useState("")
  const [publicado, setPublicado] = useState(false)

  function resetForm(emp?: Empleado) {
    setExistingId(null)
    setFechaNomina(`${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia(anio, mes)).padStart(2, "0")}`)
    setCargo(emp?.cargo ?? "")
    setDias(30); setBasico(0); setFondoPension(""); setEpsSalud(""); setBanco(""); setCuenta("")
    setDevengos([]); setDeducciones([]); setBaseSal(""); setBasePen(""); setBaseRet(""); setPorcRet(0); setDiasVac(0); setObs(""); setPublicado(false)
  }

  function cargarDesde(d: Desprendible) {
    setExistingId(d.id)
    setFechaNomina(d.fecha_nomina ?? "")
    setCargo(d.cargo ?? "")
    setDias(Number(d.dias) || 30)
    setBasico(Number(d.salario_basico) || 0)
    setFondoPension(d.fondo_pension ?? "")
    setEpsSalud(d.eps_salud ?? "")
    setBanco(d.banco ?? "")
    setCuenta(d.cuenta ?? "")
    setDevengos((d.devengos ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0, codigo: l.codigo })))
    setDeducciones((d.deducciones ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0, codigo: l.codigo })))
    setBaseSal(d.base_salarial ?? "")
    setBasePen(d.base_pension ?? "")
    setBaseRet(d.base_retencion ?? "")
    setPorcRet(Number(d.porc_retencion) || 0)
    setDiasVac(Number(d.dias_vac_pend) || 0)
    setObs(d.observaciones ?? "")
    setPublicado(d.publicado)
  }

  /** Precarga las condiciones constantes desde el mes anterior, como BORRADOR nuevo. */
  function cargarComoNuevo(d: Desprendible) {
    setExistingId(null)
    setFechaNomina(`${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia(anio, mes)).padStart(2, "0")}`)
    setCargo(d.cargo ?? "")
    setDias(Number(d.dias) || 30)
    setBasico(Number(d.salario_basico) || 0)
    setFondoPension(d.fondo_pension ?? "")
    setEpsSalud(d.eps_salud ?? "")
    setBanco(d.banco ?? "")
    setCuenta(d.cuenta ?? "")
    setDevengos((d.devengos ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0, codigo: l.codigo })))
    setDeducciones((d.deducciones ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0, codigo: l.codigo })))
    setBaseSal(d.base_salarial ?? "")
    setBasePen(d.base_pension ?? "")
    setBaseRet(d.base_retencion ?? "")
    setPorcRet(Number(d.porc_retencion) || 0)
    setDiasVac(Number(d.dias_vac_pend) || 0)
    setObs("")
    setPublicado(false)
    setMsg(`Datos precargados del mes anterior (${MESES[(d.mes || 1) - 1]} ${d.anio}). Revisa y publica.`)
  }

  useEffect(() => {
    setMsg(""); setError("")
    if (!empleadoId) return
    let cancel = false
    ;(async () => {
      setCargando(true)
      try {
        const res = await fetch(`/api/empleados/admin/desprendibles?empleado_id=${empleadoId}`)
        const data = await res.json()
        if (cancel) return
        const lista = (data.desprendibles as Desprendible[] | undefined) ?? []
        const found = lista.find((x) => x.anio === anio && x.mes === mes)
        if (found) {
          cargarDesde(found)
        } else {
          // No hay desprendible para este mes: precargar del más reciente ANTERIOR
          // (fondo de pensión, EPS, banco, básico… son constantes mes a mes).
          const previo = lista
            .filter((x) => x.anio < anio || (x.anio === anio && x.mes < mes))
            .sort((a, b) => b.anio - a.anio || b.mes - a.mes)[0]
          if (previo) cargarComoNuevo(previo)
          else resetForm(empleados.find((e) => e.id === empleadoId))
        }
      } finally {
        if (!cancel) setCargando(false)
      }
    })()
    return () => { cancel = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoId, anio, mes])

  const t = useMemo(
    () => totales({ salario_basico: Number(basico) || 0, devengos, deducciones }),
    [basico, devengos, deducciones],
  )

  function calcular4() {
    const base = Number(basePen) || Number(baseSal) || Number(basico) || 0
    const { salud, pension, fsp, tasaFsp } = aportesEmpleado(base)
    const ded: Linea[] = [
      { concepto: "Salud empleado (4%)", valor: salud },
      { concepto: "Pensión empleado (4%)", valor: pension },
    ]
    if (fsp > 0) ded.push({ concepto: `Fondo Solidaridad Pensional (${(tasaFsp * 100).toFixed(1)}%)`, valor: fsp })
    setDeducciones(ded)
    if (baseSal === "") setBaseSal(Number(basico) || 0)
    if (basePen === "") setBasePen(Number(basico) || 0)
  }

  async function cargarDesdeContrato() {
    if (!empleadoId) return setError("Selecciona un empleado.")
    setError(""); setMsg("")
    try {
      const res = await fetch(`/api/empleados/admin/contratos?empleado_id=${empleadoId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const vigente = condicionesVigentes((data.contratos ?? []) as Contrato[])
      if (!vigente) return setError("Este empleado no tiene contrato definido todavía.")
      setBasico(Number(vigente.salario_basico) || 0)
      if (vigente.cargo) setCargo(vigente.cargo)
      const nuevos: Linea[] = []
      if (Number(vigente.auxilio_transporte) > 0) nuevos.push({ concepto: "Auxilio de transporte", valor: Number(vigente.auxilio_transporte) })
      for (const l of vigente.otros_devengos ?? []) nuevos.push({ concepto: l.concepto, valor: Number(l.valor) || 0 })
      setDevengos(nuevos)
      setMsg("✓ Datos cargados desde el contrato vigente.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el contrato.")
    }
  }

  async function guardar(publicar: boolean) {
    if (!empleadoId) return setError("Selecciona un empleado.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const body = {
        empleado_id: empleadoId, anio, mes,
        fecha_nomina: fechaNomina || null, cargo: cargo || null, dias: Number(dias) || 0,
        salario_basico: Number(basico) || 0,
        fondo_pension: fondoPension || null, eps_salud: epsSalud || null, banco: banco || null, cuenta: cuenta || null,
        devengos: devengos.filter((l) => l.concepto.trim()).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })),
        deducciones: deducciones.filter((l) => l.concepto.trim()).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })),
        base_salarial: baseSal === "" ? null : Number(baseSal),
        base_pension: basePen === "" ? null : Number(basePen),
        base_retencion: baseRet === "" ? null : Number(baseRet),
        porc_retencion: Number(porcRet) || 0,
        dias_vac_pend: Number(diasVac) || 0,
        observaciones: obs || null,
        publicado: publicar,
      }
      const res = await fetch("/api/empleados/admin/desprendibles", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setExistingId(data.desprendible.id)
      setPublicado(publicar)
      setMsg(publicar ? "✓ Guardado y publicado. El empleado ya puede descargarlo." : "✓ Guardado como borrador (aún no visible para el empleado).")
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
        <FileText size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Generar desprendibles de pago</h1>
      </div>

      {/* Catálogos Colombia (para los <input list=…>) */}
      <datalist id="cat-pension">{FONDOS_PENSION.map((x) => <option key={x} value={x} />)}</datalist>
      <datalist id="cat-eps">{EPS_CO.map((x) => <option key={x} value={x} />)}</datalist>
      <datalist id="cat-bancos">{BANCOS_CO.map((x) => <option key={x} value={x} />)}</datalist>

      {/* Selector período + empleado */}
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Empleado</span>
          <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
            <option value="">— Selecciona —</option>
            {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Mes</span>
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={inputCls}>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={lblCls}>Año</span>
          <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={inputCls} />
        </label>
      </div>

      {!empleadoId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-[#fff]/50">
          Selecciona un empleado y el período para llenar o editar su desprendible.
        </div>
      ) : cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Formulario */}
          <div className="flex flex-col gap-6">
            {/* Cabecera del comprobante */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#fff]/80">Datos del comprobante</h2>
                <button onClick={cargarDesdeContrato} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20">
                  <FileSignature size={12} /> Cargar desde contrato
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Campo label="Fecha de nómina"><input type="date" value={fechaNomina} onChange={(e) => setFechaNomina(e.target.value)} className={inputCls} /></Campo>
                <Campo label="Cargo"><input value={cargo} onChange={(e) => setCargo(e.target.value)} className={inputCls} /></Campo>
                <Campo label="Días laborados"><input type="number" value={dias} onChange={(e) => setDias(Number(e.target.value))} className={inputCls} /></Campo>
                <Campo label="Salario básico"><MoneyInput value={basico} onChange={setBasico} className={inputCls} /></Campo>
                <Campo label="Fondo de pensión"><input list="cat-pension" value={fondoPension} onChange={(e) => setFondoPension(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                <Campo label="EPS (salud)"><input list="cat-eps" value={epsSalud} onChange={(e) => setEpsSalud(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                <Campo label="Banco"><input list="cat-bancos" value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                <Campo label="Cuenta"><input value={cuenta} onChange={(e) => setCuenta(e.target.value)} className={inputCls} /></Campo>
              </div>
            </section>

            {/* Devengos */}
            <LineasEditor titulo="Devengos (auxilios, bonificaciones)" lineas={devengos} setLineas={setDevengos} sugerencias={AUXILIOS} />

            {/* Deducciones */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#fff]/80">Deducciones</h2>
                <button onClick={calcular4} title="Salud 4% + Pensión 4% + FSP (1–2% si el IBC ≥ 4 SMMLV)" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20">
                  <Calculator size={12} /> Calcular salud, pensión y FSP
                </button>
              </div>
              <LineasBody lineas={deducciones} setLineas={setDeducciones} />
            </section>

            {/* Bases */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-sm font-semibold text-[#fff]/80">Bases y retención</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <Campo label="Base salarial"><MoneyInput value={typeof baseSal === "number" ? baseSal : 0} onChange={(n) => setBaseSal(n === 0 ? "" : n)} className={inputCls} /></Campo>
                <Campo label="Base pensión"><MoneyInput value={typeof basePen === "number" ? basePen : 0} onChange={(n) => setBasePen(n === 0 ? "" : n)} className={inputCls} /></Campo>
                <Campo label="Base retención"><MoneyInput value={typeof baseRet === "number" ? baseRet : 0} onChange={(n) => setBaseRet(n === 0 ? "" : n)} className={inputCls} /></Campo>
                <Campo label="% Retención"><input type="number" value={porcRet} onChange={(e) => setPorcRet(Number(e.target.value))} className={inputCls} /></Campo>
                <Campo label="Días vac. pendientes"><input type="number" value={diasVac} onChange={(e) => setDiasVac(Number(e.target.value))} className={inputCls} /></Campo>
              </div>
              <div className="mt-3">
                <span className={lblCls}>Observaciones</span>
                <textarea rows={2} value={obs} onChange={(e) => setObs(e.target.value)} className={`${inputCls} mt-1.5`} />
              </div>
            </section>
          </div>

          {/* Panel de totales + acciones (sticky) */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs text-[#fff]/50">{MESES[mes - 1]} {anio}</p>
              <div className="mt-3 space-y-1.5 text-sm">
                <Row k="Total devengado" v={formatCOP(t.totalDevengos)} />
                <Row k="Total deducciones" v={`- ${formatCOP(t.totalDeducciones)}`} />
              </div>
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs text-[#fff]/50">Neto a pagar</p>
                <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatCOP(t.neto)}</p>
                <p className="mt-1 text-[10px] leading-tight text-[#fff]/40">{numeroALetras(t.neto)}</p>
              </div>

              {publicado ? (
                <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"><CheckCircle2 size={11} /> Publicado</p>
              ) : (
                <p className="mt-4 text-[11px] text-[#fff]/40">Borrador — no visible para el empleado.</p>
              )}

              {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
              {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => guardar(true)} disabled={guardando} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                  {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar y publicar
                </button>
                <button onClick={() => guardar(false)} disabled={guardando} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5 disabled:opacity-60">
                  Guardar borrador
                </button>
                {existingId && (
                  <a href={`/api/empleados/desprendibles/${existingId}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/75 hover:bg-white/5">
                    <Download size={14} /> Ver PDF
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between"><span className="text-[#fff]/55">{k}</span><span className="font-medium text-[#fff]">{v}</span></div>
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className={lblCls}>{label}</span>{children}</label>
}

function LineasEditor({ titulo, lineas, setLineas, sugerencias }: { titulo: string; lineas: Linea[]; setLineas: (l: Linea[]) => void; sugerencias: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">{titulo}</h2>
      <LineasBody lineas={lineas} setLineas={setLineas} />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {sugerencias.filter((s) => !lineas.some((l) => l.concepto.trim().toLowerCase() === s.toLowerCase())).map((s) => (
          <button key={s} onClick={() => setLineas([...lineas, { concepto: s, valor: 0 }])} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#fff]/60 hover:bg-white/5">+ {s}</button>
        ))}
      </div>
    </section>
  )
}

function LineasBody({ lineas, setLineas }: { lineas: Linea[]; setLineas: (l: Linea[]) => void }) {
  function update(i: number, patch: Partial<Linea>) {
    setLineas(lineas.map((l, j) => (j === i ? { ...l, ...patch } : l)))
  }
  return (
    <div className="flex flex-col gap-2">
      {lineas.length === 0 && <p className="text-xs text-[#fff]/35">Sin líneas. Agrega con los botones o el signo +.</p>}
      {lineas.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={l.concepto} onChange={(e) => update(i, { concepto: e.target.value })} placeholder="Concepto" className={`${inputCls} min-w-0 flex-1`} />
          <div className="w-36 shrink-0">
            <MoneyInput value={l.valor} onChange={(n) => update(i, { valor: n })} placeholder="Valor" className={inputCls} />
          </div>
          <button onClick={() => setLineas(lineas.filter((_, j) => j !== i))} className="rounded-lg p-2 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
        </div>
      ))}
      <button onClick={() => setLineas([...lineas, { concepto: "", valor: 0 }])} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#fff]/70 hover:bg-white/5">
        <Plus size={13} /> Agregar línea
      </button>
    </div>
  )
}
