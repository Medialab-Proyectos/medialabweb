// Tipos y utilidades de encuestas de satisfacción (puros, cliente y servidor).

export type OrigenSatisfaccion = "empleado" | "empresa"

export type Satisfaccion = {
  id: string
  origen: OrigenSatisfaccion
  empleado_id: string | null
  empresa: string | null
  periodo: string
  puntaje: number            // 0..100
  recomendacion: number | null // 0..10 (eNPS)
  comentario: string | null
  creado_por: string | null
  creado_en: string
}

/** Periodo actual 'YYYY-MM' en zona horaria de Bogotá. */
export function periodoActual(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" }).slice(0, 7)
}

/** Escala de satisfacción (1..5) mapeada a 0..100. */
export const ESCALA: { valor: number; puntaje: number; label: string; emoji: string }[] = [
  { valor: 1, puntaje: 0, label: "Muy insatisfecho", emoji: "😖" },
  { valor: 2, puntaje: 25, label: "Insatisfecho", emoji: "🙁" },
  { valor: 3, puntaje: 50, label: "Neutral", emoji: "😐" },
  { valor: 4, puntaje: 75, label: "Satisfecho", emoji: "🙂" },
  { valor: 5, puntaje: 100, label: "Muy satisfecho", emoji: "😄" },
]

/** Etiqueta legible de un puntaje 0..100. */
export function nivelSatisfaccion(p: number): string {
  if (p >= 80) return "Excelente"
  if (p >= 60) return "Bueno"
  if (p >= 40) return "Regular"
  return "Bajo"
}
