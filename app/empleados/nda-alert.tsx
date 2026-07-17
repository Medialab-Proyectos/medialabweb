"use client"

import { useEffect, useRef, useState } from "react"
import { ShieldAlert, Download, Upload, Loader2 } from "lucide-react"

export function NdaAlert() {
  const [firmado, setFirmado] = useState<boolean | null>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function cargar() {
    try {
      const res = await fetch("/api/empleados/nda")
      const data = await res.json()
      if (res.ok) setFirmado(!!data.firmado)
      else setFirmado(false)
    } catch { setFirmado(false) }
  }
  useEffect(() => { cargar() }, [])

  async function subir(file: File) {
    setSubiendo(true); setError("")
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetch("/api/empleados/nda/firmar", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFirmado(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir.")
    } finally { setSubiendo(false) }
  }

  if (firmado === null || firmado) return null // aún cargando o ya firmado: no molesta

  return (
    <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/[0.07] p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15"><ShieldAlert size={20} className="text-amber-300" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-100">Firma tu Acuerdo de Confidencialidad y No Divulgación</p>
          <p className="mt-0.5 text-xs text-amber-200/80">Descárgalo, fírmalo y súbelo firmado. Es obligatorio para todos los colaboradores.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/api/empleados/nda/generado" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/20">
              <Download size={14} /> Descargar acuerdo
            </a>
            <button onClick={() => fileRef.current?.click()} disabled={subiendo} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-[#1a1205] transition hover:brightness-110 disabled:opacity-60">
              {subiendo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Subir firmado
            </button>
            <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) subir(f); e.target.value = "" }} />
          </div>
          {error && <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  )
}
