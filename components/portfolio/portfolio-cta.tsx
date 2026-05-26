"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowRight, MessageCircle, Clock, CheckCircle2, Zap, Shield,
  Send, Phone, Users, Mail,
} from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import { useLanguage } from "@/lib/language-context"

export function PortfolioCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  // Form state
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({})

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name    = ((data.get("name")    as string) || "").trim()
    const email   = ((data.get("email")   as string) || "").trim()
    const phone   = ((data.get("phone")   as string) || "").trim()
    const company = ((data.get("company") as string) || "").trim()
    const message = ((data.get("message") as string) || "").trim()

    const newErrors: typeof errors = {}
    if (!name)    newErrors.name    = t("Nos falta tu nombre para poder contactarte.", "We need your name to reach you.")
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                  newErrors.email   = t("Ingresa un email válido.", "Enter a valid email.")
    if (!phone)   newErrors.phone   = t("Déjanos un teléfono o WhatsApp.", "Leave a phone or WhatsApp.")
    if (!message) newErrors.message = t("Cuéntanos brevemente tu desafío.", "Briefly tell us your challenge.")
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({}); setSending(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, message }),
      })
      if (!res.ok) throw new Error("api_error")
      setSubmitted(true)
    } catch {
      setErrors({ message: t("Error enviando. Escríbenos por WhatsApp.", "Error sending. Reach us on WhatsApp.") })
    } finally { setSending(false) }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 bg-background/50 dark:bg-white/5 border-border/40 dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground/50 dark:placeholder:text-white/30 focus:border-[var(--magenta)]/60 focus:ring-[var(--magenta)]/30"

  return (
    <section id="contact" ref={ref} className="py-24 px-6 bg-secondary/30" aria-labelledby="portfolio-cta-heading">
      <div className="max-w-6xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 transition-all duration-700 cta-card-container ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Blobs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(232,117,26,0.25), transparent 70%)", transform: "translate(-50%, -50%)" }} aria-hidden="true" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(42,171,179,0.15), transparent 70%)", transform: "translate(50%, 50%)" }} aria-hidden="true" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — Copy */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--magenta)]/20 border border-[var(--magenta)]/30 text-sm w-fit">
                <Clock size={14} className="text-[var(--magenta)]" />
                <span className="text-foreground dark:text-white/90 font-medium">{t("Disponibilidad limitada Q3 2026", "Limited availability Q3 2026")}</span>
              </div>

              <h2 id="portfolio-cta-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground dark:text-white text-balance">
                {t("Tu producto podría ser el próximo caso de éxito.", "Your product could be the next success story.")}
              </h2>

              <p className="text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                {t(
                  "30 minutos. Sin compromiso. Cuéntanos tu desafío y te mostramos cómo lo resolveríamos — con la misma metodología que generó estos resultados.",
                  "30 minutes. No commitment. Tell us your challenge and we'll show you how we'd solve it — with the same methodology that drove these results."
                )}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-white/60">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400" />{t("Consulta gratuita", "Free consultation")}</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-[var(--orange)]" />{t("Respuesta en 24h", "Reply within 24h")}</span>
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-[var(--cyan)]" />{t("NDA disponible", "NDA available")}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                <BookingModal>
                  <button type="button" className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25">
                    {t("Agendar llamada gratuita", "Book a free call")} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </BookingModal>
                <Link href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm border border-border/30 dark:border-white/20 text-foreground dark:text-white hover:bg-foreground/5 dark:hover:bg-white/10 transition-all active:scale-95">
                  <MessageCircle size={16} /> WhatsApp
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/20 dark:border-white/10 mt-2">
                <div className="flex -space-x-2">
                  {[
                    { initials: "AN", name: "Alexander Naranjo" },
                    { initials: "CL", name: "Claudia Lazaneo" },
                    { initials: "HZ", name: "Héctor Zuñiga" },
                  ].map((person, i) => (
                    <div key={person.initials} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-background dark:border-black/50" style={{ background: `linear-gradient(135deg, var(--${["magenta", "cyan", "orange"][i]}), var(--${["orange", "magenta", "cyan"][i]}))`, zIndex: 3 - i }} title={person.name}>{person.initials}</div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground dark:text-white/60">
                  <span className="text-foreground dark:text-white font-medium">{t("40+ equipos", "40+ teams")}</span>{" "}
                  {t("ya transformaron su producto con nosotros.", "have already transformed their product with us.")}
                </p>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="cta-form-container rounded-2xl border backdrop-blur-sm p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-5 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-foreground dark:text-white">
                      {t("¡Listo! Diste el primer paso", "Done! You took the first step")}
                    </h3>
                    <p className="text-muted-foreground dark:text-white/60 text-sm">
                      {t("Te contactamos en menos de 24 horas.", "We'll contact you within 24 hours.")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-sm font-medium text-[var(--cyan)] hover:underline transition-colors"
                  >
                    {t("Enviar otro mensaje", "Send another message")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-foreground dark:text-white">
                    {t("Cuéntanos sobre tu proyecto", "Tell us about your project")}
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pf-name" className="text-xs text-muted-foreground dark:text-white/50 font-medium">{t("Nombre", "Name")} *</label>
                    <input id="pf-name" name="name" type="text" onChange={() => setErrors((p) => ({ ...p, name: undefined }))} placeholder={t("Tu nombre completo", "Your full name")} className={inputClass} />
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pf-email" className="text-xs text-muted-foreground dark:text-white/50 font-medium">{t("Email", "Email")} *</label>
                    <input id="pf-email" name="email" type="email" onChange={() => setErrors((p) => ({ ...p, email: undefined }))} placeholder={t("tu@empresa.com", "you@company.com")} className={inputClass} />
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pf-phone" className="text-xs text-muted-foreground dark:text-white/50 font-medium">{t("Teléfono", "Phone")} *</label>
                    <input id="pf-phone" name="phone" type="tel" onChange={() => setErrors((p) => ({ ...p, phone: undefined }))} placeholder={t("+57 300 000 0000", "+1 555 000 0000")} className={inputClass} />
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pf-company" className="text-xs text-muted-foreground dark:text-white/50 font-medium">{t("Empresa", "Company")} <span className="text-muted-foreground/50">({t("opcional", "optional")})</span></label>
                    <input id="pf-company" name="company" type="text" placeholder={t("Nombre de tu empresa", "Your company name")} className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pf-message" className="text-xs text-muted-foreground dark:text-white/50 font-medium">{t("¿En qué te ayudamos?", "How can we help?")} *</label>
                    <textarea id="pf-message" name="message" rows={3} onChange={() => setErrors((p) => ({ ...p, message: undefined }))} placeholder={t("Cuéntanos brevemente sobre tu proyecto...", "Briefly tell us about your project...")} className={`${inputClass} resize-none`} />
                    {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={sending} className="group flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25 disabled:opacity-70">
                    {sending ? t("Enviando...", "Sending...") : (<>{t("Dar el primer paso", "Take the first step")} <Send size={15} className="group-hover:translate-x-1 transition-transform" /></>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
