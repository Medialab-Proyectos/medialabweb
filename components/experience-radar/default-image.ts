/**
 * Imágenes por defecto del partido (cuando la nota NO trae imagen de referencia).
 * Se elige una de forma "aleatoria pero ESTABLE" por partido: el mismo slug siempre
 * cae en la misma imagen. Así varía entre notas pero no parpadea entre renders ni
 * causa desajustes de hidratación (server y cliente calculan lo mismo).
 *
 * Orden de prioridad de la imagen de una nota:
 *  1) La foto enlazable del medio (article.imageUrl) — la maneja <NoteImage>.
 *  2) Si no hay foto del medio, el POOL aleatorio estable por slug (estas imágenes).
 *  3) Las imágenes de selección anfitriona (México/EE. UU./Canadá) son la ÚLTIMA opción:
 *     solo salen cuando ESE país juega "en casa", no en el resto de partidos.
 */

/** Pool neutro/aleatorio: respaldo normal cuando no hay foto del medio. */
export const DEFAULT_MATCH_IMAGES = [
  "/images/experience-radar-vs.png",
  "/images/experience-radar-vs2.png",
  "/images/experience-radar-vs2-var1.png",
  "/images/experience-radar-vs2-var2.png",
  "/images/radar-uxbox-futbol-var1.png",
  "/images/radar-event-fans-yellow-blue.png",
  "/images/radar-event-fans-orange-white.png",
] as const

/**
 * Imagen específica por selección anfitriona: ÚLTIMA opción, solo cuando esa selección
 * juega el partido (no en otras notas). El orden importa: si por algún motivo jugaran dos
 * anfitriones, gana el primero de la lista.
 */
const HOST_TEAM_IMAGES: Array<{ test: RegExp; image: string }> = [
  { test: /m[eé]xico/i, image: "/images/radar-uxschool-futbol-mexico.png" },
  { test: /estados unidos|ee\.?\s?uu|united states|\busa\b/i, image: "/images/radar-uxschool-futbol-usa.png" },
  { test: /canad[aá]/i, image: "/images/radar-uxschool-futbol-canada.png" },
]

function hashSeed(seed?: string): number {
  if (!seed) return 0
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return hash
}

/** Devuelve una imagen del POOL neutro de forma determinista por semilla (p. ej. el slug). */
export function pickDefaultImage(seed?: string): string {
  if (!seed) return DEFAULT_MATCH_IMAGES[0]
  return DEFAULT_MATCH_IMAGES[hashSeed(seed) % DEFAULT_MATCH_IMAGES.length]
}

/**
 * Imagen de respaldo para una nota SIN foto del medio: cae al pool aleatorio estable.
 * La imagen del anfitrión es la ÚLTIMA opción y SOLO se usa cuando ESE país juega.
 */
export function pickMatchImage(seed?: string, teams?: string[]): string {
  if (teams?.length) {
    for (const host of HOST_TEAM_IMAGES) {
      if (teams.some((team) => host.test.test(team))) return host.image
    }
  }
  return pickDefaultImage(seed)
}
