/**
 * Píldora de estado del partido/nota (estilo etiqueta editorial). Fondo sólido y
 * alto contraste para verse de inmediato. Server-safe (sin hooks): se usa tanto en
 * las tarjetas del listado como superpuesta sobre la imagen de la nota.
 */
export type MatchStatus = "previa" | "en_vivo" | "finalizado"

// Etiquetas de ANÁLISIS (no de resultado): la nota no muestra un marcador real como
// titular, así que el estado deja claro que es una lectura de experiencia, no un score.
const MAP: Record<MatchStatus, { label: string; cls: string }> = {
  previa: { label: "Previa analizada", cls: "bg-[#F59E0B] text-black" },
  en_vivo: { label: "Analizando en vivo", cls: "bg-[var(--magenta)] text-[#fff]" },
  finalizado: { label: "Fin de partido analizado", cls: "bg-[var(--cyan)] text-black" },
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
    ? { label: "Próximamente", cls: "bg-muted text-muted-foreground" }
    : MAP[status ?? "finalizado"] ?? MAP.finalizado
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md ${s.cls} ${className}`}
    >
      {s.label}
    </span>
  )
}
