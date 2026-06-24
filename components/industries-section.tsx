"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CreditCard, Landmark, Car, Rocket, GraduationCap, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t, localized } = useLanguage()

  const scrollByDir = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const industries = [
    {
      label: t("Fintech", "Fintech"),
      icon: CreditCard,
      color: "var(--magenta)",
      image: "/images/industry_fintech.jpg",
      href: "/industrias/fintech",
      description: t(
        "Apps financieras donde la confianza se siente, no se explica",
        "Financial apps where trust is felt, not explained"
      ),
    },
    {
      label: t("Banca", "Banking"),
      icon: Landmark,
      color: "var(--cyan)",
      image: "/images/industry_banca.jpg",
      href: "/industrias/banca",
      description: t(
        "Experiencias bancarias que eliminan la ansiedad del usuario",
        "Banking experiences that remove user anxiety"
      ),
    },
    {
      label: t("Movilidad", "Mobility"),
      icon: Car,
      color: "var(--orange)",
      image: "/images/industry_movilidad.jpg",
      href: "/industrias/movilidad",
      description: t(
        "Interfaces que hacen que moverte sea simple y seguro",
        "Interfaces that make moving around simple and safe"
      ),
    },
    {
      label: t("Startups", "Startups"),
      icon: Rocket,
      color: "var(--magenta)",
      image: "/images/industry_startups.jpg",
      href: "/industrias/startups",
      description: t(
        "De idea a producto validado antes de que se acabe la pista",
        "From idea to validated product before the runway runs out"
      ),
    },
    {
      label: t("Educación", "Education"),
      icon: GraduationCap,
      color: "var(--cyan)",
      image: "/images/industry_educacion.jpg",
      href: "/industrias/educacion",
      description: t(
        "Plataformas donde aprender se siente natural, no forzado",
        "Platforms where learning feels natural, not forced"
      ),
    },
    {
      label: t("E-commerce", "E-commerce"),
      icon: ShoppingCart,
      color: "var(--orange)",
      image: "/images/industry_ecommerce.jpg",
      href: "/industrias/ecommerce",
      description: t(
        "Experiencias de compra que convierten visitantes en clientes fieles",
        "Shopping experiences that turn visitors into loyal customers"
      ),
    },
  ]

  return (
    <section
      id="industries"
      ref={ref}
      className="py-12 md:py-24 px-6 bg-background"
      aria-labelledby="industries-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Donde ya impactamos", "Where we already make impact")}
          </span>
          <h2
            id="industries-heading"
            className="font-display font-bold text-3xl md:text-4xl leading-tight text-foreground text-balance"
          >
            {t(
              "Cada industria tiene sus propios miedos y motivaciones. Nosotros los entendemos.",
              "Every industry has its own fears and motivations. We understand them."
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "No aplicamos la misma receta a todos los sectores. Investigamos las emociones específicas de tus usuarios — y diseñamos experiencias que hablan su idioma.",
              "We don't apply the same recipe to every sector. We research the specific emotions of your users — and design experiences that speak their language."
            )}
          </p>
        </div>

        {/* Industry cards — carrusel (web + móvil) */}
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:gap-5 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          {industries.map((industry, i) => {
            const Icon = industry.icon
            const cardClass = `group relative overflow-hidden rounded-2xl border border-border bg-card
                  hover:border-transparent hover:shadow-2xl transition-all duration-400
                  min-w-[72%] sm:min-w-[300px] snap-start
                  ${industry.href ? "cursor-pointer" : "cursor-default"}
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`
            const cardStyle = { transitionDelay: `${i * 70}ms`, transitionDuration: "500ms" }
            const inner = (
              <>
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={`${t("Industria", "Industry")} ${industry.label}`}
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
              </>
            )
            return industry.href ? (
              <Link key={industry.label} href={localized(industry.href)} className={cardClass} style={cardStyle} aria-label={industry.label}>
                {inner}
              </Link>
            ) : (
              <div key={industry.label} className={cardClass} style={cardStyle}>
                {inner}
              </div>
            )
          })}
          </div>

          {/* Flechas — visibles en desktop; en móvil se desliza con el dedo */}
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label={t("Anterior", "Previous")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--magenta)]/50 transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label={t("Siguiente", "Next")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--magenta)]/50 transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
