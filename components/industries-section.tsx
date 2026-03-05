"use client"

import { useEffect, useRef, useState } from "react"
import { Landmark, Car, Rocket, GraduationCap, ShoppingCart, Leaf, LayoutGrid, CreditCard } from "lucide-react"

const industries = [
  { label: "Fintech", icon: CreditCard, color: "var(--magenta)" },
  { label: "Banca", icon: Landmark, color: "var(--cyan)" },
  { label: "Movilidad", icon: Car, color: "var(--orange)" },
  { label: "Startups", icon: Rocket, color: "var(--magenta)" },
  { label: "Educación", icon: GraduationCap, color: "var(--cyan)" },
  { label: "E-commerce", icon: ShoppingCart, color: "var(--orange)" },
  { label: "Medio Ambiente", icon: Leaf, color: "var(--cyan)" },
  { label: "Plataformas Digitales", icon: LayoutGrid, color: "var(--magenta)" },
]

export function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="industries"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-labelledby="industries-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Industrias
          </span>
          <h2
            id="industries-heading"
            className="font-display font-bold text-3xl md:text-4xl leading-tight text-foreground text-balance"
          >
            Trabajamos en industrias que moldean el futuro
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Desde fintech hasta soluciones ambientales — nuestro equipo multidisciplinario lleva
            diseño centrado en el humano a los sectores que más importan.
          </p>
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry, i) => {
            const Icon = industry.icon
            return (
              <div
                key={industry.label}
                className={`group flex flex-col items-center gap-4 p-6 rounded-2xl border border-border bg-card
                  hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-default
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{
                  transitionDelay: `${i * 60}ms`,
                  transitionProperty: "all",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${industry.color}20`, border: `1px solid ${industry.color}40` }}
                >
                  <Icon size={22} style={{ color: industry.color }} />
                </div>
                <span className="font-semibold text-sm text-foreground text-center">{industry.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
