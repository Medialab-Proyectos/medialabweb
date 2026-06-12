"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle, Lightbulb, ExternalLink, ChevronDown, MapPin, Users,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { ExperienceInsight } from "@/lib/radar"
import { ScoreRing } from "./radar-visuals"
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_STYLES, countryLabel } from "./labels"

/** Card de un insight de experiencia. Presentacional + recomendaciones expandibles. */
export function InsightCard({ insight }: { insight: ExperienceInsight }) {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)

  const roles: { label: string; value: string }[] = [
    { label: "Product Designer", value: insight.recommendations.designer },
    { label: "UX Research", value: insight.recommendations.research },
    { label: "Product Manager", value: insight.recommendations.product },
    { label: t("Equipo técnico", "Engineering"), value: insight.recommendations.tech },
    { label: t("Negocio", "Business"), value: insight.recommendations.business },
  ]

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[var(--cyan)]/40 focus-within:border-[var(--cyan)]/60"
    >
      {/* Header: categoría + estado */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--cyan)]">
          {CATEGORY_LABELS[insight.category][lang]}
        </span>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[insight.status]}`}>
          {STATUS_LABELS[insight.status][lang]}
        </span>
      </div>

      {/* Título + score */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-foreground">{insight.title}</h3>
        <ScoreRing value={insight.impactScore} label={t("impacto", "impact")} />
      </div>

      {/* Resumen de la señal */}
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{insight.eventSummary}</p>

      {/* Insight UX */}
      <div className="mt-4 rounded-xl bg-muted/50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--cyan)]">{t("Insight UX", "UX insight")}</p>
        <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{insight.uxInsight}</p>
      </div>

      {/* Riesgo + oportunidad */}
      <div className="mt-3 grid gap-2">
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--magenta)]" />
          <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{t("Riesgo", "Risk")}: </span>{insight.userRisk}</p>
        </div>
        <div className="flex items-start gap-2">
          <Lightbulb size={14} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
          <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{t("Oportunidad", "Opportunity")}: </span>{insight.designOpportunity}</p>
        </div>
      </div>

      {/* Recomendaciones por rol (sección "Qué debería hacer un equipo de producto") */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-left text-xs font-semibold text-foreground transition-colors hover:border-[var(--cyan)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]/50"
      >
        <span className="flex items-center gap-1.5">
          <Users size={13} className="text-[var(--cyan)]" />
          {t("Qué debería hacer un equipo de producto", "What a product team should do")}
        </span>
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <dl className="mt-2 grid gap-2 rounded-lg bg-muted/40 p-3">
          {roles.map((r) => (
            <div key={r.label} className="grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-[11px] font-semibold text-[var(--cyan)]">{r.label}</dt>
              <dd className="text-xs text-muted-foreground">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Footer: fuente, país, fecha */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin size={11} />{countryLabel(insight.country, lang)}</span>
        <span aria-hidden>·</span>
        <span>{t("Detectado", "Detected")}: {insight.createdAt}</span>
        <span aria-hidden>·</span>
        <a
          href={insight.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 font-medium text-foreground/80 hover:text-[var(--cyan)]"
        >
          {insight.sourceName}<ExternalLink size={11} />
        </a>
      </div>
    </motion.article>
  )
}
