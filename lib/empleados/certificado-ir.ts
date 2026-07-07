// Certificado de Ingresos y Retenciones (DIAN) — tipos puros (cliente y servidor).

export type CertificadoIR = {
  id: string
  empleado_id: string
  anio: number
  archivo_path: string | null
  publicado: boolean
  creado_en: string
  actualizado_en: string
}

export type CertificadoIRConEmpleado = CertificadoIR & {
  empleado: { nombre: string; cedula: string } | null
}
