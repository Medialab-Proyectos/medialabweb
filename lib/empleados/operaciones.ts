import "server-only"

// Conexión de solo lectura al Centro de Operaciones (repo UXIA, Supabase propio).
// "Satisfacción empresarial" = índice GENERAL de cómo van los proyectos (0–100), no solo el
// rating que dan los clientes. UXIA lo expone en la vista `indice_proyectos`:
//   { indice, satisfaccion, cumplimiento, flujo, activas, vencidas, bloqueadas, calificadas }
// combinando satisfacción declarada (0.40) + cumplimiento a tiempo (0.35) + salud de flujo (0.25).
// Si esa vista aún no existe (base sin migrar), cae a `satisfaccion_general` (solo rating × 20).
// Requiere en .env.local: OPERACIONES_SUPABASE_URL + OPERACIONES_SERVICE_KEY.
const URL = process.env.OPERACIONES_SUPABASE_URL
const KEY = process.env.OPERACIONES_SERVICE_KEY

export type SatisfaccionOperaciones = {
  promedio100: number | null
  tareas: number
  validadoEn: string | null
  // Desglose del índice general (null si se cayó al fallback de solo-rating).
  componentes: { satisfaccion: number | null; cumplimiento: number | null; flujo: number | null } | null
}

function ahoraBogota() {
  return new Date().toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium", timeStyle: "short" })
}

async function ops(path: string) {
  const r = await fetch(`${URL}/rest/v1/${path}`, {
    headers: { apikey: KEY as string, Authorization: `Bearer ${KEY}` },
    cache: "no-store",
  })
  if (!r.ok) return null
  const rows = await r.json()
  return Array.isArray(rows) ? rows[0] : rows
}

/** Índice GENERAL de proyectos (0–100) traído del Centro de Operaciones. */
export async function getSatisfaccionOperaciones(): Promise<SatisfaccionOperaciones> {
  if (!URL || !KEY) return { promedio100: null, tareas: 0, validadoEn: null, componentes: null }
  try {
    // 1) Índice general compuesto (satisfacción + cumplimiento + flujo).
    const idx = await ops("indice_proyectos?select=indice,satisfaccion,cumplimiento,flujo,activas,calificadas")
    if (idx && idx.indice != null) {
      const indice = Number(idx.indice)
      return {
        promedio100: indice,
        tareas: Number(idx.calificadas) || 0,
        validadoEn: ahoraBogota(),
        componentes: {
          satisfaccion: idx.satisfaccion == null ? null : Number(idx.satisfaccion),
          cumplimiento: idx.cumplimiento == null ? null : Number(idx.cumplimiento),
          flujo: idx.flujo == null ? null : Number(idx.flujo),
        },
      }
    }
    // 2) Fallback: solo el rating (1..5 × 20) si la vista nueva aún no está.
    const row = await ops("satisfaccion_general?select=satisfaccion_promedio,tareas_calificadas")
    const prom = Number(row?.satisfaccion_promedio) || 0
    const tareas = Number(row?.tareas_calificadas) || 0
    return {
      promedio100: prom > 0 ? Math.round(prom * 20) : null,
      tareas,
      validadoEn: prom > 0 ? ahoraBogota() : null,
      componentes: null,
    }
  } catch {
    return { promedio100: null, tareas: 0, validadoEn: null, componentes: null }
  }
}
