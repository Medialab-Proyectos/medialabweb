"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Plus, Trash2, Save, FileSignature, Upload, Download, History, Pencil, Send, Clock, CheckCircle2, FileDown, ListChecks,
} from "lucide-react"
import type { Empleado, Rol, TipoVinculacion, FreelanceModo } from "@/lib/empleados/types"
import { ROL_LABEL, FREELANCE_MODO_LABEL, esVinculacionPorFactura } from "@/lib/empleados/types"
import { formatCOP } from "@/lib/empleados/desprendible"
import { formatMoneda, type Moneda } from "@/lib/empleados/freelance"
import {
  type Contrato, type ConceptoAjuste, condicionesVigentes, condicionesVigentesFirmadas, esFirmado, esBorrador, esEnviadoPendiente, totalMensualContrato, inicioContrato, TIPO_VERSION_LABEL, ESTADO_CONTRATO_LABEL, CONCEPTO_AJUSTE_LABEL, contratoEsPorFactura,
} from "@/lib/empleados/contrato"
import { TIPOS_CONTRATO, JORNADAS } from "@/lib/empleados/catalogos-co"
import { salarioMinimoAnio, aportesEmpleado } from "@/lib/empleados/nomina-co"
import type { RolFunciones } from "@/lib/empleados/roles-funciones"
import { MoneyInput } from "../../money-input"
import { ConfirmDialog } from "../../confirm-dialog"

type Linea = { concepto: string; valor: number }

const hoy = new Date().toISOString().slice(0, 10)
const OTROS_SUGERIDOS = ["Auxilio conectividad", "Auxilio de rodamiento", "Bonificación no prestacional", "Auxilio de alimentación"]

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function ContratosAdminClient({ empleados, config }: { empleados: Empleado[]; config: { caja_compensacion: string | null; arl: string | null } }) {
  const [empleadoId, setEmpleadoId] = useState("")
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  // Form de nueva versión (o edición de una existente)
  const [editId, setEditId] = useState<string | null>(null)   // id de la versión que se edita (null = nueva)
  const [vigenteDesde, setVigenteDesde] = useState(hoy)
  const [rol, setRol] = useState<Rol>("empleado")
  const [vinculacion, setVinculacion] = useState<TipoVinculacion>("empleado")
  const [basico, setBasico] = useState(0)
  const [auxilio, setAuxilio] = useState(0)
  const [otros, setOtros] = useState<Linea[]>([])
  const [flModo, setFlModo] = useState<"" | FreelanceModo>("")
  const [flTarifa, setFlTarifa] = useState(0)
  const [flMoneda, setFlMoneda] = useState<Moneda>("COP")
  const [flMeses, setFlMeses] = useState(1)
  const [tipoContrato, setTipoContrato] = useState("")
  const [jornada, setJornada] = useState("")
  const [cargo, setCargo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [condicionesAdic, setCondicionesAdic] = useState("")
  const [rolFuncionesId, setRolFuncionesId] = useState("")
  const [rolesFunciones, setRolesFunciones] = useState<RolFunciones[]>([])
  const [liderId, setLiderId] = useState("")
  const [fechaIngreso, setFechaIngreso] = useState("")
  const [fechaFinProbable, setFechaFinProbable] = useState("")
  const [motivo, setMotivo] = useState("")
  const [ajustes, setAjustes] = useState<ConceptoAjuste[]>([])
  const [archivo, setArchivo] = useState<File | null>(null)
  // Cómo se firma: "enviar" = generar y avisar al empleado; "subir" = el CEO ya lo tiene firmado.
  const [firmaMetodo, setFirmaMetodo] = useState<"enviar" | "subir">("enviar")
  const archivoRef = useRef<HTMLInputElement>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [finalizarFecha, setFinalizarFecha] = useState(hoy)
  const [finalizando, setFinalizando] = useState(false)

  // Condiciones vigentes = última versión FIRMADA (las pendientes no mandan).
  const vigente = useMemo(() => condicionesVigentesFirmadas(contratos), [contratos])
  // Si el salario vigente era el mínimo legal de su año, se muestra ajustado al mínimo del año actual
  // (los salarios mínimos suben cada año por ley, aunque no haya otrosí).
  const salVigente = useMemo(() => {
    if (!vigente || contratoEsPorFactura(vigente)) return null
    const anioVig = Number((inicioContrato(vigente, empleados.find((e) => e.id === empleadoId)?.fecha_ingreso ?? null) || vigente.vigente_desde).slice(0, 4)) || new Date().getFullYear()
    const anioNow = new Date().getFullYear()
    const esMin = (Number(vigente.salario_basico) || 0) === salarioMinimoAnio(anioVig).smmlv
    const minNow = salarioMinimoAnio(anioNow)
    // Solo se ajusta el auxilio si el contrato ya lo tenía (> 0). Un empleado remoto
    // no causa auxilio de transporte, así que se mantiene en $0.
    const teniaAuxilio = (Number(vigente.auxilio_transporte) || 0) > 0
    const salario = esMin ? minNow.smmlv : Number(vigente.salario_basico) || 0
    const auxilio = esMin && teniaAuxilio ? minNow.auxilio : Number(vigente.auxilio_transporte) || 0
    // Devengado, seguridad social del empleado (IBC = salario básico) y neto (valor del desprendible).
    const totalDevengado = totalMensualContrato({ ...vigente, salario_basico: salario, auxilio_transporte: auxilio })
    const ap = aportesEmpleado(salario)
    const seguridadSocial = ap.salud + ap.pension + ap.fsp
    return {
      ajustadoAlMinimo: esMin && anioNow > anioVig,
      anioNow, salario, auxilio,
      totalDevengado, seguridadSocial, neto: Math.max(0, totalDevengado - seguridadSocial),
    }
  }, [vigente, empleados, empleadoId])
  const pendientes = useMemo(() => contratos.filter((c) => !esFirmado(c)), [contratos])
  // Al editar una versión existente NO estamos definiendo el inicial; solo si no hay contratos.
  const esInicial = contratos.length === 0
  const editando = editId != null
  const editEsInicial = useMemo(() => contratos.find((c) => c.id === editId)?.tipo === "inicial", [contratos, editId])
  // El bloque de "definir/registrar" actúa como inicial solo cuando de verdad no hay contratos.
  const modoInicial = esInicial && !editando
  // ¿La versión del formulario es un otrosí? (No es el inicial ni la edición del inicial.)
  const esVersionOtrosi = !modoInicial && !(editando && editEsInicial)
  const empSel = useMemo(() => empleados.find((e) => e.id === empleadoId) ?? null, [empleados, empleadoId])
  const fechaIngresoSel = empSel?.fecha_ingreso ?? null
  // Historial en pila: por fecha de vigencia efectiva, el más reciente arriba.
  const historial = useMemo(
    () => [...contratos].sort((a, b) => inicioContrato(b, fechaIngresoSel).localeCompare(inicioContrato(a, fechaIngresoSel)) || b.creado_en.localeCompare(a.creado_en)),
    [contratos, fechaIngresoSel],
  )
  // Neto a pagar de una versión (valor del desprendible): devengado − seguridad social (IBC = básico).
  const netoContrato = (c: Contrato) => {
    const ap = aportesEmpleado(Number(c.salario_basico) || 0)
    return Math.max(0, totalMensualContrato(c) - (ap.salud + ap.pension + ap.fsp))
  }
  const posiblesLideres = useMemo(
    () => empleados.filter((e) => (e.rol === "lider" || e.rol === "ceo") && e.id !== empleadoId),
    [empleados, empleadoId],
  )

  function prefill(from: Contrato | null, emp?: Empleado) {
    // Prefill del form "nueva versión" (no de edición): parte del contrato vigente.
    setEditId(null)
    // El contrato inicial arranca en la fecha de ingreso; un otrosí, hoy por defecto.
    setVigenteDesde(from ? hoy : (emp?.fecha_ingreso ?? hoy))
    setRol(from?.rol ?? emp?.rol ?? "empleado")
    setVinculacion(from?.tipo_vinculacion ?? emp?.tipo_vinculacion ?? "empleado")
    setBasico(from ? Number(from.salario_basico) || 0 : 0)
    setAuxilio(from ? Number(from.auxilio_transporte) || 0 : 0)
    setOtros(from ? (from.otros_devengos ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })) : [])
    setFlModo(from?.freelance_modo ?? emp?.freelance_modo ?? "")
    setFlTarifa(from ? Number(from.freelance_tarifa) || 0 : Number(emp?.freelance_tarifa) || 0)
    setFlMoneda(from?.freelance_moneda ?? emp?.freelance_moneda ?? "COP")
    setFlMeses(from?.freelance_meses ?? 1)
    setTipoContrato(from?.tipo_contrato ?? "")
    setJornada(from?.jornada ?? "")
    setCargo(from?.cargo ?? emp?.cargo ?? "")
    setDescripcion(from?.descripcion ?? "")
    setCondicionesAdic(from?.condiciones_adicionales ?? "")
    setRolFuncionesId(from?.rol_funciones_id ?? "")
    setLiderId(from?.lider_id ?? emp?.lider_id ?? "")
    setFechaIngreso(from?.fecha_ingreso ?? emp?.fecha_ingreso ?? "")
    setFechaFinProbable(from?.fecha_fin_probable ?? emp?.fecha_fin_probable ?? "")
    setMotivo("")
    setAjustes([])
  }

  // Catálogo de funciones por rol (para el otrosí / contrato).
  useEffect(() => {
    fetch("/api/empleados/admin/roles-funciones")
      .then((r) => r.json())
      .then((d) => setRolesFunciones(d.roles ?? []))
      .catch(() => {})
  }, [])

  /** Carga una versión existente en el formulario para EDITARLA en el sitio. */
  function editarVersion(c: Contrato) {
    setError(""); setMsg("")
    setEditId(c.id)
    setVigenteDesde(c.vigente_desde)
    setRol(c.rol ?? "empleado")
    setVinculacion(c.tipo_vinculacion ?? "empleado")
    setBasico(Number(c.salario_basico) || 0)
    setAuxilio(Number(c.auxilio_transporte) || 0)
    setOtros((c.otros_devengos ?? []).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })))
    setFlModo(c.freelance_modo ?? "")
    setFlTarifa(Number(c.freelance_tarifa) || 0)
    setFlMoneda(c.freelance_moneda ?? "COP")
    setFlMeses(c.freelance_meses ?? 1)
    setTipoContrato(c.tipo_contrato ?? "")
    setJornada(c.jornada ?? "")
    setCargo(c.cargo ?? "")
    setDescripcion(c.descripcion ?? "")
    setCondicionesAdic(c.condiciones_adicionales ?? "")
    setRolFuncionesId(c.rol_funciones_id ?? "")
    setLiderId(c.lider_id ?? "")
    setFechaIngreso(c.fecha_ingreso ?? "")
    setFechaFinProbable(c.fecha_fin_probable ?? "")
    setMotivo(c.motivo ?? "")
    setAjustes(c.ajustes ?? [])
    setArchivo(null)
    if (archivoRef.current) archivoRef.current.value = ""
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function cancelarEdicion() {
    prefill(condicionesVigentes(contratos), empSel ?? undefined)
    setError(""); setMsg("")
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

  const porFactura = esVinculacionPorFactura(vinculacion)
  // La fecha probable de finalización solo aplica a freelance/prestación o a término fijo/obra
  // (un contrato laboral a término indefinido no tiene fecha de fin).
  const mostrarFechaFin = porFactura || /fij|obra|labor/i.test(tipoContrato)

  const condicionesBody = () => ({
    rol,
    tipo_vinculacion: vinculacion,
    salario_basico: porFactura ? 0 : Number(basico) || 0,
    auxilio_transporte: porFactura ? 0 : Number(auxilio) || 0,
    otros_devengos: porFactura ? [] : otros.filter((l) => l.concepto.trim()).map((l) => ({ concepto: l.concepto, valor: Number(l.valor) || 0 })),
    freelance_modo: porFactura ? (flModo || null) : null,
    freelance_tarifa: porFactura ? (Number(flTarifa) || 0) : null,
    freelance_moneda: porFactura ? flMoneda : null,
    freelance_meses: porFactura && flModo === "por_proyecto" ? (Number(flMeses) || 1) : null,
    tipo_contrato: porFactura ? null : (tipoContrato || null),
    jornada: porFactura ? null : (jornada || null),
    cargo: cargo || null,
    descripcion: descripcion || null,
    condiciones_adicionales: condicionesAdic || null,
    rol_funciones_id: rolFuncionesId || null,
    lider_id: liderId || null,
    fecha_fin_probable: fechaFinProbable || null,
  })

  async function subirArchivoA(id: string) {
    if (!archivo) return
    const fd = new FormData()
    fd.append("archivo", archivo)
    const r2 = await fetch(`/api/empleados/admin/contratos/${id}/archivo`, { method: "POST", body: fd })
    const d2 = await r2.json().catch(() => ({}))
    if (!r2.ok) throw new Error(d2.error || "El contrato se guardó pero falló la subida del documento.")
  }

  async function guardar() {
    if (!empleadoId) return setError("Selecciona un empleado.")
    if (porFactura && !flModo) return setError("Elige el modo de pago (por hora, por mes, valor fijo o por proyecto).")

    // El motivo del otrosí ES la lista de conceptos ajustados (las píldoras).
    const motivoOtrosi = esVersionOtrosi && ajustes.length
      ? "ajustar " + ajustes.map((a) => CONCEPTO_AJUSTE_LABEL[a].toLowerCase()).join(", ")
      : null

    setError(""); setMsg(""); setGuardando(true)
    try {
      // ── Editar una versión existente (corregir el inicial o un otrosí) ──────
      if (editId) {
        if (!vigenteDesde) { setGuardando(false); return setError("Indica la fecha de vigencia.") }
        const res = await fetch("/api/empleados/admin/contratos", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "editar", id: editId, vigente_desde: vigenteDesde, motivo: motivoOtrosi, ajustes, fecha_ingreso: fechaIngreso || null, ...condicionesBody() }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        if (archivo) await subirArchivoA(editId)
        setArchivo(null); if (archivoRef.current) archivoRef.current.value = ""
        setEditId(null)
        setMsg("✓ Contrato actualizado.")
        await cargar(empleadoId)
        return
      }

      // ── Crear (contrato inicial u otrosí) ──────────────────────────────────
      if (modoInicial && !fechaIngreso) { setGuardando(false); return setError("Indica la fecha de ingreso.") }
      if (!modoInicial && !vigenteDesde) { setGuardando(false); return setError("Indica la fecha de vigencia del ajuste.") }
      if (esVersionOtrosi && ajustes.length === 0) { setGuardando(false); return setError("Marca al menos un concepto que se ajusta en el otrosí.") }
      // El documento NO es obligatorio: se crea como borrador y se envía para firma.
      // Solo si el CEO ya lo tiene firmado puede subirlo ahora (queda activo).

      const body = {
        empleado_id: empleadoId,
        tipo: modoInicial ? "inicial" : "otrosi",
        // En el inicial, la fecha de ingreso ES la vigencia; en un otrosí, la fecha del ajuste.
        vigente_desde: modoInicial ? (fechaIngreso || hoy) : vigenteDesde,
        fecha_ingreso: modoInicial ? (fechaIngreso || null) : null,
        motivo: motivoOtrosi,
        ajustes: esVersionOtrosi ? ajustes : null,
        ...condicionesBody(),
      }
      const res = await fetch("/api/empleados/admin/contratos", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Si el CEO ya tiene el firmado, se sube ahora y la versión queda firmada (activa).
      if (firmaMetodo === "subir" && archivo && data.contrato?.id) await subirArchivoA(data.contrato.id)
      setArchivo(null)
      if (archivoRef.current) archivoRef.current.value = ""
      setMsg(
        firmaMetodo === "subir" && archivo
          ? "✓ Contrato registrado y firmado (activo)."
          : "✓ Borrador creado. Previsualízalo abajo y, cuando esté listo, «Enviar para firma».",
      )
      await cargar(empleadoId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardando(false)
    }
  }

  const [enviando, setEnviando] = useState<string | null>(null)
  async function enviarParaFirma(id: string) {
    setError(""); setMsg(""); setEnviando(id)
    try {
      const res = await fetch("/api/empleados/admin/contratos", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "enviar", id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Enviado al empleado para firma. Cuando lo devuelva firmado, súbelo aquí.")
      await cargar(empleadoId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.")
    } finally { setEnviando(null) }
  }

  async function finalizar(fechaFin: string | null) {
    if (!vigente) return
    setError(""); setMsg(""); setFinalizando(true)
    try {
      const res = await fetch("/api/empleados/admin/contratos", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "finalizar", id: vigente.id, fecha_fin: fechaFin }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg(fechaFin ? "✓ Contrato finalizado." : "✓ Contrato reabierto.")
      await cargar(empleadoId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al finalizar.")
    } finally {
      setFinalizando(false)
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileSignature size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Contratos y condiciones</h1>
        </div>
        <Link href="/empleados/admin/roles-funciones" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5">
          <ListChecks size={15} /> Funciones por rol
        </Link>
      </div>

      <label className="mb-6 flex max-w-md flex-col gap-1.5">
        <span className={lblCls}>Empleado</span>
        <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
          <option value="">— Selecciona —</option>
          {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
        </select>
        <span className="text-[11px] text-[#fff]/40">
          El contrato define el <b className="text-[#fff]/60">rol</b>, la <b className="text-[#fff]/60">vinculación</b> (laboral / freelance / prestación) y las condiciones de pago. Sin contrato, la persona es «empleado» básico.
        </span>
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
            {/* Aviso de versiones pendientes de firma */}
            {pendientes.length > 0 && (
              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] px-4 py-3 text-sm text-amber-100/90">
                <b>{pendientes.length}</b> versión{pendientes.length === 1 ? "" : "es"} <b>pendiente{pendientes.length === 1 ? "" : "s"} de firma</b> — no {pendientes.length === 1 ? "es vigente" : "son vigentes"} hasta subir el documento firmado. {!vigente && "Mientras no se firme el contrato inicial, el empleado no puede activar la plataforma."} Genera el PDF en el historial y súbelo firmado (o lo firma el empleado).
              </div>
            )}
            {/* Condiciones vigentes */}
            {vigente && (
              <section className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#fff]/85">Condiciones vigentes</h2>
                  <span className="text-[11px] text-[#fff]/45">desde {inicioContrato(vigente, fechaIngresoSel)}</span>
                </div>
                {contratoEsPorFactura(vigente) ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Dato k="Vinculación" v={vigente.tipo_vinculacion === "freelance" ? "Freelance" : "Prestación de servicios"} />
                      <Dato k="Rol" v={ROL_LABEL[vigente.rol ?? "empleado"]} />
                      <Dato k="Cargo" v={vigente.cargo || "—"} />
                      <Dato k="Modo de pago" v={vigente.freelance_modo ? FREELANCE_MODO_LABEL[vigente.freelance_modo] : "—"} />
                    </div>
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-xs text-[#fff]/50">Pago acordado</p>
                      <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatMoneda(Number(vigente.freelance_tarifa) || 0, vigente.freelance_moneda ?? "COP")}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Dato k="Salario básico" v={formatCOP(salVigente?.salario ?? vigente.salario_basico)} />
                      <Dato k="Auxilio de transporte" v={formatCOP(salVigente?.auxilio ?? vigente.auxilio_transporte)} />
                      <Dato k="Cargo" v={vigente.cargo || "—"} />
                      <Dato k="Tipo de contrato" v={vigente.tipo_contrato || "—"} />
                    </div>
                    {salVigente?.ajustadoAlMinimo && (
                      <p className="mt-2 text-[11px] text-amber-300/80">Ajustado automáticamente al salario mínimo {salVigente.anioNow} (el contrato estaba en el mínimo legal). Registra un otrosí para dejarlo formalizado.</p>
                    )}
                    {(vigente.otros_devengos ?? []).length > 0 && (
                      <div className="mt-3 border-t border-white/10 pt-3 text-sm text-[#fff]/70">
                        {vigente.otros_devengos.map((l, i) => (
                          <div key={i} className="flex justify-between"><span>{l.concepto}</span><span>{formatCOP(l.valor)}</span></div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-[#fff]/50">Total devengado</p>
                        <p className="font-display text-lg font-bold text-[#fff]/85">{formatCOP(salVigente?.totalDevengado ?? totalMensualContrato(vigente))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#fff]/50">Seguridad social (−)</p>
                        <p className="font-display text-lg font-bold text-red-300/90">{formatCOP(salVigente?.seguridadSocial ?? 0)}</p>
                        <p className="text-[10px] text-[#fff]/40">salud 4% + pensión 4%{(salVigente?.seguridadSocial ?? 0) > 0 ? " (+ FSP si aplica)" : ""}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#fff]/50">Neto a pagar</p>
                        <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatCOP(salVigente?.neto ?? totalMensualContrato(vigente))}</p>
                        <p className="text-[10px] text-[#fff]/40">valor del desprendible / voucher</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Objeto del contrato, seguridad social de la empresa y fechas */}
                {vigente.descripcion && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-[11px] text-[#fff]/45">Objeto del contrato</p>
                    <p className="text-sm text-[#fff]/80">{vigente.descripcion}</p>
                  </div>
                )}
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-white/10 pt-3 text-[11px] text-[#fff]/55 sm:grid-cols-3">
                  {config.arl && <span>ARL: <b className="text-[#fff]/80">{config.arl}</b></span>}
                  {config.caja_compensacion && <span>Caja: <b className="text-[#fff]/80">{config.caja_compensacion}</b></span>}
                  {vigente.fecha_fin_probable && <span>Fin probable: <b className="text-[#fff]/80">{vigente.fecha_fin_probable}</b></span>}
                </div>

                {/* Finalizar / reabrir contrato */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                  {vigente.fecha_fin ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300">Contrato finalizado el {vigente.fecha_fin}</span>
                      <button onClick={() => finalizar(null)} disabled={finalizando} className="text-[11px] text-[#fff]/55 hover:text-[#fff] disabled:opacity-50">Reabrir</button>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-[#fff]/45">Finalizar contrato:</span>
                      <input type="date" value={finalizarFecha} onChange={(e) => setFinalizarFecha(e.target.value)} className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-[#fff] outline-none focus:border-[var(--cyan)]/60" />
                      <button onClick={() => finalizar(finalizarFecha)} disabled={finalizando} className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50">
                        {finalizando ? <Loader2 size={11} className="animate-spin" /> : null} Finalizar
                      </button>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* Form nueva versión / edición */}
            <section className={`rounded-2xl border p-5 ${editando ? "border-amber-400/40 bg-amber-400/[0.05]" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-[#fff]/85">
                  {editando ? "Editar esta versión del contrato" : modoInicial ? "Definir contrato inicial" : "Registrar otrosí / ajuste"}
                </h2>
                {editando && (
                  <button onClick={cancelarEdicion} className="text-[11px] text-[#fff]/55 hover:text-[#fff]">Cancelar edición</button>
                )}
              </div>
              <p className="mb-4 text-xs text-[#fff]/45">
                {editando
                  ? "Estás corrigiendo una versión ya registrada; se guardan los cambios sobre la misma fila."
                  : modoInicial
                    ? "Este empleado aún no tiene contrato. Define las condiciones de arranque."
                    : "Se guarda como una nueva versión con su fecha de vigencia; las anteriores quedan en el historial."}
              </p>

              {/* Datos personales del empleado (vienen de su ficha; aquí solo se muestran). */}
              {empSel && (
                <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-[11px] text-[#fff]/55 sm:grid-cols-3">
                  <span>EPS: <b className="text-[#fff]/80">{empSel.eps || "—"}</b></span>
                  <span>Cesantías: <b className="text-[#fff]/80">{empSel.fondo_cesantias || "—"}</b></span>
                  <span>Pensión: <b className="text-[#fff]/80">{empSel.fondo_pension || "—"}</b></span>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {modoInicial ? (
                  <Campo label="Fecha de ingreso"><input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputCls} /></Campo>
                ) : (
                  <Campo label={editando ? "Vigente desde" : "Vigente desde (fecha del ajuste)"}><input type="date" value={vigenteDesde} onChange={(e) => setVigenteDesde(e.target.value)} className={inputCls} /></Campo>
                )}
                {editando && editEsInicial && (
                  <Campo label="Fecha de ingreso"><input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputCls} /></Campo>
                )}
                <Campo label="Cargo"><input value={cargo} onChange={(e) => setCargo(e.target.value)} className={inputCls} /></Campo>
                <Campo label="Vinculación">
                  <select value={vinculacion} onChange={(e) => setVinculacion(e.target.value as TipoVinculacion)} className={inputCls}>
                    <option value="empleado">Empleado (laboral)</option>
                    <option value="freelance">Freelance (por factura)</option>
                    <option value="prestacion_servicios">Prestación de servicios (factura + soporte)</option>
                  </select>
                </Campo>
                <Campo label="Rol (acceso)">
                  <select value={rol} onChange={(e) => setRol(e.target.value as Rol)} className={inputCls}>
                    <option value="empleado">Empleado</option>
                    <option value="lider">Líder</option>
                    <option value="ceo">CEO</option>
                  </select>
                </Campo>
                <Campo label="Líder (a quién reporta)">
                  <select value={liderId} onChange={(e) => setLiderId(e.target.value)} className={inputCls}>
                    <option value="">— Reporta al CEO —</option>
                    {posiblesLideres.map((l) => <option key={l.id} value={l.id}>{l.nombre} · {ROL_LABEL[l.rol]}</option>)}
                  </select>
                </Campo>
                {!porFactura && (
                  <>
                    <Campo label="Salario básico"><MoneyInput value={basico} onChange={setBasico} className={inputCls} /></Campo>
                    <Campo label="Auxilio de transporte"><MoneyInput value={auxilio} onChange={setAuxilio} className={inputCls} /></Campo>
                    <Campo label="Tipo de contrato"><input list="cat-tipos-contrato" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                    <Campo label="Jornada"><input list="cat-jornadas" value={jornada} onChange={(e) => setJornada(e.target.value)} placeholder="Elige o escribe…" className={inputCls} /></Campo>
                    <datalist id="cat-tipos-contrato">{TIPOS_CONTRATO.map((x) => <option key={x} value={x} />)}</datalist>
                    <datalist id="cat-jornadas">{JORNADAS.map((x) => <option key={x} value={x} />)}</datalist>
                    {(() => {
                      const anioEf = Number((esInicial ? fechaIngreso : vigenteDesde)?.slice(0, 4)) || new Date().getFullYear()
                      const min = salarioMinimoAnio(anioEf)
                      return (
                        <div className="sm:col-span-2">
                          <span className={`${lblCls} mb-1 block`}>Salario mínimo {anioEf}</span>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => { setBasico(min.smmlv); setAuxilio(0) }} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#fff]/75 hover:bg-white/5">
                              Mínimo remoto ({formatCOP(min.smmlv)}, sin auxilio)
                            </button>
                            <button type="button" onClick={() => { setBasico(min.smmlv); setAuxilio(min.auxilio) }} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#fff]/75 hover:bg-white/5">
                              Mínimo presencial (+ aux. {formatCOP(min.auxilio)})
                            </button>
                          </div>
                          <span className="mt-1 block text-[11px] text-[#fff]/40">El auxilio de transporte solo aplica a trabajo presencial (en remoto no se causa).</span>
                        </div>
                      )
                    })()}
                  </>
                )}
              </div>

              {porFactura ? (
                /* Pago acordado del freelance / prestación de servicios */
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--cyan)]">Pago acordado</p>
                  <p className="mb-3 text-[11px] text-[#fff]/45">El freelance lo verá en su portal (solo lectura). Si es por mes o valor fijo, se le precarga al crear su factura; por hora, factura las horas × tarifa.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Campo label="Modo">
                      <select value={flModo} onChange={(e) => setFlModo(e.target.value as "" | FreelanceModo)} className={inputCls}>
                        <option value="">— Elige —</option>
                        <option value="por_hora">{FREELANCE_MODO_LABEL.por_hora}</option>
                        <option value="por_mes">{FREELANCE_MODO_LABEL.por_mes}</option>
                        <option value="fijo">{FREELANCE_MODO_LABEL.fijo}</option>
                        <option value="por_proyecto">{FREELANCE_MODO_LABEL.por_proyecto}</option>
                      </select>
                    </Campo>
                    <Campo label={flModo === "por_hora" ? "Valor por hora" : flModo === "por_mes" ? "Valor por mes" : flModo === "por_proyecto" ? "Valor total del proyecto" : "Valor"}>
                      <MoneyInput value={flTarifa} onChange={setFlTarifa} className={inputCls} />
                    </Campo>
                    <Campo label="Moneda">
                      <select value={flMoneda} onChange={(e) => setFlMoneda(e.target.value as Moneda)} className={inputCls}>
                        <option value="COP">COP</option>
                        <option value="USD">USD</option>
                      </select>
                    </Campo>
                  </div>
                  {flModo === "por_proyecto" && (
                    <div className="mt-3">
                      <Campo label="Dividir el proyecto en (nº de meses)">
                        <input type="number" min={1} max={120} value={flMeses || ""} onChange={(e) => setFlMeses(Number(e.target.value) || 1)} className={inputCls} placeholder="1 = pago único" />
                      </Campo>
                      <p className="mt-1 text-[11px] text-[#fff]/45">
                        {flMeses > 1
                          ? <>El valor total se paga en {flMeses} cuotas de <b className="text-[#fff]/70">{formatMoneda(Math.round((Number(flTarifa) || 0) / flMeses), flMoneda)}</b> / mes.</>
                          : "1 mes = pago único al terminar el proyecto."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                </>
              )}

              {/* Descripción / objeto del contrato + fecha probable de fin */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className={lblCls}>Descripción / objeto del contrato</span>
                  <textarea rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Objeto, alcance o notas del contrato…" className={inputCls} />
                </label>
                {mostrarFechaFin && (
                  <Campo label="Fecha probable de finalización (opcional)">
                    <input type="date" value={fechaFinProbable} onChange={(e) => setFechaFinProbable(e.target.value)} className={inputCls} />
                  </Campo>
                )}
              </div>

              {/* Funciones por rol (catálogo) + condiciones adicionales */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={lblCls}>Funciones del cargo (perfil de rol)</span>
                  <select value={rolFuncionesId} onChange={(e) => setRolFuncionesId(e.target.value)} className={inputCls}>
                    <option value="">— Sin funciones / no aplica —</option>
                    {rolesFunciones.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                  <span className="text-[11px] text-[#fff]/40">Se insertan en el contrato/otrosí generado. Edítalas en <b className="text-[#fff]/55">Funciones por rol</b>.</span>
                </label>
                {rolFuncionesId && (
                  <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-[11px] text-[#fff]/55">
                    <p className="mb-1 font-semibold text-[#fff]/70">Vista previa</p>
                    <ul className="flex list-disc flex-col gap-0.5 pl-4">
                      {(rolesFunciones.find((r) => r.id === rolFuncionesId)?.funciones ?? []).slice(0, 4).map((f, i) => <li key={i} className="line-clamp-1">{f}</li>)}
                      {(rolesFunciones.find((r) => r.id === rolFuncionesId)?.funciones.length ?? 0) > 4 && <li className="list-none text-[#fff]/40">…y más</li>}
                    </ul>
                  </div>
                )}
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className={lblCls}>Condiciones adicionales (cláusulas del otrosí)</span>
                  <textarea rows={3} value={condicionesAdic} onChange={(e) => setCondicionesAdic(e.target.value)} placeholder="Ej.: régimen de actividades freelance, cambios de exclusividad, beneficios especiales… (se agregan como cláusula al documento)" className={inputCls} />
                </label>
              </div>

              {esVersionOtrosi && (
                <div className="mt-4">
                  <span className={lblCls}>¿Qué se ajusta en este otrosí?</span>
                  <p className="mb-2 mt-1 text-[11px] text-[#fff]/40">Marca solo lo que cambia; eso es el motivo del ajuste. El documento del otrosí mostrará únicamente estos conceptos.</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CONCEPTO_AJUSTE_LABEL) as ConceptoAjuste[]).map((k) => {
                      const on = ajustes.includes(k)
                      return (
                        <button key={k} type="button" onClick={() => setAjustes(on ? ajustes.filter((x) => x !== k) : [...ajustes, k])} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${on ? "border-[var(--cyan)]/50 bg-[var(--cyan)]/15 text-[var(--cyan)]" : "border-white/10 bg-white/[0.03] text-[#fff]/60 hover:bg-white/[0.06]"}`}>
                          {CONCEPTO_AJUSTE_LABEL[k]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Documento adjunto: obligatorio en otrosí, opcional en inicial */}
              {editando ? (
                <div className="mt-4">
                  <span className={lblCls}>Reemplazar documento firmado (opcional)</span>
                  <input
                    ref={archivoRef}
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                    className="mt-1.5 block w-full text-sm text-[#fff]/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#fff] hover:file:bg-white/15"
                  />
                  <p className="mt-1 text-[11px] text-[#fff]/40">Sube el documento firmado si quieres reemplazar el adjunto actual (queda firmado/activo).</p>
                </div>
              ) : (
                /* Cómo se registra: borrador (previsualizar y enviar) o subir el firmado */
                <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                  <span className={lblCls}>¿Cómo lo registras?</span>
                  <p className="mb-2 mt-1 text-[11px] text-[#fff]/45">El documento NO es obligatorio ahora. Elige:</p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-start gap-2 text-sm text-[#fff]/80">
                      <input type="radio" name="firma" checked={firmaMetodo === "enviar"} onChange={() => setFirmaMetodo("enviar")} className="mt-1 accent-[var(--cyan)]" />
                      <span>Guardar como <b className="text-[#fff]">borrador</b> — lo previsualizas en el historial y, cuando esté listo, «Enviar para firma». No se avisa al empleado hasta enviarlo.</span>
                    </label>
                    <label className="flex items-start gap-2 text-sm text-[#fff]/80">
                      <input type="radio" name="firma" checked={firmaMetodo === "subir"} onChange={() => setFirmaMetodo("subir")} className="mt-1 accent-[var(--cyan)]" />
                      <span>Ya lo tengo <b className="text-[#fff]">firmado</b> — subirlo ahora (queda activo). Útil para reconstruir historia laboral.</span>
                    </label>
                  </div>
                  {firmaMetodo === "subir" && (
                    <input
                      ref={archivoRef}
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                      className="mt-3 block w-full text-sm text-[#fff]/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#fff] hover:file:bg-white/15"
                    />
                  )}
                </div>
              )}

              {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
              {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{msg}</p>}

              <div className="mt-4 flex items-center gap-3">
                <button onClick={guardar} disabled={guardando} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                  {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editando ? "Guardar cambios" : modoInicial ? "Definir contrato" : "Registrar otrosí"}
                </button>
                <span className="text-sm text-[#fff]/50">
                  {porFactura
                    ? <>Pago acordado: <b className="text-[#fff]/80">{formatMoneda(Number(flTarifa) || 0, flMoneda)}</b></>
                    : <>Total mensual: <b className="text-[#fff]/80">{formatCOP(totalNuevo)}</b></>}
                </span>
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
                  {historial.map((c) => (
                    <li key={c.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${editId === c.id ? "bg-amber-400/20 text-amber-200" : "bg-white/10 text-[#fff]/70"}`}>{TIPO_VERSION_LABEL[c.tipo]}</span>
                          {esFirmado(c) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300"><CheckCircle2 size={9} /> Firmado</span>
                          ) : esEnviadoPendiente(c) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300"><Clock size={9} /> Enviado · esperando firma</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#fff]/70"><Pencil size={9} /> Borrador</span>
                          )}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <button onClick={() => editarVersion(c)} title="Editar esta versión" className="rounded p-1 text-[#fff]/50 hover:bg-white/5 hover:text-[#fff]"><Pencil size={13} /></button>
                          <button onClick={() => setConfirmarEliminar(c.id)} title="Eliminar" className="rounded p-1 text-red-300/60 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={13} /></button>
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#fff]/50">Vigente desde {inicioContrato(c, fechaIngresoSel)}</p>
                      {c.firmado_por && <p className="text-[11px] text-[#fff]/40">Firmado por {c.firmado_por === "empleado" ? "el empleado" : "el CEO"}</p>}
                      {c.fecha_fin && <p className="text-[11px] font-semibold text-red-300/80">Finalizado el {c.fecha_fin}</p>}
                      {contratoEsPorFactura(c) ? (
                        <>
                          <p className="mt-1 text-sm text-[#fff]/85">{formatMoneda(Number(c.freelance_tarifa) || 0, c.freelance_moneda ?? "COP")}</p>
                          <p className="text-[11px] text-[#fff]/45">{c.tipo_vinculacion === "freelance" ? "Freelance" : "Prestación"} · {c.freelance_modo ? FREELANCE_MODO_LABEL[c.freelance_modo] : "—"}</p>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 text-sm text-[#fff]/85">{formatCOP(totalMensualContrato(c))} / mes</p>
                          <p className="text-[11px] text-[#fff]/45">Básico {formatCOP(c.salario_basico)} · Aux. {formatCOP(c.auxilio_transporte)}</p>
                          <p className="text-[11px] text-[#fff]/60">Neto a pagar: <b className="text-[var(--cyan)]">{formatCOP(netoContrato(c))}</b></p>
                        </>
                      )}
                      {c.ajustes && c.ajustes.length > 0 ? (
                        <p className="mt-1.5 flex flex-wrap gap-1">
                          {c.ajustes.map((a) => (
                            <span key={a} className="rounded-full bg-[var(--cyan)]/15 px-1.5 py-0.5 text-[9px] font-medium text-[var(--cyan)]">{CONCEPTO_AJUSTE_LABEL[a]}</span>
                          ))}
                        </p>
                      ) : c.tipo === "otrosi" && c.motivo ? (
                        <p className="mt-1 text-xs italic text-[#fff]/55">“{c.motivo}”</p>
                      ) : null}
                      <div className="mt-2 flex flex-col gap-1.5 border-t border-white/10 pt-2">
                        <a href={`/api/empleados/contratos/${c.id}/generado`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-[#fff]/60 hover:text-[#fff]">
                          <FileDown size={12} /> Previsualizar / regenerar (PDF)
                        </a>
                        {esBorrador(c) && (
                          <button onClick={() => enviarParaFirma(c.id)} disabled={enviando === c.id} className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[var(--cyan)]/15 px-2.5 py-1 text-[11px] font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/25 disabled:opacity-50">
                            {enviando === c.id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Enviar para firma
                          </button>
                        )}
                        {c.archivo_path ? (
                          <a href={`/api/empleados/contratos/${c.id}/archivo`} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--cyan)] hover:underline">
                            <Download size={12} /> Descargar firmado
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
