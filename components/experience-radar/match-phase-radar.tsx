"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts"
import {
  Activity,
  Brain,
  Frown,
  Gauge,
  HelpCircle,
  Info,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { EmotionalRadarValues } from "@/src/lib/experience-radar/articles"
import { useRadarPhase } from "./radar-phase-context"
import { TeamFlag } from "./team-flag"

export interface MatchPhases {
  expectativa: EmotionalRadarValues
  realidad?: EmotionalRadarValues
  percepcion?: EmotionalRadarValues
}

/** Radar emocional por fase de UNA hinchada, para el filtro de banderas del radar. */
export interface TeamPhaseRadar {
  team: string
  phases: MatchPhases
}

export type RadarViewMode = "expectativa" | "realidad" | "percepcion"
export type MatchRuntimeStatus = "previa" | "en_vivo" | "finalizado"

const PHASES = [
  { key: "expectativa", color: "#14B8A6", es: "Expectativa", en: "Expectation", icon: Target },
  { key: "realidad", color: "#F97316", es: "Realidad", en: "Reality", icon: Zap },
  { key: "percepcion", color: "#8B5CF6", es: "Percepción", en: "Perception", icon: Brain },
] as const

const AXES = [
  {
    key: "euforia",
    es: "Euforia",
    en: "Euphoria",
    icon: PartyPopper,
    help: "Señales de celebración, orgullo, pertenencia y ganas de amplificar el momento.",
  },
  {
    key: "confianza",
    es: "Confianza",
    en: "Trust",
    icon: ShieldCheck,
    help: "Qué tan claro y estable se siente el relato para las hinchadas.",
  },
  {
    key: "ansiedad",
    es: "Ansiedad",
    en: "Anxiety",
    icon: Activity,
    help: "Necesidad de confirmar qué está pasando: reglas, repeticiones, horarios, decisiones o contexto.",
  },
  {
    key: "frustracion",
    es: "Frustración",
    en: "Frustration",
    icon: Frown,
    help: "Molestia por expectativa incumplida, ambigüedad, rendimiento o decisiones discutidas.",
  },
  {
    key: "incertidumbre",
    es: "Incertidumbre",
    en: "Uncertainty",
    icon: HelpCircle,
    help: "Cuánto le falta a la audiencia para construir una explicación estable del partido.",
  },
  {
    key: "optimismo",
    es: "Optimismo",
    en: "Optimism",
    icon: Sparkles,
    help: "Cómo se proyecta lo que viene: continuidad, mejora, revancha o prudencia.",
  },
] as const

type AxisKey = (typeof AXES)[number]["key"]

/** Interpretación editorial por fase → categoría. La escribe el agente con datos reales. */
export type MatchInterpretations = Partial<Record<RadarViewMode, Partial<Record<AxisKey, string>>>>

function WrappedTick(props: {
  x?: number
  y?: number
  textAnchor?: string
  payload?: { value?: string }
  onSelect?: (label: string) => void
  activeLabel?: string | null
}) {
  const { x = 0, y = 0, textAnchor = "middle", payload, onSelect, activeLabel } = props
  const anchor = textAnchor as "start" | "middle" | "end"
  const value = String(payload?.value ?? "")
  const lines = value.length > 9 ? splitTwo(value) : [value]
  const help = axisHelpForLabel(value)
  const isActive = !!activeLabel && value === activeLabel
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={isActive ? "var(--cyan)" : "var(--muted-foreground)"}
      fontSize={11}
      fontWeight={isActive ? 700 : 400}
      style={{ cursor: onSelect ? "pointer" : "help" }}
      onClick={onSelect ? () => onSelect(value) : undefined}
    >
      {help && <title>{help}</title>}
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? (lines.length > 1 ? "-0.2em" : "0.32em") : "1.1em"}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

function axisHelpForLabel(value: string): string | undefined {
  const normalized = value.toLowerCase()
  return AXES.find((axis) => axis.es.toLowerCase() === normalized || axis.en.toLowerCase() === normalized)?.help
}

function splitTwo(value: string): string[] {
  const mid = Math.ceil(value.length / 2)
  const spaceIdx = value.lastIndexOf(" ", mid)
  if (spaceIdx > 0) return [value.slice(0, spaceIdx), value.slice(spaceIdx + 1)]
  return [value]
}

/** Nombre del eje con artículo, para frases naturales. */
const AXIS_NOUN: Record<AxisKey, string> = {
  euforia: "la euforia",
  confianza: "la confianza",
  ansiedad: "la ansiedad",
  frustracion: "la frustración",
  incertidumbre: "la incertidumbre",
  optimismo: "el optimismo",
}

/**
 * Interpretación breve y FIEL al valor: explica qué sintió la hinchada y por qué, leído de
 * su reacción en redes. Pensada para lectura rápida; los valores bajos describen lo negativo
 * (p. ej. una goleada en contra → euforia baja = tristeza), no lo positivo.
 */
function interpretAxis(axis: AxisKey, value: number, phase: RadarViewMode, matchLabel: string): string {
  const level: "alta" | "media" | "baja" = value >= 65 ? "alta" : value >= 40 ? "media" : "baja"
  const moment =
    phase === "expectativa"
      ? "antes del partido"
      : phase === "realidad"
        ? "durante el partido"
        : "después del partido"

  const why: Record<AxisKey, Record<"alta" | "media" | "baja", string>> = {
    euforia: {
      alta: "explotó la celebración: oleada de publicaciones, emojis y videos compartidos.",
      media: "hubo festejo, pero medido y mezclado con cautela.",
      baja: "casi no se celebró: predominaron mensajes de bronca o el silencio.",
    },
    confianza: {
      alta: "la hinchada defendía un relato claro y respondía segura a las críticas.",
      media: "el relato se sostenía, pero temblaba con cada jugada.",
      baja: "muchas dudas: la gente buscaba explicaciones antes de opinar.",
    },
    ansiedad: {
      alta: "consultas en vivo constantes: «¿cómo va?», repeticiones y verificación jugada a jugada.",
      media: "tensión presente, sin tomarse toda la conversación.",
      baja: "se siguió el partido con calma, sin urgencia por confirmar.",
    },
    frustracion: {
      alta: "la conversación se cargó de quejas por lo que salió mal o pareció injusto.",
      media: "molestia puntual, mezclada con otras lecturas.",
      baja: "pocas quejas; el tono general fue tranquilo.",
    },
    incertidumbre: {
      alta: "nadie cerraba una explicación común: relatos en disputa.",
      media: "quedaban dudas, aunque el relato principal se entendía.",
      baja: "lectura ya estable y compartida de lo ocurrido.",
    },
    optimismo: {
      alta: "la conversación miró al próximo partido con ilusión y revancha.",
      media: "expectativa prudente, condicionada a lo que venga.",
      baja: "lo que viene se miró con desánimo o resignación.",
    },
  }

  const noun = `${AXIS_NOUN[axis][0].toUpperCase()}${AXIS_NOUN[axis].slice(1)}`
  return `${noun} fue ${level} ${moment}: ${why[axis][level]}`
}

export function MatchPhaseRadar({
  phases,
  status,
  sourceLabels,
  matchLabel,
  interpretations,
  onPhaseChange,
  teamPhases,
}: {
  phases: MatchPhases
  status: MatchRuntimeStatus
  sourceLabels?: string[]
  matchLabel?: string
  /** Interpretación editorial por fase y categoría (del artículo). Respaldo: texto genérico. */
  interpretations?: MatchInterpretations
  onPhaseChange?: (phase: RadarViewMode) => void
  /** Radar por hinchada para el filtro de banderas (Ambas / selección A / selección B). */
  teamPhases?: TeamPhaseRadar[]
}) {
  const { t } = useLanguage()
  // La fase la controla la barra inferior de la nota (contexto compartido). Sin contexto
  // (otras páginas) muestra la expectativa por defecto.
  const phaseCtx = useRadarPhase()
  const viewMode: RadarViewMode = phaseCtx?.phase ?? "expectativa"

  // Filtro de banderas: por defecto la primera hinchada. Al tocar una bandera, el radar
  // muestra la lectura de ESA hinchada (cae a la combinada si falta su dato).
  const teamOptions = teamPhases ?? []
  const [teamFilter, setTeamFilter] = useState<string | null>(teamOptions[0]?.team ?? null)
  const activePhases = useMemo<MatchPhases>(() => {
    if (!teamFilter) return phases
    const tp = teamOptions.find((t) => t.team === teamFilter)?.phases
    return tp ?? phases
  }, [teamFilter, teamOptions, phases])

  // La disponibilidad de fases (botones) usa la lectura combinada; los valores usan
  // la lectura activa (combinada o por hinchada).
  const chartPhases = useMemo(() => PHASES.filter((p) => phases[p.key]), [phases])
  const activePhase = chartPhases.find((p) => p.key === viewMode) ?? chartPhases[0]
  const label = teamFilter ? `la hinchada de ${teamFilter}` : matchLabel ?? "este partido"

  // Categoría seleccionada al tocar un eje del radar: resalta y desplaza su tarjeta.
  const [activeAxis, setActiveAxis] = useState<AxisKey | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const labelToKey = useMemo(() => {
    const map: Record<string, AxisKey> = {}
    AXES.forEach((a) => {
      map[t(a.es, a.en)] = a.key
    })
    return map
  }, [t])
  const activeLabel = useMemo(() => {
    const a = AXES.find((x) => x.key === activeAxis)
    return a ? t(a.es, a.en) : null
  }, [activeAxis, t])
  const selectAxis = (clickedLabel: string) => {
    const key = labelToKey[clickedLabel]
    if (!key) return
    setActiveAxis(key)
    requestAnimationFrame(() => {
      cardRefs.current[key]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    })
  }

  useEffect(() => {
    onPhaseChange?.(viewMode)
  }, [viewMode, onPhaseChange])

  const chartData = useMemo(() => {
    return AXES.map((axis) => {
      const row: Record<string, string | number> = { k: t(axis.es, axis.en) }
      chartPhases.forEach((p) => {
        const values = activePhases[p.key]
        if (values) row[p.key] = values[axis.key]
      })
      return row
    })
  }, [chartPhases, activePhases, t])

  const titleText = useMemo(() => {
    switch (viewMode) {
      case "expectativa":
        return status === "previa"
          ? t("Lo que se espera antes del partido", "What is expected before the match")
          : t("Qué se esperaba antes del partido", "What was expected before the match")
      case "realidad":
        return status === "en_vivo"
          ? t("Realidad en vivo del partido", "Live match reality")
          : t("Qué pasó realmente en el partido", "What actually happened in the match")
      case "percepcion":
        return t("Cómo quedó el recuerdo después del partido", "How the match is remembered after it ended")
    }
  }, [viewMode, status, t])

  const subtitleText = useMemo(() => {
    switch (viewMode) {
      case "expectativa":
        return t(
          "Antes del partido: con qué ánimo llega cada hinchada, según su conversación en redes y noticias.",
          "Before the match: the mood each fanbase brings in, from their conversation on social media and news.",
        )
      case "realidad":
        return t(
          "Durante el partido: qué sintió cada hinchada y por qué, leído de su reacción real en redes.",
          "During the match: what each fanbase felt and why, read from their real reaction on social media.",
        )
      case "percepcion":
        return t(
          "Después del partido: cómo quedó el recuerdo y con qué ánimo va al próximo, según lo que escriben.",
          "After the match: how the memory settles and the mood heading into the next one, from what fans write.",
        )
    }
  }, [viewMode, t])

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-card to-[var(--cyan)]/[0.03] p-5 shadow-sm dark:border-white/12 md:p-7">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">
          <Gauge size={14} /> {t("Radar del partido", "Match radar")}
        </p>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{titleText}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitleText}</p>
      </div>

      {/* Banderas de las 2 hinchadas (círculos de selección) ARRIBA de la gráfica: tocar
          una cambia el radar a la lectura de esa hinchada. Las fases van en la barra inferior. */}
      {teamOptions.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          {teamOptions.map((opt) => {
            const isActive = teamFilter === opt.team
            return (
              <button
                key={opt.team}
                type="button"
                onClick={() => setTeamFilter(opt.team)}
                aria-pressed={isActive}
                aria-label={opt.team}
                title={opt.team}
                className={`inline-flex items-center justify-center rounded-full p-0.5 transition-all ${
                  isActive
                    ? "scale-110 ring-2 ring-[var(--cyan)] ring-offset-2 ring-offset-card"
                    : "opacity-55 grayscale hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <TeamFlag team={opt.team} circle />
              </button>
            )
          })}
        </div>
      )}

      {/* Alto reducido para evitar el exceso de espacio en responsive. */}
      <div className="mt-2 h-[240px] w-full md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="82%" margin={{ top: 4, right: 44, bottom: 2, left: 44 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="k" tick={<WrappedTick onSelect={selectAxis} activeLabel={activeLabel} />} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label: axisLabel }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-xl">
                    <p className="font-semibold">{axisLabel}</p>
                    <div className="mt-1 grid gap-1">
                      {payload.map((item) => (
                        <p key={String(item.dataKey)} className="flex items-center justify-between gap-5">
                          <span style={{ color: item.color }}>{item.name}</span>
                          <strong className="tabular-nums">{Number(item.value)}/100</strong>
                        </p>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
            {chartPhases.map((p) => {
              const isActive = viewMode === p.key
              return (
                <Radar
                  key={p.key}
                  name={t(p.es, p.en)}
                  dataKey={p.key}
                  stroke={p.color}
                  fill={p.color}
                  fillOpacity={isActive ? 0.26 : 0.025}
                  strokeOpacity={isActive ? 1 : 0.28}
                  strokeWidth={isActive ? 3 : 2}
                />
              )
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {activePhase && activePhases[activePhase.key] && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("Interpretación por categoría", "Category interpretation")}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            {t(
              "Cada categoría se interpreta desde la voz de los fanáticos en redes, tendencias y noticias, y su experiencia digital usando plataformas. Toca una para resaltar su lectura.",
              "Each category is read from the voice of fans on social media, trends and news, and their digital experience using platforms. Tap one to highlight its reading.",
            )}
          </p>
          {/* En móvil las tarjetas por categoría se deslizan; en desktop quedan en grilla. */}
          <div className="mt-3 flex items-start gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:items-start sm:overflow-visible">
            {AXES.map((axis) => {
              const value = activePhases[activePhase.key]?.[axis.key] ?? 0
              const isActive = activeAxis === axis.key
              return (
                <div
                  key={axis.key}
                  ref={(el) => {
                    cardRefs.current[axis.key] = el
                  }}
                  className={`w-[82%] shrink-0 rounded-lg border p-4 transition-colors sm:w-auto ${
                    isActive
                      ? "border-[var(--cyan)] bg-[var(--cyan)]/[0.05] ring-1 ring-[var(--cyan)]/40"
                      : "border-border/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      <axis.icon size={15} style={{ color: activePhase.color }} className="shrink-0" />
                      {t(axis.es, axis.en)}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]"
                            aria-label={`${t(axis.es, axis.en)}: ${axis.help}`}
                          >
                            <Info size={13} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={6} className="max-w-64 border border-border bg-popover leading-relaxed text-popover-foreground">
                          {axis.help}
                        </TooltipContent>
                      </Tooltip>
                    </p>
                    <span className="text-sm font-black tabular-nums" style={{ color: activePhase.color }}>
                      {value}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {/* Con una hinchada seleccionada, la lectura sale del valor mostrado (fiel a
                        su radar). Sin filtro, usa la interpretación editorial combinada de la nota. */}
                    {teamFilter
                      ? interpretAxis(axis.key, Number(value), viewMode, label)
                      : interpretations?.[viewMode]?.[axis.key] ??
                        interpretAxis(axis.key, Number(value), viewMode, label)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {chartPhases.map((p) => (
          <span
            key={p.key}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-opacity ${
              viewMode !== p.key ? "opacity-40" : ""
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            {t(p.es, p.en)}
          </span>
        ))}
      </div>
    </div>
  )
}
