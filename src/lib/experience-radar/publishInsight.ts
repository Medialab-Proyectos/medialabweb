import { promises as fs } from "fs"
import path from "path"
import type { DailyRadarReport } from "./types"

const LATEST_KEY = "experience-radar:latest"
const REPORT_KEY_PREFIX = "experience-radar:report:"
const LOCAL_DIR = path.join(process.cwd(), ".data")
const LOCAL_FILE = path.join(LOCAL_DIR, "experience-radar-latest.json")

export async function publishInsight(report: DailyRadarReport): Promise<DailyRadarReport> {
  const normalized: DailyRadarReport = {
    ...report,
    reviewed: false,
    status: process.env.AUTO_PUBLISH === "true" ? "published" : "draft",
    autoPublished: process.env.AUTO_PUBLISH === "true",
    updatedAt: new Date().toISOString(),
  }

  const savedToKv = await saveToKv(normalized)
  if (!savedToKv) await saveLocal(normalized)
  return normalized
}

export async function getLatestDailyRadarReport(): Promise<DailyRadarReport | null> {
  const fromKv = await readFromKv()
  if (fromKv) return fromKv
  return readLocal()
}

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

async function saveToKv(report: DailyRadarReport): Promise<boolean> {
  const kv = await getKv()
  if (!kv) return false
  try {
    await kv.set(LATEST_KEY, report)
    await kv.set(`${REPORT_KEY_PREFIX}${report.date}`, report)
    return true
  } catch {
    return false
  }
}

async function readFromKv(): Promise<DailyRadarReport | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<DailyRadarReport>(LATEST_KEY)) ?? null
  } catch {
    return null
  }
}

async function saveLocal(report: DailyRadarReport): Promise<void> {
  try {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(report, null, 2), "utf8")
  } catch {
    // Vercel puede no permitir persistencia local; KV es la ruta de produccion.
  }
}

async function readLocal(): Promise<DailyRadarReport | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8")
    return JSON.parse(raw) as DailyRadarReport
  } catch {
    return null
  }
}
