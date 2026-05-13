"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface CourseMidCtaProps {
  headline: string
  subtext: string
  ctaText: string
  ctaHref: string
  variant?: "primary" | "subtle"
}

export function CourseMidCta({ headline, subtext, ctaText, ctaHref, variant = "subtle" }: CourseMidCtaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div ref={ref} className="py-16 md:py-20 bg-[var(--surface-dark)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 lg:px-8 text-center"
      >
        <div className={`p-8 md:p-10 rounded-2xl border ${
          variant === "primary"
            ? "border-[var(--magenta)]/[0.12] bg-[var(--magenta)]/[0.03]"
            : "border-white/[0.04] bg-white/[0.015]"
        }`}>
          <p className="text-lg md:text-xl font-medium text-[var(--surface-dark-fg)] mb-2 font-display">
            {headline}
          </p>
          <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">{subtext}</p>
          <a
            href={ctaHref}
            className={`inline-flex px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] ${
              variant === "primary"
                ? "text-white hover:shadow-lg"
                : "text-white/80 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03]"
            }`}
            style={variant === "primary" ? { background: 'var(--magenta)' } : undefined}
          >
            {ctaText}
          </a>
        </div>
      </motion.div>
    </div>
  )
}
