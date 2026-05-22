import { NextRequest, NextResponse } from "next/server"

const COURSE_EMAIL = "info@medialab.design"
const FROM_EMAIL = process.env.FROM_EMAIL || "MediaLab <onboarding@resend.dev>"

export async function POST(req: NextRequest) {
  try {
    const { name, email, role, experience, motivation, lang = "es" } = await req.json()
    const isEn = lang === "en"

    if (!name || !email) {
      return NextResponse.json({ error: isEn ? "Name and email are required" : "Nombre y email son requeridos" }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: isEn ? "Invalid email" : "Email no valido" }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString(isEn ? "en-US" : "es-CO", { timeZone: "America/Bogota" })

    // Admin notification email
    const adminHtml = `
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
  .footer { padding: 20px 32px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Nueva Inscripcion — Curso AI Experience Architect</h1>
    <p>Un nuevo estudiante quiere registrarse al curso</p>
  </div>
  <div class="body">
    <div class="field">
      <label>Nombre completo</label>
      <p>${name}</p>
    </div>
    <div class="field">
      <label>Email</label>
      <p>${email}</p>
    </div>
    <div class="field">
      <label>Rol profesional</label>
      <p>${role || "No especificado"}</p>
    </div>
    <div class="field">
      <label>Experiencia con IA</label>
      <p>${experience || "No especificada"}</p>
    </div>
    ${motivation ? `<div class="field"><label>Motivacion</label><p>${motivation}</p></div>` : ""}
  </div>
  <div class="footer">
    MediaLab Ingenieria · Registro de curso · ${timestamp}
  </div>
</div>
</body></html>`

    // Confirmation email to student (bilingual)
    const studentHtml = `
<!DOCTYPE html>
<html lang="${isEn ? "en" : "es"}">
<head><meta charset="UTF-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; color: white; text-align: center; }
  .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 20px; }
  .logo span { background: linear-gradient(90deg, #E8751A, #2AABB3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 700; line-height: 1.3; }
  .header p { margin: 12px 0 0; opacity: 0.7; font-size: 15px; }
  .body { padding: 40px 32px; }
  .highlight { background: linear-gradient(135deg, #fff5ee, #f0fbfc); border-radius: 12px; padding: 24px; margin-bottom: 28px; border: 1px solid #f0d5b8; }
  .highlight p { margin: 0; font-size: 15px; color: #333; line-height: 1.7; }
  .info-box { background: #f9f9f9; border-radius: 12px; padding: 20px; margin: 20px 0; }
  .info-box h3 { margin: 0 0 12px; font-size: 14px; color: #1a1a1a; font-weight: 700; }
  .info-item { display: flex; gap: 8px; margin-bottom: 8px; font-size: 14px; color: #555; }
  .contact { background: #f9f9f9; border-radius: 12px; padding: 20px; margin-top: 24px; text-align: center; }
  .contact p { margin: 0; font-size: 13px; color: #666; }
  .contact a { color: #E8751A; font-weight: 600; text-decoration: none; }
  .footer { padding: 20px 32px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Media<span>Lab</span></div>
    <h1>${isEn ? "Your registration has been received" : "Tu registro ha sido recibido"}</h1>
    <p>AI Experience Architect &mdash; UX Prompt Design</p>
  </div>
  <div class="body">
    <div class="highlight">
      <p>${isEn
        ? `Hi <strong>${name}</strong>,<br><br>We've received your registration for the <strong>AI Experience Architect</strong> course. Our team will review your profile and contact you within <strong>48 hours</strong> with enrollment details, payment methods, and start date.`
        : `Hola <strong>${name}</strong>,<br><br>Hemos recibido tu registro para el curso <strong>AI Experience Architect</strong>. Nuestro equipo revisara tu perfil y te contactara en las proximas <strong>48 horas</strong> con los detalles de inscripcion, metodos de pago y fecha de inicio.`
      }</p>
    </div>

    <div class="info-box">
      <h3>${isEn ? "Course details" : "Detalles del curso"}</h3>
      <div class="info-item">&#x2022; <span><strong>${isEn ? "Duration:" : "Duracion:"}</strong> ${isEn ? "8 intensive weeks" : "8 semanas intensivas"}</span></div>
      <div class="info-item">&#x2022; <span><strong>${isEn ? "Format:" : "Modalidad:"}</strong> ${isEn ? "Live online + recordings" : "Online en vivo + grabaciones"}</span></div>
      <div class="info-item">&#x2022; <span><strong>${isEn ? "Seats:" : "Cupos:"}</strong> ${isEn ? "Only 30 per cohort" : "Solo 30 personas por cohorte"}</span></div>
      <div class="info-item">&#x2022; <span><strong>${isEn ? "Launch price:" : "Precio lanzamiento:"}</strong> $995 USD (${isEn ? "regular" : "regular"} $1,500)</span></div>
    </div>

    <div class="contact">
      <p>${isEn ? "Have questions? Reach out directly" : "Tienes preguntas? Escribenos directamente"}<br>
      <a href="mailto:info@medialab.design">info@medialab.design</a> &middot;
      <a href="https://wa.me/573054009505">WhatsApp</a></p>
    </div>
  </div>
  <div class="footer">
    MediaLab Ingenieria &middot; Bogota, Colombia &middot; <a href="https://medialab.design" style="color: #E8751A;">medialab.design</a>
  </div>
</div>
</body></html>`

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: true, demo: true })
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const [adminResult, studentResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [COURSE_EMAIL],
        subject: `Nuevo Registro Curso — ${role || "Sin rol"} — ${name}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: isEn
          ? "Registration received — AI Experience Architect | MediaLab"
          : "Registro recibido — AI Experience Architect | MediaLab",
        html: studentHtml,
      }),
    ])

    return NextResponse.json({
      success: true,
      adminSent: adminResult.status === "fulfilled",
      studentSent: studentResult.status === "fulfilled",
    })
  } catch {
    return NextResponse.json({ error: "Error procesando el registro" }, { status: 500 })
  }
}
