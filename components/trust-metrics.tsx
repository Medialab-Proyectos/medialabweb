"use client"

import { useEffect, useRef, useState } from "react"
import { Layers, Globe, MapPin, Clock, Users } from "lucide-react"

const metrics = [
  { value: 40, suffix: "+", label: "Proyectos B2B & B2C Entregados", icon: Layers },
  { value: 98, suffix: "%", label: "Satisfacción del Cliente", icon: Users },
  { value: 7, suffix: "", label: "Países Atendidos", icon: Globe },
  { value: 75, suffix: "%", label: "Más Rápido al Mercado", icon: Clock },
]

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-20 px-6 bg-background border-b border-border"
      aria-label="Trust metrics"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-12">
          La confianza de corporaciones B2B y marcas B2C innovadoras
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
