import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medialab.design"
  const now = new Date()

  const routes: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/servicios", changeFrequency: "monthly", priority: 0.95 },
    { path: "/curso", changeFrequency: "weekly", priority: 0.95 },
    { path: "/portafolio", changeFrequency: "monthly", priority: 0.9 },
    { path: "/sobre-nosotros", changeFrequency: "monthly", priority: 0.85 },
    { path: "/contacto", changeFrequency: "monthly", priority: 0.85 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { path: "/blog/arquitectura-percepcion", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/adn-del-significado", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/trono-de-la-decision", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/influencia-sin-erosion", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/psicologia-adopcion", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/discovery-ia", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/ux-fintech", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog/mvp-escala", changeFrequency: "monthly", priority: 0.8 },
    { path: "/politica-de-privacidad", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terminos-de-servicio", changeFrequency: "yearly", priority: 0.3 },
  ]

  const entries: MetadataRoute.Sitemap = []
  for (const r of routes) {
    // Spanish (default, no prefix)
    entries.push({
      url: `${baseUrl}${r.path || "/"}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: {
        languages: {
          es: `${baseUrl}${r.path || "/"}`,
          en: `${baseUrl}/en${r.path}`,
          "x-default": `${baseUrl}${r.path || "/"}`,
        },
      },
    })
    // English mirror
    entries.push({
      url: `${baseUrl}/en${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority * 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}${r.path || "/"}`,
          en: `${baseUrl}/en${r.path}`,
          "x-default": `${baseUrl}${r.path || "/"}`,
        },
      },
    })
  }

  return entries
}
