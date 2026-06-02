import { NextRequest, NextResponse } from "next/server"
import { verifyQstashSignature } from "@/lib/qstash"
import { deliverDuePhaseEmails } from "@/lib/uxbox-emails"

/**
 * Callback de QStash: entrega el correo de la fase indicada (idempotente).
 * Verifica la firma de QStash si hay signing keys configuradas.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()
    const signature =
      req.headers.get("upstash-signature") || req.headers.get("Upstash-Signature")

    const valid = await verifyQstashSignature(signature, raw)
    if (!valid) return NextResponse.json({ ok: false, error: "bad-signature" }, { status: 401 })

    const { email, stage } = JSON.parse(raw || "{}") as { email?: string; stage?: number }
    if (!email || typeof stage !== "number") {
      return NextResponse.json({ ok: false, error: "bad-payload" }, { status: 400 })
    }

    const sent = await deliverDuePhaseEmails(email, stage)
    return NextResponse.json({ ok: true, sent })
  } catch {
    // 200 para que QStash no reintente indefinidamente por un error de datos.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
