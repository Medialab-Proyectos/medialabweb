"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Briefcase, Award, MessageCircle, Clock, Shield, Zap, CheckCircle } from "lucide-react"
import { CourseRegisterForm } from "./course-register-form"
import { useLanguage } from "@/lib/language-context"

/* Countdown target: 2026-07-15T23:59:59 COL (UTC-5) */
const COUNTDOWN_END = new Date("2026-07-15T23:59:59-05:00").getTime()

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false })

  useEffect(() => {
    const tick = () => {
      const diff = COUNTDOWN_END - Date.now()
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true })
        return
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}

export function CourseCta() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLanguage()
  const countdown = useCountdown()

  return (
    <section id="registro" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--magenta)]/[0.06] dark:bg-[var(--magenta)]/[0.04] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        {/* ── SHARED HEADLINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.15] font-display">
            {t("La IA no va a esperarte.", "AI won't wait for you.")}
            <br />
            <span className="bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              {t("Pero tú puedes llevarle ventaja.", "But you can get ahead of it.")}
            </span>
          </h2>
          <p className="mt-3 text-sm text-foreground/55 dark:text-foreground/40 max-w-lg mx-auto">
            {t("30 cupos · 8 semanas · Sales con un producto real y el criterio para construir los que vienen.", "30 spots · 8 weeks · You leave with a real product and the judgment to build what comes next.")}
          </p>
        </motion.div>

        {/* ── TWO CARDS SIDE BY SIDE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* LEFT — Pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="curso-card-highlight border rounded-2xl p-6 md:p-7 h-full flex flex-col">
              {/* Card title */}
              <h3 className="text-base font-bold text-foreground mb-4 font-display">
                {t("Tu inversión", "Your investment")}
              </h3>

              {/* Anchor + savings with inline countdown */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-foreground/30 line-through text-lg">$1,500 USD</span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--magenta)', color: 'white' }}>
                  {t("-34% Prelanzamiento", "-34% Pre-launch")}
                  {countdown.expired ? (
                    <>
                      <span className="w-px h-3 bg-white/30" />
                      <span className="font-semibold text-[11px]">
                        {t("Últimos cupos", "Last spots")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-px h-3 bg-white/30" />
                      <span className="font-mono tabular-nums text-[11px] font-semibold">
                        {String(countdown.d).padStart(2, '0')}d {String(countdown.h).padStart(2, '0')}h {String(countdown.m).padStart(2, '0')}m {String(countdown.s).padStart(2, '0')}s
                      </span>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold font-display" style={{ color: 'var(--cyan)' }}>$995</span>
                <span className="text-foreground/50 text-base">USD</span>
              </div>
              <p className="text-sm text-foreground/50 mb-5">
                <span className="font-semibold text-foreground/70 dark:text-foreground/60">$124/</span>
                {t("semana · menos que una suscripción a herramientas de IA", "week · less than an AI tools subscription")}
              </p>

              {/* Value stack + total — unified box */}
              <div className="p-4 rounded-xl bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/[0.08] dark:border-white/[0.10] mb-4 flex-1 flex flex-col">
                <p className="text-xs font-semibold text-foreground/60 dark:text-foreground/45 uppercase tracking-wider mb-3 text-center">
                  {t("Incluido en tu acceso", "Included in your access")}
                </p>
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-3 text-sm text-foreground/70 dark:text-foreground/55">
                    <CheckCircle size={16} style={{ color: 'var(--cyan)' }} className="shrink-0" />
                    <span className="flex-1">{t("9 módulos + workshops en vivo", "9 modules + live workshops")}</span>
                    <span className="text-xs text-foreground/30 font-mono">$1,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/70 dark:text-foreground/55">
                    <CheckCircle size={16} style={{ color: 'var(--cyan)' }} className="shrink-0" />
                    <span className="flex-1">{t("Proyecto real en tu portafolio", "Real project in your portfolio")}</span>
                    <span className="text-xs text-foreground/30 font-mono">$400</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/70 dark:text-foreground/55">
                    <CheckCircle size={16} style={{ color: 'var(--cyan)' }} className="shrink-0" />
                    <span className="flex-1">{t("Certificación profesional", "Professional certification")}</span>
                    <span className="text-xs text-foreground/30 font-mono">$450</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/70 dark:text-foreground/55">
                    <CheckCircle size={16} style={{ color: 'var(--cyan)' }} className="shrink-0" />
                    <span className="flex-1">{t("Comunidad de por vida", "Lifetime community")}</span>
                    <span className="text-xs text-foreground/30 font-mono">$300</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/70 dark:text-foreground/55">
                    <CheckCircle size={16} style={{ color: 'var(--cyan)' }} className="shrink-0" />
                    <span className="flex-1">{t("Herramientas premium incluidas", "Premium tools included")}</span>
                    <span className="text-xs text-foreground/30 font-mono">$250</span>
                  </div>
                </div>

                {/* Valor total / Tú pagas */}
                <div className="flex items-center justify-between pt-3 border-t border-foreground/[0.08] dark:border-white/[0.10] mt-auto">
                  <div>
                    <p className="text-xs text-foreground/40">{t("Valor total", "Total value")}</p>
                    <p className="text-xl font-bold text-foreground/30 line-through">$2,400</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: 'var(--cyan)' }}>{t("Tú pagas", "You pay")}</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--cyan)' }}>$995</p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-green-500/[0.07] dark:bg-green-500/[0.06] border border-green-500/[0.18] mb-4">
                <Shield size={16} className="text-green-500 shrink-0" />
                <p className="text-xs text-foreground/60 dark:text-foreground/45">
                  <span className="font-bold text-green-600 dark:text-green-400">{t("Garantía semana 1.", "Week 1 guarantee.")}</span>{" "}
                  {t("Devolución completa si no es lo que esperabas.", "Full refund if it's not what you expected.")}
                </p>
              </div>

              {/* Urgency & Scarcity */}
              <div className="flex flex-col gap-2.5 mb-5">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[var(--magenta)] shrink-0" />
                  <p className="text-xs text-foreground/70 dark:text-foreground/50">
                    <span className="font-semibold" style={{ color: 'var(--magenta)' }}>{t("Cohorte 02", "Cohort 02")}</span>
                    {t(" — precio de prelanzamiento por tiempo limitado.", " — pre-launch price for a limited time.")}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <p className="text-xs text-foreground/45 text-center mb-3 leading-relaxed">
                {t(
                  "Un experto del área puede guiarte en una mentoría 1 a 1 gratuita o escribirte sobre nuestras masterclasses online cerradas.",
                  "An area expert can guide you in a free 1-on-1 mentoring session or reach out about our closed online masterclasses."
                )}
              </p>
              <a
                href={t(
                  "https://wa.me/573054009505?text=Hola%2C%20quiero%20info%20sobre%20AI%20User%20Experience%20Architect",
                  "https://wa.me/573054009505?text=Hi%2C%20I%20want%20info%20about%20AI%20User%20Experience%20Architect"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.02] mt-auto"
                style={{ background: 'var(--cyan)' }}
              >
                <MessageCircle size={15} />
                {t("Habla con un experto →", "Talk to an expert →")}
              </a>
            </div>
          </motion.div>

          {/* RIGHT — Registration form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="h-full">
              <CourseRegisterForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
