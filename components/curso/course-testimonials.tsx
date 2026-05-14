"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  { text: "Volví a sentirme relevante. Dejé de competir con la IA y empecé a usarla como mi copiloto. Mis clientes notan la diferencia.", name: "Camila Restrepo", role: "UX Designer · 6 años exp.", result: "3 clientes nuevos en 2 meses" },
  { text: "Pasé de copiar prompts a construir sistemas de diseño completos. La diferencia entre usar IA y pensar con IA es abismal.", name: "Andrés Mejía", role: "Product Designer · Startup", result: "MVP lanzado en 4 semanas" },
  { text: "La IA dejó de darme miedo. Ahora sé exactamente cuándo confiar en lo que genera y cuándo decidir yo. Eso vale oro.", name: "Laura Vásquez", role: "UI Designer · Freelancer", result: "Tiempo de entrega reducido 60%" },
  { text: "El framework 90-10 cambió mi proceso por completo. Antes saltaba entre herramientas sin dirección. Ahora tengo estructura y resultados.", name: "Diego Torres", role: "Developer · Frontend Lead", result: "Proceso de diseño 3x más rápido" },
  { text: "No aprendí a usar otra herramienta. Aprendí a hacer las preguntas correctas. Y eso cambió cómo trabajo, no solo cómo diseño.", name: "Valentina Ruiz", role: "Diseñadora de Producto · Agencia", result: "Ascendida a Lead Designer" },
  { text: "Entrego más rápido, pero con más profundidad. Dejé de competir por precio y empecé a competir por valor. Mis tarifas subieron 40%.", name: "Santiago López", role: "Freelancer UX/UI · B2B", result: "Tarifas +40% en 3 meses" },
]

export function CourseTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="testimonios" className="relative py-20 md:py-28 bg-[var(--surface-dark)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--magenta)]/[0.02] rounded-full blur-[200px]" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            Lo que dicen quienes ya lo vivieron
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug mb-5 font-display">
            No te lo contamos nosotros. Te lo cuentan ellos.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} className="group">
              <div className="relative p-6 md:p-8 rounded-2xl border border-foreground/[0.1] bg-foreground/[0.03] hover:border-[var(--magenta)]/[0.1] hover:bg-foreground/[0.03] transition-all duration-500 h-full flex flex-col">
                <Quote className="w-5 h-5 mb-4" style={{ color: 'var(--magenta)', opacity: 0.3 }} />
                <p className="text-base text-foreground/70 leading-relaxed mb-6 flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-4 border-t border-foreground/[0.1]">
                  <p className="text-sm font-medium text-[var(--surface-dark-fg)]">{t.name}</p>
                  <p className="text-xs text-foreground/40">{t.role}</p>
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.06]" style={{ color: 'var(--cyan)' }}>
                    {t.result}
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
