"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Microscope, Brain, Code2, BarChart3, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Resumen compacto de servicios (UXFactory) para la home.
 * Reemplaza a la sección extensa: la home queda como índice y el detalle
 * profundo vive en las páginas internas /servicios/*. Conserva id="services"
 * y el encabezado para no romper anclas ni SEO.
 */
export function ServicesSummarySection() {
  const { t, localized } = useLanguage()

  const services = [
    {
      icon: Microscope,
      color: "var(--magenta)",
      titleEs: "Experiencias que tus usuarios recordarán",
      titleEn: "Experiences your users will remember",
      lineEs: "Diseño UX/UI con investigación real para que la gente entienda tu producto y vuelva.",
      lineEn: "UX/UI design with real research so people get your product and come back.",
      href: "/servicios/diseno-ux-ui",
    },
    {
      icon: Brain,
      color: "var(--cyan)",
      titleEs: "De idea vaga a producto claro en días",
      titleEn: "From vague idea to clear product in days",
      lineEs: "Discovery con IA: validamos tu idea con datos antes de que inviertas.",
      lineEn: "AI discovery: we validate your idea with data before you invest.",
      href: "/servicios/discovery-con-ia",
    },
    {
      icon: Code2,
      color: "var(--magenta)",
      titleEs: "Código que tus usuarios nunca notarán (y eso es bueno)",
      titleEn: "Code your users will never notice (and that's good)",
      lineEs: "Desarrollo a la medida, sólido y rápido, listo para crecer.",
      lineEn: "Custom development, solid and fast, ready to scale.",
      href: "/servicios/desarrollo-producto-digital",
    },
    {
      icon: BarChart3,
      color: "var(--cyan)",
      titleEs: "Más conversión sin gastar más en tráfico",
      titleEn: "More conversion without spending more on traffic",
      lineEs: "CRO: más resultados con los visitantes que ya tienes.",
      lineEn: "CRO: more results from the visitors you already have.",
      href: "/servicios/cro-saas",
    },
  ]

  return (
    <section id="services" className="py-24 px-6 bg-secondary/30" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Image
              src="/images/ecosistema/Factory.svg"
              alt="UXFactory"
              width={110}
              height={30}
              className="h-5 w-auto dark:brightness-0 dark:invert dark:opacity-60 opacity-70"
            />
            <span className="w-px h-5 bg-border" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
              {t("Cómo te ayudamos", "How we help you")}
            </span>
          </div>
          <h2
            id="services-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "Tu producto necesita más que código bonito. Necesita entender a las personas.",
              "Your product needs more than beautiful code. It needs to understand people.",
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Cuatro formas de ayudarte, según donde estés. Aquí el resumen — entra a cada una para el detalle.",
              "Four ways to help you, depending on where you are. Here's the summary — open each one for the detail.",
            )}
          </p>
        </div>

        {/* Compact service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.5 }}
              >
                <Link
                  href={localized(s.href)}
                  className="group flex flex-col h-full gap-3 p-6 rounded-2xl border border-border bg-card hover:-translate-y-1 transition-all duration-300"
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-display leading-snug">
                    {t(s.titleEs, s.titleEn)}
                  </h3>
                  <p className="text-sm text-foreground/60 dark:text-foreground/50 leading-relaxed flex-1">
                    {t(s.lineEs, s.lineEn)}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: s.color }}
                  >
                    {t("Conoce más", "Learn more")}
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Ver todos */}
        <div>
          <Link
            href={localized("/servicios")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shadow-lg hover:brightness-110 transition active:scale-[0.98]"
            style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}
          >
            {t("Ver todos los servicios", "See all services")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
