import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpleados } from "@/lib/empleados/queries"
import { listCuentas, listMovimientos, listInversiones } from "@/lib/empleados/contabilidad-queries"
import { listSolicitudesDeEmpleados, listAusentesHoy } from "@/lib/empleados/ausencia-queries"
import { contarFacturasPorPagar } from "@/lib/empleados/freelance-queries"
import { contarCuentasCobroPorPasar } from "@/lib/empleados/cuenta-cobro-queries"
import { promedioSatisfaccion } from "@/lib/empleados/satisfaccion-queries"
import { resumen, type Moneda } from "@/lib/empleados/contabilidad"
import type { Cuenta, Movimiento, Inversion } from "@/lib/empleados/contabilidad"
import { MESES } from "@/lib/empleados/desprendible"

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

  const [empleados, cuentas, movimientos, inversiones, ausentesHoy, facturasFreelance, cuentasCobroPorPasar, satEmpleados, satEmpresas] = await Promise.all([
    listEmpleados().catch(() => []),
    listCuentas().catch(() => [] as Cuenta[]),
    listMovimientos().catch(() => [] as Movimiento[]),
    listInversiones().catch(() => [] as Inversion[]),
    listAusentesHoy().catch(() => []),
    contarFacturasPorPagar().catch(() => 0),
    contarCuentasCobroPorPasar().catch(() => 0),
    promedioSatisfaccion("empleado").catch(() => null),
    promedioSatisfaccion("empresa").catch(() => null),
  ])

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

  // Cumpleaños próximos (30 días).
  const cumpleanos = empleados.filter((e) => e.estado === "activo" && e.fecha_nacimiento).map((e) => {
    const [, mm, dd] = e.fecha_nacimiento!.split("-").map(Number)
    const base = new Date(anio, mm - 1, dd)
    const ahora = new Date(hoy)
    if (base < new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())) base.setFullYear(anio + 1)
    const dias = Math.round((base.getTime() - Date.parse(hoy)) / 86_400_000)
    return { nombre: e.nombre, fecha: `${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`, dias }
  }).filter((c) => c.dias <= 30).sort((a, b) => a.dias - b.dias)

  return NextResponse.json({
    kpis, gananciaAnio,
    ausentesHoy, solicitudes,
    pagosPendientes, porCobrarLista,
    facturasFreelance, cuentasCobroPorPasar,
    inversionesPorVencer, cumpleanos,
    serie6m, categorias: { ingresos: arr(catIng), egresos: arr(catEgr) },
    satisfaccionEmpleados: satEmpleados, satisfaccionEmpresas: satEmpresas,
  })
}
