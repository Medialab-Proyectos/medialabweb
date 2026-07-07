"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, FileText, Download, Trash2, CheckCircle2, EyeOff, Plus } from "lucide-react"
import type { Empleado } from "@/lib/empleados/types"
import type { CertificadoIRConEmpleado } from "@/lib/empleados/certificado-ir"
import { ConfirmDialog } from "../../confirm-dialog"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const anioActual = new Date().getFullYear()

export function IngresosRetencionesAdminClient({ empleados }: { empleados: Empleado[] }) {
  const [items, setItems] = useState<CertificadoIRConEmpleado[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [empleadoId, setEmpleadoId] = useState("")
  const [anio, setAnio] = useState(anioActual - 1) // certificado del año anterior
  const [archivo, setArchivo] = useState<File | null>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const archivoRef = useRef<HTMLInputElement>(null)
  const [confirmar, setConfirmar] = useState<CertificadoIRConEmpleado | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/admin/ingresos-retenciones")
      const data = await res.json()
      if (res.ok) setItems(data.certificados ?? []); else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function subir(e: React.FormEvent) {
    e.preventDefault()
    if (!empleadoId) return setError("Elige un empleado.")
    if (!archivo) return setError("Adjunta el PDF del certificado.")
    setError(""); setMsg(""); setSubiendo(true)
    try {
      // 1) Crear/asegurar el registro (empleado + año).
      const r1 = await fetch("/api/empleados/admin/ingresos-retenciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "crear", empleado_id: empleadoId, anio }),
      })
      const d1 = await r1.json(); if (!r1.ok) throw new Error(d1.error)
      // 2) Subir el PDF.
      const fd = new FormData(); fd.append("archivo", archivo)
      const r2 = await fetch(`/api/empleados/admin/ingresos-retenciones/${d1.certificado.id}/archivo`, { method: "POST", body: fd })
      const d2 = await r2.json(); if (!r2.ok) throw new Error(d2.error)
      setArchivo(null); if (archivoRef.current) archivoRef.current.value = ""
      setMsg("✓ Certificado subido. Publícalo para que el empleado lo vea.")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir.")
    } finally {
      setSubiendo(false)
    }
  }

  async function publicar(c: CertificadoIRConEmpleado, publicado: boolean) {
    setBusy(c.id); setError("")
    try {
      const res = await fetch("/api/empleados/admin/ingresos-retenciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "publicar", id: c.id, publicado }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.map((x) => (x.id === c.id ? { ...x, publicado } : x)))
    } catch (e) { setError(e instanceof Error ? e.message : "Error.") }
    finally { setBusy(null) }
  }

  async function eliminar(c: CertificadoIRConEmpleado) {
    setConfirmLoading(true)
    try {
      const res = await fetch(`/api/empleados/admin/ingresos-retenciones?id=${c.id}`, { method: "DELETE" })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setItems((prev) => prev.filter((x) => x.id !== c.id)); setConfirmar(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
    finally { setConfirmLoading(false) }
  }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-2 flex items-center gap-2.5">
        <FileText size={20} className="text-[var(--magenta)]" />
        <h1 className="font-display text-xl font-bold">Ingresos y retenciones</h1>
      </div>
      <p className="mb-6 text-sm text-[#fff]/55">Sube el <b className="text-[#fff]/75">Certificado de Ingresos y Retenciones</b> (DIAN) de cada empleado laboral por año y publícalo para que lo descargue desde su portal.</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="mb-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {/* Subir */}
      <form onSubmit={subir} className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="flex flex-col gap-1.5"><span className={lblCls}>Empleado</span>
            <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={inputCls}>
              <option value="">— Selecciona —</option>
              {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} · CC {e.cedula}</option>)}
            </select></label>
          <label className="flex flex-col gap-1.5"><span className={lblCls}>Año gravable</span>
            <input type="number" min={2000} max={2100} value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} w-28`} /></label>
          <div className="flex flex-col justify-end">
            <input ref={archivoRef} type="file" accept="application/pdf" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} className="block w-full text-sm text-[#fff]/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#fff] hover:file:bg-white/15" />
          </div>
        </div>
        <button type="submit" disabled={subiendo} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--magenta)] px-5 py-2.5 text-sm font-semibold text-[#fff] transition hover:brightness-110 disabled:opacity-60">
          {subiendo ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Subir certificado
        </button>
      </form>

      {/* Lista */}
      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay certificados subidos.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.empleado?.nombre ?? "—"} <span className="text-[#fff]/45">· año {c.anio}</span></p>
                <p className="text-xs text-[#fff]/50">
                  {c.archivo_path ? "PDF cargado" : "Sin PDF"} · {c.publicado ? <span className="text-emerald-300/90">Publicado</span> : <span className="text-amber-300/80">Sin publicar</span>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {c.archivo_path && (
                  <a href={`/api/empleados/ingresos-retenciones/${c.id}/archivo`} target="_blank" rel="noreferrer" title="Ver PDF" className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Download size={15} /></a>
                )}
                {busy === c.id ? (
                  <Loader2 size={15} className="animate-spin text-[#fff]/50" />
                ) : c.publicado ? (
                  <button onClick={() => publicar(c, false)} title="Despublicar" className="rounded-lg p-1.5 text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-300"><EyeOff size={15} /></button>
                ) : (
                  <button onClick={() => publicar(c, true)} disabled={!c.archivo_path} title="Publicar" className="rounded-lg p-1.5 text-emerald-300/70 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-30"><CheckCircle2 size={15} /></button>
                )}
                <button onClick={() => setConfirmar(c)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo="Eliminar certificado"
        mensaje={`¿Eliminar el certificado de ${confirmar?.empleado?.nombre ?? ""} (año ${confirmar?.anio})? Se borra también el PDF.`}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar && eliminar(confirmar)}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}
