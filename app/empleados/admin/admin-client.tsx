"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  UserPlus, Pencil, KeyRound, Ban, RotateCcw, Loader2, X, Copy, CheckCircle2, Users, FileText, FileSignature, Gift, PiggyBank, ArrowLeft, Plane, ChevronDown, PauseCircle, FileWarning, Receipt, Search, Upload, Download,
} from "lucide-react"
import type { Empleado, Rol } from "@/lib/empleados/types"
import { ROL_LABEL } from "@/lib/empleados/types"
import type { Beneficio, BeneficioTipo, TipoBeneficio } from "@/lib/empleados/beneficio"
import { ESTADO_BENEFICIO_LABEL } from "@/lib/empleados/beneficio"
import { EPS_CO, FONDOS_CESANTIAS, FONDOS_PENSION } from "@/lib/empleados/catalogos-co"
import { ConfirmDialog } from "../confirm-dialog"

type AccionConfirmable = "cerrar_contrato" | "suspender" | "resetear_clave"
type Tone = "danger" | "warn" | "default"
const CONFIRM_ACCIONES: Record<AccionConfirmable, (nombre: string) => { titulo: string; mensaje: string; confirmLabel: string; tone: Tone }> = {
  cerrar_contrato: (n) => ({ titulo: "Cerrar contrato", mensaje: `¿Cerrar el contrato de ${n}? Se marcará como terminado con fecha de egreso hoy y no podrá volver a entrar al sistema. Si vas a liquidarlo, mejor hazlo desde "Liquidaciones": al generar la liquidación el contrato se cierra automáticamente.`, confirmLabel: "Cerrar contrato", tone: "danger" }),
  suspender: (n) => ({ titulo: "Suspender acceso", mensaje: `¿Suspender el acceso de ${n}? No podrá entrar al sistema hasta que lo reactives (el contrato sigue vigente).`, confirmLabel: "Suspender", tone: "warn" }),
  resetear_clave: (n) => ({ titulo: "Resetear contraseña", mensaje: `¿Generar una nueva contraseña temporal para ${n}? La contraseña actual dejará de funcionar.`, confirmLabel: "Generar contraseña", tone: "default" }),
}

type FormState = {
  id?: string
  cedula: string
  nombre: string
  email: string
  email_empresarial: string
  telefono: string
  direccion: string
  fecha_nacimiento: string
  eps: string
  fondo_cesantias: string
  fondo_pension: string
  cert_eps_path: string | null
  cert_cesantias_path: string | null
  cert_pension_path: string | null
}

const vacío: FormState = {
  cedula: "", nombre: "", email: "", email_empresarial: "", telefono: "", direccion: "", fecha_nacimiento: "", eps: "", fondo_cesantias: "", fondo_pension: "",
  cert_eps_path: null, cert_cesantias_path: null, cert_pension_path: null,
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60 disabled:opacity-50"
const lblCls = "text-xs font-semibold uppercase tracking-wide text-[#fff]/55"

export function AdminClient({ inicial, ceoId }: { inicial: Empleado[]; ceoId: string }) {
  const [empleados, setEmpleados] = useState<Empleado[]>(inicial)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [tempPass, setTempPass] = useState<{ nombre: string; pass: string; correo: boolean } | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [confirmar, setConfirmar] = useState<null | { titulo: string; mensaje: string; confirmLabel: string; tone: Tone; run: () => Promise<void> }>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [aviso, setAviso] = useState("")
  const [q, setQ] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos" | "todos">("activos")
  const [benefEmp, setBenefEmp] = useState<Empleado | null>(null)
  const [benefItems, setBenefItems] = useState<Beneficio[]>([])
  const [benefLoading, setBenefLoading] = useState(false)
  const [benefBusy, setBenefBusy] = useState<TipoBeneficio | null>(null)
  const [catalogo, setCatalogo] = useState<BeneficioTipo[]>([])

  // Catálogo de tipos de beneficio (para asignar desde la fila del empleado).
  useEffect(() => {
    fetch("/api/empleados/admin/beneficios/tipos")
      .then((r) => r.json())
      .then((d) => setCatalogo((d.tipos ?? []).filter((t: BeneficioTipo) => t.activo)))
      .catch(() => {})
  }, [])

  const visibles = useMemo(() => {
    const t = q.trim().toLowerCase()
    const filtrados = empleados.filter((e) => {
      if (filtroEstado === "activos" && e.estado !== "activo") return false
      if (filtroEstado === "inactivos" && e.estado === "activo") return false
      if (!t) return true
      return e.nombre.toLowerCase().includes(t) || e.cedula.toLowerCase().includes(t) || (e.cargo ?? "").toLowerCase().includes(t)
    })
    // Activos primero; dentro de cada grupo, por nombre.
    return [...filtrados].sort((a, b) => {
      const av = a.estado === "activo" ? 0 : 1
      const bv = b.estado === "activo" ? 0 : 1
      return av !== bv ? av - bv : a.nombre.localeCompare(b.nombre)
    })
  }, [empleados, q, filtroEstado])

  const conteos = useMemo(() => ({
    activos: empleados.filter((e) => e.estado === "activo").length,
    inactivos: empleados.filter((e) => e.estado !== "activo").length,
  }), [empleados])

  const nombrePorId = useMemo(() => {
    const m = new Map<string, string>()
    empleados.forEach((e) => m.set(e.id, e.nombre))
    return m
  }, [empleados])

  function abrirNuevo() { setError(""); setForm({ ...vacío }) }
  function abrirEditar(e: Empleado) {
    setError("")
    setForm({
      id: e.id, cedula: e.cedula, nombre: e.nombre, email: e.email, email_empresarial: e.email_empresarial ?? "",
      telefono: e.telefono ?? "", direccion: e.direccion ?? "", fecha_nacimiento: e.fecha_nacimiento ?? "", eps: e.eps ?? "",
      fondo_cesantias: e.fondo_cesantias ?? "", fondo_pension: e.fondo_pension ?? "",
      cert_eps_path: e.cert_eps_path ?? null, cert_cesantias_path: e.cert_cesantias_path ?? null, cert_pension_path: e.cert_pension_path ?? null,
    })
  }

  function upsertLocal(e: Empleado) {
    setEmpleados((prev) => {
      const i = prev.findIndex((x) => x.id === e.id)
      if (i === -1) return [...prev, e].sort((a, b) => a.nombre.localeCompare(b.nombre))
      const copy = [...prev]; copy[i] = e; return copy
    })
  }

  const [subiendoCert, setSubiendoCert] = useState<string | null>(null)
  async function subirCertificado(tipo: "eps" | "cesantias" | "pension", file: File) {
    if (!form?.id) return
    setError(""); setSubiendoCert(tipo)
    const fd = new FormData(); fd.append("archivo", file); fd.append("tipo", tipo)
    try {
      const res = await fetch(`/api/empleados/admin/empleado/${form.id}/certificado`, { method: "POST", body: fd })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      const emp = data.empleado as Empleado
      upsertLocal(emp)
      setForm((f) => (f ? { ...f, cert_eps_path: emp.cert_eps_path, cert_cesantias_path: emp.cert_cesantias_path, cert_pension_path: emp.cert_pension_path } : f))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el certificado.")
    } finally { setSubiendoCert(null) }
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault()
    if (!form) return
    // Validaciones de formulario
    if (!form.id && !/^\d{5,}$/.test(form.cedula.trim())) {
      return setError("La cédula debe ser numérica (solo dígitos).")
    }
    setError(""); setSaving(true)
    try {
      if (form.id) {
        const res = await fetch("/api/empleados/admin", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: form.id, accion: "actualizar",
            nombre: form.nombre, email: form.email,
            email_empresarial: form.email_empresarial || null,
            telefono: form.telefono || null, direccion: form.direccion || null, fecha_nacimiento: form.fecha_nacimiento || null,
            eps: form.eps || null,
            fondo_cesantias: form.fondo_cesantias || null,
            fondo_pension: form.fondo_pension || null,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        upsertLocal(data.empleado); setForm(null)
      } else {
        const res = await fetch("/api/empleados/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cedula: form.cedula, nombre: form.nombre, email: form.email,
            email_empresarial: form.email_empresarial || null,
            telefono: form.telefono || null, direccion: form.direccion || null, fecha_nacimiento: form.fecha_nacimiento || null,
            eps: form.eps || null,
            fondo_cesantias: form.fondo_cesantias || null,
            fondo_pension: form.fondo_pension || null,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        upsertLocal(data.empleado)
        setTempPass({ nombre: data.empleado.nombre, pass: data.passwordTemporal, correo: data.correoEnviado })
        setForm(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.")
    } finally {
      setSaving(false)
    }
  }

  async function ejecutarAccion(id: string, tipo: "cerrar_contrato" | "suspender" | "reactivar" | "resetear_clave", emp: Empleado) {
    setAviso(""); setConfirmLoading(true)
    try {
      const res = await fetch("/api/empleados/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accion: tipo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.empleado) upsertLocal(data.empleado)
      if (data.passwordTemporal) setTempPass({ nombre: emp.nombre, pass: data.passwordTemporal, correo: data.correoEnviado })
      setConfirmar(null)
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al ejecutar la acción.")
      setConfirmar(null)
    } finally {
      setConfirmLoading(false)
    }
  }

  function accion(id: string, tipo: "cerrar_contrato" | "suspender" | "reactivar" | "resetear_clave", emp: Empleado) {
    // Reactivar es directo; las demás piden confirmación en un diálogo dentro de la app.
    if (tipo === "reactivar") { ejecutarAccion(id, tipo, emp); return }
    const cfg = CONFIRM_ACCIONES[tipo](emp.nombre)
    setConfirmar({ ...cfg, run: () => ejecutarAccion(id, tipo, emp) })
  }

  // ── Beneficios por empleado ─────────────────────────────────────────────────
  async function abrirBeneficios(e: Empleado) {
    setBenefEmp(e); setBenefItems([]); setBenefLoading(true); setAviso("")
    try {
      const res = await fetch(`/api/empleados/admin/beneficios?empleado_id=${e.id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBenefItems(data.beneficios ?? [])
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al cargar beneficios.")
    } finally {
      setBenefLoading(false)
    }
  }

  async function asignarBenef(tipo: TipoBeneficio) {
    if (!benefEmp) return
    setBenefBusy(tipo); setAviso("")
    try {
      const res = await fetch("/api/empleados/admin/beneficios", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empleado_id: benefEmp.id, tipo, estado: "activo" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBenefItems((prev) => {
        const i = prev.findIndex((x) => x.tipo === tipo)
        if (i === -1) return [data.beneficio as Beneficio, ...prev]
        const copy = [...prev]; copy[i] = data.beneficio as Beneficio; return copy
      })
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al asignar.")
    } finally {
      setBenefBusy(null)
    }
  }

  async function cambiarEstadoBenef(id: string, tipo: TipoBeneficio, estado: "activo" | "inactivo") {
    setBenefBusy(tipo); setAviso("")
    try {
      const res = await fetch("/api/empleados/admin/beneficios", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBenefItems((prev) => prev.map((x) => (x.id === id ? (data.beneficio as Beneficio) : x)))
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al actualizar.")
    } finally {
      setBenefBusy(null)
    }
  }


  // Acciones de fila (compartidas por la tabla y las tarjetas móviles).
  function acciones(e: Empleado) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={() => abrirEditar(e)} title="Editar" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={15} /></button>
        <button onClick={() => abrirBeneficios(e)} title="Beneficios" className="rounded-lg p-1.5 text-[#E8751A]/80 hover:bg-[#E8751A]/10 hover:text-[#E8751A]"><Gift size={15} /></button>
        <Link href={`/empleados/admin/liquidaciones?empleado=${e.id}`} title="Liquidar" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><FileWarning size={15} /></Link>
        <button onClick={() => accion(e.id, "resetear_clave", e)} title="Resetear contraseña" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><KeyRound size={15} /></button>
        {e.estado === "activo" && (
          <button onClick={() => accion(e.id, "suspender", e)} disabled={e.id === ceoId} title="Suspender acceso" className="rounded-lg p-1.5 text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-300 disabled:opacity-30"><PauseCircle size={15} /></button>
        )}
        {e.estado === "activo"
          ? <button onClick={() => accion(e.id, "cerrar_contrato", e)} disabled={e.id === ceoId} title="Cerrar contrato" className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"><Ban size={15} /></button>
          : <button onClick={() => accion(e.id, "reactivar", e)} title="Reactivar acceso" className="rounded-lg p-1.5 text-emerald-300/70 hover:bg-emerald-500/10 hover:text-emerald-300"><RotateCcw size={15} /></button>}
      </div>
    )
  }

  const rolBadge = (rol: Rol) => (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
      rol === "ceo" ? "bg-[var(--magenta)]/15 text-[var(--magenta)]"
        : rol === "lider" ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
        : "bg-white/5 text-[#fff]/70"
    }`}>{ROL_LABEL[rol]}</span>
  )

  const estadoBadge = (estado: Empleado["estado"]) =>
    estado === "activo"
      ? <span className="text-emerald-300/90">Activo</span>
      : estado === "suspendido"
        ? <span className="text-amber-300/80">Suspendido</span>
        : <span className="text-red-300/80">Terminado</span>

  return (
    <div>
      <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al inicio
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Users size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Gestión de empleados</h1>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{empleados.length}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/empleados/admin/contratos"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
          >
            <FileSignature size={15} /> Contratos
          </Link>
          <DesprendiblesMenu />
          <Link
            href="/empleados/admin/vacaciones"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
          >
            <Plane size={15} /> Vacaciones
          </Link>
          <a
            href="/api/empleados/admin/export-empleados"
            target="_blank"
            rel="noreferrer"
            title="Exportar empleados activos a PDF"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
          >
            <Download size={15} /> Exportar activos
          </a>
          <button
            onClick={abrirNuevo}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110"
          >
            <UserPlus size={15} /> Nuevo empleado
          </button>
        </div>
      </div>

      {/* Buscador + filtro por estado */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#fff]/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, cédula o cargo…"
            className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
          />
        </div>
        <div className="flex shrink-0 rounded-xl border border-white/10 bg-black/20 p-0.5 text-xs">
          {([["activos", `Activos (${conteos.activos})`], ["inactivos", `Inactivos (${conteos.inactivos})`], ["todos", "Todos"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setFiltroEstado(k)} className={`rounded-lg px-3 py-1.5 font-medium transition ${filtroEstado === k ? "bg-[var(--cyan)] text-[#04191b]" : "text-[#fff]/60 hover:text-[#fff]"}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Banner de contraseña temporal */}
      {tempPass && (
        <div className="mb-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-emerald-100/90">
              <p className="font-semibold">Contraseña temporal de {tempPass.nombre}</p>
              <p className="mt-1 text-emerald-200/70">
                {tempPass.correo ? "Se envió por correo. " : "⚠️ No se pudo enviar el correo — cópiala y entrégala tú. "}
                Cópiala ahora, no se vuelve a mostrar.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="rounded-lg bg-black/40 px-3 py-1.5 font-mono text-base tracking-wide text-[#fff]">{tempPass.pass}</code>
                <button
                  onClick={() => { navigator.clipboard.writeText(tempPass.pass); setCopiado(true); setTimeout(() => setCopiado(false), 1500) }}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-[#fff]/80 hover:bg-white/5"
                >
                  {copiado ? <CheckCircle2 size={13} /> : <Copy size={13} />} {copiado ? "Copiada" : "Copiar"}
                </button>
              </div>
            </div>
            <button onClick={() => setTempPass(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={16} /></button>
          </div>
        </div>
      )}

      {aviso && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span>{aviso}</span>
          <button onClick={() => setAviso("")} className="text-red-200/70 hover:text-red-100"><X size={15} /></button>
        </div>
      )}

      {/* Tabla (desktop) */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-[#fff]/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Empleado</th>
              <th className="px-4 py-3 font-semibold">Cargo</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Líder</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((e) => (
              <tr key={e.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3">
                  <p className="flex items-center gap-1.5 font-medium text-[#fff]">
                    {e.nombre}
                    {e.tipo_vinculacion === "freelance" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cyan)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--cyan)]"><Receipt size={9} /> Freelance</span>
                    )}
                  </p>
                  <p className="text-xs text-[#fff]/45">CC {e.cedula}</p>
                </td>
                <td className="px-4 py-3 text-[#fff]/70">{e.cargo || "—"}</td>
                <td className="px-4 py-3">{rolBadge(e.rol)}</td>
                <td className="px-4 py-3 text-[#fff]/70">{e.lider_id ? nombrePorId.get(e.lider_id) ?? "—" : "—"}</td>
                <td className="px-4 py-3">{estadoBadge(e.estado)}</td>
                <td className="px-4 py-3"><div className="flex justify-end">{acciones(e)}</div></td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-[#fff]/45">{empleados.length === 0 ? "Aún no hay empleados. Crea el primero." : "Sin resultados para tu búsqueda."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas (móvil) */}
      <div className="flex flex-col gap-3 md:hidden">
        {visibles.map((e) => (
          <div key={e.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex flex-wrap items-center gap-1.5 font-medium text-[#fff]">
                  {e.nombre}
                  {e.tipo_vinculacion === "freelance" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cyan)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--cyan)]"><Receipt size={9} /> Freelance</span>
                  )}
                </p>
                <p className="text-xs text-[#fff]/45">CC {e.cedula}</p>
                <p className="mt-1 text-sm text-[#fff]/70">{e.cargo || "—"}</p>
              </div>
              {estadoBadge(e.estado)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#fff]/55">
              {rolBadge(e.rol)}
              {e.lider_id && <span>Líder: {nombrePorId.get(e.lider_id) ?? "—"}</span>}
            </div>
            <div className="mt-3 border-t border-white/[0.06] pt-2">{acciones(e)}</div>
          </div>
        ))}
        {visibles.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-[#fff]/45">
            {empleados.length === 0 ? "Aún no hay empleados. Crea el primero." : "Sin resultados para tu búsqueda."}
          </p>
        )}
      </div>

      {/* Modal formulario */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardar} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{form.id ? "Editar empleado" : "Nuevo empleado"}</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Cédula</span>
                <input required disabled={!!form.id} value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} inputMode="numeric" placeholder="Documento" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Nombre completo</span>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre y apellido" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Correo electrónico</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Correo empresarial (opcional)</span>
                <input type="email" value={form.email_empresarial} onChange={(e) => setForm({ ...form, email_empresarial: e.target.value })} placeholder="nombre@medialab.design" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Teléfono</span>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Celular" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Dirección</span>
                <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección de residencia" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fecha de nacimiento</span>
                <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>EPS (salud) · opcional</span>
                <input list="cat-eps" value={form.eps} onChange={(e) => setForm({ ...form, eps: e.target.value })} placeholder="Elige, escribe o «No aplica»" className={inputCls} />
                <datalist id="cat-eps"><option value="No aplica" />{EPS_CO.map((x) => <option key={x} value={x} />)}</datalist>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fondo de cesantías · opcional</span>
                <input list="cat-cesantias" value={form.fondo_cesantias} onChange={(e) => setForm({ ...form, fondo_cesantias: e.target.value })} placeholder="Elige, escribe o «No aplica»" className={inputCls} />
                <datalist id="cat-cesantias"><option value="No aplica" />{FONDOS_CESANTIAS.map((x) => <option key={x} value={x} />)}</datalist>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fondo de pensiones · opcional</span>
                <input list="cat-pension" value={form.fondo_pension} onChange={(e) => setForm({ ...form, fondo_pension: e.target.value })} placeholder="Elige, escribe o «No aplica»" className={inputCls} />
                <datalist id="cat-pension"><option value="No aplica" />{FONDOS_PENSION.map((x) => <option key={x} value={x} />)}</datalist>
              </label>
              {form.id ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#fff]/55">Certificados de afiliación</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {([["eps", "EPS", form.cert_eps_path], ["cesantias", "Cesantías", form.cert_cesantias_path], ["pension", "Pensión", form.cert_pension_path]] as const).map(([t, label, path]) => (
                      <div key={t} className="flex flex-col gap-1">
                        <span className="text-[11px] text-[#fff]/55">{label}</span>
                        <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-[#fff]/80 hover:bg-white/5">
                          {subiendoCert === t ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} {path ? "Reemplazar" : "Subir"}
                          <input type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) subirCertificado(t, f); e.target.value = "" }} />
                        </label>
                        {path && <a href={`/api/empleados/admin/empleado/${form.id}/certificado?tipo=${t}`} target="_blank" rel="noreferrer" className="text-[11px] text-[var(--cyan)] hover:underline">Ver</a>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-[#fff]/40">Adjunta los certificados de afiliación a EPS, cesantías y pensión.</p>
                </div>
              ) : (
                <p className="rounded-lg bg-amber-400/[0.06] px-3 py-2 text-[11px] text-amber-200/80 sm:col-span-2">
                  Los <b>certificados de afiliación</b> (EPS, cesantías, pensión) se adjuntan después de crear el empleado (edítalo y súbelos).
                </p>
              )}
              <p className="rounded-lg bg-white/[0.03] px-3 py-2 text-[11px] text-[#fff]/45 sm:col-span-2">
                El <b className="text-[#fff]/70">rol</b>, la <b className="text-[#fff]/70">vinculación</b> (laboral/freelance/prestación), el <b className="text-[#fff]/70">cargo</b>, el <b className="text-[#fff]/70">líder</b>, la <b className="text-[#fff]/70">fecha de ingreso</b>, las <b className="text-[#fff]/70">condiciones de pago</b> y el <b className="text-[#fff]/70">documento del contrato</b> se definen en <b className="text-[#fff]/70">Contratos</b>. Aquí solo van los datos personales.
              </p>
            </div>

            {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

            {!form.id && (
              <p className="mt-3 text-xs text-[#fff]/45">Se generará una contraseña temporal y se enviará al correo del empleado.</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} {form.id ? "Guardar cambios" : "Crear empleado"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal beneficios por empleado */}
      {benefEmp && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><Gift size={18} className="text-[#E8751A]" /> Beneficios</h2>
              <button onClick={() => setBenefEmp(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <p className="mb-4 text-sm text-[#fff]/55">{benefEmp.nombre} · CC {benefEmp.cedula}</p>

            {benefLoading ? (
              <div className="flex items-center gap-2 py-6 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
            ) : (
              <div className="flex flex-col gap-2">
                {catalogo.length === 0 && (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#fff]/50">
                    Aún no hay beneficios en el catálogo. Créalos en <b className="text-[#fff]/70">Talento Humano → Beneficios</b>.
                  </p>
                )}
                {catalogo.map((t) => {
                  const tipo = t.slug
                  const b = benefItems.find((x) => x.tipo === tipo) ?? null
                  const busy = benefBusy === tipo
                  return (
                    <div key={tipo} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{t.nombre}</p>
                        <p className="text-xs text-[#fff]/50">{b ? ESTADO_BENEFICIO_LABEL[b.estado] : "No asignado"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {busy ? (
                          <Loader2 size={15} className="animate-spin text-[#fff]/50" />
                        ) : !b || b.estado === "inactivo" ? (
                          <button onClick={() => (b ? cambiarEstadoBenef(b.id, tipo, "activo") : asignarBenef(tipo))} className="rounded-lg bg-[#E8751A] px-3 py-1.5 text-xs font-semibold text-[#1a0f04] hover:brightness-110">Asignar</button>
                        ) : (
                          <button onClick={() => cambiarEstadoBenef(b.id, tipo, "inactivo")} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-[#fff]/80 hover:bg-white/5">Quitar</button>
                        )}
                      </div>
                    </div>
                  )
                })}
                <p className="mt-2 text-[11px] text-[#fff]/40">Solo el CEO activa beneficios. El empleado solo los ve en su portal cuando quedan activos.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo={confirmar?.titulo ?? ""}
        mensaje={confirmar?.mensaje ?? ""}
        confirmLabel={confirmar?.confirmLabel}
        tone={confirmar?.tone}
        cargando={confirmLoading}
        onConfirm={() => confirmar?.run()}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}

/** Agrupa Desprendibles de pago, Primas y Cesantías en un solo menú "Desprendibles". */
function DesprendiblesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onEsc)
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc) }
  }, [open])

  const items = [
    { href: "/empleados/admin/desprendibles", icon: FileText, label: "Desprendibles de pago" },
    { href: "/empleados/admin/primas", icon: Gift, label: "Primas" },
    { href: "/empleados/admin/cesantias", icon: PiggyBank, label: "Cesantías" },
    { href: "/empleados/admin/ingresos-retenciones", icon: FileText, label: "Ingresos y retenciones" },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
      >
        <FileText size={15} /> Desprendibles
        <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#12151c] p-1 shadow-2xl">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Link
                key={it.href}
                href={it.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#fff]/80 transition hover:bg-white/5 hover:text-[#fff]"
              >
                <Icon size={15} className="text-[var(--cyan)]" /> {it.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
