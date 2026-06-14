import { NextRequest, NextResponse } from "next/server"
import { sendRadarPush } from "@/src/lib/experience-radar/pushSend"

/**
 * Envía un push de "nuevo análisis" a todas las suscripciones guardadas. Protegido con
 * Bearer CRON_SECRET. Es el disparo MANUAL; el automático al publicar notas vive en
 * `notifyNewlyPublishedArticles` (lo llama la route del agente diario) y comparte el
 * mismo `sendRadarPush`.
 *
 * Requiere variables de entorno:
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY  (genéralas con: npx web-push generate-vapid-keys)
 *   VAPID_SUBJECT  (mailto:tu@correo o la URL del sitio)
 *
 * Body (JSON, opcional): { title, body, url }.
 */
export const dynamic = "force-dynamic"
export const maxDuration = 60

const DEFAULT_URL = "/experience-radar/mundial-2026"

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim()
  const authorized = req.headers.get("authorization") === `Bearer ${cronSecret}`
  if (cronSecret && !authorized) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  let payload = { title: "Experience Radar — nuevo análisis", body: "Ya está disponible un nuevo análisis del Mundial 2026.", url: DEFAULT_URL }
  try {
    const body = (await req.json()) as Partial<typeof payload>
    payload = {
      title: typeof body.title === "string" && body.title.trim() ? body.title : payload.title,
      body: typeof body.body === "string" && body.body.trim() ? body.body : payload.body,
      url: typeof body.url === "string" && body.url.trim() ? body.url : payload.url,
    }
  } catch {
    // Sin body: se usan los valores por defecto.
  }

  const result = await sendRadarPush(payload)
  if (!result.ok && result.error === "missing_vapid_keys") {
    return NextResponse.json(
      { ok: false, error: "missing_vapid_keys", hint: "Define VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY." },
      { status: 500 },
    )
  }

  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
}
