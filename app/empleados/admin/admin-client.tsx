"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  UserPlus, Pencil, KeyRound, Ban, RotateCcw, Loader2, X, Copy, CheckCircle2, Users, FileText, FileSignature, Gift, PiggyBank, ArrowLeft,
} from "lucide-react"
import type { Empleado, Rol } from "@/lib/empleados/types"
import { ROL_LABEL } from "@/lib/empleados/types"
import { CAJAS_COMPENSACION } from "@/lib/empleados/catalogos-co"

type FormState = {
  id?: string
  cedula: string
  nombre: string
  email: string
  cargo: string
  caja_compensacion: string
  rol: Rol
  lider_id: string
  fecha_ingreso: string
  fecha_egreso: string
  particularidades: string
}

const vacío: FormState = {
  cedula: "", nombre: "", email: "", cargo: "", caja_compensacion: "", rol: "empleado",
  lider_id: "", fecha_ingreso: "", fecha_egreso: "", particularidades: "",
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

  const nombrePorId = useMemo(() => {
    const m = new Map<string, string>()
    empleados.forEach((e) => m.set(e.id, e.nombre))
    return m
  }, [empleados])

  const posiblesLideres = useMemo(
    () => empleados.filter((e) => e.rol === "lider" || e.rol === "ceo"),
    [empleados],
  )

  function abrirNuevo() { setError(""); setForm({ ...vacío }) }
  function abrirEditar(e: Empleado) {
    setError("")
    setForm({
      id: e.id, cedula: e.cedula, nombre: e.nombre, email: e.email, cargo: e.cargo ?? "",
      caja_compensacion: e.caja_compensacion ?? "",
      rol: e.rol, lider_id: e.lider_id ?? "", fecha_ingreso: e.fecha_ingreso ?? "",
      fecha_egreso: e.fecha_egreso ?? "", particularidades: e.particularidades ?? "",
    })
  }

  function upsertLocal(e: Empleado) {
    setEmpleados((prev) => {
      const i = prev.findIndex((x) => x.id === e.id)
      if (i === -1) return [...prev, e].sort((a, b) => a.nombre.localeCompare(b.nombre))
      const copy = [...prev]; copy[i] = e; return copy
    })
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault()
    if (!form) return
    setError(""); setSaving(true)
    try {
      if (form.id) {
        const res = await fetch("/api/empleados/admin", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: form.id, accion: "actualizar",
            nombre: form.nombre, email: form.email, cargo: form.cargo || null,
            caja_compensacion: form.caja_compensacion || null,
            rol: form.rol, lider_id: form.lider_id || null,
            fecha_ingreso: form.fecha_ingreso || null, fecha_egreso: form.fecha_egreso || null,
            particularidades: form.particularidades || null,
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
            cedula: form.cedula, nombre: form.nombre, email: form.email, cargo: form.cargo || null,
            caja_compensacion: form.caja_compensacion || null,
            rol: form.rol, lider_id: form.lider_id || null,
            fecha_ingreso: form.fecha_ingreso || null, particularidades: form.particularidades || null,
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

  async function accion(id: string, tipo: "cerrar_contrato" | "reactivar" | "resetear_clave", emp: Empleado) {
    if (tipo === "cerrar_contrato" && !confirm(`¿Cerrar el contrato de ${emp.nombre}? Se marcará como terminado con fecha de egreso hoy.`)) return
    if (tipo === "resetear_clave" && !confirm(`¿Generar una nueva contraseña temporal para ${emp.nombre}?`)) return
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error.")
    }
  }

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
          <Link
            href="/empleados/admin/desprendibles"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
          >
            <FileText size={15} /> Desprendibles
          </Link>
          <Link
            href="/empleados/admin/primas"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
          >
            <Gift size={15} /> Primas
          </Link>
          <Link
            href="/empleados/admin/cesantias"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
          >
            <PiggyBank size={15} /> Cesantías
          </Link>
          <button
            onClick={abrirNuevo}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110"
          >
            <UserPlus size={15} /> Nuevo empleado
          </button>
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

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
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
            {empleados.map((e) => (
              <tr key={e.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#fff]">{e.nombre}</p>
                  <p className="text-xs text-[#fff]/45">CC {e.cedula}</p>
                </td>
                <td className="px-4 py-3 text-[#fff]/70">{e.cargo || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    e.rol === "ceo" ? "bg-[var(--magenta)]/15 text-[var(--magenta)]"
                      : e.rol === "lider" ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                      : "bg-white/5 text-[#fff]/70"
                  }`}>{ROL_LABEL[e.rol]}</span>
                </td>
                <td className="px-4 py-3 text-[#fff]/70">{e.lider_id ? nombrePorId.get(e.lider_id) ?? "—" : "—"}</td>
                <td className="px-4 py-3">
                  {e.estado === "activo"
                    ? <span className="text-emerald-300/90">Activo</span>
                    : <span className="text-amber-300/80">Terminado</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => abrirEditar(e)} title="Editar" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={15} /></button>
                    <button onClick={() => accion(e.id, "resetear_clave", e)} title="Resetear contraseña" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><KeyRound size={15} /></button>
                    {e.estado === "activo"
                      ? <button onClick={() => accion(e.id, "cerrar_contrato", e)} disabled={e.id === ceoId} title="Cerrar contrato" className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"><Ban size={15} /></button>
                      : <button onClick={() => accion(e.id, "reactivar", e)} title="Reactivar" className="rounded-lg p-1.5 text-emerald-300/70 hover:bg-emerald-500/10 hover:text-emerald-300"><RotateCcw size={15} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {empleados.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-[#fff]/45">Aún no hay empleados. Crea el primero.</td></tr>
            )}
          </tbody>
        </table>
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
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={lblCls}>Correo electrónico</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Cargo</span>
                <input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Ej: Diseñador UX" className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Caja de compensación</span>
                <input list="cat-cajas" value={form.caja_compensacion} onChange={(e) => setForm({ ...form, caja_compensacion: e.target.value })} placeholder="Elige o escribe…" className={inputCls} />
                <datalist id="cat-cajas">{CAJAS_COMPENSACION.map((x) => <option key={x} value={x} />)}</datalist>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Rol</span>
                <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })} className={inputCls}>
                  <option value="empleado">Empleado</option>
                  <option value="lider">Líder</option>
                  <option value="ceo">CEO</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={lblCls}>Líder (a quién reporta)</span>
                <select value={form.lider_id} onChange={(e) => setForm({ ...form, lider_id: e.target.value })} className={inputCls}>
                  <option value="">— Sin líder (reporta al CEO) —</option>
                  {posiblesLideres.filter((l) => l.id !== form.id).map((l) => (
                    <option key={l.id} value={l.id}>{l.nombre} · {ROL_LABEL[l.rol]}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Fecha de ingreso</span>
                <input type="date" value={form.fecha_ingreso} onChange={(e) => setForm({ ...form, fecha_ingreso: e.target.value })} className={inputCls} />
              </label>
              {form.id && (
                <label className="flex flex-col gap-1.5">
                  <span className={lblCls}>Fecha de egreso</span>
                  <input type="date" value={form.fecha_egreso} onChange={(e) => setForm({ ...form, fecha_egreso: e.target.value })} className={inputCls} />
                </label>
              )}
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={lblCls}>Particularidades (otrosíes, cambios de cargo…)</span>
                <textarea rows={3} value={form.particularidades} onChange={(e) => setForm({ ...form, particularidades: e.target.value })} placeholder="Notas relevantes del contrato" className={inputCls} />
              </label>
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
    </div>
  )
}
