"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Clock, Lightbulb, Route, Smartphone, Trophy, Users } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import type { EmotionalRadarValues } from "@/src/lib/experience-radar/articles"
import { TeamFlag } from "./team-flag"
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
}

export interface MatchScoreData {
  home: string
  away: string
  homeGoals: number
  awayGoals: number
  detail?: string
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
}: MatchNoteProps) {
  const [phase, setPhase] = useState<RadarViewMode>("expectativa")
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

  return (
    <>
      <section className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-[var(--cyan)]/[0.06] p-5 shadow-sm dark:border-white/12">
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

      <section className="mt-8">
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

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Users size={20} className="shrink-0 text-[var(--cyan)]" /> {fanSectionTitle}
        </h2>
        {/* En móvil se deslizan como carrusel; en desktop quedan 2-up sin scroll. */}
        <Carousel opts={{ align: "start", dragFree: true }} className="mt-4">
          <CarouselContent className="-ml-3">
            {teamApproach.map((team) => (
              <CarouselItem key={team.team} className="basis-[88%] pl-3 sm:basis-1/2">
                <FanApproachCard team={team} phase={phase} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Mensaje de apoyo como nota al pie, en letra pequeña. */}
        <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground/80">{fanSectionIntro}</p>

        {/* Journey emocional del hincha: se completa al cambiar de fase en la barra. */}
        <FanJourney phases={phases} current={phase} />
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

function FanApproachCard({ team, phase }: { team: TeamApproachData; phase: RadarViewMode }) {
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
          <TeamFlag team={team.team} small />
          Hinchada de {team.team}
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

      {/* Lectura UX / comportamiento digital del momento (patrón observado, no del marcador). */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/70 bg-muted/40 p-2.5">
        <Smartphone size={14} className="mt-0.5 shrink-0 text-[var(--magenta)]" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--magenta)]">UX · uso de dispositivos</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{UX_BEHAVIOR[phase]}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Lectura de experiencia/uso de dispositivos por fase. Son patrones DOCUMENTADOS del
 * consumo de fútbol en digital (no datos inventados de este partido): sirven para mirar
 * el evento con ojos de UX y diseño comportamental.
 */
const UX_BEHAVIOR: Record<RadarViewMode, string> = {
  expectativa:
    "Segunda pantalla activa y móvil primero: buscan horario, alineación y dónde ver. Pico de notificaciones y multitarea entre apps.",
  realidad:
    "En el gol escriben a medias por la euforia (texto cortado, mayúsculas, emojis); molestan los anuncios que tapan la pantalla en móvil y aparecen gestos de zoom para revisar la jugada.",
  percepcion:
    "Circulan clips y memes, vuelven a la repetición y la conversación migra a hilos y stories; la opinión se enfría y se ordena.",
}

/* ── Journey emocional del hincha (Antes · Durante · Predicción) ── */

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

const JOURNEY_STEPS: Array<{ key: RadarViewMode; label: string }> = [
  { key: "expectativa", label: "Antes" },
  { key: "realidad", label: "Durante" },
  { key: "percepcion", label: "Predicción" },
]

function FanJourney({ phases, current }: { phases: MatchPhases; current: RadarViewMode }) {
  const currentIdx = JOURNEY_STEPS.findIndex((s) => s.key === current)
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-white/12">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Route size={14} className="text-[var(--cyan)]" /> Journey emocional del hincha
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {JOURNEY_STEPS.map((step, i) => {
          const dom = dominantEmotion(phases[step.key])
          const isCurrent = step.key === current
          const reached = i <= currentIdx && !!dom
          return (
            <div
              key={step.key}
              className={`rounded-xl border p-3 text-center transition-colors ${
                isCurrent
                  ? "border-[var(--cyan)] bg-[var(--cyan)]/[0.06]"
                  : reached
                    ? "border-[var(--cyan)]/30"
                    : "border-border/60 opacity-70"
              }`}
            >
              <span
                className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  reached ? "bg-[var(--cyan)] text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <p className="mt-1.5 text-[11px] font-semibold">{step.label}</p>
              {dom ? (
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {dom.label} <span className="tabular-nums">{dom.value}</span>
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-muted-foreground/60">—</p>
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-[11px] italic leading-relaxed text-muted-foreground/80">
        Cambia entre Antes · Durante · Predicción en la barra inferior para ver cómo se completa el recorrido emocional.
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
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <Lightbulb size={20} className="shrink-0 text-[var(--cyan)]" /> Lo que hemos aprendido
      </h2>

      {/* Mismo comportamiento que el resto de carruseles: deslizar (swipe), sin flechas. */}
      <Carousel opts={{ align: "start", dragFree: true }} className="mt-4">
        <CarouselContent className="-ml-3">
          {normalized.map((lesson, i) => (
            <CarouselItem key={`${lesson.term}-${i}`} className="basis-[88%] pl-3 sm:basis-1/2 lg:basis-1/3">
              <article className="h-full rounded-xl border border-border bg-card p-4 shadow-sm dark:border-white/12">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#fff] ${
                      lesson.phase === "antes" ? "bg-[var(--cyan)]" : "bg-[var(--magenta)]"
                    }`}
                  >
                    {lesson.phase === "antes" ? "Antes" : "Después"}
                  </span>
                  <p className="text-sm font-bold text-[var(--magenta)]">{lesson.term}</p>
                </div>
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
