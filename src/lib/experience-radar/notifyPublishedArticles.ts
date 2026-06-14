/**
 * Experience Radar — envío AUTOMÁTICO de push al publicar notas.
 *
 * Lo llama la route del agente diario (`/api/experience-radar/run`) DESPUÉS de persistir
 * los artículos. Detecta las notas que ACABAN de volverse accesibles públicamente
 * (en vivo / finalizado) y que no se habían notificado antes, y manda un Web Push:
 *  · 1 nota nueva  → push con su título, enlaza a la nota.
 *  · ≥2 notas      → un solo push "N análisis nuevos", enlaza al índice (evita spam).
 *
 * Idempotencia: guarda los slugs ya notificados (KV en producción, `.data` en local),
 * igual que pushStore/articleStore. Best-effort: cualquier fallo se traga para NO romper
 * la corrida del agente.
 */
import { promises as fs } from "fs"
import path from "path"
import type { RadarArticle } from "./articles"
import { getArticleAvailability } from "./articleAvailability"
import { sendRadarPush, type PushSendResult } from "./pushSend"

const BASE = "/experience-radar/mundial-2026"
const KV_KEY = "experience-radar:notified-slugs"
const LOCAL_DIR = path.join(process.cwd(), ".data")
const LOCAL_FILE = path.join(LOCAL_DIR, "experience-radar-notified.json")

export interface NotifyResult {
  notified: string[]
  push?: PushSendResult
  error?: string
}

/**
 * @param articles  Universo de artículos a evaluar (todos los almacenados + seed).
 */
export async function notifyNewlyPublishedArticles(
  articles: RadarArticle[],
  now: Date = new Date(),
): Promise<NotifyResult> {
  try {
    const accessible = articles.filter((a) => getArticleAvailability(a, now).accessible)
    if (!accessible.length) return { notified: [] }

    const already = new Set(await getNotifiedSlugs())
    const fresh = accessible.filter((a) => !already.has(a.slug))
    if (!fresh.length) return { notified: [] }

    const payload =
      fresh.length === 1
        ? { title: "Experience Radar — nuevo análisis", body: fresh[0].seoTitle, url: `${BASE}/${fresh[0].slug}` }
        : {
            title: "Experience Radar — nuevos análisis",
            body: `Hay ${fresh.length} análisis nuevos del Mundial 2026.`,
            url: BASE,
          }

    const push = await sendRadarPush(payload)
    // Solo se marca como notificado si el envío SÍ se intentó (hay llaves VAPID). Si
    // faltan las llaves, se reintenta en la próxima corrida una vez configuradas.
    if (!push.ok && push.error === "missing_vapid_keys") return { notified: [], push }

    await addNotifiedSlugs([...already], fresh.map((a) => a.slug))
    return { notified: fresh.map((a) => a.slug), push }
  } catch (error) {
    return { notified: [], error: String(error) }
  }
}

/* ───────────────── Store de slugs notificados (KV o local) ───────────────── */

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

async function getNotifiedSlugs(): Promise<string[]> {
  const kv = await getKv()
  if (kv) {
    try {
      return (await kv.get<string[]>(KV_KEY)) ?? []
    } catch {
      return []
    }
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as string[]
  } catch {
    return []
  }
}

async function addNotifiedSlugs(existing: string[], added: string[]): Promise<void> {
  const next = [...new Set([...existing, ...added])]
  const kv = await getKv()
  if (kv) {
    try {
      await kv.set(KV_KEY, next)
      return
    } catch {
      // cae a local
    }
  }
  try {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(next, null, 2), "utf8")
  } catch {
    // Vercel puede no permitir persistencia local; KV es la ruta de producción.
  }
}
