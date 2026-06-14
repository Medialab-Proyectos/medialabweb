/**
 * Imágenes por defecto del partido (cuando la nota NO trae imagen de referencia).
 * Se elige una de forma "aleatoria pero ESTABLE" por partido: el mismo slug siempre
 * cae en la misma imagen. Así varía entre notas pero no parpadea entre renders ni
 * causa desajustes de hidratación (server y cliente calculan lo mismo).
 *
 * Orden de prioridad de la imagen de una nota:
 *  1) La foto enlazable del medio (article.imageUrl) — la maneja <NoteImage>.
 *  2) Si no hay foto del medio, el POOL aleatorio estable por slug (estas imágenes).
 * La imagen automática solo se usa cuando la nota no tiene una foto editorial real.
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
 */
export function pickMatchImage(seed?: string, _teams?: string[]): string {
  return pickDefaultImage(seed)
}
