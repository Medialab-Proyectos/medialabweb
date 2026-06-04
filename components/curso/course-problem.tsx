"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function CourseProblem() {
  const { t } = useLanguage()

  const quotes = [
    {
      text: t("Aprendí 15 herramientas y sigo sin construir un producto.", "Learned 15 tools, still can't build a product."),
      context: t("Freelancer UX/UI", "Freelance UX/UI"),
    },
    {
      text: t("Hice wireframes bonitos pero desarrollo no los pudo usar.", "Made nice wireframes but dev couldn't use them."),
      context: t("Diseñador UI · 3 años", "UI Designer · 3 yrs"),
    },
    {
      text: t("Diseño interfaces pero nunca aprendí a estructurar un producto.", "I design interfaces but never learned to structure a product."),
      context: t("Product Designer", "Product Designer"),
    },
    {
      text: t("No sé conectar lo que diseño con lo que frontend necesita.", "Can't connect what I design with what frontend needs."),
      context: t("UX Designer", "UX Designer"),
    },
    {
      text: t("Genero más rápido con IA, pero sigo generando retrabajo.", "I generate faster with AI, but I still create rework."),
      context: t("Developer frontend", "Frontend developer"),
    },
    {
      text: t("Tengo la idea pero no sé validar sin invertir en desarrollo.", "Got the idea but can't validate without investing in dev."),
      context: t("CEO · Startup", "CEO · Startup"),
    },
    {
      text: t("Tengo la visión de producto pero no el framework para ejecutarla.", "I have the product vision but not the framework to execute it."),
      context: t("Product Lead · 6 años", "Product Lead · 6 yrs"),
    },
    {
      text: t("Mi equipo iría 3× más rápido si conectáramos diseño con desarrollo.", "My team would go 3× faster if we connected design with dev."),
      context: t("CTO · Startup", "CTO · Startup"),
    },
  ]

  return (
    <section id="problema" className="relative py-16 md:py-20 bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/[0.04] dark:bg-red-900/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-red-500 dark:text-red-400/70 mb-3 font-display font-medium">
            {t("El mercado cambió. La formación no.", "The market changed. Training didn't.")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight font-display mb-3">
            {t("No enseñan herramientas.", "They don't teach tools.")}
            <span className="text-red-500 dark:text-red-400/80">{t(" No enseñan productos.", " They don't teach products.")}</span>
          </h2>
          <p className="text-sm text-foreground/60 dark:text-foreground/40 max-w-lg mx-auto">
            {t(
              "No conectan UX con desarrollo. No reducen retrabajo. No preparan entregables para frontend.",
              "They don't connect UX with dev. They don't reduce rework. They don't prepare deliverables for frontend."
            )}
          </p>
        </motion.div>

        {/* Mobile: carousel / Desktop: grid */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="group flex-shrink-0 w-[75%] sm:w-auto snap-center"
            >
              <div className="curso-card-danger p-4 rounded-xl border h-full flex flex-col transition-all duration-300 hover:shadow-md dark:hover:shadow-none">
                <span className="text-lg text-red-500/50 dark:text-red-400/35 font-serif leading-none mb-1">&ldquo;</span>
                <p className="text-sm text-foreground/85 dark:text-foreground/80 leading-relaxed flex-1 group-hover:text-foreground transition-colors duration-300">
                  {quote.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
