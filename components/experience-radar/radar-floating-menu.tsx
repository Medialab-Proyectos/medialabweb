"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Radar, Newspaper, Search, X, Bell, BellRing, BellOff, Loader2 } from "lucide-react"
import { useRadarPush } from "./use-radar-push"

const SEEN_KEY = "radar:seenUpdate"

/**
 * Menú flotante del Experience Radar (reemplaza la miga de pan). Acceso rápido a:
 *  - Inicio del Radar (`/experience-radar`)
 *  - Todas las notas del especial (`/experience-radar/mundial-2026`)
 *  - Buscador: navega al listado con `?q=` para filtrar las notas.
 *  - Campana "avísame": activa las notificaciones push; muestra un punto rojo cuando hay
 *    un análisis más nuevo que el último visto (según `latestUpdatedAt`).
 * Fijo abajo-derecha, sobre el contenido, en móvil y desktop.
 */
export function RadarFloatingMenu({ latestUpdatedAt }: { latestUpdatedAt?: string }) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState("")
  const { state, enable } = useRadarPush({ autoPrompt: true })
  const [hasNew, setHasNew] = useState(false)

  // Punto rojo "hay algo nuevo": el último análisis es más reciente que el último visto.
  useEffect(() => {
    if (!latestUpdatedAt) return
    try {
      const seen = localStorage.getItem(SEEN_KEY)
      setHasNew(!seen || new Date(latestUpdatedAt).getTime() > new Date(seen).getTime())
    } catch {
      // sin localStorage (modo privado, etc.): no mostramos el punto.
    }
  }, [latestUpdatedAt])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    router.push(`/experience-radar/mundial-2026${term ? `?q=${encodeURIComponent(term)}` : ""}`)
  }

  // Tap en la campana: marca como visto (quita el punto) y, si no está activo, pide permiso.
  const onBell = () => {
    try {
      if (latestUpdatedAt) localStorage.setItem(SEEN_KEY, latestUpdatedAt)
    } catch {
      // ignora si no hay localStorage
    }
    setHasNew(false)
    if (state === "idle") void enable()
  }

  const itemClass =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-[var(--cyan)]/15 hover:text-[var(--cyan)]"

  const showBell = state !== "loading" && state !== "unsupported"
  const bellTitle =
    state === "blocked"
      ? "Notificaciones bloqueadas en este navegador"
      : state === "subscribed"
        ? "Notificaciones activadas"
        : "Avísame de cada nuevo análisis"

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {searchOpen && (
        <form
          onSubmit={submit}
          className="flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1.5 pl-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md"
        >
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar notas…"
            aria-label="Buscar notas"
            className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-48"
          />
          <button type="submit" aria-label="Buscar" className={itemClass}>
            <Search size={18} />
          </button>
        </form>
      )}

      <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1.5 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
        <Link href="/experience-radar" aria-label="Inicio Experience Radar" title="Inicio Experience Radar" className={itemClass}>
          <Radar size={18} />
        </Link>
        <Link
          href="/experience-radar/mundial-2026"
          aria-label="Volver al especial"
          title="Volver al especial"
          className={itemClass}
        >
          <Newspaper size={18} />
        </Link>
        <button
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          aria-label={searchOpen ? "Cerrar buscador" : "Buscar"}
          title="Buscar"
          aria-expanded={searchOpen}
          className={itemClass}
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        {showBell && (
          <button
            type="button"
            onClick={onBell}
            disabled={state === "working"}
            aria-label={bellTitle}
            title={bellTitle}
            className={`${itemClass} disabled:opacity-60 ${state === "subscribed" ? "text-[var(--magenta)]" : ""}`}
          >
            {state === "working" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : state === "blocked" ? (
              <BellOff size={18} />
            ) : state === "subscribed" ? (
              <BellRing size={18} />
            ) : (
              <Bell size={18} />
            )}
            {hasNew && (
              <span
                aria-hidden
                className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#DC2626] ring-2 ring-card"
              />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
