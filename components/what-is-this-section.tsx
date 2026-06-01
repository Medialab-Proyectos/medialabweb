"use client"

import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * "¿Qué es esto y cómo te ayuda?" — bloque educativo para el usuario NO técnico.
 * Va alto en la home (después del hero / las 3 puertas) y ANTES de pedir cualquier
 * acción importante. Traduce el oficio (UX) a beneficios en lenguaje humano.
 *
 * Regla de lenguaje: primero el beneficio, el término técnico al final como el "cómo".
 */
export function WhatIsThisSection() {
  const { t } = useLanguage()

  // Degradado de marca naranja → teal para los números.
  const numberGradient = "linear-gradient(135deg, #E8772E 0%, #1A8A9E 100%)"

  const steps = [
    {
      titleEs: "Entendemos tu idea",
      titleEn: "We understand your idea",
      descEs: "Averiguamos qué quieres lograr y quién es tu cliente real.",
      descEn: "We figure out what you want to achieve and who your real customer is.",
    },
    {
      titleEs: "La validamos",
      titleEn: "We validate it",
      descEs: "Con IA y datos confirmamos si la gente la usaría, antes de que inviertas.",
      descEn: "With AI and data we confirm whether people would use it, before you invest.",
    },
    {
      titleEs: "La construimos bien",
      titleEn: "We build it right",
      descEs: "Diseñamos un producto fácil de usar que la gente quiera volver a abrir.",
      descEn: "We design an easy-to-use product that people want to open again.",
    },
  ]

  return (
    <section
      className="relative py-16 md:py-24 bg-background overflow-hidden"
      aria-labelledby="what-is-this-heading"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-14"
        >
          <h2
            id="what-is-this-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "¿Tienes una idea pero no sabes por dónde arrancar? Para eso existimos.",
              "Have an idea but don't know where to start? That's exactly why we exist.",
            )}
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/60 dark:text-foreground/55 leading-relaxed text-pretty">
            {t(
              "No necesitas saber de tecnología ni de diseño. Tú pones la idea; nosotros nos encargamos de que funcione de verdad. Esto es lo que hacemos, en simple:",
              "You don't need to know about technology or design. You bring the idea; we make sure it actually works. Here's what we do, in plain words:",
            )}
          </p>
        </motion.div>

        {/* Tres pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.titleEs}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              className="flex flex-col h-full p-6 md:p-7 rounded-2xl border border-border bg-card"
            >
              <span
                className="text-4xl md:text-5xl font-bold font-display leading-none mb-4 bg-clip-text text-transparent"
                style={{ backgroundImage: numberGradient }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="text-lg font-bold text-foreground mb-2 font-display">
                {t(step.titleEs, step.titleEn)}
              </h3>
              <p className="text-sm text-foreground/60 dark:text-foreground/50 leading-relaxed">
                {t(step.descEs, step.descEn)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cierre destacado — qué es UX, en lenguaje humano */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 md:mt-8 flex items-start gap-4 p-6 md:p-7 rounded-2xl border-l-4 border border-[#E8772E]/30 border-l-[#E8772E] bg-[#E8772E]/[0.06]"
        >
          <span
            className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center"
            style={{ background: "color-mix(in srgb, #E8772E 14%, transparent)" }}
            aria-hidden="true"
          >
            <Lightbulb className="w-5 h-5" style={{ color: "#E8772E" }} />
          </span>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed text-pretty">
            {t("A eso se le llama ", "This is what's called ")}
            <strong className="text-foreground font-semibold">
              {t("diseño de experiencia (UX)", "experience design (UX)")}
            </strong>
            {t(
              ": lograr que tu producto sea claro, fácil y que la gente quiera usarlo. Es la diferencia entre un producto que vende y uno que fracasa.",
              ": making your product clear, easy, and something people actually want to use. It's the difference between a product that sells and one that fails.",
            )}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
