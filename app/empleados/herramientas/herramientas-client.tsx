"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Wrench, Loader2, ExternalLink, Copy, CheckCircle2, Eye, EyeOff, ShieldAlert } from "lucide-react"
import { type Herramienta, NORMAS_USO_HERRAMIENTAS } from "@/lib/empleados/herramienta"

export function HerramientasClient() {
  const [items, setItems] = useState<Herramienta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [verClave, setVerClave] = useState<Record<string, boolean>>({})
  const [copiado, setCopiado] = useState<string>("")

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await fetch("/api/empleados/herramientas")
        const data = await res.json()
        if (cancel) return
        if (res.ok) setItems(data.herramientas ?? [])
        else setError(data.error || "Error al cargar.")
      } finally {
        if (!cancel) setCargando(false)
      }
    })()
    return () => { cancel = true }
  }, [])

  function copiar(id: string, valor: string) {
    navigator.clipboard.writeText(valor)
    setCopiado(id); setTimeout(() => setCopiado(""), 1500)
  }

  return (
    <div>
      <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al inicio
      </Link>
      <div className="mb-2 flex items-center gap-2.5">
        <Wrench size={20} className="text-[#8b5cf6]" />
        <h1 className="font-display text-xl font-bold">Herramientas</h1>
      </div>

      <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-100/90">
        <ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-300" />
        <span>{NORMAS_USO_HERRAMIENTAS}</span>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">Aún no hay herramientas disponibles.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((h) => (
            <section key={h.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">{h.nombre}</h2>
                  {h.url && (
                    <a href={h.url} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#8b5cf6] hover:underline">
                      Abrir <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/50">
                  {h.tipo === "compartida" ? "Cuenta compartida" : "Acceso libre"}
                </span>
              </div>

              {h.tipo === "compartida" && (h.usuario || h.clave) && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {h.usuario && (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-[#fff]/40">Usuario</p>
                        <p className="truncate text-sm text-[#fff]">{h.usuario}</p>
                      </div>
                      <button onClick={() => copiar(`u-${h.id}`, h.usuario!)} className="shrink-0 rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]">
                        {copiado === `u-${h.id}` ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                  {h.clave && (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-[#fff]/40">Contraseña</p>
                        <p className="truncate font-mono text-sm text-[#fff]">{verClave[h.id] ? h.clave : "••••••••"}</p>
                      </div>
                      <div className="flex shrink-0 items-center">
                        <button onClick={() => setVerClave((v) => ({ ...v, [h.id]: !v[h.id] }))} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]">
                          {verClave[h.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => copiar(`p-${h.id}`, h.clave!)} className="rounded-lg p-1.5 text-[#fff]/60 hover:bg-white/5 hover:text-[#fff]">
                          {copiado === `p-${h.id}` ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {h.indicaciones && <p className="mt-3 whitespace-pre-line text-sm text-[#fff]/60">{h.indicaciones}</p>}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
