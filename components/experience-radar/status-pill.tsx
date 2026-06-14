/**
 * Píldora de estado del partido/nota (estilo etiqueta editorial). Fondo sólido y
 * alto contraste para verse de inmediato. Server-safe (sin hooks): se usa tanto en
 * las tarjetas del listado como superpuesta sobre la imagen de la nota.
 */
export type MatchStatus = "previa" | "en_vivo" | "finalizado"

// Etiquetas de ANÁLISIS (no de resultado), cortas: "Previa en análisis" / "Partido
// analizado". Estilo glass (translúcido + blur) para que se vea la imagen por detrás.
const MAP: Record<MatchStatus, { label: string; cls: string }> = {
  previa: { label: "Previa en análisis", cls: "bg-[#F59E0B]/70 text-black backdrop-blur-md" },
  en_vivo: { label: "En vivo", cls: "bg-[var(--magenta)]/70 text-[#fff] backdrop-blur-md" },
  finalizado: { label: "Partido analizado", cls: "bg-[var(--cyan)]/70 text-black backdrop-blur-md" },
}

export function StatusPill({
  status,
  placeholder = false,
  className = "",
}: {
  status?: MatchStatus
  /** Marcador de calendario sin análisis: muestra "Próximamente" en vez del estado. */
  placeholder?: boolean
  className?: string
}) {
  const s = placeholder
    ? { label: "Próximamente", cls: "bg-black/35 text-white backdrop-blur-md" }
    : MAP[status ?? "finalizado"] ?? MAP.finalizado
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${s.cls} ${className}`}
    >
      {s.label}
    </span>
  )
}
