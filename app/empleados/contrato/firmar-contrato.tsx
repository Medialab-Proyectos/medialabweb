"use client"

import { useRef, useState } from "react"
import { Loader2, Download, Upload, CheckCircle2 } from "lucide-react"

/** Bloque para descargar el contrato generado y subirlo firmado (lo hace el empleado). */
export function FirmarContrato({ id, etiqueta }: { id: string; etiqueta: string }) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function subir(file: File) {
    setError(""); setSubiendo(true)
    try {
      const fd = new FormData(); fd.append("archivo", file)
      const res = await fetch(`/api/empleados/contratos/${id}/firmar`, { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOk(true)
      // Recarga para reflejar el estado activo (rol/beneficios).
      setTimeout(() => window.location.reload(), 900)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir.")
    } finally {
      setSubiendo(false)
    }
  }

  if (ok) {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
        <CheckCircle2 size={15} /> ¡Contrato firmado! Activando tu portal…
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <a
          href={`/api/empleados/contratos/${id}/generado`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/20"
        >
          <Download size={15} /> Descargar {etiqueta}
        </a>
        <input ref={ref} type="file" accept="application/pdf,image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) subir(f); e.target.value = "" }} />
        <button
          onClick={() => ref.current?.click()}
          disabled={subiendo}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--magenta)] px-4 py-2.5 text-sm font-semibold text-[#fff] transition hover:brightness-110 disabled:opacity-60"
        >
          {subiendo ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Subir firmado
        </button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <p className="text-[11px] text-[#fff]/45">Descárgalo, fírmalo (a mano o digital) y súbelo aquí. Hasta entonces el contrato queda pendiente.</p>
    </div>
  )
}
