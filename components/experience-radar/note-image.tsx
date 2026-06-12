"use client"

import { useEffect, useState } from "react"

const FALLBACK = "/images/experience-radar-vs.png"

/**
 * Imagen de nota con respaldo robusto: si la URL real (p. ej. de Latingoles) falla
 * o no carga en Vercel/móvil, cae al `vs.png` local. Evita imágenes rotas.
 */
export function NoteImage({
  src,
  alt,
  className,
  loading = "lazy",
  fallback = FALLBACK,
}: {
  src?: string
  alt: string
  className?: string
  loading?: "eager" | "lazy"
  fallback?: string
}) {
  const [current, setCurrent] = useState(src || fallback)

  // Si cambia la fuente (navegación cliente), reintenta con la nueva.
  useEffect(() => {
    setCurrent(src || fallback)
  }, [src, fallback])

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (current !== fallback) setCurrent(fallback)
      }}
    />
  )
}
