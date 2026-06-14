/**
 * Experience Radar — persistencia de SUSCRIPCIONES push (Web Push).
 *
 * Espeja el patrón de articleStore.ts: guarda en Vercel KV si está configurado; si no,
 * en `.data` local. Cada suscripción es el objeto PushSubscription serializado del
 * navegador (endpoint + claves). El `endpoint` es la clave única (un dispositivo/navegador).
 */

import { promises as fs } from "fs"
import path from "path"

export interface StoredPushSubscription {
  endpoint: string
  keys: { p256dh: string; auth: string }
  /** Cuándo se suscribió (ISO). Solo informativo. */
  subscribedAt: string
}

const KV_KEY = "experience-radar:push-subscriptions"
const LOCAL_DIR = path.join(process.cwd(), ".data")
const LOCAL_FILE = path.join(LOCAL_DIR, "experience-radar-push-subscriptions.json")

export async function getPushSubscriptions(): Promise<StoredPushSubscription[]> {
  const fromKv = await readFromKv()
  if (fromKv) return fromKv
  return (await readLocal()) ?? []
}

/** Alta (o actualización) de una suscripción. Idempotente por `endpoint`. */
export async function savePushSubscription(sub: StoredPushSubscription): Promise<void> {
  const current = await getPushSubscriptions()
  const next = [...current.filter((s) => s.endpoint !== sub.endpoint), sub]
  await persist(next)
}

/** Baja de una suscripción por endpoint (al desactivar o si el push caduca). */
export async function removePushSubscription(endpoint: string): Promise<void> {
  const current = await getPushSubscriptions()
  const next = current.filter((s) => s.endpoint !== endpoint)
  if (next.length !== current.length) await persist(next)
}

async function persist(subs: StoredPushSubscription[]): Promise<void> {
  const savedToKv = await saveToKv(subs)
  if (!savedToKv) await saveLocal(subs)
}

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

async function saveToKv(subs: StoredPushSubscription[]): Promise<boolean> {
  const kv = await getKv()
  if (!kv) return false
  try {
    await kv.set(KV_KEY, subs)
    return true
  } catch {
    return false
  }
}

async function readFromKv(): Promise<StoredPushSubscription[] | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<StoredPushSubscription[]>(KV_KEY)) ?? null
  } catch {
    return null
  }
}

async function saveLocal(subs: StoredPushSubscription[]): Promise<void> {
  try {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(subs, null, 2), "utf8")
  } catch {
    // Vercel puede no permitir persistencia local; KV es la ruta de producción.
  }
}

async function readLocal(): Promise<StoredPushSubscription[] | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8")
    return JSON.parse(raw) as StoredPushSubscription[]
  } catch {
    return null
  }
}
