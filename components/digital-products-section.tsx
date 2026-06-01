"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Clock } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function DigitalProductsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const products = [
    {
      name: "SinDeudas",
      tagline: t(
        "Plataforma B2C de Finanzas Conductuales",
        "B2C Behavioral Finance Platform"
      ),
      description: t(
        "Una experiencia B2C diseñada para conectar emocionalmente con personas en situación de deuda. Combina guía emocional, psicología del consumidor y herramientas digitales inteligentes para transformar la relación del usuario con sus finanzas.",
        "A B2C experience designed to emotionally connect with people in debt. It combines emotional guidance, consumer psychology, and intelligent digital tools to transform the user's relationship with their finances."
      ),
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, var(--magenta), oklch(0.45 0.24 300))",
      tags: [t("FinTech B2C", "B2C FinTech"), t("Diseño Conductual", "Behavioral Design"), "Mobile"],
      status: t("En Desarrollo", "In Development"),
      image: "/images/sindeudas (1).png",
    },
    {
      name: "Electrolineras",
      tagline: t(
        "App B2C/B2B para Red de Carga Eléctrica",
        "B2C/B2B App for Electric Charging Network"
      ),
      description: t(
        "Una aplicación de movilidad sustentable que conecta conductores B2C con estaciones de carga y ofrece a operadores B2B un dashboard de gestión en tiempo real.",
        "A sustainable mobility app that connects B2C drivers with charging stations and offers B2B operators a real-time management dashboard."
      ),
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, var(--cyan), oklch(0.55 0.18 220))",
      tags: [t("Movilidad", "Mobility"), "B2B + B2C", t("Sostenibilidad", "Sustainability")],
      status: t("En Desarrollo", "In Development"),
      image: "/images/eletro.png",
    },
  ]

  return (
    <section
      id="products"
      ref={ref}
      className="py-12 md:py-24 px-6 bg-background"
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Image src="/images/ecosistema/lab.svg" alt="UXLab" width={110} height={30} className="h-7 w-auto dark:brightness-0 dark:invert dark:opacity-60 opacity-70" />
            <span className="w-px h-5 bg-border" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
              {t("Nuestros propios productos", "Our own products")}
            </span>
          </div>
          <h2
            id="products-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "No solo diseñamos para otros. También ponemos nuestra propia piel en el juego.",
              "We don't just design for others. We also put our own skin in the game."
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Construimos productos propios porque creemos que la mejor forma de demostrar lo que hacemos es vivirlo. Cada uno aplica los mismos principios que usamos con nuestros clientes.",
              "We build our own products because we believe the best way to demonstrate what we do is to live it. Each one applies the same principles we use with our clients."
            )}
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
