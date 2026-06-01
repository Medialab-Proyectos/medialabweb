"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Lightbulb } from "lucide-react"
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
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t(
              "Tu producto tiene potencial, pero algo no conecta: los usuarios llegan y se van. El problema no es tu idea — es que nadie investigó qué necesitan sentir.",
              "Your product has potential, but something isn't clicking: users arrive and leave. The problem isn't your idea — it's that no one researched what they need to feel."
            )}
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t(
              "Ahí empezamos: unimos psicología del consumidor, IA y diseño UX para que cada decisión tenga evidencia real. ¿El resultado? Productos que la gente usa y negocios que crecen.",
              "That's where we start: we combine consumer psychology, AI, and UX design so every decision has real evidence. The result? Products people use and businesses that grow."
            )}
          </p>
          {/* Qué es UX — explicación humana que conecta el problema con la solución */}
          <div className="flex items-start gap-3 p-4 rounded-xl border-l-4 border border-[#E8772E]/30 border-l-[#E8772E] bg-[#E8772E]/[0.06]">
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#E8772E" }} aria-hidden="true" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              {t("A eso se le llama ", "This is what's called ")}
              <strong className="text-foreground font-semibold">
                {t("diseño de experiencia (UX)", "experience design (UX)")}
              </strong>
              {t(
                ": lograr que tu producto sea claro, fácil y que la gente quiera usarlo. Es la diferencia entre un producto que vende y uno que fracasa.",
                ": making your product clear, easy, and something people actually want to use. It's the difference between a product that sells and one that fails.",
              )}
            </p>
          </div>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--magenta)] hover:gap-3 transition-all duration-200 w-fit"
          >
            {t("Cuéntanos tu desafío", "Tell us your challenge")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right: visual cards — 4 rows */}
        <div
          className={`flex flex-col gap-4 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          aria-hidden="true"
        >
          {/* Title */}
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Nuestro enfoque", "Our approach")}
          </span>

          {/* Row 2: UX+IA, Evidencia, Impacto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 flex flex-col gap-2 [background:linear-gradient(135deg,#F3EAFF,#E5D0FF)] dark:[background:linear-gradient(135deg,#F67327,#6F18BF)]">
              <span className="text-2xl font-display font-bold text-[#390B6A] dark:text-white">{t("UX + IA", "UX + AI")}</span>
              <p className="text-xs text-[#390B6A]/70 dark:text-white/80 leading-relaxed">
                {t("Entendemos cómo piensan tus usuarios. La IA nos ayuda a hacerlo en días, no meses.", "We understand how your users think. AI helps us do it in days, not months.")}
              </p>
            </div>
            <div className="rounded-2xl p-5 flex flex-col gap-2 [background:linear-gradient(135deg,#FFF3EB,#FFE4CC)] dark:[background:linear-gradient(135deg,#F67327,#008294)]">
              <span className="text-2xl font-display font-bold text-[#8A2800] dark:text-white">{t("Evidencia", "Evidence")}</span>
              <p className="text-xs text-[#8A2800]/70 dark:text-white/80 leading-relaxed">{t("Cada decisión respaldada por datos reales", "Every decision backed by real data")}</p>
            </div>
            <div className="rounded-2xl p-5 flex flex-col gap-2 [background:linear-gradient(135deg,#E8F7F9,#CCF0F4)] dark:[background:linear-gradient(135deg,#6F18BF,#008294)]">
              <span className="text-2xl font-display font-bold text-[#023D4A] dark:text-white">{t("Impacto", "Impact")}</span>
              <p className="text-xs text-[#023D4A]/70 dark:text-white/80 leading-relaxed">{t("Resultados que puedes medir desde el día uno", "Results you can measure from day one")}</p>
            </div>
          </div>

          {/* Row 3: Emocional. Medible. Humano. */}
          <div className="rounded-2xl p-5 border border-border bg-card flex flex-col gap-2">
            <span className="text-lg font-display font-semibold text-foreground">
              {t("Emocional. Medible. Humano.", "Emotional. Measurable. Human.")}
            </span>
            <p className="text-sm text-muted-foreground">
              {t(
                "Un mismo propósito: productos que las personas quieren usar — y negocios que crecen gracias a eso.",
                "One purpose: products people want to use — and businesses that grow because of it."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
