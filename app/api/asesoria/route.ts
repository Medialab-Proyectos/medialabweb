import { NextRequest, NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@medialab.design"
const FROM_EMAIL  = process.env.FROM_EMAIL  || "MediaLab <onboarding@resend.dev>"
const SITE_URL    = process.env.SITE_URL    || "https://medialab.design"
const LOGO_URL    = `${SITE_URL}/images/logo-medialab-400.png`

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, source = "chatbot" } = await req.json()

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 })
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

    const firstName = name.split(" ")[0]

    // ── Email al admin: nuevo lead de asesoría ──
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
      <h1>Nueva solicitud de asesoría 1:1</h1>
      <p>${timestamp}</p>
    </div>
  </div>
  <div class="body">
    <div class="tag">Asesoría 1:1 · ${source}</div>
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
    <div class="field">
      <div class="field-label">Origen</div>
      <div class="field-value">${source}</div>
    </div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">${SITE_URL}</a> &nbsp;·&nbsp; MediaLab Ingeniería · Bogotá, Colombia
  </div>
</div>
</body></html>`

    // ── Email al usuario: motivacional con beneficios del curso ──
    const userHtml = `<!DOCTYPE html>
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
  .highlight p{font-size:14px;color:#444;line-height:1.7;margin:0}
  .section-title{font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:18px;text-transform:uppercase;letter-spacing:0.06em}
  .benefit{margin-bottom:16px;padding-left:4px}
  .benefit-row{display:flex;gap:12px;align-items:flex-start}
  .benefit-emoji{font-size:20px;line-height:1;flex-shrink:0;width:28px;text-align:center}
  .benefit-text{font-size:14px;color:#555;line-height:1.6;padding-top:2px}
  .benefit-text strong{color:#1a1a1a}
  .access-card{background:linear-gradient(135deg,#f0fbfc,#f3f0ff);border:1px solid #d4e8eb;border-radius:12px;padding:24px;margin-top:28px;margin-bottom:28px}
  .access-item{margin-bottom:14px;padding-left:4px}
  .access-item:last-child{margin-bottom:0}
  .access-row{display:flex;gap:12px;align-items:flex-start}
  .access-emoji{font-size:20px;line-height:1;flex-shrink:0;width:28px;text-align:center}
  .access-text{font-size:14px;color:#555;line-height:1.6;padding-top:2px}
  .access-text strong{color:#1a1a1a}
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
    <h1>Gracias por querer crecer con nosotros, ${firstName}.</h1>
    <p>Pronto nos contactaremos contigo para agendar tu asesoría 1:1</p>
  </div>
  <div class="body">
    <p class="greeting">
      Hola <strong>${firstName}</strong>,<br><br>
      Recibimos tu solicitud y estamos emocionados de acompañarte.
      Nuestro equipo se pondrá en contacto contigo en las próximas <strong>24 horas</strong> para coordinar tu sesión personalizada.
    </p>

    <div class="highlight">
      <p>
        <strong>Mientras tanto, conoce lo que te espera:</strong><br><br>
        Nuestro curso <strong>AI Experience Architect</strong> está diseñado para que en
        <strong>8 semanas</strong> aprendas a crear productos digitales reales con inteligencia artificial.
      </p>
    </div>

    <p class="section-title">🎯 Lo que vas a lograr</p>

    <div class="benefit">
      <div class="benefit-row">
        <div class="benefit-emoji">🧠</div>
        <div class="benefit-text"><strong>Estructurar productos con IA</strong> — Aprende a definir problemas, validar hipótesis y diseñar soluciones funcionales desde el día uno.</div>
      </div>
    </div>
    <div class="benefit">
      <div class="benefit-row">
        <div class="benefit-emoji">💬</div>
        <div class="benefit-text"><strong>Dominar prompt design para UX</strong> — Crea interfaces conversacionales, flujos adaptativos y experiencias inteligentes.</div>
      </div>
    </div>
    <div class="benefit">
      <div class="benefit-row">
        <div class="benefit-emoji">🧪</div>
        <div class="benefit-text"><strong>Validar antes de invertir</strong> — Construye prototipos funcionales y pruébalos con usuarios reales antes de escribir una línea de código.</div>
      </div>
    </div>
    <div class="benefit">
      <div class="benefit-row">
        <div class="benefit-emoji">🏅</div>
        <div class="benefit-text"><strong>Certificación profesional</strong> — Sales como Arquitecto de Experiencia de Usuario con IA, listo para el mercado.</div>
      </div>
    </div>

    <div class="access-card">
      <p class="section-title" style="color:#2AABB3;margin-bottom:18px">🚀 Además tendrás acceso a</p>

      <div class="access-item">
        <div class="access-row">
          <div class="access-emoji">🛠️</div>
          <div class="access-text"><strong>Herramientas de IA profesionales</strong> — Acceso a las plataformas y herramientas que usan los expertos en la industria para diseñar y prototipar productos digitales.</div>
        </div>
      </div>
      <div class="access-item">
        <div class="access-row">
          <div class="access-emoji">🤝</div>
          <div class="access-text"><strong>Comunidad activa</strong> — Una red de profesionales lista para sugerencias, networking y oportunidades de empleo. Conecta con quienes ya están transformando la industria.</div>
        </div>
      </div>
      <div class="access-item">
        <div class="access-row">
          <div class="access-emoji">📄</div>
          <div class="access-text"><strong>Visibilidad profesional</strong> — Te enseñamos a presentar tu currículum y portafolio para que las industrias te encuentren. Prepárate para ser visible en el mercado laboral.</div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <p style="text-align:center;font-size:14px;color:#555;margin-bottom:20px">
      Si no quieres esperar y ya estás listo, inscríbete directamente:
    </p>

    <div class="cta-block">
      <a href="${SITE_URL}/curso#registro" class="cta-btn">Inscribirme ahora →</a>
    </div>

    <div class="contact-alt">
      <p>¿Tienes preguntas? Escríbenos directamente:</p>
      <a href="mailto:hello@medialab.design">hello@medialab.design</a> &middot;
      <a href="https://wa.me/573054009505">WhatsApp</a>
    </div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">medialab.design</a> &nbsp;·&nbsp; MediaLab Ingeniería &nbsp;·&nbsp; Bogotá, Colombia<br>
    <span style="margin-top:6px;display:block">Este correo fue enviado porque solicitaste una asesoría 1:1 desde nuestro sitio web.</span>
  </div>
</div>
</body></html>`

    const [adminResult, userResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `Nueva asesoría 1:1 — ${name}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: `Pronto nos contactaremos, ${firstName} — MediaLab`,
        html: userHtml,
      }),
    ])

    if (adminResult.status === "rejected") {
      console.error("[asesoria] Admin email error:", adminResult.reason)
    }
    if (userResult.status === "rejected") {
      console.error("[asesoria] User email error:", userResult.reason)
    }

    return NextResponse.json({
      success: true,
      adminSent: adminResult.status === "fulfilled",
      userSent: userResult.status === "fulfilled",
    })
  } catch (err) {
    console.error("[asesoria] Unexpected error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
