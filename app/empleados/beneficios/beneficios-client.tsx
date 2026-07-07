"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, HeartPulse, Cake, CalendarClock, Loader2, CheckCircle2, Clock, ExternalLink, Phone } from "lucide-react"
import { type Beneficio, ESTADO_BENEFICIO_LABEL, MEDPLUS } from "@/lib/empleados/beneficio"

export function BeneficiosClient() {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/beneficios")
      const data = await res.json()
      if (res.ok) setBeneficios(data.beneficios ?? [])
      else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  const medicina = beneficios.find((b) => b.tipo === "medicina_prepagada") ?? null

  return (
    <div>
      <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al inicio
      </Link>
      <div className="mb-2 flex items-center gap-2.5">
        <Gift size={20} className="text-[#E8751A]" />
        <h1 className="font-display text-xl font-bold">Beneficios</h1>
      </div>
      <p className="mb-6 text-sm text-[#fff]/55">
        Beneficios de tu vinculación con MediaLab. La medicina prepagada la asigna la empresa; los permisos de media jornada los solicitas tú.
      </p>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="grid gap-4">
          {/* Medicina prepagada — MedPlus (solo si la empresa la asignó) */}
          {medicina && (
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4" style={{ background: `color-mix(in srgb, ${MEDPLUS.color} 10%, transparent)` }}>
              <MedPlusLogo />
              <a href={MEDPLUS.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-[#fff]/60 hover:text-[#fff]">
                Ver planes <ExternalLink size={12} />
              </a>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${MEDPLUS.color} 16%, transparent)` }}>
                  <HeartPulse size={20} style={{ color: MEDPLUS.color }} />
                </span>
                <div>
                  <h2 className="text-base font-semibold">Medicina prepagada · {MEDPLUS.plan}</h2>
                  <p className="mt-0.5 text-sm text-[#fff]/55">
                    Cobertura de salud complementaria con {MEDPLUS.nombre}, asignada por la empresa.
                  </p>
                </div>
              </div>

              {/* Coberturas del plan */}
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {MEDPLUS.coberturas.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-xs text-[#fff]/65">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: MEDPLUS.color }} /> {c}
                  </li>
                ))}
              </ul>

              {/* Teléfonos MedPlus */}
              <div className="mt-3 flex flex-wrap gap-2">
                {MEDPLUS.telefonos.map((t) => (
                  <span key={t.numero} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-[#fff]/60">
                    <Phone size={11} /> {t.label}: <b className="text-[#fff]/80">{t.numero}</b>
                  </span>
                ))}
              </div>

              {medicina && (
                <div className="mt-4 flex flex-col gap-2">
                  <EstadoBadge b={medicina} />
                  {medicina.estado === "solicitado" && (
                    <p className="text-xs text-[#fff]/45">La afiliación está en trámite con {medicina.proveedor || MEDPLUS.nombre}.</p>
                  )}
                </div>
              )}
            </div>
          </section>
          )}

          {/* Permisos de media jornada (se piden en Vacaciones y ausencias) */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00BFA6]/15">
                <Cake size={20} className="text-[#00BFA6]" />
              </span>
              <div>
                <h2 className="text-base font-semibold">Permisos de media jornada</h2>
                <p className="mt-0.5 text-sm text-[#fff]/55">
                  Como beneficio interno tienes derecho a media jornada por tu cumpleaños y a media jornada por eventos especiales. No descuentan de tu saldo de vacaciones.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#fff]/60">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1"><Cake size={11} /> Cumpleaños</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1"><CalendarClock size={11} /> Evento especial</span>
                </div>
                <Link href="/empleados/ausencias" className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#00BFA6]/40 bg-[#00BFA6]/10 px-3 py-2 text-sm font-semibold text-[#00BFA6] hover:bg-[#00BFA6]/20">
                  Solicitar en Vacaciones y ausencias
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

/**
 * Logo de MedPlus: usa /images/medplus.png cuando exista; mientras tanto muestra
 * un wordmark. Para activar el logo oficial, sube el archivo a public/images/medplus.png.
 */
function MedPlusLogo() {
  const [ok, setOk] = useState(true)
  if (ok) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/images/medplus.png" alt="MedPlus" className="h-6 w-auto object-contain" onError={() => setOk(false)} />
  }
  return (
    <span className="text-lg font-bold tracking-tight" style={{ color: MEDPLUS.color }}>
      Med<span className="text-[#fff]">Plus</span>
    </span>
  )
}

function EstadoBadge({ b }: { b: Beneficio }) {
  const map = {
    solicitado: { cls: "bg-amber-400/10 text-amber-300", Icon: Clock },
    activo: { cls: "bg-emerald-400/10 text-emerald-300", Icon: CheckCircle2 },
    inactivo: { cls: "bg-white/5 text-[#fff]/50", Icon: Clock },
  }[b.estado]
  const Icon = map.Icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${map.cls}`}>
      <Icon size={12} /> {ESTADO_BENEFICIO_LABEL[b.estado]}
    </span>
  )
}
