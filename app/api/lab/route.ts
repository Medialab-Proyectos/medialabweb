import { NextRequest, NextResponse } from "next/server"
import { getSessionEmail, saveLab, getLab, type StoredLab } from "@/lib/lab-store"

/** Guardar el lab del usuario autenticado (sesión creada tras verificar OTP). */
export async function POST(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("uxbox_session")?.value)
    if (!email) {
      // Sin sesión (o KV no configurado): no-op silencioso; el cliente usa localStorage.
      return NextResponse.json({ saved: false })
    }
    const incoming = (await req.json()) as StoredLab
    const existing = (await getLab(email)) || {}

    // FUSIÓN, no sobrescritura: un cliente con localStorage vacío no debe poder
    // borrar `startedAt`/`brief` del lab ya guardado. JSON.stringify omite las
    // claves `undefined`, así que el spread del entrante solo pisa lo que trae.
    const merged: StoredLab = { ...existing, ...incoming, email }

    // Campos que son propiedad del SERVIDOR: el cliente no puede degradarlos
    // (evita reenvíos de correos o reprogramar fases por accidente).
    merged.lastEmailedStage = Math.max(
      typeof existing.lastEmailedStage === "number" ? existing.lastEmailedStage : -1,
      typeof incoming.lastEmailedStage === "number" ? incoming.lastEmailedStage : -1,
    )
    merged.phasesScheduled = existing.phasesScheduled || incoming.phasesScheduled || false
    // `startedAt` nunca se pierde una vez fijado.
    if (existing.startedAt) merged.startedAt = existing.startedAt

    const ok = await saveLab(email, merged)
    return NextResponse.json({ saved: ok })
  } catch {
    return NextResponse.json({ saved: false }, { status: 500 })
  }
}

/** Leer el lab del usuario autenticado. */
export async function GET(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("uxbox_session")?.value)
    if (!email) return NextResponse.json({ lab: null })
    const lab = await getLab(email)
    return NextResponse.json({ lab })
  } catch {
    return NextResponse.json({ lab: null }, { status: 500 })
  }
}
