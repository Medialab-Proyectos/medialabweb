"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Palette, Monitor, Code2, RocketIcon, User, Users, Frown, Sparkles } from "lucide-react"

const profiles = [
  { icon: Palette, title: "UX/UI Designers", desc: "Quieres usar IA sin que tus diseños pierdan alma. Aquí aprendes a amplificar tu criterio, no a reemplazarlo." },
  { icon: Monitor, title: "Product Designers", desc: "Necesitas construir productos completos donde la IA potencia — no complica — la experiencia del usuario." },
  { icon: Code2, title: "Developers", desc: "Diseñas interfaces pero te falta criterio visual estratégico. Aquí conectas código con pensamiento de producto." },
  { icon: RocketIcon, title: "Startups", desc: "Necesitas lanzar rápido pero con profundidad. Aprende a validar antes de construir y a construir sin deuda de diseño." },
  { icon: User, title: "Freelancers", desc: "Tus clientes ya usan ChatGPT. ¿Cómo te diferencias? Con criterio, frameworks y resultados que la IA sola no da." },
  { icon: Users, title: "Equipos de Innovación", desc: "Necesitan una metodología compartida para que todo el equipo hable el mismo idioma de IA + diseño." },
  { icon: Frown, title: "Frustrados con la IA", desc: "Hiciste 3 cursos de prompts y sigues sin saber construir un producto. Esto resuelve eso." },
  { icon: Sparkles, title: "Creativos que quieren ser únicos", desc: "Sabes que el futuro es con IA. Pero te rehusas a ser uno más. Aquí aprendes a ser tú, amplificado." },
]

export function CourseAudience() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-20 md:py-28 bg-[var(--surface-dark)] overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display" style={{ color: 'var(--magenta)' }}>
            ¿Esto es para ti?
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--surface-dark-fg)] tracking-tight leading-tight mb-6 font-display">
            Si algo de esto te suena, sí.
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/50">
            No importa si llevas 1 año o 10. Si quieres evolucionar con la IA en vez de correr detrás de ella, esta metodología fue diseñada para ti.
          </p>
          <p className="text-sm text-foreground/30 mt-3">
            Toca el perfil que más te represente. Si dudas entre dos, es buena señal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((profile, i) => {
            const Icon = profile.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                className="group"
              >
                <div className="p-6 rounded-2xl border border-foreground/[0.04] bg-foreground/[0.02] hover:border-[var(--magenta)]/[0.15] hover:bg-[var(--magenta)]/[0.03] transition-all duration-500 h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/[0.03] group-hover:bg-[var(--magenta)]/10 mx-auto flex items-center justify-center mb-4 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-foreground/30 group-hover:text-[var(--magenta)] transition-colors duration-500" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--surface-dark-fg)] mb-2">{profile.title}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed">{profile.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
