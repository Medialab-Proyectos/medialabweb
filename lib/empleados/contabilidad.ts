// Tipos y utilidades de contabilidad (puros, cliente y servidor).
import type { Moneda } from "./freelance"
export { formatMoneda } from "./freelance"
export type { Moneda } from "./freelance"

export type TipoMovimiento = "ingreso" | "egreso" | "traslado"
export type EstadoMovimiento = "pendiente" | "realizado"
/** IVA de un movimiento/cuenta de cobro: nacional (incluido) vs internacional (exento). */
export type TipoIVA = "na" | "incluido" | "exento"

export const IVA_LABEL: Record<TipoIVA, string> = {
  na: "Sin IVA",
  incluido: "IVA incluido (nacional)",
  exento: "Exento (internacional)",
}

export type Cuenta = {
  id: string
  nombre: string
  banco: string | null
  numero_cuenta: string | null   // número de la cuenta bancaria
  plataforma: string | null   // método de pago (Bancolombia, Payoneer, Global66…)
  moneda: Moneda
  saldo_inicial: number
  activa: boolean
  orden: number
  creado_en: string
  actualizado_en: string
}

export type Movimiento = {
  id: string
  cuenta_id: string
  cuenta_destino_id: string | null
  fecha: string
  tipo: TipoMovimiento
  categoria: string | null
  concepto: string | null
  contraparte: string | null
  empresa_id: string | null
  empleado_id: string | null    // pago de nómina vinculado a un empleado
  valor: number
  tasa: number | null           // traslado: tasa de cambio origen→destino
  costo: number                 // fee/comisión (traslado o banco); resta al neto
  valor_destino: number | null  // traslado: valor que llega al destino (moneda destino)
  iva_tipo: TipoIVA | null      // nacional (incluido) vs internacional (exento)
  iva_valor: number | null
  estado: EstadoMovimiento
  referencia: string | null
  /** Solo si está pendiente: fecha probable de pago/cobro (recordatorio del dashboard). */
  fecha_estimada?: string | null
  /** TRM real que aplicó el banco al liquidar (suele ser menor que la TRM del día). */
  tasa_real?: number | null
  /** Valor que realmente entró/salió tras costos y conversión (si difiere del esperado). */
  valor_real?: number | null
  creado_por: string | null
  creado_en: string
  actualizado_en: string
}

export type Empresa = {
  id: string
  nombre: string
  nit: string | null
  correo: string | null
  pais: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  creado_en: string
  actualizado_en: string
}

/** Países frecuentes para el selector de empresas (se puede escribir otro). */
export const PAISES = [
  "Colombia", "México", "Estados Unidos", "España", "Argentina", "Chile", "Perú",
  "Ecuador", "Panamá", "Costa Rica", "Uruguay", "Brasil", "Canadá", "Reino Unido",
]

export type ModoFacturacion = "por_hora" | "por_mes"

/** Contrato con una empresa (cliente): define cómo se le factura. */
export type ContratoEmpresa = {
  id: string
  empresa_id: string
  nombre: string | null
  modo: ModoFacturacion
  tarifa: number
  moneda: Moneda
  activo: boolean
  requiere_cuenta_cobro: boolean   // false = paga por contrato mensual, no se emite cuenta de cobro
  notas: string | null
  creado_en: string
  actualizado_en: string
}

export type MetodoPago = { id: string; nombre: string; creado_en: string }

export type EstadoInversion = "abierta" | "cerrada"

/** Inversión de la empresa (CDT, fondo, etc.). Su rendimiento cuenta como ingreso al cerrar. */
export type Inversion = {
  id: string
  entidad: string
  tipo: string | null
  monto: number
  moneda: Moneda
  tasa: number | null              // % E.A.
  rendimiento_esperado: number
  rendimiento_real: number | null
  fecha_apertura: string
  fecha_vencimiento: string | null
  cuenta_id: string | null
  estado: EstadoInversion
  notas: string | null
  creado_por: string | null
  creado_en: string
  actualizado_en: string
}

export const TIPO_MOV_LABEL: Record<TipoMovimiento, string> = {
  ingreso: "Ingreso",
  egreso: "Egreso",
  traslado: "Traslado",
}

export const CATEGORIAS = [
  "salario", "seguridad_social", "liquidacion", "honorarios", "factura_freelance", "servicio",
  "suscripcion", "dominio", "contador", "impuesto", "arriendo", "evento", "reparacion",
  "venta", "reembolso", "software", "otro",
] as const

export const CATEGORIA_LABEL: Record<string, string> = {
  salario: "Salario / nómina",
  seguridad_social: "Seguridad social",
  liquidacion: "Liquidación",
  honorarios: "Honorarios",
  factura_freelance: "Factura freelance",
  servicio: "Servicio",
  suscripcion: "Suscripción / software",
  dominio: "Dominio / hosting",
  contador: "Contador / contabilidad",
  impuesto: "Impuesto",
  arriendo: "Arriendo",
  evento: "Evento / encuentro",
  reparacion: "Reparación / mantenimiento",
  venta: "Venta / ingreso",
  reembolso: "Reembolso",
  software: "Software / herramientas",
  otro: "Otro",
}

/** Gasto recurrente del catálogo (Google, dominio, ChatGPT, Claude, Figma, contador…). */
export type GastoRecurrente = {
  id: string
  nombre: string
  categoria: string | null
  proveedor: string | null
  moneda: Moneda
  valor: number
  cuenta_id: string | null
  activo: boolean
  orden: number
  /** Día del mes en que se cobra (1–31). Null = sin fecha definida. */
  dia_cobro?: number | null
  /** Si se debita solo. Los que NO lo son requieren pago manual y se recuerdan al CEO. */
  debito_automatico?: boolean
  creado_en: string
}

const n = (x: unknown) => Number(x) || 0

/** Valor que llega al destino de un traslado (moneda destino): valor_destino si viene, si no el mismo valor. */
export function valorDestino(m: Movimiento): number {
  return m.valor_destino != null ? n(m.valor_destino) : n(m.valor)
}

/** Saldo REALIZADO actual de una cuenta (acumulado, todas las fechas). */
export function saldoCuenta(cuenta: Cuenta, movimientos: Movimiento[]): number {
  let saldo = n(cuenta.saldo_inicial)
  for (const m of movimientos) {
    if (m.estado !== "realizado") continue
    // Ingreso: lo que aterriza = valor − costo de transferencia (comisión de la plataforma).
    if (m.tipo === "ingreso" && m.cuenta_id === cuenta.id) saldo += n(m.valor) - n(m.costo)
    else if (m.tipo === "egreso" && m.cuenta_id === cuenta.id) saldo -= n(m.valor)
    else if (m.tipo === "traslado") {
      // El origen se debita en su moneda; el destino se acredita en la suya (valor_destino).
      if (m.cuenta_id === cuenta.id) saldo -= n(m.valor)
      if (m.cuenta_destino_id === cuenta.id) saldo += valorDestino(m)
    }
  }
  return saldo
}

/** Saldos agrupados por plataforma/método de pago y moneda (para el dashboard). */
export function saldosPorPlataforma(
  cuentas: Cuenta[],
  movimientos: Movimiento[],
): { plataforma: string; moneda: Moneda; saldo: number }[] {
  const map = new Map<string, { plataforma: string; moneda: Moneda; saldo: number }>()
  for (const c of cuentas) {
    const plataforma = c.plataforma || "Sin método"
    const key = `${plataforma}__${c.moneda}`
    const cur = map.get(key) ?? { plataforma, moneda: c.moneda, saldo: 0 }
    cur.saldo += saldoCuenta(c, movimientos)
    map.set(key, cur)
  }
  return [...map.values()].sort((a, b) => a.plataforma.localeCompare(b.plataforma))
}

export type ResumenMoneda = {
  saldo: number
  porCobrar: number       // ingresos pendientes
  porPagar: number        // egresos pendientes
  porTrasladar: number    // traslados pendientes
  ingresosMes: number     // ingresos realizados del mes
  egresosMes: number      // egresos realizados del mes
}

export type Resumen = {
  porCuenta: { cuenta: Cuenta; saldo: number }[]
  porMoneda: Record<Moneda, ResumenMoneda>
}

function vacio(): ResumenMoneda {
  return { saldo: 0, porCobrar: 0, porPagar: 0, porTrasladar: 0, ingresosMes: 0, egresosMes: 0 }
}

/** Resumen por cuenta y agregado por moneda. `mes` filtra ingresos/egresos del mes (1-12). */
export function resumen(
  cuentas: Cuenta[],
  movimientos: Movimiento[],
  periodo?: { anio: number; mes: number },
): Resumen {
  const monedaDe = new Map(cuentas.map((c) => [c.id, c.moneda]))
  const porMoneda: Record<Moneda, ResumenMoneda> = { COP: vacio(), USD: vacio() }

  const porCuenta = cuentas.map((c) => {
    const saldo = saldoCuenta(c, movimientos)
    const r = porMoneda[c.moneda]
    if (r) r.saldo += saldo
    return { cuenta: c, saldo }
  })

  const enPeriodo = (m: Movimiento) =>
    !periodo || (Number(m.fecha.slice(0, 4)) === periodo.anio && Number(m.fecha.slice(5, 7)) === periodo.mes)

  for (const m of movimientos) {
    const moneda = monedaDe.get(m.cuenta_id)
    if (!moneda) continue
    const r = porMoneda[moneda]
    if (!r) continue
    if (m.estado === "pendiente") {
      if (m.tipo === "ingreso") r.porCobrar += n(m.valor)
      else if (m.tipo === "egreso") r.porPagar += n(m.valor)
      else r.porTrasladar += n(m.valor)
    } else if (enPeriodo(m)) {
      if (m.tipo === "ingreso") r.ingresosMes += n(m.valor) - n(m.costo)
      else if (m.tipo === "egreso") r.egresosMes += n(m.valor)
    }
  }

  return { porCuenta, porMoneda }
}

export const MONEDAS_ORDEN: Moneda[] = ["COP", "USD"]
