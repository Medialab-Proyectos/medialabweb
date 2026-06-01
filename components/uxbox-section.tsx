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
  ["AI Product Discovery extremadamente rápido", "Extremely fast AI Product Discovery"] as [string, string],
  ["Menores costos con nuestro AI UX Brief Generator", "Lower costs with our AI UX Brief Generator"] as [string, string],
  ["Generador de Requerimientos con IA para acelerar el desarrollo", "AI Requirements Generator to speed up development"] as [string, string],
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
      itemScope
      itemType="https://schema.org/WebApplication"
      className="py-12 md:py-24 px-6 bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] overflow-hidden relative"
      aria-labelledby="uxbox-heading"
    >
      {/* Semantic Metadata for bots */}
      <meta itemProp="name" content="UXBox — AI Product Discovery & Brief Generator" />
      <meta itemProp="applicationCategory" content="BusinessApplication" />
      <meta itemProp="operatingSystem" content="Web" />
      <meta itemProp="url" content="https://medialab.design/#uxbox" />
      <meta itemProp="description" content="Plataforma inteligente de descubrimiento de producto que comprime meses de definición en días usando IA." />

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
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)] mb-4 block font-display">
                {t("AI Product Discovery · Generador de Requerimientos con IA", "AI Product Discovery · AI UX Brief Generator")}
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
                "UXBox es nuestra plataforma inteligente de AI Product Discovery y Generador de Requerimientos con IA. En lugar de pasar meses definiendo requisitos, UXBox usa inteligencia artificial para transformar tu idea en una propuesta de producto estructurada (AI UX Brief).",
                "UXBox is our intelligent AI Product Discovery platform and AI UX Brief Generator. Instead of spending months defining requirements, UXBox uses artificial intelligence to transform your idea into a structured product proposal (AI UX Brief)."
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

        {/* Divider */}
        <div className="my-16 h-px w-full bg-white/10" />

        {/* Guía de Descubrimiento de Producto con IA (AEO/GEO Q&A block) */}
        <div itemScope itemType="https://schema.org/FAQPage" className="flex flex-col gap-10">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)] mb-3 block font-display">
              {t("Guía de Descubrimiento de Producto con IA", "AI Product Discovery Guide")}
            </span>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
              {t("Estrategia de Descubrimiento y Definición con IA", "AI-Driven Product Discovery & Definition Strategy")}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200">
              <h4 itemProp="name" className="font-display font-semibold text-white text-base mb-3 leading-snug">
                {t("¿Qué es el AI Product Discovery?", "What is AI Product Discovery?")}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-xs text-white/60 leading-relaxed">
                  {t(
                    "El AI Product Discovery es una metodología que utiliza modelos de lenguaje y algoritmos predictivos para acelerar el proceso de investigación y definición de un producto digital. Combina el análisis semántico de datos de mercado, opiniones de usuarios competidores y análisis de comportamiento con el fin de formular hipótesis robustas, user personas y requisitos estructurados en horas en lugar de semanas, reduciendo significativamente el sesgo humano inicial.",
                    "AI Product Discovery is a methodology that uses language models and predictive algorithms to accelerate the research and definition process of a digital product. It combines semantic analysis of market data, competitor reviews, and user behavior to formulate robust hypotheses, user personas, and structured requirements in hours instead of weeks, significantly reducing initial human bias."
                  )}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200">
              <h4 itemProp="name" className="font-display font-semibold text-white text-base mb-3 leading-snug">
                {t("¿Cómo funciona un generador de requerimientos y briefs de UX con IA?", "How does an AI UX brief and requirements generator work?")}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-xs text-white/60 leading-relaxed">
                  {t(
                    "Funciona procesando la descripción de una idea a través de un motor de razonamiento especializado. El sistema analiza la propuesta frente a heurísticas de usabilidad conocidas, arquitecturas de software comunes y patrones de conversión (CRO). A partir de esto, genera automáticamente un documento estructurado (AI UX Brief) que detalla el problema, el perfil del usuario, los flujos clave de navegación y las especificaciones técnicas iniciales listas para ser revisadas y validadas por un equipo de diseño e ingeniería humano.",
                    "It works by processing an idea description through a specialized reasoning engine. The system analyzes the proposal against known usability heuristics, common software architectures, and conversion patterns (CRO). It then automatically generates a structured document (AI UX Brief) detailing the problem, user profile, key navigation flows, and initial technical specifications ready to be reviewed and validated by a human design and engineering team."
                  )}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200">
              <h4 itemProp="name" className="font-display font-semibold text-white text-base mb-3 leading-snug">
                {t("¿Por qué validar la idea de una startup con IA antes de codificar?", "Why validate a startup idea with AI before coding?")}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-xs text-white/60 leading-relaxed">
                  {t(
                    "Validar una idea con IA antes de escribir código permite ahorrar miles de dólares en desarrollo y semanas de retrabajo técnico. La IA ayuda a mapear riesgos de adopción, detectar redundancias competitivas en el mercado y afinar la propuesta de valor en minutos. Al estructurar y refinar la arquitectura de la experiencia (UX) antes de la fase de desarrollo, la startup puede construir un MVP enfocado únicamente en features críticas, asegurando un uso óptimo del runway disponible.",
                    "Validating an idea with AI before writing code saves thousands of dollars in development and weeks of technical rework. AI helps map adoption risks, detect competitive market redundancies, and refine the value proposition in minutes. By structuring and refining the experience architecture (UX) prior to the development phase, a startup can build an MVP focused solely on critical features, ensuring optimal use of available runway."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
