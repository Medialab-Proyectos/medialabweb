"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Briefcase, Award, MessageCircle } from "lucide-react"
import { CourseRegisterForm } from "./course-register-form"
import { useLanguage } from "@/lib/language-context"

export function CourseCta() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()

  return (
    <section id="registro" className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[var(--magenta)]/[0.04] rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--cyan)]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
          {/* Left — CTA content */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15] mb-6 font-display">
              {t("La IA no va a esperar a que estés listo.", "AI isn't going to wait until you're ready.")}
              <br />
              <span className="bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
                {t("Pero puedes elegir estar preparado.", "But you can choose to be prepared.")}
              </span>
            </h2>

            <p className="max-w-xl text-lg text-foreground/50 leading-relaxed mb-8">
              {t("30 cupos. 8 semanas. Al terminar, eres un", "30 spots. 8 weeks. When you finish, you're a")}{" "}
              <span className="text-[var(--cyan)] font-medium">AI Experience Architect</span>{" "}
              {t("y", "and")}{" "}
              <span className="text-[var(--magenta)] font-medium">UX Prompt Designer</span>.
            </p>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-foreground/30 line-through text-lg">$1,500</span>
              <span className="text-4xl md:text-5xl font-bold font-display" style={{ color: 'var(--cyan)' }}>$995</span>
              <span className="text-foreground/40 text-sm">USD</span>
            </div>
            <p className="text-xs text-foreground/30 mb-8">
              {t("Precio de lanzamiento · Garantía de devolución la primera semana", "Launch price · First-week refund guarantee")}
            </p>

            {/* WhatsApp link */}
            <a
              href={t(
                "https://wa.me/573054009505?text=Hola%2C%20quiero%20información%20sobre%20el%20curso%20AI%20Experience%20Architect",
                "https://wa.me/573054009505?text=Hi%2C%20I%20want%20info%20about%20the%20AI%20Experience%20Architect%20course"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg mb-8"
              style={{ background: 'var(--cyan)' }}
            >
              <MessageCircle size={16} />
              {t("¿Dudas? Habla con un asesor", "Questions? Talk to an advisor")}
            </a>

            {/* Compact includes */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/40">
              <span className="flex items-center gap-1.5"><Users size={13} className="text-foreground/30" /> {t("30 cupos", "30 spots")}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-foreground/30" /> {t("Proyecto real", "Real project")}</span>
              <span className="flex items-center gap-1.5"><Award size={13} className="text-foreground/30" /> {t("Certificación", "Certification")}</span>
              <span className="flex items-center gap-1.5"><Users size={13} className="text-foreground/30" /> {t("Comunidad de por vida", "Lifetime community")}</span>
            </div>
          </motion.div>

          {/* Right — Registration form */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:sticky lg:top-24">
            <CourseRegisterForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
