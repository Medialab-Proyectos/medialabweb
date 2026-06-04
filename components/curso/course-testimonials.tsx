"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
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
      name: "Juan Pablo Morán",
      role: "UX/UI Designer",
      project: "Help3D",
      description: t(
        "Copiloto técnico para impresión 3D FDM: configura, diagnostica y optimiza tus impresiones de forma visual e inteligente.",
        "Technical copilot for FDM 3D printing: configure, diagnose, and optimize your prints visually and intelligently."
      ),
      quote: t(
        "Me hizo replantear todo el onboarding. Ahora mi app es una herramienta de apoyo real, no solo un sistema técnico.",
        "It made me rethink the entire onboarding. Now my app is a real support tool, not just a technical system."
      ),
      result: t("Onboarding humanizado completo", "Fully humanized onboarding"),
      image: "/images/help3d-showcase.png",
      linkedin: "https://www.linkedin.com/in/jpmorán-uxui-designer",
      productUrl: "https://help3d-xi.vercel.app/",
    },
    {
      name: "Jorge Pineda",
      role: "UX/UI Designer",
      project: "FocusFlow",
      description: t(
        "App inteligente para optimizar rutinas de trabajo y descanso: bloques de concentración profunda, hidratación y bienestar cognitivo.",
        "Smart app to optimize work and rest routines: deep focus blocks, hydration tracking, and cognitive wellness."
      ),
      quote: t(
        "Ha cambiado mucho el flujo de mi app. Uno se da cuenta de lo importante que es que todo esté en su sitio para que funcione.",
        "It completely changed my app's flow. You realize how important it is for everything to be where it belongs."
      ),
      result: t("Flujo reestructurado completo", "Fully restructured user flow"),
      image: "/images/focusflow-showcase.png",
      linkedin: "",
      behance: "https://www.behance.net/pineda1995",
      productUrl: "https://focus-flow-eex9.vercel.app/",
    },
    {
      name: "Jonnathan Joseph Real Vaca",
      role: t("Publicista Gráfico", "Graphic Advertiser"),
      project: "MedCheckin",
      description: t(
        "App que elimina las filas en centros médicos: detecta la llegada del paciente, confirma su identidad y lo registra automáticamente antes de entrar al edificio.",
        "App that eliminates queues at medical centers: detects patient arrival, confirms identity, and auto-registers them before entering the building."
      ),
      quote: t(
        "El curso me enseñó a pensar en el usuario real, no solo en la funcionalidad. Gracias a eso, MedCheckin resuelve un problema que todos sufrimos pero nadie había atacado bien.",
        "The course taught me to think about the real user, not just functionality. Thanks to that, MedCheckin solves a problem we all suffer but nobody had tackled well."
      ),
      result: t("App funcional con check-in automático", "Functional app with auto check-in"),
      image: "/images/medcheckin-showcase.png",
      linkedin: "https://www.linkedin.com/in/jonnathanreal-publicistagrafico/",
      productUrl: "https://medcheckin.vercel.app/",
    },
    {
      name: "Mauricio Rojas",
      role: "UX/UI Designer",
      project: "Happy Food",
      description: t(
        "App móvil para gestionar el mercado del hogar: organiza productos, controla vencimientos, genera listas de compra y sugiere recetas para reducir desperdicios.",
        "Mobile app for smart grocery management: organize products, track expirations, generate shopping lists, and suggest recipes to reduce waste."
      ),
      quote: t(
        "Antes diseñaba pantallas bonitas, pero sin estrategia. Ahora entiendo cómo cada decisión de diseño impacta la adopción. Happy Food existe gracias a esa mentalidad.",
        "Before I designed pretty screens but without strategy. Now I understand how every design decision impacts adoption. Happy Food exists thanks to that mindset."
      ),
      result: t("App completa con IA integrada", "Full app with integrated AI"),
      image: "/images/happyfood-showcase.png",
      linkedin: "https://www.linkedin.com/in/mauricio-rojas-webmaster/",
      productUrl: "https://happy-food-za48.vercel.app/",
    },
  ]

  return (
    <section id="testimonios" className="relative py-14 md:py-20 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--magenta)]/[0.02] rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                  <div itemScope itemType="https://schema.org/Review" className="relative h-full rounded-2xl border curso-card overflow-hidden group">
                    {/* Semantic Metadata for bots */}
                    <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Course">
                      <meta itemProp="name" content="AI User Experience Architect" />
                    </div>
                    <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                      <meta itemProp="ratingValue" content="5" />
                      <meta itemProp="bestRating" content="5" />
                    </div>

                    {/* Product image as background */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.project}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                      {/* Project name overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--magenta)" }}>
                          {item.project}
                        </span>
                        {item.description && (
                          <p className="text-[11px] text-foreground/50 leading-snug mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start gap-2">
                        <Quote className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--magenta)", opacity: 0.4 }} />
                        <p itemProp="reviewBody" className="text-sm text-foreground/70 leading-relaxed">{item.quote}</p>
                      </div>

                      {/* Result badge */}
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.06] w-fit" style={{ color: "var(--cyan)" }}>
                        {item.result}
                      </span>

                      {/* Author + links */}
                      <div itemProp="author" itemScope itemType="https://schema.org/Person" className="flex items-center gap-3 pt-3 border-t border-foreground/[0.08]">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}
                        >
                          {item.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p itemProp="name" className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p itemProp="jobTitle" className="text-xs text-foreground/40">{item.role}</p>
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
                          {(item as any).behance && (
                            <a
                              href={(item as any).behance}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${item.name} en Behance`}
                              className="text-muted-foreground hover:text-[#1769FF] transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                              </svg>
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
