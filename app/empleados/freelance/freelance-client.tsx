"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Save, Send, Upload, Paperclip, FileText, CheckCircle2, Clock, XCircle, Landmark, Download, Wallet, Info } from "lucide-react"
import {
  type FacturaFreelance, type PerfilFreelance, type Moneda,
  ESTADO_FACTURA_LABEL, MONEDAS, formatMoneda,
} from "@/lib/empleados/freelance"
import { type FreelanceModo, FREELANCE_MODO_LABEL } from "@/lib/empleados/types"
import { MESES } from "@/lib/empleados/desprendible"
import { MoneyInput } from "../money-input"

type PagoAcordado = { modo: FreelanceModo; tarifa: number; moneda: Moneda }

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

const estadoStyle: Record<string, string> = {
  enviada: "bg-amber-400/10 text-amber-300",
  pagada: "bg-emerald-400/10 text-emerald-300",
  rechazada: "bg-red-500/10 text-red-300",
}
const EstadoIcon = { enviada: Clock, pagada: CheckCircle2, rechazada: XCircle }

const anioActual = new Date().getFullYear()
const mesActual = new Date().getMonth() + 1

export function FreelanceClient({ nombre, esPrestacion = false }: { nombre: string; esPrestacion?: boolean }) {
  const [perfil, setPerfil] = useState<PerfilFreelance | null>(null)
  const [facturas, setFacturas] = useState<FacturaFreelance[]>([])
  const [pago, setPago] = useState<PagoAcordado | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  // Perfil de pago
  const [moneda, setMoneda] = useState<Moneda>("COP")
  const [banco, setBanco] = useState("")
  const [cuenta, setCuenta] = useState("")
  const [tipoCuenta, setTipoCuenta] = useState("")
  const [titular, setTitular] = useState("")
  const [documento, setDocumento] = useState("")
  const [notas, setNotas] = useState("")
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)

  // Nueva factura
  const [anio, setAnio] = useState(anioActual)
  const [mes, setMes] = useState(mesActual)
  const [numero, setNumero] = useState("")
  const [concepto, setConcepto] = useState("")
  const [valor, setValor] = useState(0)
  const [horas, setHoras] = useState(0)
  const [firma, setFirma] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const soporteRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function aplicarPerfil(p: PerfilFreelance | null) {
    if (!p) return
    setPerfil(p)
    setMoneda(p.moneda); setBanco(p.banco ?? ""); setCuenta(p.cuenta ?? "")
    setTipoCuenta(p.tipo_cuenta ?? ""); setTitular(p.titular ?? ""); setDocumento(p.documento ?? ""); setNotas(p.notas ?? "")
  }

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/freelance")
      const data = await res.json()
      if (res.ok) {
        aplicarPerfil(data.perfil); setFacturas(data.facturas ?? [])
        const p: PagoAcordado | null = data.pago ?? null
        setPago(p)
        // Precarga el valor de la factura cuando el pago es por mes o fijo.
        if (p && (p.modo === "por_mes" || p.modo === "fijo")) {
          setMoneda(p.moneda)
          setValor((v) => v || p.tarifa)
        }
      }
      else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function guardarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setError(""); setMsg(""); setGuardandoPerfil(true)
    try {
      const res = await fetch("/api/empleados/freelance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "perfil", moneda, banco: banco || null, cuenta: cuenta || null,
          tipo_cuenta: tipoCuenta || null, titular: titular || null, documento: documento || null, notas: notas || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      aplicarPerfil(data.perfil)
      setMsg("✓ Datos de pago guardados.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el perfil.")
    } finally {
      setGuardandoPerfil(false)
    }
  }

  async function enviarFactura(e: React.FormEvent) {
    e.preventDefault()
    if (!concepto.trim()) return setError("El concepto de la factura es obligatorio.")
    if (!valor || valor <= 0) return setError("Indica el valor de la factura.")
    if (!firma) return setError("Debes firmar la factura marcando la casilla.")
    setError(""); setMsg(""); setEnviando(true)
    try {
      const res = await fetch("/api/empleados/freelance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "factura", anio, mes, numero: numero || null, concepto: concepto.trim(),
          moneda, valor, horas: pago?.modo === "por_hora" ? (horas || null) : null,
          banco: banco || null, cuenta: cuenta || null,
          tipo_cuenta: tipoCuenta || null, titular: titular || null, firmante: nombre,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNumero(""); setConcepto(""); setValor(0); setHoras(0); setFirma(false)
      setMsg("✓ Factura enviada y firmada. Ya puedes descargarla en PDF.")
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar la factura.")
    } finally {
      setEnviando(false)
    }
  }

  async function subirArchivo(id: string, file: File, tipo: "archivo" | "soporte") {
    setError(""); setMsg("")
    const fd = new FormData(); fd.append("archivo", file)
    try {
      const res = await fetch(`/api/empleados/freelance/${id}/${tipo}`, { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFacturas((prev) => prev.map((f) => (f.id === id ? (data.factura as FacturaFreelance) : f)))
      setMsg(tipo === "soporte" ? "✓ Soporte de prestaciones adjuntado." : "✓ Archivo de factura adjuntado.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el archivo.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/empleados/inicio" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver al inicio
        </Link>
        <div className="flex items-center gap-2.5">
          <FileText size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-xl font-bold">Freelance · Facturación</h1>
        </div>
        <p className="mt-1 text-sm text-[#fff]/55">
          Registra tu factura firmada cada mes; se genera en PDF para descargar y tramitar el pago.
          {esPrestacion && " Como prestación de servicios, adjunta también el soporte de pago de prestaciones sociales (seguridad social)."}
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <>
          {/* Pago acordado (lo define el CEO — solo lectura) */}
          {pago ? (
            <div className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.06] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-[var(--cyan)]" />
                <h2 className="text-sm font-semibold text-[#fff]/80">Tu pago acordado</h2>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className="text-sm text-[#fff]/60">Modalidad: <b className="text-[#fff]/90">{FREELANCE_MODO_LABEL[pago.modo]}</b></span>
                <span className="text-sm text-[#fff]/60">
                  {pago.modo === "por_hora" ? "Valor por hora: " : pago.modo === "por_mes" ? "Valor por mes: " : pago.modo === "por_proyecto" ? "Valor del proyecto: " : "Valor fijo: "}
                  <b className="font-display text-lg text-[var(--cyan)]">{formatMoneda(pago.tarifa, pago.moneda)}</b>
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#fff]/45">
                {pago.modo === "por_hora"
                  ? "Al facturar, multiplica este valor por las horas trabajadas en el mes."
                  : "Este valor se precarga al crear tu factura; puedes ajustarlo si el mes fue distinto."}
              </p>
            </div>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-[#fff]/50">
              Tu pago acordado aún no está definido en el portal. Consúltalo con administración.
            </p>
          )}

          {/* Perfil de pago */}
          <form onSubmit={guardarPerfil} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Landmark size={16} className="text-[var(--cyan)]" />
              <h2 className="text-sm font-semibold text-[#fff]/80">Datos de pago</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Moneda</span>
                <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className={inputCls}>
                  {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Banco</span>
                <input value={banco} onChange={(e) => setBanco(e.target.value)} className={inputCls} placeholder="Banco o entidad" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Número de cuenta</span>
                <input value={cuenta} onChange={(e) => setCuenta(e.target.value)} className={inputCls} placeholder="Cuenta / IBAN" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Tipo de cuenta</span>
                <input value={tipoCuenta} onChange={(e) => setTipoCuenta(e.target.value)} className={inputCls} placeholder="Ahorros / corriente / internacional" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Titular</span>
                <input value={titular} onChange={(e) => setTitular(e.target.value)} className={inputCls} placeholder="Nombre del titular" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Documento del titular</span>
                <input value={documento} onChange={(e) => setDocumento(e.target.value)} className={inputCls} placeholder="Cédula / ID" />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={lblCls}>Notas del pago</span>
                <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} className={inputCls} placeholder="Instrucciones adicionales de pago (banco intermediario, referencia, horario, etc.)" />
              </label>
            </div>
            <button type="submit" disabled={guardandoPerfil} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-[#fff]/85 hover:bg-white/5 disabled:opacity-60">
              {guardandoPerfil ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar datos de pago
            </button>
          </form>

          {/* Nueva factura */}
          <form onSubmit={enviarFactura} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#fff]/80">Nueva factura</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Mes</span>
                <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={inputCls}>
                  {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Año</span>
                <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>N.º de factura (opcional)</span>
                <input value={numero} onChange={(e) => setNumero(e.target.value)} className={inputCls} placeholder="Ej: FE-0012" />
              </label>
              {pago?.modo === "por_hora" && (
                <label className="flex flex-col gap-1.5">
                  <span className={lblCls}>Horas trabajadas</span>
                  <input
                    type="number" step="0.5" min="0" value={horas || ""}
                    onChange={(e) => {
                      const h = Number(e.target.value)
                      setHoras(h)
                      // Valor = horas × tarifa acordada (editable después si hace falta).
                      setValor(Math.round(h * (pago?.tarifa || 0)))
                    }}
                    className={inputCls} placeholder="Ej: 80"
                  />
                  <span className="text-[11px] text-[#fff]/40">× {formatMoneda(pago.tarifa, pago.moneda)} por hora</span>
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className={lblCls}>Valor ({moneda})</span>
                <MoneyInput value={valor} onChange={setValor} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={lblCls}>Concepto *</span>
                <textarea rows={3} value={concepto} onChange={(e) => setConcepto(e.target.value)} className={inputCls} placeholder="Describe los servicios prestados en el mes…" />
              </label>
            </div>

            <label className="mt-4 flex items-start gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-[#fff]/75">
              <input type="checkbox" checked={firma} onChange={(e) => setFirma(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--cyan)]" />
              <span>Firmo digitalmente esta factura como <b className="text-[#fff]">{nombre}</b> y confirmo que los datos son correctos.</span>
            </label>

            <p className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.06] px-3 py-2.5 text-xs leading-relaxed text-[#fff]/75">
              <Info size={14} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
              Recuerda: los pagos por <b className="text-[#fff]">prestación de servicios y freelance</b> se realizan dentro de los <b className="text-[#fff]">cinco (5) primeros días de cada mes</b>.
            </p>

            <button type="submit" disabled={enviando} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
              {enviando ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Enviar factura firmada
            </button>
          </form>

          {/* Historial */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-[#fff]/80">Mis facturas</h2>
            {facturas.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#fff]/50">Aún no has enviado facturas.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {facturas.map((f) => {
                  const Icon = EstadoIcon[f.estado]
                  return (
                    <div key={f.id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium">{MESES[f.mes - 1]} {f.anio} · {formatMoneda(f.valor, f.moneda)}{f.horas ? ` · ${Number(f.horas)}h` : ""}</p>
                        <p className="text-xs text-[#fff]/50">
                          {f.numero ? `N.º ${f.numero} · ` : ""}{f.concepto || "Sin concepto"}
                          {f.observaciones ? ` · "${f.observaciones}"` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={`/api/empleados/freelance/${f.id}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-[#fff]/75 hover:bg-white/5">
                          <Download size={12} /> Factura PDF
                        </a>
                        {esPrestacion && (
                          <>
                            <input
                              ref={(el) => { soporteRefs.current[f.id] = el }}
                              type="file" accept="application/pdf,image/*" className="hidden"
                              onChange={(e) => { const file = e.target.files?.[0]; if (file) subirArchivo(f.id, file, "soporte"); e.target.value = "" }}
                            />
                            {f.soporte_path ? (
                              <a href={`/api/empleados/freelance/${f.id}/soporte`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-200/90 hover:bg-emerald-400/10">
                                <Paperclip size={12} /> Soporte
                              </a>
                            ) : (
                              <button onClick={() => soporteRefs.current[f.id]?.click()} className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 px-2.5 py-1.5 text-xs text-amber-200/90 hover:bg-amber-400/10">
                                <Upload size={12} /> Soporte prestaciones
                              </button>
                            )}
                          </>
                        )}
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[f.estado]}`}>
                          <Icon size={11} /> {ESTADO_FACTURA_LABEL[f.estado]}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
