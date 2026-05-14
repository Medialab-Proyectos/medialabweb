"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  { q: "¿Necesito saber programar?", a: "No. La metodología funciona para diseñadores y creativos que nunca han tocado código. Si eres developer, aún mejor — hay módulos que conectan tu background técnico con pensamiento de producto." },
  { q: "¿En qué se diferencia esto de un curso de prompts de YouTube?", a: "Un curso de prompts te enseña a escribir instrucciones. Aquí aprendes a pensar: cuándo usar IA, cuándo no, cómo evaluar lo que genera y cómo construir un producto real con ello. Es la diferencia entre tener una herramienta y tener un sistema." },
  { q: "¿Qué es la metodología 90-10 exactamente?", a: "Lograr el 90% de productividad con apenas el 10% de esfuerzo. Usando IA como copiloto estratégico, aprendes a automatizar lo repetitivo y enfocarte en lo que realmente importa: criterio, evaluación y decisión. Tú piensas, la IA ejecuta." },
  { q: "¿Cuánto tiempo tengo que dedicarle por semana?", a: "8 semanas. Cada semana combina una sesión en vivo, workshop práctico y aplicación a tu proyecto real. Calcula unas 6-8 horas semanales entre sesiones y práctica." },
  { q: "¿Qué incluye exactamente mi acceso?", a: "Las 12 fases de la metodología, workshops en vivo, mentoría grupal, comunidad privada de por vida, acceso a herramientas premium (ChatGPT Plus, Claude, Figma AI, Cursor), plantillas, frameworks y certificación al completar." },
  { q: "¿Y si no me gusta o no es lo que esperaba?", a: "Si después de la primera semana sientes que no es para ti, te devolvemos el dinero. Sin preguntas. Creemos tanto en esto que preferimos que pruebes sin riesgo." },
  { q: "¿Los 30 cupos son realmente limitados?", a: "Sí. Mantenemos grupos pequeños para dar feedback personalizado y crear una experiencia de aprendizaje real — no un webinar de 500 personas donde nadie te conoce." },
  { q: "¿Cuándo empieza la próxima cohorte?", a: "Las fechas de la Cohorte 01 se anuncian pronto. Únete a la waitlist para acceso anticipado y precio de fundadores. Los primeros 30 tienen descuento." },
  { q: "¿Va a tener validación universitaria?", a: "Estamos en proceso activo con instituciones educativas. Los participantes de las primeras cohortes recibirán la certificación actualizada cuando se complete." },
  { q: "¿Funciona para freelancers o solo para equipos?", a: "Para ambos. Freelancers aprenden a diferenciarse y cobrar más por servicios con criterio IA. Equipos obtienen un lenguaje común para integrar IA de forma coherente." },
]

export function CourseFaq() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-20 md:py-28 bg-[var(--surface-mid)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4 font-display">Preguntas frecuentes</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-snug font-display">
            Esto es lo que preguntan los profesionales que terminan inscribiéndose.
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
                    isOpen ? 'border-[var(--magenta)]/[0.15] bg-[var(--magenta)]/[0.03]' : 'border-foreground/[0.1] bg-foreground/[0.03] hover:border-foreground/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-base font-medium transition-colors duration-300 ${isOpen ? 'text-[var(--surface-dark-fg)]' : 'text-foreground/70'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ color: isOpen ? 'var(--magenta)' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="mt-4 text-sm text-foreground/50 leading-relaxed">{faq.a}</p>
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
