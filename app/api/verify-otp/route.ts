import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()
    const cookiePin = req.cookies.get("uxbox_otp")?.value

    if (!cookiePin) {
      return NextResponse.json({ valid: false, error: "expired" }, { status: 200 })
    }

    if (typeof pin !== "string" || pin !== cookiePin) {
      return NextResponse.json({ valid: false, error: "mismatch" }, { status: 200 })
    }

    // Consumir el código tras un uso correcto.
    const res = NextResponse.json({ valid: true })
    res.cookies.set("uxbox_otp", "", { httpOnly: true, path: "/", maxAge: 0 })
    return res
  } catch {
    return NextResponse.json({ valid: false, error: "server" }, { status: 500 })
  }
}
