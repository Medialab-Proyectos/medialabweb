"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Tres puertas de entrada — bajo el hero.
 * Convierte las tres unidades de negocio (UXFactory / UXSchool / UXLab)
 * en tarjetas clicables y autoexplicativas, para que el visitante encuentre
 * SU camino sobre el pliegue sin scroll infinito.
 */
export function EntryDoorsSection() {
  const { t } = useLanguage()

  const doors = [
    {
      logo: "/images/ecosistema/Factory.svg",
      audienceEs: "Para empresas",
      audienceEn: "For companies",
      title: "UXFactory",
      color: "var(--magenta)",
      descEs: "Convertimos tu idea en una web o app a la medida, fácil de usar y lista para vender. A esto le llamamos UXFactory.",
      descEn: "We turn your idea into a custom web or app that's easy to use and ready to sell. We call this UXFactory.",
      ctaEs: "Ver cómo trabajamos",
      ctaEn: "See how we work",
      href: "/#method",
    },
    {
      logo: "/images/ecosistema/school.svg",
      audienceEs: "Para profesionales",
      audienceEn: "For professionals",
      title: "UXSchool",
      color: "var(--cyan)",
      descEs: "Aprende a crear productos digitales que la gente ama, con IA y criterio humano. 9 módulos. Cohorte 02 abierta.",
      descEn: "Learn to create digital products people love, with AI and human judgment. 9 modules. Cohort 02 open.",
      ctaEs: "Explorar el curso",
      ctaEn: "Explore the course",
      href: "/curso",
    },
    {
      logo: "/images/ecosistema/lab.svg",
      audienceEs: "Nuestros productos",
      audienceEn: "Our products",
      title: "UXLab",
      color: "#00BFA6",
      descEs: "Apps nuestras como SinDeudas y Electrolineras: probamos lo que hacemos usándolo nosotros primero.",
      descEn: "Our own apps like SinDeudas and Electrolineras: we prove what we do by using it ourselves first.",
      ctaEs: "Conocer los productos",
      ctaEn: "Discover the products",
      href: "/#products",
    },
  ]

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-3 font-display font-medium" style={{ color: "var(--magenta)" }}>
            {t("Nuestro ecosistema", "Our ecosystem")}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            {t("Encuentra tu camino", "Find your path")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {doors.map((door, i) => {
            return (
              <motion.div
                key={door.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={door.href}
                  className="group flex flex-col h-full p-6 md:p-7 rounded-2xl border border-border bg-card hover:-translate-y-1 transition-all duration-300"
                  style={{ ["--door-color" as string]: door.color }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = door.color }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "" }}
                >
                  <Image
                    src={door.logo}
                    alt={door.title}
                    width={140}
                    height={36}
                    className="h-7 w-auto mb-5 dark:brightness-0 dark:invert dark:opacity-70 opacity-80"
                  />

                  <span className="text-[11px] tracking-[0.12em] uppercase font-semibold mb-2" style={{ color: door.color }}>
                    {t(door.audienceEs, door.audienceEn)}
                  </span>
                  <h3 className="sr-only">{door.title}</h3>
                  <p className="text-sm text-foreground/60 dark:text-foreground/50 leading-relaxed flex-1">
                    {t(door.descEs, door.descEn)}
                  </p>

                  <span
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: door.color }}
                  >
                    {t(door.ctaEs, door.ctaEn)}
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
