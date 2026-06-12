/**
 * Experience Radar — ingesta de señales.
 *
 * Obtiene señales desde las fuentes AUTORIZADAS y activas (ver sources.ts).
 * Mientras no haya feeds conectados, devuelve las señales mock locales.
 *
 * Cumplimiento: nunca hace scraping no autorizado ni copia artículos completos.
 * Los conectores RSS/API quedan como placeholders explícitos.
 */

import { getEnabledSources } from "./sources"
import { mockSignals } from "./mockSignals"
import type { Signal } from "./types"

export interface FetchOptions {
  /** Forzar uso de mock aunque haya fuentes activas (útil en build/preview). */
  useMock?: boolean
}

/**
 * Lee las señales del día desde las fuentes habilitadas.
 * Hoy: solo la curaduría manual está activa, así que devuelve mock.
 */
export async function fetchSignals(opts: FetchOptions = {}): Promise<Signal[]> {
  if (opts.useMock) return mockSignals

  const sources = getEnabledSources()
  const collected: Signal[] = []

  for (const source of sources) {
    try {
      if (source.type === "manual") {
        // La curaduría manual hoy se materializa como las señales mock revisadas.
        collected.push(...mockSignals)
        continue
      }

      if (source.type === "rss") {
        // TODO: parsear RSS autorizado → mapear a Signal (solo título/resumen/enlace).
        // const items = await fetchRssAuthorized(source.url)
        continue
      }

      if (source.type === "api") {
        // TODO: consultar API con licencia usando su API key (variable de entorno).
        // const data = await fetchLicensedApi(source.url, process.env.RADAR_API_KEY)
        continue
      }
    } catch {
      // Una fuente caída no debe romper la ingesta completa.
      continue
    }
  }

  // Fallback seguro: si ninguna fuente aportó datos, usar mock.
  return collected.length > 0 ? collected : mockSignals
}
