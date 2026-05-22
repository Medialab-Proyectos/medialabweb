"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
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
      id="about"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-label="About MediaLab Ingeniería"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Tu producto tiene un problema", "Your product has a problem")}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            {t("Tus usuarios abandonan", "Your users leave")}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--magenta), var(--cyan))" }}
            >
              {t("porque tu producto no los entiende.", "because your product doesn't understand them.")}
            </span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Sabes que tu producto tiene potencial. Pero algo no conecta: los usuarios llegan y se van, las conversiones no suben, el equipo diseña sin datos reales. El problema no es tu idea — es que nadie investigó qué necesitan sentir tus usuarios.",
              "You know your product has potential. But something isn't clicking: users arrive and leave, conversions stay flat, your team designs without real data. The problem isn't your idea — it's that no one researched what your users need to feel."
            )}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "En MediaLab Ingeniería empezamos por ahí. Combinamos psicología del consumidor, IA y diseño UX para que cada decisión de tu producto digital esté respaldada por evidencia real. El resultado: productos que la gente quiere usar y negocios que crecen.",
              "At MediaLab Ingeniería we start there. We combine consumer psychology, AI, and UX design so every digital product decision is backed by real evidence. The result: products people want to use and businesses that grow."
            )}
          </p>
          <p className="text-base font-medium text-foreground leading-relaxed">
            {t("Emocional. Medible. Humano.", "Emotional. Measurable. Human.")}
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--magenta)] hover:gap-3 transition-all duration-200 w-fit"
          >
            {t("Cuéntanos tu desafío →", "Tell us your challenge →")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right: visual cards */}
        <div
          className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          aria-hidden="true"
        >
          <div className="col-span-2 rounded-2xl p-6 flex flex-col gap-3 text-white"
            style={{ background: "linear-gradient(135deg, var(--magenta), oklch(0.4 0.25 300))" }}>
            <span className="text-3xl font-display font-bold">{t("UX + IA", "UX + AI")}</span>
            <p className="text-sm text-white/80 leading-relaxed">
              {t(
                "Entendemos cómo piensan tus usuarios. La IA nos ayuda a hacerlo en días, no meses.",
                "We understand how your users think. AI helps us do it in days, not months."
              )}
            </p>
          </div>
          <div className="rounded-2xl p-5 bg-[var(--surface-dark)] text-white flex flex-col gap-2">
            <span className="text-2xl font-display font-bold" style={{ color: "var(--cyan)" }}>{t("Evidencia", "Evidence")}</span>
            <p className="text-xs text-white/60 leading-relaxed">{t("Cada decisión respaldada por datos reales", "Every decision backed by real data")}</p>
          </div>
          <div className="rounded-2xl p-5 flex flex-col gap-2"
            style={{ background: "linear-gradient(135deg, var(--orange), oklch(0.65 0.2 60))" }}>
            <span className="text-2xl font-display font-bold text-white">{t("Impacto", "Impact")}</span>
            <p className="text-xs text-white/80 leading-relaxed">{t("Resultados que puedes medir desde el día uno", "Results you can measure from day one")}</p>
          </div>
          <div className="col-span-2 rounded-2xl p-5 border border-border bg-card flex flex-col gap-2">
            <span className="text-lg font-display font-semibold text-foreground">
              {t("Emocional. Medible. Humano.", "Emotional. Measurable. Human.")}
            </span>
            <p className="text-sm text-muted-foreground">
              {t(
                "Productos que las personas quieren usar — y negocios que crecen gracias a eso.",
                "Products people want to use — and businesses that grow because of it."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
