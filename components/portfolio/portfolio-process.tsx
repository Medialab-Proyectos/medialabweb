"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Compass, PenTool, Terminal, BarChart3, CheckCircle2 } from "lucide-react"

const steps = [
  { num: "01", label: "Discovery", desc: "Analizamos tu idea, mercado y usuarios con IA. En 48h tienes claridad total.", icon: Search, color: "var(--magenta)" },
  { num: "02", label: "Estrategia UX", desc: "Investigamos cómo piensan y sienten tus usuarios. Cada decisión nace de datos reales.", icon: Compass, color: "var(--cyan)" },
  { num: "03", label: "Diseño", desc: "Arquitectamos experiencias emocionales. Cada pantalla genera confianza y acción.", icon: PenTool, color: "var(--orange)" },
  { num: "04", label: "Desarrollo", desc: "Código limpio, arquitectura escalable, rendimiento que tus usuarios notan.", icon: Terminal, color: "var(--magenta)" },
  { num: "05", label: "Optimización", desc: "Medimos, iteramos y optimizamos para que conviertas más sin gastar más.", icon: BarChart3, color: "var(--cyan)" },
]

const guarantees = [
  "Consulta de discovery 100% gratuita",
  "Sprint de 48h para claridad de producto",
  "NDA disponible desde el día 1",
  "Entregables incrementales cada semana",
  "Acompañamiento post-lanzamiento incluido",
  "Garantía de satisfacción o iteramos sin costo",
]

export function PortfolioProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 px-6 bg-secondary/30" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">Así funciona</span>
          <h2 id="process-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            De idea a producto en producción.{" "}
            <span className="text-muted-foreground">Sin sorpresas.</span>
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
          <h3 className="font-display font-bold text-xl text-foreground mb-6">Lo que garantizamos en cada proyecto</h3>
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
