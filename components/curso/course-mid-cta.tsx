"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Download, Rocket, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface CourseMidCtaProps {
  headline: string
  headlineEn?: string
  subtext: string
  subtextEn?: string
  ctaText?: string
  ctaTextEn?: string
  ctaHref?: string
  ctaIcon?: "download" | "enroll"
  variant?: "primary" | "subtle"
  bgImage?: string
  advisorHref?: string
  advisorText?: string
  advisorTextEn?: string
}

export function CourseMidCta({ headline, headlineEn, subtext, subtextEn, ctaText, ctaTextEn, ctaHref, ctaIcon, variant = "subtle", bgImage, advisorHref, advisorText, advisorTextEn }: CourseMidCtaProps) {
  const { t } = useLanguage()

  const isPrimary = variant === "primary"
  const accent = isPrimary ? "232,117,26" : "42,171,179"
  const CtaIcon = ctaIcon === "download" ? Download : ctaIcon === "enroll" ? Rocket : null

  return (
    <div className="relative overflow-hidden bg-[var(--surface-dark)] text-white -mt-px">
      {/* Líneas de acento — marcan el cambio de sección de forma sutil (claro y oscuro) */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${accent},0.55), transparent)` }} />
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${accent},0.35), transparent)` }} />
      {/* Tinte de marca sutil */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 90% 75% at 50% 50%, rgba(${accent},0.12), transparent 70%)` }} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-14 md:py-20"
      >
        {/* Framed image */}
        {bgImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full h-48 md:h-72 lg:h-80 rounded-2xl overflow-hidden mb-8 border border-white/[0.1]"
          >
            <Image src={bgImage} alt={t(headline, headlineEn ?? headline)} fill sizes="100vw" className="object-cover object-center" priority />
          </motion.div>
        )}

        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-white mb-4 font-display">
            {t(headline, headlineEn ?? headline)}
          </p>
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto font-medium">
            {t(subtext, subtextEn ?? subtext)}
          </p>
          {((ctaText && ctaHref) || advisorHref) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {ctaText && ctaHref && (
                <a
                  href={ctaHref}
                  {...(ctaHref.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white rounded-full transition-all duration-300 hover:scale-[1.03] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  style={{ background: isPrimary ? 'var(--magenta)' : 'var(--cyan)' }}
                >
                  {CtaIcon && <CtaIcon size={16} />}
                  {t(ctaText, ctaTextEn ?? ctaText)}
                </a>
              )}
              {advisorHref && (
                <a
                  href={advisorHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-full transition-all duration-300 hover:scale-[1.03] border border-white/40 text-white hover:bg-white/10"
                >
                  <MessageCircle size={16} />
                  {t(advisorText ?? "Habla con un asesor", advisorTextEn ?? advisorText ?? "Talk to an advisor")}
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
