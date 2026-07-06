"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Plus, Trash2, Save, FileSignature, Upload, Download, History,
} from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import { ROL_LABEL } from "@/lib/empleados/types"
import { formatCOP } from "@/lib/empleados/desprendible"
import {
  type Contrato, condicionesVigentes, totalMensualContrato, inicioContrato, TIPO_VERSION_LABEL,
} from "@/lib/empleados/contrato"
import { TIPOS_CONTRATO, JORNADAS } from "@/lib/empleados/catalogos-co"
import { MoneyInput } from "../../money-input"
import { ConfirmDialog } from "../../confirm-dialog"

type Linea = { concepto: string; valor: number }

const hoy = new Date().toISOString().slice(0, 10)
const OTROS_SUGERIDOS = ["Auxilio conectividad", "Auxilio de rodamiento", "Bonificación no prestacional", "Auxilio de alimentación"]

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function ContratosAdminClient({ empleados }: { empleados: Empleado[] }) {
  const [empleadoId, setEmpleadoId] = useState("")
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  // Form de nueva versión
  const [vigenteDesde, setVigenteDesde] = useState(hoy)
  const [basico, setBasico] = useState(0)
  const [auxilio, setAuxilio] = useState(0)
  const [otros, setOtros] = useState<Linea[]>([])
  const [tipoContrato, setTipoContrato] = useState("")
  const [jornada, setJornada] = useState("")
  const [cargo, setCargo] = useState("")
  const [liderId, setLiderId] = useState("")
  const [fechaIngreso, setFechaIngreso] = useState("")
  const [motivo, setMotivo] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const archivoRef = useRef<HTMLInputElement>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const vigente = useMemo(() => condicionesVigentes(contratos), [contratos])
  const esInicial = contratos.length === 0
  const fechaIngresoSel = useMemo(
    () => empleados.find((e) => e.id === empleadoId)?.fecha_ingreso ?? null,
    [empleados, empleadoId],
  )
  const posiblesLideres = useMemo(
    () => empleados.filter((e) => (e.rol === "lider" || e.rol === "ceo") && e.id !== empleadoId),
    [empleados, empleadoId],
  )

  function prefill(from: Contrato | null, emp?: Empleado) {
    // El contrato inicial arranca en la fecha de ingreso; un otrosí, hoy por defecto.
    setVigenteDesde(from ? hoy : (emp?.fecha_ingreso ?? hoy))
    setBasico(from ? Number(from.salario_basico) || 0 : 0)
    setAuxilio(from ? Number(from.auxilio_transporte) || 0 : 0)
    setOtros(from ? (from.otros_devengos ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })) : [])
    setTipoContrato(from?.tipo_contrato ?? "")
    setJornada(from?.jornada ?? "")
    setCargo(from?.cargo ?? emp?.cargo ?? "")
    setLiderId(from?.lider_id ?? emp?.lider_id ?? "")
    setFechaIngreso(from?.fecha_ingreso ?? emp?.fecha_ingreso ?? "")
    setMotivo("")
  }

  async function cargar(empId: string) {
    setCargando(true); setError(""); setMsg("")
    try {
      const res = await fetch(`/api/empleados/admin/contratos?empleado_id=${empId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const lista = (data.contratos ?? []) as Contrato[]
      setContratos(lista)
      prefill(condicionesVigentes(lista), empleados.find((e) => e.id === empId))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar.")
      setContratos([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (!empleadoId) return
    cargar(empleadoId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoId])

  const totalNuevo = totalMensualContrato({ salario_basico: basico, auxilio_transporte: auxilio, otros_devengos: otros })

  async function guardar() {
    if (!empleadoId) return setError("Selecciona un empleado.")
    if (!vigenteDesde) return setError("Indica la fecha de vigencia.")
    if (!esInicial && !motivo.trim()) return setError("Describe el motivo del ajuste (otrosí).")
    if (!esInicial && !archivo) return setError("Adjunta el documento del otrosí (PDF). Es obligatorio para registrar un cambio.")
    setError(""); setMsg(""); setGuardando(true)
    try {
      const body = {
        empleado_id: empleadoId,
        tipo: esInicial ? "inicial" : "otrosi",
        vigente_desde: vigenteDesde,
        salario_basico: Number(basico) || 0,
        auxilio_transporte: Number(auxilio) || 0,
        otros_devengos: otros.filter((l) => l.concepto.trim()).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })),
        tipo_contrato: tipoContrato || null,
        jornada: jornada || null,
        cargo: cargo || null,
        lider_id: liderId || null,
        fecha_ingreso: fechaIngreso || null,
        motivo: motivo || null,
      }
      const res = await fetch("/api/empleados/admin/contratos", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Subir el adjunto (obligatorio en otrosí, opcional en inicial)
      if (archivo && data.contrato?.id) {
        const fd = new FormData()
        fd.append("archivo", archivo)
        const r2 = await fetch(`/api/empleados/admin/contratos/${data.contrato.id}/archivo`, { method: "POST", body: fd })
        const d2 = await r2.json().catch(() => ({}))
        if (!r2.ok) throw new Error(d2.error || "El contrato se guardó pero falló la subida del documento.")
      }
      setArchivo(null)
      if (archivoRef.current) archivoRef.current.value = ""
      setMsg(esInicial ? "✓ Contrato inicial definido." : "✓ Otrosí registrado con su documento en el historial.")
      await cargar(empleadoId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    setError(""); setMsg(""); setEliminando(true)
    try {
      const res = await fetch(`/api/empleados/admin/contratos?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setConfirmarEliminar(null)
      await cargar(empleadoId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar.")
      setConfirmarEliminar(null)
    } finally {
      setEliminando(false)
    }
  }

  async function subirAdjunto(id: string, file: File) {
    setError(""); setMsg("")
    try {
      const fd = new FormData()
      fd.append("archivo", file)
      const res = await fetch(`/api/empleados/admin/contratos/${id}/archivo`, { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Adjunto subido.")
      await cargar(empleadoId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el adjunto.")
    }
  }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-6 flex items-center gap-2.5">
        <FileSignature size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Contratos y condiciones</h1>
      </div>

      <label className="mb-6 flex max-w-md flex-col gap-1.5">
        <span className={lblCls}>Empleado</span>
        <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
          <option value="">— Selecciona —</option>
          {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
        </select>
      </label>

      {!empleadoId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-[#fff]/50">
          Selecciona un empleado para ver sus condiciones y su historial de ajustes.
        </div>
      ) : cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Columna principal: condiciones vigentes + form */}
          <div className="flex flex-col gap-6">
            {/* Condiciones vigentes */}
            {vigente && (
              <section className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#fff]/85">Condiciones vigentes</h2>
                  <span className="text-[11px] text-[#fff]/45">desde {inicioContrato(vigente, fechaIngresoSel)}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Dato k="Salario básico" v={formatCOP(vigente.salario_basico)} />
                  <Dato k="Auxilio de transporte" v={formatCOP(vigente.auxilio_transporte)} />
                  <Dato k="Cargo" v={vigente.cargo || "—"} />
                  <Dato k="Tipo de contrato" v={vigente.tipo_contrato || "—"} />
                </div>
                {(vigente.otros_devengos ?? []).length > 0 && (
                  <div className="mt-3 border-t border-white/10 pt-3 text-sm text-[#fff]/70">
                    {vigente.otros_devengos.map((l, i) => (
                      <div key={i} className="flex justify-between"><span>{l.concepto}</span><span>{formatCOP(l.valor)}</span></div>
                    ))}
                  </div>
                )}
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-xs text-[#fff]/50">Total mensual devengado</p>
                  <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatCOP(totalMensualContrato(vigente))}</p>
                </div>
              </section>
            )}

            {/* Form nueva versión */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-1 text-sm font-semibold text-[#fff]/85">
                {esInicial ? "Definir contrato inicial" : "Registrar otrosí / ajuste"}
              </h2>
              <p className="mb-4 text-xs text-[#fff]/45">
                {esInicial
                  ? "Este empleado aún no tiene contrato. Define las condiciones de arranque."
                  : "Se guarda como una nueva versión con su fecha de vigencia; las anteriores quedan en el historial."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Campo label="Vigente desde"><input type="date" value={vigenteDesde} onChange={(e) => setVigenteDesde(e.target.value)} className={inputCls} /></Campo>
                <Campo label="Cargo"><input value={cargo} onChange={(e) => setCargo(e.target.value)} className={inputCls} /></Campo>
                <Campo label="Salario básico"><MoneyInput value={basico} onChange={setBasico} className={inputCls} /></Campo>
                <Campo label="Auxilio de transporte"><MoneyInput value={auxilio} onChange={setAuxilio} className={inputCls} /></Campo>
                <Campo label="Tipo de contrato"><input list="cat-tipos-contrato" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                <Campo label="Jornada"><input list="cat-jornadas" value={jornada} onChange={(e) => setJornada(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                <Campo label="Líder (a quién reporta)">
                  <select value={liderId} onChange={(e) => setLiderId(e.target.value)} className={inputCls}>
                    <option value="">— Reporta al CEO —</option>
                    {posiblesLideres.map((l) => <option key={l.id} value={l.id}>{l.nombre} · {ROL_LABEL[l.rol]}</option>)}
                  </select>
                </Campo>
                {esInicial && (
                  <Campo label="Fecha de ingreso">
                    <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputCls} />
                  </Campo>
                )}
                <datalist id="cat-tipos-contrato">{TIPOS_CONTRATO.map((x) => <option key={x} value={x} />)}</datalist>
                <datalist id="cat-jornadas">{JORNADAS.map((x) => <option key={x} value={x} />)}</datalist>
              </div>
              <p className="mt-2 text-[11px] text-[#fff]/40">
                El <b>auxilio de transporte</b> solo aplica a salarios ≤ 2 SMMLV y trabajo presencial.
                En remoto o salarios mayores va en $0 (si otorgas conectividad, agrégala en “Otros devengos”).
              </p>

              {/* Otros devengos fijos */}
              <div className="mt-4">
                <span className={lblCls}>Otros devengos fijos</span>
                <div className="mt-2 flex flex-col gap-2">
                  {otros.length === 0 && <p className="text-xs text-[#fff]/35">Sin conceptos adicionales.</p>}
                  {otros.map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={l.concepto} onChange={(e) => setOtros(otros.map((x, j) => j === i ? { ...x, concepto: e.target.value } : x))} placeholder="Concepto" className={`${inputCls} min-w-0 flex-1`} />
                      <div className="w-36 shrink-0">
                        <MoneyInput value={l.valor} onChange={(n) => setOtros(otros.map((x, j) => j === i ? { ...x, valor: n } : x))} placeholder="Valor" className={inputCls} />
                      </div>
                      <button onClick={() => setOtros(otros.filter((_, j) => j !== i))} className="rounded-lg p-2 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-1.5">
                    {OTROS_SUGERIDOS.filter((s) => !otros.some((l) => l.concepto.trim().toLowerCase() === s.toLowerCase())).map((s) => (
                      <button key={s} onClick={() => setOtros([...otros, { concepto: s, valor: 0 }])} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#fff]/60 hover:bg-white/5">+ {s}</button>
                    ))}
                    <button onClick={() => setOtros([...otros, { concepto: "", valor: 0 }])} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#fff]/70 hover:bg-white/5"><Plus size={12} /> Línea</button>
                  </div>
                </div>
              </div>

              {!esInicial && (
                <div className="mt-4">
                  <span className={lblCls}>Motivo del ajuste</span>
                  <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Aumento salarial, nuevo auxilio…" className={`${inputCls} mt-1.5`} />
                </div>
              )}

              {/* Documento adjunto: obligatorio en otrosí, opcional en inicial */}
              <div className="mt-4">
                <span className={lblCls}>
                  {esInicial ? "Documento del contrato (opcional)" : "Documento del otrosí (obligatorio)"}
                </span>
                <input
                  ref={archivoRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                  className="mt-1.5 block w-full text-sm text-[#fff]/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#fff] hover:file:bg-white/15"
                />
                <p className="mt-1 text-[11px] text-[#fff]/40">
                  {esInicial
                    ? "Puedes subir el contrato físico ahora o más adelante."
                    : "Adjunta el PDF del otrosí firmado. Sin documento no se puede registrar el cambio."}
                </p>
              </div>

              {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
              {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

              <div className="mt-4 flex items-center gap-3">
                <button onClick={guardar} disabled={guardando} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                  {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {esInicial ? "Definir contrato" : "Registrar otrosí"}
                </button>
                <span className="text-sm text-[#fff]/50">Total mensual: <b className="text-[#fff]/80">{formatCOP(totalNuevo)}</b></span>
              </div>
            </section>
          </div>

          {/* Historial */}
          <aside>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2">
                <History size={16} className="text-[#fff]/60" />
                <h2 className="text-sm font-semibold text-[#fff]/85">Historial de ajustes</h2>
              </div>
              {contratos.length === 0 ? (
                <p className="text-xs text-[#fff]/40">Aún no hay condiciones registradas.</p>
              ) : (
                <ol className="flex flex-col gap-3">
                  {contratos.map((c) => (
                    <li key={c.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/70">{TIPO_VERSION_LABEL[c.tipo]}</span>
                        <button onClick={() => setConfirmarEliminar(c.id)} className="rounded p-1 text-red-300/60 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={13} /></button>
                      </div>
                      <p className="mt-2 text-xs text-[#fff]/50">Vigente desde {inicioContrato(c, fechaIngresoSel)}</p>
                      <p className="mt-1 text-sm text-[#fff]/85">{formatCOP(totalMensualContrato(c))} / mes</p>
                      <p className="text-[11px] text-[#fff]/45">Básico {formatCOP(c.salario_basico)} · Aux. {formatCOP(c.auxilio_transporte)}</p>
                      {c.motivo && <p className="mt-1 text-xs italic text-[#fff]/55">“{c.motivo}”</p>}
                      <div className="mt-2 border-t border-white/10 pt-2">
                        {c.archivo_path ? (
                          <a href={`/api/empleados/contratos/${c.id}/archivo`} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--cyan)] hover:underline">
                            <Download size={12} /> Descargar adjunto
                          </a>
                        ) : (
                          <SubirBoton onFile={(f) => subirAdjunto(c.id, f)} />
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </aside>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmarEliminar}
        titulo="Eliminar versión del contrato"
        mensaje="¿Eliminar esta versión del contrato? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        tone="danger"
        cargando={eliminando}
        onConfirm={() => confirmarEliminar && eliminar(confirmarEliminar)}
        onCancel={() => setConfirmarEliminar(null)}
      />
    </div>
  )
}

function SubirBoton({ onFile }: { onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <button onClick={() => ref.current?.click()} className="inline-flex items-center gap-1.5 text-[11px] text-[#fff]/55 hover:text-[#fff]">
        <Upload size={12} /> Subir contrato físico / otrosí (PDF)
      </button>
      <input ref={ref} type="file" accept="application/pdf,image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = "" }} />
    </>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className={lblCls}>{label}</span>{children}</label>
}

function Dato({ k, v }: { k: string; v: string }) {
  return <div><p className="text-[11px] text-[#fff]/45">{k}</p><p className="text-sm font-medium text-[#fff]/90">{v}</p></div>
}
