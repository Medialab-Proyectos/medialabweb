"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, Copy, GraduationCap, Box, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { RADAR_PROMO } from "@/src/lib/experience-radar/articles"

/**
 * CTA final de la nota. Dos tarjetas integradas (no banner publicitario): se sienten
 * parte del contenido. UX School conserva la promo Mundial (cupón copiable); UXBox
 * invita a convertir una idea en experiencia real. Bilingüe.
 */
export function RadarCtaCards() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(RADAR_PROMO.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard no disponible: el cupón sigue visible para copiar a mano */
    }
  }

  return (
    <section className="mt-12 grid gap-6 md:grid-cols-2">
      {/* UX School */}
      <article className="flex flex-col sm:flex-row gap-5 overflow-hidden rounded-2xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.05] p-5 transition-all duration-300 hover:border-[var(--cyan)]/50 hover:shadow-lg hover:shadow-[var(--cyan)]/[0.02]">
        <div className="flex-1 flex flex-col justify-between order-2 sm:order-1">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">
              <GraduationCap size={14} /> UX School
            </p>
            <h3 className="mt-2.5 text-base font-bold leading-snug">
              {t(
                "¿Te gusta entender por qué las personas toman decisiones?",
                "Like understanding why people make the decisions they do?",
              )}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {t(
                "Aprende diseño de experiencia, comportamiento e IA aplicada.",
                "Learn experience design, behavior and applied AI.",
              )}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[var(--cyan)]">
                {t(`${RADAR_PROMO.percent}% de descuento durante el Mundial`, `${RADAR_PROMO.percent}% off during the World Cup`)}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cyan)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/20 focus:outline-none"
                aria-label={copied ? t("Código copiado", "Code copied") : t(`Copiar código ${RADAR_PROMO.code}`, `Copy code ${RADAR_PROMO.code}`)}
              >
                {RADAR_PROMO.code}
                {copied ? <Check size={10} /> : <Copy size={10} />}
              </button>
            </div>
          </div>

          <Link
            href={RADAR_PROMO.href}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-[var(--cyan)] hover:text-white"
          >
            <GraduationCap size={14} /> {t("Conocer el curso", "See the course")}
          </Link>
        </div>
        <div className="relative w-full h-32 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl bg-black/10 order-1 sm:order-2 self-start">
          <Image
            src="/images/radar-uxschool-futbol-v3.png"
            alt="UX School Mundial 2026"
            fill
            sizes="(max-width: 640px) 100vw, 112px"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      </article>

      {/* UXBox */}
      <article className="flex flex-col sm:flex-row gap-5 overflow-hidden rounded-2xl border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.05] p-5 transition-all duration-300 hover:border-[var(--magenta)]/50 hover:shadow-lg hover:shadow-[var(--magenta)]/[0.02]">
        <div className="flex-1 flex flex-col justify-between order-2 sm:order-1">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
              <Box size={14} /> UXBox
            </p>
            <h3 className="mt-2.5 text-base font-bold leading-snug">
              {t("¿Tienes una idea de producto digital?", "Got a digital product idea?")}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {t(
                "Transforma tu idea en una experiencia real con UXBox.",
                "Turn your idea into a real experience with UXBox.",
              )}
            </p>
          </div>

          <Link
            href="/#uxbox"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-[var(--magenta)] hover:text-white"
          >
            <ArrowRight size={14} /> {t("Probar UXBox", "Try UXBox")}
          </Link>
        </div>
        <div className="relative w-full h-32 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl bg-black/10 order-1 sm:order-2 self-start">
          <Image
            src="/images/radar-uxbox-futbol-v3.png"
            alt="UXBox Mundial 2026"
            fill
            sizes="(max-width: 640px) 100vw, 112px"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </article>
    </section>
  )
}
