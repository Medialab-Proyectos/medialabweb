"use client"

import { useEffect, useRef, useState } from "react"
import { Layers, TrendingUp, Users, Clock, Award, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

function useCountUp(target: number, duration: number, active: boolean, decimals = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(decimals ? parseFloat(start.toFixed(decimals)) : Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active, decimals])
  return count
}

type Metric = {
  value: number
  suffix: string
  label: string
  icon: React.ElementType
  decimals?: number
}

function MetricCard({ m, active, i }: { m: Metric; active: boolean; i: number }) {
  const Icon = m.icon
  const count = useCountUp(m.value, 1600, active, m.decimals || 0)
  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-700 hover:border-[var(--magenta)]/30 hover:shadow-lg ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 80}ms` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="font-display font-bold text-3xl md:text-4xl text-foreground tabular-nums">
        {count}<span className="text-[var(--magenta)]">{m.suffix}</span>
      </div>
      <p className="text-xs text-muted-foreground text-center font-medium">{m.label}</p>
    </div>
  )
}

export function PortfolioMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const metrics: Metric[] = [
    { value: 40, suffix: "+", label: t("Productos entregados", "Products delivered"), icon: Layers },
    { value: 3.2, suffix: "x", label: t("ROI promedio de nuestros clientes", "Average client ROI"), icon: TrendingUp, decimals: 1 },
    { value: 98, suffix: "%", label: t("Clientes que repiten", "Returning clients"), icon: Users },
    { value: 75, suffix: "%", label: t("Más rápido al mercado", "Faster time to market"), icon: Clock },
    { value: 7, suffix: "", label: t("Países con impacto", "Countries impacted"), icon: Globe },
    { value: 15, suffix: "+", label: t("Premios y reconocimientos", "Awards & recognitions"), icon: Award },
  ]

  return (
    <section ref={ref} className="py-20 px-6 bg-secondary/30 border-y border-border" aria-label={t("Métricas de portafolio", "Portfolio metrics")}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-[var(--magenta)] mb-10">
          {t("El impacto acumulado de nuestros proyectos", "The cumulative impact of our projects")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((m, i) => <MetricCard key={m.label} m={m} active={active} i={i} />)}
        </div>
      </div>
    </section>
  )
}
