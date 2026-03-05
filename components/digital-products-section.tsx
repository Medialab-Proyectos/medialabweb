"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Clock } from "lucide-react"
import Image from "next/image"

const products = [
  {
    name: "SinDeudas",
    tagline: "Plataforma de Finanzas Conductuales",
    description:
      "Una plataforma de finanzas conductuales diseñada para ayudar a las personas a retomar el control de sus finanzas mediante guía emocional, estrategias inteligentes y herramientas digitales.",
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, var(--magenta), oklch(0.45 0.24 300))",
    tags: ["FinTech", "Diseño Conductual", "Mobile"],
    status: "En Desarrollo",
    image: "/images/sindeudas-mockup.jpg",
  },
  {
    name: "Electrolineras",
    tagline: "App de Red de Carga para Vehículos Eléctricos",
    description:
      "Una aplicación de movilidad diseñada para ayudar a conductores a localizar estaciones de carga para vehículos eléctricos de forma rápida y eficiente.",
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, var(--cyan), oklch(0.55 0.18 220))",
    tags: ["Movilidad", "Mapas", "Sostenibilidad"],
    status: "En Desarrollo",
    image: "/images/electrolineras-mockup.jpg",
  },
]

export function DigitalProductsSection() {
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
      id="products"
      ref={ref}
      className="py-24 px-6 bg-background"
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Productos Digitales
          </span>
          <h2
            id="products-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            Productos creados por MediaLab
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            No solo construimos para clientes — también creamos los nuestros. Estos productos reflejan
            nuestra filosofía: diseño que cambia comportamiento y genera impacto real.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <div
              key={product.name}
              className={`group relative flex flex-col gap-6 rounded-3xl overflow-hidden border border-border bg-card
                hover:border-transparent hover:shadow-2xl transition-all duration-500 cursor-default
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Product image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
                <Image
                  src={product.image}
                  alt={`${product.name} - ${product.tagline}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `linear-gradient(to top, ${product.color}, transparent)` }}
                />
              </div>

              <div className="p-8 pt-0 flex flex-col gap-5">
                {/* Status badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{ borderColor: `${product.color}40`, color: product.color, background: `${product.color}10` }}
                  >
                    <Clock size={11} />
                    {product.status}
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                    style={{ color: product.color }}
                  />
                </div>

                {/* Name */}
                <div>
                  <h3
                    className="font-display font-bold text-2xl text-foreground mb-1"
                    style={{ background: product.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">{product.tagline}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
