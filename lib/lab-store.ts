/**
 * Persistencia del "lab" de UXBox en Vercel KV (Upstash Redis).
 *
 * Degradación elegante: si no están configuradas las env vars
 * KV_REST_API_URL / KV_REST_API_TOKEN, todas las funciones son no-op
 * (devuelven null / false) y el cliente cae a localStorage. Así el build
 * y el entorno local funcionan sin KV provisionado.
 */
import { randomBytes } from "crypto"

export type StoredLab = {
  email?: string
  idea?: string
  signals?: string[]
  projectName?: string
  references?: string
  objective?: string
  audience?: string
  brief?: string
  prototype?: string
  startedAt?: number
  completedAt?: number
  visits?: number
  /** idioma del usuario al iniciar — define el idioma de los correos de fase */
  lang?: "es" | "en"
  /** índice de la última fase cuyo correo ya se envió (idempotencia). -1 = ninguno */
  lastEmailedStage?: number
  /** true cuando ya se encolaron los mensajes diferidos de QStash */
  phasesScheduled?: boolean
}

const SESSION_TTL = 60 * 60 * 24 * 30 // 30 días
const LAB_TTL = 60 * 60 * 24 * 90 // 90 días

export function kvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function getKv() {
  if (!kvConfigured()) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function saveLab(email: string, lab: StoredLab): Promise<boolean> {
  const kv = await getKv()
  if (!kv) return false
  try {
    await kv.set(`lab:${normalizeEmail(email)}`, lab, { ex: LAB_TTL })
    return true
  } catch {
    return false
  }
}

export async function getLab(email: string): Promise<StoredLab | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<StoredLab>(`lab:${normalizeEmail(email)}`)) ?? null
  } catch {
    return null
  }
}

export async function createSession(email: string): Promise<string | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    const token = randomBytes(24).toString("hex")
    await kv.set(`sess:${token}`, normalizeEmail(email), { ex: SESSION_TTL })
    return token
  } catch {
    return null
  }
}

export async function getSessionEmail(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<string>(`sess:${token}`)) ?? null
  } catch {
    return null
  }
}
