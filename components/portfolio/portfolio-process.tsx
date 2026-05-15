"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Compass, PenTool, Terminal, BarChart3, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function PortfolioProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const steps = [
    { num: "01", label: t("Discovery", "Discovery"), desc: t("Analizamos tu idea, mercado y usuarios con IA. En 48h tienes claridad total.", "We analyze your idea, market, and users with AI. In 48h you have full clarity."), icon: Search, color: "var(--magenta)" },
    { num: "02", label: t("Estrategia UX", "UX Strategy"), desc: t("Investigamos cómo piensan y sienten tus usuarios. Cada decisión nace de datos reales.", "We research how your users think and feel. Every decision is born from real data."), icon: Compass, color: "var(--cyan)" },
    { num: "03", label: t("Diseño", "Design"), desc: t("Arquitectamos experiencias emocionales. Cada pantalla genera confianza y acción.", "We architect emotional experiences. Every screen builds trust and drives action."), icon: PenTool, color: "var(--orange)" },
    { num: "04", label: t("Desarrollo", "Development"), desc: t("Código limpio, arquitectura escalable, rendimiento que tus usuarios notan.", "Clean code, scalable architecture, performance your users notice."), icon: Terminal, color: "var(--magenta)" },
    { num: "05", label: t("Optimización", "Optimization"), desc: t("Medimos, iteramos y optimizamos para que conviertas más sin gastar más.", "We measure, iterate and optimize so you convert more without spending more."), icon: BarChart3, color: "var(--cyan)" },
  ]

  const guarantees = [
    t("Consulta de discovery 100% gratuita", "100% free discovery consultation"),
    t("Sprint de 48h para claridad de producto", "48h sprint to product clarity"),
    t("NDA disponible desde el día 1", "NDA available from day 1"),
    t("Entregables incrementales cada semana", "Weekly incremental deliverables"),
    t("Acompañamiento post-lanzamiento incluido", "Post-launch support included"),
    t("Garantía de satisfacción o iteramos sin costo", "Satisfaction guarantee or we iterate at no cost"),
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-secondary/30" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">{t("Así funciona", "How it works")}</span>
          <h2 id="process-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            {t("De idea a producto en producción.", "From idea to product in production.")}{" "}
            <span className="text-muted-foreground">{t("Sin sorpresas.", "No surprises.")}</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.num} className={`relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card transition-all duration-700 hover:border-[var(--magenta)]/30 hover:shadow-lg ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-2 w-4 h-px bg-border z-10" aria-hidden="true" />
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color }}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: s.color }}>{s.num}</span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Guarantees */}
        <div className={`rounded-2xl border border-border bg-card p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "500ms" }}>
          <h3 className="font-display font-bold text-xl text-foreground mb-6">{t("Lo que garantizamos en cada proyecto", "What we guarantee in every project")}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {guarantees.map((g) => (
              <div key={g} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                {g}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
