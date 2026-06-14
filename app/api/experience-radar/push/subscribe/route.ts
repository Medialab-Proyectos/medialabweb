import { NextRequest, NextResponse } from "next/server"
import { savePushSubscription, removePushSubscription } from "@/src/lib/experience-radar/pushStore"

/**
 * Alta/baja de suscripciones Web Push del Experience Radar. El navegador del usuario
 * envía aquí su PushSubscription al activar las notificaciones (POST) o al desactivarlas
 * (DELETE). No requiere auth: el endpoint solo guarda/borra el endpoint del propio
 * navegador (no expone datos ni envía nada).
 */
export const dynamic = "force-dynamic"

interface IncomingSubscription {
  endpoint?: string
  keys?: { p256dh?: string; auth?: string }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingSubscription
    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json({ ok: false, error: "invalid_subscription" }, { status: 400 })
    }
    await savePushSubscription({
      endpoint: body.endpoint,
      keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
      subscribedAt: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingSubscription
    if (!body.endpoint) {
      return NextResponse.json({ ok: false, error: "missing_endpoint" }, { status: 400 })
    }
    await removePushSubscription(body.endpoint)
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
