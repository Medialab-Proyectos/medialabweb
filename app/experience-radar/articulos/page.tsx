import { permanentRedirect } from "next/navigation"

/**
 * Ruta migrada: /experience-radar/articulos → /experience-radar/mundial-2026.
 * El 301 principal vive en next.config.mjs (redirects). Este stub es defensa en
 * profundidad para cualquier acceso directo que evite la config.
 */
export const dynamic = "force-dynamic"

export default function RadarArticlesIndexRedirect() {
  permanentRedirect("/experience-radar/mundial-2026")
}
