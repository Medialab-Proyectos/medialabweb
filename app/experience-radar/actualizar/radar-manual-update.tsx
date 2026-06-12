"use client"

import { FormEvent, useState } from "react"

type RunResult = {
  ok?: boolean
  error?: string
  aiAnalysis?: {
    status?: string
    model?: string
    totalTokens?: number
    reason?: string
  }
  articles?: { count?: number }
}

export function RadarManualUpdate() {
  const [secret, setSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)

  async function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/experience-radar/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      })
      const data = await response.json() as RunResult
      setResult(data)
      if (response.ok) setSecret("")
    } catch {
      setResult({ ok: false, error: "No fue posible conectar con el radar." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          MediaLab
        </p>
        <h1 className="mt-3 text-2xl font-bold">Actualizar Experience Radar</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Ejecuta manualmente la recoleccion de datos y el analisis con ChatGPT.
        </p>

        <form className="mt-7 space-y-4" onSubmit={run}>
          <label className="block text-sm font-medium" htmlFor="cron-secret">
            Clave privada
          </label>
          <input
            id="cron-secret"
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            autoComplete="off"
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading || !secret}
            className="h-12 w-full rounded-xl bg-primary px-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analizando..." : "Actualizar radar"}
          </button>
        </form>

        {result && (
          <div className={`mt-5 rounded-xl p-4 text-sm ${result.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-destructive/10 text-destructive"}`}>
            {result.ok ? (
              <div className="space-y-1">
                <p className="font-semibold">Actualizacion completada</p>
                <p>IA: {result.aiAnalysis?.status ?? "sin diagnostico"}</p>
                <p>Modelo: {result.aiAnalysis?.model ?? "no informado"}</p>
                <p>Tokens: {result.aiAnalysis?.totalTokens ?? 0}</p>
                <p>Notas actualizadas: {result.articles?.count ?? 0}</p>
              </div>
            ) : (
              <p>{result.error === "unauthorized" ? "La clave privada no es correcta." : result.error}</p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
