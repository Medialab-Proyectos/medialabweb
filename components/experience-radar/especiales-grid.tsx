"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock3, RefreshCw, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { RadarArticle } from "@/src/lib/experience-radar/articles"
import { NoteImage } from "./note-image"
import { StatusPill } from "./status-pill"
import { getArticleAvailability, resolveMatchStatus, compareForFeed } from "@/src/lib/experience-radar/articleAvailability"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

/** Día (YYYY-MM-DD) en la zona LOCAL de quien abre la página. */
function dayKey(value: Date): string {
  return new Intl.DateTimeFormat("en-CA").format(value)
}

/** Marca temporal para ordenar dentro del día: hora del partido, o mediodía del día. */
function recencyTime(a: RadarArticle): number {
  return new Date(a.kickoffAt || `${a.date}T12:00:00`).getTime()
}

/**
 * Orden DENTRO de un día: primero los analizados (finalizados, el más reciente primero),
 * luego los que están en vivo y al final los próximos (el más cercano primero). Así la
 * nota recién evaluada encabeza su fila, y debajo siguen los partidos que vienen.
 */
function compareWithinDay(a: RadarArticle, b: RadarArticle): number {
  const tier = (x: RadarArticle) => {
    const s = resolveMatchStatus(x)
    return s === "finalizado" ? 0 : s === "en_vivo" ? 1 : 2
  }
  const ta = tier(a)
  const tb = tier(b)
  if (ta !== tb) return ta - tb
  // Próximos: el más cercano primero (asc). Analizados / en vivo: el más reciente primero (desc).
  return ta === 2 ? recencyTime(a) - recencyTime(b) : recencyTime(b) - recencyTime(a)
}

/** Agrupa por día (date), días de más reciente a más antiguo; dentro del día:
 *  analizados → en vivo → próximos (vía compareWithinDay). */
function groupByDay(articles: RadarArticle[]): Array<{ date: string; items: RadarArticle[] }> {
  const map = new Map<string, RadarArticle[]>()
  for (const a of articles) {
    const key = a.date
    const bucket = map.get(key)
    if (bucket) bucket.push(a)
    else map.set(key, [a])
  }
  return [...map.entries()]
    .sort(([d1], [d2]) => d2.localeCompare(d1))
    .map(([date, items]) => ({ date, items: [...items].sort(compareWithinDay) }))
}

/**
 * Portal "Especiales": notas agrupadas POR DÍA (hoy primero), y dentro de cada día
 * de la más reciente a la más antigua. Cada día es un carrusel. Bilingüe (chrome).
 */
export function EspecialesGrid({ articles }: { articles: RadarArticle[] }) {
  const { t, lang } = useLanguage()
  // La etiqueta relativa (Hoy/Ayer) depende de la fecha actual del cliente: se
  // calcula tras montar para no desajustar la hidratación.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const groups = useMemo(() => groupByDay(articles), [articles])

  // Último partido analizado = el finalizado más reciente (compareForFeed deja los
  // finalizados de más nuevo a más antiguo). Se resalta para que se vea de un vistazo
  // cuál fue la última actualización del agente. Se calcula tras montar (depende de la hora).
  const latestAnalyzedSlug = useMemo(() => {
    const finalized = articles
      .filter((a) => !a.placeholder && resolveMatchStatus(a) === "finalizado")
      .sort((a, b) => compareForFeed(a, b))
    return finalized[0]?.slug ?? null
  }, [articles])

  if (!groups.length) return null

  const today = mounted ? dayKey(new Date()) : null
  const yesterday = mounted
    ? dayKey(new Date(Date.now() - 24 * 60 * 60 * 1000))
    : null

  const formatDay = (date: string) =>
    new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(`${date}T12:00:00`))

  return (
    <section id="especiales" className="mx-auto mt-16 max-w-5xl scroll-mt-32 px-6 pb-16 md:pb-20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--magenta)]">
          {t("Especiales · Mundial 2026", "Specials · World Cup 2026")}
        </p>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{t("Notas del radar, por día", "Radar notes, by day")}</h2>
      </div>

      <div className="mt-8 space-y-12">
        {groups.map((group) => {
          const relative =
            today && group.date === today
              ? t("Hoy", "Today")
              : yesterday && group.date === yesterday
                ? t("Ayer", "Yesterday")
                : null
          return (
            <div key={group.date}>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {relative && (
                  <span className="rounded-full bg-[var(--cyan)]/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--cyan)]">
                    {relative}
                  </span>
                )}
                <h3 className="text-lg font-bold capitalize">{formatDay(group.date)}</h3>
                <span className="text-xs text-muted-foreground">
                  {group.items.length} {t(group.items.length === 1 ? "nota" : "notas", group.items.length === 1 ? "note" : "notes")}
                </span>
              </div>

              <Carousel opts={{ align: "start", loop: group.items.length > 3 }} className="relative">
                <CarouselContent>
                  {group.items.map((a) => (
                    <CarouselItem key={a.slug} className="sm:basis-1/2 lg:basis-1/3">
                      <NoteCard article={a} isLatestAnalyzed={mounted && a.slug === latestAnalyzedSlug} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Botones de desplazamiento en TODOS los días con más de una nota.
                    Embla los deshabilita solo cuando no hay a dónde desplazar. */}
                {group.items.length > 1 && (
                  <>
                    <CarouselPrevious className="-top-10 left-auto right-11" />
                    <CarouselNext className="-top-10 right-0" />
                  </>
                )}
              </Carousel>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** Tarjeta de nota del portal (imagen, estado, categoría, disponibilidad). */
function NoteCard({ article: a, isLatestAnalyzed = false }: { article: RadarArticle; isLatestAnalyzed?: boolean }) {
  const { t, lang, localized } = useLanguage()
  const availability = getArticleAvailability(a)

  const availableLabel = availability.availableAt
    ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(availability.availableAt))
    : null

  const kickoffLabel = a.kickoffAt
    ? new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(a.kickoffAt))
    : null

  return (
    <Link
      href={availability.accessible ? localized(`/experience-radar/mundial-2026/${a.slug}`) : "#"}
      aria-disabled={!availability.accessible}
      tabIndex={availability.accessible ? undefined : -1}
      onClick={availability.accessible ? undefined : (event) => event.preventDefault()}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-colors ${
        isLatestAnalyzed
          ? "border-2 border-[var(--magenta)] shadow-md shadow-[var(--magenta)]/10"
          : "border border-border dark:border-white/12"
      } ${availability.accessible ? "hover:border-[var(--cyan)]/50" : "cursor-not-allowed opacity-75"}`}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <NoteImage
          src={a.imageUrl}
          seed={a.slug}
          teams={a.teams}
          alt={a.seoTitle}
          className="h-full w-full object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Una sola píldora por tarjeta: la nota recién evaluada muestra "Último
            analizado" (se mueve a la nota más nueva tras cada corrida del agente); el
            resto muestra su estado. Así no se solapa con "Partido analizado". */}
        {isLatestAnalyzed ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--magenta)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#fff] shadow-md ring-1 ring-black/10">
            <Sparkles size={12} /> {t("Último analizado", "Latest analyzed")}
          </span>
        ) : (
          <StatusPill status={resolveMatchStatus(a)} placeholder={a.placeholder} className="absolute right-3 top-3" />
        )}
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
            {availability.reason === "updating" || availability.reason === "preparing" ? (
              <RefreshCw size={13} />
            ) : (
              <Clock3 size={13} />
            )}
            {availability.reason === "updating"
              ? t("Nota en actualización", "Note being updated")
              : availability.reason === "preparing"
                ? t("Análisis en preparación", "Analysis in preparation")
                : t(`Disponible ${availableLabel}`, `Available ${availableLabel}`)}
          </span>
        )}
      </div>
    </Link>
  )
}
