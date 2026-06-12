"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Lightbulb, Trophy, Users } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  MatchPhaseRadar,
  type MatchPhases,
  type MatchRuntimeStatus,
  type RadarViewMode,
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
  sourceLabels?: string[]
}

export function MatchNote({
  status,
  matchScore,
  phases,
  block1,
  teamApproach,
  lessons,
  sourceLabels,
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
      ? "No leemos el rendimiento del equipo: leemos el ánimo con el que cada hinchada entra al partido, su conversación dominante y el nivel de confianza que proyecta."
      : phase === "realidad"
        ? "La comparación muestra qué esperaba cada hinchada y qué terminó viviendo cuando el partido puso a prueba ese relato."
        : "La percepción posterior indica con qué ánimo, sesgos y conversación colectiva llegará cada hinchada al siguiente partido. Este bloque crecerá cuando existan nuevos cruces o señales posteriores."

  return (
    <>
      <section className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-[var(--cyan)]/[0.06] p-5">
        {status === "finalizado" && matchScore && <Scoreboard score={matchScore} />}
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
          onPhaseChange={setPhase}
        />
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-[var(--magenta)]/[0.05] to-transparent p-5 md:p-6">
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

      {lessons.length > 0 && <LessonsCarousel lessons={lessons} status={status} />}
    </>
  )
}

function Scoreboard({ score }: { score: MatchScoreData }) {
  const homeWins = score.homeGoals > score.awayGoals
  const awayWins = score.awayGoals > score.homeGoals

  return (
    <div className="mb-4 rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Trophy size={18} className="text-[#F59E0B]" />
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Marcador final</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3">
        <ScoreTeam name={score.home} goals={score.homeGoals} isWinner={homeWins} />
        <span className="flex items-center justify-center text-sm font-bold text-muted-foreground">vs</span>
        <ScoreTeam name={score.away} goals={score.awayGoals} isWinner={awayWins} />
      </div>
      {score.detail && (
        <p className="mt-3 rounded-lg border border-border bg-card px-3 py-2 text-xs leading-relaxed text-muted-foreground">
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
    <div
      className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border p-3 text-center ${
        isWinner
          ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-foreground"
          : "border-border bg-card text-muted-foreground"
      }`}
    >
      <TeamFlag team={name} />
      <p className="w-full break-words text-xs font-bold leading-tight sm:text-sm">{name}</p>
      <span className="text-2xl font-black tabular-nums text-foreground sm:text-3xl">{goals}</span>
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
    <div className="h-full rounded-xl border border-border bg-card p-4">
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

function TeamFlag({ team, small = false }: { team: string; small?: boolean }) {
  const code = teamFlagCode(team)
  const size = small ? "h-4 w-6" : "h-6 w-9"
  if (!code) {
    return (
      <span className={`${size} inline-flex shrink-0 items-center justify-center rounded-[3px] border border-border bg-muted text-[9px] font-bold uppercase text-muted-foreground`}>
        {team.slice(0, 2)}
      </span>
    )
  }
  // flagcdn vía <img>: confiable en Vercel/móvil, sin depender del CSS de flag-icons.
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`Bandera de ${team}`}
      className={`${size} shrink-0 rounded-[3px] object-cover shadow-sm`}
      loading="lazy"
    />
  )
}

function teamFlagCode(value: string): string | undefined {
  const key = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
  return {
    mexico: "mx",
    sudafrica: "za",
    southafrica: "za",
    brasil: "br",
    brazil: "br",
    marruecos: "ma",
    morocco: "ma",
    estadosunidos: "us",
    usa: "us",
    canada: "ca",
    argentina: "ar",
    colombia: "co",
    espana: "es",
    spain: "es",
    france: "fr",
    francia: "fr",
  }[key]
}

function LessonsCarousel({
  lessons,
  status,
}: {
  lessons: Array<{ term: string; explanation: string; phase?: "antes" | "despues" }>
  status: MatchRuntimeStatus
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)

  const normalized = useMemo(
    () =>
      lessons.map((lesson) => ({
        ...lesson,
        phase: lesson.phase ?? (status === "previa" ? "antes" : "despues"),
      })),
    [lessons, status],
  )

  useEffect(() => {
    if (!api) return

    const updateIndex = () => setIndex(api.selectedScrollSnap())
    updateIndex()
    api.on("select", updateIndex)
    api.on("reInit", updateIndex)

    return () => {
      api.off("select", updateIndex)
      api.off("reInit", updateIndex)
    }
  }, [api])

  return (
    <section className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-[#E8751A]/[0.05] to-transparent p-5 md:p-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Lightbulb size={20} className="shrink-0 text-[var(--cyan)]" /> Lo que hemos aprendido
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Biblioteca viva de aprendizajes. Crece con nuevas señales y diferencia cada hallazgo por el momento en que aparece.
        </p>
      </div>

      <div className="relative mt-4">
        {normalized.length ? (
          <>
            <Carousel
              opts={{ align: "start", dragFree: true, loop: normalized.length > 1 }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {normalized.map((lesson, cardIndex) => (
                  <CarouselItem
                    key={`${lesson.term}-${cardIndex}`}
                    className="pl-3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <article
                      className="h-full min-h-[170px] rounded-xl border border-border bg-card p-4"
                    >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${
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
            {normalized.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => api?.scrollPrev()}
                  className="absolute left-2 top-[85px] z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:text-foreground md:-left-4"
                  aria-label="Aprendizaje anterior"
                >
                  <ArrowLeft size={15} />
                </button>
                <span className="text-xs font-medium text-muted-foreground">
                  {index + 1} / {normalized.length}
                </span>
                <button
                  onClick={() => api?.scrollNext()}
                  className="absolute right-2 top-[85px] z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:text-foreground md:-right-4"
                  aria-label="Siguiente aprendizaje"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Todavía no hay aprendizajes en esta pestaña. Cuando el partido aporte señales nuevas, esta biblioteca se ampliará aquí.
          </p>
        )}
      </div>
    </section>
  )
}
