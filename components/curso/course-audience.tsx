"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Palette, Monitor, Code2, RocketIcon, User, Users, Frown, Sparkles,
  GraduationCap, Lightbulb, TrendingUp, Megaphone, Brain, PenTool,
  BarChart3, Globe, ChevronDown
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CourseAudience() {
  const { t } = useLanguage()
  const [showSecondary, setShowSecondary] = useState(false)

  const primaryProfiles = [
    { icon: Palette, title: t("UX/UI Designers", "UX/UI Designers"), desc: t("Amplifica tu criterio con IA sin perder alma.", "Amplify your judgment with AI without losing soul.") },
    { icon: Monitor, title: t("Product Designers", "Product Designers"), desc: t("Construye productos completos, no solo pantallas.", "Build complete products, not just screens.") },
    { icon: Code2, title: t("Developers", "Developers"), desc: t("Conecta código con pensamiento de producto y UX.", "Connect code with product thinking and UX.") },
    { icon: RocketIcon, title: t("Startups y CEOs", "Startups & CEOs"), desc: t("Valida antes de invertir en desarrollo complejo.", "Validate before investing in complex development.") },
  ]

  const secondaryProfiles = [
    { icon: User, title: t("Freelancers", "Freelancers"), desc: t("Diferénciate con criterio, frameworks y productos reales.", "Stand out with judgment, frameworks, and real products.") },
    { icon: Users, title: t("Emprendedores", "Entrepreneurs"), desc: t("Convierte tu idea en producto sin depender de código.", "Turn your idea into a product without depending on code.") },
    { icon: Frown, title: t("Post-bootcamp", "Post-bootcamp"), desc: t("3 cursos de prompts y sigues sin construir un producto.", "3 prompt courses and you still can't build a product.") },
    { icon: Sparkles, title: t("Entusiastas digitales", "Digital enthusiasts"), desc: t("Crea productos con propósito, no solo pantallas.", "Create products with purpose, not just screens.") },
  ]

  const universityPrograms = [
    { icon: Palette, name: t("Diseño Gráfico", "Graphic Design") },
    { icon: Monitor, name: t("Multimedia", "Multimedia") },
    { icon: Code2, name: t("Ing. Sistemas", "Systems Eng.") },
    { icon: Lightbulb, name: t("Ing. Electrónica", "Electronic Eng.") },
    { icon: TrendingUp, name: t("Ing. Industrial", "Industrial Eng.") },
    { icon: PenTool, name: t("Artes", "Arts") },
    { icon: RocketIcon, name: t("Diseño Industrial", "Industrial Design") },
    { icon: Brain, name: t("Psicología", "Psychology") },
    { icon: Megaphone, name: t("Marketing", "Marketing") },
    { icon: Users, name: t("Sociología", "Sociology") },
    { icon: Globe, name: t("Periodismo", "Journalism") },
    { icon: BarChart3, name: t("Economía", "Economics") },
  ]

  return (
    <section id="audiencia" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase mb-4 font-display font-medium" style={{ color: "var(--magenta)" }}>
            {t("¿Para quién es?", "Who is it for?")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4 font-display">
            {t("Talento híbrido", "Hybrid talent")}
            <br />
            <span className="text-foreground/50">{t("UX + IA + Producto + Negocio.", "UX + AI + Product + Business.")}</span>
          </h2>
          <p className="text-sm text-foreground/60 dark:text-foreground/45">
            {t("Si te identificas con más de un perfil, es buena señal.", "If you identify with more than one profile, that's a good sign.")}
          </p>
        </motion.div>

        {/* Primary profiles — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {primaryProfiles.map((profile, i) => {
            const Icon = profile.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                className="group"
              >
                <div className="curso-card p-4 md:p-5 rounded-xl border hover:border-[var(--magenta)]/30 transition-all duration-300 h-full text-center">
                  <Icon className="w-5 h-5 mx-auto mb-3 text-foreground/40 group-hover:text-[var(--magenta)] transition-colors duration-300" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">{profile.title}</h3>
                  <p className="text-xs text-foreground/55 dark:text-foreground/40 leading-snug">{profile.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Secondary profiles + university programs — collapsible */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }} className="mb-10">
          <button
            onClick={() => setShowSecondary(!showSecondary)}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-border/50 hover:border-[var(--cyan)]/30 text-sm text-foreground/60 hover:text-foreground transition-all duration-300 bg-transparent"
          >
            {showSecondary
              ? t("Ocultar otros perfiles", "Hide other profiles")
              : t("¿Vienes de otra disciplina? Ver más perfiles", "Coming from another field? See more profiles")}
            <ChevronDown size={15} className={`transition-transform duration-300 ${showSecondary ? "rotate-180" : ""}`} />
          </button>

          {showSecondary && (
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {secondaryProfiles.map((profile, i) => {
                  const Icon = profile.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="group"
                    >
                      <div className="curso-card p-4 md:p-5 rounded-xl border hover:border-[var(--magenta)]/30 transition-all duration-300 h-full text-center">
                        <Icon className="w-5 h-5 mx-auto mb-3 text-foreground/40 group-hover:text-[var(--magenta)] transition-colors duration-300" />
                        <h3 className="text-sm font-semibold text-foreground mb-1">{profile.title}</h3>
                        <p className="text-xs text-foreground/55 dark:text-foreground/40 leading-snug">{profile.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.08] dark:bg-[var(--cyan)]/[0.06] mb-3">
                  <GraduationCap size={14} style={{ color: "var(--cyan)" }} />
                  <span className="text-xs tracking-[0.12em] uppercase font-medium" style={{ color: "var(--cyan)" }}>
                    {t("Universidades", "Universities")}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 font-display">
                  {t("12+ carreras universitarias afines", "12+ related university programs")}
                </h3>
                <p className="text-xs text-foreground/50 max-w-md mx-auto">
                  {t("Complemento ideal para carreras que necesitan entender producto digital, UX e IA.", "Ideal complement for programs that need to understand digital product, UX, and AI.")}
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {universityPrograms.map((program, i) => {
                  const Icon = program.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      className="curso-card p-3 rounded-lg border hover:border-[var(--cyan)]/25 transition-all duration-300 text-center"
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1.5 text-foreground/30" />
                      <p className="text-[11px] text-foreground/60 dark:text-foreground/50 font-medium leading-tight">{program.name}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
