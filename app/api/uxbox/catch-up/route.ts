import { NextRequest, NextResponse } from "next/server"
import { getSessionEmail, getLab } from "@/lib/lab-store"
import { deliverDuePhaseEmails } from "@/lib/uxbox-emails"
import { doneStageByElapsed } from "@/lib/uxbox-phases"

/**
 * Red de seguridad: al regresar el usuario, envía los correos de las fases que
 * ya deberían estar completas según el tiempo transcurrido y aún no se enviaron.
 * Cubre el caso sin QStash y los mensajes que se hayan perdido. Idempotente.
 */
export async function POST(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("uxbox_session")?.value)
    if (!email) return NextResponse.json({ sent: 0, reason: "no-session" })

    const lab = await getLab(email)
    if (!lab || !lab.startedAt) return NextResponse.json({ sent: 0, reason: "no-lab" })

    const done = doneStageByElapsed(lab.startedAt, Date.now())
    if (done < 0) return NextResponse.json({ sent: 0, reason: "no-phase-due" })

    const sent = await deliverDuePhaseEmails(email, done)
    return NextResponse.json({ sent })
  } catch {
    return NextResponse.json({ sent: 0, reason: "error" }, { status: 500 })
  }
}
