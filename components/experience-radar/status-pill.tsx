/**
 * Píldora de estado del partido/nota (estilo etiqueta editorial). Fondo sólido y
 * alto contraste para verse de inmediato. Server-safe (sin hooks): se usa tanto en
 * las tarjetas del listado como superpuesta sobre la imagen de la nota.
 */
export type MatchStatus = "previa" | "en_vivo" | "finalizado"

const MAP: Record<MatchStatus, { label: string; cls: string }> = {
  previa: { label: "Por iniciar", cls: "bg-[#F59E0B] text-black" },
  en_vivo: { label: "En vivo", cls: "bg-[var(--magenta)] text-[#fff]" },
  finalizado: { label: "Finalizado", cls: "bg-[var(--cyan)] text-black" },
}

export function StatusPill({ status, className = "" }: { status?: MatchStatus; className?: string }) {
  const s = MAP[status ?? "finalizado"] ?? MAP.finalizado
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md ${s.cls} ${className}`}
    >
      {s.label}
    </span>
  )
}
