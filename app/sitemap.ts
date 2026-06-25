import { MetadataRoute } from "next"
import { getVisibleRadarArticles } from "@/src/lib/experience-radar/articleData"
import { getArticleAvailability } from "@/src/lib/experience-radar/articleAvailability"
import { BLOG_POSTS } from "@/lib/blog-posts"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medialab.design"
  const now = new Date()

  // `en: true`  → la ruta tiene versión inglesa real (UI traducida vía t()).
  // `en: false` → contenido solo en español (los artículos de blog son prosa
  //               en español); no emitimos espejo /en para no indexar contenido
  //               mixto idioma. Esas /en/* van con robots noindex.
  const routes: {
    path: string
    changeFrequency: "weekly" | "monthly" | "yearly"
    priority: number
    en: boolean
    lastModified: string
  }[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0, en: true, lastModified: "2026-06-25" },
    { path: "/servicios", changeFrequency: "monthly", priority: 0.95, en: true, lastModified: "2026-05-20" },
    { path: "/servicios/discovery-con-ia", changeFrequency: "monthly", priority: 0.9, en: true, lastModified: "2026-05-20" },
    { path: "/servicios/diseno-ux-ui", changeFrequency: "monthly", priority: 0.9, en: true, lastModified: "2026-05-20" },
    { path: "/servicios/desarrollo-producto-digital", changeFrequency: "monthly", priority: 0.9, en: true, lastModified: "2026-05-20" },
    { path: "/servicios/cro-saas", changeFrequency: "monthly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/industrias/fintech", changeFrequency: "monthly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/industrias/startups", changeFrequency: "monthly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/industrias/banca", changeFrequency: "monthly", priority: 0.8, en: true, lastModified: "2026-05-20" },
    { path: "/industrias/educacion", changeFrequency: "monthly", priority: 0.8, en: true, lastModified: "2026-05-20" },
    { path: "/industrias/ecommerce", changeFrequency: "monthly", priority: 0.8, en: true, lastModified: "2026-05-20" },
    { path: "/industrias/movilidad", changeFrequency: "monthly", priority: 0.8, en: true, lastModified: "2026-05-20" },
    { path: "/curso", changeFrequency: "weekly", priority: 1.0, en: true, lastModified: "2026-06-25" },
    { path: "/portafolio", changeFrequency: "monthly", priority: 0.9, en: true, lastModified: "2026-06-25" },
    { path: "/sobre-nosotros", changeFrequency: "monthly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/contacto", changeFrequency: "monthly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/carreras", changeFrequency: "weekly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/blog", changeFrequency: "weekly", priority: 0.9, en: true, lastModified: "2026-05-25" },
    { path: "/recursos/analizador-ux-ia", changeFrequency: "monthly", priority: 0.85, en: true, lastModified: "2026-05-20" },
    { path: "/uxgreen", changeFrequency: "monthly", priority: 0.90, en: true, lastModified: "2026-05-20" },
  ]

  // Artículos del blog — derivados del registro único (lib/blog-posts.ts).
  // Son prosa en español (en: false) → solo URL ES con x-default.
  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: post.priority ?? 0.8,
    en: post.translated ?? false,
    lastModified: post.lastModified,
  }))

  const entries: MetadataRoute.Sitemap = []
  for (const r of [...routes, ...blogRoutes]) {
    const esUrl = `${baseUrl}${r.path || "/"}`
    const enUrl = `${baseUrl}/en${r.path}`
    const languages = r.en
      ? { es: esUrl, en: enUrl, "x-default": esUrl }
      : { es: esUrl, "x-default": esUrl }

    const lastModDate = new Date(r.lastModified)

    // Spanish (default, no prefix)
    entries.push({
      url: esUrl,
      lastModified: lastModDate,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages },
    })

    // English mirror — only for routes with a real translation.
    if (r.en) {
      entries.push({
        url: enUrl,
        lastModified: lastModDate,
        changeFrequency: r.changeFrequency,
        priority: r.priority * 0.9,
        alternates: { languages },
      })
    }
  }

  const radarRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/experience-radar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/experience-radar`,
          en: `${baseUrl}/en/experience-radar`,
          "x-default": `${baseUrl}/experience-radar`,
        },
      },
    },
    {
      url: `${baseUrl}/experience-radar/mundial-2026`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
  ]

  const articles = (await getVisibleRadarArticles()).filter(
    (article) => getArticleAvailability(article, now).accessible,
  )
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/experience-radar/mundial-2026/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.date),
    changeFrequency: article.matchState === "finalizado" ? "weekly" : "hourly",
    priority: article.matchState === "finalizado" ? 0.9 : 0.95,
  }))

  return [...entries, ...radarRoutes, ...articleEntries]
}
