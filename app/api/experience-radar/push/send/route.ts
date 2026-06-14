import { NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import { getPushSubscriptions, removePushSubscription } from "@/src/lib/experience-radar/pushStore"

/**
 * Envía un push de "nuevo análisis" a todas las suscripciones guardadas. Protegido con
 * Bearer CRON_SECRET: lo golpeas A MANO después de actualizar las notas. Como las
 * actualizaciones son manuales, no hay disparo automático.
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

  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim()
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim()
  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { ok: false, error: "missing_vapid_keys", hint: "Define VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY." },
      { status: 500 },
    )
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT?.trim() || "mailto:hello@medialab.design", publicKey, privateKey)

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

  const subscriptions = await getPushSubscriptions()
  if (!subscriptions.length) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, note: "sin suscriptores" })
  }

  const data = JSON.stringify(payload)
  let sent = 0
  let failed = 0

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          data,
        )
        sent++
      } catch (error) {
        failed++
        // 404/410 = suscripción caducada o revocada: se limpia del store.
        const statusCode = (error as { statusCode?: number }).statusCode
        if (statusCode === 404 || statusCode === 410) {
          await removePushSubscription(sub.endpoint)
        }
      }
    }),
  )

  return NextResponse.json({ ok: true, sent, failed, total: subscriptions.length }, { headers: { "Cache-Control": "no-store" } })
}
