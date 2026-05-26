import { NextRequest, NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@medialab.design"
const FROM_EMAIL  = process.env.FROM_EMAIL  || "MediaLab <onboarding@resend.dev>"
const SITE_URL    = process.env.SITE_URL    || "https://medialab.design"
const LOGO_URL    = `${SITE_URL}/images/logo-medialab-400.png`

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, linkedin, portfolio, resume, challenge, position } = await req.json()

    if (!name || !phone || !email || !challenge) {
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
  .position-badge{display:inline-block;background:#E8751A;color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:100px;margin-bottom:16px}
  .footer{padding:20px 32px;background:#f8f8f8;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center}
  .footer a{color:#E8751A;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="MediaLab" />
    <div class="header-text">
      <h1>Nueva postulación — Carreras</h1>
      <p>${timestamp}</p>
    </div>
  </div>
  <div class="body">
    <div class="tag">Aplicación de empleo</div>
    <div class="position-badge">${position || "Diseñador/a UX/UI Middle"}</div>
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
    ${linkedin ? `<div class="field"><div class="field-label">LinkedIn</div><div class="field-value"><a href="${linkedin}" style="color:#E8751A">${linkedin}</a></div></div>` : ""}
    ${portfolio ? `<div class="field"><div class="field-label">Portafolio</div><div class="field-value"><a href="${portfolio}" style="color:#E8751A">${portfolio}</a></div></div>` : ""}
    ${resume ? `<div class="field"><div class="field-label">Hoja de vida</div><div class="field-value"><a href="${resume}" style="color:#E8751A">${resume}</a></div></div>` : ""}
    <div class="field">
      <div class="field-label">Mayor reto en UX</div>
      <div class="field-value">${challenge}</div>
    </div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">${SITE_URL}</a> &nbsp;·&nbsp; MediaLab Ingeniería · Bogotá, Colombia
  </div>
</div>
</body></html>`

    // ── Email 2: Confirmación al postulante ──
    const applicantHtml = `<!DOCTYPE html>
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
  .footer{padding:24px 32px;background:#f8f8f8;border-top:1px solid #eee;text-align:center;font-size:12px;color:#aaa}
  .footer a{color:#E8751A;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="MediaLab" />
    <h1>Recibimos tu postulación, ${name.split(" ")[0]}.</h1>
    <p>Estamos revisando tu perfil y te contactaremos pronto.</p>
  </div>
  <div class="body">
    <p class="greeting">
      Hola <strong>${name.split(" ")[0]}</strong>,<br><br>
      Gracias por tu interés en unirte a la familia MediaLab. Tu postulación llegó correctamente
      y ya está siendo revisada por nuestro equipo de talento.
    </p>

    <div class="highlight">
      <p>
        <strong>¿Qué sigue?</strong><br><br>
        Revisamos cada perfil con atención. Si tu experiencia y visión se alinean con
        lo que buscamos, te contactaremos en <strong>máximo 1 semana</strong>
        para una primera conversación.
      </p>
    </div>

    <p class="steps-title">Nuestro proceso de selección</p>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text"><strong>Revisión de perfil</strong> — Evaluamos tu experiencia, portafolio y tu respuesta sobre UX.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text"><strong>Conversación inicial</strong> — 30 min para conocerte, entender tu motivación y compartir nuestra visión.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text"><strong>Challenge técnico</strong> — Un ejercicio real de diseño (max 3h) para ver cómo piensas.</div>
    </div>

    <div class="divider"></div>

    <div class="cta-block">
      <a href="${SITE_URL}/carreras" class="cta-btn">Explorar más sobre MediaLab →</a>
    </div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">medialab.design</a> &nbsp;·&nbsp; MediaLab Ingeniería &nbsp;·&nbsp; Bogotá, Colombia<br>
    <span style="margin-top:6px;display:block">Este correo fue enviado porque aplicaste a una vacante en nuestro sitio web.</span>
  </div>
</div>
</body></html>`

    const [adminResult, applicantResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `Postulación — ${name} · ${position || "Diseñador/a UX/UI Middle"}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Recibimos tu postulación — MediaLab Ingeniería",
        html: applicantHtml,
      }),
    ])

    if (adminResult.status === "rejected") {
      console.error("[careers] Admin email error:", adminResult.reason)
    }
    if (applicantResult.status === "rejected") {
      console.error("[careers] Applicant email error:", applicantResult.reason)
    }

    if (adminResult.status === "rejected" && applicantResult.status === "rejected") {
      return NextResponse.json({ error: "Error enviando la postulación" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[careers] Unexpected error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
