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
      titleEs: "Menos feature factory, más decisiones que mueven métricas",
      titleEn: "Less feature factory, more decisions that move metrics",
      lineEs: "CRO para SaaS: convertimos feedback disperso, requests y fricción en prioridades de activación, retención y conversión.",
      lineEn: "SaaS CRO: we turn scattered feedback, requests, and friction into activation, retention, and conversion priorities.",
      href: "/servicios/cro-saas",
    },
  ]

  return (
    <section id="services" className="py-12 md:py-24 px-6 bg-secondary/30" aria-labelledby="services-heading">
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

        {/* Compact service cards — carousel on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 md:gap-5 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.5 }}
                className="min-w-[80%] snap-start sm:min-w-0"
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

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shadow-lg hover:brightness-110 transition active:scale-[0.98]"
            style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}
          >
            {t("Contáctanos", "Contact us")}
            <ArrowRight size={16} />
          </Link>
          <a
            href="#uxbox"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border dark:border-white/15 border-foreground/15 dark:text-white/75 text-foreground/75 dark:hover:text-white hover:text-foreground dark:hover:border-white/30 hover:border-foreground/30 dark:hover:bg-white/5 hover:bg-foreground/5 transition-all active:scale-[0.98]"
          >
            {t("Probar UXBox gratis", "Try UXBox free")}
          </a>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center rounded-2xl border border-[var(--cyan)]/25 bg-card p-6 md:p-7">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--cyan)]">
              {t("Prueba de escala", "Proof of scale")}
            </span>
            <h3 className="font-display font-bold text-xl text-foreground">
              {t("Productos que muchas personas pueden usar sin perder claridad.", "Products many people can use without losing clarity.")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "Pepsico es una muestra de lo que hacemos cuando un producto debe funcionar para muchos usuarios, roles y contextos al mismo tiempo.",
                "Pepsico is a sample of what we do when a product needs to work for many users, roles, and contexts at the same time."
              )}
            </p>
          </div>
          <Link
            href={localized("/portafolio") + "#pepsico"}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm border border-[var(--cyan)]/30 text-[var(--cyan)] hover:bg-[var(--cyan)]/10 transition-all"
          >
            {t("Ver caso Pepsico", "See Pepsico case")}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
