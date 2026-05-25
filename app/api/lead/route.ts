import { NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "co.benavides86@gmail.com"
const FROM_EMAIL = process.env.FROM_EMAIL || "MediaLab <onboarding@resend.dev>"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { email, goal, source } = await req.json()
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email válido es requerido" }, { status: 400 })
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Nuevo lead — ${source || "Kit Discovery UX + IA"} — ${email}`,
        html: `<div style="font-family:sans-serif"><h2>Nuevo lead del kit</h2>
          <p><b>Email:</b> ${email}</p>
          <p><b>Objetivo:</b> ${goal || "No especificado"}</p>
          <p><b>Origen:</b> ${source || "Kit Discovery UX + IA"}</p></div>`,
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, demo: !process.env.RESEND_API_KEY })
  } catch {
    return NextResponse.json({ error: "Error procesando el lead" }, { status: 500 })
  }
}
