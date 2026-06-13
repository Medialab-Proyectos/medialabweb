import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

/**
 * Suscripción al Experience Radar: guarda el correo (Vercel KV si está configurado;
 * si no, en `.data`) y notifica al admin vía Resend. Espeja el patrón de
 * `app/api/asesoria/route.ts` (Resend) y de `articleStore.ts` (KV + `.data`).
 * Sin RESEND_API_KEY responde en modo demo; sin KV cae a archivo local.
 */
export const dynamic = "force-dynamic"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@medialab.design"
const FROM_EMAIL = process.env.FROM_EMAIL || "MediaLab <onboarding@resend.dev>"
const SITE_URL = process.env.SITE_URL || "https://medialab.design"

const KV_KEY = "experience-radar:subscribers"
const LOCAL_DIR = path.join(process.cwd(), ".data")
const LOCAL_FILE = path.join(LOCAL_DIR, "experience-radar-subscribers.json")

interface Subscriber {
  email: string
  source: string
  subscribedAt: string
}

export async function POST(req: NextRequest) {
  try {
    const { email, source = "experience-radar" } = (await req.json()) as {
      email?: string
      source?: string
    }

    const value = (email ?? "").trim().toLowerCase()
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 })
    }

    const subscribers = await getSubscribers()
    const isNew = !subscribers.some((s) => s.email === value)
    if (isNew) {
      subscribers.push({ email: value, source, subscribedAt: new Date().toISOString() })
      await saveSubscribers(subscribers)
    }

    // Notifica al admin solo en altas nuevas, para no duplicar correos.
    if (isNew && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)
        const timestamp = new Date().toLocaleString("es-CO", {
          timeZone: "America/Bogota",
          dateStyle: "full",
          timeStyle: "short",
        })
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: "Nueva suscripción · Experience Radar",
          html: `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a">
            <h2 style="margin:0 0 8px">Nueva suscripción al Experience Radar</h2>
            <p style="margin:0 0 4px"><strong>Correo:</strong> ${value}</p>
            <p style="margin:0 0 4px"><strong>Origen:</strong> ${source}</p>
            <p style="margin:0;color:#777;font-size:12px">${timestamp} · ${SITE_URL}</p>
          </div>`,
        })
      } catch {
        // La persistencia ya ocurrió; un fallo de email no debe romper la suscripción.
      }
    }

    return NextResponse.json({ success: true, demo: !process.env.RESEND_API_KEY })
  } catch {
    return NextResponse.json({ error: "subscribe_failed" }, { status: 500 })
  }
}

/* ───────────────── Persistencia (KV → .data) ───────────────── */

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

async function getSubscribers(): Promise<Subscriber[]> {
  const kv = await getKv()
  if (kv) {
    try {
      return (await kv.get<Subscriber[]>(KV_KEY)) ?? []
    } catch {
      return []
    }
  }
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8")
    return JSON.parse(raw) as Subscriber[]
  } catch {
    return []
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  const kv = await getKv()
  if (kv) {
    try {
      await kv.set(KV_KEY, subscribers)
      return
    } catch {
      // Cae a archivo local si KV falla.
    }
  }
  try {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(subscribers, null, 2), "utf8")
  } catch {
    // Vercel puede no permitir escritura local; KV es la ruta de producción.
  }
}
