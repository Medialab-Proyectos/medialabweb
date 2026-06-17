"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

function formatCount(value: number): string {
  if (value < 1000) return String(value)
  const compact = value / 1000
  return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}K`
}

/**
 * Like de una nota con contador GLOBAL compartido (API /api/experience-radar/likes, KV).
 * El número que se ve es el total de todos los visitantes. El "un like por persona" se
 * controla por navegador con localStorage (evita que una misma persona infle el conteo),
 * pero la suma vive en el servidor y es visible para todos.
 */
export function ArticleLike({ slug }: { slug: string }) {
  const likedKey = `experience-radar:liked:${slug}`
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [pending, setPending] = useState(false)
  const [showPlus, setShowPlus] = useState(false)

  // Carga el conteo global y el estado "ya di like" de este navegador.
  useEffect(() => {
    let active = true
    try {
      setLiked(localStorage.getItem(likedKey) === "1")
    } catch {}
    fetch(`/api/experience-radar/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d?.count === "number") setCount(d.count)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [slug, likedKey])

  async function toggleLike() {
    if (pending) return
    const nextLiked = !liked
    setPending(true)
    setLiked(nextLiked)
    if (nextLiked) {
      setShowPlus(true)
      window.setTimeout(() => setShowPlus(false), 850)
    }
    try {
      localStorage.setItem(likedKey, nextLiked ? "1" : "0")
    } catch {}
    try {
      const res = await fetch("/api/experience-radar/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, delta: nextLiked ? 1 : -1 }),
      })
      const data = await res.json()
      if (typeof data?.count === "number") setCount(data.count)
    } catch {
      // Si falla la red, revierte el estado local del botón.
      setLiked(!nextLiked)
      try {
        localStorage.setItem(likedKey, !nextLiked ? "1" : "0")
      } catch {}
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggleLike}
      aria-pressed={liked}
      aria-label={liked ? "Quitar like" : "Dar like"}
      title={liked ? "Quitar like" : "Me gusta este analisis"}
      className={`relative mt-1 inline-flex shrink-0 items-center gap-1.5 overflow-visible rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors disabled:opacity-70 ${
        liked
          ? "border-[var(--magenta)] bg-[var(--magenta)] text-white"
          : "border-border bg-card text-card-foreground hover:border-[var(--magenta)] hover:text-[var(--magenta)]"
      }`}
    >
      {showPlus && (
        <span className="pointer-events-none absolute -top-6 right-1 animate-[radar-like-pop_850ms_ease-out_forwards] rounded-full bg-[var(--magenta)] px-2 py-0.5 text-[11px] font-black text-white shadow-lg">
          +1
        </span>
      )}
      <Heart size={14} className={liked ? "fill-current" : ""} />
      <span suppressHydrationWarning>{count === null ? "···" : formatCount(count)}</span>
    </button>
  )
}
