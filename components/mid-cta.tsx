"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

interface MidCTAProps {
  headline?: string
  subheadline?: string
  buttonText?: string
  variant?: "default" | "minimal"
}

export function MidCTA({
  headline = "¿Listo para acelerar tu producto?",
  subheadline = "Hablemos de cómo podemos ayudarte a crear experiencias digitales que conviertan.",
  buttonText = "Agenda una consulta gratuita",
  variant = "default",
}: MidCTAProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
            <h3 className="font-display font-bold text-xl text-foreground">{headline}</h3>
            <p className="text-sm text-muted-foreground">{subheadline}</p>
          </div>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-foreground text-background hover:bg-[var(--magenta)] hover:text-white transition-all duration-200 active:scale-95 shrink-0"
          >
            {buttonText}
            <ArrowRight size={14} />
          </Link>
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
            {headline}
          </h3>
          <p className="text-base text-white/60">{subheadline}</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              Llamada gratuita de 30 min
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              Sin compromiso
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              Asesoría experta
            </span>
          </div>
        </div>
        <Link
          href="#contact"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm bg-[var(--magenta)] text-white hover:brightness-110 transition-all duration-200 active:scale-95 shadow-lg shadow-[var(--magenta)]/25 animate-pulse-glow"
        >
          {buttonText}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
