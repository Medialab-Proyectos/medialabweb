"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowRight, MessageCircle, Clock, CheckCircle2, Shield, Zap, Send, Phone, Users, Mail } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({})
  const { t, localized } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
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

    const newErrors: { name?: string; email?: string; phone?: string; message?: string } = {}
    if (!name)    newErrors.name    = t("Nos falta tu nombre para poder contactarte.", "We need your name to reach you.")
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                  newErrors.email   = t("Ingresa un email válido para enviarte la confirmación.", "Enter a valid email so we can send your confirmation.")
    if (!phone)   newErrors.phone   = t("Déjanos un teléfono o WhatsApp para coordinar.", "Leave a phone or WhatsApp so we can coordinate.")
    if (!message) newErrors.message = t("Cuéntanos brevemente tu desafío — así llegamos preparados.", "Briefly tell us your challenge — so we come prepared.")
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setSending(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, message }),
      })
      if (!res.ok) throw new Error("api_error")
      setSubmitted(true)
    } catch {
      setErrors({ message: t("Error enviando el mensaje. Escríbenos por WhatsApp.", "Error sending. Reach us on WhatsApp.") })
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 px-3 sm:px-6 bg-background"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-14 transition-all duration-700 cta-card-container ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Background blobs */}
          <div
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none ambient-glow"
            style={{ background: "radial-gradient(circle, rgba(200,0,120,0.25), transparent 70%)", transform: "translate(-50%, -50%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none ambient-glow"
            style={{ background: "radial-gradient(circle, rgba(0,200,220,0.15), transparent 70%)", transform: "translate(50%, 50%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 right-0 w-56 h-56 rounded-full pointer-events-none ambient-glow"
            style={{ background: "radial-gradient(circle, rgba(240,120,0,0.15), transparent 70%)", transform: "translate(30%, -50%)" }}
            aria-hidden="true"
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left — Copy */}
            <div className="flex flex-col gap-6">
              {/* Urgency badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--magenta)]/20 border border-[var(--magenta)]/30 text-sm w-fit">
                <Clock size={14} className="text-[var(--magenta)]" />
                <span className="text-white/90 font-medium">{t("Disponibilidad limitada Q3 2026", "Limited availability Q3 2026")}</span>
              </div>

              <h2
                id="cta-heading"
                className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white text-balance"
              >
                {t(
                  "Tu producto merece usuarios que lo amen. Nosotros te ayudamos a lograrlo.",
                  "Your product deserves users who love it. We help you make it happen."
                )}
              </h2>

              <p className="text-base text-white/70 leading-relaxed text-pretty">
                {t(
                  "30 minutos. Sin compromiso. Te escuchamos, entendemos tu desafío y te mostramos exactamente cómo podríamos resolverlo juntos.",
                  "30 minutes. No commitment. We listen, understand your challenge, and show you exactly how we'd solve it together."
                )}
              </p>

              {/* Value props */}
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-400" />
                  {t("Consulta gratuita", "Free consultation")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={14} className="text-[var(--orange)]" />
                  {t("Respuesta en 24h", "Reply within 24h")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-[var(--cyan)]" />
                  {t("NDA disponible", "NDA available")}
                </span>
              </div>

              {/* Contact channels */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-[var(--magenta)]" />
                  <div>
                    <span className="text-white/50 text-xs block">{t("Contacto directo", "Direct contact")}</span>
                    <a href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" title={t("Contactar MediaLab por WhatsApp", "Contact MediaLab via WhatsApp")} className="text-white hover:text-[var(--cyan)] transition-colors">{t("Escríbenos por WhatsApp", "Message us on WhatsApp")}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users size={16} className="text-[var(--cyan)]" />
                  <div>
                    <span className="text-white/50 text-xs block">{t("Únete a la comunidad", "Join the community")}</span>
                    <a href="https://wa.me/573054009505?text=Hola!%20%F0%9F%91%8B%20%C2%A1Un%20gusto%20en%20pertenecer%20al%20equipo!%20Mi%20nombre%20es%20___%20y%20soy%20___" target="_blank" rel="noopener noreferrer" title={t("Únete a la comunidad WhatsApp de MediaLab", "Join MediaLab WhatsApp community")} className="text-white hover:text-[var(--cyan)] transition-colors">{t("Comunidad WhatsApp", "WhatsApp Community")}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle size={16} className="text-[var(--orange)]" />
                  <div>
                    <span className="text-white/50 text-xs block">Email</span>
                    <a href="mailto:hello@medialab.design" title={t("Enviar email a MediaLab", "Send email to MediaLab")} className="text-white hover:text-[var(--cyan)] transition-colors">hello@medialab.design</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="cta-form-container border rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-white">
                      {t("¡Listo! Diste el primer paso", "Done! You took the first step")}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {t("Esto es exactamente lo que sigue:", "Here's exactly what happens next:")}
                    </p>
                  </div>
                  <ol className="flex flex-col gap-3 text-left w-full max-w-xs">
                    {[
                      t("Revisamos tu caso con detalle.", "We review your case in detail."),
                      t("Te contactamos en menos de 24 horas.", "We contact you within 24 hours."),
                      t("Sesión gratuita de 30 min para mostrarte el camino.", "Free 30-min session to show you the path."),
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[var(--magenta)]">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-medium text-[var(--cyan)] hover:underline transition-colors"
                  >
                    {t("Enviar otro mensaje", "Send another message")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  <h3 className="text-lg font-bold text-white">
                    {t("Cuéntanos sobre tu proyecto", "Tell us about your project")}
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-name" className="text-xs text-white/50 font-medium">
                      {t("Nombre", "Name")} *
                    </label>
                    <input
                      id="cta-name"
                      name="name"
                      type="text"
                      onChange={() => setErrors((p) => ({ ...p, name: undefined }))}
                      placeholder={t("Tu nombre completo", "Your full name")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-email" className="text-xs text-white/50 font-medium">
                      {t("Email", "Email")} *
                    </label>
                    <input
                      id="cta-email"
                      name="email"
                      type="email"
                      onChange={() => setErrors((p) => ({ ...p, email: undefined }))}
                      placeholder={t("tu@empresa.com", "you@company.com")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                    {errors.email
                      ? <p className="text-xs text-red-400">{errors.email}</p>
                      : <p className="text-[11px] text-white/35">{t("Te enviaremos la confirmación aquí.", "We'll send your confirmation here.")}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-phone" className="text-xs text-white/50 font-medium">
                      {t("Teléfono", "Phone")} *
                    </label>
                    <input
                      id="cta-phone"
                      name="phone"
                      type="tel"
                      onChange={() => setErrors((p) => ({ ...p, phone: undefined }))}
                      placeholder={t("+57 300 000 0000", "+1 555 000 0000")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                    {errors.phone
                      ? <p className="text-xs text-red-400">{errors.phone}</p>
                      : <p className="text-[11px] text-white/35">{t("Solo para coordinar. Nunca spam.", "Only to coordinate. Never spam.")}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-company" className="text-xs text-white/50 font-medium">
                      {t("Empresa", "Company")} <span className="text-white/30">({t("opcional", "optional")})</span>
                    </label>
                    <input
                      id="cta-company"
                      name="company"
                      type="text"
                      placeholder={t("Nombre de tu empresa", "Your company name")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-message" className="text-xs text-white/50 font-medium">
                      {t("¿En qué te ayudamos?", "How can we help?")} *
                    </label>
                    <textarea
                      id="cta-message"
                      name="message"
                      rows={4}
                      onChange={() => setErrors((p) => ({ ...p, message: undefined }))}
                      placeholder={t(
                        "Cuéntanos brevemente sobre tu proyecto o desafío...",
                        "Briefly tell us about your project or challenge..."
                      )}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/50 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all resize-none"
                    />
                    {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="group flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25 disabled:opacity-70"
                  >
                    {sending ? (
                      t("Enviando...", "Sending...")
                    ) : (
                      <>
                        {t("Dar el primer paso", "Take the first step")}
                        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-white/40 text-center">
                    {t(
                      "También puedes escribirnos directamente por ",
                      "You can also reach us via "
                    )}
                    <a href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-[var(--cyan)]/70 hover:text-[var(--cyan)] underline transition-colors">
                      WhatsApp
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
