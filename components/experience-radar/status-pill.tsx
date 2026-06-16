/**
 * Píldora de estado del partido/nota (estilo etiqueta editorial). Fondo sólido y
 * alto contraste para verse de inmediato. Server-safe (sin hooks): se usa tanto en
 * las tarjetas del listado como superpuesta sobre la imagen de la nota.
 */
export type MatchStatus = "previa" | "en_vivo" | "finalizado"

// Etiquetas de ANÁLISIS (no de resultado), cortas: "Previa en análisis" / "Partido
// analizado". Estilo glass (más translúcido + blur, sin bordes) para que se vea bien
// la imagen por detrás y la cápsula no pese sobre la foto.
const MAP: Record<MatchStatus, { label: string; cls: string }> = {
  previa: { label: "Previa en análisis", cls: "bg-[#F59E0B]/90 text-black backdrop-blur-md" },
  en_vivo: { label: "En vivo", cls: "bg-[var(--magenta)] text-[#fff] backdrop-blur-md" },
  finalizado: { label: "Partido analizado", cls: "bg-[var(--cyan)]/90 text-black backdrop-blur-md" },
}

export function StatusPill({
  status,
  placeholder = false,
  analyzing = false,
  className = "",
}: {
  status?: MatchStatus
  /** Marcador de calendario sin análisis: muestra "Próximamente" en vez del estado. */
  placeholder?: boolean
  /** Partido cuya hora ya pasó pero AÚN SIN marcador/análisis: "En análisis", no "analizado". */
  analyzing?: boolean
  className?: string
}) {
  const s = placeholder
    ? { label: "Próximamente", cls: "bg-black/70 text-[#fff] backdrop-blur-md" }
    : analyzing
      ? { label: "En análisis", cls: "bg-[#475569]/90 text-[#fff] backdrop-blur-md" }
      : MAP[status ?? "finalizado"] ?? MAP.finalizado
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md ring-1 ring-black/10 ${s.cls} ${className}`}
    >
      {s.label}
    </span>
  )
}
