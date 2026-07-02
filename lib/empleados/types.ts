export type Rol = "ceo" | "lider" | "empleado"
export type EstadoEmpleado = "activo" | "terminado"

export type Empleado = {
  id: string
  cedula: string
  nombre: string
  email: string
  must_change_password: boolean
  rol: Rol
  lider_id: string | null
  cargo: string | null
  fecha_ingreso: string | null
  fecha_egreso: string | null
  particularidades: string | null
  estado: EstadoEmpleado
  creado_en: string
  actualizado_en: string
}

/** Datos que viajan (firmados) en la cookie de sesión. */
export type SessionPayload = {
  sub: string // id del empleado
  cedula: string
  rol: Rol
  nombre: string
  exp: number // epoch en segundos
}

export const ROL_LABEL: Record<Rol, string> = {
  ceo: "CEO / Administrador",
  lider: "Líder",
  empleado: "Empleado",
}
