import { NextRequest, NextResponse } from "next/server"
import { getSessionEmail, getLab, saveLab } from "@/lib/lab-store"
import { publishDelayed, qstashConfigured } from "@/lib/qstash"
import { PHASES, stageReadyAt } from "@/lib/uxbox-phases"

const SITE_URL = process.env.SITE_URL || "https://medialab.design"

/**
 * Programa con QStash un correo diferido por cada fase del motor, relativo al
 * `startedAt` del lab. Idempotente: si ya se programó, no hace nada.
 * Requiere sesión (cookie creada tras verificar el OTP) para confiar en el email.
 */
export async function POST(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("uxbox_session")?.value)
    if (!email) return NextResponse.json({ scheduled: false, reason: "no-session" })

    const lab = await getLab(email)
    if (!lab || !lab.startedAt) return NextResponse.json({ scheduled: false, reason: "no-lab" })
    if (lab.phasesScheduled) return NextResponse.json({ scheduled: true, reason: "already" })
    if (!qstashConfigured()) {
      // Sin QStash: el catch-up al regresar se encarga. No marcamos como programado.
      return NextResponse.json({ scheduled: false, reason: "qstash-not-configured" })
    }

    const callbackUrl = `${SITE_URL}/api/uxbox/phase-email`
    const now = Date.now()
    let enqueued = 0
    for (let stage = 0; stage < PHASES.length; stage += 1) {
      if (PHASES[stage].email === "none") continue
      const delaySeconds = Math.max(0, Math.round((stageReadyAt(lab.startedAt, stage) - now) / 1000))
      const ok = await publishDelayed(callbackUrl, { email, stage }, delaySeconds)
      if (ok) enqueued += 1
    }

    if (enqueued > 0) await saveLab(email, { ...lab, phasesScheduled: true })
    return NextResponse.json({ scheduled: enqueued > 0, enqueued })
  } catch {
    return NextResponse.json({ scheduled: false, reason: "error" }, { status: 500 })
  }
}
