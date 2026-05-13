"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  { q: "¿Necesito saber programar para tomar este curso?", a: "No. La metodología está diseñada para diseñadores, UX/UI y creativos. Usarás herramientas de IA que no requieren código. Si eres developer, tendrás módulos específicos para aprovechar tu background técnico." },
  { q: "¿Qué diferencia esto de un curso de ChatGPT o prompts?", a: "Los cursos de prompts te enseñan a escribir instrucciones. Nosotros te enseñamos a pensar estratégicamente: cuándo usar IA, cuándo no, cómo evaluar lo que genera y cómo construir productos reales. Es la diferencia entre usar una herramienta y tener un sistema." },
  { q: "¿Cómo funciona la metodología 90-10?", a: "90% pensamiento humano estratégico (criterio, evaluación, decisión, experiencia) y 10% ejecución con IA (generación, prototipado, iteración). La IA amplifica tu criterio — no lo reemplaza." },
  { q: "¿Cuánto dura el curso y qué formato tiene?", a: "El curso se desarrolla en cohortes de 8 semanas con sesiones en vivo, workshops prácticos, mentoría grupal y acceso a la comunidad privada. Cada semana combina teoría, práctica y aplicación a proyectos reales." },
  { q: "¿Qué incluye exactamente mi acceso?", a: "Acceso completo a las 12 fases de la metodología, workshops en vivo, mentoría, comunidad privada, acceso guiado a herramientas premium (ChatGPT Plus, Claude, Figma AI, Cursor, etc.), plantillas, frameworks y tu certificación al completar." },
  { q: "¿Hay comunidad o soporte después del curso?", a: "Sí. Acceso de por vida a la comunidad privada de alumni, actualizaciones de la metodología, recursos nuevos y networking con profesionales que comparten tu visión del diseño con IA." },
  { q: "¿Los cupos son realmente limitados?", a: "Sí. Cada cohorte tiene un máximo de 30 personas para garantizar atención personalizada, feedback de calidad y una experiencia de aprendizaje genuinamente transformadora." },
  { q: "¿Cuándo empieza la próxima cohorte?", a: "Las fechas de la Cohorte 01 se anunciarán próximamente. Puedes unirte a la waitlist ahora para asegurar acceso anticipado y precio preferencial de fundadores." },
  { q: "¿Habrá validación universitaria?", a: "Estamos en proceso activo de validación con instituciones educativas. Los participantes de las primeras cohortes recibirán la certificación actualizada cuando se complete este proceso." },
  { q: "¿Esto funciona para freelancers o solo para equipos?", a: "Para ambos. Freelancers aprenderán a diferenciarse y cobrar más por servicios con criterio IA. Equipos obtendrán una metodología compartida para integrar IA de forma coherente en sus procesos." },
]

export function CourseFaq() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-white/40 mb-4 font-display">Preguntas frecuentes</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display">
            Todo lo que necesitas saber.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full text-left p-5 md:p-6 rounded-xl border transition-all duration-300 ${
                    isOpen ? 'border-[var(--magenta)]/[0.15] bg-[var(--magenta)]/[0.03]' : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-base font-medium transition-colors duration-300 ${isOpen ? 'text-[var(--surface-dark-fg)]' : 'text-white/70'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ color: isOpen ? 'var(--magenta)' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="mt-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
