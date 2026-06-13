import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { getLatestDailyRadarReport } from "@/src/lib/experience-radar"
import { getVisibleRadarArticles } from "@/src/lib/experience-radar/articleData"
import { EspecialHero } from "@/components/experience-radar/especial-hero"
import { EspecialesGrid } from "@/components/experience-radar/especiales-grid"
import { RadarFloatingMenu } from "@/components/experience-radar/radar-floating-menu"
import { NextMatchBar } from "@/components/experience-radar/next-match-bar"

/**
 * Página 2 — PORTAL del especial "Mundial 2026".
 *
 * Es un portal de NOTAS, no la nota completa: hero del Mundial (contexto/escala) +
 * nota principal (la más reciente, que se abre en su detalle) + grilla del resto.
 * La nota completa con su análisis vive en /experience-radar/mundial-2026/[slug].
 * Espejo en inglés: /en/experience-radar/world-cup-2026 (idioma por ruta).
 *
 * Fase 2 añadirá: barra viva (próximo partido + contador), buscador y filtros chip.
 */
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mundial 2026: análisis de experiencia, emoción y comportamiento | Experience Radar",
    description:
      "Notas verificadas del Mundial 2026 sobre emoción de las hinchadas, comportamiento digital, sesgos cognitivos y aprendizajes aplicables a UX y producto.",
    alternates: {
      canonical: "/experience-radar/mundial-2026",
      types: { "application/rss+xml": "https://medialab.design/experience-radar/feed.xml" },
      languages: {
        es: "/experience-radar/mundial-2026",
        en: "/en/experience-radar/world-cup-2026",
        "x-default": "/experience-radar/mundial-2026",
      },
    },
    openGraph: {
      title: "Mundial 2026 desde la experiencia humana | Experience Radar",
      description: "Resultados y previas verificadas convertidas en aprendizajes de UX, producto y comportamiento humano.",
      type: "website",
      url: "https://medialab.design/experience-radar/mundial-2026",
      images: [{ url: "/images/experience-radar-vs2.png", alt: "Experience Radar - Especial Mundial 2026" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mundial 2026 desde la experiencia humana | Experience Radar",
      description: "Resultados y previas verificadas convertidas en aprendizajes de UX, producto y comportamiento humano.",
      images: ["/images/experience-radar-vs2.png"],
    },
    robots: { index: true, follow: true },
  }
}

export default async function ExperienceRadarMundialPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const { q } = (await searchParams) ?? {}
  const report = await getLatestDailyRadarReport()
  const all = await getVisibleRadarArticles()

  const query = (q ?? "").trim().toLowerCase()
  const articles = query
    ? all.filter((a) =>
        [a.seoTitle, a.teams.join(" "), a.event, a.hook].join(" ").toLowerCase().includes(query),
      )
    : all

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <RadarFloatingMenu />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCollectionSchema(articles)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }} />

      <div className="bg-background pt-16 md:pt-20">
        <NextMatchBar updatedAt={report?.updatedAt} />
        <EspecialHero updatedAt={report?.updatedAt} />
      </div>

      {articles.length ? (
        <EspecialesGrid articles={articles} />
      ) : (
        <section className="mx-auto max-w-3xl px-6 py-16">
          {query ? (
            <>
              <h2 className="text-2xl font-bold">Sin resultados para «{q}»</h2>
              <p className="mt-3 text-muted-foreground">
                No encontramos notas que coincidan con tu búsqueda.{" "}
                <a href="/experience-radar/mundial-2026" className="font-semibold text-[var(--cyan)] hover:underline">
                  Ver todas las notas
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Todavía no hay notas del especial</h2>
              <p className="mt-3 text-muted-foreground">
                Ejecuta manualmente el agente desde <code>/api/experience-radar/run</code>.
                En Vercel correrá todos los días a las 4:00 AM y 11:00 AM de Colombia.
              </p>
            </>
          )}
        </section>
      )}

      <Footer />
    </main>
  )
}

function buildCollectionSchema(articles: Awaited<ReturnType<typeof getVisibleRadarArticles>>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Experience Radar - Especial Mundial 2026",
    description: "Análisis verificados del Mundial 2026 desde la experiencia, la emoción y el comportamiento digital.",
    url: "https://medialab.design/experience-radar/mundial-2026",
    inLanguage: "es",
    hasPart: articles.map((article) => ({
      "@type": "NewsArticle",
      headline: article.seoTitle,
      url: `https://medialab.design/experience-radar/mundial-2026/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
    })),
  }
}

function buildFaqSchema() {
  const faq = [
    {
      question: "¿Qué analiza Experience Radar durante el Mundial 2026?",
      answer: "Analiza cómo los partidos cambian la emoción, la conversación digital y el comportamiento de las hinchadas, y convierte esas señales en aprendizajes de UX y producto.",
    },
    {
      question: "¿Las notas usan resultados y fuentes reales?",
      answer: "Sí. Los hechos deportivos se contrastan con fuentes oficiales y editoriales enlazadas; la interpretación de comportamiento se identifica como análisis de MediaLab.",
    },
  ]
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}
