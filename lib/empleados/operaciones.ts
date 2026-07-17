import "server-only"

// Conexión de solo lectura al Centro de Operaciones (repo UXIA, Supabase propio).
// Consume la vista `satisfaccion_general` que UXIA expone para este portal:
//   { tareas_calificadas, satisfaccion_promedio (1..5), ia_promedio }
// Requiere en .env.local: OPERACIONES_SUPABASE_URL + OPERACIONES_SERVICE_KEY.
const URL = process.env.OPERACIONES_SUPABASE_URL
const KEY = process.env.OPERACIONES_SERVICE_KEY

/** Índice de satisfacción general de proyectos (0–100) traído del Centro de Operaciones. */
export async function getSatisfaccionOperaciones(): Promise<{ promedio100: number | null; tareas: number }> {
  if (!URL || !KEY) return { promedio100: null, tareas: 0 }
  try {
    const r = await fetch(`${URL}/rest/v1/satisfaccion_general?select=satisfaccion_promedio,tareas_calificadas`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      cache: "no-store",
    })
    if (!r.ok) return { promedio100: null, tareas: 0 }
    const rows = await r.json()
    const row = Array.isArray(rows) ? rows[0] : rows
    const prom = Number(row?.satisfaccion_promedio) || 0
    const tareas = Number(row?.tareas_calificadas) || 0
    // La vista da 1..5; lo llevamos a 0..100 para el termómetro.
    return { promedio100: prom > 0 ? Math.round(prom * 20) : null, tareas }
  } catch {
    return { promedio100: null, tareas: 0 }
  }
}
