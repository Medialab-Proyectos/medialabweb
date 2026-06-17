import { NextRequest, NextResponse } from "next/server"
import { getLikeCount, changeLike } from "@/src/lib/experience-radar/likeStore"

/**
 * Likes COMPARTIDOS de una nota del Experience Radar.
 *  - GET  ?slug=...            → { slug, count } (conteo global actual).
 *  - POST { slug, delta: 1|-1 } → { slug, count } tras aplicar el like/unlike.
 * La deduplicación por persona (un like por navegador) la maneja el cliente con
 * localStorage; aquí solo se mantiene el contador global.
 */
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")?.trim()
  if (!slug) return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 })
  const count = await getLikeCount(slug)
  return NextResponse.json({ ok: true, slug, count }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { slug?: string; delta?: number }
    const slug = body.slug?.trim()
    if (!slug) return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 })
    const delta = body.delta && body.delta < 0 ? -1 : 1
    const count = await changeLike(slug, delta)
    return NextResponse.json({ ok: true, slug, count }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
