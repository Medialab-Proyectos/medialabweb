"use client"

import Link from "next/link"
import { MatchCountdown } from "./match-countdown"
import { NoteImage } from "./note-image"
import { useRadarPhase } from "./radar-phase-context"
import { StatusPill, type MatchStatus } from "./status-pill"

interface PhaseAwareNoteImageProps {
  status: MatchStatus
  /** Finalizado por hora pero sin marcador todavía: muestra "En análisis". */
  analyzing?: boolean
  slug: string
  teams: string[]
  title: string
  kickoffAt?: string
  imageUrl?: string
  imageAlt?: string
  imageCredit?: string
  imageSourceUrl?: string
  previewImageUrl?: string
  previewImageAlt?: string
  previewImageCredit?: string
  previewImageSourceUrl?: string
}

/**
 * In analyzed notes, the hero follows the selected phase:
 * - Antes: keeps the original preview image.
 * - Durante / Pronóstico: uses the final analyzed image shown in the special.
 */
export function PhaseAwareNoteImage({
  status,
  analyzing = false,
  slug,
  teams,
  title,
  kickoffAt,
  imageUrl,
  imageAlt,
  imageCredit,
  imageSourceUrl,
  previewImageUrl,
  previewImageAlt,
  previewImageCredit,
  previewImageSourceUrl,
}: PhaseAwareNoteImageProps) {
  const phase = useRadarPhase()?.phase
  const showPreview = status === "previa" || phase === "expectativa"
  const selected = showPreview && previewImageUrl
    ? {
        url: previewImageUrl,
        alt: previewImageAlt,
        credit: previewImageCredit,
        sourceUrl: previewImageSourceUrl,
      }
    : {
        url: imageUrl,
        alt: imageAlt,
        credit: imageCredit,
        sourceUrl: imageSourceUrl,
      }

  return (
    <figure className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-48 md:h-64">
        <NoteImage
          src={selected.url}
          seed={slug}
          teams={teams}
          alt={selected.alt || `${teams.join(" vs ")} - ${title}`}
          className="h-full w-full object-cover object-[center_20%]"
          loading="eager"
        />
        <StatusPill status={status} analyzing={analyzing} className="absolute left-3 top-3 z-10" />
        {kickoffAt && status !== "finalizado" && (
          <div className="absolute bottom-3 left-3 right-3 z-10 md:bottom-4 md:left-4 md:right-auto md:max-w-sm">
            <MatchCountdown kickoffAt={kickoffAt} overlay />
          </div>
        )}
      </div>
      <figcaption className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
        {selected.sourceUrl ? (
          <Link href={selected.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-foreground">
            {selected.credit || "Imagen editorial de la fuente"}. Referencia enlazada, no patrocinada.
          </Link>
        ) : (
          "Imagen representativa del partido. Referencia editorial, no patrocinada."
        )}
      </figcaption>
    </figure>
  )
}
