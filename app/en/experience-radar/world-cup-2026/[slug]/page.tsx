import type { Metadata } from "next"
import { getRadarArticleBySlug } from "@/src/lib/experience-radar/articleData"
import RadarArticlePage from "@/app/experience-radar/mundial-2026/[slug]/page"

/**
 * Espejo en inglés de la nota individual. Reutiliza el render de la ruta española
 * (los componentes detectan idioma por la ruta `/en`). El contenido editorial de
 * la nota se traduce de forma completa en la Fase 4 (capa IA bilingüe); hasta
 * entonces sirve el contenido base con el chrome en inglés.
 */
const SITE = "https://medialab.design"
const BASE_EN = "/en/experience-radar/world-cup-2026"
const BASE_ES = "/experience-radar/mundial-2026"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getRadarArticleBySlug(slug)
  if (!article) return { title: "Article not found | Experience Radar" }

  const url = `${SITE}${BASE_EN}/${article.slug}`
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `${BASE_ES}/${article.slug}`,
      languages: {
        es: `${BASE_ES}/${article.slug}`,
        en: `${BASE_EN}/${article.slug}`,
        "x-default": `${BASE_ES}/${article.slug}`,
      },
    },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      type: "article",
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      authors: ["MediaLab Ingeniería"],
    },
    twitter: { card: "summary_large_image", title: article.seoTitle, description: article.metaDescription },
    robots: { index: false, follow: true },
  }
}

export default RadarArticlePage
