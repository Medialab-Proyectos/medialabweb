import "server-only"
import crypto from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { SessionPayload } from "./types"

const COOKIE = "empleados_sesion"
const MAX_AGE = 60 * 60 * 24 // 24 horas

function secret(): string {
  const s = process.env.EMPLEADOS_SESSION_SECRET
  if (!s) throw new Error("Falta EMPLEADOS_SESSION_SECRET en el entorno.")
  return s
}

// ── Contraseñas (scrypt, sin dependencias externas) ──────────────────────────
export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(pw, salt, 64)
  return `${salt.toString("hex")}:${hash.toString("hex")}`
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, hashHex] = (stored || "").split(":")
  if (!saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, "hex")
  const actual = crypto.scryptSync(pw, Buffer.from(saltHex, "hex"), 64)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

/** Contraseña aleatoria legible (sin caracteres ambiguos). */
export function genPassword(len = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  const bytes = crypto.randomBytes(len)
  let out = ""
  for (let i = 0; i < len; i++) out += chars[bytes[i] % chars.length]
  return out
}

// ── Sesión (token firmado HMAC en cookie httpOnly) ───────────────────────────
function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url")
}

export function createToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${body}.${sign(body)}`
}

export function verifyToken(token: string): SessionPayload | null {
  const [body, sig] = (token || "").split(".")
  if (!body || !sig) return null
  const expected = sign(body)
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function setSession(payload: Omit<SessionPayload, "exp">): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE
  const token = createToken({ ...payload, exp })
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function clearSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE)
}

// ── Guards para Server Components ─────────────────────────────────────────────
export async function requireEmpleado(): Promise<SessionPayload> {
  const s = await getSession()
  if (!s) redirect("/empleados")
  return s
}

export async function requireCEO(): Promise<SessionPayload> {
  const s = await getSession()
  if (!s) redirect("/empleados")
  if (s.rol !== "ceo") redirect("/empleados/inicio")
  return s
}
