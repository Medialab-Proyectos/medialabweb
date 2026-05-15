"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      quote: t(
        "MediaLab transformó por completo nuestro canal B2B. Lo que antes tomaba 3 meses de discovery ahora toma 3 semanas — con una experiencia de usuario que nuestros clientes corporativos adoran.",
        "MediaLab completely transformed our B2B channel. What used to take 3 months of discovery now takes 3 weeks — with a user experience our enterprise clients love."
      ),
      author: "María Rodríguez",
      role: "CPO",
      company: t("Startup FinTech", "FinTech Startup"),
      metric: t("75% más rápido al mercado", "75% faster to market"),
      avatar: "MR",
    },
    {
      quote: t(
        "Su expertise en psicología del consumidor nos ayudó a aumentar la activación de usuarios B2C en 40%. La conexión emocional que lograron en el onboarding fue clave.",
        "Their expertise in consumer psychology helped us increase B2C user activation by 40%. The emotional connection they achieved in onboarding was key."
      ),
      author: "Carlos Méndez",
      role: t("Head of Product", "Head of Product"),
      company: "Enterprise SaaS",
      metric: t("40% más activación", "40% more activation"),
      avatar: "CM",
    },
    {
      quote: t(
        "UXBox nos dio la claridad que nunca habíamos tenido para nuestro producto B2C. Pasamos de ideas vagas a un roadmap de producto validado con usuarios reales en días.",
        "UXBox gave us a clarity we'd never had for our B2C product. We went from vague ideas to a roadmap validated with real users in days."
      ),
      author: "Ana Torres",
      role: "Founder & CEO",
      company: "HealthTech Venture",
      metric: t("10x validación más rápida", "10x faster validation"),
      avatar: "AT",
    },
  ]

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Lo que dicen quienes ya lo vivieron", "What those who lived it say")}
          </span>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "No te lo contamos nosotros. Te lo cuentan ellos.",
              "We don't tell you. They tell you."
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Líderes de producto que llegaron con un problema real y se fueron con un producto que sus usuarios aman. Estas son sus palabras, no las nuestras.",
              "Product leaders who came with a real problem and left with a product their users love. These are their words, not ours."
            )}
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={item.author}
              className={`relative flex flex-col gap-6 p-8 rounded-3xl border border-border bg-card transition-all duration-700 hover:border-[var(--magenta)]/30 hover:shadow-xl ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Quote icon */}
              <Quote
                size={32}
                className="absolute top-6 right-6 opacity-10"
                style={{ color: "var(--magenta)" }}
              />

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-[var(--orange)] text-[var(--orange)]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-foreground leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Metric badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                style={{
                  background: "var(--magenta)",
                  color: "white",
                }}
              >
                {item.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
                >
                  {item.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{item.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.role}, {item.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-foreground">4.9/5</span>
            <span className="text-xs text-muted-foreground">{t("Nos recomiendan a otros", "They recommend us to others")}</span>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-foreground">100%</span>
            <span className="text-xs text-muted-foreground">{t("Entregado cuando lo prometimos", "Delivered when we promised")}</span>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-foreground">85%</span>
            <span className="text-xs text-muted-foreground">{t("Vuelven con un nuevo proyecto", "Return with a new project")}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
