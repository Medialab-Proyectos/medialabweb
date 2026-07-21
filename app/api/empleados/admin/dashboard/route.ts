import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpleados } from "@/lib/empleados/queries"
import { listCuentas, listMovimientos, listInversiones, listGastosRecurrentes } from "@/lib/empleados/contabilidad-queries"
import { listSolicitudesDeEmpleados, listAusentesHoy } from "@/lib/empleados/ausencia-queries"
import { contarFacturasPorPagar } from "@/lib/empleados/freelance-queries"
import { contarCuentasCobroPorPasar } from "@/lib/empleados/cuenta-cobro-queries"
import { promedioSatisfaccion } from "@/lib/empleados/satisfaccion-queries"
import { contarHorariosPendientes } from "@/lib/empleados/horario-queries"
import { listFechasEspeciales } from "@/lib/empleados/fechas-queries"
import { getSatisfaccionOperaciones } from "@/lib/empleados/operaciones"
import { resumen, type Moneda } from "@/lib/empleados/contabilidad"
import type { Cuenta, Movimiento, Inversion } from "@/lib/empleados/contabilidad"
import { MESES } from "@/lib/empleados/desprendible"
import { diasHastaHorizonteHabil } from "@/lib/empleados/festivos-co"

export const runtime = "nodejs"

const hoyBogota = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })

/** Datos del panel de decisiones del CEO (todo en una sola llamada). Nunca falla por tabla faltante. */
export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s || s.rol !== "ceo") return NextResponse.json({ error: "No autorizado." }, { status: 403 })

  const hoy = hoyBogota()
  const anio = Number(hoy.slice(0, 4))
  const mes = Number(hoy.slice(5, 7))

  const [empleados, cuentas, movimientos, inversiones, ausentesHoy, facturasFreelance, cuentasCobroPorPasar, satEmpleados, satEmpresas, horariosPendientes] = await Promise.all([
    listEmpleados().catch(() => []),
    listCuentas().catch(() => [] as Cuenta[]),
    listMovimientos().catch(() => [] as Movimiento[]),
    listInversiones().catch(() => [] as Inversion[]),
    listAusentesHoy().catch(() => []),
    contarFacturasPorPagar().catch(() => 0),
    contarCuentasCobroPorPasar().catch(() => 0),
    promedioSatisfaccion("empleado").catch(() => null),
    promedioSatisfaccion("empresa").catch(() => null),
    contarHorariosPendientes().catch(() => 0),
  ])
  const opsSat = await getSatisfaccionOperaciones().catch(() => ({ promedio100: null, validadoEn: null }))
  const satisfaccionProyectos = opsSat.promedio100
  const satisfaccionProyectosFecha = opsSat.validadoEn ?? null
  const fechasRaw = await listFechasEspeciales().catch(() => [])
  // Servicios recurrentes que NO se debitan solos: hay que pagarlos a mano cada mes.
  const recurrentesRaw = await listGastosRecurrentes().catch(() => [])
  const recurrentesManuales = recurrentesRaw
    .filter((g) => g.activo && g.debito_automatico !== true)
    .map((g) => ({ id: g.id, nombre: g.nombre, valor: Number(g.valor) || 0, moneda: g.moneda as Moneda, dia: g.dia_cobro ?? null }))
    .sort((a, b) => (a.dia ?? 99) - (b.dia ?? 99))

  // ── Recordatorio de NÓMINA ────────────────────────────────────────────────
  // Aparece en "Cuentas por pagar" los últimos 5 días del mes y desaparece cuando ya
  // existe un egreso de nómina realizado en el mes (es decir, cuando se pagó).
  const ultimoDiaMes = new Date(anio, mes, 0).getDate()
  const diaHoy = Number(hoy.slice(8, 10))
  const diasParaFinDeMes = ultimoDiaMes - diaHoy
  const nominaPagada = movimientos.some(
    (m) => m.tipo === "egreso" && m.estado === "realizado" && (m.categoria === "nomina" || /n[oó]mina/i.test(m.concepto ?? "")) &&
      Number(m.fecha.slice(0, 4)) === anio && Number(m.fecha.slice(5, 7)) === mes,
  )
  const laborales = empleados.filter((e) => e.estado === "activo" && e.tipo_vinculacion === "empleado")
  const nominaPendiente = !nominaPagada && diasParaFinDeMes <= 5 && laborales.length > 0
    ? { empleados: laborales.length, dias: Math.max(0, diasParaFinDeMes), mes: MESES[mes - 1] }
    : null

  // Solicitudes de ausencia pendientes (de todos, para aprobar en línea).
  let solicitudes: { id: string; nombre: string; tipo: string; fecha_inicio: string; fecha_fin: string; dias_habiles: number }[] = []
  try {
    const ids = empleados.filter((e) => e.id !== s.sub).map((e) => e.id)
    const raw = ids.length ? await listSolicitudesDeEmpleados(ids, true) : []
    solicitudes = raw.map((r) => ({ id: r.id, nombre: r.empleado?.nombre ?? "—", tipo: r.tipo, fecha_inicio: r.fecha_inicio, fecha_fin: r.fecha_fin, dias_habiles: Number(r.dias_habiles) || 0 }))
  } catch { solicitudes = [] }

  // ── Contabilidad: KPIs, serie 6 meses y categorías (COP) ──
  const r = resumen(cuentas, movimientos, { anio, mes })
  const kpis = {
    saldoCOP: r.porMoneda.COP.saldo, saldoUSD: r.porMoneda.USD.saldo,
    ingresosMes: r.porMoneda.COP.ingresosMes, egresosMes: r.porMoneda.COP.egresosMes,
    porCobrar: r.porMoneda.COP.porCobrar, porPagar: r.porMoneda.COP.porPagar,
  }
  const monedaDe = new Map(cuentas.map((c) => [c.id, c.moneda]))

  // Serie últimos 6 meses (COP).
  const meses: { anio: number; mes: number; label: string }[] = []
  for (let i = 5; i >= 0; i--) { const d = new Date(anio, mes - 1 - i, 1); meses.push({ anio: d.getFullYear(), mes: d.getMonth() + 1, label: MESES[d.getMonth()].slice(0, 3) }) }
  const serie6m = meses.map((m) => ({ label: m.label, ingresos: 0, egresos: 0 }))
  const catIng = new Map<string, number>(); const catEgr = new Map<string, number>()
  let gananciaAnio = 0
  for (const m of movimientos) {
    if (m.estado !== "realizado" || m.tipo === "traslado") continue
    if (monedaDe.get(m.cuenta_id) !== "COP") continue
    const y = Number(m.fecha.slice(0, 4)); const mo = Number(m.fecha.slice(5, 7))
    const valor = Number(m.valor) || 0; const costo = Number(m.costo) || 0
    const idx = meses.findIndex((x) => x.anio === y && x.mes === mo)
    if (idx >= 0) { if (m.tipo === "ingreso") serie6m[idx].ingresos += valor - costo; else serie6m[idx].egresos += valor }
    if (y === anio) {
      const cat = m.categoria || "otro"
      if (m.tipo === "ingreso") { catIng.set(cat, (catIng.get(cat) ?? 0) + (valor - costo)); gananciaAnio += valor - costo }
      else { catEgr.set(cat, (catEgr.get(cat) ?? 0) + valor); gananciaAnio -= valor }
    }
  }
  const arr = (mp: Map<string, number>) => [...mp.entries()].map(([cat, valor]) => ({ cat, valor })).sort((a, b) => b.valor - a.valor)

  // Pagos pendientes (egresos) y cuentas por cobrar (ingresos) — con detalle para acción rápida.
  const nombreCuenta = new Map(cuentas.map((c) => [c.id, c.nombre]))
  const pagosPendientes = movimientos.filter((m) => m.estado === "pendiente" && m.tipo === "egreso")
    .map((m) => ({ id: m.id, concepto: m.concepto || m.categoria || "Egreso", contraparte: m.contraparte, valor: Number(m.valor) || 0, moneda: (monedaDe.get(m.cuenta_id) ?? "COP") as Moneda, fecha: m.fecha, cuenta: nombreCuenta.get(m.cuenta_id) ?? "" }))
  const porCobrarLista = movimientos.filter((m) => m.estado === "pendiente" && m.tipo === "ingreso")
    .map((m) => ({ id: m.id, concepto: m.concepto || m.categoria || "Ingreso", contraparte: m.contraparte, valor: Number(m.valor) || 0, moneda: (monedaDe.get(m.cuenta_id) ?? "COP") as Moneda, fecha: m.fecha, cuenta: nombreCuenta.get(m.cuenta_id) ?? "" }))

  // Inversiones por vencer (≤ 30 días).
  const inversionesPorVencer = inversiones.filter((i) => i.estado === "abierta" && i.fecha_vencimiento)
    .map((i) => ({ id: i.id, entidad: i.entidad, monto: Number(i.monto) || 0, moneda: i.moneda, fecha: i.fecha_vencimiento!, dias: Math.ceil((Date.parse(i.fecha_vencimiento!) - Date.now()) / 86_400_000) }))
    .filter((i) => i.dias <= 30).sort((a, b) => a.dias - b.dias)

  // Ventana de "Próximas fechas": los 3 días HÁBILES siguientes según el calendario
  // colombiano (salta fines de semana y festivos), no 30 días corridos.
  const VENTANA = diasHastaHorizonteHabil(hoy, 3)

  // Días hasta la próxima ocurrencia anual de un mes-día (para cumpleaños/aniversarios/recurrentes).
  const ahoraD = new Date(hoy)
  const diasHastaMMDD = (mm: number, dd: number) => {
    const base = new Date(anio, mm - 1, dd)
    if (base < new Date(ahoraD.getFullYear(), ahoraD.getMonth(), ahoraD.getDate())) base.setFullYear(anio + 1)
    return { base, dias: Math.round((base.getTime() - Date.parse(hoy)) / 86_400_000) }
  }

  // Cumpleaños próximos (30 días).
  const cumpleanos = empleados.filter((e) => e.estado === "activo" && e.fecha_nacimiento).map((e) => {
    const [, mm, dd] = e.fecha_nacimiento!.split("-").map(Number)
    const { base, dias } = diasHastaMMDD(mm, dd)
    return { nombre: e.nombre, fecha: `${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`, dias }
  }).filter((c) => c.dias <= VENTANA).sort((a, b) => a.dias - b.dias)

  // Aniversarios de ingreso próximos (30 días) — con los años que cumple en la empresa.
  const aniversarios = empleados.filter((e) => e.estado === "activo" && e.fecha_ingreso).map((e) => {
    const [yy, mm, dd] = e.fecha_ingreso!.split("-").map(Number)
    const { base, dias } = diasHastaMMDD(mm, dd)
    return { nombre: e.nombre, fecha: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`, anos: base.getFullYear() - yy, dias }
  }).filter((a) => a.dias <= VENTANA && a.anos >= 1).sort((a, b) => a.dias - b.dias)

  // Fechas especiales de Talento Humano (recurrentes anuales o puntuales), próximas 30 días.
  const fechasEspeciales = fechasRaw.map((f) => {
    const [yy, mm, dd] = f.fecha.split("-").map(Number)
    if (f.recurrente) {
      const { base, dias } = diasHastaMMDD(mm, dd)
      return { id: f.id, titulo: f.titulo, nota: f.nota, fecha: `${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`, dias, recurrente: true }
    }
    const base = new Date(yy, mm - 1, dd)
    const dias = Math.round((base.getTime() - Date.parse(hoy)) / 86_400_000)
    return { id: f.id, titulo: f.titulo, nota: f.nota, fecha: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`, dias, recurrente: false }
  }).filter((f) => f.dias >= 0 && f.dias <= VENTANA).sort((a, b) => a.dias - b.dias)

  return NextResponse.json({
    kpis, gananciaAnio,
    ausentesHoy, solicitudes,
    pagosPendientes, porCobrarLista,
    facturasFreelance, cuentasCobroPorPasar, horariosPendientes,
    inversionesPorVencer, cumpleanos, aniversarios, fechasEspeciales, recurrentesManuales, nominaPendiente,
    serie6m, categorias: { ingresos: arr(catIng), egresos: arr(catEgr) },
    satisfaccionEmpleados: satEmpleados, satisfaccionEmpresas: satEmpresas, satisfaccionProyectos, satisfaccionProyectosFecha,
  })
}
