"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart } from "lucide-react"

function stableBase(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 33 + slug.charCodeAt(i)) % 1501
  return hash
}

function formatCount(value: number): string {
  if (value < 1000) return String(value)
  const compact = value / 1000
  return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}K`
}

export function ArticleLike({ slug }: { slug: string }) {
  const base = useMemo(() => stableBase(slug), [slug])
  const countKey = `experience-radar:like-count:${slug}`
  const likedKey = `experience-radar:liked:${slug}`
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(base)

  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(countKey)
      const storedLiked = localStorage.getItem(likedKey) === "1"
      setCount(storedCount ? Math.max(0, Number(storedCount) || base) : base)
      setLiked(storedLiked)
    } catch {
      setCount(base)
    }
  }, [base, countKey, likedKey])

  function toggleLike() {
    setLiked((current) => {
      const nextLiked = !current
      setCount((currentCount) => {
        const nextCount = Math.max(0, currentCount + (nextLiked ? 1 : -1))
        try {
          localStorage.setItem(countKey, String(nextCount))
          localStorage.setItem(likedKey, nextLiked ? "1" : "0")
        } catch {}
        return nextCount
      })
      return nextLiked
    })
  }

  return (
    <button
      type="button"
      onClick={toggleLike}
      aria-pressed={liked}
      aria-label={liked ? "Quitar like" : "Dar like"}
      title={liked ? "Quitar like" : "Me gusta este analisis"}
      className={`mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
        liked
          ? "border-[var(--magenta)] bg-[var(--magenta)] text-white"
          : "border-border bg-card text-card-foreground hover:border-[var(--magenta)] hover:text-[var(--magenta)]"
      }`}
    >
      <Heart size={14} className={liked ? "fill-current" : ""} />
      <span>{formatCount(count)}</span>
    </button>
  )
}
