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
        "MediaLab nos ayudó a construir una experiencia B2C que realmente conecta con nuestros usuarios. Su enfoque basado en datos y psicología del consumidor transformó nuestro producto digital.",
        "MediaLab helped us build a B2C experience that truly connects with our users. Their data-driven approach and consumer psychology transformed our digital product."
      ),
      author: "Alexander Naranjo",
      role: "CEO",
      company: "Metrics Lab",
      metric: t("Producto B2C transformado", "B2C product transformed"),
      avatar: "AN",
    },
    {
      quote: t(
        "Trabajar con MediaLab en nuestras plataformas educativas y motores de aprendizaje fue un antes y un después. Entendieron la complejidad de nuestras necesidades institucionales y entregaron soluciones que realmente impactan.",
        "Working with MediaLab on our educational platforms and learning engines was a turning point. They understood the complexity of our institutional needs and delivered solutions that truly make an impact."
      ),
      author: "Rosa Eugenia Beltrán",
      role: t("Directora", "Director"),
      company: "Funcicolombia & ESAF",
      metric: t("Plataformas educativas rediseñadas", "Educational platforms redesigned"),
      avatar: "RB",
    },
    {
      quote: t(
        "MediaLab entendió nuestra visión B2B desde el primer día. Nos ayudaron a construir una presencia digital sólida y proyectos que generan confianza con nuestros clientes corporativos.",
        "MediaLab understood our B2B vision from day one. They helped us build a solid digital presence and projects that generate trust with our corporate clients."
      ),
      author: "Claudia Lazaneo",
      role: "Founder & CEO",
      company: "Vinnove",
      metric: t("Presencia B2B fortalecida", "B2B presence strengthened"),
      avatar: "CL",
    },
    {
      quote: t(
        "MediaLab proporcionó una asesoría clara y dinámica que permitió a nuestros estudiantes desarrollar sus habilidades de manera efectiva. El proyecto fue todo un éxito — entregamos a tiempo, dentro del presupuesto, y el cliente quedó muy satisfecho con un diseño innovador y visualmente atractivo.",
        "MediaLab provided clear, dynamic guidance that allowed our students to develop their skills effectively. The project was a complete success — we delivered on time, within budget, and the client was very satisfied with an innovative and visually appealing design."
      ),
      author: "Héctor Zuñiga",
      role: "CEO",
      company: "Global Talentech",
      metric: t("Entrega exitosa a tiempo y en presupuesto", "Successful on-time, on-budget delivery"),
      avatar: "HZ",
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
