import "server-only"
import { getServiceClient } from "./db"
import type { Horario, EstadoHorario } from "./horario"

export type HorarioRow = {
  id: string
  empleado_id: string
  horario: Horario
  horario_b: Horario | null
  alterna: boolean
  horas_semana: number
  estado: EstadoHorario
  aprobado_por: string | null
  comentario: string | null
  creado_en: string
  decidido_en: string | null
}

// Columnas base + las de alternancia (fase42). Si una migración antigua creó la tabla sin
// horario_b/alterna, se cae a COLS_BASE para no romper (patrón resiliente del portal).
const COLS_BASE = "id,empleado_id,horario,horas_semana,estado,aprobado_por,comentario,creado_en,decidido_en"
const COLS = `${COLS_BASE},horario_b,alterna`

/** ¿El error es por columnas de alternancia (horario_b/alterna) que aún no existen? */
function faltaAlternancia(error: unknown) {
  return /horario_b|alterna|column/i.test(String((error as { message?: string })?.message ?? ""))
}

/** Select resiliente: intenta con las columnas de alternancia; si no existen, cae a COLS_BASE. */
async function selHorario<T>(build: (cols: string) => PromiseLike<{ data: T; error: unknown }>) {
  let r = await build(COLS)
  if (r.error && faltaAlternancia(r.error)) r = await build(COLS_BASE)
  return r
}

/** Horario VIGENTE del empleado = el más reciente con estado 'aprobado'. */
export async function getHorarioVigente(empleadoId: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await selHorario((cols) => sb
    .from("horarios_empleado")
    .select(cols)
    .eq("empleado_id", empleadoId)
    .eq("estado", "aprobado")
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle())
  if (error) throw error
  return (data as unknown as HorarioRow | null) ?? null
}

/** Propuesta pendiente (si el empleado envió una y aún no la deciden). */
export async function getHorarioPendiente(empleadoId: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await selHorario((cols) => sb
    .from("horarios_empleado")
    .select(cols)
    .eq("empleado_id", empleadoId)
    .eq("estado", "pendiente")
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle())
  if (error) throw error
  return (data as unknown as HorarioRow | null) ?? null
}

/** Envía un horario para aprobación: descarta pendientes previos y crea uno nuevo. */
export async function crearHorario(
  empleadoId: string,
  horario: Horario,
  horasSemana: number,
  opts?: { alterna?: boolean; horarioB?: Horario | null; aprobadoPor?: string | null },
): Promise<HorarioRow> {
  const sb = getServiceClient()
  await sb.from("horarios_empleado").delete().eq("empleado_id", empleadoId).eq("estado", "pendiente")
  // Si aprobadoPor viene (p.ej. el CEO establece el suyo), nace ya aprobado y vigente.
  const aprobado = !!opts?.aprobadoPor
  const full = {
    empleado_id: empleadoId,
    horario,
    horario_b: opts?.alterna ? (opts?.horarioB ?? null) : null,
    alterna: !!opts?.alterna,
    horas_semana: horasSemana,
    estado: (aprobado ? "aprobado" : "pendiente") as "aprobado" | "pendiente",
    aprobado_por: opts?.aprobadoPor ?? null,
    decidido_en: aprobado ? new Date().toISOString() : null,
  }
  let { data, error } = await sb.from("horarios_empleado").insert(full).select(COLS).single()
  // Migración antigua sin columnas de alternancia: reintenta sin ellas (alternancia queda inactiva).
  if (error && faltaAlternancia(error)) {
    const { horario_b: _hb, alterna: _al, ...base } = full
    void _hb; void _al
    ;({ data, error } = await sb.from("horarios_empleado").insert(base).select(COLS_BASE).single())
  }
  if (error) throw error
  return data as unknown as HorarioRow
}

/** El horario MÁS RECIENTE del empleado, sin importar su estado (para detectar un rechazo reciente). */
export async function getUltimoHorario(empleadoId: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await selHorario((cols) => sb
    .from("horarios_empleado")
    .select(cols)
    .eq("empleado_id", empleadoId)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle())
  if (error) throw error
  return (data as unknown as HorarioRow | null) ?? null
}

export async function getHorarioRow(id: string): Promise<HorarioRow | null> {
  const sb = getServiceClient()
  const { data, error } = await selHorario((cols) => sb.from("horarios_empleado").select(cols).eq("id", id).maybeSingle())
  if (error) throw error
  return (data as unknown as HorarioRow | null) ?? null
}

export async function decidirHorario(id: string, cambios: { estado: EstadoHorario; aprobado_por: string; comentario: string | null }): Promise<HorarioRow> {
  const sb = getServiceClient()
  const { data, error } = await selHorario((cols) => sb
    .from("horarios_empleado")
    .update({ ...cambios, decidido_en: new Date().toISOString() })
    .eq("id", id)
    .select(cols)
    .single())
  if (error) throw error
  return data as unknown as HorarioRow
}

export type HorarioConEmpleado = HorarioRow & { empleado: { nombre: string; cedula: string } | null }

/** Horarios de un conjunto de empleados (para el líder / CEO). */
export async function listHorariosDeEmpleados(ids: string[], soloPendientes = false): Promise<HorarioConEmpleado[]> {
  if (ids.length === 0) return []
  const sb = getServiceClient()
  const run = (cols: string) => {
    let q = sb.from("horarios_empleado").select(`${cols}, empleado:empleados!empleado_id(nombre,cedula)`).in("empleado_id", ids)
    if (soloPendientes) q = q.eq("estado", "pendiente")
    return q.order("creado_en", { ascending: false })
  }
  const { data, error } = await selHorario(run)
  if (error) throw error
  return (data ?? []) as unknown as HorarioConEmpleado[]
}

export type HorarioVigenteInfo = { horario: Horario; horario_b: Horario | null; alterna: boolean; creado_en: string }

/** Mapa empleado_id → info del horario VIGENTE (con alternancia) para "quién está activo ahora". */
export async function getHorariosVigentesMap(): Promise<Map<string, HorarioVigenteInfo>> {
  const sb = getServiceClient()
  const { data, error } = await selHorario((cols) => sb
    .from("horarios_empleado")
    .select(cols === COLS ? "empleado_id,horario,horario_b,alterna,creado_en,estado" : "empleado_id,horario,creado_en,estado")
    .eq("estado", "aprobado")
    .order("creado_en", { ascending: false }))
  if (error) throw error
  const map = new Map<string, HorarioVigenteInfo>()
  type Fila = { empleado_id: string; horario: Horario; horario_b?: Horario | null; alterna?: boolean; creado_en: string }
  for (const r of (data ?? []) as unknown as Fila[]) {
    if (!map.has(r.empleado_id)) map.set(r.empleado_id, { horario: r.horario, horario_b: r.horario_b ?? null, alterna: !!r.alterna, creado_en: r.creado_en })
  }
  return map
}

/** Nº de horarios pendientes de aprobar (global) — alerta del CEO. */
export async function contarHorariosPendientes(): Promise<number> {
  const sb = getServiceClient()
  const { count, error } = await sb.from("horarios_empleado").select("id", { count: "exact", head: true }).eq("estado", "pendiente")
  if (error) throw error
  return count ?? 0
}
