/**
 * Helpers de Upstash QStash para los correos diferidos de fin de fase.
 *
 * Degradación elegante: si no está `QSTASH_TOKEN`, `publishDelayed` es no-op
 * (devuelve false) y el sistema cae al modo "catch-up" (los correos pendientes
 * se envían cuando el usuario regresa). La verificación de firma solo se exige
 * si hay signing keys configuradas.
 */

export function qstashConfigured(): boolean {
  return !!process.env.QSTASH_TOKEN
}

/**
 * Encola un POST diferido a `url` con `body` JSON, a entregar dentro de
 * `delaySeconds`. Devuelve true si se encoló.
 */
export async function publishDelayed(
  url: string,
  body: unknown,
  delaySeconds: number,
): Promise<boolean> {
  if (!qstashConfigured()) return false
  try {
    const { Client } = await import("@upstash/qstash")
    const client = new Client({
      token: process.env.QSTASH_TOKEN!,
      // Endpoint regional (p. ej. US). Si no está, usa el default global.
      ...(process.env.QSTASH_URL ? { baseUrl: process.env.QSTASH_URL } : {}),
    })
    await client.publishJSON({
      url,
      body,
      delay: Math.max(0, Math.round(delaySeconds)),
    })
    return true
  } catch {
    return false
  }
}

/**
 * Verifica la firma de un callback de QStash. Si no hay signing keys
 * configuradas, devuelve true (no se puede verificar; se permite el catch-up).
 */
export async function verifyQstashSignature(
  signature: string | null,
  rawBody: string,
): Promise<boolean> {
  const current = process.env.QSTASH_CURRENT_SIGNING_KEY
  const next = process.env.QSTASH_NEXT_SIGNING_KEY
  if (!current && !next) return true
  if (!signature) return false
  try {
    const { Receiver } = await import("@upstash/qstash")
    const receiver = new Receiver({
      currentSigningKey: current || "",
      nextSigningKey: next || "",
    })
    return await receiver.verify({ signature, body: rawBody })
  } catch {
    return false
  }
}
