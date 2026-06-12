"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { RadarArticle } from "@/src/lib/experience-radar/articles"

const GENERIC_IMAGE = "/images/experience-radar-vs.png"

/**
 * Portal "Especiales": notas con imagen, tipo portal de noticias. La más reciente
 * primero. Bilingüe (chrome). Cada card lleva al detalle de la nota.
 */
export function EspecialesGrid({ articles }: { articles: RadarArticle[] }) {
  const { t, localized } = useLanguage()
  // Los artículos son contenido en español (ruta única, sin mirror /en).
  if (!articles.length) return null

  return (
    <section id="especiales" className="mx-auto mt-16 max-w-5xl scroll-mt-32 px-6 pb-16 md:pb-20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
          {t("Especiales · Mundial 2026", "Specials · World Cup 2026")}
        </p>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{t("Más notas del radar", "More from the radar")}</h2>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={localized(`/experience-radar/mundial-2026/${a.slug}`)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-[var(--cyan)]/50"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={a.imageUrl || GENERIC_IMAGE}
                alt={a.seoTitle}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                {a.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-sm font-bold leading-snug group-hover:text-[var(--cyan)]">{a.seoTitle}</h3>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.quickSummary}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--cyan)]">
                {t("Leer", "Read")} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
