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
      image: "/images/door-uxfactory.png",
      imageAltEs: "Equipo colaborando en desarrollo de producto digital",
      imageAltEn: "Team collaborating on digital product development",
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
      image: "/images/door-uxschool.png",
      imageAltEs: "Profesionales aprendiendo en un espacio moderno",
      imageAltEn: "Professionals learning in a modern space",
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
      image: "/images/door-uxlab.png",
      imageAltEs: "Personas probando apps en un laboratorio creativo",
      imageAltEn: "People testing apps in a creative lab",
      audienceEs: "Nuestros productos",
      audienceEn: "Our products",
      title: "UXLab",
      color: "#00BFA6",
      descEs: "Apps nuestras como SinDeudas y Cumbreva: probamos lo que hacemos usándolo nosotros primero.",
      descEn: "Our own apps like SinDeudas and Cumbreva: we prove what we do by using it ourselves first.",
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
          <p className="mt-5 max-w-3xl mx-auto text-base md:text-lg text-foreground/70 dark:text-foreground/60 leading-relaxed">
            <strong className="text-foreground font-semibold">
              {t("El diseño de experiencia (UX)", "Experience design (UX)")}
            </strong>
            {t(
              " es lograr que tu producto sea claro, fácil y que la gente quiera usarlo. Es la diferencia entre un producto que vende y uno que fracasa.",
              " is making your product clear, easy, and something people actually want to use. It's the difference between a product that sells and one that fails.",
            )}
          </p>
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
                  {/* Imagen de personas por tarjeta */}
                  <div className="relative w-full h-[120px] md:h-[110px] -mx-6 md:-mx-7 -mt-6 md:-mt-7 mb-5 overflow-hidden rounded-t-2xl" style={{ width: "calc(100% + 48px)", maxWidth: "calc(100% + 48px)" }}>
                    <Image
                      src={door.image}
                      alt={t(door.imageAltEs, door.imageAltEn)}
                      width={400}
                      height={180}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient fade inferior */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to bottom, transparent 40%, var(--card) 100%)`,
                      }}
                    />
                  </div>

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
