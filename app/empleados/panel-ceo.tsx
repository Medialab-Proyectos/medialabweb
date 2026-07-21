"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Loader2, Check, X, Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, ClipboardCheck,
  Receipt, Cake, UserX, CalendarClock, ArrowRight, SmilePlus, Building2, Repeat, FileText,
  Users, LayoutDashboard, ExternalLink, Award, Star, Plus, Trash2, ChevronDown, Loader2 as Spin,
} from "lucide-react"
import { formatMoneda } from "@/lib/empleados/contabilidad"
import { ActividadWidget } from "./admin/actividad-widget"

type MoneyMov = { id: string; concepto: string; contraparte: string | null; valor: number; moneda: "COP" | "USD"; fecha: string; cuenta: string }
type Solicitud = { id: string; nombre: string; tipo: string; fecha_inicio: string; fecha_fin: string; dias_habiles: number }
type Data = {
  kpis: { saldoCOP: number; saldoUSD: number; ingresosMes: number; egresosMes: number; porCobrar: number; porPagar: number }
  gananciaAnio: number
  ausentesHoy: { nombre: string; tipo: string }[]
  solicitudes: Solicitud[]
  pagosPendientes: MoneyMov[]
  porCobrarLista: MoneyMov[]
  facturasFreelance: number
  cuentasCobroPorPasar: number
  horariosPendientes: number
  inversionesPorVencer: { id: string; entidad: string; monto: number; moneda: "COP" | "USD"; fecha: string; dias: number }[]
  cumpleanos: { nombre: string; fecha: string; dias: number }[]
  aniversarios: { nombre: string; fecha: string; anos: number; dias: number }[]
  fechasEspeciales: { id: string; titulo: string; nota: string | null; fecha: string; dias: number; recurrente: boolean }[]
  /** Servicios recurrentes que NO se debitan solos: recordatorio de pago manual. */
  recurrentesManuales: { id: string; nombre: string; valor: number; moneda: "COP" | "USD"; dia: number | null }[]
  /** Recordatorio de nómina: solo los últimos días del mes y si aún no se ha pagado. */
  nominaPendiente: { empleados: number; dias: number; mes: string } | null
  serie6m: { label: string; ingresos: number; egresos: number }[]
  categorias: { ingresos: { cat: string; valor: number }[]; egresos: { cat: string; valor: number }[] }
  satisfaccionEmpleados: number | null
  satisfaccionEmpresas: number | null
  satisfaccionProyectos: number | null
  satisfaccionProyectosFecha: string | null
}

const TIPO_AUS: Record<string, string> = {
  vacaciones: "Vacaciones", adelanto_vacaciones: "Adelanto vac.", permiso: "Permiso",
  licencia: "Licencia", incapacidad: "Incapacidad", medio_dia: "Media jornada",
}
const cop = (n: number) => formatMoneda(n, "COP")
const fechaCorta = (iso: string) => { const [, m, d] = iso.split("-"); return `${d}/${m}` }

export function PanelCEO() {
  const [d, setD] = useState<Data | null>(null)
  const [cargando, setCargando] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  // Acordeón de pendientes: solo un elemento desplegado a la vez (en ambas listas).
  const [itemAbierto, setItemAbierto] = useState<string | null>(null)
  // Gestión de fechas especiales (Talento Humano / CEO).
  const [fechaForm, setFechaForm] = useState({ titulo: "", fecha: "", recurrente: true, nota: "" })
  const [fechaAbierto, setFechaAbierto] = useState(false)
  const [fechaBusy, setFechaBusy] = useState(false)
  const [fechaError, setFechaError] = useState("")
  // Lista COMPLETA de fechas especiales (todas, no solo las próximas 30 días) para ver/editar.
  const [todasFechas, setTodasFechas] = useState<{ id: string; titulo: string; fecha: string; recurrente: boolean; nota: string | null }[]>([])

  async function cargarTodasFechas() {
    try {
      const r = await fetch("/api/empleados/fechas")
      const data = await r.json()
      if (r.ok) setTodasFechas(data.fechas ?? [])
    } catch { /* noop */ }
  }
  function toggleGestorFechas() {
    setFechaError("")
    setFechaAbierto((v) => {
      if (!v) cargarTodasFechas()
      return !v
    })
  }

  async function cargar() {
    try {
      const r = await fetch("/api/empleados/admin/dashboard")
      if (r.ok) setD(await r.json())
    } finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  async function crearFecha() {
    if (!fechaForm.titulo.trim() || !fechaForm.fecha) { setFechaError("Indica título y fecha."); return }
    setFechaBusy(true); setFechaError("")
    try {
      const r = await fetch("/api/empleados/fechas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fechaForm) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setFechaForm({ titulo: "", fecha: "", recurrente: true, nota: "" })
      await Promise.all([cargar(), cargarTodasFechas()])
    } catch (e) { setFechaError(e instanceof Error ? e.message : "Error al guardar.") }
    finally { setFechaBusy(false) }
  }

  async function eliminarFecha(id: string) {
    setBusy(id)
    try {
      const r = await fetch(`/api/empleados/fechas?id=${id}`, { method: "DELETE" })
      if (r.ok) {
        setD((p) => p ? { ...p, fechasEspeciales: p.fechasEspeciales.filter((f) => f.id !== id) } : p)
        setTodasFechas((prev) => prev.filter((f) => f.id !== id))
      }
    } finally { setBusy(null) }
  }

  async function decidirAusencia(id: string, estado: "aprobada" | "rechazada") {
    setBusy(id)
    try {
      const r = await fetch(`/api/empleados/ausencias/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) })
      if (r.ok) setD((p) => p ? { ...p, solicitudes: p.solicitudes.filter((s) => s.id !== id) } : p)
    } finally { setBusy(null) }
  }

  async function marcarPago(id: string, lista: "pagosPendientes" | "porCobrarLista") {
    setBusy(id)
    try {
      const r = await fetch("/api/empleados/admin/contabilidad/movimientos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, estado: "realizado" }) })
      if (r.ok) setD((p) => {
        if (!p) return p
        const item = p[lista].find((x) => x.id === id)
        const nextKpis = { ...p.kpis }
        if (item && item.moneda === "COP") { if (lista === "pagosPendientes") nextKpis.porPagar -= item.valor; else nextKpis.porCobrar -= item.valor }
        return { ...p, kpis: nextKpis, [lista]: p[lista].filter((x) => x.id !== id) }
      })
    } finally { setBusy(null) }
  }

  if (cargando) return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-sm text-[#fff]/55">
      <Loader2 size={16} className="animate-spin" /> Cargando tu panel…
    </div>
  )
  if (!d) return null


  return (
    <div className="flex flex-col gap-7">
      {/* ══ PERSONAS: quién está ahora + qué viene ══ */}
      <Grupo icon={Users} titulo="Personas">
        <ActividadWidget />
        {/* Agenda: ausentes hoy + cumpleaños + aniversarios + fechas de Talento Humano */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><CalendarClock size={15} className="text-[var(--cyan)]" /> Próximas fechas <span className="font-normal text-[#fff]/40">· 3 días hábiles</span></h3>
            <button onClick={toggleGestorFechas} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] font-semibold text-[#fff]/70 hover:bg-white/5" title="Ver / agregar fechas especiales">
              <Plus size={12} /> {fechaAbierto ? "Cerrar" : "Fechas"}
            </button>
          </div>

          {fechaAbierto && (
            <div className="mb-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input value={fechaForm.titulo} onChange={(e) => setFechaForm((f) => ({ ...f, titulo: e.target.value }))} placeholder="Título (ej: Cierre contable, Capacitación…)" className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60 sm:col-span-2" />
                <input type="date" value={fechaForm.fecha} onChange={(e) => setFechaForm((f) => ({ ...f, fecha: e.target.value }))} className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60" />
                <label className="flex items-center gap-2 text-xs text-[#fff]/70">
                  <input type="checkbox" checked={fechaForm.recurrente} onChange={(e) => setFechaForm((f) => ({ ...f, recurrente: e.target.checked }))} className="h-4 w-4 accent-[var(--cyan)]" />
                  Se repite cada año
                </label>
                <input value={fechaForm.nota} onChange={(e) => setFechaForm((f) => ({ ...f, nota: e.target.value }))} placeholder="Nota (opcional)" className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm text-[#fff] outline-none focus:border-[var(--cyan)]/60 sm:col-span-2" />
              </div>
              {fechaError && <p className="mt-2 text-xs text-red-300">{fechaError}</p>}
              <div className="mt-2 flex gap-2">
                <button onClick={crearFecha} disabled={fechaBusy} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cyan)] px-3 py-1.5 text-xs font-semibold text-[#04191b] hover:brightness-110 disabled:opacity-50">
                  {fechaBusy ? <Spin size={12} className="animate-spin" /> : <Check size={12} />} Agregar
                </button>
                <button onClick={() => setFechaAbierto(false)} className="rounded-lg px-3 py-1.5 text-xs text-[#fff]/60 hover:text-[#fff]">Cerrar</button>
              </div>

              {/* Todas las fechas registradas (no solo las próximas) — ver / eliminar */}
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#fff]/40">Fechas registradas ({todasFechas.length})</p>
                {todasFechas.length === 0 ? (
                  <p className="text-xs text-[#fff]/40">Aún no has agregado fechas.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {todasFechas.map((f) => (
                      <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-[#fff]/85">{f.titulo}</p>
                          <p className="truncate text-[11px] text-[#fff]/45">{fechaCorta(f.fecha)}{f.recurrente ? " · cada año" : ""}{f.nota ? ` · ${f.nota}` : ""}</p>
                        </div>
                        <button onClick={() => eliminarFecha(f.id)} disabled={busy === f.id} className="shrink-0 rounded-md p-1 text-[#fff]/35 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40" title="Eliminar">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {d.ausentesHoy.map((a, i) => (
              <Fila key={`aus-${i}`} icon={UserX} color="#fbbf24" titulo={a.nombre} detalle={`Ausente hoy · ${TIPO_AUS[a.tipo] ?? a.tipo}`} etiqueta="Hoy" ampliado={`${a.nombre} está ausente hoy por ${TIPO_AUS[a.tipo] ?? a.tipo}. Ténlo en cuenta para asignaciones y entregas del día.`} />
            ))}
            {d.fechasEspeciales.map((f) => (
              <Fila
                key={`fe-${f.id}`} icon={Star} color="#22d3ee" titulo={f.titulo}
                detalle={`${f.nota ? f.nota + " · " : ""}${f.fecha}${f.recurrente ? " · anual" : ""}`}
                etiqueta={f.dias === 0 ? "Hoy" : `${f.dias}d`}
                ampliado={`${f.nota ? `${f.nota}\n` : ""}Fecha: ${f.fecha}. ${f.recurrente ? "Se repite cada año." : "Fecha puntual (no se repite)."} ${f.dias === 0 ? "Es hoy." : `Faltan ${f.dias} día(s).`}`}
                onDelete={() => eliminarFecha(f.id)} borrando={busy === f.id}
              />
            ))}
            {d.aniversarios.slice(0, 4).map((a, i) => (
              <Fila
                key={`ani-${i}`} icon={Award} color="#a78bfa" titulo={a.nombre}
                detalle={`Aniversario · ${a.anos} ${a.anos === 1 ? "año" : "años"} · ${a.fecha}`}
                etiqueta={a.dias === 0 ? "Hoy" : `${a.dias}d`}
                ampliado={`${a.nombre} cumple ${a.anos} ${a.anos === 1 ? "año" : "años"} en MediaLab el ${a.fecha}. Buen momento para reconocer su trayectoria en el equipo.`}
              />
            ))}
            {d.cumpleanos.slice(0, 4).map((c, i) => (
              <Fila
                key={`cum-${i}`} icon={Cake} color="#E8751A" titulo={c.nombre}
                detalle={`Cumpleaños · ${c.fecha}`}
                etiqueta={c.dias === 0 ? "Hoy" : `${c.dias}d`}
                ampliado={`${c.nombre} cumple años el ${c.fecha}. Recuerda que tiene derecho a media jornada de cumpleaños como beneficio.`}
              />
            ))}
            {d.ausentesHoy.length === 0 && d.cumpleanos.length === 0 && d.aniversarios.length === 0 && d.fechasEspeciales.length === 0 && <Vacio texto="Sin eventos en los próximos 3 días hábiles." />}
          </div>
        </div>
      </Grupo>

      {/* ══ SOLICITUDES Y APROBACIONES ══ */}
      <Grupo icon={ClipboardCheck} titulo="Solicitudes y aprobaciones">
        <div className="grid gap-4 lg:grid-cols-2">
        {/* Solicitudes por aprobar (acción en línea) */}
        <Bloque icon={ClipboardCheck} titulo="Solicitudes por aprobar" contador={d.solicitudes.length} tone="magenta" href="/empleados/aprobaciones">
          {d.solicitudes.length === 0 ? (
            <Vacio texto="Sin solicitudes pendientes." />
          ) : d.solicitudes.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.nombre}</p>
                <p className="text-[11px] text-[#fff]/50">{TIPO_AUS[s.tipo] ?? s.tipo} · {fechaCorta(s.fecha_inicio)}–{fechaCorta(s.fecha_fin)} · {s.dias_habiles}d</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button disabled={busy === s.id} onClick={() => decidirAusencia(s.id, "aprobada")} title="Aprobar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300 transition hover:bg-emerald-400/25 disabled:opacity-50">{busy === s.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}</button>
                <button disabled={busy === s.id} onClick={() => decidirAusencia(s.id, "rechazada")} title="Rechazar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"><X size={15} /></button>
              </div>
            </div>
          ))}
        </Bloque>

        {/* Calendario/horarios por aprobar + otras aprobaciones */}
        <Bloque icon={CalendarClock} titulo="Calendario por aprobar" contador={d.horariosPendientes} tone="cyan" href="/empleados/aprobaciones">
          <MiniAccion icon={CalendarClock} label="Horarios pendientes de aprobar" valor={d.horariosPendientes} href="/empleados/aprobaciones" />
          <MiniAccion icon={ClipboardCheck} label="Ausencias, horas extra y cesantías" valor={d.solicitudes.length} href="/empleados/aprobaciones" />
        </Bloque>
        </div>
      </Grupo>

      {/* ══ ECONOMÍA ══ (solo lo accionable: qué debo pagar y qué debo cobrar) */}
      <Grupo icon={Wallet} titulo="Economía">
        <div className="grid gap-4 md:grid-cols-2">
        {/* Cuentas por pagar (marcar pagado en línea) */}
        <Bloque icon={ArrowUpCircle} titulo="Cuentas por pagar" contador={d.pagosPendientes.length + (d.nominaPendiente ? 1 : 0) + d.recurrentesManuales.length + (d.facturasFreelance > 0 ? 1 : 0)} tone="red" href="/empleados/admin/contabilidad">
          {d.pagosPendientes.length === 0 && !d.nominaPendiente && d.recurrentesManuales.length === 0 && d.facturasFreelance === 0 ? (
            <Vacio texto="Nada pendiente por pagar." />
          ) : (
            <ListaScroll>
              {/* Nómina del mes: aparece al acercarse fin de mes y sale sola al registrar el pago. */}
              {d.nominaPendiente && (
                <ItemPendiente
                  abierto={itemAbierto === "nomina"} onToggle={() => setItemAbierto(itemAbierto === "nomina" ? null : "nomina")}
                  icon={Users} iconColor="#f87171"
                  titulo={`Nómina de ${d.nominaPendiente.mes}`}
                  subtitulo={`${d.nominaPendiente.empleados} empleado(s) · ${d.nominaPendiente.dias === 0 ? "el mes termina hoy" : `faltan ${d.nominaPendiente.dias} día(s)`}`}
                  detalle={`Pago de nómina de ${d.nominaPendiente.mes} a ${d.nominaPendiente.empleados} empleado(s) laborales.\n${d.nominaPendiente.dias === 0 ? "El mes termina hoy." : `Faltan ${d.nominaPendiente.dias} día(s) para fin de mes.`}\nRegistra el pago en «Pagos a empleados» para quitarlo de esta lista.`}
                  accion={<Link href="/empleados/admin/contabilidad/nomina" onClick={(e) => e.stopPropagation()} className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-red-400/15 px-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/25">Pagar</Link>}
                />
              )}

              {/* Movimientos pendientes de egreso. */}
              {d.pagosPendientes.map((m) => (
                <ItemPendiente
                  key={m.id}
                  abierto={itemAbierto === m.id} onToggle={() => setItemAbierto(itemAbierto === m.id ? null : m.id)}
                  titulo={m.concepto}
                  subtitulo={`${m.contraparte ? `${m.contraparte} · ` : ""}${m.cuenta} · ${fechaCorta(m.fecha)}`}
                  valor={formatMoneda(m.valor, m.moneda)} valorClase="text-red-300"
                  detalle={`Concepto: ${m.concepto}\nContraparte: ${m.contraparte || "—"}\nCuenta: ${m.cuenta}\nFecha: ${m.fecha}\nValor: ${formatMoneda(m.valor, m.moneda)}`}
                  accion={
                    <button disabled={busy === m.id} onClick={(e) => { e.stopPropagation(); marcarPago(m.id, "pagosPendientes") }} title="Marcar pagado" className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-emerald-400/15 px-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/25 disabled:opacity-50">
                      {busy === m.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Pagué
                    </button>
                  }
                />
              ))}

              {/* Recurrentes de pago manual (no son débito automático). */}
              {d.recurrentesManuales.map((g) => (
                <ItemPendiente
                  key={g.id}
                  abierto={itemAbierto === g.id} onToggle={() => setItemAbierto(itemAbierto === g.id ? null : g.id)}
                  icon={Repeat} iconColor="#fbbf24"
                  titulo={g.nombre}
                  subtitulo={`Recurrente · ${g.dia ? `se cobra el día ${g.dia}` : "sin día"} · pago manual`}
                  valor={formatMoneda(g.valor, g.moneda)} valorClase="text-amber-200/90"
                  detalle={`Servicio recurrente de pago MANUAL (no se debita solo).\n${g.dia ? `Se cobra el día ${g.dia} de cada mes.` : "Sin día de cobro definido."}\nValor: ${formatMoneda(g.valor, g.moneda)}\nRegistra el pago en «Gastos recurrentes» cada mes.`}
                  accion={<Link href="/empleados/admin/contabilidad/recurrentes" onClick={(e) => e.stopPropagation()} className="flex h-8 shrink-0 items-center rounded-lg bg-amber-400/15 px-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/25">Ver</Link>}
                />
              ))}

              {/* Facturas de freelance por pagar. */}
              {d.facturasFreelance > 0 && (
                <ItemPendiente
                  abierto={itemAbierto === "freelance"} onToggle={() => setItemAbierto(itemAbierto === "freelance" ? null : "freelance")}
                  icon={Receipt} iconColor="var(--cyan)"
                  titulo="Facturas de freelance por pagar"
                  subtitulo={`${d.facturasFreelance} factura(s) pendiente(s)`}
                  detalle={`${d.facturasFreelance} factura(s) de freelance/prestación por pagar.\nRecuerda: se pagan dentro de los 5 primeros días del mes.\nRevisa y márcalas pagadas en «Freelance».`}
                  accion={<Link href="/empleados/admin/freelance" onClick={(e) => e.stopPropagation()} className="flex h-8 shrink-0 items-center rounded-lg bg-[var(--cyan)]/15 px-2 text-xs font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/25">Ver</Link>}
                />
              )}
            </ListaScroll>
          )}
        </Bloque>

        {/* Cuentas por cobrar (marcar recibido) */}
        <Bloque icon={ArrowDownCircle} titulo="Cuentas por cobrar" contador={d.porCobrarLista.length + (d.cuentasCobroPorPasar > 0 ? 1 : 0)} tone="emerald" href="/empleados/admin/contabilidad">
          {d.porCobrarLista.length === 0 && d.cuentasCobroPorPasar === 0 ? (
            <Vacio texto="Sin ingresos por confirmar." />
          ) : (
            <ListaScroll>
              {/* Cuentas de cobro por enviar (recurrentes a fin de mes mientras el contrato siga vigente). */}
              {d.cuentasCobroPorPasar > 0 && (
                <ItemPendiente
                  abierto={itemAbierto === "cxc"} onToggle={() => setItemAbierto(itemAbierto === "cxc" ? null : "cxc")}
                  icon={FileText} iconColor="var(--cyan)"
                  titulo="Cuentas de cobro por enviar"
                  subtitulo={`${d.cuentasCobroPorPasar} por emitir este mes`}
                  detalle={"Las cuentas de cobro se envían al final de cada mes y se repiten mientras el contrato con la empresa siga vigente.\nRevisa cuáles quedan por emitir este mes en «Cuentas de cobro»."}
                  accion={<Link href="/empleados/admin/cuentas-cobro" onClick={(e) => e.stopPropagation()} className="flex h-8 shrink-0 items-center rounded-lg bg-[var(--cyan)]/15 px-2 text-xs font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/25">Emitir</Link>}
                />
              )}

              {/* Ingresos pendientes de confirmar. */}
              {d.porCobrarLista.map((m) => (
                <ItemPendiente
                  key={m.id}
                  abierto={itemAbierto === m.id} onToggle={() => setItemAbierto(itemAbierto === m.id ? null : m.id)}
                  titulo={m.concepto}
                  subtitulo={`${m.contraparte ? `${m.contraparte} · ` : ""}${m.cuenta} · ${fechaCorta(m.fecha)}`}
                  valor={formatMoneda(m.valor, m.moneda)} valorClase="text-emerald-300"
                  detalle={`Concepto: ${m.concepto}\nContraparte: ${m.contraparte || "—"}\nCuenta: ${m.cuenta}\nFecha: ${m.fecha}\nValor: ${formatMoneda(m.valor, m.moneda)}`}
                  accion={
                    <button disabled={busy === m.id} onClick={(e) => { e.stopPropagation(); marcarPago(m.id, "porCobrarLista") }} title="Marcar recibido" className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[var(--cyan)]/15 px-2 text-xs font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/25 disabled:opacity-50">
                      {busy === m.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Llegó
                    </button>
                  }
                />
              ))}
            </ListaScroll>
          )}
        </Bloque>
      </div>

      </Grupo>

      {/* ══ SATISFACCIÓN (y el Centro de Operaciones, donde vive la de proyectos) ══ */}
      <Grupo icon={SmilePlus} titulo="Satisfacción">
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          <Link href="/empleados/admin/satisfaccion" className="block h-full transition hover:brightness-110"><Satisfaccion icon={SmilePlus} titulo="Satisfacción de empleados" valor={d.satisfaccionEmpleados} nota="Toca para ver respuestas o enviar la encuesta." /></Link>
          <a href="https://uxia-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="block h-full transition hover:brightness-110"><Satisfaccion icon={Building2} titulo="Satisfacción empresarial" valor={d.satisfaccionProyectos} nota={d.satisfaccionProyectosFecha ? `Satisfacción de proyectos, en vivo desde Operaciones · validado el ${d.satisfaccionProyectosFecha}` : "Promedio de satisfacción de los proyectos, en vivo desde el Centro de Operaciones."} /></a>
        </div>
        {/* La satisfacción empresarial y el estado de todos los proyectos viven en el Centro de Operaciones. */}
        <a href="https://uxia-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.06] px-5 py-4 transition hover:bg-[var(--cyan)]/[0.1]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cyan)]/15"><LayoutDashboard size={18} className="text-[var(--cyan)]" /></span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Centro de Operaciones</p>
              <p className="text-xs text-[#fff]/55">Satisfacción empresarial y estado de todos los proyectos. Se abre en otra pestaña.</p>
            </div>
          </div>
          <ExternalLink size={16} className="shrink-0 text-[var(--cyan)]" />
        </a>
      </Grupo>
    </div>
  )
}

/** Grupo del dashboard: agrupa paneles relacionados bajo un título. */
function Grupo({ icon: Icon, titulo, children }: { icon: React.ElementType; titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#fff]/45">
        <Icon size={14} className="text-[#fff]/40" /> {titulo}
      </h2>
      {children}
    </section>
  )
}

const TONE: Record<string, string> = {
  cyan: "text-[var(--cyan)]", emerald: "text-emerald-300", red: "text-red-300", magenta: "text-[var(--magenta)]", amber: "text-amber-300",
}

/**
 * Lista con altura máxima de ~5 elementos; el resto se ve con scroll. Los pendientes
 * siguen visibles hasta que se cumplen (no se recortan de la lista).
 */
function ListaScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-h-[19rem] flex-col gap-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
      {children}
    </div>
  )
}

/**
 * Elemento de pendiente: máximo 2 líneas (título + subtítulo) y se despliega para ver
 * el detalle completo. El acordeón lo controla el padre, así solo hay uno abierto.
 */
function ItemPendiente({ abierto, onToggle, icon: Icon, iconColor, titulo, subtitulo, valor, valorClase = "text-[#fff]/80", detalle, accion }: {
  abierto: boolean; onToggle: () => void; icon?: React.ElementType; iconColor?: string
  titulo: string; subtitulo: string; valor?: string; valorClase?: string; detalle: string; accion?: React.ReactNode
}) {
  return (
    <div className="shrink-0 rounded-xl bg-white/[0.03]">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button onClick={onToggle} aria-expanded={abierto} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          {Icon && <Icon size={15} className="shrink-0" style={{ color: iconColor }} />}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{titulo}</span>
            <span className="block truncate text-[11px] text-[#fff]/50">{subtitulo}</span>
          </span>
          <ChevronDown size={13} className={`shrink-0 text-[#fff]/35 transition ${abierto ? "rotate-180" : ""}`} />
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {valor && <span className={`text-sm font-semibold ${valorClase}`}>{valor}</span>}
          {accion}
        </div>
      </div>
      {abierto && (
        <p className="whitespace-pre-line border-t border-white/[0.06] px-3 py-2 text-[11px] leading-relaxed text-[#fff]/60">{detalle}</p>
      )}
    </div>
  )
}

function Bloque({ icon: Icon, titulo, contador, tone = "cyan", href, children }: { icon: React.ElementType; titulo: string; contador?: number; tone?: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><Icon size={15} className={TONE[tone]} /> {titulo}{contador !== undefined && contador > 0 && <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-[#fff]/70">{contador}</span>}</h3>
        {href && <Link href={href} className="text-[#fff]/40 hover:text-[#fff]/80"><ArrowRight size={15} /></Link>}
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

function MiniAccion({ icon: Icon, label, valor, href }: { icon: React.ElementType; label: string; valor: number; href: string }) {
  return (
    <Link href={href} className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition ${valor > 0 ? "bg-amber-400/[0.06] hover:bg-amber-400/[0.12]" : "bg-white/[0.03] hover:bg-white/[0.06]"}`}>
      <span className="flex items-center gap-2 text-sm text-[#fff]/75"><Icon size={15} className="text-[#fff]/50" /> {label}</span>
      <span className={`text-sm font-bold ${valor > 0 ? "text-amber-200" : "text-[#fff]/50"}`}>{valor}</span>
    </Link>
  )
}

/**
 * Fila de "Próximas fechas". Si recibe `ampliado`, la tarjeta se puede desplegar para leer
 * la descripción completa (mismo patrón que "Actividad ahora").
 */
function Fila({ icon: Icon, color, titulo, detalle, etiqueta, ampliado, onDelete, borrando }: { icon: React.ElementType; color: string; titulo: string; detalle: string; etiqueta: string; ampliado?: string; onDelete?: () => void; borrando?: boolean }) {
  const [abierto, setAbierto] = useState(false)
  const desplegable = !!ampliado
  return (
    <div className="min-w-0 rounded-xl bg-white/[0.03]">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          onClick={() => desplegable && setAbierto((v) => !v)}
          disabled={!desplegable}
          aria-expanded={desplegable ? abierto : undefined}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left enabled:hover:opacity-90 disabled:cursor-default"
        >
          <Icon size={15} style={{ color }} className="shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{titulo}</span>
            <span className="block truncate text-[11px] text-[#fff]/50">{detalle}</span>
          </span>
          {desplegable && <ChevronDown size={13} className={`shrink-0 text-[#fff]/35 transition ${abierto ? "rotate-180" : ""}`} />}
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[#fff]/60">{etiqueta}</span>
          {onDelete && (
            <button onClick={onDelete} disabled={borrando} className="rounded-md p-1 text-[#fff]/35 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40" title="Eliminar fecha">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      {abierto && ampliado && (
        <p className="border-t border-white/[0.06] px-3 py-2 text-[11px] leading-relaxed text-[#fff]/60">{ampliado}</p>
      )}
    </div>
  )
}

function Vacio({ texto }: { texto: string }) {
  return <p className="rounded-xl bg-white/[0.02] px-3 py-3 text-center text-xs text-[#fff]/40">{texto}</p>
}

/** Termómetro de medio círculo (0–100). El color pasa de rojo→ámbar→verde según el valor. */
function GaugeSemi({ valor }: { valor: number }) {
  const pct = Math.max(0, Math.min(100, valor))
  const r = 50, cx = 60, cy = 60, len = Math.PI * r
  const color = pct >= 70 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171"
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
  return (
    <svg viewBox="0 0 120 70" className="mx-auto w-full max-w-[200px]" role="img" aria-label={`${valor} de 100`}>
      <path d={arc} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="9" strokeLinecap="round" />
      <path d={arc} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(pct / 100) * len} ${len}`} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="700" fill={color} style={{ fontFamily: "var(--font-jost, inherit)" }}>{valor}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.45)">/ 100</text>
    </svg>
  )
}

/** Tarjeta de satisfacción. Altura uniforme: el gauge ocupa una franja fija y la nota va al pie,
 *  así ambas tarjetas (empleados / empresarial) miden igual aunque una no tenga datos. */
function Satisfaccion({ icon: Icon, titulo, valor, nota }: { icon: React.ElementType; titulo: string; valor: number | null; nota: string }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><Icon size={15} className="text-[#00BFA6]" /> {titulo}</h3>
      <div className="flex min-h-[104px] flex-1 items-center justify-center">
        {valor != null ? (
          <GaugeSemi valor={valor} />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-[#fff]/40">Sin datos aún</span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-[#fff]/50">Próximamente</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-[#fff]/40">{nota}</p>
    </div>
  )
}
