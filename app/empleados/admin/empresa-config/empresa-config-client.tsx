"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Loader2, Save } from "lucide-react"
import { CAJAS_COMPENSACION } from "@/lib/empleados/catalogos-co"

const inputCls = "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
const lblCls = "text-[11px] font-semibold uppercase tracking-wide text-[#fff]/50"

export function EmpresaConfigClient() {
  const [caja, setCaja] = useState("")
  const [arl, setArl] = useState("")
  const [fundacion, setFundacion] = useState("")
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await fetch("/api/empleados/admin/empresa-config")
        const data = await res.json()
        if (cancel) return
        if (res.ok) { setCaja(data.config?.caja_compensacion ?? ""); setArl(data.config?.arl ?? ""); setFundacion(data.config?.fecha_fundacion ?? "") }
        else setError(data.error || "Error al cargar.")
      } finally {
        if (!cancel) setCargando(false)
      }
    })()
    return () => { cancel = true }
  }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true); setError(""); setMsg("")
    try {
      const res = await fetch("/api/empleados/admin/empresa-config", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caja_compensacion: caja || null, arl: arl || null, fecha_fundacion: fundacion || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("✓ Datos de la empresa guardados.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally { setGuardando(false) }
  }

  return (
    <div>
      <Link href="/empleados/admin/talento" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver a Talento Humano
      </Link>
      <div className="mb-2 flex items-center gap-2.5">
        <Building2 size={20} className="text-[var(--cyan)]" />
        <h1 className="font-display text-xl font-bold">Datos de la empresa</h1>
      </div>
      <p className="mb-6 text-sm text-[#fff]/55">Configuración común a toda la empresa (aplica a todos los empleados).</p>

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <form onSubmit={guardar} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Caja de compensación</span>
              <input list="cat-cajas" value={caja} onChange={(e) => setCaja(e.target.value)} placeholder="Elige o escribe…" className={inputCls} />
              <datalist id="cat-cajas">{CAJAS_COMPENSACION.map((x) => <option key={x} value={x} />)}</datalist>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>ARL (riesgos laborales)</span>
              <input value={arl} onChange={(e) => setArl(e.target.value)} placeholder="Ej: SURA, Positiva, Colmena…" className={inputCls} />
              <span className="text-[11px] text-[#fff]/40">Aparece como parte del contrato de los empleados.</span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={lblCls}>Fecha de fundación</span>
              <input type="date" value={fundacion} onChange={(e) => setFundacion(e.target.value)} className={inputCls} />
              <span className="text-[11px] text-[#fff]/40">Referencia para la historia laboral.</span>
            </label>
          </div>

          {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          {msg && <p className="mt-3 rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{msg}</p>}

          <button type="submit" disabled={guardando} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
          </button>
        </form>
      )}
    </div>
  )
}
