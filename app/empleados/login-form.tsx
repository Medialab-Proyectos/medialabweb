"use client"

import { useState } from "react"
import Image from "next/image"
import { Lock, User, Loader2, ShieldCheck } from "lucide-react"

export function LoginForm({ configurado }: { configurado: boolean }) {
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/empleados/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión.")
        setLoading(false)
        return
      }
      window.location.href = "/empleados/inicio"
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      {/* Glow de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ background: "radial-gradient(60rem 30rem at 50% -10%, rgba(42,171,179,0.12), transparent 60%)" }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.svg" alt="MediaLab Ingeniería" width={150} height={40} className="h-9 w-auto" unoptimized priority />
          <h1 className="mt-6 font-display text-2xl font-bold">Portal de Empleados</h1>
          <p className="mt-2 text-sm text-[#fff]/55">Acceso privado para colaboradores de MediaLab Ingeniería.</p>
        </div>

        {!configurado ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/[0.07] p-5 text-sm text-amber-200/90">
            El portal aún no está configurado. Falta conectar la base de datos (Supabase) y el secreto de sesión.
            Revisa <code className="rounded bg-black/30 px-1">docs/empleados/README.md</code>.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#fff]/60" htmlFor="cedula">
              Cédula
            </label>
            <div className="relative mb-4">
              <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#fff]/40" />
              <input
                id="cedula"
                inputMode="numeric"
                autoComplete="username"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-9 pr-3 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
                placeholder="Número de cédula"
              />
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#fff]/60" htmlFor="password">
              Contraseña
            </label>
            <div className="relative mb-5">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#fff]/40" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-9 pr-3 text-sm text-[#fff] outline-none transition focus:border-[var(--cyan)]/60"
                placeholder="Tu contraseña"
              />
            </div>

            {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] py-3 text-sm font-semibold text-[#04191b] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-[#fff]/40">
          <Lock size={11} /> Conexión privada. Tus datos están protegidos.
        </p>
      </div>
    </div>
  )
}
