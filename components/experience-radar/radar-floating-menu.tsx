"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Radar, Newspaper, Search, X } from "lucide-react"

/**
 * Menú flotante del Experience Radar (reemplaza la miga de pan). Acceso rápido a:
 *  - Inicio del Radar (`/experience-radar`)
 *  - Todas las notas del especial (`/experience-radar/mundial-2026`)
 *  - Buscador: navega al listado con `?q=` para filtrar las notas.
 * Fijo abajo-derecha, sobre el contenido, en móvil y desktop.
 */
export function RadarFloatingMenu() {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    router.push(`/experience-radar/mundial-2026${term ? `?q=${encodeURIComponent(term)}` : ""}`)
  }

  const itemClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--cyan)]/10 hover:text-[var(--cyan)]"

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {searchOpen && (
        <form
          onSubmit={submit}
          className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1.5 pl-4 shadow-lg backdrop-blur"
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

      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur">
        <Link href="/experience-radar" aria-label="Inicio del Radar" title="Inicio del Radar" className={itemClass}>
          <Radar size={18} />
        </Link>
        <Link
          href="/experience-radar/mundial-2026"
          aria-label="Todas las notas"
          title="Todas las notas"
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
      </div>
    </div>
  )
}
