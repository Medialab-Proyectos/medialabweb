"use client"

import { useEffect, useRef, useState } from "react"
import { Layers, Globe, Clock, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

function useCountUp(target: number, duration = 1800, active: boolean) {
  // Start with target value for SSR/no-JS — animate down from 0 only after hydration
  const [count, setCount] = useState(target)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!active || hasAnimated.current) return
    hasAnimated.current = true
    setCount(0)
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active])
  return count
}

function MetricCard({
  value,
  suffix,
  label,
  icon: Icon,
  active,
}: {
  value: number
  suffix: string
  label: string
  icon: React.ElementType
  active: boolean
}) {
  const count = useCountUp(value, 1600, active)

  return (
    <div className="flex flex-col items-center gap-3 p-6 group">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div className="font-display font-bold text-4xl md:text-5xl text-foreground tabular-nums">
        {count}
        <span className="text-[var(--magenta)]">{suffix}</span>
      </div>
      <p className="text-sm text-muted-foreground text-center font-medium">{label}</p>
    </div>
  )
}

export function TrustMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const metrics = [
    { value: 40, suffix: "+", label: t("Productos entregados en producción", "Products shipped to production"), icon: Layers },
    { value: 98, suffix: "%", label: t("De clientes que volverían a trabajar con nosotros", "Of clients who would work with us again"), icon: Users },
    { value: 7, suffix: "", label: t("Países donde nuestro diseño impacta", "Countries where our design has impact"), icon: Globe },
    { value: 75, suffix: "%", label: t("Más rápido que el discovery tradicional (promedio)", "Faster than traditional discovery (avg.)"), icon: Clock },
  ]

  return (
    <section
      ref={ref}
      className="py-20 px-6 bg-background border-b border-border"
      aria-label="Trust metrics"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-12">
          {t(
            "Resultados reales de equipos que dejaron de adivinar y empezaron a diseñar con evidencia",
            "Real results from teams that stopped guessing and started designing with evidence"
          )}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
