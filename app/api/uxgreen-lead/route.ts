import { NextRequest, NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@medialab.design"
const FROM_EMAIL  = process.env.FROM_EMAIL  || "MediaLab <onboarding@resend.dev>"
const SITE_URL    = process.env.SITE_URL    || "https://medialab.design"
const LOGO_URL    = `${SITE_URL}/images/logo-medialab-400.png`

export async function POST(req: NextRequest) {
  try {
    const { url, email, name } = await req.json()

    if (!url || !email || !String(email).includes("@")) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const site = String(url).trim()
    const clientEmail = String(email).trim()
    const clientName = name ? String(name).trim() : ""

    // No email provider configured → behave gracefully (demo mode)
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

    // ── Email 1: internal notification ──
    const adminHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;color:#1a1a1a}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10)}
  .header{background:linear-gradient(135deg,#0a6b56 0%,#00BFA6 100%);padding:28px 32px;display:flex;align-items:center;gap:16px}
  .header img{height:34px;width:auto}
  .header-text h1{color:#fff;font-size:17px;font-weight:700;margin:0}
  .header-text p{color:rgba(255,255,255,0.75);font-size:12px;margin:4px 0 0}
  .tag{display:inline-block;background:#00BFA6;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:20px}
  .body{padding:32px}
  .field{margin-bottom:18px}
  .field-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0a6b56;margin-bottom:6px}
  .field-value{font-size:14px;color:#333;line-height:1.6;background:#f3faf8;padding:12px 16px;border-radius:8px;border-left:3px solid #00BFA6;white-space:pre-wrap}
  .footer{padding:20px 32px;background:#f8f8f8;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center}
  .footer a{color:#00BFA6;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="MediaLab" />
    <div class="header-text"><h1>Nuevo lead UXGreen™</h1><p>${timestamp}</p></div>
  </div>
  <div class="body">
    <div class="tag">Formulario UXGreen™</div>
    ${clientName ? `<div class="field"><div class="field-label">Nombre</div><div class="field-value">${clientName}</div></div>` : ""}
    <div class="field"><div class="field-label">Sitio web</div><div class="field-value">${site}</div></div>
    <div class="field"><div class="field-label">Correo</div><div class="field-value">${clientEmail}</div></div>
  </div>
  <div class="footer"><a href="${SITE_URL}">${SITE_URL}</a> &nbsp;·&nbsp; MediaLab Ingeniería · Bogotá, Colombia</div>
</div>
</body></html>`

    // ── Email 2: confirmation to the user ──
    const clientHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;color:#1a1a1a}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10)}
  .header{background:linear-gradient(135deg,#0a6b56 0%,#00BFA6 100%);padding:40px 32px;text-align:center}
  .header img{height:42px;width:auto;margin:0 auto 22px;display:block}
  .header h1{color:#fff;font-size:23px;font-weight:700;line-height:1.3;margin-bottom:10px}
  .header p{color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6}
  .body{padding:40px 32px}
  .greeting{font-size:15px;color:#333;line-height:1.7;margin-bottom:26px}
  .highlight{background:#f3faf8;border:1px solid #cdeee6;border-radius:12px;padding:22px;margin-bottom:26px}
  .highlight p{font-size:14px;color:#444;line-height:1.7}
  .steps-title{font-size:13px;font-weight:700;color:#0a6b56;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.06em}
  .step{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
  .step-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00BFA6,#0a6b56);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1}
  .step-text{font-size:14px;color:#555;line-height:1.55;padding-top:4px}
  .step-text strong{color:#1a1a1a}
  .footer{padding:24px 32px;background:#f8f8f8;border-top:1px solid #eee;text-align:center;font-size:12px;color:#aaa}
  .footer a{color:#00BFA6;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="MediaLab" />
    <h1>Estamos analizando tu sitio</h1>
    <p>UXGreen™ by MediaLab Ingeniería</p>
  </div>
  <div class="body">
    <p class="greeting">
      Hola${clientName ? ` ${clientName.split(" ")[0]}` : ""},<br><br>
      Gracias por tu interés en <strong>UXGreen™</strong>. Ya recibimos <strong>${site}</strong> y vamos a analizar
      su eficiencia digital: performance, Core Web Vitals, huella de carbono, accesibilidad, IA y UX.
    </p>

    <div class="highlight">
      <p>
        <strong>Este primer escenario es totalmente gratuito.</strong> Te enviaremos el análisis por correo electrónico.
        Apenas lo tengas, podemos agendar una llamada para contarte exactamente cómo ayudarte a mejorarlo.
      </p>
    </div>

    <p class="steps-title">¿Qué sigue?</p>
    <div class="step"><div class="step-num">1</div><div class="step-text"><strong>Analizamos tu sitio</strong> — medimos las 8 dimensiones del estándar UXGreen™.</div></div>
    <div class="step"><div class="step-num">2</div><div class="step-text"><strong>Te enviamos el reporte gratuito</strong> — con tu score y oportunidades de mejora.</div></div>
    <div class="step"><div class="step-num">3</div><div class="step-text"><strong>Agendamos una llamada</strong> — para mostrarte cómo mejorar tu eficiencia y posicionamiento.</div></div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">medialab.design</a> &nbsp;·&nbsp; MediaLab Ingeniería &nbsp;·&nbsp; Bogotá, Colombia<br>
    <span style="margin-top:6px;display:block">Recibes este correo porque solicitaste un análisis UXGreen™ en nuestro sitio.</span>
  </div>
</div>
</body></html>`

    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: clientEmail,
        subject: `Lead UXGreen™ — ${site}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [clientEmail],
        subject: "Estamos analizando tu sitio — UXGreen™ by MediaLab",
        html: clientHtml,
      }),
    ])

    if (adminResult.status === "rejected") console.error("[uxgreen-lead] Admin email error:", adminResult.reason)
    if (clientResult.status === "rejected") console.error("[uxgreen-lead] Client email error:", clientResult.reason)

    if (adminResult.status === "rejected" && clientResult.status === "rejected") {
      return NextResponse.json({ error: "Error enviando el mensaje" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[uxgreen-lead] Unexpected error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
