"use client"

import { useEffect, useState } from "react"
import { Loader2, Radio, ChevronDown } from "lucide-react"
import { ESTADO_ACTUAL_LABEL, type EstadoActual } from "@/lib/empleados/horario"

type Item = { id: string; nombre: string; cargo: string | null; estado: EstadoActual; entrada?: string; salida?: string }
type Panel = { ahora: string; empleados: Item[]; resumen: Record<string, number> }

const TONO: Record<EstadoActual, { dot: string; text: string; bg: string }> = {
  activo: { dot: "#34d399", text: "text-emerald-300", bg: "bg-emerald-400/10" },
  almorzando: { dot: "#fbbf24", text: "text-amber-300", bg: "bg-amber-400/10" },
  permiso: { dot: "#22d3ee", text: "text-cyan-300", bg: "bg-cyan-400/10" },
  vacaciones: { dot: "#a78bfa", text: "text-violet-300", bg: "bg-violet-400/10" },
  fuera_horario: { dot: "#6b7280", text: "text-[#fff]/50", bg: "bg-white/5" },
  no_configurado: { dot: "#6b7280", text: "text-[#fff]/50", bg: "bg-white/5" },
}
const ORDEN: EstadoActual[] = ["activo", "almorzando", "permiso", "vacaciones", "fuera_horario", "no_configurado"]

export function ActividadWidget() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [cargando, setCargando] = useState(true)
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState("")

  async function cargar() {
    try {
      const res = await fetch("/api/empleados/admin/actividad")
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Error"); return }
      setError(""); setPanel(data)
    } finally { setCargando(false) }
  }
  useEffect(() => {
    cargar()
    const t = setInterval(cargar, 60_000) // refresca cada minuto
    return () => clearInterval(t)
  }, [])

  if (cargando) return <div className="mb-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-[#fff]/55"><Loader2 size={15} className="animate-spin" /> Cargando actividad…</div>
  if (error || !panel) return null
  if (panel.empleados.length === 0) return null

  const chip = (est: EstadoActual) => {
    const n = panel.resumen[est] || 0
    if (!n && est !== "activo") return null
    const t = TONO[est]
    return (
      <span key={est} className={`inline-flex items-center gap-1.5 rounded-full ${t.bg} px-2.5 py-1 text-xs font-semibold ${t.text}`}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.dot }} /> {n} {ESTADO_ACTUAL_LABEL[est].toLowerCase()}
      </span>
    )
  }

  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <button onClick={() => setAbierto((v) => !v)} className="flex w-full items-center justify-between gap-3 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#fff]/85">
            <Radio size={15} className="text-emerald-400" /> Quién está activo ahora
          </span>
          <span className="text-xs text-[#fff]/40">· {panel.ahora}</span>
          <div className="flex flex-wrap gap-1.5">{ORDEN.map(chip)}</div>
        </div>
        <ChevronDown size={16} className={`shrink-0 text-[#fff]/40 transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
          {panel.empleados.map((e) => {
            const t = TONO[e.estado]
            return (
              <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: t.dot }} />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#fff]/85">{e.nombre}</p>
                    {e.cargo && <p className="truncate text-[11px] text-[#fff]/40">{e.cargo}</p>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-xs font-semibold ${t.text}`}>{ESTADO_ACTUAL_LABEL[e.estado]}</p>
                  {e.entrada && e.salida && <p className="text-[11px] text-[#fff]/35">{e.entrada}–{e.salida}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
