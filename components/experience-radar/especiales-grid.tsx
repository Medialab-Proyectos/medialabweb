"use client"

import Link from "next/link"
import { ArrowRight, Clock3, RefreshCw } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { RadarArticle } from "@/src/lib/experience-radar/articles"
import { NoteImage } from "./note-image"
import { StatusPill } from "./status-pill"
import { categoryLabel } from "./category-labels"
import { getArticleAvailability } from "@/src/lib/experience-radar/articleAvailability"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

/**
 * Portal "Especiales": notas con imagen, tipo portal de noticias. La más reciente
 * primero. Bilingüe (chrome). Cada card lleva al detalle de la nota.
 */
export function EspecialesGrid({ articles }: { articles: RadarArticle[] }) {
  const { t, lang, localized } = useLanguage()
  // Los artículos son contenido en español (ruta única, sin mirror /en).
  if (!articles.length) return null

  return (
    <section id="especiales" className="mx-auto mt-16 max-w-5xl scroll-mt-32 px-6 pb-16 md:pb-20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
          {t("Especiales · Mundial 2026", "Specials · World Cup 2026")}
        </p>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{t("Notas del radar", "Radar notes")}</h2>
      </div>

      <Carousel opts={{ align: "start", loop: articles.length > 3 }} className="mt-6">
        <CarouselContent>
          {articles.map((a) => {
          const availability = getArticleAvailability(a)
          const availableLabel = availability.availableAt
            ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Bogota",
              }).format(new Date(availability.availableAt))
            : null

          const kickoffLabel = a.kickoffAt
            ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Bogota",
              }).format(new Date(a.kickoffAt))
            : null

          return (
          <CarouselItem key={a.slug} className="sm:basis-1/2 lg:basis-1/3">
          <Link
            href={availability.accessible ? localized(`/experience-radar/mundial-2026/${a.slug}`) : "#"}
            aria-disabled={!availability.accessible}
            tabIndex={availability.accessible ? undefined : -1}
            onClick={availability.accessible ? undefined : (event) => event.preventDefault()}
            className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors ${
              availability.accessible ? "hover:border-[var(--cyan)]/50" : "cursor-not-allowed opacity-75"
            }`}
          >
            <div className="relative h-40 w-full overflow-hidden">
              <NoteImage
                src={a.imageUrl}
                seed={a.slug}
                alt={a.seoTitle}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <StatusPill status={a.matchState} className="absolute right-3 top-3" />
              <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-[#fff] backdrop-blur-sm">
                {categoryLabel(a.category, lang)}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-sm font-bold leading-snug group-hover:text-[var(--cyan)]">{a.seoTitle}</h3>
              {kickoffLabel && (
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground/80">
                  <Clock3 size={13} /> {a.teams.join(" vs ")} · {kickoffLabel}
                </span>
              )}
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.quickSummary}</p>
              {availability.accessible ? (
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--cyan)]">
                  {t("Leer", "Read")} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              ) : (
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  {availability.reason === "updating" ? <RefreshCw size={13} /> : <Clock3 size={13} />}
                  {availability.reason === "updating"
                    ? t("Nota en actualización", "Note being updated")
                    : t(`Disponible ${availableLabel}`, `Available ${availableLabel}`)}
                </span>
              )}
            </div>
          </Link>
          </CarouselItem>
          )
        })}
        </CarouselContent>
        <CarouselPrevious className="-top-11 left-auto right-11" />
        <CarouselNext className="-top-11 right-0" />
      </Carousel>
    </section>
  )
}
