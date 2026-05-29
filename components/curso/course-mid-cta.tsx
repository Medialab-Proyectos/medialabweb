"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

interface CourseMidCtaProps {
  headline: string
  headlineEn?: string
  subtext: string
  subtextEn?: string
  ctaText?: string
  ctaTextEn?: string
  ctaHref?: string
  variant?: "primary" | "subtle"
  bgImage?: string
}

export function CourseMidCta({ headline, headlineEn, subtext, subtextEn, ctaText, ctaTextEn, ctaHref, variant = "subtle", bgImage }: CourseMidCtaProps) {
  const { t } = useLanguage()

  const isPrimary = variant === "primary"

  return (
    <div className="relative overflow-hidden bg-[var(--surface-dark)] text-white -mt-px border-t border-b border-white/[0.05]">
      {/* Glow accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px]"
          style={{ background: isPrimary ? 'rgba(232,117,26,0.25)' : 'rgba(42,171,179,0.20)' }}
        />
      </div>

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
          {ctaText && ctaHref && (
            <a
              href={ctaHref}
              className="inline-flex px-8 py-3.5 text-sm font-bold text-white rounded-full transition-all duration-300 hover:scale-[1.03] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{ background: isPrimary ? 'var(--magenta)' : 'var(--cyan)' }}
            >
              {t(ctaText, ctaTextEn ?? ctaText)}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )
}
