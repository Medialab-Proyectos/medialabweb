import "server-only"
import { getServiceClient } from "./db"
import { listEmpleados } from "./queries"
import { getHorariosVigentesMap } from "./horario-queries"
import { ahoraBogota, estadoActual, hhmmAMin, type EstadoActual, type Horario } from "./horario"
import { TIPOS_VACACIONALES } from "./ausencia"
import { esVinculacionPorFactura } from "./types"

export type ActividadEmpleado = {
  id: string
  nombre: string
  cargo: string | null
  estado: EstadoActual
  entrada?: string
  salida?: string
}

type AusHoy = { empleado_id: string; tipo: string; por_horas?: boolean; hora_inicio?: string | null; hora_fin?: string | null }

/** Estado actual (activo/almorzando/permiso/…) de cada empleado laboral, cruzando horario + permisos. */
export async function getPanelActividad(): Promise<{ ahora: string; empleados: ActividadEmpleado[]; resumen: Record<EstadoActual, number> }> {
  const sb = getServiceClient()
  const { dia, minutos, hhmm } = ahoraBogota()
  const hoyISO = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })

  const empleados = await listEmpleados()
  const laborales = empleados.filter((e) => e.estado === "activo" && !esVinculacionPorFactura(e.tipo_vinculacion))

  let horarios = new Map<string, Horario>()
  try { horarios = await getHorariosVigentesMap() } catch { horarios = new Map() }

  // Ausencias aprobadas que cubren hoy (con soporte a permisos por horas si la migración está).
  let ausHoy: AusHoy[] = []
  try {
    const { data, error } = await sb
      .from("solicitudes_ausencia")
      .select("empleado_id,tipo,fecha_inicio,fecha_fin,por_horas,hora_inicio,hora_fin")
      .eq("estado", "aprobada").lte("fecha_inicio", hoyISO).gte("fecha_fin", hoyISO)
    if (error) throw error
    ausHoy = (data ?? []) as AusHoy[]
  } catch {
    const { data } = await sb
      .from("solicitudes_ausencia")
      .select("empleado_id,tipo,fecha_inicio,fecha_fin")
      .eq("estado", "aprobada").lte("fecha_inicio", hoyISO).gte("fecha_fin", hoyISO)
    ausHoy = (data ?? []) as AusHoy[]
  }

  const coberturaDe = (empId: string): "vacaciones" | "permiso" | null => {
    for (const a of ausHoy) {
      if (a.empleado_id !== empId) continue
      // Permiso por horas: solo cubre si el momento actual cae dentro del rango.
      if (a.por_horas && a.hora_inicio && a.hora_fin) {
        if (minutos < hhmmAMin(a.hora_inicio) || minutos >= hhmmAMin(a.hora_fin)) continue
      }
      return TIPOS_VACACIONALES.includes(a.tipo as never) ? "vacaciones" : "permiso"
    }
    return null
  }

  const resumen: Record<EstadoActual, number> = { activo: 0, almorzando: 0, fuera_horario: 0, permiso: 0, vacaciones: 0, no_configurado: 0 }
  const lista: ActividadEmpleado[] = laborales.map((e) => {
    const h = horarios.get(e.id) ?? null
    const est = estadoActual(h, dia, minutos, coberturaDe(e.id))
    resumen[est]++
    const day = h && dia ? h[dia] : null
    return { id: e.id, nombre: e.nombre, cargo: e.cargo, estado: est, entrada: day?.activo ? day.entrada : undefined, salida: day?.activo ? day.salida : undefined }
  })
  const orden: EstadoActual[] = ["activo", "almorzando", "permiso", "vacaciones", "fuera_horario", "no_configurado"]
  lista.sort((a, b) => orden.indexOf(a.estado) - orden.indexOf(b.estado) || a.nombre.localeCompare(b.nombre))
  return { ahora: hhmm, empleados: lista, resumen }
}
