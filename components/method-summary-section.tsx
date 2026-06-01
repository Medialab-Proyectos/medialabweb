"use client"

import { motion } from "framer-motion"
import { Search, Compass, PenTool, Terminal, BarChart3 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * "Cómo trabajamos" — versión compacta de 5 pasos para la home.
 * Reemplaza a la sección interactiva extensa; conserva id="method" y el
 * encabezado para no romper anclas ni SEO.
 */
export function MethodSummarySection() {
  const { t } = useLanguage()

  const steps = [
    {
      number: "01",
      icon: Search,
      labelEs: "Discovery",
      labelEn: "Discovery",
      lineEs: "Claridad de tu producto en menos de 48h, sin adivinar.",
      lineEn: "Clarity on your product in under 48h, no guesswork.",
    },
    {
      number: "02",
      icon: Compass,
      labelEs: "Estrategia UX",
      labelEn: "UX Strategy",
      lineEs: "Entendemos los miedos y motivaciones reales de tu usuario.",
      lineEn: "We understand your user's real fears and motivations.",
    },
    {
      number: "03",
      icon: PenTool,
      labelEs: "Diseño",
      labelEn: "Design",
      lineEs: "Experiencias claras y fáciles que la gente quiere usar.",
      lineEn: "Clear, easy experiences people want to use.",
    },
    {
      number: "04",
      icon: Terminal,
      labelEs: "Desarrollo",
      labelEn: "Development",
      lineEs: "Construimos un producto sólido que simplemente funciona.",
      lineEn: "We build a solid product that just works.",
    },
    {
      number: "05",
      icon: BarChart3,
      labelEs: "Optimización",
      labelEn: "Optimization",
      lineEs: "Medimos y mejoramos para que convierta más.",
      lineEn: "We measure and improve so it converts more.",
    },
  ]

  return (
    <section id="method" className="py-12 md:py-24 px-6 bg-secondary/30" aria-labelledby="method-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            {t("Así funciona", "How it works")}
          </span>
          <h2
            id="method-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance"
          >
            {t(
              "5 pasos para pasar de “tengo una idea” a “mis usuarios lo aman”",
              "5 steps to go from “I have an idea” to “my users love it”",
            )}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Un proceso probado que elimina las suposiciones. Así lo hacemos, paso a paso:",
              "A proven process that removes the guesswork. Here's how we do it, step by step:",
            )}
          </p>
        </div>

        {/* Compact 5-step grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.45 }}
                className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card h-full"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-3xl font-bold font-display leading-none bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #E8772E 0%, #1A8A9E 100%)" }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <Icon className="w-5 h-5 text-foreground/40" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-foreground font-display">
                  {t(step.labelEs, step.labelEn)}
                </h3>
                <p className="text-sm text-foreground/60 dark:text-foreground/50 leading-relaxed">
                  {t(step.lineEs, step.lineEn)}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
