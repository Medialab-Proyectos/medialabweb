import { getVisibleRadarArticles } from "@/src/lib/experience-radar/articleData"
import { getArticleAvailability } from "@/src/lib/experience-radar/articleAvailability"

const SITE = "https://medialab.design"
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export async function GET() {
  const now = new Date()
  const articles = (await getVisibleRadarArticles()).filter((article) => {
    if (!getArticleAvailability(article, now).accessible) return false
    if (article.matchState !== "finalizado" && !article.matchScore) return false

    const publicationTime = new Date(article.updatedAt || article.publishedAt).getTime()
    return Number.isFinite(publicationTime) && now.getTime() - publicationTime <= TWO_DAYS_MS
  })

  const urls = articles
    .map(
      (article) => `
  <url>
    <loc>${SITE}/experience-radar/mundial-2026/${escapeXml(article.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>MediaLab Ingeniería</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(article.updatedAt || article.publishedAt)}</news:publication_date>
      <news:title>${escapeXml(article.seoTitle)}</news:title>
    </news:news>
  </url>`,
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  })
}
