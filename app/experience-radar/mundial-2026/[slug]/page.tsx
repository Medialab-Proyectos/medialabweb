import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ExternalLink, ChevronDown, BookOpen, Sparkles, ArrowRight,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { RadarCtaCards } from "@/components/experience-radar/radar-cta-cards"
import { MatchNote, type PriorTeamPrediction } from "@/components/experience-radar/match-note"
import { MatchNoteNav } from "@/components/experience-radar/match-note-nav"
import { type MatchPhases, type MatchRuntimeStatus, type RadarViewMode, type TeamPhaseRadar } from "@/components/experience-radar/match-phase-radar"
import { FanSimulator } from "@/components/experience-radar/fan-simulator"
import { RadarPhaseProvider } from "@/components/experience-radar/radar-phase-context"
import { RadarPhaseBar } from "@/components/experience-radar/radar-phase-bar"
import { RadarNewsletter } from "@/components/experience-radar/radar-newsletter"
import { RelatedNotes, type RelatedNote } from "@/components/experience-radar/related-notes"
import { PhaseAwareNoteImage } from "@/components/experience-radar/phase-aware-note-image"
import { ArticleLike } from "@/components/experience-radar/article-like"
import { LocalMatchTime } from "@/components/experience-radar/local-match-time"
import { pickMatchImage } from "@/components/experience-radar/default-image"
import { getRadarArticleBySlug, getAllRadarArticles } from "@/src/lib/experience-radar/articleData"
import { resolveMatchStatus, getArticleAvailability } from "@/src/lib/experience-radar/articleAvailability"
import type { EmotionalRadarValues, RadarArticle } from "@/src/lib/experience-radar/articles"

const SITE = "https://medialab.design"
const BASE = "/experience-radar/mundial-2026"
const RADAR_BRAND = "Experience Radar"

function absoluteSiteUrl(value: string): string {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `${SITE}${value}`
}

// Los artículos provienen del store del agente diario (con fallback al seed), por
// lo que la ruta es dinámica en lugar de prerenderizada en build.
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getRadarArticleBySlug(slug)
  if (!article) return { title: "Artículo no encontrado | Experience Radar" }

  const availability = getArticleAvailability(article)
  if (!availability.accessible) {
    return {
      title: "Análisis en preparación | Experience Radar",
      robots: { index: false, follow: true },
    }
  }

  const url = `${SITE}${BASE}/${article.slug}`
  const image = absoluteSiteUrl(article.imageUrl || pickMatchImage(article.slug, article.teams))
  const brandedTitle = `${article.seoTitle} | ${RADAR_BRAND}`
  return {
    title: { absolute: brandedTitle },
    applicationName: RADAR_BRAND,
    publisher: RADAR_BRAND,
    description: article.metaDescription,
    keywords: [...article.teams, article.event, article.category, "Experience Radar", "UX", "comportamiento humano", "Mundial 2026"],
    alternates: {
      canonical: `${BASE}/${article.slug}`,
      languages: {
        es: `${BASE}/${article.slug}`,
        en: `/en/experience-radar/world-cup-2026/${article.slug}`,
        "x-default": `${BASE}/${article.slug}`,
      },
    },
    openGraph: {
      title: brandedTitle,
      description: article.metaDescription,
      type: "article",
      url,
      siteName: RADAR_BRAND,
      images: [{ url: image, alt: article.imageAlt || article.seoTitle }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      authors: [RADAR_BRAND],
    },
    twitter: { card: "summary_large_image", title: brandedTitle, description: article.metaDescription, images: [image] },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export default async function RadarArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getRadarArticleBySlug(slug)
  if (!article) notFound()
  if (!getArticleAvailability(article).accessible) notFound()

  const status = resolveRuntimeStatus(article)
  const isPreview = status === "previa"
  // Partido finalizado pero SIN marcador confirmado: el análisis aún no está listo, así
  // que solo se habilita "Antes" (no Durante/Predicción con datos derivados/vacíos).
  const analysisPending = status === "finalizado" && !article.matchScore
  const resolvedPhases = resolveMatchPhases(article, status)
  const phases = analysisPending ? { expectativa: resolvedPhases.expectativa } : resolvedPhases
  const availablePhases = (["expectativa", "realidad", "percepcion"] as const).filter(
    (k) => phases[k],
  ) as RadarViewMode[]
  const initialPhase: RadarViewMode = availablePhases.includes("realidad") ? "realidad" : availablePhases[0] ?? "expectativa"
  const allArticles = await getAllRadarArticles()
  // Próximo rival de cada selección (para el pronóstico): se toma del calendario real
  // (siguiente partido donde juega), con respaldo al mapa fijo si aún no está la nota.
  const nextOpponentByTeam = computeNextOpponentByTeam(article, allArticles)
  const teamPhases = resolveTeamPhases(article, phases, nextOpponentByTeam)
  const approach = resolveTeamApproach(article)
  const lessons = resolveLessons(article)
  const summary = article.matchSummary || article.quickSummary
  const sourceLabels = resolveSourceLabels(article)

  // Notas relacionadas (resto del especial) para el carrusel del final.
  const related: RelatedNote[] = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 8)
    .map((a) => {
      const s = resolveRuntimeStatus(a)
      return {
        slug: a.slug,
        title: a.seoTitle,
        teams: a.teams.join(" vs "),
        image: a.imageUrl || pickMatchImage(a.slug, a.teams),
        badge: s === "previa" ? "Previa en análisis" : s === "en_vivo" ? "En vivo" : "Partido analizado",
        accessible: getArticleAvailability(a).accessible,
      }
    })

  // Datos por equipo + proyección a futuro (cómo llegarán) desde la conciencia colectiva.
  const teamApproach = approach.map((a) => {
    const c = article.collectiveByTeam?.find((x) => x.team === a.team)
    return { ...a, future: c ? { mood: c.mood, behaviorEffect: c.behaviorEffect } : undefined }
  })

  // Resumen del partido por fase (antes / ahora / después), con campos existentes.
  const block1 = isPreview
    ? { expectativa: summary, realidad: "", percepcion: "" }
    : {
        expectativa: approach.map((a) => `${a.team}: ${a.mainNarrative}`).join("  ·  "),
        realidad: article.matchSummary || article.quickSummary,
        percepcion: article.mediaLabInsight.emotionalReaction,
      }

  // Predicción «Antes» por equipo: hereda la proyección de la nota anterior de esa selección
  // (el partido previo donde ya se anticipó con qué ánimo llegaría a ESTE encuentro). Si no
  // existe, la UI cae en la voz de la hinchada (radar de expectativa de esta misma nota).
  const priorByTeam = computePriorByTeam(article, allArticles)

  return (
    <RadarPhaseProvider available={availablePhases} teams={article.teams} initialPhase={initialPhase}>
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <MatchNoteNav />
      <RadarPhaseBar shareTitle={article.seoTitle} />
      <JsonLd article={article} summary={summary} lessons={lessons} />

      <article className="mx-auto max-w-3xl px-6 pt-24 pb-24 md:pt-28">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-card-foreground">{article.event}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-x-3 gap-y-2">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{article.seoTitle}</h1>
          {/* Botón a la predicción (Ruta emocional del hincha): lleva al journey más abajo.
              En previa muestra la predicción previa (con qué ánimo llega la hinchada). */}
          <Link
            href="#prediccion"
            title={`Predicción · ${article.teams.join(" vs ")}`}
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--cyan)] px-4 py-1.5 text-xs font-semibold text-[#fff] shadow-sm transition-colors hover:opacity-90"
          >
            <Sparkles size={13} />{" "}
            {status === "previa" ? "Mira la predicción previa" : "Mira la predicción del partido"}{" "}
            <ArrowRight size={14} />
          </Link>
          <ArticleLike slug={article.slug} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {article.teams.join(" vs ")} · <LocalMatchTime iso={article.kickoffAt} date={article.date} />
        </p>
        <PhaseAwareNoteImage
          status={status}
          analyzing={analysisPending}
          slug={article.slug}
          teams={article.teams}
          title={article.seoTitle}
          kickoffAt={article.kickoffAt}
          imageUrl={article.imageUrl}
          imageAlt={article.imageAlt}
          imageCredit={article.imageCredit}
          imageSourceUrl={article.imageSourceUrl}
          previewImageUrl={article.previewImageUrl}
          previewImageAlt={article.previewImageAlt}
          previewImageCredit={article.previewImageCredit}
          previewImageSourceUrl={article.previewImageSourceUrl}
        />

        <MatchNote
          status={status}
          matchScore={article.matchScore}
          phases={phases}
          block1={block1}
          teamApproach={teamApproach}
          lessons={lessons}
          interpretations={article.matchInterpretations}
          sourceLabels={sourceLabels}
          teamPhases={teamPhases}
          priorByTeam={priorByTeam}
        />

        {/* ── BLOQUE 5 · Simulador (solo finalizado) ── */}
        {status === "finalizado" && (
          <section className="mt-10">
            <FanSimulator />
          </section>
        )}

        {/* Suscripción: va DESPUÉS del simulador ── */}
        <RadarNewsletter />

        {/* ── CTA final integrado ── */}
        <RadarCtaCards />

        {/* Fuentes consultadas — acordeón colapsado */}
        <details id="fuentes" className="group mt-10 scroll-mt-32 rounded-2xl border border-border p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="flex items-center gap-2"><BookOpen size={14} /> Fuentes consultadas ({article.sources.length})</span>
            <ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 grid gap-2">
            {article.sources.map((s) => (
              <Link
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:border-[var(--cyan)]"
              >
                <span>
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">· {s.kind}</span>
                </span>
                <ExternalLink size={12} className="shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Contenido editorial e investigativo independiente. MediaLab no es patrocinador oficial del torneo, no
            usa logos oficiales y no reproduce noticias completas: las fuentes se enlazan solo como referencia.
            Los hechos deportivos se publican solo tras contraste con fuentes oficiales o periodísticas enlazadas;
            la capa de UX y comportamiento se identifica como interpretación editorial.
          </p>
        </details>
      </article>

      <RelatedNotes notes={related} />

      <Footer />
    </main>
    </RadarPhaseProvider>
  )
}

/* ───────────────── Resolución de datos (con respaldo) ───────────────── */

const clampScore = (n: number) => Math.min(100, Math.max(0, Math.round(n)))

/** Radar emocional combinado de la nota: usa el de la nota; si falta, lo deriva del score. */
function combinedEmotional(article: RadarArticle): EmotionalRadarValues {
  if (article.emotionalRadar) return article.emotionalRadar
  const s = article.radarScore
  return {
    euforia: clampScore(s.userInterest * 0.7),
    confianza: clampScore(100 - s.emotionalImpact * 0.6),
    ansiedad: clampScore(s.emotionalImpact),
    frustracion: clampScore(s.emotionalImpact * 0.9),
    incertidumbre: clampScore(s.digitalConversation),
    optimismo: clampScore(100 - s.virality * 0.5),
  }
}

/** Proyecta un radar "antes del partido": más confianza y optimismo, menos tensión. */
function projectExpectation(e: EmotionalRadarValues): EmotionalRadarValues {
  return {
    euforia: clampScore(e.euforia * 0.9 + 10),
    confianza: clampScore(e.confianza + 14),
    ansiedad: clampScore(e.ansiedad * 0.65),
    frustracion: clampScore(e.frustracion * 0.5),
    incertidumbre: clampScore(e.incertidumbre * 0.7),
    optimismo: clampScore(e.optimismo + 16),
  }
}

/** Proyecta la "percepción" posterior: el sesgo de recencia amplifica la emoción dominante. */
function projectPerception(e: EmotionalRadarValues): EmotionalRadarValues {
  return {
    euforia: clampScore(e.euforia * 1.05),
    confianza: clampScore(e.confianza * 0.92),
    ansiedad: clampScore(e.ansiedad * 1.05),
    frustracion: clampScore(e.frustracion * 1.08),
    incertidumbre: clampScore(e.incertidumbre * 0.85),
    optimismo: clampScore(e.optimismo * 0.95),
  }
}

/**
 * Radar de fases (Bloque 2): usa el de la nota; si falta, lo deriva del radar
 * combinado. Realidad = lo que el partido provocó; Expectativa = proyección previa;
 * Percepción = recuerdo posterior. En estado previa, solo Expectativa.
 */
function resolveMatchPhases(article: RadarArticle, status: MatchRuntimeStatus): MatchPhases {
  if (article.matchPhases) {
    if (status === "previa" || status === "en_vivo") return { expectativa: article.matchPhases.expectativa }
    return article.matchPhases
  }
  const realidad = combinedEmotional(article)
  const expectativa = projectExpectation(realidad)
  if (status === "previa" || status === "en_vivo") return { expectativa }
  return { expectativa, realidad, percepcion: projectPerception(realidad) }
}

/** Rival de la jornada 2 por selección (fixture verificado FIFA/ESPN), para el pronóstico. */
const NEXT_OPPONENT: Record<string, string> = {
  "México": "Corea del Sur",
  "Corea del Sur": "México",
  "Sudáfrica": "Chequia",
  "Chequia": "Sudáfrica",
  "Canadá": "Catar",
  "Catar": "Canadá",
  "Suiza": "Bosnia y Herzegovina",
  "Bosnia y Herzegovina": "Suiza",
  "Estados Unidos": "Australia",
  "Australia": "Estados Unidos",
  "Escocia": "Marruecos",
  "Marruecos": "Escocia",
  "Brasil": "Haití",
  "Haití": "Brasil",
  "Turquía": "Paraguay",
  "Paraguay": "Turquía",
}

/**
 * Radar por hinchada para el filtro de banderas. Si la nota trae `teamRadars` (lo
 * puebla el agente), lo usa; si no, deriva la lectura de cada hinchada del radar
 * combinado con un sesgo determinista por equipo y por su ánimo colectivo. Es una
 * proyección editorial (no pronóstico de marcador), coherente con el resto del módulo.
 *
 * Importante: "eliminada" no significa automáticamente "sin próximo partido". En fase de
 * grupos puede quedar una jornada pendiente; el pronóstico solo se oculta cuando no hay
 * un próximo rival verificado o deducible en el calendario.
 */
function resolveTeamPhases(
  article: RadarArticle,
  phases: MatchPhases,
  nextOpponentByTeam: Record<string, string> = {},
): TeamPhaseRadar[] {
  return article.teams.map((team) => {
    // Eliminada SOLO con dato explícito del agente (no se infiere de un mapa incompleto).
    // Aun eliminada, si todavía tiene rival pendiente, se conserva la percepción/pronóstico.
    const eliminated = article.eliminatedTeams?.includes(team) ?? false
    const nextOpponent = nextOpponentByTeam[team] ?? NEXT_OPPONENT[team]
    const canProjectNextMatch = !!nextOpponent
    const tr = article.teamRadars?.find((x) => x.team === team)
    const approach = article.teamApproach?.find((a) => a.team === team)
    const beforeMood = `${approach?.expectedEmotion ?? ""} ${approach?.dominantConversation ?? ""} ${approach?.fanConfidence ?? ""} ${approach?.mainNarrative ?? ""} ${approach?.userExperience?.expectativa ?? ""}`
    if (tr) {
      const realidad = tr.current.emotional
      const beforeLean = teamLean(team, beforeMood)
      const built: MatchPhases = { expectativa: tr.before?.emotional ?? leanEmotional(phases.expectativa, beforeLean) }
      if (phases.realidad) built.realidad = realidad
      if (phases.percepcion && canProjectNextMatch) built.percepcion = tr.predicted.emotional
      return { team, phases: built, nextOpponent, eliminated }
    }
    const collective = article.collectiveByTeam?.find((c) => c.team === team)
    const beforeLean = teamLean(team, beforeMood)
    const afterLean = teamLean(team, `${collective?.mood ?? ""} ${collective?.behaviorEffect ?? ""}`)
    const built: MatchPhases = { expectativa: leanEmotional(phases.expectativa, beforeLean) }
    if (phases.realidad) built.realidad = leanEmotional(phases.realidad, afterLean)
    if (phases.percepcion && canProjectNextMatch) built.percepcion = leanEmotional(phases.percepcion, afterLean)
    return { team, phases: built, nextOpponent, eliminated }
  })
}

/**
 * Sesgo [-0.7, 0.7] por hinchada, DOMINADO por el ánimo colectivo (la voz del fan en
 * redes y medios). El hash del nombre solo desempata cuando no hay señal de ánimo, para
 * que las dos hinchadas no muestren un radar idéntico.
 */
function teamLean(team: string, mood: string): number {
  const text = mood.toLowerCase()
  let lean = 0
  if (/(ilusi|conf[ií]a|optimis|favorit|eufor|alegr|entusias|orgullo|aliv|fiesta|hito|envalenton)/.test(text)) lean += 0.5
  if (/(preocupa|frustra|ansiedad|duda|nervios|temor|crisis|tristeza|decepci|golpe|autocr[ií]t|tocad|presi[óo]n)/.test(text)) lean -= 0.5
  if (lean === 0) {
    let h = 0
    for (let i = 0; i < team.length; i++) h = (h * 31 + team.charCodeAt(i)) % 1000
    lean = (h / 1000) * 0.6 - 0.3
  }
  return Math.max(-0.7, Math.min(0.7, lean))
}

/** Aplica el sesgo de una hinchada al radar combinado (sube ánimo positivo, baja tensión). */
function leanEmotional(e: EmotionalRadarValues, lean: number): EmotionalRadarValues {
  return {
    euforia: clampScore(e.euforia * (1 + 0.3 * lean)),
    confianza: clampScore(e.confianza * (1 + 0.32 * lean)),
    ansiedad: clampScore(e.ansiedad * (1 - 0.3 * lean)),
    frustracion: clampScore(e.frustracion * (1 - 0.36 * lean)),
    incertidumbre: clampScore(e.incertidumbre * (1 - 0.22 * lean)),
    optimismo: clampScore(e.optimismo * (1 + 0.32 * lean)),
  }
}

/** Cómo llegaban los equipos (Bloque 3): usa el de la nota; si falta, deriva de collectiveByTeam. */
function resolveTeamApproach(article: RadarArticle): NonNullable<RadarArticle["teamApproach"]> {
  if (article.teamApproach?.length) return article.teamApproach
  const collective = article.collectiveByTeam ?? []
  return article.teams.map((team) => {
    const c = collective.find((x) => x.team === team)
    return {
      team,
      expectedEmotion: c?.mood ?? "Expectativa marcada por el contexto del grupo.",
      dominantConversation:
        article.fanPulse.emotions[0] ?? "La conversación gira en torno a las opciones del equipo.",
      fanConfidence: "La afición llega con confianza moderada y atenta a las primeras jugadas.",
      mainNarrative: article.hook,
      howTheyArrived: c?.mood ?? "Llegaron con la emoción condicionada por el contexto del torneo.",
      whatHappened: c?.behaviorEffect ?? article.quickSummary,
      expectationVsReality: article.mediaLabInsight.emotionalReaction,
    }
  })
}

/** Tres hallazgos (Bloque 4): usa los de la nota; si faltan, deriva de cognitiveBiases ("Término: …"). */
function resolveLessons(article: RadarArticle): Array<{ term: string; explanation: string; phase?: "antes" | "despues" }> {
  if (article.lessons?.length) return article.lessons
  return article.mediaLabInsight.cognitiveBiases.map((item) => {
    const idx = item.indexOf(":")
    return idx > 0
      ? { term: item.slice(0, idx).trim(), explanation: item.slice(idx + 1).trim() }
      : { term: "Hallazgo", explanation: item }
  })
}

/** Estado en tiempo real, delegado en la función compartida (misma lógica que el listado). */
function resolveRuntimeStatus(article: RadarArticle): MatchRuntimeStatus {
  return resolveMatchStatus(article)
}

/**
 * Predicción «Antes» por equipo: para cada selección del partido busca su nota ANTERIOR
 * (el último encuentro ya finalizado donde jugó) y hereda la proyección `predicted` que allí
 * se hizo de cara a este partido. Es el "análisis previo ya hecho en otra nota". Si no hay
 * nota previa con ese dato, se omite y la UI cae en la voz de la hinchada (radar de
 * expectativa de esta misma nota).
 */
/**
 * Próximo rival de cada selección del partido, tomado del CALENDARIO real: la siguiente
 * nota (por hora de inicio) donde esa selección vuelve a jugar. Así el pronóstico siempre
 * dice contra quién juega, sin depender del mapa fijo (incompleto). Respaldo: NEXT_OPPONENT.
 */
function computeNextOpponentByTeam(
  article: RadarArticle,
  allArticles: RadarArticle[],
): Record<string, string> {
  const time = (a: RadarArticle) => new Date(a.kickoffAt || `${a.date}T12:00:00`).getTime()
  const thisTime = time(article)
  const result: Record<string, string> = {}
  for (const team of article.teams) {
    // Prioridad: dato verificado en la nota → siguiente partido del calendario → mapa fijo.
    const explicit = article.nextOpponents?.[team]
    const next = allArticles
      .filter((a) => a.slug !== article.slug && a.teams.includes(team) && time(a) > thisTime)
      .sort((a, b) => time(a) - time(b))[0]
    const opponent = explicit ?? next?.teams.find((x) => x !== team) ?? NEXT_OPPONENT[team]
    if (opponent) result[team] = opponent
  }
  return result
}

function computePriorByTeam(
  article: RadarArticle,
  allArticles: RadarArticle[],
): Record<string, PriorTeamPrediction> {
  const result: Record<string, PriorTeamPrediction> = {}
  for (const team of article.teams) {
    const prior = allArticles
      .filter(
        (a) =>
          a.slug !== article.slug &&
          a.teams.includes(team) &&
          a.date < article.date &&
          resolveRuntimeStatus(a) === "finalizado",
      )
      .sort((a, b) => b.date.localeCompare(a.date))[0]
    if (!prior) continue
    const emotional = prior.teamRadars?.find((x) => x.team === team)?.predicted.emotional
    if (!emotional) continue
    result[team] = { emotional, fromTitle: prior.seoTitle, fromSlug: prior.slug }
  }
  return result
}

function resolveSourceLabels(article: RadarArticle): string[] {
  const all = [...article.sources, ...article.fanPulse.sources]
  const byKind = new Map<string, string>()
  for (const source of all) {
    if (!byKind.has(source.kind)) byKind.set(source.kind, source.name)
  }
  return [...byKind.values()]
}

/* ───────────────── JSON-LD (SEO / GEO / motores de IA) ───────────────── */

function JsonLd({
  article,
  summary,
  lessons,
}: {
  article: RadarArticle
  summary: string
  lessons: Array<{ term: string; explanation: string }>
}) {
  const url = `${SITE}${BASE}/${article.slug}`
  const image = absoluteSiteUrl(article.imageUrl || pickMatchImage(article.slug, article.teams))

  // El "Resumen para IA" (aiSummary) ya no se muestra al usuario: vive aquí, en el
  // abstract del NewsArticle, que es el canal para motores de IA / GEO.
  const newsArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.seoTitle,
    description: article.metaDescription,
    abstract: article.aiSummary,
    image: {
      "@type": "ImageObject",
      url: image,
      caption: article.imageAlt || article.seoTitle,
      creditText: article.imageCredit,
      creator: article.imageCredit ? { "@type": "Organization", name: article.imageCredit } : undefined,
      copyrightNotice: article.imageCredit,
      associatedArticle: article.imageSourceUrl,
    },
    articleSection: article.category,
    inLanguage: "es",
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: article.teams.map((team) => ({ "@type": "SportsTeam", name: team })),
    citation: article.sources.map((source) => source.url),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article section:first-of-type"],
    },
    author: { "@type": "Organization", name: RADAR_BRAND, url: `${SITE}/experience-radar` },
    publisher: {
      "@type": "Organization",
      name: RADAR_BRAND,
      url: `${SITE}/experience-radar`,
      logo: { "@type": "ImageObject", url: `${SITE}/images/logo-medialab-400.png` },
    },
    mentions: article.fanPulse.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
    })),
    keywords: [...article.teams, article.event, article.category, "UX", "experiencia de usuario", "Mundial 2026"].join(", "),
    isAccessibleForFree: true,
  }

  const sportsEvent = article.kickoffAt
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "@id": `${url}#match`,
        name: article.teams.join(" vs "),
        description: summary,
        startDate: article.kickoffAt,
        eventStatus:
          article.matchState === "finalizado"
            ? "https://schema.org/EventCompleted"
            : "https://schema.org/EventScheduled",
        sport: "Football",
        competitor: article.teams.map((team) => ({ "@type": "SportsTeam", name: team })),
        organizer: { "@type": "Organization", name: "FIFA", url: "https://www.fifa.com/" },
        url,
      }
    : null

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Qué pasó en ${article.teams.join(" vs ")}?`,
        acceptedAnswer: { "@type": "Answer", text: summary },
      },
      {
        "@type": "Question",
        name: "¿Qué nos enseña este caso sobre experiencia de usuario?",
        acceptedAnswer: { "@type": "Answer", text: lessons[0]?.explanation ?? article.uxFinding },
      },
      {
        "@type": "Question",
        name: "¿Cómo afecta este partido el comportamiento de los aficionados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: article.nextMatchWatch?.collectiveBehaviorNote ?? article.mediaLabInsight.humanBehavior,
        },
      },
    ],
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Experience Radar", item: `${SITE}/experience-radar` },
      { "@type": "ListItem", position: 2, name: "Especial Mundial 2026", item: `${SITE}${BASE}` },
      { "@type": "ListItem", position: 3, name: article.seoTitle, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticle) }} />
      {sportsEvent && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEvent) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  )
}
