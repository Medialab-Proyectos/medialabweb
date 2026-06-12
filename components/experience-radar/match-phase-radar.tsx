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
import { Brain, Gauge, Info, Target, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { EmotionalRadarValues } from "@/src/lib/experience-radar/articles"

export interface MatchPhases {
  expectativa: EmotionalRadarValues
  realidad?: EmotionalRadarValues
  percepcion?: EmotionalRadarValues
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
    help: "Señales de celebración, orgullo, pertenencia y ganas de amplificar el momento.",
  },
  {
    key: "confianza",
    es: "Confianza",
    en: "Trust",
    help: "Qué tan claro y estable se siente el relato para las hinchadas.",
  },
  {
    key: "ansiedad",
    es: "Ansiedad",
    en: "Anxiety",
    help: "Necesidad de confirmar qué está pasando: reglas, repeticiones, horarios, decisiones o contexto.",
  },
  {
    key: "frustracion",
    es: "Frustración",
    en: "Frustration",
    help: "Molestia por expectativa incumplida, ambigüedad, rendimiento o decisiones discutidas.",
  },
  {
    key: "incertidumbre",
    es: "Incertidumbre",
    en: "Uncertainty",
    help: "Cuánto le falta a la audiencia para construir una explicación estable del partido.",
  },
  {
    key: "optimismo",
    es: "Optimismo",
    en: "Optimism",
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

function interpretAxis(axis: AxisKey, value: number, phase: RadarViewMode, matchLabel: string): string {
  const level = value >= 75 ? "alto" : value >= 50 ? "medio" : "bajo"
  const moment =
    phase === "expectativa"
      ? "antes del partido"
      : phase === "realidad"
        ? "durante el partido"
        : "después del partido"

  const meanings: Record<AxisKey, Record<string, string>> = {
    euforia: {
      alto: `En ${matchLabel}, la euforia está alta (${value}/100) ${moment} porque predominan señales de celebración, orgullo y pertenencia.`,
      medio: `En ${matchLabel}, la euforia está en punto medio (${value}/100) ${moment} porque hay energía positiva, pero comparte espacio con dudas o cautela.`,
      bajo: `En ${matchLabel}, la euforia está baja (${value}/100) ${moment} porque la conversación se mueve más por tensión o análisis que por celebración.`,
    },
    confianza: {
      alto: `En ${matchLabel}, la confianza se ve alta (${value}/100) ${moment} porque las hinchadas tienen un relato claro para explicar lo que pasa.`,
      medio: `En ${matchLabel}, la confianza está a medias (${value}/100) ${moment} porque el relato existe, pero puede cambiar si aparece una jugada polémica.`,
      bajo: `En ${matchLabel}, la confianza está baja (${value}/100) ${moment} porque las dudas pesan más y la gente busca confirmación antes de cerrar una opinión.`,
    },
    ansiedad: {
      alto: `En ${matchLabel}, la ansiedad está alta (${value}/100) ${moment} porque aparecen más dudas, repeticiones y necesidad de explicación rápida.`,
      medio: `En ${matchLabel}, la ansiedad está contenida (${value}/100) ${moment} porque hay tensión, aunque no define toda la experiencia.`,
      bajo: `En ${matchLabel}, la ansiedad está baja (${value}/100) ${moment} porque la audiencia parece tener menos urgencia por verificar cada detalle.`,
    },
    frustracion: {
      alto: `En ${matchLabel}, la frustración está alta (${value}/100) ${moment} porque el foco se va hacia lo que salió mal, confundió o pareció injusto.`,
      medio: `En ${matchLabel}, la frustración es moderada (${value}/100) ${moment} porque hay molestia, pero todavía convive con otras lecturas.`,
      bajo: `En ${matchLabel}, la frustración está baja (${value}/100) ${moment} porque hay más espacio para una lectura tranquila del partido.`,
    },
    incertidumbre: {
      alto: `En ${matchLabel}, la incertidumbre está alta (${value}/100) ${moment} porque todavía falta una explicación que la mayoría pueda aceptar.`,
      medio: `En ${matchLabel}, la incertidumbre es media (${value}/100) ${moment} porque hay preguntas abiertas, aunque el relato principal se entiende.`,
      bajo: `En ${matchLabel}, la incertidumbre está baja (${value}/100) ${moment} porque la audiencia tiene una lectura más estable de lo ocurrido.`,
    },
    optimismo: {
      alto: `En ${matchLabel}, el optimismo está alto (${value}/100) ${moment} porque la conversación mira hacia continuidad, mejora o revancha positiva.`,
      medio: `En ${matchLabel}, el optimismo es medio (${value}/100) ${moment} porque hay expectativa, pero depende de cómo evolucione el relato.`,
      bajo: `En ${matchLabel}, el optimismo está bajo (${value}/100) ${moment} porque lo que viene se mira con más prudencia que entusiasmo.`,
    },
  }

  return meanings[axis][level]
}

export function MatchPhaseRadar({
  phases,
  status,
  sourceLabels,
  matchLabel,
  interpretations,
  onPhaseChange,
}: {
  phases: MatchPhases
  status: MatchRuntimeStatus
  sourceLabels?: string[]
  matchLabel?: string
  /** Interpretación editorial por fase y categoría (del artículo). Respaldo: texto genérico. */
  interpretations?: MatchInterpretations
  onPhaseChange?: (phase: RadarViewMode) => void
}) {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<RadarViewMode>("expectativa")

  const chartPhases = useMemo(() => PHASES.filter((p) => phases[p.key]), [phases])
  const activePhase = chartPhases.find((p) => p.key === viewMode) ?? chartPhases[0]
  const label = matchLabel ?? "este partido"

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
        const values = phases[p.key]
        if (values) row[p.key] = values[axis.key]
      })
      return row
    })
  }, [chartPhases, phases, t])

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
        return status === "previa"
          ? t("Lectura previa de conversación, señales oficiales y expectativa de las hinchadas.", "Pre-match reading of conversation, official signals and fan expectation.")
          : t("La expectativa con la que las hinchadas llegaron al partido.", "The expectation fans brought into the match.")
      case "realidad":
        return t("Lo que el partido provocó mientras ocurría o justo después de terminar.", "What the match triggered while it unfolded or right after it ended.")
      case "percepcion":
        return t("La forma en que la experiencia queda fijada en el recuerdo colectivo.", "How the experience settles into collective memory.")
    }
  }, [viewMode, status, t])

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-card to-[var(--cyan)]/[0.03] p-5 md:p-7">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">
          <Gauge size={14} /> {t("Radar del partido", "Match radar")}
        </p>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{titleText}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitleText}</p>
      </div>

      {/* En móvil las fases se deslizan horizontalmente (no se apilan). */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PHASES.map((p) => {
          const disabled = !phases[p.key]
          const isActive = viewMode === p.key
          const suffix =
            disabled && p.key === "realidad" && status === "en_vivo"
              ? "En vivo"
              : disabled && p.key === "percepcion"
                ? "Después"
                : undefined

          return (
            <button
              key={p.key}
              onClick={() => !disabled && setViewMode(p.key)}
              disabled={disabled}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "text-white shadow-md"
                  : disabled
                    ? "cursor-not-allowed border border-border bg-muted/50 text-muted-foreground/50"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
              style={isActive ? { backgroundColor: p.color } : undefined}
            >
              <p.icon size={14} />
              {t(p.es, p.en)}
              {suffix && <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px]">{suffix}</span>}
            </button>
          )
        })}
      </div>

      <div className="mt-4 h-[300px] w-full md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="72%" margin={{ top: 16, right: 44, bottom: 12, left: 44 }}>
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

      {activePhase && phases[activePhase.key] && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("Interpretación por categoría", "Category interpretation")}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            {t("Toca una categoría en el radar para resaltar su interpretación.", "Tap a category on the radar to highlight its interpretation.")}
          </p>
          {/* En móvil las tarjetas por categoría se deslizan; en desktop quedan en grilla. */}
          <div className="mt-3 flex items-start gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:items-start sm:overflow-visible">
            {AXES.map((axis) => {
              const value = phases[activePhase.key]?.[axis.key] ?? 0
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
                    {interpretations?.[viewMode]?.[axis.key] ??
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
