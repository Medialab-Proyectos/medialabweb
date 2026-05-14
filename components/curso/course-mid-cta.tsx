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
    <div ref={ref} className="py-8 md:py-10 bg-[var(--surface-dark)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 lg:px-8 text-center"
      >
        <div className={`p-6 md:p-8 rounded-2xl border ${
          variant === "primary"
            ? "border-[var(--magenta)]/[0.12] bg-[var(--magenta)]/[0.03]"
            : "border-foreground/[0.06] bg-foreground/[0.02]"
        }`}>
          <p className="text-lg md:text-xl font-medium text-[var(--surface-dark-fg)] mb-2 font-display">
            {headline}
          </p>
          <p className="text-sm text-foreground/40 mb-4 max-w-md mx-auto">{subtext}</p>
          <p className="text-[11px] text-foreground/25 mb-5">Solo 30 cupos · Precio de lanzamiento $995 USD</p>
          <a
            href={ctaHref}
            className="inline-flex px-6 py-3 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
            style={{ background: variant === "primary" ? 'var(--magenta)' : 'var(--cyan)' }}
          >
            {ctaText}
          </a>
        </div>
      </motion.div>
    </div>
  )
}
