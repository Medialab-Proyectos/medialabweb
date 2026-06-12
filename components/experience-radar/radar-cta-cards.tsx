"use client"

import { useState } from "react"
import Link from "next/link"
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
    <section className="mt-12 grid gap-4 md:grid-cols-2">
      {/* UX School */}
      <article className="flex flex-col rounded-2xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.05] p-6">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--cyan)]">
          <GraduationCap size={14} /> UX School
        </p>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          {t(
            "¿Te gusta entender por qué las personas toman decisiones?",
            "Like understanding why people make the decisions they do?",
          )}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(
            "Aprende diseño de experiencia, comportamiento e IA aplicada.",
            "Learn experience design, behavior and applied AI.",
          )}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--cyan)]">
            {t(`${RADAR_PROMO.percent}% de descuento durante el Mundial`, `${RADAR_PROMO.percent}% off during the World Cup`)}
          </span>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cyan)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]/50"
            aria-label={copied ? t("Código copiado", "Code copied") : t(`Copiar código ${RADAR_PROMO.code}`, `Copy code ${RADAR_PROMO.code}`)}
          >
            {RADAR_PROMO.code}
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>

        <Link
          href={RADAR_PROMO.href}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-[var(--cyan)] hover:text-white"
        >
          <GraduationCap size={16} /> {t("Conocer el curso", "See the course")}
        </Link>
      </article>

      {/* UXBox */}
      <article className="flex flex-col rounded-2xl border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.05] p-6">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
          <Box size={14} /> UXBox
        </p>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          {t("¿Tienes una idea de producto digital?", "Got a digital product idea?")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(
            "Transforma tu idea en una experiencia real con UXBox.",
            "Turn your idea into a real experience with UXBox.",
          )}
        </p>

        <Link
          href="/#uxbox"
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-[var(--magenta)] hover:text-white"
        >
          <ArrowRight size={16} /> {t("Probar UXBox", "Try UXBox")}
        </Link>
      </article>
    </section>
  )
}
