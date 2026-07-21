"use client"

import { useEffect, useState } from "react"
import { Target, Loader2 } from "lucide-react"

/** Interruptor global (solo CEO) para habilitar/deshabilitar las evaluaciones de desempeño. */
export function EvaluacionesToggle() {
  const [habilitadas, setHabilitadas] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/empleados/admin/empresa-config")
      .then((r) => r.json())
      .then((c) => setHabilitadas(c?.config?.evaluaciones_habilitadas === true))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  async function toggle() {
    setGuardando(true); setError("")
    try {
      const r = await fetch("/api/empleados/admin/empresa-config", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluaciones_habilitadas: !habilitadas }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setHabilitadas(data?.config?.evaluaciones_habilitadas === true)
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setGuardando(false) }
  }

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <Target size={18} className="mt-0.5 shrink-0 text-[#8b5cf6]" />
        <div>
          <p className="text-sm font-semibold text-[#fff]/90">Evaluaciones de desempeño</p>
          <p className="text-xs text-[#fff]/55">
            {cargando ? "Cargando…" : habilitadas
              ? "Habilitadas: los líderes pueden evaluar y los empleados ven sus resultados."
              : "Deshabilitadas: nadie ve ni realiza evaluaciones hasta que las actives."}
          </p>
          {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
        </div>
      </div>
      <button
        onClick={toggle}
        disabled={cargando || guardando}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${habilitadas ? "border border-white/15 text-[#fff]/80 hover:bg-white/5" : "bg-[#8b5cf6] text-[#0d0a1a] hover:brightness-110"}`}
      >
        {guardando ? <Loader2 size={14} className="animate-spin" /> : null}
        {habilitadas ? "Desactivar" : "Activar"}
      </button>
    </div>
  )
}
