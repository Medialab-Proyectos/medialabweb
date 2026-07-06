import "server-only"
import { listEmpleados } from "./queries"

/**
 * Envía un correo a los CEO activos (best-effort, nunca lanza).
 * Usa Resend con las env vars que ya existen (RESEND_API_KEY / FROM_EMAIL).
 */
export async function notificarCEO(subject: string, text: string): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.FROM_EMAIL || "MediaLab <no-reply@medialab.design>"
  if (!apiKey) return { sent: false, reason: "sin RESEND_API_KEY" }
  try {
    const empleados = await listEmpleados()
    const to = empleados.filter((e) => e.rol === "ceo" && e.estado === "activo").map((e) => e.email)
    if (to.length === 0) return { sent: false, reason: "sin CEO activo" }
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)
    await resend.emails.send({ from, to, subject: `[Portal MediaLab] ${subject}`, text })
    return { sent: true }
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "error" }
  }
}

/** Envía un correo a TODOS los empleados activos (best-effort). */
export async function notificarEmpleadosActivos(subject: string, text: string): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.FROM_EMAIL || "MediaLab <no-reply@medialab.design>"
  if (!apiKey) return { sent: false, reason: "sin RESEND_API_KEY" }
  try {
    const empleados = await listEmpleados()
    const to = empleados.filter((e) => e.estado === "activo").map((e) => e.email)
    if (to.length === 0) return { sent: false, reason: "sin empleados activos" }
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)
    // 'to' con muchos destinatarios: se usa bcc para no exponer los correos entre sí.
    await resend.emails.send({ from, to: from, bcc: to, subject: `[Portal MediaLab] ${subject}`, text })
    return { sent: true }
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "error" }
  }
}
