"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, SmilePlus, Loader2, CheckCircle2 } from "lucide-react"
import { ESCALA } from "@/lib/empleados/satisfaccion"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"

export function SatisfaccionClient({ nombre }: { nombre: string }) {
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")
  const [respondida, setRespondida] = useState(false)
  const [periodo, setPeriodo] = useState("")

  const [puntaje, setPuntaje] = useState<number | null>(null)
  const [enps, setEnps] = useState<number | null>(null)
  const [comentario, setComentario] = useState("")

  async function cargar() {
    try {
      const r = await fetch("/api/empleados/satisfaccion")
      const d = await r.json()
      if (r.ok) { setPeriodo(d.periodo); if (d.respuesta) { setRespondida(true); setPuntaje(Number(d.respuesta.puntaje)); setEnps(d.respuesta.recomendacion); setComentario(d.respuesta.comentario ?? "") } }
      else setError(d.error || "Error al cargar.")
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (puntaje === null) return setError("Elige cómo te sientes.")
    setError(""); setEnviando(true)
    try {
      const r = await fetch("/api/empleados/satisfaccion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ puntaje, recomendacion: enps, comentario: comentario || null }) })
      const d = await r.json(); if (!r.ok) throw new Error(d.error)
      setRespondida(true)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al enviar.") }
    finally { setEnviando(false) }
  }

  return (
    <div>
      <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]"><ArrowLeft size={15} /> Volver al inicio</Link>
      <div className="mb-2 flex items-center gap-2.5">
        <SmilePlus size={20} className="text-[#00BFA6]" />
        <h1 className="font-display text-xl font-bold">Encuesta de satisfacción</h1>
      </div>
      <p className="mb-6 text-sm text-[#fff]/55">Tu opinión es anónima para el equipo directivo en el agregado y nos ayuda a mejorar. {periodo && <span className="text-[#fff]/40">Periodo {periodo}.</span>}</p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : respondida ? (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6 text-center">
          <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-300" />
          <p className="text-base font-semibold">¡Gracias, {nombre.split(" ")[0]}!</p>
          <p className="mt-1 text-sm text-[#fff]/60">Ya registramos tu respuesta de este periodo. Puedes actualizarla cuando quieras volviendo aquí.</p>
          <button onClick={() => setRespondida(false)} className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/80 hover:bg-white/5">Editar mi respuesta</button>
        </div>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-6">
          <div>
            <p className="mb-3 text-sm font-medium text-[#fff]/80">¿Qué tan a gusto te sientes trabajando en MediaLab?</p>
            <div className="grid grid-cols-5 gap-2">
              {ESCALA.map((op) => (
                <button key={op.valor} type="button" onClick={() => setPuntaje(op.puntaje)} className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-3 transition ${puntaje === op.puntaje ? "border-[#00BFA6]/50 bg-[#00BFA6]/[0.12]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                  <span className="text-2xl">{op.emoji}</span>
                  <span className="text-center text-[10px] leading-tight text-[#fff]/60">{op.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#fff]/80">Del 0 al 10, ¿qué tan probable es que recomiendes trabajar aquí?</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 11 }, (_, n) => (
                <button key={n} type="button" onClick={() => setEnps(n)} className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${enps === n ? "border-[var(--cyan)]/50 bg-[var(--cyan)]/[0.15] text-[var(--cyan)]" : "border-white/10 bg-white/[0.03] text-[#fff]/60 hover:bg-white/[0.06]"}`}>{n}</button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#fff]/80">¿Algo que quieras contarnos? (opcional)</span>
            <textarea rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} className={inputCls} placeholder="Lo que te gusta, lo que mejorarías…" />
          </label>

          <button type="submit" disabled={enviando} className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#00BFA6] px-5 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
            {enviando ? <Loader2 size={14} className="animate-spin" /> : <SmilePlus size={15} />} Enviar mi respuesta
          </button>
        </form>
      )}
    </div>
  )
}
