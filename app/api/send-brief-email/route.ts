import { NextRequest, NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "co.benavides86@gmail.com"
const FROM_EMAIL = process.env.FROM_EMAIL || "MediaLab <onboarding@resend.dev>"

export async function POST(req: NextRequest) {
  try {
    const { email, idea, industry, referenceUrls, existingBrand, brief, prototype } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }

    // ── Email 1: Admin notification with full brief ──
    const adminEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 640px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #E8751A, #2AABB3); padding: 32px; color: white; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
  .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
  .body { padding: 32px; }
  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #E8751A; margin-bottom: 6px; }
  .field p { margin: 0; font-size: 14px; color: #333; line-height: 1.6; background: #f9f9f9; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #E8751A; }
  .brief-section { background: #fff9f5; border: 1px solid #f0d5b8; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .brief-section h2 { margin: 0 0 16px; font-size: 16px; color: #1a1a1a; }
  .brief-section p { font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 12px; }
  .prototype { background: #f0fbfc; border: 1px solid #b8e8eb; border-radius: 12px; padding: 20px; margin-top: 16px; }
  .prototype h3 { margin: 0 0 10px; font-size: 14px; color: #2AABB3; }
  .prototype p { margin: 0; font-size: 14px; color: #444; line-height: 1.6; }
  .footer { padding: 20px 32px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Nuevo Lead — UXBox Discovery</h1>
    <p>Un prospecto ha enviado su idea de proyecto</p>
  </div>
  <div class="body">
    <div class="field">
      <label>Email del Lead</label>
      <p>${email}</p>
    </div>
    <div class="field">
      <label>Industria</label>
      <p>${industry || "No especificada"}</p>
    </div>
    <div class="field">
      <label>Idea del Proyecto</label>
      <p>${idea}</p>
    </div>
    ${referenceUrls ? `<div class="field"><label>Sitios de Referencia</label><p>${referenceUrls}</p></div>` : ""}
    ${existingBrand ? `<div class="field"><label>Marca / Página Web Existente</label><p>${existingBrand}</p></div>` : ""}

    <div class="brief-section">
      <h2>Brief Formal Generado por IA</h2>
      ${brief.split("\n\n").map((p: string) => `<p>${p}</p>`).join("")}
      <div class="prototype">
        <h3>Prototipo Sugerido</h3>
        <p>${prototype}</p>
      </div>
    </div>
  </div>
  <div class="footer">
    MediaLab Ingeniería · Este brief fue generado automáticamente con IA · ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
  </div>
</div>
</body></html>`

    // ── Email 2: Lead confirmation ──
    const leadEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; color: white; text-align: center; }
  .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 20px; }
  .logo span { background: linear-gradient(90deg, #E8751A, #2AABB3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .header h1 { margin: 0; font-size: 26px; font-weight: 700; line-height: 1.3; }
  .header p { margin: 12px 0 0; opacity: 0.7; font-size: 15px; }
  .body { padding: 40px 32px; }
  .highlight { background: linear-gradient(135deg, #fff5ee, #f0fbfc); border-radius: 12px; padding: 24px; margin-bottom: 28px; border: 1px solid #f0d5b8; }
  .highlight p { margin: 0; font-size: 15px; color: #333; line-height: 1.7; }
  .steps { margin: 24px 0; }
  .step { display: flex; gap: 12px; margin-bottom: 16px; align-items: flex-start; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; background: #E8751A; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .step-text { font-size: 14px; color: #444; line-height: 1.5; padding-top: 4px; }
  .cta { text-align: center; margin: 32px 0; }
  .cta a { display: inline-block; background: linear-gradient(90deg, #E8751A, #c65a10); color: white; padding: 14px 32px; border-radius: 100px; font-size: 14px; font-weight: 600; text-decoration: none; }
  .contact { background: #f9f9f9; border-radius: 12px; padding: 20px; margin-top: 24px; text-align: center; }
  .contact p { margin: 0; font-size: 13px; color: #666; }
  .contact a { color: #E8751A; font-weight: 600; text-decoration: none; }
  .footer { padding: 20px 32px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Media<span>Lab</span></div>
    <h1>Tu idea esta en buenas manos</h1>
    <p>Hemos recibido tu proyecto y estamos muy emocionados de conocerte</p>
  </div>
  <div class="body">
    <div class="highlight">
      <p>Hola,<br><br>Recibimos la descripcion de tu idea y estamos <strong>muy felices de atenderte</strong>. En un plazo de <strong>24 horas</strong> uno de nuestros especialistas se pondra en contacto contigo para dar inicio a tu proceso de discovery.</p>
    </div>

    <p style="font-size: 14px; color: #555; margin: 0 0 16px; font-weight: 600;">Que pasa ahora?</p>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text"><strong>Revision de tu idea</strong> — Nuestro equipo analiza tu proyecto y prepara las preguntas clave para la sesion.</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text"><strong>Llamada de discovery</strong> — Una reunion de 30 minutos para entender a fondo tu vision y contexto.</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text"><strong>Propuesta formal</strong> — Te enviamos un roadmap y propuesta economica personalizada en 48h.</div>
      </div>
    </div>

    <div class="contact">
      <p>Tienes urgencia? Escribenos por WhatsApp<br>
      <a href="https://wa.me/573054009505">+57 305 400 9505</a></p>
    </div>
  </div>
  <div class="footer">
    MediaLab Ingenieria · Bogota, Colombia · <a href="https://medialab.com.co" style="color: #E8751A;">medialab.com.co</a>
  </div>
</div>
</body></html>`

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: true, adminSent: false, leadSent: false, demo: true })
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send both emails
    const [adminResult, leadResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Nuevo Lead UXBox — ${industry || "Sin industria"} — ${email}`,
        html: adminEmailHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Tu idea llego a MediaLab — Te contactamos en 24h",
        html: leadEmailHtml,
      }),
    ])

    const adminOk = adminResult.status === "fulfilled"
    const leadOk = leadResult.status === "fulfilled"

    return NextResponse.json({ success: true, adminSent: adminOk, leadSent: leadOk })
  } catch (err) {
    return NextResponse.json({ error: "Error enviando emails" }, { status: 500 })
  }
}
