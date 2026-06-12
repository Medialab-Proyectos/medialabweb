"use client"

import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { RadarArticle } from "@/src/lib/experience-radar/articles"
import { NoteImage } from "./note-image"
import { StatusPill } from "./status-pill"

/**
 * "Nota principal" del portal: la nota más reciente, destacada como bloque grande.
 * No despliega la nota completa: enlaza a su detalle (/mundial-2026/[slug]), que es
 * donde se lee el análisis. Bilingüe (chrome); el contenido editorial se traduce
 * en la Fase 4 (capa IA). Mobile-first.
 */
export function FeaturedNote({ article }: { article: RadarArticle }) {
  const { t, localized } = useLanguage()

  const formattedDate = new Intl.DateTimeFormat(t("es-CO", "en-US"), {
    day: "2-digit",
    month: "long",
    timeZone: "America/Bogota",
  }).format(new Date(`${article.date}T12:00:00`))

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10 md:pt-14">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
        {t("Nota principal · la más reciente", "Main note · latest")}
      </p>

      <Link
        href={localized(`/experience-radar/mundial-2026/${article.slug}`)}
        className="group mt-3 grid overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-[var(--cyan)]/60 md:grid-cols-2"
      >
        <div className="relative h-52 w-full overflow-hidden md:h-full md:min-h-[280px]">
          <NoteImage
            src={article.imageUrl}
            alt={article.seoTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="eager"
          />
          <StatusPill status={article.matchState} className="absolute right-3 top-3" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-[#fff] backdrop-blur-sm">
            <Star size={12} className="text-[var(--cyan)]" /> {t("Nota principal", "Main note")}
          </span>
        </div>

        <div className="flex flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[var(--cyan)]/10 px-3 py-1 font-semibold text-[var(--cyan)]">{article.category}</span>
            <span className="text-muted-foreground">{formattedDate}</span>
          </div>

          <h2 className="mt-3 text-xl font-bold leading-snug group-hover:text-[var(--cyan)] md:text-2xl">
            {article.seoTitle}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:line-clamp-4">
            {article.quickSummary}
          </p>

          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cyan)]">
              {t("Leer análisis", "Read analysis")}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="text-xs text-muted-foreground">
              {t("Radar Score", "Radar Score")} <strong className="text-foreground">{article.radarScore.total}</strong>/100
            </span>
          </div>
        </div>
      </Link>
    </section>
  )
}
