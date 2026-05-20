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
        "Me ayudó a ver cosas que francamente no hubiera podido ver solo. Lo que hubiera tomado muchísimo más tiempo, en una o dos auditorías se fue puliendo. Las bases teóricas y las leyes de UX hacen toda la diferencia.",
        "It helped me see things I frankly couldn't have seen on my own. What would have taken much longer got refined in just one or two audits. The theoretical foundations and UX laws make all the difference."
      ),
      name: "Sebastián Vargas",
      role: t("Desarrollador · App de Derechos Ciudadanos", "Developer · Civic Rights App"),
      result: t("MVP validado con 8 mejoras clave", "MVP validated with 8 key improvements"),
    },
    {
      text: t(
        "Ha cambiado mucho el flujo de mi app. Antes tenía funciones regadas por todos lados, ahora están agrupadas en un solo punto. Uno se da cuenta de lo importante que es que todo esté en su sitio para que funcione.",
        "It completely changed my app's flow. I used to have features scattered everywhere, now they're grouped in one place. You realize how important it is for everything to be where it belongs."
      ),
      name: "Mariana Castro",
      role: t("Diseñadora · App de Bienestar Mental", "Designer · Mental Wellness App"),
      result: t("Flujo reestructurado completo", "Fully restructured user flow"),
    },
    {
      text: t(
        "La IA te puede recomendar, pero tú eres el que tiene que tener el conocimiento para guiarla. Sin todo el análisis y las estructuras que aprendimos, estaríamos súper perdidos. En flujo, estructura y usabilidad mi app está sólida.",
        "AI can give you recommendations, but you need the knowledge to guide it. Without the analysis frameworks we learned, we'd be completely lost. My app is now solid in flow, structure, and usability."
      ),
      name: "Nicolás Herrera",
      role: t("Estudiante · App Social de Eventos", "Student · Social Events App"),
      result: t("Auditoría + rediseño en 2 semanas", "Audit + redesign in 2 weeks"),
    },
    {
      text: t(
        "Es muy importante tener las bases. Una cosa es imaginarse las funcionalidades y otra es tenerlas aplicadas con criterio. Las auditorías me mostraron exactamente qué mejorar en el perfil y el onboarding sin perderme en opciones infinitas.",
        "Having the foundations is crucial. It's one thing to imagine features, another to apply them with real criteria. The audits showed me exactly what to improve in the profile and onboarding without getting lost in endless options."
      ),
      name: "Isabella Ríos",
      role: t("Diseñadora UX · App de Experiencias", "UX Designer · Experiences App"),
      result: t("Onboarding y perfil rediseñados", "Onboarding & profile redesigned"),
    },
    {
      text: t(
        "Me dijo que mi aplicativo era muy profesional pero que pensara más en el usuario que no sabe. Eso me hizo replantear todo el onboarding. Ahora mi app es una herramienta de apoyo real, no solo un sistema técnico.",
        "It told me my app was very professional but to think more about users who don't know. That made me rethink the entire onboarding. Now my app is a real support tool, not just a technical system."
      ),
      name: "Tomás Aguirre",
      role: t("Maker · Help3D · Impresión 3D", "Maker · Help3D · 3D Printing"),
      result: t("Onboarding humanizado completo", "Fully humanized onboarding"),
    },
    {
      text: t(
        "Aprendí a cruzar los gaps cognitivos con los nudges para encontrar mejoras reales. Dejar el modo simple por default, mostrar fechas límite en vez de días hábiles, mensajes personalizados por uso... son cambios pequeños que transforman la experiencia.",
        "I learned to cross cognitive gaps with nudges to find real improvements. Defaulting to simple mode, showing deadlines instead of business days, personalized messages by usage... small changes that transform the experience."
      ),
      name: "Daniel Mora",
      role: t("Desarrollador · Plataforma Legal", "Developer · Legal Platform"),
      result: t("6 nudges implementados en MVP", "6 nudges implemented in MVP"),
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
