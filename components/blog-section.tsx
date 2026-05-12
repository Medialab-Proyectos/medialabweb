"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const articles = [
  {
    slug: "arquitectura-percepcion",
    categoryEs: "Diseño UX",
    categoryEn: "UX Design",
    titleEs: "La Arquitectura de la Percepción: Tus Usuarios No Navegan Flujos, Sino Estados Emocionales",
    titleEn: "The Architecture of Perception: Users Navigate Emotional States, Not Flows",
    excerptEs: "El error más costoso del UX moderno es diseñar para un usuario ideal en lugar del usuario real. Descubre los 4 estados críticos de la percepción consciente.",
    excerptEn: "The costliest UX mistake is designing for an ideal user instead of the real one. Discover the 4 critical states of conscious perception.",
    readTime: "8 min",
    date: "May 2026",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    color: "#E8751A",
    featured: true,
  },
  {
    slug: "adn-del-significado",
    categoryEs: "Producto",
    categoryEn: "Product",
    titleEs: "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios",
    titleEn: "The DNA of Meaning: Why Motivation Isn't Enough to Retain Users",
    excerptEs: "La motivación inicia la acción, pero el significado sostiene el hábito. 4 patrones de diseño noético para crear productos que trascienden.",
    excerptEn: "Motivation starts the action, but meaning sustains the habit. 4 noetic design patterns for products that transcend.",
    readTime: "7 min",
    date: "May 2026",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    color: "#2AABB3",
    featured: false,
  },
  {
    slug: "trono-de-la-decision",
    categoryEs: "IA y Ética",
    categoryEn: "AI & Ethics",
    titleEs: "El Trono de la Decisión: IA, Autonomía Humana y Diseño Ético",
    titleEn: "The Throne of Decision: AI, Human Autonomy, and Ethical Design",
    excerptEs: "En la era de los agentes de IA, el mayor riesgo no es la privacidad — es la infantilización del usuario. La ética estoica aplicada al diseño digital.",
    excerptEn: "In the age of AI agents, the greatest risk isn't privacy — it's user infantilization. Stoic ethics applied to digital design.",
    readTime: "9 min",
    date: "May 2026",
    image: "/images/blog-zero-ui-decision.png",
    color: "#E8751A",
    featured: false,
  },
  {
    slug: "influencia-sin-erosion",
    categoryEs: "Diseño Conductual",
    categoryEn: "Behavioral Design",
    titleEs: "Influencia sin Erosión: Diseño de Comportamiento Sostenible sin Manipular",
    titleEn: "Influence Without Erosion: Sustainable Behavior Design Without Manipulation",
    excerptEs: "El comportamiento sostenido no nace de la presión. Nace de una conciencia respetada. Las 4 capas de la acción y el caso del botón de $300 millones.",
    excerptEn: "Sustained behavior doesn't come from pressure — it comes from respected consciousness. The 4 layers of action and the $300M button case.",
    readTime: "10 min",
    date: "May 2026",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop",
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
              {t("Ideas sobre diseño UX, IA y experiencias B2B/B2C", "Ideas on UX design, AI and B2B/B2C experiences")}
            </h2>
          </div>
          <a href="/blog" className="group inline-flex items-center gap-2 text-sm font-semibold shrink-0"
            style={{ color: "var(--magenta)" }}>
            {t("Ver todos los artículos", "View all articles")}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        <div className={`grid lg:grid-cols-3 gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Featured article — tall card spanning 1 col on lg, full on mobile */}
          <a href={`/blog/${featured.slug}`}
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
                href={`/blog/${article.slug}`}
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
