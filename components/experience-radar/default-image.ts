/**
 * Imágenes por defecto del partido (cuando la nota NO trae imagen de referencia).
 * Se elige una de forma "aleatoria pero ESTABLE" por partido: el mismo slug siempre
 * cae en la misma imagen. Así varía entre notas pero no parpadea entre renders ni
 * causa desajustes de hidratación (server y cliente calculan lo mismo).
 */
export const DEFAULT_MATCH_IMAGES = [
  "/images/experience-radar-vs.png",
  "/images/experience-radar-vs2.png",
  "/images/experience-radar-vs-var2.png",
  "/images/experience-radar-vs2-var1.png",
  "/images/experience-radar-vs2-var2.png",
] as const

/** Devuelve una imagen por defecto determinista a partir de una semilla (p. ej. el slug). */
export function pickDefaultImage(seed?: string): string {
  if (!seed) return DEFAULT_MATCH_IMAGES[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return DEFAULT_MATCH_IMAGES[hash % DEFAULT_MATCH_IMAGES.length]
}
