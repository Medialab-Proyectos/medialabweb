import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listHerramientas, getHerramienta, upsertHerramienta, eliminarHerramienta } from "@/lib/empleados/herramienta-queries"
import { notificarEmpleadosActivos } from "@/lib/empleados/notificar"

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
  return { msg: falta ? "Falta correr schema-fase14-herramientas.sql en Supabase." : msg, status: falta ? 409 : 500 }
}

export async function GET() {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const g = await guardCEO()
  if (g.error) return g.error
  try {
    return NextResponse.json({ herramientas: await listHerramientas() })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg, herramientas: [] }, { status: f.status })
  }
}

const schema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().trim().min(1).max(120),
  tipo: z.enum(["compartida", "libre"]).default("compartida"),
  url: z.string().max(300).nullable().optional(),
  usuario: z.string().max(160).nullable().optional(),
  clave: z.string().max(200).nullable().optional(),
  indicaciones: z.string().max(2000).nullable().optional(),
  activa: z.boolean().default(true),
  orden: z.number().int().default(0),
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
    const previa = b.id ? await getHerramienta(b.id) : null
    const herramienta = await upsertHerramienta({
      ...(b.id ? { id: b.id } : {}),
      nombre: b.nombre, tipo: b.tipo, url: b.url ?? null, usuario: b.usuario ?? null,
      clave: b.clave ?? null, indicaciones: b.indicaciones ?? null, activa: b.activa, orden: b.orden,
    })

    // Notifica a los empleados si: es nueva y activa, o cambió la clave, o se reactivó.
    let notificado = false
    const claveCambio = b.tipo === "compartida" && (previa?.clave ?? "") !== (b.clave ?? "")
    if (b.activa && (!previa || claveCambio || (previa && !previa.activa))) {
      const detalle = !previa
        ? `Se agregó la herramienta "${herramienta.nombre}".`
        : claveCambio
          ? `Se actualizaron las credenciales de "${herramienta.nombre}".`
          : `Se reactivó "${herramienta.nombre}".`
      const r = await notificarEmpleadosActivos(
        `Herramientas: ${herramienta.nombre}`,
        `${detalle} Revisa los accesos en el portal: /empleados/herramientas`,
      )
      notificado = r.sent
    }
    return NextResponse.json({ herramienta, notificado })
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
    const previa = await getHerramienta(id)
    await eliminarHerramienta(id)
    // Terminar el uso de una herramienta → avisa a los empleados.
    let notificado = false
    if (previa) {
      const r = await notificarEmpleadosActivos(
        `Herramientas: ${previa.nombre} dada de baja`,
        `Se terminó el uso de la herramienta "${previa.nombre}". Ya no está disponible en el portal.`,
      )
      notificado = r.sent
    }
    return NextResponse.json({ ok: true, notificado })
  } catch (e) {
    const f = faltaTabla(e)
    return NextResponse.json({ error: f.msg }, { status: f.status })
  }
}
