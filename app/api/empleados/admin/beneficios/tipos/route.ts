import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listTiposBeneficio, upsertTipoBeneficio, eliminarTipoBeneficio } from "@/lib/empleados/beneficio-queries"

export const runtime = "nodejs"

async function guardCEO() {
  const s = await getSession()
  if (!s) return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) }
  if (s.rol !== "ceo") return { error: NextResponse.json({ error: "Solo el CEO." }, { status: 403 }) }
  return { session: s }
}

function faltaTabla(e: unknown) {
  const msg = e instanceof Error ? e.message : "Error"
  const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
  return { msg: falta ? "Falta correr schema-fase25-catalogo-beneficios-horas.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

/** Convierte un nombre en slug (a-z0-9_) para el tipo. */
function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "beneficio"
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ tipos: await listTiposBeneficio() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, tipos: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().max(60).optional(),
  nombre: z.string().trim().min(2, "El nombre es obligatorio.").max(120),
  descripcion: z.string().max(1000).nullable().optional(),
  proveedor: z.string().max(120).nullable().optional(),
  activo: z.boolean().default(true),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  try {
    const tipo = await upsertTipoBeneficio({
      ...(b.id ? { id: b.id } : {}),
      slug: b.slug || slugify(b.nombre),
      nombre: b.nombre,
      descripcion: b.descripcion ?? null,
      proveedor: b.proveedor ?? null,
      activo: b.activo,
    })
    return NextResponse.json({ tipo })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}

export async function DELETE(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 })
  try {
    await eliminarTipoBeneficio(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
