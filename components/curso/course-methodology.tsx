"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const stageStyles: Record<string, { border: string; bg: string; text: string }> = {
  cyan:    { border: "border-[var(--cyan)]/20", bg: "bg-[var(--cyan)]/[0.06]", text: "text-[var(--cyan)]" },
  magenta: { border: "border-[var(--magenta)]/20", bg: "bg-[var(--magenta)]/[0.06]", text: "text-[var(--magenta)]" },
  uxgreen: { border: "border-[var(--uxgreen)]/20", bg: "bg-[var(--uxgreen)]/[0.06]", text: "text-[var(--uxgreen)]" },
}

export function CourseMethodology() {
  const { t } = useLanguage()

  const stages = [
    { label: t("Diseño Funcional", "Functional Design"), desc: t("De la idea a una app funcional y sólida.", "From idea to a functional, solid app."), color: "cyan" },
    { label: t("Diseño para Masas", "Design for Masses"), desc: t("De funcional a que la gente lo adopte y use.", "From functional to adopted and used."), color: "magenta" },
    { label: t("Validación Humana", "Human Validation"), desc: t("Validas con personas reales y preparas para evolucionar.", "Validate with real people, ready to evolve."), color: "uxgreen" },
  ]

  return (
    <section id="metodologia" className="relative py-14 md:py-20 bg-background overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[var(--cyan)]/[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--magenta)]/[0.03] rounded-full blur-[180px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--cyan)' }}>
            {t("Una metodología, no un bootcamp", "A methodology, not a bootcamp")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t("De la confusión al producto real, ", "From confusion to a real product, ")}
            <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("en 3 bloques.", "in 3 blocks.")}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/50 mb-4">
            {t(
              "Un puente entre Diseño, Producto, Tecnología, Innovación, Desarrollo y Negocio. Cada bloque produce entregables que reducen retrabajo en equipos técnicos. El resultado: ",
              "A bridge between Design, Product, Technology, Innovation, Development, and Business. Each block produces deliverables that reduce rework for technical teams. The result: "
            )}
            <span className="font-bold text-foreground/70">{t("90% productividad. 10% esfuerzo.", "90% productivity. 10% effort.")}</span>
          </p>
          <div className="flex flex-nowrap justify-center gap-2 overflow-x-auto no-scrollbar px-2">
            {[
              t("UX/UI", "UX/UI"), t("Product Design", "Product Design"), t("AI-assisted Design", "AI-assisted Design"),
              t("Product Thinking", "Product Thinking"), t("Digital Architecture", "Digital Architecture"),
              t("UX Strategy", "UX Strategy"), t("Human-Centered AI", "Human-Centered AI"),
            ].map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium border curso-card text-foreground/50 dark:text-foreground/45 whitespace-nowrap shrink-0">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Workshop image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-48 md:h-72 lg:h-80 rounded-2xl overflow-hidden mb-10 border border-foreground/[0.1]"
        >
          <Image
            src="/images/curso/methodology-workshop.png"
            alt={t("Workshop de metodología IA en acción", "AI methodology workshop in action")}
            fill
            className="object-cover object-center opacity-90 brightness-110"
          />
        </motion.div>

        {/* 3 bloques — overview (el detalle de los 9 módulos vive en el Programa) */}
        <div className="grid gap-4 md:grid-cols-3">
          {stages.map((stage, i) => {
            const s = stageStyles[stage.color]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className={`p-6 rounded-2xl border ${s.border} ${s.bg}`}
              >
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${s.text} ${s.bg} ${s.border} border mb-3`}>
                  {t("Bloque", "Block")} {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`text-lg font-bold font-display mb-1 ${s.text}`}>{stage.label}</h3>
                <p className="text-sm text-foreground/55 leading-relaxed">{stage.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
