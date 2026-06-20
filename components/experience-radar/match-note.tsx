"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Clock,
  Flag,
  Frown,
  Lightbulb,
  Meh,
  Route,
  Smartphone,
  Smile,
  Sparkles,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import type { EmotionalRadarValues } from "@/src/lib/experience-radar/articles"
import { TeamFlag } from "./team-flag"
import { useRadarPhase } from "./radar-phase-context"
import {
  MatchPhaseRadar,
  type MatchPhases,
  type MatchInterpretations,
  type MatchRuntimeStatus,
  type RadarViewMode,
  type TeamPhaseRadar,
} from "./match-phase-radar"

export interface TeamApproachData {
  team: string
  expectedEmotion: string
  dominantConversation: string
  fanConfidence: string
  mainNarrative: string
  howTheyArrived?: string
  whatHappened?: string
  expectationVsReality?: string
  future?: { mood: string; behaviorEffect: string }
  /** Experiencia de usuario vivida ESPECÍFICA de esta hinchada, por etapa (no genérica). */
  userExperience?: { expectativa?: string; realidad?: string; percepcion?: string }
}

export interface MatchScoreData {
  home: string
  away: string
  homeGoals: number
  awayGoals: number
  detail?: string
}

/**
 * Predicción "Antes" de una hinchada heredada de un análisis previo: la proyección que se
 * hizo en otra nota (el partido anterior de esa selección) de cara a ESTE encuentro. Si no
 * existe, la UI cae en la voz de la hinchada (radar de expectativa de esta misma nota).
 */
export interface PriorTeamPrediction {
  emotional: EmotionalRadarValues
  /** Título de la nota previa de donde sale la proyección. */
  fromTitle: string
  /** Slug de la nota previa, para enlazarla. */
  fromSlug: string
}

export interface MatchNoteProps {
  status: MatchRuntimeStatus
  matchScore?: MatchScoreData
  phases: MatchPhases
  block1: { expectativa: string; realidad: string; percepcion: string }
  teamApproach: TeamApproachData[]
  lessons: Array<{ term: string; explanation: string; phase?: "antes" | "despues" }>
  interpretations?: MatchInterpretations
  sourceLabels?: string[]
  teamPhases?: TeamPhaseRadar[]
  /** Predicción "Antes" por equipo, heredada de la nota anterior de esa selección. */
  priorByTeam?: Record<string, PriorTeamPrediction>
}

export function MatchNote({
  status,
  matchScore,
  phases,
  block1,
  teamApproach,
  lessons,
  interpretations,
  sourceLabels,
  teamPhases,
  priorByTeam,
}: MatchNoteProps) {
  const phaseCtx = useRadarPhase()
  const [phase, setPhase] = useState<RadarViewMode>(phaseCtx?.phase ?? "expectativa")
  useEffect(() => {
    if (phaseCtx?.phase) setPhase(phaseCtx.phase)
  }, [phaseCtx?.phase])
  const matchLabel = matchScore
    ? `${matchScore.home} vs ${matchScore.away}`
    : teamApproach.map((team) => team.team).slice(0, 2).join(" vs ")

  const summaryLabel =
    phase === "expectativa"
      ? status === "previa"
        ? "Lo que se espera"
        : "Lo que se esperaba · antes"
      : phase === "percepcion"
        ? "Cómo quedó el recuerdo · después"
        : status === "en_vivo"
          ? "Qué está pasando · en vivo"
          : "Qué pasó en el partido · ahora"

  const summaryText =
    phase === "expectativa"
      ? block1.expectativa
      : phase === "percepcion"
        ? block1.percepcion || block1.realidad
        : block1.realidad

  const fanSectionTitle =
    phase === "expectativa"
      ? "Cómo llegan las hinchadas"
      : phase === "realidad"
        ? "Cómo vivieron el partido las hinchadas"
        : "Cómo llegarán las hinchadas al próximo partido"

  const fanSectionIntro =
    phase === "expectativa"
      ? "Leemos la voz de cada hinchada en redes, tendencias y noticias —no el rendimiento del equipo—: en quién confían, por dónde interactúan y dónde se frustran. Una consumer experience que guía decisiones de producto."
      : phase === "realidad"
        ? "Comparamos lo que cada hinchada esperaba con lo que vivió: dónde confió, dónde se frustró y por qué canales lo expresó."
        : "Con qué ánimo, sesgos y por qué medios llegará cada hinchada al próximo partido. Crece con nuevos cruces y señales."

  // Cuando la nota no trae datos POR EQUIPO (p. ej. una previa analizada), el respaldo
  // rellena ambas tarjetas con el mismo texto compartido. En ese caso se colapsan en una
  // sola lectura ("Ambas hinchadas") para no duplicar; si hay datos distintos, se ven las dos.
  const approachSignature = (a: TeamApproachData) =>
    [a.expectedEmotion, a.dominantConversation, a.fanConfidence, a.mainNarrative, a.howTheyArrived, a.whatHappened, a.expectationVsReality]
      .map((v) => v ?? "")
      .join("|")
  const fanCardsDuplicated =
    teamApproach.length > 1 && new Set(teamApproach.map(approachSignature)).size === 1
  const fanCards = fanCardsDuplicated
    ? [{ team: teamApproach.map((t) => t.team).join(" y "), data: teamApproach[0], combined: true }]
    : teamApproach.map((t) => ({ team: t.team, data: t, combined: false }))

  return (
    <>
      <section id="resumen" className="mt-8 scroll-mt-32 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-[var(--cyan)]/[0.06] p-5 shadow-sm dark:border-white/12">
        {/* Tras un partido finalizado SIEMPRE viene el marcador (placeholder si falta el dato). */}
        {status === "finalizado" &&
          (matchScore ? <Scoreboard score={matchScore} /> : <ScorePending label={matchLabel} />)}
        {status !== "finalizado" && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#f4a261]/40 bg-[#f4a261]/10 p-3 text-xs text-[#c65a10] dark:text-[#f4a261]">
            <Clock size={14} />
            <span className="font-medium">
              {status === "en_vivo"
                ? "Partido en vivo · La realidad y la percepción se consolidarán cuando tengamos suficientes señales."
                : "Partido próximo · La expectativa se actualizará con la realidad y la percepción tras el pitazo final."}
            </span>
          </div>
        )}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--cyan)]">{summaryLabel}</h2>
        <p className="mt-2 leading-relaxed">{summaryText}</p>
        {sourceLabels?.length ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Esta lectura cruza <strong className="text-foreground/80">{sourceLabels.slice(0, 3).join(", ")}</strong> para
            separar marcador, conversación digital y reacción emocional sin convertir la nota en una crónica larga.
          </p>
        ) : null}
      </section>

      <section id="radar" className="mt-8 scroll-mt-32">
        <MatchPhaseRadar
          phases={phases}
          status={status}
          sourceLabels={sourceLabels}
          matchLabel={matchLabel}
          interpretations={interpretations}
          onPhaseChange={setPhase}
          teamPhases={teamPhases}
        />
      </section>

      {/* «Predicción» del menú = Ruta emocional del hincha (más adelante que el radar). */}
      <section id="prediccion" className="mt-8 scroll-mt-32">
        <FanJourney teamPhases={teamPhases} combined={phases} priorByTeam={priorByTeam} />
      </section>

      <section id="hinchadas" className="mt-10 scroll-mt-32">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Users size={20} className="shrink-0 text-[var(--cyan)]" /> {fanSectionTitle}
        </h2>
        {/* En móvil se deslizan como carrusel; en desktop quedan 2-up sin scroll. */}
        <Carousel opts={{ align: "start", dragFree: true }} className="mt-4">
          <CarouselContent className="-ml-3">
            {fanCards.map((card) => (
              <CarouselItem key={card.team} className={`pl-3 ${card.combined ? "basis-full" : "basis-[88%] sm:basis-1/2"}`}>
                <FanApproachCard team={card.data} phase={phase} combinedLabel={card.combined ? card.team : undefined} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Mensaje de apoyo como nota al pie, en letra pequeña. */}
        <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground/80">{fanSectionIntro}</p>
      </section>

      {/* Lo que hemos aprendido — bajo "cómo llegan las hinchadas", sin caja contenedora. */}
      {lessons.length > 0 && <LessonsCarousel lessons={lessons} status={status} />}
    </>
  )
}

/** Marcador pendiente: el partido terminó pero el dato aún no llega del agente. */
function ScorePending({ label }: { label: string }) {
  return (
    <div className="mb-5 border-b border-border pb-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Trophy size={16} className="text-[#F59E0B]" /> Marcador final
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        <strong className="text-foreground">{label}</strong> — nuestro equipo está analizando los datos del partido.
        La lectura completa se habilita apenas confirmemos el resultado oficial.
      </p>
    </div>
  )
}

function Scoreboard({ score }: { score: MatchScoreData }) {
  const homeWins = score.homeGoals > score.awayGoals
  const awayWins = score.awayGoals > score.homeGoals

  return (
    <div className="mb-5 border-b border-border pb-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Trophy size={16} className="text-[#F59E0B]" /> Marcador final
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <ScoreTeam name={score.home} goals={score.homeGoals} isWinner={homeWins} />
        <span className="text-sm font-bold text-muted-foreground/50">vs</span>
        <ScoreTeam name={score.away} goals={score.awayGoals} isWinner={awayWins} />
      </div>
      {score.detail && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          <ScoreDetail detail={score.detail} />
        </p>
      )}
    </div>
  )
}

function ScoreDetail({ detail }: { detail: string }) {
  const [label, rest] = detail.split(":")
  if (!rest) return <>{detail}</>

  const varMatch = rest.match(/^(.*?)(\s*\(.*VAR.*\))$/i)
  return (
    <>
      <strong className="text-foreground">{label.trim()}:</strong>
      <span> {varMatch ? varMatch[1].trim() : rest.trim()}</span>
      {varMatch && <strong className="text-foreground"> {varMatch[2].trim()}</strong>}
    </>
  )
}

function ScoreTeam({
  name,
  goals,
  isWinner,
}: {
  name: string
  goals: number
  isWinner: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <TeamFlag team={name} />
      <p
        className={`w-full break-words text-xs font-bold leading-tight sm:text-sm ${
          isWinner ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {name}
      </p>
      <span
        className={`text-3xl font-black tabular-nums sm:text-4xl ${isWinner ? "text-[var(--cyan)]" : "text-foreground"}`}
      >
        {goals}
      </span>
      {isWinner && <span className="text-[10px] font-semibold uppercase tracking-wide text-[#16A34A]">Ganador</span>}
    </div>
  )
}

function FanApproachCard({
  team,
  phase,
  combinedLabel,
}: {
  team: TeamApproachData
  phase: RadarViewMode
  /** Si las dos hinchadas comparten la misma lectura, se muestra una sola caja con este rótulo. */
  combinedLabel?: string
}) {
  const rows: Array<{ label: string; value?: string }> =
    phase === "expectativa"
      ? [
          { label: "Ánimo esperado", value: team.expectedEmotion },
          { label: "Conversación dominante", value: team.dominantConversation },
          { label: "Confianza de la hinchada", value: team.fanConfidence },
          { label: "Relato principal", value: team.mainNarrative },
        ]
      : phase === "percepcion"
        ? [
            { label: "Ánimo tras el partido", value: team.future?.mood },
            { label: "Cómo llegará la hinchada al próximo", value: team.future?.behaviorEffect },
          ]
        : [
            { label: "Cómo llegó la hinchada", value: team.howTheyArrived },
            { label: "Qué vivió durante el partido", value: team.whatHappened },
            { label: "Expectativa vs realidad", value: team.expectationVsReality },
          ]

  const filled = rows.filter((r) => r.value)

  return (
    <div className="h-full rounded-xl border border-border bg-card p-4 shadow-sm dark:border-white/12">
      <p className="flex items-center justify-between text-sm font-bold">
        <span className="inline-flex items-center gap-2">
          {combinedLabel ? (
            <>
              <Users size={16} className="text-[var(--cyan)]" />
              Ambas hinchadas
            </>
          ) : (
            <>
              <TeamFlag team={team.team} small />
              Hinchada de {team.team}
            </>
          )}
        </span>
        {phase === "percepcion" && <ArrowUpRight size={14} className="text-[var(--magenta)]" />}
      </p>
      <dl className="mt-2 space-y-2.5">
        {filled.map((r) => (
          <div key={r.label}>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--cyan)]">{r.label}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-foreground/80">{r.value}</dd>
          </div>
        ))}
      </dl>
      {/* Experiencia de usuario vivida ESPECÍFICA de esta hinchada y etapa. Solo aparece si
          hay texto propio del país (no genérico): puede salir en una caja y en la otra no, y
          nunca se duplica el mismo texto entre selecciones. */}
      {team.userExperience?.[phase] && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/70 bg-muted/40 p-3">
          <Smartphone size={14} className="mt-0.5 shrink-0 text-[var(--magenta)]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--magenta)]">Experiencia de usuario vivida</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{team.userExperience[phase]}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Ruta emocional del hincha (Antes · Durante · Predicción) ── */

const EMOTION_LABEL: Record<keyof EmotionalRadarValues, string> = {
  euforia: "Euforia",
  confianza: "Confianza",
  ansiedad: "Ansiedad",
  frustracion: "Frustración",
  incertidumbre: "Incertidumbre",
  optimismo: "Optimismo",
}

/** Emoción dominante (la de mayor valor) de una fase, para resumir el momento. */
function dominantEmotion(v?: EmotionalRadarValues): { label: string; value: number } | null {
  if (!v) return null
  const entries = Object.entries(v) as Array<[keyof EmotionalRadarValues, number]>
  const top = entries.sort((a, b) => b[1] - a[1])[0]
  return { label: EMOTION_LABEL[top[0]], value: top[1] }
}

/** Carita según el balance emocional de la fase (positivo / neutro / negativo). */
function moodFace(v?: EmotionalRadarValues): LucideIcon {
  if (!v) return Meh
  const positivo = (v.euforia + v.confianza + v.optimismo) / 3
  const negativo = (v.ansiedad + v.frustracion) / 2
  if (positivo - negativo > 12) return Smile
  if (negativo - positivo > 12) return Frown
  return Meh
}

/**
 * Predicción del hincha para el próximo partido (gana/empata/pierde + %), derivada del
 * ÁNIMO de la fase de percepción (no es una cuota deportiva): optimismo/confianza empujan
 * a "gana", ansiedad/frustración a "pierde", incertidumbre a "empata".
 */
type FanPrediction = {
  label: "Gana" | "Empata" | "Pierde"
  pct: number
  chances: Record<"Gana" | "Empata" | "Pierde", number>
}

function fanPrediction(v?: EmotionalRadarValues): FanPrediction | null {
  if (!v) return null
  const gana = v.optimismo * 0.5 + v.confianza * 0.5
  const pierde = v.frustracion * 0.5 + v.ansiedad * 0.4
  const empata = v.incertidumbre * 0.5 + 25
  const total = gana + pierde + empata || 1
  const ganaPct = Math.round((gana / total) * 100)
  const empataPct = Math.round((empata / total) * 100)
  const pierdePct = Math.max(0, 100 - ganaPct - empataPct)
  const opts: Array<{ label: "Gana" | "Empata" | "Pierde"; pct: number }> = [
    { label: "Gana", pct: ganaPct },
    { label: "Empata", pct: empataPct },
    { label: "Pierde", pct: pierdePct },
  ]
  const top = opts.sort((a, b) => b.pct - a.pct)[0]
  return {
    label: top.label,
    pct: top.pct,
    chances: {
      Gana: opts.find((o) => o.label === "Gana")?.pct ?? 0,
      Empata: opts.find((o) => o.label === "Empata")?.pct ?? 0,
      Pierde: opts.find((o) => o.label === "Pierde")?.pct ?? 0,
    },
  }
}

const JOURNEY_STEPS: Array<{ key: RadarViewMode; label: string }> = [
  { key: "expectativa", label: "Antes" },
  { key: "realidad", label: "Durante" },
  { key: "percepcion", label: "Pronóstico" },
]

const PRED_CLASS: Record<"Gana" | "Empata" | "Pierde", string> = {
  Gana: "bg-[#16A34A]/15 text-[#16A34A]",
  Empata: "bg-[#F59E0B]/15 text-[#B45309] dark:text-[#F59E0B]",
  Pierde: "bg-[#DC2626]/15 text-[#DC2626]",
}

/** Color de cada fase, igual que en el radar (antes / durante / predicción). */
const PHASE_COLOR: Record<RadarViewMode, string> = {
  expectativa: "#14B8A6",
  realidad: "#F97316",
  percepcion: "#8B5CF6",
}

function FanJourney({
  teamPhases,
  combined,
  priorByTeam,
}: {
  teamPhases?: TeamPhaseRadar[]
  combined: MatchPhases
  priorByTeam?: Record<string, PriorTeamPrediction>
}) {
  const ctx = useRadarPhase()

  const current: RadarViewMode = ctx?.phase ?? "expectativa"
  const teams = ctx?.teams ?? teamPhases?.map((t) => t.team) ?? []
  // Equipo activo: del contexto, del primer teamPhase o del primer equipo. Nunca null si hay
  // datos, para que la predicción SIEMPRE diga de qué hinchada habla.
  const selectedTeam = ctx?.team ?? teamPhases?.[0]?.team ?? teams[0] ?? null
  const selected = selectedTeam ? teamPhases?.find((t) => t.team === selectedTeam) : undefined
  const phases = selected?.phases ?? combined
  const opponent = selected?.nextOpponent
  const eliminated = selected?.eliminated ?? false
  const matchRival = selectedTeam ? teams.find((tname) => tname !== selectedTeam) : undefined
  const prediction = fanPrediction(phases.percepcion)
  const currentIdx = JOURNEY_STEPS.findIndex((s) => s.key === current)
  // La predicción (próximo partido) se muestra al elegir «Predicción» en la barra inferior:
  // así no hay un clic extra y la emoción del paso no se pierde dentro de su caja.
  const showPrediction = current === "percepcion" && !!prediction && !!phases.percepcion

  // Predicción «Antes»: nace de un análisis previo (la nota anterior de esta selección, donde
  // ya se proyectó cómo llegaría) o, si no existe, de la voz de la hinchada en esta nota
  // (radar de expectativa). Aparece al elegir «Antes», igual que el pronóstico en «Predicción».
  const prior = selectedTeam ? priorByTeam?.[selectedTeam] : undefined
  const anteEmotional = prior?.emotional ?? phases.expectativa
  const antePrediction = fanPrediction(anteEmotional)
  const showAnte = current === "expectativa" && !!antePrediction && !!phases.expectativa

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-white/12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <Route size={14} className="text-[var(--cyan)]" /> Ruta emocional del hincha
        </p>
        {eliminated && (
          <span className="inline-flex items-center rounded-full bg-[#DC2626]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#DC2626]">
            Eliminada
          </span>
        )}
      </div>
      {/* Selector de país centrado (igual que en la caja del radar): el journey muestra esa hinchada. */}
      {ctx && teams.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          {teams.map((team) => {
            const active = selectedTeam === team
            return (
              <button
                key={team}
                type="button"
                onClick={() => ctx.setTeam(team)}
                aria-pressed={active}
                aria-label={team}
                title={team}
                className={`inline-flex items-center justify-center rounded-full p-0.5 transition-all ${
                  active ? "scale-110 ring-2 ring-[var(--cyan)]" : "opacity-55 grayscale hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <TeamFlag team={team} circle />
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        {JOURNEY_STEPS.map((step, i) => {
          const phaseV = phases[step.key]
          const dom = dominantEmotion(phaseV)
          const isCurrent = step.key === current
          const reached = i <= currentIdx && !!phaseV
          const color = PHASE_COLOR[step.key]
          // Cada paso es un botón: cambia la fase (antes/durante/pronóstico) en el radar y en
          // toda la nota. Se deshabilita si la fase aún no está disponible (p. ej. en previa).
          const disabled = !ctx?.available.includes(step.key)
          const Icon = moodFace(phaseV)
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => ctx?.setPhase(step.key)}
              disabled={disabled}
              aria-pressed={isCurrent}
              title={disabled ? "Disponible cuando avance el partido" : step.label}
              className={`rounded-xl border border-border/60 p-3 text-center transition-all ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-foreground/30 hover:shadow-sm"
              }`}
              style={{
                borderColor: isCurrent ? color : reached ? `${color}66` : undefined,
                backgroundColor: isCurrent ? `${color}14` : undefined,
              }}
            >
              <span
                className="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: reached ? color : "var(--muted)", color: reached ? "#fff" : "var(--muted-foreground)" }}
              >
                <Icon size={16} />
              </span>
              <p className="mt-1.5 text-[11px] font-semibold">{step.label}</p>
              {dom ? (
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {dom.label} <span className="tabular-nums">{dom.value}</span>
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-muted-foreground/60">—</p>
              )}
            </button>
          )
        })}
      </div>

      {showAnte && antePrediction ? (
        // Caja de predicción «Antes»: el pronóstico con el que la hinchada LLEGABA a este
        // partido. Sale de un análisis previo (otra nota) o de la voz de la hinchada.
        <div
          className="mt-3 rounded-xl border p-3"
          style={{ borderColor: `${PHASE_COLOR.expectativa}66`, backgroundColor: `${PHASE_COLOR.expectativa}12` }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: PHASE_COLOR.expectativa }}>
              <Target size={14} aria-hidden /> Predicción · antes
            </p>
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-extrabold ${PRED_CLASS[antePrediction.label]}`}>
              {antePrediction.label} {antePrediction.pct}%
            </span>
          </div>

          <PredictionBreakdown prediction={antePrediction} team={selectedTeam} opponent={matchRival} context="current" />
        </div>
      ) : showPrediction && prediction ? (
        // Caja de predicción: aparece sola al elegir «Predicción» abajo, con bola de cristal.
        <div
          className="mt-3 rounded-xl border p-3"
          style={{ borderColor: `${PHASE_COLOR.percepcion}66`, backgroundColor: `${PHASE_COLOR.percepcion}12` }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: PHASE_COLOR.percepcion }}>
              <Sparkles size={14} aria-hidden /> Predicción
            </p>
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-extrabold ${PRED_CLASS[prediction.label]}`}>
              {prediction.label} {prediction.pct}%
            </span>
          </div>

          <PredictionBreakdown prediction={prediction} team={selectedTeam} opponent={opponent} context="next" />
        </div>
      ) : (
        <p className="mt-3 text-[11px] italic leading-relaxed text-muted-foreground/80">
          Toca una bandera para ver el recorrido de esa hinchada. La predicción con la que llegaba aparece en «Antes» y el
          pronóstico del próximo partido en «Pronóstico», desde la barra de abajo.
        </p>
      )}
      {eliminated && (
        <p className="mt-2 text-[11px] leading-relaxed text-[#DC2626]">
          {selectedTeam ?? "Esta selección"} ya está eliminada del torneo, pero todavía puede cambiar la percepción emocional de su cierre en el próximo partido.
        </p>
      )}
    </div>
  )
}

function PredictionBreakdown({
  prediction,
  team,
  opponent,
  context,
}: {
  prediction: FanPrediction
  team?: string | null
  opponent?: string
  context: "current" | "next"
}) {
  const teamLabel = team ? ` de ${team}` : ""
  const contextText =
    opponent && context === "next"
      ? `Para el próximo partido vs ${opponent}, `
      : opponent
        ? `Para este partido ante ${opponent}, `
        : ""
  return (
    <div className="mt-3 rounded-lg border border-border/70 bg-background/45 p-3">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {contextText}aunque la señal más fuerte es <strong className="text-foreground">{prediction.label.toLowerCase()} {prediction.pct}%</strong>,
        el radar lee tres caminos del ánimo de la hinchada{teamLabel}: ganar{" "}
        <strong className="text-foreground">{prediction.chances.Gana}%</strong>, empatar{" "}
        <strong className="text-foreground">{prediction.chances.Empata}%</strong> y perder{" "}
        <strong className="text-foreground">{prediction.chances.Pierde}%</strong>. No predice el marcador: traduce confianza,
        ansiedad e incertidumbre detectadas en las fuentes.
      </p>
    </div>
  )
}

export function LessonsCarousel({
  lessons,
  status,
}: {
  lessons: Array<{ term: string; explanation: string; phase?: "antes" | "despues" }>
  status: MatchRuntimeStatus
}) {
  const normalized = useMemo(
    () =>
      lessons.map((lesson) => ({
        ...lesson,
        phase: lesson.phase ?? (status === "previa" ? "antes" : "despues"),
      })),
    [lessons, status],
  )

  if (!normalized.length) return null

  return (
    <section id="aprendizajes" className="mt-10 scroll-mt-32">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <Lightbulb size={20} className="shrink-0 text-[var(--cyan)]" /> Lo que hemos aprendido
      </h2>

      {/* Mismo comportamiento que el resto de carruseles: deslizar (swipe), sin flechas. */}
      <Carousel opts={{ align: "start", dragFree: true }} className="mt-4">
        <CarouselContent className="-ml-3">
          {normalized.map((lesson, i) => (
            <CarouselItem key={`${lesson.term}-${i}`} className="basis-[88%] pl-3 sm:basis-1/2 lg:basis-1/3">
              <article className="h-full rounded-xl border border-border bg-card p-4 shadow-sm dark:border-white/12">
                <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--magenta)]">
                  <Lightbulb size={14} className="shrink-0 text-[var(--cyan)]" /> {lesson.term}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lesson.explanation}</p>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Comentario de cierre de la sección, en letra pequeña. */}
      <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground/80">
        Cada sesgo identificado incluye cómo afectó —o mejoró— la experiencia vivida. Biblioteca viva que crece con nuevas señales.
      </p>
    </section>
  )
}
