"use client"

import Link from "next/link"
import { ArrowUpRight, Clock3 } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { NoteImage } from "./note-image"

export interface RelatedNote {
  slug: string
  title: string
  teams: string
  image: string
  /** Etiqueta corta de estado (Previa / En vivo / Finalizado). */
  badge?: string
  /** Si la nota aún no es accesible (previa sin análisis), la tarjeta no enlaza. */
  accessible?: boolean
}

/**
 * Carrusel de notas relacionadas al final de una nota. Más partidos del especial
 * para seguir leyendo. Deslizable en móvil; varias visibles en desktop.
 */
export function RelatedNotes({ notes }: { notes: RelatedNote[] }) {
  if (!notes.length) return null

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <h2 className="text-2xl font-bold">Notas relacionadas</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Más partidos del especial, leídos desde la experiencia, la emoción y el comportamiento.
      </p>

      <Carousel opts={{ align: "start", dragFree: true }} className="mt-4">
        <CarouselContent className="-ml-3">
          {notes.map((n) => {
            const locked = n.accessible === false
            const card = (
              <>
                <div className="relative">
                  <NoteImage src={n.image} seed={n.slug} teams={n.teams.split(" vs ")} alt={n.title} className="h-32 w-full object-cover object-[center_20%]" />
                  {n.badge && (
                    <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-semibold text-[#fff] backdrop-blur-sm">
                      {n.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{n.teams}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug">{n.title}</p>
                  {locked ? (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Clock3 size={12} /> Análisis en preparación
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--cyan)]">
                      Leer nota <ArrowUpRight size={12} />
                    </span>
                  )}
                </div>
              </>
            )
            return (
              <CarouselItem key={n.slug} className="basis-[80%] pl-3 sm:basis-1/2 lg:basis-1/3">
                {locked ? (
                  <div className="block h-full cursor-not-allowed overflow-hidden rounded-2xl border border-border bg-card opacity-75">
                    {card}
                  </div>
                ) : (
                  <Link
                    href={`/experience-radar/mundial-2026/${n.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-[var(--cyan)]"
                  >
                    {card}
                  </Link>
                )}
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
