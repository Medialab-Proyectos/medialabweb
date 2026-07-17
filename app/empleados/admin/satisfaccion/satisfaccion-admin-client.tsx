"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, SmilePlus, Building2, Loader2, Send, Plus, Trash2, X } from "lucide-react"
import { periodoActual, nivelSatisfaccion } from "@/lib/empleados/satisfaccion"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

type RespEmp = { id: string; periodo: string; puntaje: number; recomendacion: number | null; comentario: string | null }
type RegEmpresa = { id: string; empresa: string | null; periodo: string; puntaje: number; comentario: string | null }
type Data = { promEmpleados: number | null; promEmpresas: number | null; totalEmpleados: number; empleados: RespEmp[]; empresas: RegEmpresa[] }

export function SatisfaccionAdminClient() {
  const [d, setD] = useState<Data | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState<{ empresa: string; periodo: string; puntaje: number; comentario: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [habilitada, setHabilitada] = useState(false)
  const [togHab, setTogHab] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const [r, rc] = await Promise.all([
        fetch("/api/empleados/admin/satisfaccion"),
        fetch("/api/empleados/admin/empresa-config"),
      ])
      const data = await r.json(); if (r.ok) setD(data); else setError(data.error || "Error al cargar.")
      try { const c = await rc.json(); setHabilitada(c?.config?.encuesta_habilitada === true) } catch { /* config opcional */ }
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  async function toggleHabilitada() {
    setTogHab(true); setError("")
    try {
      const r = await fetch("/api/empleados/admin/empresa-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ encuesta_habilitada: !habilitada }) })
      const data = await r.json(); if (!r.ok) throw new Error(data.error)
      setHabilitada(data?.config?.encuesta_habilitada === true)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al cambiar.") }
    finally { setTogHab(false) }
  }

  async function enviarEncuesta() {
    setEnviando(true); setError(""); setMsg("")
    try {
      const r = await fetch("/api/empleados/admin/satisfaccion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accion: "enviar" }) })
      const data = await r.json(); if (!r.ok) throw new Error(data.error)
      setMsg(`✓ Encuesta enviada a ${data.enviados} de ${data.total} empleados (a su correo empresarial o personal).`)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al enviar.") }
    finally { setEnviando(false) }
  }

  async function guardarEmpresa(e: React.FormEvent) {
    e.preventDefault(); if (!form) return
    setSaving(true); setError("")
    try {
      const r = await fetch("/api/empleados/admin/satisfaccion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accion: "empresa", empresa: form.empresa, periodo: form.periodo, puntaje: form.puntaje, comentario: form.comentario || null }) })
      const data = await r.json(); if (!r.ok) throw new Error(data.error)
      await cargar(); setForm(null)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setSaving(false) }
  }

  async function eliminar(id: string) {
    try { const r = await fetch(`/api/empleados/admin/satisfaccion?id=${id}`, { method: "DELETE" }); if (r.ok) await cargar() } catch { /* noop */ }
  }

  return (
    <div>
      <Link href="/empleados/admin/talento" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]"><ArrowLeft size={15} /> Volver a Talento Humano</Link>
      <div className="mb-4 flex items-center gap-2.5">
        <SmilePlus size={20} className="text-[#00BFA6]" />
        <h1 className="font-display text-xl font-bold">Satisfacción</h1>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="mb-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {/* Habilitar la encuesta para los empleados (arranca deshabilitada). */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Encuesta de empleados en el portal</p>
          <p className="text-xs text-[#fff]/55">{habilitada ? "Habilitada: los empleados ven la tarjeta y pueden responder." : "Deshabilitada: los empleados no la ven hasta que la actives."}</p>
        </div>
        <button onClick={toggleHabilitada} disabled={togHab} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${habilitada ? "border border-white/15 text-[#fff]/80 hover:bg-white/5" : "bg-[#00BFA6] text-[#04191b] hover:brightness-110"}`}>
          {togHab ? "…" : habilitada ? "Deshabilitar" : "Habilitar encuesta"}
        </button>
      </div>

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Indicadores */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Indicador icon={SmilePlus} titulo="Satisfacción de empleados" valor={d?.promEmpleados ?? null} nota={`${d?.totalEmpleados ?? 0} respuesta(s) este periodo`} />
            <Indicador icon={Building2} titulo="Satisfacción empresarial" valor={d?.promEmpresas ?? null} nota={`${d?.empresas.length ?? 0} registro(s)`} />
          </div>

          {/* Empleados */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><SmilePlus size={15} className="text-[#00BFA6]" /> Respuestas de empleados <span className="text-[11px] font-normal text-[#fff]/40">(anónimas)</span></h2>
              <button onClick={enviarEncuesta} disabled={enviando} className="inline-flex items-center gap-2 rounded-lg border border-[#00BFA6]/40 bg-[#00BFA6]/10 px-3 py-1.5 text-xs font-semibold text-[#00BFA6] hover:bg-[#00BFA6]/20 disabled:opacity-60">{enviando ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Enviar encuesta</button>
            </div>
            {(!d || d.empleados.length === 0) ? (
              <p className="text-sm text-[#fff]/45">Aún no hay respuestas. Envía la encuesta para empezar a medir.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {d.empleados.map((r) => (
                  <div key={r.id} className="rounded-xl bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#00BFA6]">{Math.round(r.puntaje)}/100 · {nivelSatisfaccion(r.puntaje)}</span>
                      <span className="text-[#fff]/40">{r.periodo}{r.recomendacion != null ? ` · NPS ${r.recomendacion}/10` : ""}</span>
                    </div>
                    {r.comentario && <p className="mt-1 text-sm text-[#fff]/70">“{r.comentario}”</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Empresas */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><Building2 size={15} className="text-[var(--cyan)]" /> Satisfacción de empresas</h2>
              <button onClick={() => { setError(""); setForm({ empresa: "", periodo: periodoActual(), puntaje: 80, comentario: "" }) }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cyan)] hover:underline"><Plus size={13} /> Registrar</button>
            </div>
            <p className="mb-3 text-[11px] text-[#fff]/40">Las encuestas a empresas se envían por fuera de este sistema. Aquí solo registras el resultado.</p>
            {(!d || d.empresas.length === 0) ? (
              <p className="text-sm text-[#fff]/45">Sin registros todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {d.empresas.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-2 rounded-xl bg-white/[0.03] px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{r.empresa} · <span className="text-[var(--cyan)]">{Math.round(r.puntaje)}/100</span></p>
                      <p className="text-[11px] text-[#fff]/45">{r.periodo}{r.comentario ? ` · “${r.comentario}”` : ""}</p>
                    </div>
                    <button onClick={() => eliminar(r.id)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarEmpresa} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Registrar satisfacción de empresa</h2>
              <button type="button" onClick={() => setForm(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Empresa</span>
                <input required value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} className={inputCls} placeholder="Cliente S.A.S" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Periodo</span>
                  <input value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} className={inputCls} placeholder="2026-07" /></label>
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Puntaje (0–100)</span>
                  <input type="number" min="0" max="100" value={form.puntaje} onChange={(e) => setForm({ ...form, puntaje: Number(e.target.value) })} className={inputCls} /></label>
              </div>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Comentario</span>
                <textarea rows={2} value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} className={inputCls} placeholder="Opcional" /></label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Indicador({ icon: Icon, titulo, valor, nota }: { icon: React.ElementType; titulo: string; valor: number | null; nota: string }) {
  const pct = valor != null ? Math.max(0, Math.min(100, valor)) : 0
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><Icon size={15} className="text-[#00BFA6]" /> {titulo}</h3>
      {valor != null ? (
        <>
          <div className="flex items-baseline gap-2"><span className="font-display text-3xl font-bold text-[#00BFA6]">{valor}</span><span className="text-sm text-[#fff]/50">/ 100 · {nivelSatisfaccion(valor)}</span></div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#00BFA6]" style={{ width: `${pct}%` }} /></div>
        </>
      ) : (
        <p className="text-sm text-[#fff]/40">Sin datos aún</p>
      )}
      <p className="mt-2 text-[11px] text-[#fff]/40">{nota}</p>
    </div>
  )
}
