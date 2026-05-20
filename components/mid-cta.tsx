"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { BookingModal } from "./booking-modal"
import { useLanguage } from "@/lib/language-context"

interface MidCTAProps {
  headline?: string
  headlineEn?: string
  subheadline?: string
  subheadlineEn?: string
  buttonText?: string
  buttonTextEn?: string
  variant?: "default" | "minimal"
}

export function MidCTA({
  headline,
  headlineEn,
  subheadline,
  subheadlineEn,
  buttonText,
  buttonTextEn,
  variant = "default",
}: MidCTAProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  const resolvedHeadline = t(
    headline ?? "¿Listo para acelerar tu producto?",
    headlineEn ?? headline ?? "Ready to accelerate your product?"
  )
  const resolvedSubheadline = t(
    subheadline ?? "Hablemos de cómo podemos ayudarte a crear experiencias digitales que conviertan.",
    subheadlineEn ?? subheadline ?? "Let's talk about how we can help you create digital experiences that convert."
  )
  const resolvedButtonText = t(
    buttonText ?? "Agenda una consulta gratuita",
    buttonTextEn ?? buttonText ?? "Book a free consultation"
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (variant === "minimal") {
    return (
      <div
        ref={ref}
        className={`py-16 px-6 bg-secondary/50 border-y border-border transition-all duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="font-display font-bold text-xl text-foreground">{resolvedHeadline}</h3>
            <p className="text-sm text-muted-foreground">{resolvedSubheadline}</p>
          </div>
          <BookingModal>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-foreground text-background hover:bg-[var(--magenta)] hover:text-white transition-all duration-200 active:scale-95 shrink-0"
            >
              {resolvedButtonText}
              <ArrowRight size={14} />
            </button>
          </BookingModal>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`py-20 px-6 bg-gradient-to-br from-[var(--surface-dark)] to-[var(--surface-mid)] text-white transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-xl text-center lg:text-left">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white text-balance">
            {resolvedHeadline}
          </h3>
          <p className="text-base text-white/60">{resolvedSubheadline}</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/65">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              {t("Llamada gratuita de 30 min", "Free 30-min call")}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              {t("Sin compromiso", "No commitment")}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              {t("Asesoría experta", "Expert guidance")}
            </span>
          </div>
        </div>
        <BookingModal>
          <button
            type="button"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm bg-[var(--magenta)] text-white hover:brightness-110 transition-all duration-200 active:scale-95 shadow-lg shadow-[var(--magenta)]/25"
          >
            {resolvedButtonText}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </BookingModal>
      </div>
    </div>
  )
}
