/**
 * Experience Radar — utilidades i18n para CONTENIDO bilingüe (ES/EN).
 *
 * El chrome de la UI ya se traduce con `t(es, en)` de `lib/language-context`.
 * Esto es para el CONTENIDO de datos (notas, reportes): cada campo legible por el
 * usuario se guarda como `{ es, en }` para servir la ruta correcta (/mundial-2026
 * en español, /world-cup-2026 en inglés) sin recalcular en cliente.
 *
 * Diseño retrocompatible: los datos ya persistidos en KV o en el seed pueden ser
 * `string` (solo ES). `normalizeLocalized` los envuelve a `{ es, en }` al leer, de
 * modo que nada se rompe durante la migración. La capa de IA (Fase 4) rellenará
 * el campo `en` real; hasta entonces, `en` cae a `es`.
 */

export type Lang = "es" | "en"

/** Texto que existe en ambos idiomas. */
export type LocalizedText = { es: string; en: string }

/** Lista de strings en ambos idiomas. */
export type LocalizedList = { es: string[]; en: string[] }

/** Un valor `string | LocalizedText` (lo que puede venir de datos legacy). */
export type MaybeLocalizedText = string | LocalizedText

/** Un valor `string[] | LocalizedList` (datos legacy). */
export type MaybeLocalizedList = string[] | LocalizedList

/** Selecciona el idioma de un valor localizado. */
export function pick<T>(value: { es: T; en: T }, lang: Lang): T {
  return value[lang]
}

/**
 * Crea un `LocalizedText`. Si no se pasa `en`, cae al texto en español (sirve para
 * migrar contenido ES-only sin perder render mientras la IA aún no traduce).
 */
export function loc(es: string, en?: string): LocalizedText {
  return { es, en: en ?? es }
}

/** Crea un `LocalizedList`. Si no se pasa `en`, cae a la lista en español. */
export function locList(es: string[], en?: string[]): LocalizedList {
  return { es, en: en ?? es }
}

/** ¿Es ya un objeto `{ es, en }` (texto)? */
function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).es === "string"
  )
}

/** ¿Es ya un objeto `{ es, en }` (lista)? */
function isLocalizedList(value: unknown): value is LocalizedList {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Record<string, unknown>).es)
  )
}

/**
 * Normaliza un valor potencialmente legacy a `LocalizedText`. Acepta `string`
 * (ES-only → `{ es, en: es }`) o un `{ es, en }` ya formado.
 */
export function normalizeLocalized(value: MaybeLocalizedText | undefined | null): LocalizedText {
  if (value == null) return loc("")
  if (isLocalizedText(value)) return { es: value.es, en: value.en ?? value.es }
  return loc(String(value))
}

/** Igual que `normalizeLocalized` pero para listas. */
export function normalizeLocalizedList(value: MaybeLocalizedList | undefined | null): LocalizedList {
  if (value == null) return locList([])
  if (isLocalizedList(value)) return { es: value.es, en: value.en ?? value.es }
  if (Array.isArray(value)) return locList(value.map(String))
  return locList([])
}

/** Resuelve a `string` un valor que puede ser legacy o localizado. */
export function resolveText(value: MaybeLocalizedText | undefined | null, lang: Lang): string {
  return pick(normalizeLocalized(value), lang)
}

/** Resuelve a `string[]` un valor que puede ser legacy o localizado. */
export function resolveList(value: MaybeLocalizedList | undefined | null, lang: Lang): string[] {
  return pick(normalizeLocalizedList(value), lang)
}
