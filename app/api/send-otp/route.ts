import { NextResponse } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email válido es requerido" }, { status: 400 })
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    const hasResend = !!process.env.RESEND_API_KEY

    if (hasResend) {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)

      const data = await resend.emails.send({
        from: process.env.FROM_EMAIL || "MediaLab <onboarding@resend.dev>",
        to: email,
        subject: "Tu PIN de acceso - MediaLab UXBox",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #333;">
            <h1 style="color: #E8751A;">Verifica tu correo</h1>
            <p>Gracias por tu interés en validar tu idea con MediaLab. Usa el siguiente PIN de 4 dígitos para continuar con el proceso:</p>
            <div style="background-color: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${pin}</span>
            </div>
            <p>Si no solicitaste esto, puedes ignorar este correo.</p>
          </div>
        `,
      })

      if (data.error) {
        return NextResponse.json({ error: data.error.message }, { status: 500 })
      }
    }

    // El PIN se guarda en una cookie HttpOnly (no accesible desde JS) y se
    // verifica server-side en /api/verify-otp. En modo demo (sin email real)
    // lo revelamos en la respuesta para que el flujo sea probable y se entienda.
    const res = NextResponse.json({
      success: true,
      demo: !hasResend,
      ...(hasResend ? {} : { pin }),
    })
    res.cookies.set("uxbox_otp", pin, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutos
    })
    return res
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al enviar OTP" }, { status: 500 })
  }
}
