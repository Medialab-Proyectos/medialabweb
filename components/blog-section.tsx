"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const articles = [
  {
    slug: "psicologia-adopcion",
    categoryEs: "Estrategia UX",
    categoryEn: "UX Strategy",
    titleEs: "La Psicología Oculta Detrás de la Adopción de Productos Digitales",
    titleEn: "The Hidden Psychology Behind Digital Product Adoption",
    excerptEs: "Por qué algunos productos se convierten en hábito y otros son abandonados — lo que la ciencia del comportamiento nos dice sobre la diferencia.",
    excerptEn: "Why some products become habits while others are abandoned — what behavioral science tells us about the difference.",
    readTime: "5 min",
    date: "Feb 2025",
    image: "/images/blog-behavioral.jpg",
    color: "#E8751A",
    featured: true,
  },
  {
    slug: "discovery-ia",
    categoryEs: "IA en UX",
    categoryEn: "AI in UX",
    titleEs: "Discovery con IA: El Fin de los Workshops Interminables",
    titleEn: "AI-Driven Discovery: The End of Endless Workshops",
    excerptEs: "Cómo las herramientas inteligentes están reemplazando semanas de sesiones con stakeholders.",
    excerptEn: "How intelligent tools are replacing weeks of stakeholder sessions.",
    readTime: "4 min",
    date: "Ene 2025",
    image: "/images/blog-ai.jpg",
    color: "#2AABB3",
    featured: false,
  },
  {
    slug: "ux-fintech",
    categoryEs: "Diseño Conductual",
    categoryEn: "Behavioral Design",
    titleEs: "Diseñando para la Confianza: UX y Comportamiento Financiero",
    titleEn: "Designing for Trust: UX and Financial Behavior",
    excerptEs: "Los principios de diseño que hacen que las personas se sientan seguras tomando decisiones financieras digitalmente.",
    excerptEn: "The design principles that make people feel safe making financial decisions digitally.",
    readTime: "6 min",
    date: "Ene 2025",
    image: "/images/blog-fintech.jpg",
    color: "#E8751A",
    featured: false,
  },
  {
    slug: "mvp-escala",
    categoryEs: "Innovación de Producto",
    categoryEn: "Product Innovation",
    titleEs: "De MVP a Escala: Decisiones de Arquitectura que Importan",
    titleEn: "From MVP to Scale: Architecture Decisions That Matter",
    excerptEs: "Las decisiones técnicas que tomes en el MVP definirán qué tan rápido puedes crecer.",
    excerptEn: "The technical decisions you make at MVP stage will define how fast you can grow.",
    readTime: "7 min",
    date: "Dic 2024",
    image: "/images/blog-mvp.jpg",
    color: "#2AABB3",
    featured: false,
  },
]

export function BlogSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <section id="blog" ref={ref} className="py-24 px-6" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--magenta)" }}>
              {t("Blog", "Blog")}
            </span>
            <h2 id="blog-heading" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance leading-tight">
              {t("Ideas y perspectivas", "Ideas & perspectives")}
            </h2>
          </div>
          <a href="#blog" className="group inline-flex items-center gap-2 text-sm font-semibold shrink-0"
            style={{ color: "var(--magenta)" }}>
            {t("Ver todos los artículos", "View all articles")}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        <div className={`grid lg:grid-cols-3 gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Featured article — tall card spanning 1 col on lg, full on mobile */}
          <a href="#blog"
            className="group lg:col-span-1 flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300">
            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden shrink-0">
              <Image
                src={featured.image}
                alt={t(featured.titleEs, featured.titleEn)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Category chip on top of image */}
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: featured.color }}>
                {t(featured.categoryEs, featured.categoryEn)}
              </span>
            </div>
            {/* Content */}
            <div className="flex flex-col gap-3 p-6 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase w-fit"
                style={{ color: featured.color, background: `${featured.color}18` }}>
                {t("Destacado", "Featured")}
              </div>
              <h3 className="font-display font-bold text-lg text-foreground leading-snug text-balance group-hover:opacity-80 transition-opacity">
                {t(featured.titleEs, featured.titleEn)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {t(featured.excerptEs, featured.excerptEn)}
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={11} />{featured.readTime}</span>
                <span className="ml-auto font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: featured.color }}>
                  {t("Leer", "Read")} <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </a>

          {/* Right column — remaining 3 articles stacked */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {rest.map((article, i) => (
              <a
                key={article.slug}
                href="#blog"
                className="group flex gap-5 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300 p-0"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative w-36 md:w-48 shrink-0 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={t(article.titleEs, article.titleEn)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col gap-2 py-5 pr-6 flex-1 justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: article.color }}>
                    {t(article.categoryEs, article.categoryEn)}
                  </span>
                  <h3 className="font-display font-semibold text-base text-foreground leading-snug text-balance group-hover:opacity-80 transition-opacity line-clamp-2">
                    {t(article.titleEs, article.titleEn)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 hidden md:block">
                    {t(article.excerptEs, article.excerptEn)}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
                    <span className="text-muted-foreground/60">{article.date}</span>
                    <span className="ml-auto font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color: article.color }}>
                      {t("Leer", "Read")} <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
