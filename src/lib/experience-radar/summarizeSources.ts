/**
 * Experience Radar — resumen de fuentes con IA (HOOK / TODO).
 *
 * Pensado para que el editor conecte su cuenta de OpenAI y resuma las fuentes
 * consultadas con una "voz de influencia" basada en los principios de Cialdini
 * (reciprocidad, prueba social, autoridad, escasez, compromiso/coherencia,
 * simpatía) — siempre de forma ética y sin manipular.
 *
 * Estado: NO cableado al runtime. Es un placeholder listo para activarse.
 *  - Si existe process.env.OPENAI_API_KEY → descomentar el bloque de OpenAI.
 *  - Si no existe → usa el resumen por reglas (sin costo, determinista).
 *
 * Modo seguro: el resultado debe tratarse como borrador (reviewed:false) hasta
 * revisión humana, igual que el resto del módulo.
 */

import type { SourceUsage } from "./types"

export interface SourceSummary {
  /** Resumen breve con voz de influencia (Cialdini). */
  text: string
  /** Principio de Cialdini predominante usado. */
  principle:
    | "prueba-social"
    | "autoridad"
    | "escasez"
    | "reciprocidad"
    | "compromiso"
    | "simpatia"
  /** true si lo generó la IA; false si es el fallback por reglas. */
  aiGenerated: boolean
}

/**
 * Resume las fuentes consultadas. Hoy devuelve el fallback por reglas.
 * Para activar la IA, define OPENAI_API_KEY y descomenta el bloque marcado.
 */
export async function summarizeSourcesWithInfluence(
  sources: SourceUsage[],
  opts: { lang?: "es" | "en" } = {},
): Promise<SourceSummary> {
  const lang = opts.lang ?? "es"

  // TODO(IA): integración con OpenAI (SDK ya presente en package.json).
  // if (process.env.OPENAI_API_KEY) {
  //   const OpenAI = (await import("openai")).default
  //   const client = new OpenAI()
  //   const completion = await client.chat.completions.create({
  //     model: "gpt-4o-mini",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "Eres editor de MediaLab. Resume las fuentes en 2-3 frases con una voz " +
  //           "de influencia ética basada en Cialdini (prueba social, autoridad, escasez). " +
  //           "No manipules, no inventes datos, no menciones apuestas.",
  //       },
  //       { role: "user", content: JSON.stringify(sources.map((s) => ({ name: s.name, type: s.type, items: s.itemCount }))) },
  //     ],
  //   })
  //   return { text: completion.choices[0]?.message?.content ?? ruleBased(sources, lang), principle: "prueba-social", aiGenerated: true }
  // }

  return ruleBasedSummary(sources, lang)
}

/** Fallback por reglas (sin IA): voz de prueba social + autoridad, honesta. */
function ruleBasedSummary(sources: SourceUsage[], lang: "es" | "en"): SourceSummary {
  const active = sources.filter((s) => s.ok)
  const totalItems = active.reduce((sum, s) => sum + (s.itemCount || 0), 0)
  const names = active.slice(0, 3).map((s) => s.name)

  const text =
    lang === "es"
      ? `Cruzamos ${active.length} fuentes verificadas (${names.join(", ")}) y ${totalItems} señales del día. Miles de fans ya están en esta conversación: aquí la leemos en clave de experiencia, no de marcador.`
      : `We cross-checked ${active.length} verified sources (${names.join(", ")}) and ${totalItems} signals today. Thousands of fans are already in this conversation: here we read it through experience, not the scoreboard.`

  return { text, principle: "prueba-social", aiGenerated: false }
}
