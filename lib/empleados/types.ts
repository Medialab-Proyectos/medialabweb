export type Rol = "ceo" | "lider" | "empleado"
export type EstadoEmpleado = "activo" | "terminado" | "suspendido"
export type TipoVinculacion = "empleado" | "freelance" | "prestacion_servicios"

/** Vinculaciones que cobran por factura/cuenta de cobro (no laborales). */
export function esVinculacionPorFactura(t: TipoVinculacion): boolean {
  return t === "freelance" || t === "prestacion_servicios"
}

export type Empleado = {
  id: string
  cedula: string
  nombre: string
  email: string
  email_empresarial: string | null
  must_change_password: boolean
  rol: Rol
  lider_id: string | null
  cargo: string | null
  caja_compensacion: string | null
  telefono: string | null
  direccion: string | null
  fecha_nacimiento: string | null
  eps: string | null
  fondo_cesantias: string | null
  fondo_pension: string | null
  cert_eps_path: string | null
  cert_cesantias_path: string | null
  cert_pension_path: string | null
  fecha_ingreso: string | null
  fecha_egreso: string | null
  particularidades: string | null
  estado: EstadoEmpleado
  tipo_vinculacion: TipoVinculacion
  tipo_contrato: string | null
  convenio_path: string | null
  fecha_fin_probable: string | null
  // Pago acordado para freelance / prestación de servicios (lo define el CEO).
  freelance_modo: FreelanceModo | null
  freelance_tarifa: number | null
  freelance_moneda: "COP" | "USD" | null
  freelance_meses: number | null   // pago por proyecto: nº de meses (1 = pago único)
  creado_en: string
  actualizado_en: string
}

export type FreelanceModo = "por_hora" | "por_mes" | "fijo" | "por_proyecto"

export const FREELANCE_MODO_LABEL: Record<FreelanceModo, string> = {
  por_hora: "Por hora",
  por_mes: "Por mes",
  fijo: "Valor fijo",
  por_proyecto: "Por proyecto",
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

export const VINCULACION_LABEL: Record<TipoVinculacion, string> = {
  empleado: "Empleado (laboral)",
  freelance: "Freelance",
  prestacion_servicios: "Prestación de servicios",
}
