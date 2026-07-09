import { NextResponse } from "next/server"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { getEmpleadoById, subirCertificadoEmpleado, getCertificadoEmpleado, type TipoCertificado } from "@/lib/empleados/queries"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024
const TIPOS: TipoCertificado[] = ["eps", "cesantias", "pension"]
const CAMPO = { eps: "cert_eps_path", cesantias: "cert_cesantias_path", pension: "cert_pension_path" } as const

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

/** POST multipart (campos "archivo" y "tipo"): sube un certificado de afiliación. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const { id } = await params
  if (!(await getEmpleadoById(id))) return NextResponse.json({ error: "Empleado no encontrado." }, { status: 404 })

  const form = await req.formData()
  const tipo = String(form.get("tipo") || "") as TipoCertificado
  if (!TIPOS.includes(tipo)) return NextResponse.json({ error: "Tipo de certificado inválido." }, { status: 400 })
  const file = form.get("archivo")
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo." }, { status: 400 })
  if (file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "Archivo vacío o mayor a 10 MB." }, { status: 400 })
  const mime = file.type || "application/pdf"
  if (!/pdf|image\//.test(mime)) return NextResponse.json({ error: "Solo PDF o imagen." }, { status: 400 })

  try {
    const empleado = await subirCertificadoEmpleado(id, tipo, new Uint8Array(await file.arrayBuffer()), mime)
    return NextResponse.json({ empleado })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al subir."
    const falta = /bucket|not found/i.test(msg)
    return NextResponse.json({ error: falta ? "Falta el bucket privado 'contratos' en Supabase → Storage." : msg }, { status: falta ? 409 : 500 })
  }
}

/** GET ?tipo=eps|cesantias|pension : descarga el certificado. Solo el CEO. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error

  const { id } = await params
  const tipo = new URL(req.url).searchParams.get("tipo") as TipoCertificado
  if (!TIPOS.includes(tipo)) return NextResponse.json({ error: "Tipo inválido." }, { status: 400 })
  const empleado = await getEmpleadoById(id)
  const path = empleado?.[CAMPO[tipo]]
  if (!path) return NextResponse.json({ error: "Sin certificado." }, { status: 404 })

  const { bytes, mime } = await getCertificadoEmpleado(path)
  return new Response(Buffer.from(bytes), {
    headers: { "Content-Type": mime, "Content-Disposition": `inline; filename="cert-${tipo}-${empleado?.cedula}"`, "Cache-Control": "private, no-store" },
  })
}
