/**
 * Experience Radar — contador de LIKES por nota, COMPARTIDO entre todos los visitantes.
 *
 * Espeja el patrón de articleStore/pushStore: usa Vercel KV si está configurado (conteo
 * atómico con INCRBY); si no, cae a un archivo `.data` local. La primera vez que se consulta
 * una nota, se siembra con un valor base determinista por slug para no arrancar en 0 (mantiene
 * la prueba social que ya mostraba la UI); a partir de ahí los likes son reales y globales.
 */

import { promises as fs } from "fs"
import path from "path"

const LOCAL_DIR = path.join(process.cwd(), ".data")
const LOCAL_FILE = path.join(LOCAL_DIR, "experience-radar-likes.json")
const kvKey = (slug: string) => `experience-radar:likes:${slug}`

/** Valor inicial determinista por slug (igual hash que usaba la UI). Solo siembra el contador. */
export function baseSeed(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 33 + slug.charCodeAt(i)) % 1501
  return hash
}

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

/** Conteo actual de likes de una nota (sembrando el valor base si aún no existe). */
export async function getLikeCount(slug: string): Promise<number> {
  const kv = await getKv()
  if (kv) {
    try {
      const current = await kv.get<number>(kvKey(slug))
      if (typeof current === "number") return current
      const seed = baseSeed(slug)
      await kv.set(kvKey(slug), seed)
      return seed
    } catch {
      return baseSeed(slug)
    }
  }
  const map = await readLocal()
  if (typeof map[slug] === "number") return map[slug]
  const seed = baseSeed(slug)
  map[slug] = seed
  await writeLocal(map)
  return seed
}

/** Aplica un cambio (+1 / -1) y devuelve el nuevo conteo (nunca baja de 0). */
export async function changeLike(slug: string, delta: number): Promise<number> {
  const step = delta >= 0 ? 1 : -1
  const kv = await getKv()
  if (kv) {
    try {
      // Asegura el valor base antes de incrementar, para no partir de 0.
      const current = await kv.get<number>(kvKey(slug))
      if (typeof current !== "number") await kv.set(kvKey(slug), baseSeed(slug))
      const next = await kv.incrby(kvKey(slug), step)
      if (next < 0) {
        await kv.set(kvKey(slug), 0)
        return 0
      }
      return next
    } catch {
      return getLikeCount(slug)
    }
  }
  const map = await readLocal()
  const current = typeof map[slug] === "number" ? map[slug] : baseSeed(slug)
  const next = Math.max(0, current + step)
  map[slug] = next
  await writeLocal(map)
  return next
}

async function readLocal(): Promise<Record<string, number>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Record<string, number>
  } catch {
    return {}
  }
}

async function writeLocal(map: Record<string, number>): Promise<void> {
  try {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(map, null, 2), "utf8")
  } catch {
    // Vercel puede no permitir persistencia local; KV es la ruta de producción.
  }
}
