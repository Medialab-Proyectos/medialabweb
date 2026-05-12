import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString()

    if (process.env.RESEND_API_KEY) {
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

    return NextResponse.json({ success: true, pin })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al enviar OTP" }, { status: 500 })
  }
}
