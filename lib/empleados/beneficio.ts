// Tipos y utilidades de beneficios (puros, cliente y servidor).

export type TipoBeneficio = "medicina_prepagada"
export type EstadoBeneficio = "solicitado" | "activo" | "inactivo"

export type Beneficio = {
  id: string
  empleado_id: string
  tipo: TipoBeneficio
  estado: EstadoBeneficio
  proveedor: string | null
  datos: Record<string, unknown>
  observaciones: string | null
  creado_en: string
  actualizado_en: string
}

export const TIPO_BENEFICIO_LABEL: Record<TipoBeneficio, string> = {
  medicina_prepagada: "Medicina prepagada",
}

export const ESTADO_BENEFICIO_LABEL: Record<EstadoBeneficio, string> = {
  solicitado: "Activación solicitada",
  activo: "Activo",
  inactivo: "Inactivo",
}

/** Proveedor por defecto de medicina prepagada (meta: MedPlus). */
export const PROVEEDOR_MEDICINA_PREPAGADA = "MedPlus"

/** Marca y planes oficiales de MedPlus Colombia (medplus.com.co). */
export const MEDPLUS = {
  nombre: "MedPlus",
  url: "https://medplus.com.co",
  // Verde aproximado de marca; ajústalo si tienes el valor exacto del manual de marca.
  color: "#78BE20",
  /** Familias de planes (el plan específico se define al afiliar). */
  planes: [
    "Plan Azul",
    "Plan Excelso",
    "Plan Light",
    "AMD",
    "Plan Azul Plus",
  ],
} as const

/** Datos que puede llevar una activación de medicina prepagada. */
export type DatosMedicinaPrepagada = {
  plan?: string
  beneficiarios?: number
}
