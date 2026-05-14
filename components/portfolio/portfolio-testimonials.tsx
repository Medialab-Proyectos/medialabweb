"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "MediaLab transformó por completo nuestro canal B2B. Lo que antes tomaba 3 meses de discovery ahora toma 3 semanas — con una experiencia de usuario que nuestros clientes corporativos adoran.",
    author: "María Rodríguez", role: "CPO", company: "Startup FinTech", metric: "75% más rápido al mercado", avatar: "MR",
  },
  {
    quote: "Su expertise en psicología del consumidor nos ayudó a aumentar la activación de usuarios B2C en 40%. La conexión emocional que lograron en el onboarding fue clave.",
    author: "Carlos Méndez", role: "Head of Product", company: "Enterprise SaaS", metric: "40% más activación", avatar: "CM",
  },
  {
    quote: "UXBox nos dio la claridad que nunca habíamos tenido para nuestro producto B2C. Pasamos de ideas vagas a un roadmap de producto validado con usuarios reales en días.",
    author: "Ana Torres", role: "Founder & CEO", company: "HealthTech Venture", metric: "10x validación más rápida", avatar: "AT",
  },
  {
    quote: "El rediseño de nuestro e-commerce triplicó la conversión en 8 semanas. El equipo entiende profundamente cómo las personas toman decisiones de compra.",
    author: "Laura Sánchez", role: "CMO", company: "Retail B2C", metric: "+62% ticket promedio", avatar: "LS",
  },
]

const logos = ["Fintech Corp", "SaaS Enterprise", "HealthTech", "Retail B2C", "Mobility Co", "EdTech"]

export function PortfolioTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 px-6 bg-background" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">Ellos lo dicen mejor que nosotros</span>
          <h2 id="testimonials-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            Lo que pasa cuando diseñas con{" "}
            <span className="bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)] bg-clip-text text-transparent">
              datos, no suposiciones
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.author} className={`relative flex flex-col gap-5 p-8 rounded-3xl border border-border bg-card transition-all duration-700 hover:border-[var(--magenta)]/30 hover:shadow-xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <Quote size={28} className="absolute top-6 right-6 opacity-10 text-[var(--magenta)]" />
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-[var(--orange)] text-[var(--orange)]" />)}</div>
              <p className="text-base text-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit" style={{ background: "var(--magenta)", color: "white" }}>{t.metric}</div>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>{t.avatar}</div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{t.author}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}, {t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border">
          {[
            { val: "4.9/5", lbl: "Nos recomiendan a otros" },
            { val: "100%", lbl: "Entregado cuando lo prometimos" },
            { val: "85%", lbl: "Vuelven con un nuevo proyecto" },
          ].map((s, i) => (
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
