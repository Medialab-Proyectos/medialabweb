import { getAllRadarArticles } from "@/src/lib/experience-radar/articleData"

const SITE = "https://medialab.design"

export async function GET() {
  const articles = await getAllRadarArticles()
  const items = articles
    .map(
      (article) => `
        <item>
          <title><![CDATA[${article.seoTitle}]]></title>
          <link>${SITE}/experience-radar/mundial-2026/${article.slug}</link>
          <guid isPermaLink="true">${SITE}/experience-radar/mundial-2026/${article.slug}</guid>
          <pubDate>${new Date(article.updatedAt || article.publishedAt).toUTCString()}</pubDate>
          <description><![CDATA[${article.metaDescription}]]></description>
        </item>`,
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Experience Radar - Mundial 2026</title>
        <link>${SITE}/experience-radar/mundial-2026</link>
        <description>Análisis de experiencia, emoción y comportamiento alrededor del Mundial 2026.</description>
        <language>es-CO</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  })
}
