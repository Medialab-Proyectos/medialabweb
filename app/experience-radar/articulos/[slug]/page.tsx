import { permanentRedirect } from "next/navigation"

/**
 * Ruta migrada: /experience-radar/articulos/[slug] → /experience-radar/mundial-2026/[slug].
 * El 301 principal vive en next.config.mjs (redirects). Este stub es defensa en
 * profundidad para cualquier acceso directo que evite la config.
 */
export const dynamic = "force-dynamic"

export default async function RadarArticleRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/experience-radar/mundial-2026/${slug}`)
}
