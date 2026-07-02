"use client"

import { useState } from "react"
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react"

export function CambiarClaveCard({ obligatorio }: { obligatorio: boolean }) {
  const [open, setOpen] = useState(obligatorio)
  const [actual, setActual] = useState("")
  const [nueva, setNueva] = useState("")
  const [confirma, setConfirma] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (nueva !== confirma) return setError("Las contraseñas nuevas no coinciden.")
    if (nueva.length < 8) return setError("La nueva contraseña debe tener al menos 8 caracteres.")
    setLoading(true)
    try {
      const res = await fetch("/api/empleados/cambiar-clave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual, nueva }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo cambiar la contraseña.")
      } else {
        setOk(true)
        setActual(""); setNueva(""); setConfirma("")
      }
    } catch {
      setError("Error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  if (ok) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] px-5 py-4 text-sm text-emerald-200">
        <CheckCircle2 size={16} /> Contraseña actualizada correctamente.
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-[#fff]/70 transition hover:bg-white/5"
      >
        <KeyRound size={13} /> Cambiar mi contraseña
      </button>
    )
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 flex items-center gap-2">
        <KeyRound size={16} className="text-[var(--cyan)]" />
        <h3 className="text-sm font-semibold">
          {obligatorio ? "Crea tu contraseña definitiva" : "Cambiar contraseña"}
        </h3>
      </div>
      {obligatorio && (
        <p className="mb-3 text-xs text-[#fff]/55">
          Estás usando una contraseña temporal. Por seguridad, defínela ahora.
        </p>
      )}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
        <input
          type="password" autoComplete="current-password" placeholder="Contraseña actual" value={actual}
          onChange={(e) => setActual(e.target.value)} required
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-[var(--cyan)]/60"
        />
        <input
          type="password" autoComplete="new-password" placeholder="Nueva contraseña" value={nueva}
          onChange={(e) => setNueva(e.target.value)} required
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-[var(--cyan)]/60"
        />
        <input
          type="password" autoComplete="new-password" placeholder="Repite la nueva" value={confirma}
          onChange={(e) => setConfirma(e.target.value)} required
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-[var(--cyan)]/60"
        />
        {error && <p className="text-sm text-red-300 sm:col-span-3">{error}</p>}
        <div className="flex gap-2 sm:col-span-3">
          <button
            type="submit" disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />} Guardar
          </button>
          {!obligatorio && (
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff]">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
