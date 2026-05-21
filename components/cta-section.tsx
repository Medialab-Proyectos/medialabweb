"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowRight, MessageCircle, Clock, CheckCircle2, Shield, Zap, Send, Phone, Users } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
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
    setSending(true)

    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get("name") as string
    const phone = data.get("phone") as string
    const company = data.get("company") as string
    const message = data.get("message") as string

    const body = encodeURIComponent(
      `Nombre: ${name}\nTeléfono: ${phone}${company ? `\nEmpresa: ${company}` : ""}\n\n${message}`
    )
    const subject = encodeURIComponent(`Contacto desde medialab.design — ${name}`)

    window.open(
      `mailto:hablemos@medialab.design?subject=${subject}&body=${body}`,
      "_self"
    )

    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 500)
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-3xl p-8 md:p-14 transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{ background: "linear-gradient(135deg, oklch(0.10 0 0) 0%, oklch(0.06 0 0) 100%)" }}
        >
          {/* Background blobs */}
          <div
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(200,0,120,0.25), transparent 70%)", transform: "translate(-50%, -50%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,200,220,0.15), transparent 70%)", transform: "translate(50%, 50%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 right-0 w-56 h-56 rounded-full pointer-events-none"
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
                    <a href="tel:+573054009505" className="text-white hover:text-[var(--cyan)] transition-colors">+57 305 400 9505</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users size={16} className="text-[var(--cyan)]" />
                  <div>
                    <span className="text-white/50 text-xs block">{t("Únete a la comunidad", "Join the community")}</span>
                    <a href="https://wa.me/573144236970" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[var(--cyan)] transition-colors">+57 314 423 6970</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle size={16} className="text-[var(--orange)]" />
                  <div>
                    <span className="text-white/50 text-xs block">Email</span>
                    <a href="mailto:hablemos@medialab.design" className="text-white hover:text-[var(--cyan)] transition-colors">hablemos@medialab.design</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t("¡Mensaje enviado!", "Message sent!")}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {t(
                      "Te responderemos en menos de 24 horas.",
                      "We'll get back to you within 24 hours."
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                      required
                      placeholder={t("Tu nombre completo", "Your full name")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/50 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-phone" className="text-xs text-white/50 font-medium">
                      {t("Teléfono", "Phone")} *
                    </label>
                    <input
                      id="cta-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder={t("+57 300 000 0000", "+1 555 000 0000")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/50 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
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
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/50 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-message" className="text-xs text-white/50 font-medium">
                      {t("¿En qué te ayudamos?", "How can we help?")} *
                    </label>
                    <textarea
                      id="cta-message"
                      name="message"
                      required
                      rows={4}
                      placeholder={t(
                        "Cuéntanos brevemente sobre tu proyecto o desafío...",
                        "Briefly tell us about your project or challenge..."
                      )}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/50 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all resize-none"
                    />
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
                        {t("Enviar mensaje", "Send message")}
                        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-white/40 text-center">
                    {t(
                      "También puedes escribirnos directamente por ",
                      "You can also reach us via "
                    )}
                    <a href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" className="text-[var(--cyan)]/70 hover:text-[var(--cyan)] underline transition-colors">
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
