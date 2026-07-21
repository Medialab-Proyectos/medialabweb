"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Radio, CircleCheck, Utensils, CalendarClock, Plane, Moon, CircleHelp, RefreshCw, ChevronDown } from "lucide-react"
import { type EstadoActual } from "@/lib/empleados/horario"

type DiaKey = "lun" | "mar" | "mie" | "jue" | "vie"
type DiaHorario = { activo: boolean; entrada: string; salida: string; almuerzoInicio: string; almuerzoFin: string }
type Item = {
  id: string; nombre: string; cargo: string | null; estado: EstadoActual
  entrada?: string; salida?: string
  horario?: Record<DiaKey, DiaHorario> | null; semana?: "A" | "B"; alterna?: boolean
}
type Panel = { ahora: string; empleados: Item[]; resumen: Record<string, number> }

const DIAS: DiaKey[] = ["lun", "mar", "mie", "jue", "vie"]
const DIA_CORTO: Record<DiaKey, string> = { lun: "Lunes", mar: "Martes", mie: "Miércoles", jue: "Jueves", vie: "Viernes" }
/** Día de hoy en Bogotá (para resaltarlo dentro del horario desplegado). */
function diaBogota(): DiaKey | null {
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: "America/Bogota", weekday: "short" }).format(new Date())
  return ({ Mon: "lun", Tue: "mar", Wed: "mie", Thu: "jue", Fri: "vie" } as Record<string, DiaKey>)[wd] ?? null
}

// Etiqueta clara + icono + color por estado (para que el CEO lea de un vistazo quién está).
const META: Record<EstadoActual, { label: string; Icon: typeof Radio; color: string }> = {
  activo: { label: "Disponible", Icon: CircleCheck, color: "#34d399" },
  almorzando: { label: "En almuerzo", Icon: Utensils, color: "#fbbf24" },
  permiso: { label: "En permiso / evento", Icon: CalendarClock, color: "#22d3ee" },
  vacaciones: { label: "En vacaciones", Icon: Plane, color: "#a78bfa" },
  fuera_horario: { label: "Fuera de horario", Icon: Moon, color: "#94a3b8" },
  no_configurado: { label: "Sin horario", Icon: CircleHelp, color: "#94a3b8" },
}

type Filtro = "disponibles" | "no_disponibles" | "todos"
const NO_DISP: EstadoActual[] = ["almorzando", "permiso", "vacaciones", "fuera_horario", "no_configurado"]

export function ActividadWidget() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>("disponibles")
  const [error, setError] = useState("")
  const [abierto, setAbierto] = useState<string | null>(null) // empleado con su horario desplegado
  const diaHoy = diaBogota()

  async function cargar() {
    try {
      const res = await fetch(`/api/empleados/admin/actividad?t=${Date.now()}`, { cache: "no-store" })
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

  const disponibles = panel?.resumen.activo || 0
  const total = panel?.empleados.length || 0
  const noDisp = total - disponibles

  const lista = useMemo(() => {
    if (!panel) return []
    if (filtro === "todos") return panel.empleados
    if (filtro === "disponibles") return panel.empleados.filter((e) => e.estado === "activo")
    return panel.empleados.filter((e) => NO_DISP.includes(e.estado))
  }, [panel, filtro])

  if (cargando) return <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-[#fff]/55"><Loader2 size={15} className="animate-spin" /> Cargando actividad…</div>

  // Ante error o sin datos, NO se oculta: se muestra el encabezado con un mensaje (para el CEO
  // siempre visible "quién está activo hoy").
  if (error || !panel || total === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#fff]/85">
          <Radio size={15} className="text-emerald-400" /> Actividad ahora
        </span>
        <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-4 py-6 text-center text-sm text-[#fff]/45">
          {error ? "No se pudo cargar la actividad ahora mismo. Reintentando…" : "Aún no hay empleados con horario para mostrar. Registra y aprueba horarios para ver quién está activo."}
        </p>
      </section>
    )
  }

  const tabs: [Filtro, string, number][] = [
    ["disponibles", "Disponibles", disponibles],
    ["no_disponibles", "No disponibles", noDisp],
    ["todos", "Todos", total],
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#fff]/85">
          <Radio size={15} className="text-emerald-400" /> Actividad ahora
          <span className="ml-1 font-normal text-[#fff]/40">· {panel.ahora}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            <CircleCheck size={13} /> {disponibles} de {total} disponibles
          </span>
          <button onClick={() => cargar()} className="rounded-lg border border-white/10 p-1.5 text-[#fff]/50 hover:bg-white/5 hover:text-[#fff]/80" title="Actualizar ahora"><RefreshCw size={13} /></button>
        </div>
      </div>

      {/* Filtro dentro de la cajita */}
      <div className="mb-3 inline-flex rounded-lg border border-white/10 bg-black/20 p-0.5 text-xs">
        {tabs.map(([key, label, n]) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${filtro === key ? "bg-[var(--cyan)]/15 text-[var(--cyan)]" : "text-[#fff]/50 hover:text-[#fff]/80"}`}
          >
            {label} <span className="opacity-60">{n}</span>
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="rounded-lg border border-white/[0.06] bg-black/20 px-4 py-6 text-center text-sm text-[#fff]/45">
          {filtro === "disponibles" ? "Nadie disponible en este momento." : "Sin empleados en este filtro."}
        </p>
      ) : (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {lista.map((e) => {
            const m = META[e.estado]
            const desplegado = abierto === e.id
            const tieneHorario = !!e.horario
            return (
              <div key={e.id} className="min-w-0 rounded-lg border border-white/[0.06] bg-black/20">
                <button
                  onClick={() => setAbierto(desplegado ? null : e.id)}
                  disabled={!tieneHorario}
                  aria-expanded={desplegado}
                  className="flex w-full min-w-0 items-center justify-between gap-2 px-3 py-2 text-left transition enabled:hover:bg-white/[0.03] disabled:cursor-default"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    <m.Icon size={16} className="shrink-0" style={{ color: m.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-[#fff]/85">{e.nombre}</span>
                      {e.cargo && <span className="block truncate text-[11px] text-[#fff]/40">{e.cargo}</span>}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="text-right">
                      <span className="block text-xs font-semibold" style={{ color: m.color }}>{m.label}</span>
                      {e.entrada && e.salida && <span className="block text-[11px] text-[#fff]/35">{e.entrada}–{e.salida}</span>}
                    </span>
                    {tieneHorario && <ChevronDown size={14} className={`text-[#fff]/35 transition ${desplegado ? "rotate-180" : ""}`} />}
                  </span>
                </button>

                {/* Horario aprobado que rige esta semana (incluye almuerzo). */}
                {desplegado && e.horario && (
                  <div className="border-t border-white/[0.06] px-3 py-2">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/40">
                      Horario aprobado{e.alterna ? ` · Semana ${e.semana ?? "A"}` : ""}
                    </p>
                    <div className="flex flex-col gap-1">
                      {DIAS.map((d) => {
                        const day = e.horario![d]
                        const hoy = d === diaHoy
                        return (
                          <div key={d} className={`flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-[11px] ${hoy ? "text-[#fff]/85" : "text-[#fff]/50"}`}>
                            <span className={hoy ? "font-semibold" : ""}>{DIA_CORTO[d]}{hoy ? " · hoy" : ""}</span>
                            {day?.activo ? (
                              <span className="text-right">
                                {day.entrada}–{day.salida}
                                {day.almuerzoInicio && day.almuerzoFin
                                  ? <span className="text-amber-300/70"> · almuerzo {day.almuerzoInicio}–{day.almuerzoFin}</span>
                                  : <span className="text-[#fff]/30"> · sin almuerzo</span>}
                              </span>
                            ) : (
                              <span className="text-[#fff]/30">No labora</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
