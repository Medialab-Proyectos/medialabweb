"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Linkedin, ExternalLink, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

export function CourseTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  const projects = [
    {
      name: "Sebastián Vargas",
      role: t("Desarrollador", "Developer"),
      project: t("App de Derechos Ciudadanos", "Civic Rights App"),
      quote: t(
        "Me ayudó a ver cosas que francamente no hubiera podido ver solo. Las bases teóricas y las leyes de UX hacen toda la diferencia.",
        "It helped me see things I frankly couldn't have seen on my own. The theoretical foundations and UX laws make all the difference."
      ),
      result: t("MVP validado con 8 mejoras clave", "MVP validated with 8 key improvements"),
      image: "/images/case-saas.png",
      linkedin: "",
      productUrl: "",
    },
    {
      name: "Mariana Castro",
      role: t("Diseñadora", "Designer"),
      project: t("App de Bienestar Mental", "Mental Wellness App"),
      quote: t(
        "Ha cambiado mucho el flujo de mi app. Uno se da cuenta de lo importante que es que todo esté en su sitio para que funcione.",
        "It completely changed my app's flow. You realize how important it is for everything to be where it belongs."
      ),
      result: t("Flujo reestructurado completo", "Fully restructured user flow"),
      image: "/images/case-mobility.png",
      linkedin: "",
      productUrl: "",
    },
    {
      name: "Nicolás Herrera",
      role: t("Estudiante", "Student"),
      project: t("App Social de Eventos", "Social Events App"),
      quote: t(
        "La IA te puede recomendar, pero tú eres el que tiene que tener el conocimiento para guiarla. Mi app está sólida en flujo, estructura y usabilidad.",
        "AI can give you recommendations, but you need the knowledge to guide it. My app is now solid in flow, structure, and usability."
      ),
      result: t("Auditoría + rediseño en 2 semanas", "Audit + redesign in 2 weeks"),
      image: "/images/case-fintech.png",
      linkedin: "",
      productUrl: "",
    },
    {
      name: "Tomás Aguirre",
      role: "Maker",
      project: "Help3D",
      quote: t(
        "Me hizo replantear todo el onboarding. Ahora mi app es una herramienta de apoyo real, no solo un sistema técnico.",
        "It made me rethink the entire onboarding. Now my app is a real support tool, not just a technical system."
      ),
      result: t("Onboarding humanizado completo", "Fully humanized onboarding"),
      image: "/images/case-ecommerce.png",
      linkedin: "",
      productUrl: "",
    },
    {
      name: "Daniel Mora",
      role: t("Desarrollador", "Developer"),
      project: t("Plataforma Legal", "Legal Platform"),
      quote: t(
        "Aprendí a cruzar los gaps cognitivos con los nudges para encontrar mejoras reales. Son cambios pequeños que transforman la experiencia.",
        "I learned to cross cognitive gaps with nudges to find real improvements. Small changes that transform the experience."
      ),
      result: t("6 nudges implementados en MVP", "6 nudges implemented in MVP"),
      image: "/images/case-saas.png",
      linkedin: "",
      productUrl: "",
    },
  ]

  return (
    <section id="testimonios" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--magenta)]/[0.02] rounded-full blur-[200px]" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: "var(--magenta)" }}>
            {t("Lo que dicen quienes ya lo vivieron", "What those who lived it say")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t(
              "No te lo contamos nosotros. Te lo cuentan ellos.",
              "We don't tell you. They tell you."
            )}
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {projects.map((item, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="relative h-full rounded-2xl border curso-card overflow-hidden group">
                    {/* Product image as background */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.project}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

                      {/* Project name overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--magenta)" }}>
                          {item.project}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start gap-2">
                        <Quote className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--magenta)", opacity: 0.4 }} />
                        <p className="text-sm text-foreground/70 leading-relaxed">{item.quote}</p>
                      </div>

                      {/* Result badge */}
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.06] w-fit" style={{ color: "var(--cyan)" }}>
                        {item.result}
                      </span>

                      {/* Author + links */}
                      <div className="flex items-center gap-3 pt-3 border-t border-foreground/[0.08]">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
                        >
                          {item.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-foreground/40">{item.role}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.linkedin && (
                            <a
                              href={item.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${item.name} en LinkedIn`}
                              className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
                          {item.productUrl && (
                            <a
                              href={item.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Ver ${item.project}`}
                              className="text-muted-foreground hover:text-[var(--cyan)] transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
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
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--magenta)]/50 transition-all z-10"
            aria-label="Next project"
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
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
