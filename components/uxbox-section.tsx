"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

const steps = [
  {
    number: "01",
    title: ["Describe tu idea", "Describe your idea"] as [string, string],
    description: ["Cuéntanos sobre tu idea o proyecto digital en lenguaje simple.", "Tell us about your idea or digital project in simple language."] as [string, string],
  },
  {
    number: "02",
    title: ["La IA analiza tu concepto", "AI analyzes your concept"] as [string, string],
    description: ["Nuestra IA analiza tu concepto y genera un conjunto estructurado de requisitos de producto.", "Our AI analyzes your concept and generates a structured set of product requirements."] as [string, string],
  },
  {
    number: "03",
    title: ["Conceptos de diseño", "Design concepts"] as [string, string],
    description: ["Nuestro equipo de diseño prepara conceptos iniciales de producto y enfoques de UX.", "Our design team prepares initial product concepts and UX approaches."] as [string, string],
  },
  {
    number: "04",
    title: ["Revisa y decide", "Review and decide"] as [string, string],
    description: ["Revisas la propuesta y decides si avanzar con el desarrollo.", "You review the proposal and decide whether to move forward with development."] as [string, string],
  },
]

const benefits = [
  ["Discovery de producto extremadamente rápido", "Extremely fast product discovery"] as [string, string],
  ["Menores costos de definición de producto", "Lower product definition costs"] as [string, string],
  ["Roadmap de producto digital claro", "Clear digital product roadmap"] as [string, string],
  ["Visualización temprana del diseño", "Early design visualization"] as [string, string],
]

export function UXBoxSection() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="uxbox"
      ref={ref}
      className="py-24 px-6 bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] overflow-hidden relative"
      aria-labelledby="uxbox-heading"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, var(--magenta), transparent 70%)", transform: "translate(30%, -30%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, var(--cyan), transparent 70%)", transform: "translate(-30%, 30%)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div
            className={`flex flex-col gap-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)] mb-4 block">
                {t("Nuestra Plataforma", "Our Platform")}
              </span>
              <h2
                id="uxbox-heading"
                className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white text-balance"
              >
                {t("UXBox — Convierte tu idea en producto digital", "UXBox — Turn your idea into a digital product")}{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, var(--magenta), var(--orange))" }}
                >
                  {t("en días", "in days")}
                </span>
              </h2>
            </div>

            <p className="text-base text-white/70 leading-relaxed">
              {t(
                "UXBox es nuestra plataforma inteligente de descubrimiento de producto. En lugar de pasar meses definiendo requisitos, UXBox usa inteligencia artificial para transformar tu idea en una propuesta de producto estructurada.",
                "UXBox is our intelligent product discovery platform. Instead of spending months defining requirements, UXBox uses artificial intelligence to transform your idea into a structured product proposal."
              )}
            </p>

            {/* Benefits */}
            <ul className="flex flex-col gap-3" aria-label={t("Beneficios de UXBox", "UXBox benefits")}>
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle size={18} style={{ color: "var(--cyan)" }} className="shrink-0" />
                  {t(b[0], b[1])}
                </li>
              ))}
            </ul>

            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-black bg-white hover:bg-[var(--magenta)] hover:text-white transition-all duration-200 active:scale-95 w-fit"
            >
              {t("Envía tu idea de proyecto", "Send your project idea")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Steps */}
          <div
            className={`flex flex-col gap-4 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="flex gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span
                  className="font-display font-bold text-2xl shrink-0 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
                >
                  {step.number}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-white text-sm">{t(step.title[0], step.title[1])}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{t(step.description[0], step.description[1])}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
