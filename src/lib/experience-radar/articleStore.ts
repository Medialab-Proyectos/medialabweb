/**
 * Experience Radar — persistencia de ARTÍCULOS.
 *
 * Espeja el patrón de publishInsight.ts: guarda en Vercel KV si está configurado;
 * si no, en .data local. Los artículos generados por el agente diario se guardan
 * aquí y las páginas los leen (con fallback al seed estático).
 *
 * Modo seguro: el estado editorial (draft/reviewed) ya viene resuelto desde
 * generateRadarArticle; este store solo persiste.
 */

import { promises as fs } from "fs"
import path from "path"
import type { RadarArticle } from "./articles"

const ARTICLES_KEY = "experience-radar:articles:latest"
const LOCAL_DIR = path.join(process.cwd(), ".data")
const LOCAL_FILE = path.join(LOCAL_DIR, "experience-radar-articles.json")

export async function saveRadarArticles(articles: RadarArticle[]): Promise<RadarArticle[]> {
  const savedToKv = await saveToKv(articles)
  if (!savedToKv) await saveLocal(articles)
  return articles
}

export async function getStoredRadarArticles(): Promise<RadarArticle[] | null> {
  const fromKv = await readFromKv()
  if (fromKv) return fromKv
  return readLocal()
}

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

async function saveToKv(articles: RadarArticle[]): Promise<boolean> {
  const kv = await getKv()
  if (!kv) return false
  try {
    await kv.set(ARTICLES_KEY, articles)
    return true
  } catch {
    return false
  }
}

async function readFromKv(): Promise<RadarArticle[] | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<RadarArticle[]>(ARTICLES_KEY)) ?? null
  } catch {
    return null
  }
}

async function saveLocal(articles: RadarArticle[]): Promise<void> {
  try {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(articles, null, 2), "utf8")
  } catch {
    // Vercel puede no permitir persistencia local; KV es la ruta de produccion.
  }
}

async function readLocal(): Promise<RadarArticle[] | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8")
    return JSON.parse(raw) as RadarArticle[]
  } catch {
    return null
  }
}
