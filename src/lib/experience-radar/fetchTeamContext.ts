/**
 * Experience Radar — contexto editorial de cada selección.
 *
 * Cuando las señales del día traen poca información (p. ej. Estados Unidos sin
 * conversación reciente), el agente necesita material coherente para redactar. Este
 * módulo trae contexto BREVE y verificable de cada selección desde Wikipedia (REST
 * summary API, gratis y estable) y deja una referencia a WinSports para seguimiento.
 *
 * Es best-effort: timeout corto y tolerante a fallos para no romper el cron de 60 s.
 * NUNCA inventa: si no hay dato, devuelve null y el agente cae a su respaldo determinista.
 */

export interface TeamContext {
  team: string
  /** 1–3 frases de contexto factual de la selección. */
  summary: string
  sourceUrl?: string
  sourceName?: string
}

/** Títulos de Wikipedia (ES) por selección, cuando el genérico no aplica. */
const WIKI_TITLE_OVERRIDES: Record<string, string> = {
  "estados unidos": "Selección de fútbol de Estados Unidos",
  usa: "Selección de fútbol de Estados Unidos",
  inglaterra: "Selección de fútbol de Inglaterra",
  "corea del sur": "Selección de fútbol de Corea del Sur",
  "países bajos": "Selección de fútbol de los Países Bajos",
  "bosnia y herzegovina": "Selección de fútbol de Bosnia y Herzegovina",
}

function wikiTitle(team: string): string {
  const key = team.trim().toLowerCase()
  return WIKI_TITLE_OVERRIDES[key] ?? `Selección de fútbol de ${team.trim()}`
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "MediaLab-ExperienceRadar/1.0 (https://medialab.design)" },
    })
  } finally {
    clearTimeout(id)
  }
}

/** Contexto de UNA selección desde Wikipedia. null si no hay dato fiable. */
export async function fetchTeamContext(team: string, timeoutMs = 3000): Promise<TeamContext | null> {
  const title = wikiTitle(team)
  const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  try {
    const res = await fetchWithTimeout(url, timeoutMs)
    if (!res.ok) return null
    const data = (await res.json()) as {
      extract?: string
      type?: string
      content_urls?: { desktop?: { page?: string } }
    }
    const extract = (data.extract ?? "").trim()
    // Descarta páginas de desambiguación o extractos vacíos/demasiado cortos.
    if (!extract || data.type === "disambiguation" || extract.length < 40) return null
    return {
      team,
      summary: extract.length > 600 ? `${extract.slice(0, 600)}…` : extract,
      sourceUrl: data.content_urls?.desktop?.page,
      sourceName: "Wikipedia",
    }
  } catch {
    return null
  }
}

/** Contexto de varias selecciones en paralelo, tolerante a fallos individuales. */
export async function fetchTeamsContext(teams: string[]): Promise<TeamContext[]> {
  const unique = Array.from(new Set(teams.map((t) => t.trim()))).filter(Boolean)
  const results = await Promise.allSettled(unique.map((t) => fetchTeamContext(t)))
  return results.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []))
}

/** Enlace de seguimiento a WinSports (no se hace scraping; se ofrece como referencia). */
export function winSportsReference(): { name: string; url: string } {
  return { name: "WinSports", url: "https://www.winsports.co/" }
}
