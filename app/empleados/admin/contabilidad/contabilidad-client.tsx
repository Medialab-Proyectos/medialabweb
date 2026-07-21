"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Plus, Pencil, Trash2, X, Wallet, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight,
  CheckCircle2, Clock, Landmark, Building2, FileText, AlertTriangle, BarChart3, Users, Repeat, TrendingUp,
} from "lucide-react"
import {
  type Cuenta, type Movimiento, type TipoMovimiento, type Moneda, type Empresa, type MetodoPago, type TipoIVA,
  CATEGORIAS, CATEGORIA_LABEL, TIPO_MOV_LABEL, IVA_LABEL, MONEDAS_ORDEN, formatMoneda, resumen,
} from "@/lib/empleados/contabilidad"
import { MESES } from "@/lib/empleados/desprendible"
import { ConfirmDialog } from "../../confirm-dialog"
import { MoneyInput } from "../../money-input"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

/** Icono "?" con tooltip: explica un campo sin ocupar espacio en el formulario. */
function Ayuda({ texto }: { texto: string }) {
  const [ver, setVer] = useState(false)
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setVer((v) => !v)}
        onMouseEnter={() => setVer(true)}
        onMouseLeave={() => setVer(false)}
        aria-label="Ayuda"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[9px] font-bold text-[#fff]/60 transition hover:border-[var(--cyan)]/60 hover:text-[var(--cyan)]"
      >
        ?
      </button>
      {ver && (
        <span role="tooltip" className="absolute bottom-full left-1/2 z-50 mb-1.5 w-64 -translate-x-1/2 rounded-lg border border-white/15 bg-[#12151c] px-3 py-2 text-[11px] font-normal normal-case leading-relaxed tracking-normal text-[#fff]/80 shadow-2xl">
          {texto}
        </span>
      )}
    </span>
  )
}

const anioActual = new Date().getFullYear()
const mesActual = new Date().getMonth() + 1
function hoyISO() {
  const d = new Date(); const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

type CuentaForm = { id?: string; nombre: string; banco: string; numero_cuenta: string; plataforma: string; moneda: Moneda; saldo_inicial: number; activa: boolean }
type MovForm = {
  id?: string; cuenta_id: string; cuenta_destino_id: string; fecha: string; tipo: TipoMovimiento
  categoria: string; concepto: string; contraparte: string; empresa_id: string
  valor: number; tasa: number; costo: number; valor_destino: number
  iva_tipo: TipoIVA; iva_valor: number
  estado: "pendiente" | "realizado"; referencia: string; fecha_estimada: string; tasa_real: number; valor_real: number
}

export function ContabilidadClient() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [metodos, setMetodos] = useState<MetodoPago[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [anio, setAnio] = useState(anioActual)
  const [mes, setMes] = useState(mesActual)
  const [formCuenta, setFormCuenta] = useState<CuentaForm | null>(null)
  const [formMov, setFormMov] = useState<MovForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmar, setConfirmar] = useState<null | { titulo: string; mensaje: string; run: () => Promise<void> }>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  async function cargar() {
    setCargando(true); setError("")
    try {
      const [rc, rm, re, rmet] = await Promise.all([
        fetch("/api/empleados/admin/contabilidad/cuentas"),
        fetch("/api/empleados/admin/contabilidad/movimientos"),
        fetch("/api/empleados/admin/contabilidad/empresas"),
        fetch("/api/empleados/admin/contabilidad/metodos"),
      ])
      const dc = await rc.json(); const dm = await rm.json()
      if (!rc.ok) throw new Error(dc.error)
      if (!rm.ok) throw new Error(dm.error)
      setCuentas(dc.cuentas ?? []); setMovimientos(dm.movimientos ?? [])
      const de = await re.json(); if (re.ok) setEmpresas(de.empresas ?? [])
      const dmet = await rmet.json(); if (rmet.ok) setMetodos(dmet.metodos ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  const nombreEmpresa = useMemo(() => new Map(empresas.map((x) => [x.id, x.nombre])), [empresas])

  const res = useMemo(() => resumen(cuentas, movimientos, { anio, mes }), [cuentas, movimientos, anio, mes])
  const saldoPorCuenta = useMemo(() => new Map(res.porCuenta.map((p) => [p.cuenta.id, p.saldo])), [res])
  const nombreCuenta = useMemo(() => new Map(cuentas.map((c) => [c.id, c.nombre])), [cuentas])
  const monedaCuenta = useMemo(() => new Map(cuentas.map((c) => [c.id, c.moneda])), [cuentas])
  const movMes = useMemo(
    () => movimientos.filter((m) => Number(m.fecha.slice(0, 4)) === anio && Number(m.fecha.slice(5, 7)) === mes),
    [movimientos, anio, mes],
  )
  const monedasUsadas = MONEDAS_ORDEN.filter((mo) => cuentas.some((c) => c.moneda === mo))

  // Ingresos y egresos del AÑO seleccionado agrupados por categoría (COP), para la gráfica.
  const porCategoria = useMemo(() => {
    const ing = new Map<string, number>()
    const egr = new Map<string, number>()
    for (const m of movimientos) {
      if (m.estado !== "realizado" || m.tipo === "traslado") continue
      if (Number(m.fecha.slice(0, 4)) !== anio) continue
      if (monedaCuenta.get(m.cuenta_id) !== "COP") continue
      const cat = m.categoria || "otro"
      const bucket = m.tipo === "ingreso" ? ing : egr
      bucket.set(cat, (bucket.get(cat) ?? 0) + (Number(m.valor) || 0))
    }
    const arr = (mp: Map<string, number>) => [...mp.entries()].map(([cat, valor]) => ({ cat, valor })).sort((a, b) => b.valor - a.valor)
    const ingArr = arr(ing), egrArr = arr(egr)
    const totalIng = ingArr.reduce((a, x) => a + x.valor, 0)
    const totalEgr = egrArr.reduce((a, x) => a + x.valor, 0)
    return { ingArr, egrArr, totalIng, totalEgr, ganancia: totalIng - totalEgr }
  }, [movimientos, monedaCuenta, anio])

  // Serie de los últimos 6 meses (ingresos vs egresos realizados) por moneda, para las gráficas.
  const serie6m = useMemo(() => {
    const base = new Date(anio, mes - 1, 1)
    const meses: { anio: number; mes: number; label: string }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1)
      meses.push({ anio: d.getFullYear(), mes: d.getMonth() + 1, label: MESES[d.getMonth()].slice(0, 3) })
    }
    const porMoneda = new Map<Moneda, { label: string; ingresos: number; egresos: number }[]>()
    for (const mo of monedasUsadas) porMoneda.set(mo, meses.map((m) => ({ label: m.label, ingresos: 0, egresos: 0 })))
    for (const m of movimientos) {
      if (m.estado !== "realizado" || m.tipo === "traslado") continue
      const mo = monedaCuenta.get(m.cuenta_id); if (!mo) continue
      const arr = porMoneda.get(mo); if (!arr) continue
      const idx = meses.findIndex((x) => x.anio === Number(m.fecha.slice(0, 4)) && x.mes === Number(m.fecha.slice(5, 7)))
      if (idx < 0) continue
      if (m.tipo === "ingreso") arr[idx].ingresos += Number(m.valor) || 0
      else if (m.tipo === "egreso") arr[idx].egresos += Number(m.valor) || 0
    }
    return porMoneda
  }, [movimientos, monedaCuenta, monedasUsadas, anio, mes])

  // Analítica del dashboard: cuentas por pagar por categoría + ingresos/egresos del mes + alertas.
  const analitica = useMemo(() => {
    const num = (x: unknown) => Number(x) || 0
    const monedaDe = new Map(cuentas.map((c) => [c.id, c.moneda]))
    const base = () => ({ porPagarTotal: 0, nPorPagar: 0, porCobrarTotal: 0, ingresosMes: 0, egresosMes: 0, cats: new Map<string, number>() })
    const acc: Record<string, ReturnType<typeof base>> = {}
    for (const mo of monedasUsadas) acc[mo] = base()
    for (const m of movimientos) {
      const mo = monedaDe.get(m.cuenta_id)
      if (!mo || !acc[mo]) continue
      if (m.estado === "pendiente") {
        if (m.tipo === "egreso") {
          acc[mo].porPagarTotal += num(m.valor); acc[mo].nPorPagar += 1
          const cat = m.categoria || "otro"
          acc[mo].cats.set(cat, (acc[mo].cats.get(cat) ?? 0) + num(m.valor))
        } else if (m.tipo === "ingreso") acc[mo].porCobrarTotal += num(m.valor)
      } else if (Number(m.fecha.slice(0, 4)) === anio && Number(m.fecha.slice(5, 7)) === mes) {
        if (m.tipo === "ingreso") acc[mo].ingresosMes += num(m.valor)
        else if (m.tipo === "egreso") acc[mo].egresosMes += num(m.valor)
      }
    }
    return monedasUsadas.map((mo) => {
      const a = acc[mo]
      const porPagar = [...a.cats.entries()].map(([cat, valor]) => ({ cat, valor })).sort((x, y) => y.valor - x.valor)
      return { moneda: mo, ...a, porPagar, maxCat: porPagar.reduce((mx, b) => Math.max(mx, b.valor), 0) }
    })
  }, [cuentas, movimientos, monedasUsadas, anio, mes])

  const alertas = analitica.filter((a) => a.porPagarTotal > 0 || a.porCobrarTotal > 0)

  // ── Cuentas ────────────────────────────────────────────────────────────────
  async function guardarCuenta(e: React.FormEvent) {
    e.preventDefault(); if (!formCuenta) return
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/cuentas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formCuenta.id ? { id: formCuenta.id } : {}),
          nombre: formCuenta.nombre, banco: formCuenta.banco || null, numero_cuenta: formCuenta.numero_cuenta || null, plataforma: formCuenta.plataforma || null,
          moneda: formCuenta.moneda, saldo_inicial: formCuenta.saldo_inicial, activa: formCuenta.activa,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setFormCuenta(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la cuenta.")
    } finally { setSaving(false) }
  }

  function pedirEliminarCuenta(c: Cuenta) {
    setConfirmar({
      titulo: "Eliminar cuenta",
      mensaje: `¿Eliminar la cuenta "${c.nombre}"? Se borrarán también sus movimientos. Esta acción no se puede deshacer.`,
      run: async () => {
        setConfirmLoading(true)
        try {
          const res = await fetch(`/api/empleados/admin/contabilidad/cuentas?id=${c.id}`, { method: "DELETE" })
          const data = await res.json(); if (!res.ok) throw new Error(data.error)
          await cargar(); setConfirmar(null)
        } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
        finally { setConfirmLoading(false) }
      },
    })
  }

  // ── Movimientos ───────────────────────────────────────────────────────────
  function nuevoMov() {
    setError("")
    setFormMov({
      cuenta_id: cuentas[0]?.id ?? "", cuenta_destino_id: "", fecha: hoyISO(), tipo: "ingreso",
      categoria: "", concepto: "", contraparte: "", empresa_id: "",
      valor: 0, tasa: 0, costo: 0, valor_destino: 0, iva_tipo: "na", iva_valor: 0, estado: "realizado", referencia: "", fecha_estimada: "", tasa_real: 0, valor_real: 0,
    })
  }
  function editarMov(m: Movimiento) {
    setError("")
    setFormMov({
      id: m.id, cuenta_id: m.cuenta_id, cuenta_destino_id: m.cuenta_destino_id ?? "", fecha: m.fecha, tipo: m.tipo,
      categoria: m.categoria ?? "", concepto: m.concepto ?? "", contraparte: m.contraparte ?? "", empresa_id: m.empresa_id ?? "",
      valor: Number(m.valor) || 0, tasa: Number(m.tasa) || 0, costo: Number(m.costo) || 0, valor_destino: Number(m.valor_destino) || 0,
      iva_tipo: (m.iva_tipo ?? "na") as TipoIVA, iva_valor: Number(m.iva_valor) || 0,
      estado: m.estado, referencia: m.referencia ?? "", fecha_estimada: m.fecha_estimada ?? "", tasa_real: Number(m.tasa_real) || 0, valor_real: Number(m.valor_real) || 0,
    })
  }

  // Monedas de origen/destino del traslado en edición (para saber si es cross-currency).
  const movMonedaOrigen = formMov ? cuentas.find((c) => c.id === formMov.cuenta_id)?.moneda : undefined
  const movMonedaDestino = formMov ? cuentas.find((c) => c.id === formMov.cuenta_destino_id)?.moneda : undefined
  const trasladoCrossMoneda = !!formMov && formMov.tipo === "traslado" && !!movMonedaDestino && movMonedaOrigen !== movMonedaDestino

  async function guardarMov(e: React.FormEvent) {
    e.preventDefault(); if (!formMov) return
    if (!formMov.cuenta_id) return setError("Selecciona una cuenta.")
    if (formMov.tipo === "traslado" && !formMov.cuenta_destino_id) return setError("El traslado necesita cuenta destino.")
    // valor_destino: en cross-moneda usa el ingresado (o valor×tasa−costo); si es misma moneda, valor−costo.
    const valorDestino = formMov.tipo !== "traslado" ? null
      : trasladoCrossMoneda
        ? (formMov.valor_destino || Math.round((formMov.valor * (formMov.tasa || 0) - (formMov.costo || 0)) * 100) / 100)
        : Math.max(0, formMov.valor - (formMov.costo || 0))
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/movimientos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formMov.id ? { id: formMov.id } : {}),
          cuenta_id: formMov.cuenta_id,
          cuenta_destino_id: formMov.tipo === "traslado" ? formMov.cuenta_destino_id || null : null,
          fecha: formMov.fecha, tipo: formMov.tipo, categoria: formMov.categoria || null,
          concepto: formMov.concepto || null, contraparte: formMov.contraparte || null, empresa_id: formMov.empresa_id || null,
          valor: formMov.valor,
          // TRM: aplica a traslados cross-moneda y a ingresos por transferencia (informativa).
          tasa: formMov.tipo === "egreso" ? null : (formMov.tasa || null),
          // El fee/comisión de transferencia aplica a cualquier tipo de movimiento.
          costo: formMov.costo || 0,
          valor_destino: valorDestino,
          iva_tipo: formMov.tipo === "traslado" ? null : formMov.iva_tipo,
          iva_valor: formMov.tipo === "traslado" ? null : (formMov.iva_valor || null),
          estado: formMov.estado, referencia: formMov.referencia || null,
          fecha_estimada: formMov.estado === "pendiente" ? (formMov.fecha_estimada || null) : null,
          tasa_real: formMov.tasa_real || null, valor_real: formMov.valor_real || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargar(); setFormMov(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el movimiento.")
    } finally { setSaving(false) }
  }

  async function agregarMetodo(nombre: string) {
    const n = nombre.trim(); if (!n) return
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/metodos", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: n }),
      })
      const data = await res.json(); if (res.ok) setMetodos(data.metodos ?? [])
    } catch { /* no bloquea */ }
  }

  async function toggleEstado(m: Movimiento) {
    setError("")
    try {
      const res = await fetch("/api/empleados/admin/contabilidad/movimientos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: m.id, cuenta_id: m.cuenta_id, cuenta_destino_id: m.cuenta_destino_id,
          fecha: m.fecha, tipo: m.tipo, categoria: m.categoria, concepto: m.concepto,
          contraparte: m.contraparte, empresa_id: m.empresa_id, empleado_id: m.empleado_id, valor: Number(m.valor) || 0,
          tasa: m.tasa, costo: Number(m.costo) || 0, valor_destino: m.valor_destino,
          iva_tipo: m.iva_tipo, iva_valor: m.iva_valor,
          estado: m.estado === "realizado" ? "pendiente" : "realizado", referencia: m.referencia,
        }),
      })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setMovimientos((prev) => prev.map((x) => (x.id === m.id ? (data.movimiento as Movimiento) : x)))
    } catch (e) { setError(e instanceof Error ? e.message : "Error.") }
  }

  function pedirEliminarMov(m: Movimiento) {
    setConfirmar({
      titulo: "Eliminar movimiento",
      mensaje: "¿Eliminar este movimiento? Esta acción no se puede deshacer.",
      run: async () => {
        setConfirmLoading(true)
        try {
          const res = await fetch(`/api/empleados/admin/contabilidad/movimientos?id=${m.id}`, { method: "DELETE" })
          const data = await res.json(); if (!res.ok) throw new Error(data.error)
          setMovimientos((prev) => prev.filter((x) => x.id !== m.id)); setConfirmar(null)
        } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar."); setConfirmar(null) }
        finally { setConfirmLoading(false) }
      },
    })
  }

  const TipoIcon = { ingreso: ArrowDownCircle, egreso: ArrowUpCircle, traslado: ArrowLeftRight }
  const tipoColor = { ingreso: "text-emerald-300", egreso: "text-red-300", traslado: "text-[var(--cyan)]" }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-4 flex items-center gap-2.5">
        <Wallet size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Contabilidad</h1>
      </div>

      {/* Submódulos: en móvil se deslizan en carrusel horizontal; en escritorio van en fila. */}
      <div className="-mx-4 mb-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
          {[
            { href: "/empleados/admin/contabilidad/nomina", icon: Users, label: "Pagos a empleados" },
            { href: "/empleados/admin/contabilidad/recurrentes", icon: Repeat, label: "Gastos recurrentes" },
            { href: "/empleados/admin/empresas", icon: Building2, label: "Gestionar empresas" },
            { href: "/empleados/admin/cuentas-cobro", icon: FileText, label: "Cuentas de cobro" },
            { href: "/empleados/admin/contabilidad/inversiones", icon: TrendingUp, label: "Inversiones" },
          ].map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.href} href={s.href} className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5">
                <Icon size={15} /> {s.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Periodo */}
      <div className="mb-6 flex items-center gap-2">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={`${inputCls} w-auto`}>
          {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${inputCls} w-24`} />
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Alertas importantes */}
          {alertas.length > 0 && (
            <section className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-300" />
                <h2 className="text-sm font-semibold text-amber-100/90">Alertas importantes</h2>
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                {alertas.map((a) => (
                  <div key={a.moneda} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {a.porPagarTotal > 0 && (
                      <span className="text-[#fff]/75">Por pagar {a.moneda}: <b className="text-red-300">{formatMoneda(a.porPagarTotal, a.moneda)}</b> <span className="text-[#fff]/45">({a.nPorPagar} pendiente{a.nPorPagar === 1 ? "" : "s"})</span></span>
                    )}
                    {a.porCobrarTotal > 0 && (
                      <span className="text-[#fff]/75">Por cobrar {a.moneda}: <b className="text-emerald-300">{formatMoneda(a.porCobrarTotal, a.moneda)}</b></span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Resumen por moneda */}
          {monedasUsadas.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-[#fff]/50">
              Crea tu primera cuenta para empezar a llevar la contabilidad.
            </div>
          ) : (
            monedasUsadas.map((mo) => {
              const r = res.porMoneda[mo]
              return (
                <div key={mo} className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-5">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-sm font-semibold text-[#fff]/80">Saldo total {mo}</h2>
                    <p className="font-display text-2xl font-bold text-[var(--cyan)]">{formatMoneda(r.saldo, mo)}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#fff]/60 sm:grid-cols-3 lg:grid-cols-5">
                    <span>Ingresos mes: <b className="text-emerald-300/90">{formatMoneda(r.ingresosMes, mo)}</b></span>
                    <span>Egresos mes: <b className="text-red-300/90">{formatMoneda(r.egresosMes, mo)}</b></span>
                    <span>Por cobrar: <b className="text-[#fff]/85">{formatMoneda(r.porCobrar, mo)}</b></span>
                    <span>Por pagar: <b className="text-[#fff]/85">{formatMoneda(r.porPagar, mo)}</b></span>
                    <span>Por trasladar: <b className="text-[#fff]/85">{formatMoneda(r.porTrasladar, mo)}</b></span>
                  </div>
                </div>
              )
            })
          )}

          {/* Estado de la empresa · gráficas de los últimos 6 meses */}
          {monedasUsadas.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Estado de la empresa · últimos 6 meses</h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {monedasUsadas.map((mo) => {
                  const data = serie6m.get(mo) ?? []
                  const r = res.porMoneda[mo]
                  return (
                    <div key={mo} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[#fff]/70">Ingresos vs egresos ({mo})</h3>
                        <div className="flex items-center gap-3 text-[10px] text-[#fff]/55">
                          <span className="inline-flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-sm" style={{ background: "#34d399" }} /> Ingresos</span>
                          <span className="inline-flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-sm" style={{ background: "#f87171" }} /> Egresos</span>
                        </div>
                      </div>
                      <MiniBarras data={data} moneda={mo} />
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                        <span className="rounded-lg bg-[var(--cyan)]/10 px-2 py-1.5 text-[var(--cyan)]">Por cobrar<br /><b>{formatMoneda(r.porCobrar, mo)}</b></span>
                        <span className="rounded-lg bg-red-400/10 px-2 py-1.5 text-red-300">Por pagar<br /><b>{formatMoneda(r.porPagar, mo)}</b></span>
                        <span className="rounded-lg bg-amber-400/10 px-2 py-1.5 text-amber-300">Por trasladar<br /><b>{formatMoneda(r.porTrasladar, mo)}</b></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Categorización de ingresos y egresos (año) */}
          {(porCategoria.ingArr.length > 0 || porCategoria.egrArr.length > 0) && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#fff]/80">Ingresos y egresos por categoría · {anio} (COP)</h2>
                <span className={`text-sm font-bold ${porCategoria.ganancia >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  Ganancia: {formatMoneda(porCategoria.ganancia, "COP")}
                </span>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <CategoriaBarras titulo="Ingresos por categoría" data={porCategoria.ingArr} total={porCategoria.totalIng} color="#34d399" />
                <CategoriaBarras titulo="Egresos por categoría" data={porCategoria.egrArr} total={porCategoria.totalEgr} color="#f87171" />
              </div>
            </section>
          )}

          {/* Gráficas: cuentas por pagar + ingresos vs egresos */}
          {analitica.some((a) => a.porPagar.length > 0 || a.ingresosMes > 0 || a.egresosMes > 0) && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><BarChart3 size={15} /> Estadísticas</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {analitica.filter((a) => a.porPagar.length > 0 || a.ingresosMes > 0 || a.egresosMes > 0).map((a) => {
                  const maxIE = Math.max(a.ingresosMes, a.egresosMes, 1)
                  return (
                    <div key={a.moneda} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#fff]/45">{a.moneda}</p>

                      {/* Cuentas por pagar por categoría */}
                      {a.porPagar.length > 0 && (
                        <div className="mb-5">
                          <div className="mb-2 flex items-baseline justify-between">
                            <p className="text-xs text-[#fff]/60">Cuentas por pagar por categoría</p>
                            <p className="text-xs font-semibold text-red-300">{formatMoneda(a.porPagarTotal, a.moneda)}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            {a.porPagar.map((b) => (
                              <div key={b.cat}>
                                <div className="mb-0.5 flex items-baseline justify-between gap-2 text-[11px]">
                                  <span className="text-[#fff]/65">{CATEGORIA_LABEL[b.cat] ?? b.cat}</span>
                                  <span className="text-[#fff]/80">{formatMoneda(b.valor, a.moneda)}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                                  <div className="h-full rounded-full bg-red-400/70" style={{ width: `${Math.max(4, (b.valor / a.maxCat) * 100)}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ingresos vs egresos del mes */}
                      <div>
                        <p className="mb-2 text-xs text-[#fff]/60">Ingresos vs egresos · {MESES[mes - 1]} {anio}</p>
                        <div className="flex flex-col gap-2">
                          <div>
                            <div className="mb-0.5 flex items-baseline justify-between text-[11px]"><span className="text-[#fff]/65">Ingresos</span><span className="text-emerald-300">{formatMoneda(a.ingresosMes, a.moneda)}</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${Math.max(2, (a.ingresosMes / maxIE) * 100)}%` }} /></div>
                          </div>
                          <div>
                            <div className="mb-0.5 flex items-baseline justify-between text-[11px]"><span className="text-[#fff]/65">Egresos</span><span className="text-red-300">{formatMoneda(a.egresosMes, a.moneda)}</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-red-400/70" style={{ width: `${Math.max(2, (a.egresosMes / maxIE) * 100)}%` }} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Cuentas */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#fff]/80"><Landmark size={15} /> Cuentas</h2>
              <button onClick={() => setFormCuenta({ nombre: "", banco: "", numero_cuenta: "", plataforma: "", moneda: "COP", saldo_inicial: 0, activa: true })} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cyan)] hover:underline">
                <Plus size={13} /> Nueva cuenta
              </button>
            </div>
            {cuentas.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-[#fff]/45">Aún no hay cuentas.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {cuentas.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{c.nombre} {!c.activa && <span className="text-[10px] text-[#fff]/40">(inactiva)</span>}</p>
                      <p className="text-xs text-[#fff]/50">{[c.plataforma, c.banco, c.numero_cuenta].filter(Boolean).join(" · ") || "—"} · {c.moneda}</p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--cyan)]">{formatMoneda(saldoPorCuenta.get(c.id) ?? 0, c.moneda)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setFormCuenta({ id: c.id, nombre: c.nombre, banco: c.banco ?? "", numero_cuenta: c.numero_cuenta ?? "", plataforma: c.plataforma ?? "", moneda: c.moneda, saldo_inicial: Number(c.saldo_inicial) || 0, activa: c.activa })} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                      <button onClick={() => pedirEliminarCuenta(c)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Movimientos del mes */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#fff]/80">Movimientos · {MESES[mes - 1]} {anio}</h2>
              <button onClick={nuevoMov} disabled={cuentas.length === 0} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cyan)] px-3 py-1.5 text-xs font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-40">
                <Plus size={13} /> Nuevo movimiento
              </button>
            </div>
            {movMes.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-[#fff]/45">No hay movimientos en {MESES[mes - 1]} {anio}.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {movMes.map((m) => {
                  const Icon = TipoIcon[m.tipo]
                  const mo = monedaCuenta.get(m.cuenta_id) ?? "COP"
                  return (
                    <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={tipoColor[m.tipo]} />
                        <div>
                          <p className="text-sm font-medium">
                            {m.concepto || CATEGORIA_LABEL[m.categoria ?? ""] || TIPO_MOV_LABEL[m.tipo]}
                            {m.tipo === "traslado" && <span className="text-[#fff]/50"> → {nombreCuenta.get(m.cuenta_destino_id ?? "") ?? "—"}</span>}
                          </p>
                          <p className="text-xs text-[#fff]/50">
                            {m.fecha} · {nombreCuenta.get(m.cuenta_id) ?? "—"}
                            {m.empresa_id ? ` · ${nombreEmpresa.get(m.empresa_id) ?? ""}` : m.contraparte ? ` · ${m.contraparte}` : ""}
                            {m.categoria ? ` · ${CATEGORIA_LABEL[m.categoria] ?? m.categoria}` : ""}
                            {m.estado === "pendiente" ? " · pendiente" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-right text-sm font-semibold ${tipoColor[m.tipo]}`}>
                          {m.tipo === "egreso" ? "−" : m.tipo === "ingreso" ? "+" : ""}{formatMoneda(m.valor, mo)}
                          {m.tipo === "traslado" && (() => {
                            const md = monedaCuenta.get(m.cuenta_destino_id ?? "") ?? mo
                            const vd = m.valor_destino != null ? Number(m.valor_destino) : Number(m.valor)
                            return md !== mo ? <span className="block text-[10px] font-normal text-[#fff]/45">→ {formatMoneda(vd, md)}</span> : null
                          })()}
                        </span>
                        <button onClick={() => toggleEstado(m)} title={m.estado === "realizado" ? "Marcar pendiente" : "Marcar realizado"} className={`rounded-full p-1 ${m.estado === "realizado" ? "text-emerald-300" : "text-amber-300"}`}>
                          {m.estado === "realizado" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </button>
                        <button onClick={() => editarMov(m)} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]"><Pencil size={14} /></button>
                        <button onClick={() => pedirEliminarMov(m)} className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal cuenta */}
      {formCuenta && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarCuenta} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{formCuenta.id ? "Editar cuenta" : "Nueva cuenta"}</h2>
              <button type="button" onClick={() => setFormCuenta(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Nombre</span>
                <input required value={formCuenta.nombre} onChange={(e) => setFormCuenta({ ...formCuenta, nombre: e.target.value })} className={inputCls} placeholder="Cuenta principal" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Método de pago</span>
                <input
                  list="cat-metodos" value={formCuenta.plataforma}
                  onChange={(e) => setFormCuenta({ ...formCuenta, plataforma: e.target.value })}
                  onBlur={(e) => { const v = e.target.value.trim(); if (v && !metodos.some((m) => m.nombre.toLowerCase() === v.toLowerCase())) agregarMetodo(v) }}
                  className={inputCls} placeholder="Elige o escribe uno nuevo…"
                />
                <datalist id="cat-metodos">{metodos.map((m) => <option key={m.id} value={m.nombre} />)}</datalist>
              </label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Banco / entidad</span>
                <input value={formCuenta.banco} onChange={(e) => setFormCuenta({ ...formCuenta, banco: e.target.value })} className={inputCls} placeholder="Bancolombia, Caja Social…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Número de cuenta</span>
                <input value={formCuenta.numero_cuenta} onChange={(e) => setFormCuenta({ ...formCuenta, numero_cuenta: e.target.value })} className={inputCls} placeholder="Ej: 123-456789-01" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Moneda</span>
                <select value={formCuenta.moneda} onChange={(e) => setFormCuenta({ ...formCuenta, moneda: e.target.value as Moneda })} className={inputCls}>
                  {MONEDAS_ORDEN.map((m) => <option key={m} value={m}>{m}</option>)}
                </select></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Saldo inicial (punto de partida)</span>
                <MoneyInput value={formCuenta.saldo_inicial} onChange={(n) => setFormCuenta({ ...formCuenta, saldo_inicial: n })} className={inputCls} /></label>
              <label className="flex items-center gap-2 text-sm text-[#fff]/75 sm:col-span-2">
                <input type="checkbox" checked={formCuenta.activa} onChange={(e) => setFormCuenta({ ...formCuenta, activa: e.target.checked })} className="h-4 w-4 accent-[var(--cyan)]" /> Cuenta activa
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormCuenta(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal movimiento */}
      {formMov && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <form onSubmit={guardarMov} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151c] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{formMov.id ? "Editar movimiento" : "Nuevo movimiento"}</h2>
              <button type="button" onClick={() => setFormMov(null)} className="text-[#fff]/50 hover:text-[#fff]"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Tipo</span>
                <select value={formMov.tipo} onChange={(e) => setFormMov({ ...formMov, tipo: e.target.value as TipoMovimiento })} className={inputCls}>
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                  <option value="traslado">Traslado entre cuentas</option>
                </select></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Fecha</span>
                <input type="date" value={formMov.fecha} onChange={(e) => setFormMov({ ...formMov, fecha: e.target.value })} className={inputCls} /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>{formMov.tipo === "traslado" ? "Cuenta origen" : "Cuenta"}</span>
                <select value={formMov.cuenta_id} onChange={(e) => setFormMov({ ...formMov, cuenta_id: e.target.value })} className={inputCls}>
                  {cuentas.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                </select></label>
              {formMov.tipo === "traslado" && (
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Cuenta destino</span>
                  <select value={formMov.cuenta_destino_id} onChange={(e) => setFormMov({ ...formMov, cuenta_destino_id: e.target.value })} className={inputCls}>
                    <option value="">— Selecciona —</option>
                    {cuentas.filter((c) => c.id !== formMov.cuenta_id).map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
                  </select></label>
              )}
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor {movMonedaOrigen ? `(${movMonedaOrigen})` : ""}</span>
                <MoneyInput value={formMov.valor} onChange={(n) => setFormMov({ ...formMov, valor: n })} className={inputCls} /></label>
              {formMov.tipo !== "traslado" && (
                <label className="flex flex-col gap-1.5"><span className={lblCls}>Categoría</span>
                  <select value={formMov.categoria} onChange={(e) => setFormMov({ ...formMov, categoria: e.target.value })} className={inputCls}>
                    <option value="">— Sin categoría —</option>
                    {CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
                  </select></label>
              )}
              {formMov.tipo !== "traslado" && (
                <>
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>IVA</span>
                    <select value={formMov.iva_tipo} onChange={(e) => setFormMov({ ...formMov, iva_tipo: e.target.value as TipoIVA })} className={inputCls}>
                      <option value="na">{IVA_LABEL.na}</option>
                      <option value="incluido">{IVA_LABEL.incluido}</option>
                      <option value="exento">{IVA_LABEL.exento}</option>
                    </select></label>
                  {formMov.iva_tipo === "incluido" && (
                    <label className="flex flex-col gap-1.5"><span className={lblCls}>Valor del IVA</span>
                      <MoneyInput value={formMov.iva_valor} onChange={(n) => setFormMov({ ...formMov, iva_valor: n })} className={inputCls} /></label>
                  )}
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>{formMov.tipo === "ingreso" ? "Costo de transferencia" : "Fee / costo bancario"}</span>
                    <MoneyInput value={formMov.costo} onChange={(n) => setFormMov({ ...formMov, costo: n })} className={inputCls} /></label>
                  {/* La TRM solo tiene sentido si el movimiento NO está en pesos colombianos. */}
                  {formMov.tipo === "ingreso" && movMonedaOrigen !== "COP" && (
                    <label className="flex flex-col gap-1.5">
                      <span className={`${lblCls} flex items-center gap-1.5`}>
                        TRM del día
                        <Ayuda texto="La TRM no se descarga automáticamente ni se actualiza sola: la escribes tú y queda congelada en este movimiento. Si el pago aún no llega, déjalo Pendiente con la TRM estimada; al hacerse efectivo registra la TRM real que aplicó el banco (suele ser menor) y el valor realmente recibido." />
                      </span>
                      <input type="number" step="0.0001" min="0" value={formMov.tasa || ""} onChange={(e) => setFormMov({ ...formMov, tasa: Number(e.target.value) })} className={inputCls} placeholder="Ej: 4000" /></label>
                  )}

                  {/* Liquidación real: al hacerse efectivo, lo recibido puede diferir por costos y TRM del banco. */}
                  {formMov.tipo === "ingreso" && formMov.estado === "realizado" && movMonedaOrigen !== "COP" && (
                    <>
                      <label className="flex flex-col gap-1.5">
                        <span className={`${lblCls} flex items-center gap-1.5`}>
                          TRM real del banco
                          <Ayuda texto="Tasa que realmente aplicó el banco o la plataforma al convertir. Casi siempre es MENOR a la TRM del día (spread). Si no la conoces, un estimado prudente es entre 2% y 4% por debajo de la TRM del día." />
                        </span>
                        <input type="number" step="0.0001" min="0" value={formMov.tasa_real || ""} onChange={(e) => setFormMov({ ...formMov, tasa_real: Number(e.target.value) })} className={inputCls} placeholder={formMov.tasa ? `Sug. ${Math.round(formMov.tasa * 0.97)}` : "Ej: 3880"} /></label>
                      <label className="flex flex-col gap-1.5">
                        <span className={`${lblCls} flex items-center gap-1.5`}>
                          Valor realmente recibido
                          <Ayuda texto="Lo que efectivamente entró a la cuenta después de costos de transferencia y conversión. Si lo dejas vacío se asume valor − costo." />
                        </span>
                        <MoneyInput value={formMov.valor_real} onChange={(n) => setFormMov({ ...formMov, valor_real: n })} className={inputCls} /></label>
                    </>
                  )}
                </>
              )}

              {/* Traslado: costo de plataforma + (cross-moneda) tasa y valor destino */}
              {formMov.tipo === "traslado" && (
                <>
                  <label className="flex flex-col gap-1.5"><span className={lblCls}>Costo / comisión plataforma</span>
                    <MoneyInput value={formMov.costo} onChange={(n) => setFormMov({ ...formMov, costo: n })} className={inputCls} /></label>
                  {trasladoCrossMoneda && (
                    <>
                      <label className="flex flex-col gap-1.5">
                        <span className={`${lblCls} flex items-center gap-1.5`}>
                          Tasa {movMonedaOrigen}→{movMonedaDestino} (del día)
                          <Ayuda texto="TRM de referencia del día. La escribes tú; no se descarga automáticamente." />
                        </span>
                        <input type="number" step="0.0001" min="0" value={formMov.tasa || ""} onChange={(e) => setFormMov({ ...formMov, tasa: Number(e.target.value) })} className={inputCls} placeholder="Ej: 4000" /></label>
                      <label className="flex flex-col gap-1.5">
                        <span className={`${lblCls} flex items-center gap-1.5`}>
                          Tasa real que aplicó la empresa
                          <Ayuda texto="La plataforma o banco que hace la transferencia suele liquidar a una tasa MENOR que la TRM del día. Si no la conoces, usa entre 2% y 4% por debajo de la TRM (el sugerido ya viene calculado)." />
                        </span>
                        <input type="number" step="0.0001" min="0" value={formMov.tasa_real || ""} onChange={(e) => setFormMov({ ...formMov, tasa_real: Number(e.target.value) })} className={inputCls} placeholder={formMov.tasa ? `Sug. ${Math.round(formMov.tasa * 0.97)}` : "Ej: 3880"} /></label>
                      <label className="flex flex-col gap-1.5"><span className={lblCls}>Llega al destino ({movMonedaDestino})</span>
                        <MoneyInput
                          value={formMov.valor_destino || (formMov.valor && formMov.tasa ? Math.round(formMov.valor * formMov.tasa - (formMov.costo || 0)) : 0)}
                          onChange={(n) => setFormMov({ ...formMov, valor_destino: n })}
                          className={inputCls} placeholder="valor × tasa − costo" /></label>
                    </>
                  )}
                  <p className="sm:col-span-2 rounded-lg bg-amber-400/10 px-3 py-2 text-[11px] text-amber-200/90">
                    Deja el traslado como <b>Pendiente</b> hasta validar la tasa del día y el costo real; luego márcalo <b>Realizado</b>.
                  </p>
                </>
              )}

              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Concepto</span>
                <textarea rows={3} value={formMov.concepto} onChange={(e) => setFormMov({ ...formMov, concepto: e.target.value })} className={inputCls} placeholder="Describe el movimiento con el detalle que necesites…" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Contraparte</span>
                <input value={formMov.contraparte} onChange={(e) => setFormMov({ ...formMov, contraparte: e.target.value })} className={inputCls} placeholder="De quién / a quién (texto libre)" /></label>
              <label className="flex flex-col gap-1.5"><span className={lblCls}>Referencia (opcional)</span>
                <input value={formMov.referencia} onChange={(e) => setFormMov({ ...formMov, referencia: e.target.value })} className={inputCls} placeholder="N.º transferencia / factura" /></label>
              <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Estado</span>
                <select value={formMov.estado} onChange={(e) => setFormMov({ ...formMov, estado: e.target.value as "pendiente" | "realizado" })} className={inputCls}>
                  <option value="realizado">Realizado</option>
                  <option value="pendiente">Pendiente (por cobrar / pagar / trasladar)</option>
                </select></label>

              {/* Pendiente: fecha probable de pago → sirve de recordatorio en Cuentas por pagar/cobrar. */}
              {formMov.estado === "pendiente" && (
                <label className="flex flex-col gap-1.5 sm:col-span-2"><span className={lblCls}>Fecha probable de {formMov.tipo === "ingreso" ? "cobro" : "pago"}</span>
                  <input type="date" value={formMov.fecha_estimada} onChange={(e) => setFormMov({ ...formMov, fecha_estimada: e.target.value })} className={inputCls} />
                  <span className="text-[10px] text-[#fff]/45">Se usa como recordatorio en <b className="text-[#fff]/65">Cuentas por {formMov.tipo === "ingreso" ? "cobrar" : "pagar"}</b> del dashboard. Al marcarlo como realizado, desaparece de la lista.</span></label>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setFormMov(null)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">Cancelar</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        abierto={!!confirmar}
        titulo={confirmar?.titulo ?? ""}
        mensaje={confirmar?.mensaje ?? ""}
        confirmLabel="Eliminar"
        tone="danger"
        cargando={confirmLoading}
        onConfirm={() => confirmar?.run()}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  )
}

/** Barras horizontales por categoría (participación sobre el total). */
function CategoriaBarras({ titulo, data, total, color }: { titulo: string; data: { cat: string; valor: number }[]; total: number; color: string }) {
  const max = Math.max(1, ...data.map((d) => d.valor))
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-xs font-semibold text-[#fff]/70">{titulo}</h3>
        <span className="text-xs font-semibold" style={{ color }}>{formatMoneda(total, "COP")}</span>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-[#fff]/40">Sin movimientos este año.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((d) => (
            <div key={d.cat}>
              <div className="mb-0.5 flex items-baseline justify-between text-[11px]">
                <span className="text-[#fff]/70">{CATEGORIA_LABEL[d.cat] ?? d.cat}</span>
                <span className="text-[#fff]/55">{formatMoneda(d.valor, "COP")}{total > 0 ? ` · ${Math.round((d.valor / total) * 100)}%` : ""}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full" style={{ width: `${(d.valor / max) * 100}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Barras de ingresos (verde) vs egresos (rojo) por mes. SVG puro, sin dependencias. */
function MiniBarras({ data, moneda }: { data: { label: string; ingresos: number; egresos: number }[]; moneda: Moneda }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.ingresos, d.egresos]))
  const W = 360, H = 120
  const groupW = W / Math.max(1, data.length)
  const barW = Math.min(16, (groupW - 8) / 2)
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full" role="img" aria-label={`Ingresos vs egresos por mes (${moneda})`}>
      <line x1={0} y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      {data.map((d, i) => {
        const gx = i * groupW + groupW / 2
        const hi = (d.ingresos / max) * H
        const he = (d.egresos / max) * H
        return (
          <g key={i}>
            <rect x={gx - barW - 1} y={H - hi} width={barW} height={hi} rx={2} fill="#34d399" />
            <rect x={gx + 1} y={H - he} width={barW} height={he} rx={2} fill="#f87171" />
            <text x={gx} y={H + 12} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}
