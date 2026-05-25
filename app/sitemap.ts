import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
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
  }[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0, en: true },
    { path: "/servicios", changeFrequency: "monthly", priority: 0.95, en: true },
    { path: "/servicios/discovery-con-ia", changeFrequency: "monthly", priority: 0.9, en: true },
    { path: "/servicios/diseno-ux-ui", changeFrequency: "monthly", priority: 0.9, en: true },
    { path: "/servicios/desarrollo-producto-digital", changeFrequency: "monthly", priority: 0.9, en: true },
    { path: "/servicios/cro-saas", changeFrequency: "monthly", priority: 0.85, en: true },
    { path: "/industrias/fintech", changeFrequency: "monthly", priority: 0.85, en: true },
    { path: "/industrias/startups", changeFrequency: "monthly", priority: 0.85, en: true },
    { path: "/industrias/banca", changeFrequency: "monthly", priority: 0.8, en: true },
    { path: "/industrias/educacion", changeFrequency: "monthly", priority: 0.8, en: true },
    { path: "/industrias/ecommerce", changeFrequency: "monthly", priority: 0.8, en: true },
    { path: "/industrias/movilidad", changeFrequency: "monthly", priority: 0.8, en: true },
    { path: "/curso", changeFrequency: "weekly", priority: 0.95, en: true },
    { path: "/portafolio", changeFrequency: "monthly", priority: 0.9, en: true },
    { path: "/sobre-nosotros", changeFrequency: "monthly", priority: 0.85, en: true },
    { path: "/contacto", changeFrequency: "monthly", priority: 0.85, en: true },
    { path: "/blog", changeFrequency: "weekly", priority: 0.9, en: true },
    { path: "/recursos/kit-discovery-ux-ia", changeFrequency: "monthly", priority: 0.85, en: true },
    { path: "/blog/arquitectura-percepcion", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/adn-del-significado", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/trono-de-la-decision", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/influencia-sin-erosion", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/psicologia-adopcion", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/discovery-ia", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/ux-fintech", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/blog/mvp-escala", changeFrequency: "monthly", priority: 0.8, en: false },
    { path: "/politica-de-privacidad", changeFrequency: "yearly", priority: 0.3, en: false },
    { path: "/terminos-de-servicio", changeFrequency: "yearly", priority: 0.3, en: false },
  ]

  const entries: MetadataRoute.Sitemap = []
  for (const r of routes) {
    const esUrl = `${baseUrl}${r.path || "/"}`
    const enUrl = `${baseUrl}/en${r.path}`
    const languages = r.en
      ? { es: esUrl, en: enUrl, "x-default": esUrl }
      : { es: esUrl, "x-default": esUrl }

    // Spanish (default, no prefix)
    entries.push({
      url: esUrl,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages },
    })

    // English mirror — only for routes with a real translation.
    if (r.en) {
      entries.push({
        url: enUrl,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority * 0.9,
        alternates: { languages },
      })
    }
  }

  return entries
}
