import { NextRequest, NextResponse } from "next/server"

// Checks that a domain actually resolves/responds before running the real
// analysis. Any HTTP response (even 403/404) means the site exists; only a
// DNS/connection failure counts as "not reachable".
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url") || ""
  let normalized = raw.trim()
  if (!normalized) {
    return NextResponse.json({ reachable: false, error: "empty" }, { status: 400 })
  }
  if (!normalized.startsWith("http")) normalized = "https://" + normalized

  let target: string
  try {
    target = new URL(normalized).toString()
  } catch {
    return NextResponse.json({ reachable: false, error: "invalid" })
  }

  const headers = { "User-Agent": "UXGreen-Analyzer/1.0 (medialab.design)" }

  const tryFetch = async (method: "HEAD" | "GET") => {
    const res = await fetch(target, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers,
    })
    return res.status
  }

  try {
    const status = await tryFetch("HEAD")
    return NextResponse.json({ reachable: true, status })
  } catch {
    // Some servers reject HEAD — retry with GET before giving up.
    try {
      const status = await tryFetch("GET")
      return NextResponse.json({ reachable: true, status })
    } catch {
      return NextResponse.json({ reachable: false, error: "unreachable" })
    }
  }
}
