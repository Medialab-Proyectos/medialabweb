"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, MessageCircle, Clock, CheckCircle2, Zap, Shield } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import { useLanguage } from "@/lib/language-context"

export function PortfolioCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="contact" ref={ref} className="py-24 px-6 bg-secondary/30" aria-labelledby="portfolio-cta-heading">
      <div className="max-w-5xl mx-auto">
        <div className={`relative overflow-hidden rounded-3xl p-10 md:p-16 flex flex-col items-center text-center gap-8 text-white transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ background: "linear-gradient(135deg, oklch(0.10 0 0) 0%, oklch(0.06 0 0) 100%)" }}>
          {/* Blobs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(232,117,26,0.25), transparent 70%)", transform: "translate(-50%, -50%)" }} aria-hidden="true" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(42,171,179,0.15), transparent 70%)", transform: "translate(50%, 50%)" }} aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--magenta)]/20 border border-[var(--magenta)]/30 text-sm">
              <Clock size={14} className="text-[var(--magenta)]" />
              <span className="text-white/90 font-medium">{t("Disponibilidad limitada Q3 2026", "Limited availability Q3 2026")}</span>
            </div>

            <h2 id="portfolio-cta-heading" className="font-display font-bold text-3xl md:text-5xl leading-tight text-white text-balance">
              {t("Tu producto podría ser el próximo caso de éxito.", "Your product could be the next success story.")}
            </h2>

            <p className="text-base text-white/70 leading-relaxed">
              {t(
                "30 minutos. Sin compromiso. Cuéntanos tu desafío y te mostramos cómo lo resolveríamos — con la misma metodología que generó estos resultados.",
                "30 minutes. No commitment. Tell us your challenge and we'll show you how we'd solve it — with the same methodology that drove these results."
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400" />{t("Consulta gratuita", "Free consultation")}</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-[var(--orange)]" />{t("Respuesta en 24h", "Reply within 24h")}</span>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-[var(--cyan)]" />{t("NDA disponible", "NDA available")}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <BookingModal>
                <button type="button" className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25 animate-pulse-glow">
                  {t("Quiero transformar mi producto", "I want to transform my product")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </BookingModal>
              <Link href="https://wa.me/573054009505" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-all active:scale-95">
                <MessageCircle size={16} /> WhatsApp
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-2">
              <div className="flex -space-x-2">
                {["JD", "MR", "AT", "LS"].map((initials, i) => (
                  <div key={initials} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-black/50" style={{ background: `linear-gradient(135deg, var(--${["magenta", "cyan", "orange", "magenta"][i]}), var(--${["orange", "magenta", "cyan", "orange"][i]}))`, zIndex: 4 - i }}>{initials}</div>
                ))}
              </div>
              <p className="text-xs text-white/50">
                <span className="text-white font-medium">{t("40+ equipos", "40+ teams")}</span>{" "}
                {t("ya transformaron su producto con nosotros.", "have already transformed their product with us.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
