// Tipos y utilidades de beneficios (puros, cliente y servidor).

// El tipo es un slug del catálogo (beneficios_tipos). 'medicina_prepagada' es el
// tipo especial con tarjeta enriquecida (MedPlus); el resto son del catálogo libre.
export type TipoBeneficio = string
export type EstadoBeneficio = "solicitado" | "activo" | "inactivo"

export const TIPO_MEDICINA = "medicina_prepagada"

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

/** Tipo de beneficio del catálogo (lo gestiona el CEO). */
export type BeneficioTipo = {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  proveedor: string | null
  activo: boolean
  orden: number
  creado_en: string
}

/** Etiqueta legible de un tipo, con las conocidas por defecto. */
const LABELS_BASE: Record<string, string> = {
  medicina_prepagada: "Medicina prepagada",
}
export const TIPO_BENEFICIO_LABEL = new Proxy(LABELS_BASE, {
  get: (target, prop) => (typeof prop === "string" ? target[prop] ?? prop : undefined),
}) as Record<string, string>

export const ESTADO_BENEFICIO_LABEL: Record<EstadoBeneficio, string> = {
  solicitado: "Activación solicitada",
  activo: "Activo",
  inactivo: "Inactivo",
}

/** Proveedor por defecto de medicina prepagada (meta: MedPlus). */
export const PROVEEDOR_MEDICINA_PREPAGADA = "MedPlus"

/** Marca y plan de MedPlus Colombia (medplus.com.co). Plan único: Café Express. */
export const MEDPLUS = {
  nombre: "MedPlus",
  url: "https://medplus.com.co",
  // Verde aproximado de marca; ajústalo si tienes el valor exacto del manual de marca.
  color: "#78BE20",
  plan: "Plan Café Express",
  coberturas: [
    "Acceso directo a todas las especialidades y subespecialidades, incluye medicina alternativa",
    "Exámenes de laboratorio e imágenes diagnósticas simples y especializadas",
    "Terapias: física, lenguaje, ocupacional, respiratoria, rehabilitación y visual",
    "Urgencias y odontología básica: profilaxis, obturación, radiografía panorámica, exodoncia simple, detartraje",
    "Consulta médica domiciliaria",
    "Terapias domiciliarias: físicas y respiratorias",
  ],
  telefonos: [
    { label: "Bogotá", numero: "(601) 742 0101" },
    { label: "Nacional", numero: "018000 184000" },
  ],
} as const

/** Datos que lleva una activación de medicina prepagada (plan fijo). */
export type DatosMedicinaPrepagada = {
  plan?: string
}
