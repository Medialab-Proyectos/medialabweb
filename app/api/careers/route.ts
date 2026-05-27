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
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]><style>table,td{font-family:'Segoe UI',Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f2f5;">
  <tr><td align="center" style="padding:32px 16px;">

    <!-- Email container -->
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">

      <!-- Header -->
      <tr>
        <td align="center" style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);background-color:#1a1a1a;padding:40px 32px;">
          <!-- Logo text rendered as HTML for maximum compatibility -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px auto;">
            <tr>
              <td style="font-family:'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                <span style="color:#2AABB3;">Media</span><span style="color:#F67327;">Lab</span>
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.40);padding-top:4px;">
                Ingeniería
              </td>
            </tr>
          </table>
          <h1 style="margin:0 0 10px 0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3;font-family:'Segoe UI',Arial,sans-serif;">
            Recibimos tu postulación, ${name.split(" ")[0]}.
          </h1>
          <p style="margin:0;color:rgba(255,255,255,0.60);font-size:14px;line-height:1.6;font-family:'Segoe UI',Arial,sans-serif;">
            Estamos revisando tu perfil y te contactaremos pronto.
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:40px 32px;">

          <!-- Greeting -->
          <p style="font-size:15px;color:#333333;line-height:1.7;margin:0 0 28px 0;font-family:'Segoe UI',Arial,sans-serif;">
            Hola <strong>${name.split(" ")[0]}</strong>,<br><br>
            Gracias por tu interés en unirte a la familia MediaLab. Tu postulación llegó correctamente
            y ya está siendo revisada por nuestro equipo de talento.
          </p>

          <!-- Highlight box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
            <tr>
              <td style="background:linear-gradient(135deg,#fff8f3,#f0fbfc);background-color:#fff8f3;border:1px solid #f0d5b8;border-radius:12px;padding:24px;">
                <p style="font-size:14px;color:#444444;line-height:1.7;margin:0;font-family:'Segoe UI',Arial,sans-serif;">
                  <strong style="color:#1a1a1a;">¿Qué sigue?</strong><br><br>
                  Revisamos cada perfil con atención. Si tu experiencia y visión se alinean con
                  lo que buscamos, te contactaremos en <strong style="color:#1a1a1a;">máximo 1 semana</strong>
                  para una primera conversación.
                </p>
              </td>
            </tr>
          </table>

          <!-- Steps title -->
          <p style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 20px 0;text-transform:uppercase;letter-spacing:0.06em;font-family:'Segoe UI',Arial,sans-serif;">
            Nuestro proceso de selección
          </p>

          <!-- Step 1 -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
            <tr>
              <td width="36" valign="top" style="padding-right:14px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="32" height="32" align="center" valign="middle" style="background-color:#E8751A;border-radius:50%;color:#ffffff;font-size:13px;font-weight:700;font-family:'Segoe UI',Arial,sans-serif;line-height:32px;">
                      1
                    </td>
                  </tr>
                </table>
              </td>
              <td valign="top" style="font-size:14px;color:#555555;line-height:1.55;padding-top:6px;font-family:'Segoe UI',Arial,sans-serif;">
                <strong style="color:#1a1a1a;">Revisión de perfil</strong> — Evaluamos tu experiencia, portafolio y tu respuesta sobre UX.
              </td>
            </tr>
          </table>

          <!-- Step 2 -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
            <tr>
              <td width="36" valign="top" style="padding-right:14px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="32" height="32" align="center" valign="middle" style="background-color:#E8751A;border-radius:50%;color:#ffffff;font-size:13px;font-weight:700;font-family:'Segoe UI',Arial,sans-serif;line-height:32px;">
                      2
                    </td>
                  </tr>
                </table>
              </td>
              <td valign="top" style="font-size:14px;color:#555555;line-height:1.55;padding-top:6px;font-family:'Segoe UI',Arial,sans-serif;">
                <strong style="color:#1a1a1a;">Conversación inicial</strong> — 30 min para conocerte, entender tu motivación y compartir nuestra visión.
              </td>
            </tr>
          </table>

          <!-- Step 3 -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
            <tr>
              <td width="36" valign="top" style="padding-right:14px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="32" height="32" align="center" valign="middle" style="background-color:#E8751A;border-radius:50%;color:#ffffff;font-size:13px;font-weight:700;font-family:'Segoe UI',Arial,sans-serif;line-height:32px;">
                      3
                    </td>
                  </tr>
                </table>
              </td>
              <td valign="top" style="font-size:14px;color:#555555;line-height:1.55;padding-top:6px;font-family:'Segoe UI',Arial,sans-serif;">
                <strong style="color:#1a1a1a;">Challenge técnico</strong> — Un ejercicio real de diseño (max 3h) para ver cómo piensas.
              </td>
            </tr>
          </table>

          <!-- Divider -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
            <tr><td style="border-top:1px solid #eeeeee;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding:0 0 8px 0;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${SITE_URL}/carreras" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="50%" strokecolor="#E8751A" fillcolor="#E8751A">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:bold;">Explorar más sobre MediaLab →</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${SITE_URL}/carreras" target="_blank" style="display:inline-block;background-color:#E8751A;color:#ffffff;padding:14px 36px;border-radius:100px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.02em;font-family:'Segoe UI',Arial,sans-serif;mso-hide:all;">
                  Explorar más sobre MediaLab →
                </a>
                <!--<![endif]-->
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 32px;background-color:#f8f8f8;border-top:1px solid #eeeeee;text-align:center;font-size:12px;color:#aaaaaa;font-family:'Segoe UI',Arial,sans-serif;">
          <a href="${SITE_URL}" style="color:#E8751A;text-decoration:none;">medialab.design</a> &nbsp;·&nbsp; MediaLab Ingeniería &nbsp;·&nbsp; Bogotá, Colombia<br>
          <span style="margin-top:6px;display:block;color:#aaaaaa;">Este correo fue enviado porque aplicaste a una vacante en nuestro sitio web.</span>
        </td>
      </tr>

    </table>

  </td></tr>
</table>

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
