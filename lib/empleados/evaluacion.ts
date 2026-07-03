// Evaluación de desempeño trimestral (competencias 1-5). Puro (cliente y servidor).

export const COMPETENCIAS = [
  { clave: "calidad", etiqueta: "Calidad del trabajo" },
  { clave: "cumplimiento", etiqueta: "Cumplimiento de plazos y compromisos" },
  { clave: "dominio_tecnico", etiqueta: "Dominio técnico (UX / desarrollo)" },
  { clave: "colaboracion", etiqueta: "Colaboración y trabajo en equipo" },
  { clave: "comunicacion", etiqueta: "Comunicación" },
  { clave: "iniciativa", etiqueta: "Iniciativa y autonomía" },
  { clave: "aprendizaje", etiqueta: "Aprendizaje y adaptación" },
] as const

export const NIVELES: { v: number; label: string }[] = [
  { v: 1, label: "1 · Bajo" },
  { v: 2, label: "2 · En desarrollo" },
  { v: 3, label: "3 · Cumple" },
  { v: 4, label: "4 · Destacado" },
  { v: 5, label: "5 · Sobresaliente" },
]

export type Competencias = Record<string, number> // clave -> 1..5

export type Puntajes = { competencias?: Competencias; global?: number } | null

export type EstadoEvaluacion = "abierta" | "completada"

export type Evaluacion = {
  id: string
  evaluado_id: string
  evaluador_id: string
  periodo: string
  estado: EstadoEvaluacion
  puntajes: Puntajes
  puntos_mejora: string | null   // áreas de mejora
  puntos_criticos: string | null // fortalezas (reutilizamos esta columna)
  comentarios: string | null     // plan de acción / comentarios
  creado_en: string
  completado_en: string | null
}

export function calcularGlobal(c: Competencias | undefined): number {
  if (!c) return 0
  const vals = COMPETENCIAS.map((x) => Number(c[x.clave]) || 0).filter((v) => v > 0)
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

export function ratingLabel(global: number): string {
  if (global >= 4.5) return "Sobresaliente"
  if (global >= 3.5) return "Cumple / Bueno"
  if (global >= 2.5) return "En desarrollo"
  if (global > 0) return "Requiere atención"
  return "Sin calificar"
}

export function periodoActual(d = new Date()): string {
  const q = Math.floor(d.getMonth() / 3) + 1
  return `${d.getFullYear()}-Q${q}`
}

/** Últimos 8 trimestres, del más reciente al más antiguo. */
export function periodosRecientes(): string[] {
  const out: string[] = []
  const d = new Date()
  let y = d.getFullYear()
  let q = Math.floor(d.getMonth() / 3) + 1
  for (let i = 0; i < 8; i++) {
    out.push(`${y}-Q${q}`)
    q--
    if (q < 1) { q = 4; y-- }
  }
  return out
}

const TRIMESTRE_MESES: Record<string, string> = {
  Q1: "Ene–Mar", Q2: "Abr–Jun", Q3: "Jul–Sep", Q4: "Oct–Dic",
}
export function periodoLabel(periodo: string): string {
  const [y, q] = periodo.split("-")
  return `${q} ${y} (${TRIMESTRE_MESES[q] ?? ""})`
}
