import { NextRequest, NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@medialab.design"
const FROM_EMAIL  = process.env.FROM_EMAIL  || "MediaLab <onboarding@resend.dev>"
const SITE_URL    = process.env.SITE_URL    || "https://medialab.design"
const LOGO_URL    = `${SITE_URL}/images/logo-medialab-400.png`

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, message } = await req.json()

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: true, demo: true })
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const timestamp = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "full",
      timeStyle: "short",
    })

    // ── Email 1: Notificación interna a hello@medialab.design ──
    const adminHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;color:#1a1a1a}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10)}
  .header{background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:28px 32px;display:flex;align-items:center;gap:16px}
  .header img{height:36px;width:auto}
  .header-text h1{color:#fff;font-size:17px;font-weight:700;margin:0}
  .header-text p{color:rgba(255,255,255,0.55);font-size:12px;margin:4px 0 0}
  .tag{display:inline-block;background:linear-gradient(90deg,#E8751A,#2AABB3);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:20px}
  .body{padding:32px}
  .field{margin-bottom:18px}
  .field-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#E8751A;margin-bottom:6px}
  .field-value{font-size:14px;color:#333;line-height:1.6;background:#f8f8f8;padding:12px 16px;border-radius:8px;border-left:3px solid #E8751A;white-space:pre-wrap}
  .footer{padding:20px 32px;background:#f8f8f8;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center}
  .footer a{color:#E8751A;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="MediaLab" />
    <div class="header-text">
      <h1>Nuevo contacto desde la web</h1>
      <p>${timestamp}</p>
    </div>
  </div>
  <div class="body">
    <div class="tag">Formulario de contacto</div>
    <div class="field">
      <div class="field-label">Nombre</div>
      <div class="field-value">${name}</div>
    </div>
    <div class="field">
      <div class="field-label">Email</div>
      <div class="field-value">${email}</div>
    </div>
    <div class="field">
      <div class="field-label">Teléfono / WhatsApp</div>
      <div class="field-value">${phone}</div>
    </div>
    ${company ? `<div class="field"><div class="field-label">Empresa</div><div class="field-value">${company}</div></div>` : ""}
    <div class="field">
      <div class="field-label">Mensaje</div>
      <div class="field-value">${message}</div>
    </div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">${SITE_URL}</a> &nbsp;·&nbsp; MediaLab Ingeniería · Bogotá, Colombia
  </div>
</div>
</body></html>`

    // ── Email 2: Confirmación al cliente ──
    const clientHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;color:#1a1a1a}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10)}
  .header{background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:40px 32px;text-align:center}
  .header img{height:44px;width:auto;margin-bottom:24px;display:block;margin-left:auto;margin-right:auto}
  .header h1{color:#fff;font-size:24px;font-weight:700;line-height:1.3;margin-bottom:10px}
  .header p{color:rgba(255,255,255,0.60);font-size:14px;line-height:1.6}
  .body{padding:40px 32px}
  .greeting{font-size:15px;color:#333;line-height:1.7;margin-bottom:28px}
  .highlight{background:linear-gradient(135deg,#fff8f3,#f0fbfc);border:1px solid #f0d5b8;border-radius:12px;padding:24px;margin-bottom:28px}
  .highlight p{font-size:14px;color:#444;line-height:1.7}
  .steps-title{font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.06em}
  .step{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
  .step-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#E8751A,#c65a10);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1}
  .step-text{font-size:14px;color:#555;line-height:1.55;padding-top:4px}
  .step-text strong{color:#1a1a1a}
  .divider{height:1px;background:#eee;margin:28px 0}
  .cta-block{text-align:center;margin:28px 0}
  .cta-btn{display:inline-block;background:linear-gradient(90deg,#E8751A,#c65a10);color:#fff;padding:14px 36px;border-radius:100px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.02em}
  .contact-alt{background:#f8f8f8;border-radius:12px;padding:20px;text-align:center;margin-top:24px}
  .contact-alt p{font-size:13px;color:#777;margin-bottom:8px}
  .contact-alt a{color:#E8751A;font-weight:600;text-decoration:none}
  .footer{padding:24px 32px;background:#f8f8f8;border-top:1px solid #eee;text-align:center;font-size:12px;color:#aaa}
  .footer a{color:#E8751A;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="MediaLab" />
    <h1>Recibimos tu mensaje, ${name.split(" ")[0]}.</h1>
    <p>Estamos revisando tu proyecto y te contactaremos pronto.</p>
  </div>
  <div class="body">
    <p class="greeting">
      Hola <strong>${name.split(" ")[0]}</strong>,<br><br>
      Gracias por escribirnos. Tu mensaje llegó correctamente y ya está en manos de nuestro equipo.
      Revisamos cada caso con atención antes de responder, para llegar preparados a la conversación.
    </p>

    <div class="highlight">
      <p>
        <strong>¿Cuánto demora la respuesta?</strong><br><br>
        Respondemos en <strong>menos de 24 horas hábiles</strong>. Si tu proyecto es urgente,
        puedes escribirnos directamente por WhatsApp y atendemos de inmediato.
      </p>
    </div>

    <p class="steps-title">¿Qué pasa ahora?</p>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text"><strong>Revisamos tu proyecto</strong> — Nuestro equipo lee tu mensaje y prepara las preguntas clave.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text"><strong>Te contactamos</strong> — Un especialista se comunicará contigo en menos de 24 h.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text"><strong>Sesión gratuita de 30 min</strong> — Entendemos tu desafío y te mostramos exactamente cómo podemos ayudarte.</div>
    </div>

    <div class="divider"></div>

    <div class="cta-block">
      <a href="${SITE_URL}" class="cta-btn">Explorar medialab.design →</a>
    </div>

    <div class="contact-alt">
      <p>¿Tienes urgencia? Escríbenos directamente:</p>
      <a href="https://wa.me/573054009505">WhatsApp: +57 305 400 9505</a>
    </div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">medialab.design</a> &nbsp;·&nbsp; MediaLab Ingeniería &nbsp;·&nbsp; Bogotá, Colombia<br>
    <span style="margin-top:6px;display:block">Este correo fue enviado porque completaste el formulario de contacto en nuestro sitio web.</span>
  </div>
</div>
</body></html>`

    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `Contacto web — ${name}${company ? ` · ${company}` : ""}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Recibimos tu mensaje — MediaLab te responde en 24h",
        html: clientHtml,
      }),
    ])

    if (adminResult.status === "rejected") {
      console.error("[contact] Admin email error:", adminResult.reason)
    }
    if (clientResult.status === "rejected") {
      console.error("[contact] Client email error:", clientResult.reason)
    }

    if (adminResult.status === "rejected" && clientResult.status === "rejected") {
      return NextResponse.json({ error: "Error enviando el mensaje" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[contact] Unexpected error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
