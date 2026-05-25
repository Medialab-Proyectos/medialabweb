import { NextRequest, NextResponse } from "next/server"
import { createSession, getLab } from "@/lib/lab-store"

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()
    const cookieVal = req.cookies.get("uxbox_otp")?.value

    if (!cookieVal) {
      return NextResponse.json({ valid: false, error: "expired" }, { status: 200 })
    }

    const [cookiePin, cookieEmail] = cookieVal.split("|")
    if (typeof pin !== "string" || pin !== cookiePin) {
      return NextResponse.json({ valid: false, error: "mismatch" }, { status: 200 })
    }

    // Pin correcto: recuperar lab existente (retorno cross-device) y crear sesión.
    const lab = cookieEmail ? await getLab(cookieEmail) : null
    const token = cookieEmail ? await createSession(cookieEmail) : null

    const res = NextResponse.json({ valid: true, lab })
    // Consumir el OTP
    res.cookies.set("uxbox_otp", "", { httpOnly: true, path: "/", maxAge: 0 })
    // Sesión para escribir/leer el lab desde /api/lab (solo si KV está configurado)
    if (token) {
      res.cookies.set("uxbox_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    }
    return res
  } catch {
    return NextResponse.json({ valid: false, error: "server" }, { status: 500 })
  }
}
