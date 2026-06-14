/**
 * Experience Radar — envío de Web Push reutilizable.
 *
 * Lo usan tanto la route manual (`/api/experience-radar/push/send`) como el envío
 * AUTOMÁTICO al publicar notas (`notifyNewlyPublishedArticles`). Best-effort: si faltan
 * las llaves VAPID o no hay suscriptores, devuelve un resultado sin lanzar. Limpia las
 * suscripciones caducadas/revocadas (404/410) del store.
 *
 * Requiere variables de entorno: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
 */
import webpush from "web-push"
import { getPushSubscriptions, removePushSubscription } from "./pushStore"

export interface RadarPushPayload {
  title: string
  body: string
  url: string
}

export interface PushSendResult {
  ok: boolean
  sent: number
  failed: number
  total: number
  error?: string
}

export async function sendRadarPush(payload: RadarPushPayload): Promise<PushSendResult> {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim()
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim()
  if (!publicKey || !privateKey) {
    return { ok: false, sent: 0, failed: 0, total: 0, error: "missing_vapid_keys" }
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT?.trim() || "mailto:hello@medialab.design",
    publicKey,
    privateKey,
  )

  const subscriptions = await getPushSubscriptions()
  if (!subscriptions.length) {
    return { ok: true, sent: 0, failed: 0, total: 0 }
  }

  const data = JSON.stringify(payload)
  let sent = 0
  let failed = 0

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, data)
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

  return { ok: true, sent, failed, total: subscriptions.length }
}
