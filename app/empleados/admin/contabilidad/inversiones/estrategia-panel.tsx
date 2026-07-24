"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Lightbulb, CheckCircle2, Circle, PlayCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { formatMoneda } from "@/lib/empleados/contabilidad"
import { calcularPosicion, construirEscalera, recomendacion } from "@/lib/empleados/estrategia-inversion"

export type DatosEstrategia = {
  caja: number
  devengadoMes: number
  freelanceMes: number
  tieneMovimientos: boolean
}

const TONO = {
  rojo: { borde: "border-red-400/30", fondo: "bg-red-400/[0.07]", texto: "text-red-200" },
  ambar: { borde: "border-amber-400/30", fondo: "bg-amber-400/[0.07]", texto: "text-amber-200" },
  verde: { borde: "border-emerald-400/30", fondo: "bg-emerald-400/[0.07]", texto: "text-emerald-200" },
}

/** Vehículos del mercado colombiano: para qué sirve cada uno (sin tasas: cambian cada semana). */
const VEHICULOS = [
  { n: "Cuenta de ahorro / neobanco", liq: "Inmediata", riesgo: "Muy bajo", uso: "Colchón del mes. No es inversión, es liquidez.", ojo: "Suele rendir por debajo de la inflación." },
  { n: "FIC de liquidez (mercado monetario)", liq: "Diaria (T+0/T+1)", riesgo: "Muy bajo", uso: "Reserva operativa. El mejor lugar para caja que puedes necesitar.", ojo: "Compara el rendimiento NETO: la comisión de administración se descuenta." },
  { n: "CDT", liq: "Ninguna hasta el vencimiento", riesgo: "Bajo (cubierto por FOGAFÍN hasta el tope)", uso: "Plata con fecha cierta (ej. provisión de prima).", ojo: "Usa escalera de 3 tramos para no quedar ilíquido ni casado con una tasa." },
  { n: "FIC de renta fija", liq: "Media (revisa pacto de permanencia)", riesgo: "Bajo–medio", uso: "Excedente a 6–12 meses.", ojo: "El valor de la unidad puede bajar; no está cubierto por FOGAFÍN." },
  { n: "Fondos inmobiliarios (tipo PEI)", liq: "Baja — salir toma meses", riesgo: "Medio", uso: "Excedente estructural a 5+ años.", ojo: "La baja liquidez es lo que más se subestima." },
  { n: "Renta variable / ETFs", liq: "Media", riesgo: "Alto", uso: "Horizonte 5+ años.", ojo: "No es tesorería de empresa; es decisión de patrimonio personal." },
]

/** Panel desplegable con la estrategia de tesorería calculada con los datos reales de la empresa. */
export function EstrategiaPanel({ datos }: { datos: DatosEstrategia }) {
  const [abierto, setAbierto] = useState(false)
  const [verVehiculos, setVerVehiculos] = useState(false)

  const { posicion, escalera, reco } = useMemo(() => {
    const p = calcularPosicion({ caja: datos.caja, devengadoMes: datos.devengadoMes, freelanceMes: datos.freelanceMes })
    const e = construirEscalera(p, { tieneMovimientos: datos.tieneMovimientos })
    return { posicion: p, escalera: e, reco: recomendacion(e, p) }
  }, [datos])

  const t = TONO[reco.tono]
  const cop = (n: number) => formatMoneda(n, "COP")
  const actual = escalera.find((e) => e.estado === "actual")
  const falta = actual?.objetivo != null ? Math.max(0, actual.objetivo - posicion.caja) : 0

  return (
    <section className={`mb-4 rounded-2xl border ${t.borde} ${t.fondo}`}>
      <button onClick={() => setAbierto((v) => !v)} aria-expanded={abierto} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex min-w-0 items-center gap-2.5">
          <Lightbulb size={17} className={`shrink-0 ${t.texto}`} />
          <span className="min-w-0">
            <span className={`block text-sm font-semibold ${t.texto}`}>{reco.titulo}</span>
            <span className="block truncate text-[11px] text-[#fff]/55">
              Caja {cop(posicion.caja)} · costo fijo {cop(posicion.costoFijoMes)}/mes · runway {posicion.runwayMeses.toFixed(1)} meses
            </span>
          </span>
        </span>
        <ChevronDown size={15} className={`shrink-0 text-[#fff]/40 transition ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div className="border-t border-white/10 px-4 py-4">
          <p className="mb-4 text-xs leading-relaxed text-[#fff]/70">{reco.cuerpo}</p>

          {!datos.tieneMovimientos && (
            <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2 text-[11px] leading-relaxed text-amber-200/90">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              No hay movimientos registrados en contabilidad: estos números salen de los saldos iniciales y de los contratos.
              Son un <b>piso</b>, no la foto real. Carga ingresos y egresos para que la estrategia sea confiable.
            </p>
          )}

          {/* Escalera de decisión */}
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#fff]/45">Escalera de decisión · no se salta un escalón</h4>
          <div className="mb-4 flex flex-col gap-1.5">
            {escalera.map((e) => {
              const Icon = e.estado === "hecho" ? CheckCircle2 : e.estado === "actual" ? PlayCircle : Circle
              const color = e.estado === "hecho" ? "text-emerald-300" : e.estado === "actual" ? t.texto : "text-[#fff]/25"
              return (
                <div key={e.n} className={`flex items-start justify-between gap-2 rounded-lg px-2.5 py-1.5 ${e.estado === "actual" ? "bg-white/[0.06]" : ""}`}>
                  <span className="flex min-w-0 items-start gap-2">
                    <Icon size={14} className={`mt-0.5 shrink-0 ${color}`} />
                    <span className="min-w-0">
                      <span className={`block text-xs font-medium ${e.estado === "pendiente" ? "text-[#fff]/45" : "text-[#fff]/85"}`}>{e.n}. {e.titulo}</span>
                      <span className="block text-[10px] text-[#fff]/45">{e.meta} · {e.vehiculo}</span>
                    </span>
                  </span>
                  {e.objetivo != null && <span className="shrink-0 text-[11px] font-semibold text-[#fff]/60">{cop(e.objetivo)}</span>}
                </div>
              )
            })}
          </div>

          {/* Meta inmediata */}
          {actual && actual.objetivo != null && falta > 0 && (
            <div className="mb-4 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <p className="text-[11px] text-[#fff]/60">
                Para completar <b className="text-[#fff]/85">{actual.titulo}</b> faltan <b className={t.texto}>{cop(falta)}</b>.
                {posicion.provisionPrestacionesMes > 0 && <> Aparta además <b className="text-[#fff]/85">{cop(posicion.provisionPrestacionesMes)}/mes</b> para prima y cesantías.</>}
              </p>
            </div>
          )}

          {/* Vehículos del mercado */}
          <button onClick={() => setVerVehiculos((v) => !v)} className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--cyan)] hover:underline">
            <ChevronDown size={12} className={`transition ${verVehiculos ? "rotate-180" : ""}`} />
            {verVehiculos ? "Ocultar" : "Ver"} vehículos del mercado colombiano
          </button>
          {verVehiculos && (
            <div className="flex flex-col gap-2">
              {VEHICULOS.map((v) => (
                <div key={v.n} className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2">
                  <p className="text-xs font-semibold text-[#fff]/85">{v.n}</p>
                  <p className="mt-0.5 text-[10px] text-[#fff]/50">Liquidez: {v.liq} · Riesgo: {v.riesgo}</p>
                  <p className="mt-1 text-[11px] text-[#fff]/65">{v.uso}</p>
                  <p className="mt-0.5 text-[10px] text-amber-200/70">⚠ {v.ojo}</p>
                </div>
              ))}
              <p className="mt-1 text-[10px] leading-relaxed text-[#fff]/40">
                No incluyo tasas: cambian cada semana. Verifica en <b className="text-[#fff]/60">Banco de la República</b> (política, DTF, inflación),
                el <b className="text-[#fff]/60">comparador de FIC de la Superfinanciera</b> y <b className="text-[#fff]/60">FOGAFÍN</b> (cobertura).
                Rendimiento real = nominal − comisión − retención − inflación. Valida el efecto tributario con tu contador.
              </p>
            </div>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#fff]/35">
            <ExternalLink size={10} /> Análisis completo: docs/empleados/analisis-inversiones-crecimiento.md · Esto es análisis de gestión, no asesoría financiera.
          </p>
        </div>
      )}
    </section>
  )
}
