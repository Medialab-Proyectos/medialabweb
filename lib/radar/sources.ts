/**
 * Experience Radar — registro de fuentes externas AUTORIZADAS.
 *
 * Reglas (cumplimiento):
 *  - Nada de scraping no autorizado.
 *  - No se copian noticias completas de terceros (p. ej. Latingoles): solo se usan
 *    como referencia, enlace o dato autorizado.
 *  - No se usan logos oficiales de FIFA ni se afirma patrocinio oficial.
 *
 * La arquitectura admite tres modos de ingesta:
 *  - "api"    → endpoint con datos autorizados / con licencia.
 *  - "rss"    → feed RSS público autorizado para sindicación.
 *  - "manual" → carga manual por el equipo editorial (curaduría humana).
 */

import type { SourceType } from "./types"

export interface RadarSource {
  id: string
  name: string
  type: SourceType
  /** URL del feed/API o sitio de referencia. */
  url: string
  /** Confianza base de la fuente 0–1. */
  confidence: number
  /** Solo referencia/enlace: nunca reproducir contenido completo. */
  referenceOnly: boolean
  /** Activa la ingesta automática. `manual` queda en false hasta curaduría. */
  enabled: boolean
  /** Nota de cumplimiento / términos de uso. */
  note?: string
}

/**
 * Fuentes declaradas. Por defecto la ingesta automática está DESACTIVADA
 * (`enabled: false`) hasta confirmar la licencia/autorización de cada feed.
 * Mientras tanto el radar opera con `mockSignals`.
 */
export const RADAR_SOURCES: RadarSource[] = [
  {
    id: "manual-editorial",
    name: "Curaduría editorial MediaLab",
    type: "manual",
    url: "",
    confidence: 0.9,
    referenceOnly: false,
    enabled: true,
    note: "Carga manual con revisión humana. Origen autorizado por defecto.",
  },
  {
    id: "rss-reference",
    name: "RSS autorizado (placeholder)",
    type: "rss",
    url: "", // TODO: definir feed RSS con autorización de sindicación.
    confidence: 0.6,
    referenceOnly: true,
    enabled: false,
    note: "Usar solo como referencia/enlace. Requiere confirmar términos de uso.",
  },
  {
    id: "api-licensed",
    name: "API de datos con licencia (placeholder)",
    type: "api",
    url: "", // TODO: endpoint de datos deportivos/eventos con licencia.
    confidence: 0.8,
    referenceOnly: false,
    enabled: false,
    note: "Requiere API key y contrato de licencia (variable de entorno).",
  },
]

/** Fuentes con ingesta automática activa hoy. */
export function getEnabledSources(): RadarSource[] {
  return RADAR_SOURCES.filter((s) => s.enabled)
}

export function getSourceById(id: string): RadarSource | undefined {
  return RADAR_SOURCES.find((s) => s.id === id)
}
