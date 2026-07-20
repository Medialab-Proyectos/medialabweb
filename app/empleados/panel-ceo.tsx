"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Loader2, Check, X, Wallet, TrendingUp, TrendingDown, ArrowDownCircle, ArrowUpCircle, ClipboardCheck,
  Receipt, FileText, Cake, UserX, CalendarClock, Gauge, ArrowRight, SmilePlus, Building2,
  Users, LayoutDashboard, ExternalLink, Award, Star, Plus, Trash2, Loader2 as Spin,
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
  serie6m: { label: string; ingresos: number; egresos: number }[]
  categorias: { ingresos: { cat: string; valor: number }[]; egresos: { cat: string; valor: number }[] }
  satisfaccionEmpleados: number | null
  satisfaccionEmpresas: number | null
  satisfaccionProyectos: number | null
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

  const maxBar = Math.max(1, ...d.serie6m.flatMap((x) => [x.ingresos, x.egresos]))

  return (
    <div className="flex flex-col gap-7">
      {/* ══ PERSONAS: quién está ahora + qué viene ══ */}
      <Grupo icon={Users} titulo="Personas">
        <ActividadWidget />
        {/* Agenda: ausentes hoy + cumpleaños + aniversarios + fechas de Talento Humano */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><CalendarClock size={15} className="text-[var(--cyan)]" /> Próximas fechas</h3>
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
              <Fila key={`aus-${i}`} icon={UserX} color="#fbbf24" titulo={a.nombre} detalle={`Ausente hoy · ${TIPO_AUS[a.tipo] ?? a.tipo}`} etiqueta="Hoy" />
            ))}
            {d.fechasEspeciales.map((f) => (
              <Fila key={`fe-${f.id}`} icon={Star} color="#22d3ee" titulo={f.titulo} detalle={`${f.nota ? f.nota + " · " : ""}${f.fecha}${f.recurrente ? " · anual" : ""}`} etiqueta={f.dias === 0 ? "Hoy" : `${f.dias}d`} onDelete={() => eliminarFecha(f.id)} borrando={busy === f.id} />
            ))}
            {d.aniversarios.slice(0, 4).map((a, i) => (
              <Fila key={`ani-${i}`} icon={Award} color="#a78bfa" titulo={a.nombre} detalle={`Aniversario · ${a.anos} ${a.anos === 1 ? "año" : "años"} · ${a.fecha}`} etiqueta={a.dias === 0 ? "Hoy" : `${a.dias}d`} />
            ))}
            {d.cumpleanos.slice(0, 4).map((c, i) => (
              <Fila key={`cum-${i}`} icon={Cake} color="#E8751A" titulo={c.nombre} detalle={`Cumpleaños · ${c.fecha}`} etiqueta={c.dias === 0 ? "Hoy" : `${c.dias}d`} />
            ))}
            {d.ausentesHoy.length === 0 && d.cumpleanos.length === 0 && d.aniversarios.length === 0 && d.fechasEspeciales.length === 0 && <Vacio texto="Sin ausencias, cumpleaños, aniversarios ni fechas próximas." />}
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

      {/* ══ ECONOMÍA ══ */}
      <Grupo icon={Wallet} titulo="Economía">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Saldo total" valor={cop(d.kpis.saldoCOP)} sub={d.kpis.saldoUSD ? formatMoneda(d.kpis.saldoUSD, "USD") : undefined} icon={Wallet} tone="cyan" />
          <Kpi label={`Ganancia ${new Date().getFullYear()}`} valor={cop(d.gananciaAnio)} icon={d.gananciaAnio >= 0 ? TrendingUp : TrendingDown} tone={d.gananciaAnio >= 0 ? "emerald" : "red"} />
          <Kpi label="Por cobrar" valor={cop(d.kpis.porCobrar)} icon={ArrowDownCircle} tone="emerald" />
          <Kpi label="Por pagar" valor={cop(d.kpis.porPagar)} icon={ArrowUpCircle} tone="red" />
        </div>

        {/* Por pagar · por cobrar · otros pendientes: 3 columnas para no dejar hueco. */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cuentas por pagar (marcar pagado en línea) */}
        <Bloque icon={ArrowUpCircle} titulo="Cuentas por pagar" contador={d.pagosPendientes.length} tone="red" href="/empleados/admin/contabilidad">
          {d.pagosPendientes.length === 0 ? (
            <Vacio texto="Nada pendiente por pagar." />
          ) : d.pagosPendientes.slice(0, 5).map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.concepto}</p>
                <p className="text-[11px] text-[#fff]/50">{m.contraparte ? `${m.contraparte} · ` : ""}{m.cuenta} · {fechaCorta(m.fecha)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-red-300">{formatMoneda(m.valor, m.moneda)}</span>
                <button disabled={busy === m.id} onClick={() => marcarPago(m.id, "pagosPendientes")} title="Marcar pagado" className="flex h-8 items-center gap-1 rounded-lg bg-emerald-400/15 px-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/25 disabled:opacity-50">{busy === m.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Pagué</button>
              </div>
            </div>
          ))}
        </Bloque>

        {/* Cuentas por cobrar (marcar recibido) */}
        <Bloque icon={ArrowDownCircle} titulo="Cuentas por cobrar" contador={d.porCobrarLista.length} tone="emerald" href="/empleados/admin/contabilidad">
          {d.porCobrarLista.length === 0 ? (
            <Vacio texto="Sin ingresos por confirmar." />
          ) : d.porCobrarLista.slice(0, 5).map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.concepto}</p>
                <p className="text-[11px] text-[#fff]/50">{m.contraparte ? `${m.contraparte} · ` : ""}{m.cuenta} · {fechaCorta(m.fecha)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-emerald-300">{formatMoneda(m.valor, m.moneda)}</span>
                <button disabled={busy === m.id} onClick={() => marcarPago(m.id, "porCobrarLista")} title="Marcar recibido" className="flex h-8 items-center gap-1 rounded-lg bg-[var(--cyan)]/15 px-2 text-xs font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/25 disabled:opacity-50">{busy === m.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Llegó</button>
              </div>
            </div>
          ))}
        </Bloque>

        {/* Otros pendientes (enlaces rápidos) */}
        <Bloque icon={Gauge} titulo="Otros pendientes" tone="cyan">
          <MiniAccion icon={Receipt} label="Facturas freelance por pagar" valor={d.facturasFreelance} href="/empleados/admin/freelance" />
          <MiniAccion icon={FileText} label="Cuentas de cobro por enviar" valor={d.cuentasCobroPorPasar} href="/empleados/admin/cuentas-cobro" />
          <MiniAccion icon={TrendingUp} label="Inversiones por vencer" valor={d.inversionesPorVencer.length} href="/empleados/admin/contabilidad/inversiones" />
        </Bloque>
      </div>

      {/* ── Gráfica ingresos vs egresos + agenda ── */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#fff]/80">Ingresos vs egresos · 6 meses (COP)</h3>
            <div className="flex items-center gap-3 text-[10px] text-[#fff]/55">
              <span className="inline-flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-sm" style={{ background: "#34d399" }} /> Ingresos</span>
              <span className="inline-flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-sm" style={{ background: "#f87171" }} /> Egresos</span>
            </div>
          </div>
          <svg viewBox="0 0 360 136" className="w-full" role="img" aria-label="Ingresos vs egresos por mes">
            <line x1={0} y1={120} x2={360} y2={120} stroke="rgba(255,255,255,0.12)" />
            {d.serie6m.map((m, i) => {
              const gw = 360 / d.serie6m.length; const gx = i * gw + gw / 2; const bw = Math.min(16, (gw - 8) / 2)
              const hi = (m.ingresos / maxBar) * 120; const he = (m.egresos / maxBar) * 120
              return (
                <g key={i}>
                  <rect x={gx - bw - 1} y={120 - hi} width={bw} height={hi} rx={2} fill="#34d399" />
                  <rect x={gx + 1} y={120 - he} width={bw} height={he} rx={2} fill="#f87171" />
                  <text x={gx} y={132} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">{m.label}</text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Vencimientos financieros */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><TrendingUp size={15} className="text-[var(--cyan)]" /> Inversiones por vencer</h3>
          <div className="flex flex-col gap-2">
            {d.inversionesPorVencer.slice(0, 5).map((iv) => (
              <Fila key={`inv-${iv.id}`} icon={TrendingUp} color="var(--cyan)" titulo={iv.entidad} detalle={`Vence · ${cop(iv.monto)}`} etiqueta={iv.dias < 0 ? "Vencida" : `${iv.dias}d`} />
            ))}
            {d.inversionesPorVencer.length === 0 && <Vacio texto="Sin inversiones próximas a vencer." />}
          </div>
        </div>
        </div>
      </Grupo>

      {/* ══ SATISFACCIÓN (y el Centro de Operaciones, donde vive la de proyectos) ══ */}
      <Grupo icon={SmilePlus} titulo="Satisfacción">
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          <Link href="/empleados/admin/satisfaccion" className="block h-full transition hover:brightness-110"><Satisfaccion icon={SmilePlus} titulo="Satisfacción de empleados" valor={d.satisfaccionEmpleados} nota="Toca para ver respuestas o enviar la encuesta." /></Link>
          <a href="https://uxia-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="block h-full transition hover:brightness-110"><Satisfaccion icon={Building2} titulo="Satisfacción empresarial" valor={d.satisfaccionProyectos} nota="Promedio de satisfacción de los proyectos, en vivo desde el Centro de Operaciones." /></a>
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

function Kpi({ label, valor, sub, icon: Icon, tone }: { label: string; valor: string; sub?: string; icon: React.ElementType; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#fff]/55">{label}</span>
        <Icon size={15} className={TONE[tone]} />
      </div>
      <p className="font-display text-lg font-bold sm:text-xl">{valor}</p>
      {sub && <p className="text-[11px] text-[#fff]/45">{sub}</p>}
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

function Fila({ icon: Icon, color, titulo, detalle, etiqueta, onDelete, borrando }: { icon: React.ElementType; color: string; titulo: string; detalle: string; etiqueta: string; onDelete?: () => void; borrando?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <Icon size={15} style={{ color }} className="shrink-0" />
        <div className="min-w-0"><p className="truncate text-sm font-medium">{titulo}</p><p className="truncate text-[11px] text-[#fff]/50">{detalle}</p></div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[#fff]/60">{etiqueta}</span>
        {onDelete && (
          <button onClick={onDelete} disabled={borrando} className="rounded-md p-1 text-[#fff]/35 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40" title="Eliminar fecha">
            <Trash2 size={12} />
          </button>
        )}
      </div>
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
