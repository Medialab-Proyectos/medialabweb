/**
 * Estrategia de tesorería para MediaLab: en qué escalón está la empresa y qué vehículo
 * corresponde. La regla es de orden, no de rendimiento: primero liquidez, después inversión.
 *
 * Referencia completa (mercado colombiano, vehículos y tributación):
 *   docs/empleados/analisis-inversiones-crecimiento.md
 *
 * NO incluye tasas de mercado: cambian cada semana y deben verificarse en BanRep /
 * Superfinanciera antes de decidir.
 */

/** Factor de costo empleador sobre el devengado: prestaciones + seguridad social + parafiscales. */
export const FACTOR_COSTO_EMPLEADOR = 1.468

export type PosicionTesoreria = {
  /** Caja disponible de la EMPRESA (no incluye cuentas personales). */
  caja: number
  /** Costo fijo mensual: nómina con carga prestacional + freelance por mes. */
  costoFijoMes: number
  /** Meses de operación que cubre la caja actual. */
  runwayMeses: number
  /** Provisión mensual sugerida de prestaciones (prima + cesantías + intereses). */
  provisionPrestacionesMes: number
  /** Devengado laboral mensual (base de las prestaciones). */
  devengadoMes: number
}

export type Escalon = {
  n: number
  titulo: string
  meta: string
  /** Monto objetivo (null = no es monetario). */
  objetivo: number | null
  vehiculo: string
  estado: "hecho" | "actual" | "pendiente"
}

/** Prestaciones anuales aproximadas: prima (1 salario/año) + cesantías (1) + intereses (12%). */
export function prestacionesAnuales(devengadoMes: number): number {
  const prima = devengadoMes // dos primas de medio salario = un salario al año
  const cesantias = devengadoMes
  const intereses = cesantias * 0.12
  return Math.round(prima + cesantias + intereses)
}

export function calcularPosicion(input: {
  caja: number
  devengadoMes: number
  freelanceMes: number
}): PosicionTesoreria {
  const costoNomina = Math.round(input.devengadoMes * FACTOR_COSTO_EMPLEADOR)
  const costoFijoMes = costoNomina + input.freelanceMes
  const runwayMeses = costoFijoMes > 0 ? input.caja / costoFijoMes : 0
  return {
    caja: input.caja,
    costoFijoMes,
    runwayMeses,
    provisionPrestacionesMes: Math.round(prestacionesAnuales(input.devengadoMes) / 12),
    devengadoMes: input.devengadoMes,
  }
}

/**
 * Escalera de decisión. No se salta un escalón: invertir es lo que se hace CON el excedente,
 * no un sustituto de tenerlo.
 */
export function construirEscalera(p: PosicionTesoreria, opts: { tieneMovimientos: boolean }): Escalon[] {
  // Los objetivos son ACUMULATIVOS: la misma caja no puede ser a la vez colchón y provisión.
  const unMes = p.costoFijoMes
  const tresMeses = p.costoFijoMes * 3
  const prestaciones = prestacionesAnuales(p.devengadoMes)
  const conPrestaciones = tresMeses + prestaciones
  const excedente = p.costoFijoMes * 6 + prestaciones

  const pasos: Omit<Escalon, "estado">[] = [
    { n: 1, titulo: "Contabilidad real", meta: "Registrar ingresos, egresos y cartera en el sistema", objetivo: null, vehiculo: "—" },
    { n: 2, titulo: "Colchón de emergencia", meta: "1 mes de costo fijo", objetivo: unMes, vehiculo: "Cuenta de ahorro / FIC de liquidez" },
    { n: 3, titulo: "Reserva operativa", meta: "3 meses de costo fijo", objetivo: tresMeses, vehiculo: "FIC de liquidez" },
    { n: 4, titulo: "Provisión de prestaciones", meta: "3 meses + prima y cesantías del año", objetivo: conPrestaciones, vehiculo: "CDT corto / FIC de liquidez" },
    { n: 5, titulo: "Excedente invertible", meta: "6 meses + prestaciones cubiertos", objetivo: excedente, vehiculo: "Escalera de CDTs / FIC renta fija" },
    { n: 6, titulo: "Capital de crecimiento", meta: "Reinversión en producto y recurrente", objetivo: null, vehiculo: "El propio negocio" },
  ]

  // El escalón 1 solo se da por cumplido si hay movimientos cargados: sin datos no hay decisión.
  let actualAsignado = false
  return pasos.map((s) => {
    let estado: Escalon["estado"]
    if (s.n === 1) {
      estado = opts.tieneMovimientos ? "hecho" : "actual"
      if (!opts.tieneMovimientos) actualAsignado = true
    } else if (s.objetivo != null && p.caja >= s.objetivo) {
      estado = "hecho"
    } else if (!actualAsignado) {
      estado = "actual"; actualAsignado = true
    } else {
      estado = "pendiente"
    }
    return { ...s, estado }
  })
}

/** Recomendación principal según el escalón en curso. */
export function recomendacion(escalera: Escalon[], p: PosicionTesoreria): { titulo: string; cuerpo: string; tono: "rojo" | "ambar" | "verde" } {
  const actual = escalera.find((e) => e.estado === "actual")
  if (!actual || actual.n === 1) {
    return {
      tono: "rojo",
      titulo: "Antes de invertir: carga la contabilidad",
      cuerpo: "El sistema no tiene movimientos registrados, así que ninguna decisión de inversión sería informada. Registra ingresos, egresos y cartera de los últimos meses; ahí sabremos el excedente real.",
    }
  }
  if (actual.n === 2) {
    return {
      tono: "rojo",
      titulo: "No hay excedente para invertir todavía",
      cuerpo: `La caja cubre ${p.runwayMeses.toFixed(1)} meses de operación. La prioridad es llegar a 1 mes de costo fijo en una cuenta líquida. Cobrar cartera y pedir anticipos libera más caja que cualquier rendimiento financiero disponible.`,
    }
  }
  if (actual.n === 3) {
    return {
      tono: "ambar",
      titulo: "Construye la reserva operativa (3 meses)",
      cuerpo: "Ya tienes el colchón mínimo. Lleva la reserva a 3 meses en un FIC de liquidez (liquidez diaria, sin castigo por retiro). Todavía no amarres plata en CDT.",
    }
  }
  if (actual.n === 4) {
    return {
      tono: "ambar",
      titulo: "Provisiona prestaciones antes de invertir",
      cuerpo: `Aparta ${p.provisionPrestacionesMes.toLocaleString("es-CO")} al mes para prima y cesantías. Tienen fecha fija (junio, diciembre y febrero): un CDT que venza justo antes de esas fechas funciona bien.`,
    }
  }
  if (actual.n === 5) {
    return {
      tono: "verde",
      titulo: "Ya puedes invertir el excedente",
      cuerpo: "Con el colchón y las prestaciones cubiertos, el excedente puede ir a una escalera de CDTs (3 tramos con vencimientos escalonados) o a un FIC de renta fija. Compara siempre el rendimiento NETO de comisiones e impuestos.",
    }
  }
  return {
    tono: "verde",
    titulo: "Excedente estructural: reinvierte en el negocio",
    cuerpo: "Con la tesorería cubierta, el mejor retorno disponible suele estar en ingreso recurrente y producto propio, no en el mercado financiero.",
  }
}
