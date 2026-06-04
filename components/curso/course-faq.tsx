"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t } = useLanguage()

  const faqs = [
    { q: t("¿Reemplaza al desarrollo de software?", "Does it replace software development?"), a: t("No. Acelera decisiones antes de inversión técnica avanzada. Cuando llegues a desarrollo, todo estará mejor preparado: menos retrabajo, mejores entregables.", "No. It accelerates decisions before advanced technical investment. When you get to development, everything will be better prepared: less rework, better deliverables.") },
    { q: t("¿Sirve para carreras fuera de diseño?", "Does it work for non-design fields?"), a: t("Sí. Puente entre Diseño, Producto, Tecnología y Negocio. 12+ carreras: desde Ingeniería de Sistemas hasta Psicología, Marketing y Economía.", "Yes. Bridge between Design, Product, Technology, and Business. 12+ programs: from Systems Engineering to Psychology, Marketing, and Economics.") },
    { q: t("¿Qué entregables tendré al finalizar?", "What deliverables will I have?"), a: t("Producto digital funcional con estrategia, arquitectura UX, validación conductual y pruebas con usuarios. Listo para evolucionar hacia desarrollo real.", "Functional digital product with strategy, UX architecture, behavioral validation, and user testing. Ready to evolve toward real development.") },
    { q: t("¿Necesito saber programar?", "Do I need to code?"), a: t("No. Si eres developer, aún mejor — hay módulos que conectan tu background técnico con pensamiento de producto.", "No. If you're a developer, even better — modules connect your tech background with product thinking.") },
    { q: t("¿En qué se diferencia de un bootcamp de prompts?", "How is this different from a prompts bootcamp?"), a: t("Un bootcamp enseña a escribir prompts. Aquí aprendes arquitectura de experiencias digitales: cuándo usar IA, cómo estructurar productos, cómo conectar UX con desarrollo.", "A bootcamp teaches writing prompts. Here you learn digital experience architecture: when to use AI, how to structure products, how to connect UX with dev.") },
    { q: t("¿Qué es la metodología 90-10?", "What is the 90-10 methodology?"), a: t("90% productividad, 10% esfuerzo. IA automatiza lo repetitivo, tú te enfocas en criterio y decisión.", "90% productivity, 10% effort. AI automates the repetitive, you focus on judgment and decision.") },
    { q: t("¿Cuánto tiempo por semana?", "How much time per week?"), a: t("6-8 horas: sesión en vivo, workshop práctico y aplicación a tu proyecto real.", "6-8 hours: live session, practical workshop, and application to your real project.") },
    { q: t("¿Qué incluye mi acceso?", "What does my access include?"), a: t("9 módulos, workshops en vivo, mentoría, comunidad de por vida, herramientas premium (ChatGPT Plus, Claude, Figma AI), plantillas y certificación.", "9 modules, live workshops, mentorship, lifetime community, premium tools (ChatGPT Plus, Claude, Figma AI), templates, and certification.") },
    { q: t("¿Prometen conseguirme empleo?", "Do you promise I will get a job?"), a: t("No prometemos empleo automático. Sería irresponsable. Lo que sí prometemos es ayudarte a salir con un producto real, un caso de estudio defendible, feedback experto y criterio para explicar tus decisiones en entrevistas, clientes o proyectos propios.", "We do not promise automatic employment. That would be irresponsible. What we do promise is to help you leave with a real product, a defensible case study, expert feedback, and judgment to explain your decisions in interviews, client work, or your own projects.") },
    { q: t("¿Y si no me gusta?", "What if I don't like it?"), a: t("Devolución completa después de la primera semana. Sin preguntas.", "Full refund after the first week. No questions asked.") },
    { q: t("¿Los 30 cupos son reales?", "Are the 30 seats real?"), a: t("Sí. Grupos pequeños para feedback personalizado, no un webinar de 500 personas.", "Yes. Small groups for personalized feedback, not a 500-person webinar.") },
    { q: t("¿Cuándo empieza?", "When does it start?"), a: t("Cohorte 02 se anuncia pronto. Únete a la waitlist para acceso anticipado y precio de prelanzamiento. La Cohorte 01 cerró con satisfacción de 4.7/5.", "Cohort 02 is announced soon. Join the waitlist for early access and pre-launch price. Cohort 01 closed with 4.7/5 satisfaction.") },
    { q: t("¿Tendrá validación universitaria?", "Will it have university validation?"), a: t("En proceso con instituciones educativas. Primeras cohortes recibirán certificación actualizada.", "In process with academic institutions. First cohorts will receive updated certification.") },
    { q: t("¿Funciona para freelancers?", "Does it work for freelancers?"), a: t("Sí. Aprende a diferenciarte y cobrar más por servicios con criterio IA.", "Yes. Learn to differentiate yourself and charge more for AI-judgment services.") },
  ]

  return (
    <section id="faq" className="relative py-14 md:py-20 bg-secondary/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-foreground/50 dark:text-foreground/40 mb-4 font-display">{t("Preguntas frecuentes", "FAQ")}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug font-display">
            {t("Lo que preguntan los que terminan inscribiéndose.", "What enrollees ask before signing up.")}
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.04 + i * 0.03, duration: 0.4 }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? 'curso-card-highlight'
                      : 'curso-card hover:shadow-sm dark:hover:shadow-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-sm font-medium transition-colors duration-300 ${isOpen ? 'text-foreground' : 'text-foreground/80 dark:text-foreground/70'}`}>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ color: isOpen ? 'var(--cyan)' : undefined, opacity: isOpen ? 1 : 0.35 }} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="mt-3 text-sm text-foreground/60 dark:text-foreground/45 leading-relaxed">{faq.a}</p>
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
