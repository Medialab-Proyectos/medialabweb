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
    const lab = (await req.json()) as StoredLab
    const ok = await saveLab(email, { ...lab, email })
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
