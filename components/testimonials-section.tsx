"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Star, Quote, Linkedin, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  const testimonials = [
    {
      quote: t(
        "MediaLab nos ayudó a construir una experiencia B2C que realmente conecta con nuestros usuarios. Su enfoque basado en datos y psicología del consumidor transformó nuestro producto digital.",
        "MediaLab helped us build a B2C experience that truly connects with our users. Their data-driven approach and consumer psychology transformed our digital product."
      ),
      challenge: t(
        "Su producto B2C no lograba conectar emocionalmente con los usuarios.",
        "Their B2C product wasn't connecting emotionally with users."
      ),
      author: "Alexander Naranjo",
      role: "CEO",
      company: "Metrics Lab",
      metric: t("Producto B2C transformado", "B2C product transformed"),
      logo: "/images/logo-metrixslab.png",
      linkedin: "https://www.linkedin.com/in/alexandernaranjo/",
    },
    {
      quote: t(
        "Trabajar con MediaLab fue un antes y un después. Entendieron la complejidad de nuestras necesidades institucionales y entregaron soluciones que realmente impactan en el aprendizaje.",
        "Working with MediaLab was a turning point. They understood our institutional complexity and delivered solutions that truly impact learning."
      ),
      challenge: t(
        "Plataformas educativas con necesidades institucionales complejas por resolver.",
        "Educational platforms with complex institutional needs to solve."
      ),
      author: "Rosa Eugenia Beltrán",
      role: t("Directora", "Director"),
      company: "Funcicolombia & ESAF",
      metric: t("Plataformas educativas rediseñadas", "Educational platforms redesigned"),
      logo: "/images/logo-esaf.png",
      linkedin: "https://www.linkedin.com/in/rosa-eugenia-beltran-332408173/",
    },
    {
      quote: t(
        "MediaLab entendió nuestra visión B2B desde el primer día. Nos ayudaron a construir una presencia digital sólida y proyectos que generan confianza con nuestros clientes corporativos.",
        "MediaLab understood our B2B vision from day one. They helped us build a solid digital presence and projects that generate trust with our corporate clients."
      ),
      challenge: t(
        "Necesitaban una presencia digital B2B que generara confianza con clientes corporativos.",
        "They needed a B2B digital presence that built trust with corporate clients."
      ),
      author: "Claudia Lazaneo",
      role: "Founder & CEO",
      company: "Vinnove",
      metric: t("Presencia B2B fortalecida", "B2B presence strengthened"),
      logo: "/images/logo-vinnove.png",
      linkedin: "https://www.linkedin.com/in/claudia-lazaneo/",
    },
    {
      quote: t(
        "MediaLab proporcionó una asesoría clara que permitió a nuestros estudiantes desarrollar sus habilidades de manera efectiva. Entregamos a tiempo, dentro del presupuesto, y el cliente quedó muy satisfecho con el diseño.",
        "MediaLab provided clear guidance that allowed our students to build skills effectively. We delivered on time, on budget, and the client was very satisfied with the design."
      ),
      challenge: t(
        "Necesitaban que sus estudiantes desarrollaran habilidades de forma efectiva, a tiempo y en presupuesto.",
        "They needed their students to build skills effectively, on time and on budget."
      ),
      author: "Héctor Zuñiga",
      role: "CEO",
      company: "Global Talentech",
      metric: t("Entrega exitosa a tiempo y en presupuesto", "Successful on-time, on-budget delivery"),
      logo: "/images/logo-talentech.png",
      linkedin: "https://www.linkedin.com/in/hector-zd/",
    },
  ]

  return (
    <section
      ref={ref}
      className="py-12 md:py-24 px-6 bg-background"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Lo que dicen quienes ya lo vivieron", "What those who lived it say")}
          </span>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "No te lo contamos nosotros. Te lo cuentan ellos.",
              "We don't tell you. They tell you."
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Líderes de producto que llegaron con un problema real y se fueron con un producto que sus usuarios aman. Estas son sus palabras, no las nuestras.",
              "Product leaders who came with a real problem and left with a product their users love. These are their words, not ours."
            )}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((item, i) => (
                <CarouselItem key={item.author} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    itemScope
                    itemType="https://schema.org/Review"
                    className={`relative flex flex-col gap-6 p-8 rounded-3xl border border-border bg-card h-full transition-all duration-700 hover:border-[var(--magenta)]/30 hover:shadow-xl ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {/* Semantic Metadata for bots */}
                    <div itemProp="itemReviewed" itemScope itemType="https://schema.org/LocalBusiness">
                      <meta itemProp="name" content="MediaLab Ingeniería" />
                      <meta itemProp="image" content="https://medialab.design/images/og-main-brand.png" />
                      <meta itemProp="telephone" content="+57-305-400-9505" />
                      <meta itemProp="address" content="Bogotá, Colombia" />
                    </div>
                    <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                      <meta itemProp="ratingValue" content="5" />
                      <meta itemProp="bestRating" content="5" />
                    </div>

                    {/* Quote icon */}
                    <Quote
                      size={32}
                      className="absolute top-6 right-6 opacity-10"
                      style={{ color: "var(--magenta)" }}
                    />

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className="fill-[var(--orange)] text-[var(--orange)]"
                        />
                      ))}
                    </div>

                    {/* El reto (encuadre) */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {t("El reto", "The challenge")}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.challenge}</p>
                    </div>

                    {/* Lo que vivieron (cita textual del cliente) */}
                    <p itemProp="reviewBody" className="text-base text-foreground leading-relaxed flex-1">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    {/* El resultado */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--magenta)" }}>
                        {t("El resultado", "The result")}
                      </span>
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                        style={{ background: "var(--magenta)", color: "white" }}
                      >
                        {item.metric}
                      </div>
                    </div>

                    {/* Author */}
                    <div itemProp="author" itemScope itemType="https://schema.org/Person" className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 border border-border">
                        <Image
                          src={item.logo}
                          alt={item.company}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span itemProp="name" className="text-sm font-semibold text-foreground">{item.author}</span>
                        <span className="text-xs text-muted-foreground">
                          <span itemProp="jobTitle">{item.role}</span>,{" "}
                          <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                            <span itemProp="name">{item.company}</span>
                          </span>
                        </span>
                      </div>
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.author} en LinkedIn`}
                        className="text-muted-foreground hover:text-[#0A66C2] transition-colors shrink-0"
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--magenta)]/50 transition-all z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--magenta)]/50 transition-all z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-8 bg-[var(--magenta)]"
                    : "w-2 bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-foreground">4.8/5</span>
            <span className="text-xs text-muted-foreground">{t("Nos recomiendan a otros", "They recommend us to others")}</span>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-foreground">100%</span>
            <span className="text-xs text-muted-foreground">{t("Entregado cuando lo prometimos", "Delivered when we promised")}</span>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-foreground">85%</span>
            <span className="text-xs text-muted-foreground">{t("Vuelven con un nuevo proyecto", "Return with a new project")}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
