"use client"

import { useEffect, useState } from "react"
import { pickMatchImage } from "./default-image"

/**
 * Imagen de nota con respaldo robusto: si la URL real (p. ej. de Latingoles) falla
 * o no carga en Vercel/móvil, cae a una imagen por defecto local. Evita imágenes
 * rotas. Si no se pasa `fallback`, se elige una por defecto ESTABLE según `seed`.
 */
export function NoteImage({
  src,
  alt,
  className,
  loading = "lazy",
  seed,
  teams,
  fallback,
}: {
  src?: string
  alt: string
  className?: string
  loading?: "eager" | "lazy"
  /** Semilla (p. ej. slug del partido) para elegir una imagen por defecto estable. */
  seed?: string
  /** Equipos del partido: si juega un anfitrión (México/EE. UU./Canadá), usa su imagen. */
  teams?: string[]
  fallback?: string
}) {
  const resolvedFallback = fallback ?? pickMatchImage(seed, teams)
  const [remoteFailed, setRemoteFailed] = useState(false)
  const remoteSrc = src && src !== resolvedFallback && !remoteFailed ? src : null

  // Si cambia la fuente (navegación cliente), reintenta con la nueva.
  useEffect(() => {
    setRemoteFailed(false)
  }, [src])

  return (
    <span className="relative block h-full w-full overflow-hidden">
      <img
        src={resolvedFallback}
        alt={remoteSrc ? "" : alt}
        aria-hidden={remoteSrc ? true : undefined}
        className={className}
        loading={loading}
      />
      {remoteSrc && (
        <img
          src={remoteSrc}
          alt={alt}
          referrerPolicy={remoteSrc.includes("latingoles.com") ? "no-referrer" : undefined}
          className={`absolute inset-0 ${className ?? ""}`}
          loading={loading}
          onError={() => setRemoteFailed(true)}
        />
      )}
    </span>
  )
}
