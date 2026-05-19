"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  const testimonials = [
    {
      text: t(
        "Volví a sentirme relevante. Dejé de competir con la IA y empecé a usarla como mi copiloto. Mis clientes notan la diferencia.",
        "I feel relevant again. I stopped competing with AI and started using it as my copilot. My clients notice the difference."
      ),
      name: "Camila Restrepo",
      role: t("UX Designer · 6 años exp.", "UX Designer · 6 yrs exp."),
      result: t("3 clientes nuevos en 2 meses", "3 new clients in 2 months"),
    },
    {
      text: t(
        "Pasé de copiar prompts a construir sistemas de diseño completos. La diferencia entre usar IA y pensar con IA es abismal.",
        "I went from copying prompts to building complete design systems. The gap between using AI and thinking with AI is huge."
      ),
      name: "Andrés Mejía",
      role: t("Product Designer · Startup", "Product Designer · Startup"),
      result: t("MVP lanzado en 4 semanas", "MVP launched in 4 weeks"),
    },
    {
      text: t(
        "La IA dejó de darme miedo. Ahora sé exactamente cuándo confiar en lo que genera y cuándo decidir yo. Eso vale oro.",
        "AI stopped scaring me. Now I know exactly when to trust what it generates and when to decide myself. That's gold."
      ),
      name: "Laura Vásquez",
      role: t("UI Designer · Freelancer", "UI Designer · Freelancer"),
      result: t("Tiempo de entrega reducido 60%", "Delivery time cut by 60%"),
    },
    {
      text: t(
        "El framework 90-10 cambió mi proceso por completo. Antes saltaba entre herramientas sin dirección. Ahora tengo estructura y resultados.",
        "The 90-10 framework completely changed my process. I used to jump between tools without direction. Now I have structure and results."
      ),
      name: "Diego Torres",
      role: t("Developer · Frontend Lead", "Developer · Frontend Lead"),
      result: t("Proceso de diseño 3x más rápido", "Design process 3x faster"),
    },
    {
      text: t(
        "No aprendí a usar otra herramienta. Aprendí a hacer las preguntas correctas. Y eso cambió cómo trabajo, no solo cómo diseño.",
        "I didn't learn another tool. I learned to ask the right questions. And that changed how I work, not just how I design."
      ),
      name: "Valentina Ruiz",
      role: t("Diseñadora de Producto · Agencia", "Product Designer · Agency"),
      result: t("Ascendida a Lead Designer", "Promoted to Lead Designer"),
    },
    {
      text: t(
        "Entrego más rápido, pero con más profundidad. Dejé de competir por precio y empecé a competir por valor. Mis tarifas subieron 40%.",
        "I deliver faster but with more depth. I stopped competing on price and started competing on value. My rates went up 40%."
      ),
      name: "Santiago López",
      role: t("Freelancer UX/UI · B2B", "Freelance UX/UI · B2B"),
      result: t("Tarifas +40% en 3 meses", "Rates +40% in 3 months"),
    },
  ]

  return (
    <section id="testimonios" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--magenta)]/[0.02] rounded-full blur-[200px]" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            {t("Lo que dicen quienes ya lo vivieron", "What those who lived it say")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5 font-display">
            {t(
              "No te lo contamos nosotros. Te lo cuentan ellos.",
              "We don't tell you. They tell you."
            )}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
              <div className="relative p-6 md:p-8 rounded-2xl border curso-card hover:border-[var(--magenta)]/[0.1] transition-all duration-500 h-full flex flex-col">
                <Quote className="w-5 h-5 mb-4" style={{ color: 'var(--magenta)', opacity: 0.3 }} />
                <p className="text-base text-foreground/70 leading-relaxed mb-6 flex-1">&ldquo;{item.text}&rdquo;</p>
                <div className="pt-4 border-t border-foreground/[0.1]">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-foreground/40">{item.role}</p>
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.06]" style={{ color: 'var(--cyan)' }}>
                    {item.result}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
