"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Clock, Lightbulb, Trophy, Users } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
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
      ? "Leemos la voz de cada hinchada en redes sociales, tendencias y portales de noticias, y su experiencia digital usando plataformas: en quién confían para juzgar la alineación, por qué medios interactúan y seguirán interactuando, sus agujeros y frustraciones digitales. Es una consumer experience digital que permite tomar decisiones de producto, no una lectura del rendimiento del equipo."
      : phase === "realidad"
        ? "Comparamos lo que cada hinchada esperaba con lo que vivió, según su conversación en redes, tendencias y noticias y su uso de plataformas durante el partido: dónde confió, dónde se frustró y por qué canales lo expresó."
        : "La percepción posterior indica con qué ánimo, sesgos y conversación colectiva —y por qué medios digitales— llegará cada hinchada al siguiente partido. Este bloque crece cuando aparecen nuevos cruces o señales posteriores."

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
        <strong className="text-foreground">{label}</strong> — marcador por confirmar. La nota se actualiza en cuanto
        el agente verifica el resultado oficial.
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
        Biblioteca viva de aprendizajes. Crece con nuevas señales y diferencia cada hallazgo por el momento en que aparece.
      </p>
    </section>
  )
}
