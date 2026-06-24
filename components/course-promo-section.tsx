"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import {
  ArrowRight,
  Brain,
  Download,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

const highlights = [
  {
    icon: Layers,
    titleEs: "9 módulos metodológicos",
    titleEn: "9 methodological modules",
    descEs: "Un sistema completo para integrar IA en tu flujo de diseño y desarrollo — paso a paso.",
    descEn: "A complete system to integrate AI into your design and dev workflow — step by step.",
  },
  {
    icon: Brain,
    titleEs: "Criterio humano primero",
    titleEn: "Human judgment first",
    descEs: "La IA genera opciones. Tú aprendes a darles sentido, contexto y dirección.",
    descEn: "AI generates options. You learn to give them meaning, context, and direction.",
  },
  {
    icon: Zap,
    titleEs: "Proyectos reales",
    titleEn: "Real projects",
    descEs: "No teoría abstracta: frameworks aplicados a producto, UX y growth desde el día uno.",
    descEn: "Not abstract theory: frameworks applied to product, UX, and growth from day one.",
  },
]

export function CoursePromoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t, localized } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="curso-promo"
      ref={ref}
      className="dark-hero-text relative py-28 px-6 overflow-hidden isolate"
      aria-labelledby="curso-promo-heading"
    >
      {/* Base oscura neutra fija (independiente del tema, sin tinte morado) */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(160deg, #07090c 0%, #080b10 50%, #0a0f14 100%)" }}
        aria-hidden="true"
      />

      {/* Glows vívidos — naranja + cian protagonistas, magenta de acento (base neutra, sin morado) */}
      <div
        className="absolute -top-24 left-[2%] w-[500px] h-[500px] rounded-full blur-[150px] -z-10 animate-float-1 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(42,171,179,0.28), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-[4%] w-[500px] h-[500px] rounded-full blur-[160px] -z-10 animate-float-2 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,117,26,0.26), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] right-[34%] w-[360px] h-[360px] rounded-full blur-[150px] -z-10 animate-float-3 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(230,0,126,0.14), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Rejilla técnica (vibra IA) — líneas blancas tenues con desvanecido */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 42%, #000 5%, transparent 80%)",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 42%, #000 5%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* Líneas de separación superior e inferior (gradiente de marca) */}
      <div
        className="absolute top-0 inset-x-0 h-px -z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(232,117,26,0.55), rgba(42,171,179,0.55), transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px -z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(42,171,179,0.4), rgba(232,117,26,0.4), transparent)" }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-6 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Eyebrow — logo arriba, badge debajo (conexión) */}
        <div className="flex flex-col items-center gap-3">
          <Image src="/images/ecosistema/school.svg" alt="UXSchool" width={110} height={30} className="h-7 w-auto brightness-0 invert opacity-70" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--orange)]/30 bg-[var(--orange)]/[0.12]">
            <Sparkles size={12} style={{ color: "var(--orange)" }} />
            <span className="text-[11px] tracking-[0.12em] uppercase font-semibold" style={{ color: "var(--orange)" }}>
              {t("Nuevo · Formación Profesional", "New · Professional Training")}
            </span>
          </span>
        </div>

        {/* Headline */}
        <h2
          id="curso-promo-heading"
          className="font-display font-bold text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] text-white text-balance"
        >
          {t("Aprende a construir con IA sin perder tu ", "Learn to build with AI without losing your ")}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, var(--cyan), var(--magenta))" }}>
            {t("criterio humano", "human judgment")}
          </span>
          {t(".", ".")}
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-2xl">
          {t(
            "Nuestra metodología de 9 módulos para diseñadores UX/UI, developers y startups que quieren usar IA como copiloto estratégico — no como reemplazo.",
            "Our 9-module methodology for UX/UI designers, developers, and startups that want to use AI as a strategic copilot — not a replacement."
          )}
        </p>

        {/* Highlights — en línea, sin caja, con icono */}
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 pt-1">
          {highlights.map((h, i) => {
            const Icon = h.icon
            const color = i === 0 ? "var(--magenta)" : i === 1 ? "var(--cyan)" : "var(--orange)"
            return (
              <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
                <Icon size={16} style={{ color }} />
                {t(h.titleEs, h.titleEn)}
              </span>
            )
          })}
        </div>

        {/* CTA — full width en móvil */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 w-full sm:w-auto">
          <Link
            href={localized("/curso")}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95 w-full sm:w-auto"
            style={{ background: "var(--orange)", boxShadow: "0 10px 30px rgba(232,117,26,0.35)" }}
          >
            {t("Explorar el curso", "Explore the course")}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="/images/curso/Curso2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white/80 border border-[var(--cyan)]/45 hover:border-[var(--cyan)]/80 hover:text-white hover:bg-[var(--cyan)]/10 transition-all duration-300 w-full sm:w-auto"
          >
            <Download size={16} />
            {t("Descargar currículo", "Download curriculum")}
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-white/45 pt-1">
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-white/35 shrink-0" />
            {t("Cohorte 02 · Solo 30 cupos", "Cohort 02 · Only 30 spots")}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap size={13} className="text-white/35 shrink-0" />
            {t("Metodología propietaria validada", "Validated proprietary methodology")}
          </span>
        </div>
      </div>
    </section>
  )
}
