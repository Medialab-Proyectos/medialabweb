// Tipos y utilidades de herramientas (puros, cliente y servidor).

export type TipoHerramienta = "compartida" | "libre"

export type Herramienta = {
  id: string
  nombre: string
  tipo: TipoHerramienta
  url: string | null
  usuario: string | null
  clave: string | null
  indicaciones: string | null
  activa: boolean
  orden: number
  creado_en: string
  actualizado_en: string
}

export const TIPO_HERRAMIENTA_LABEL: Record<TipoHerramienta, string> = {
  compartida: "Cuenta compartida (usuario y clave)",
  libre: "Acceso libre (solo indicaciones)",
}

/** Aviso de uso responsable mostrado a los empleados. */
export const NORMAS_USO_HERRAMIENTAS =
  "El uso de estas herramientas está sujeto a las normas de uso responsable de la empresa: son para trabajo, no para uso personal. Los tokens/créditos de algunas aplicaciones son limitados, así que úsalas con responsabilidad. No compartas estas credenciales fuera del equipo."
