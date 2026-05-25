"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import {
  ArrowRight,
  Brain,
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
      className="relative py-28 px-6 overflow-hidden"
      aria-labelledby="curso-promo-heading"
    >
      {/* Cinematic dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-dark)] via-[var(--surface-dark)]/90 to-[var(--surface-mid)] transition-colors duration-300" />

      {/* Ambient glow orbs (Dark only) */}
      <div className="absolute top-[15%] left-[10%] w-[420px] h-[420px] bg-[var(--magenta)]/[0.05] rounded-full blur-[180px] pointer-events-none ambient-glow" />
      <div className="absolute bottom-[10%] right-[15%] w-[380px] h-[380px] bg-[var(--cyan)]/[0.04] rounded-full blur-[160px] pointer-events-none ambient-glow" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--dot-color) 1px, transparent 1px), linear-gradient(90deg, var(--dot-color) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top layout: text + card */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div
            className={`flex flex-col gap-6 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--magenta)]/20 bg-[var(--magenta)]/[0.08]">
                <Sparkles size={12} style={{ color: "var(--magenta)" }} />
                <span
                  className="text-[11px] tracking-[0.12em] uppercase font-semibold"
                  style={{ color: "var(--magenta)" }}
                >
                  {t("Nuevo · Formación Profesional", "New · Professional Training")}
                </span>
              </span>
            </div>

            {/* Headline */}
            <h2
              id="curso-promo-heading"
              className="font-display font-bold text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] dark:text-white text-foreground text-balance"
            >
              {t(
                "Aprende a construir con IA sin perder tu criterio humano.",
                "Learn to build with AI without losing your human judgment."
              )}
            </h2>

            {/* Subtext */}
            <p className="text-base md:text-lg dark:text-white/65 text-muted-foreground leading-relaxed max-w-xl">
              {t(
                "Nuestra metodología de 9 módulos para diseñadores UX/UI, developers y startups que quieren usar IA como copiloto estratégico — no como reemplazo.",
                "Our 9-module methodology for UX/UI designers, developers, and startups that want to use AI as a strategic copilot — not a replacement."
              )}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 text-xs dark:text-white/35 text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <Users size={13} className="dark:text-white/25 text-muted-foreground/40 shrink-0" />
                {t("Cohorte 01 · Solo 30 cupos", "Cohort 01 · Only 30 spots")}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={13} className="dark:text-white/25 text-muted-foreground/40 shrink-0" />
                {t("Metodología propietaria validada", "Validated proprietary methodology")}
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href={localized("/curso")}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95 w-full sm:w-auto"
                style={{ background: "var(--magenta)" }}
              >
                {t("Explorar el curso", "Explore the course")}
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href={localized("/curso") + "#metodologia"}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium dark:text-white/65 text-foreground/75 border dark:border-white/[0.08] border-foreground/15 hover:dark:border-white/[0.18] hover:border-foreground/30 hover:dark:text-white hover:text-foreground hover:dark:bg-white/[0.02] hover:bg-foreground/[0.02] transition-all duration-300 w-full sm:w-auto"
              >
                {t("Ver metodología", "View methodology")}
              </Link>
            </div>
          </div>

          {/* Right — highlights card */}
          <div
            className={`relative transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="rounded-3xl border dark:border-white/[0.06] border-foreground/10 dark:bg-white/[0.02] bg-foreground/[0.02] backdrop-blur-sm p-8 md:p-10 flex flex-col gap-7">
              {/* Card header */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)]">
                  {t("¿Qué vas a lograr?", "What will you achieve?")}
                </span>
                <p className="text-sm dark:text-white/60 text-muted-foreground leading-relaxed">
                  {t(
                    "Un programa intensivo diseñado para profesionales que quieren liderar la era IA con criterio, no con miedo.",
                    "An intensive program for professionals who want to lead the AI era with judgment, not fear."
                  )}
                </p>
              </div>

              {/* Highlights */}
              <div className="flex flex-col gap-5">
                {highlights.map((h, i) => {
                  const Icon = h.icon
                  return (
                    <div
                      key={i}
                      className="group flex gap-4 items-start p-4 rounded-2xl border border-transparent hover:dark:border-white/[0.06] hover:border-foreground/10 hover:dark:bg-white/[0.02] hover:bg-foreground/[0.02] transition-all duration-300"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background:
                            i === 0
                              ? "linear-gradient(135deg, var(--magenta), #c55a0f)"
                              : i === 1
                              ? "linear-gradient(135deg, var(--cyan), #1a7a80)"
                              : "linear-gradient(135deg, var(--magenta), var(--cyan))",
                        }}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold dark:text-white text-foreground">
                          {t(h.titleEs, h.titleEn)}
                        </h3>
                        <p className="text-xs dark:text-white/60 text-muted-foreground leading-relaxed">
                          {t(h.descEs, h.descEn)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bottom accent line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--magenta)]/30 to-transparent" />

              {/* Quote */}
              <p className="text-xs dark:text-white/25 text-muted-foreground/45 italic text-center">
                &ldquo;{t(
                  "La IA genera opciones. Tú aprenderás a darles sentido.",
                  "AI generates options. You'll learn to give them meaning."
                )}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
