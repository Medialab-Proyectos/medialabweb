"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CreditCard, Landmark, Car, Rocket, GraduationCap, ShoppingCart, Leaf, LayoutGrid } from "lucide-react"

const industries = [
  {
    label: "Fintech",
    icon: CreditCard,
    color: "var(--magenta)",
    image: "/images/industry_fintech.jpg",
    description: "Diseño de apps financieras que generan confianza",
  },
  {
    label: "Banca",
    icon: Landmark,
    color: "var(--cyan)",
    image: "/images/industry_banca.jpg",
    description: "Experiencias bancarias modernas y accesibles",
  },
  {
    label: "Movilidad",
    icon: Car,
    color: "var(--orange)",
    image: "/images/industry_movilidad.jpg",
    description: "Interfaces para el futuro del transporte urbano",
  },
  {
    label: "Startups",
    icon: Rocket,
    color: "var(--magenta)",
    image: "/images/industry_startups.jpg",
    description: "De cero a producto validado en tiempo récord",
  },
  {
    label: "Educación",
    icon: GraduationCap,
    color: "var(--cyan)",
    image: "/images/industry_educacion.jpg",
    description: "Plataformas de aprendizaje que retienen y motivan",
  },
  {
    label: "E-commerce",
    icon: ShoppingCart,
    color: "var(--orange)",
    image: "/images/industry_ecommerce.jpg",
    description: "Flujos de compra que convierten y fidelizan",
  },
  {
    label: "Medio Ambiente",
    icon: Leaf,
    color: "var(--cyan)",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80&fit=crop",
    description: "Tecnología digital al servicio del planeta",
  },
  {
    label: "Plataformas Digitales",
    icon: LayoutGrid,
    color: "var(--magenta)",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80&fit=crop",
    description: "Sistemas complejos con experiencia simple",
  },
]

export function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {industries.map((industry, i) => {
            const Icon = industry.icon
            return (
              <div
                key={industry.label}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card
                  hover:border-transparent hover:shadow-2xl transition-all duration-400 cursor-default
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${i * 70}ms`,
                  transitionDuration: "500ms",
                }}
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={`Industria ${industry.label}`}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={industry.image.startsWith("https://")}
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(180deg, transparent 30%, ${industry.color}cc 100%)`,
                      opacity: 0.75,
                    }}
                  />
                  {/* Icon badge */}
                  <div
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm"
                    style={{
                      background: `${industry.color}30`,
                      border: `1px solid ${industry.color}60`,
                    }}
                  >
                    <Icon size={15} style={{ color: "#fff" }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-1">
                  <span className="font-bold text-sm text-foreground">{industry.label}</span>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                    {industry.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-400"
                  style={{ background: industry.color }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
