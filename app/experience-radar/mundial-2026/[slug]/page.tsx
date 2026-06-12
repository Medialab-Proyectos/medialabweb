import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ExternalLink, ChevronDown, BookOpen,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { RadarCtaCards } from "@/components/experience-radar/radar-cta-cards"
import { MatchNote } from "@/components/experience-radar/match-note"
import { type MatchPhases, type MatchRuntimeStatus } from "@/components/experience-radar/match-phase-radar"
import { FanSimulator } from "@/components/experience-radar/fan-simulator"
import { MatchCountdown } from "@/components/experience-radar/match-countdown"
import { RadarFloatingMenu } from "@/components/experience-radar/radar-floating-menu"
import { RelatedNotes, type RelatedNote } from "@/components/experience-radar/related-notes"
import { NoteImage } from "@/components/experience-radar/note-image"
import { StatusPill } from "@/components/experience-radar/status-pill"
import { categoryLabel } from "@/components/experience-radar/category-labels"
import { pickDefaultImage } from "@/components/experience-radar/default-image"
import { getRadarArticleBySlug, getAllRadarArticles } from "@/src/lib/experience-radar/articleData"
import type { EmotionalRadarValues, RadarArticle } from "@/src/lib/experience-radar/articles"

const SITE = "https://medialab.design"
const BASE = "/experience-radar/mundial-2026"

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

  const url = `${SITE}${BASE}/${article.slug}`
  const image = article.imageUrl || `${SITE}${pickDefaultImage(article.slug)}`
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `${BASE}/${article.slug}`,
      languages: {
        es: `${BASE}/${article.slug}`,
        en: `/en/experience-radar/world-cup-2026/${article.slug}`,
        "x-default": `${BASE}/${article.slug}`,
      },
    },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      type: "article",
      url,
      images: [{ url: image, alt: article.imageAlt || article.seoTitle }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      authors: ["MediaLab Ingeniería"],
    },
    twitter: { card: "summary_large_image", title: article.seoTitle, description: article.metaDescription, images: [image] },
    robots: { index: true, follow: true },
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

  const status = resolveRuntimeStatus(article)
  const isPreview = status === "previa"
  const phases = resolveMatchPhases(article, status)
  const approach = resolveTeamApproach(article)
  const lessons = resolveLessons(article)
  const summary = article.matchSummary || article.quickSummary
  const sourceLabels = resolveSourceLabels(article)

  // Notas relacionadas (resto del especial) para el carrusel del final.
  const related: RelatedNote[] = (await getAllRadarArticles())
    .filter((a) => a.slug !== article.slug)
    .slice(0, 8)
    .map((a) => {
      const s = resolveRuntimeStatus(a)
      return {
        slug: a.slug,
        title: a.seoTitle,
        teams: a.teams.join(" vs "),
        image: a.imageUrl || pickDefaultImage(a.slug),
        badge: s === "previa" ? "Previa" : s === "en_vivo" ? "En vivo" : "Finalizado",
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <RadarFloatingMenu />
      <JsonLd article={article} summary={summary} lessons={lessons} />

      <article className="mx-auto max-w-3xl px-6 pt-24 pb-16 md:pt-28">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-card-foreground">
            {article.event}
          </span>
          <span className="rounded-full bg-[var(--cyan)]/10 px-3 py-1 font-semibold text-[var(--cyan)]">
            {categoryLabel(article.category, "es")}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
          {article.seoTitle}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {article.teams.join(" vs ")} · {formatDate(article.date)}
          {article.kickoffAt ? ` · ${formatKickoff(article.kickoffAt)}` : ""}
        </p>

        <figure className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="relative h-56 md:h-80">
            <NoteImage
              src={article.imageUrl}
              seed={article.slug}
              alt={article.imageAlt || `${article.teams.join(" vs ")} — ${article.seoTitle}`}
              className="h-full w-full object-cover object-[center_22%]"
              loading="eager"
            />
            <StatusPill status={status} className="absolute left-3 top-3 z-10" />
            {article.kickoffAt && status !== "finalizado" && (
              <div className="absolute bottom-3 left-3 right-3 z-10 md:bottom-4 md:left-4 md:right-auto md:max-w-sm">
                <MatchCountdown kickoffAt={article.kickoffAt} overlay />
              </div>
            )}
          </div>
          <figcaption className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            {article.imageSourceUrl ? (
              <Link href={article.imageSourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-foreground">
                {article.imageCredit || "Imagen editorial de la fuente"}. Referencia enlazada, no patrocinada.
              </Link>
            ) : (
              "Imagen representativa del partido. Referencia editorial, no patrocinada."
            )}
          </figcaption>
        </figure>

        <MatchNote
          status={status}
          matchScore={article.matchScore}
          phases={phases}
          block1={block1}
          teamApproach={teamApproach}
          lessons={lessons}
          interpretations={article.matchInterpretations}
          sourceLabels={sourceLabels}
        />

        {/* ── BLOQUE 5 · Simulador (solo finalizado) ── */}
        {status === "finalizado" && (
          <section className="mt-10">
            <FanSimulator />
          </section>
        )}

        {/* ── CTA final integrado ── */}
        <RadarCtaCards />

        {/* Fuentes consultadas — acordeón colapsado */}
        <details className="group mt-10 rounded-2xl border border-border p-5">
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
            Datos de partido mostrados como ejemplo en borrador, pendientes de verificación.
          </p>
        </details>
      </article>

      <RelatedNotes notes={related} />

      <Footer />
    </main>
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

function resolveRuntimeStatus(article: RadarArticle): MatchRuntimeStatus {
  if (article.matchState === "finalizado") return "finalizado"
  if (!article.kickoffAt) return article.matchState === "en_vivo" ? "en_vivo" : "previa"

  const kickoff = new Date(article.kickoffAt).getTime()
  const now = Date.now()
  const liveWindowMs = 2 * 60 * 60 * 1000

  if (now < kickoff) return "previa"
  if (now < kickoff + liveWindowMs) return "en_vivo"
  // Pasada la ventana en vivo el partido ya terminó: nunca quedarse en "en_vivo".
  return "finalizado"
}

function resolveSourceLabels(article: RadarArticle): string[] {
  const all = [...article.sources, ...article.fanPulse.sources]
  const byKind = new Map<string, string>()
  for (const source of all) {
    if (!byKind.has(source.kind)) byKind.set(source.kind, source.name)
  }
  return [...byKind.values()]
}

/* ───────────────── Subcomponentes (server) ───────────────── */

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "America/Bogota" }).format(
    new Date(`${value}T12:00:00`),
  )
}

function formatKickoff(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Bogota",
    timeZoneName: "short",
  }).format(new Date(value))
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
  const image = article.imageUrl || `${SITE}${pickDefaultImage(article.slug)}`

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
      creator: article.imageCredit ? { "@type": "Organization", name: "Latingoles" } : undefined,
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
    author: { "@type": "Organization", name: "MediaLab Ingeniería", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "MediaLab Ingeniería",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/images/logo-medialab-400.png` },
    },
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
