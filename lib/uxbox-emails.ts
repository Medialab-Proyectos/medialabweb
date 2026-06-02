/**
 * Entrega de los correos de fin de fase del motor UXBox.
 *
 * `deliverDuePhaseEmails` es idempotente: envía solo las fases pendientes
 * (lastEmailedStage+1 … throughStage) y actualiza `lastEmailedStage` en KV.
 * Lo usan tanto el callback de QStash como el catch-up al regresar el usuario.
 */
import { getLab, saveLab, type StoredLab } from "@/lib/lab-store"
import { phaseEmailCopy, PHASES, type Lang, type PhaseEmailCopy } from "@/lib/uxbox-phases"

const FROM_EMAIL = process.env.FROM_EMAIL || "MediaLab <onboarding@resend.dev>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@medialab.design"
const SITE_URL = process.env.SITE_URL || "https://medialab.design"
const BOOKING_URL = `${SITE_URL}/#uxbox`

function leadEmailHtml(copy: PhaseEmailCopy, lang: Lang): string {
  const cta =
    lang === "en"
      ? { label: "Book a call", question: "Have a question?" }
      : { label: "Agendar una llamada", question: "¿Tienes una duda?" }
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 28px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px; color: #fff; }
  .logo { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 16px; }
  .logo span { background: linear-gradient(90deg, #E8751A, #2AABB3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #E8751A; }
  .header h1 { margin: 8px 0 0; font-size: 22px; font-weight: 700; line-height: 1.3; }
  .body { padding: 32px; }
  .body p { font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 16px; }
  .cta { text-align: center; margin: 28px 0 8px; }
  .cta a { display: inline-block; background: linear-gradient(90deg, #E8751A, #c65a10); color: #fff; padding: 14px 32px; border-radius: 100px; font-size: 14px; font-weight: 600; text-decoration: none; }
  .contact { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-top: 24px; text-align: center; }
  .contact p { margin: 0; font-size: 13px; color: #666; }
  .contact a { color: #E8751A; font-weight: 600; text-decoration: none; }
  .footer { padding: 18px 32px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center; }
</style></head><body>
<div class="container">
  <div class="header">
    <div class="logo">Media<span>Lab</span></div>
    <span class="badge">UXBox · ${lang === "en" ? "Product intelligence engine" : "Motor de inteligencia de producto"}</span>
    <h1>${copy.heading}</h1>
  </div>
  <div class="body">
    ${copy.lines.filter(Boolean).map((l) => `<p>${l}</p>`).join("")}
    ${copy.finale ? `<div class="cta"><a href="${BOOKING_URL}">${cta.label}</a></div>` : ""}
    <div class="contact">
      <p>${cta.question}<br><a href="https://wa.me/573054009505">WhatsApp +57 305 400 9505</a></p>
    </div>
  </div>
  <div class="footer">MediaLab Ingeniería · Bogotá, Colombia · <a href="${SITE_URL}" style="color:#E8751A;">medialab.design</a></div>
</div></body></html>`
}

function adminNoticeHtml(lab: StoredLab): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;color:#333;">
  <h2 style="color:#E8751A;">UXBox — Análisis completado</h2>
  <p>Un lead terminó su análisis completo en el motor UXBox.</p>
  <ul>
    <li><strong>Email:</strong> ${lab.email || "—"}</li>
    <li><strong>Proyecto:</strong> ${lab.projectName || "—"}</li>
    <li><strong>Industria:</strong> ${(lab.signals || []).join(", ") || "—"}</li>
    <li><strong>Objetivo:</strong> ${lab.objective || "—"}</li>
    <li><strong>Audiencia:</strong> ${lab.audience || "—"}</li>
  </ul>
  <p><strong>Idea:</strong> ${lab.idea || "—"}</p>
  ${lab.brief ? `<p><strong>Brief:</strong><br>${lab.brief.split("\n\n").map((p) => p).join("<br><br>")}</p>` : ""}
</body></html>`
}

/**
 * Envía los correos de las fases pendientes hasta `throughStage` (incluida).
 * Idempotente vía `lastEmailedStage`. Devuelve cuántos correos envió.
 */
export async function deliverDuePhaseEmails(email: string, throughStage: number): Promise<number> {
  const lab = await getLab(email)
  if (!lab) return 0

  const lang: Lang = lab.lang === "en" ? "en" : "es"
  let last = typeof lab.lastEmailedStage === "number" ? lab.lastEmailedStage : -1
  const target = Math.min(throughStage, PHASES.length - 1)
  if (target <= last) return 0

  if (!process.env.RESEND_API_KEY) {
    // Sin proveedor de correo: marcar como notificadas para no acumular deuda.
    await saveLab(email, { ...lab, lastEmailedStage: target })
    return 0
  }

  const { Resend } = await import("resend")
  const resend = new Resend(process.env.RESEND_API_KEY)

  let sent = 0
  for (let stage = last + 1; stage <= target; stage += 1) {
    const copy = phaseEmailCopy(stage, lab, lang)
    if (!copy) continue
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: copy.subject,
        html: leadEmailHtml(copy, lang),
      })
      sent += 1
    } catch {
      // Si falla el envío de esta fase, no avanzamos `last` más allá: se
      // reintentará en el próximo catch-up.
      break
    }
    // Notificación al admin en la fase final
    if (PHASES[stage].email === "lead+admin") {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `UXBox completado — ${lab.projectName || lab.email || email}`,
          html: adminNoticeHtml({ ...lab, email }),
        })
      } catch { /* no bloquea el avance del lead */ }
    }
    last = stage
  }

  if (last !== lab.lastEmailedStage) {
    await saveLab(email, { ...lab, lastEmailedStage: last })
  }
  return sent
}
