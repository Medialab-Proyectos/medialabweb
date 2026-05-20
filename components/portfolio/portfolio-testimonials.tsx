"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function PortfolioTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const testimonials = [
    {
      quote: t(
        "El rediseño de nuestro e-commerce triplicó la conversión en 8 semanas. El equipo entiende profundamente cómo las personas toman decisiones de compra.",
        "Our e-commerce redesign tripled conversion in 8 weeks. The team deeply understands how people make purchase decisions."
      ),
      author: "Laura Sánchez",
      role: t("CMO", "CMO"),
      company: t("Retail B2C", "Retail B2C"),
      metric: t("+62% ticket promedio", "+62% average ticket"),
      avatar: "LS",
    },
    {
      quote: t(
        "Pasamos de un MVP frágil a una plataforma que escala. Su equipo no solo diseña — entiende arquitectura de producto y toma decisiones técnicas que ahorran meses.",
        "We went from a fragile MVP to a platform that scales. Their team doesn't just design — they understand product architecture and make technical decisions that save months."
      ),
      author: "Diego Herrera",
      role: t("CTO", "CTO"),
      company: t("Plataforma EdTech", "EdTech Platform"),
      metric: t("3x retención de usuarios", "3x user retention"),
      avatar: "DH",
    },
    {
      quote: t(
        "Nos ayudaron a repensar todo el flujo de onboarding. La tasa de activación subió 40% y las quejas de soporte bajaron a la mitad en el primer mes.",
        "They helped us rethink the entire onboarding flow. Activation rate went up 40% and support tickets dropped by half in the first month."
      ),
      author: "Carlos Méndez",
      role: t("Head of Product", "Head of Product"),
      company: t("Enterprise SaaS", "Enterprise SaaS"),
      metric: t("−50% tickets de soporte", "−50% support tickets"),
      avatar: "CM",
    },
    {
      quote: t(
        "El tráfico orgánico creció más de 200% después de que optimizaron nuestra arquitectura de información y SEO técnico. No esperábamos ese impacto.",
        "Organic traffic grew over 200% after they optimized our information architecture and technical SEO. We didn't expect that kind of impact."
      ),
      author: "Valentina Ríos",
      role: t("Head of Growth", "Head of Growth"),
      company: t("SaaS de Movilidad", "Mobility SaaS"),
      metric: t("+200% tráfico orgánico", "+200% organic traffic"),
      avatar: "VR",
    },
  ]

  const trustStats = [
    { val: "4.9/5", lbl: t("Nos recomiendan a otros", "They recommend us to others") },
    { val: "100%", lbl: t("Entregado cuando lo prometimos", "Delivered when we promised") },
    { val: "85%", lbl: t("Vuelven con un nuevo proyecto", "Return with a new project") },
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-background" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">{t("Ellos lo dicen mejor que nosotros", "They say it better than we can")}</span>
          <h2 id="testimonials-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            {t("Lo que pasa cuando diseñas con", "What happens when you design with")}{" "}
            <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
              {t("datos, no suposiciones", "data, not assumptions")}
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((item, i) => (
            <div key={item.author} className={`relative flex flex-col gap-5 p-8 rounded-3xl border border-border bg-card transition-all duration-700 hover:border-[var(--magenta)]/30 hover:shadow-xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <Quote size={28} className="absolute top-6 right-6 opacity-10 text-[var(--magenta)]" />
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-[var(--orange)] text-[var(--orange)]" />)}</div>
              <p className="text-base text-foreground leading-relaxed flex-1">&ldquo;{item.quote}&rdquo;</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit" style={{ background: "var(--magenta)", color: "white" }}>{item.metric}</div>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>{item.avatar}</div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{item.author}</span>
                  <span className="block text-xs text-muted-foreground">{item.role}, {item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border">
          {trustStats.map((s, i) => (
            <div key={s.lbl} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-2xl text-foreground">{s.val}</span>
                <span className="text-xs text-muted-foreground">{s.lbl}</span>
              </div>
              {i < 2 && <div className="w-px h-10 bg-border hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
