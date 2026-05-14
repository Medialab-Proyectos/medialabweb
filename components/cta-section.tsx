"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, MessageCircle, Clock, CheckCircle2, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { BookingModal } from "./booking-modal"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-3xl p-10 md:p-16 flex flex-col items-center text-center gap-8 text-white transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--magenta)]/20 border border-[var(--magenta)]/30 text-sm">
              <Clock size={14} className="text-[var(--magenta)]" />
              <span className="text-white/90 font-medium">Disponibilidad limitada Q3 2026</span>
            </div>

            <h2
              id="cta-heading"
              className="font-display font-bold text-3xl md:text-5xl leading-tight text-white text-balance"
            >
              Tu producto merece usuarios que lo amen. Nosotros te ayudamos a lograrlo.
            </h2>

            <p className="text-base text-white/70 leading-relaxed text-pretty">
              30 minutos. Sin compromiso. Te escuchamos, entendemos tu desafío y te mostramos exactamente
              cómo podríamos resolverlo juntos. Si no encajamos, te lo decimos con honestidad.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" />
                Consulta gratuita
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-[var(--orange)]" />
                Respuesta en 24h
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-[var(--cyan)]" />
                NDA disponible
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <BookingModal>
                <button type="button" className="group flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25">
                  {t("Quiero transformar mi producto", "I want to transform my product")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </BookingModal>
              <Link
                href="https://wa.me/573054009505"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-2">
              <div className="flex -space-x-2">
                {["JD", "MR", "AT"].map((initials, i) => (
                  <div
                    key={initials}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-black/50"
                    style={{
                      background: `linear-gradient(135deg, var(--${["magenta", "cyan", "orange"][i]}), var(--${["orange", "magenta", "cyan"][i]}))`,
                      zIndex: 3 - i,
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/50">
                <span className="text-white font-medium">40+ equipos</span> ya transformaron su producto con nosotros. El próximo podría ser el tuyo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
