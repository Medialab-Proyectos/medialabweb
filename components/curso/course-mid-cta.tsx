"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
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
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const { t } = useLanguage()

  const isPrimary = variant === "primary"

  return (
    <div ref={ref} className="relative overflow-hidden bg-[var(--surface-dark)] text-white -mt-px border-t border-b border-white/[0.05]">
      {/* Background image — BRIGHTER visibility */}
      {bgImage && (
        <div className="absolute inset-0">
          <Image src={bgImage} alt="" fill className="object-cover object-[center_15%] opacity-[0.65]" priority />
          {/* Lighter overlay so the image pops much more */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
        </div>
      )}
      {/* Glow accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px]"
          style={{ background: isPrimary ? 'rgba(232,117,26,0.25)' : 'rgba(42,171,179,0.20)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-10 md:py-14 text-center drop-shadow-md"
      >
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
      </motion.div>
    </div>
  )
}
