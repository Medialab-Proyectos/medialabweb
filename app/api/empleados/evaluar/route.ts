import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { listEmpleados, listReportes } from "@/lib/empleados/queries"
import { listHechas, upsertEvaluacion } from "@/lib/empleados/evaluacion-queries"
import { calcularGlobal, COMPETENCIAS } from "@/lib/empleados/evaluacion"

export const runtime = "nodejs"

function falla(msg: string) {
  return /does not exist|column|schema cache|relation|PGRST205/i.test(msg)
}

async function equipoIds(rol: string, sub: string): Promise<{ id: string; nombre: string; cedula: string }[]> {
  if (rol === "ceo") return (await listEmpleados()).filter((e) => e.id !== sub).map((e) => ({ id: e.id, nombre: e.nombre, cedula: e.cedula }))
  return (await listReportes(sub)).map((e) => ({ id: e.id, nombre: e.nombre, cedula: e.cedula }))
}

export async function GET(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  const periodo = new URL(req.url).searchParams.get("periodo") || ""
  try {
    const equipo = await equipoIds(s.rol, s.sub)
    const evaluaciones = periodo ? await listHechas(s.sub, periodo) : []
    return NextResponse.json({ equipo, evaluaciones })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: falla(msg) ? "Falta la tabla evaluaciones (schema.sql) o correr NOTIFY pgrst, 'reload schema';" : msg, equipo: [], evaluaciones: [] }, { status: falla(msg) ? 409 : 500 })
  }
}

const schema = z.object({
  evaluado_id: z.string().uuid(),
  periodo: z.string().regex(/^\d{4}-Q[1-4]$/),
  competencias: z.record(z.string(), z.number().min(0).max(5)),
  fortalezas: z.string().max(2000).nullable().optional(),
  mejoras: z.string().max(2000).nullable().optional(),
  comentarios: z.string().max(2000).nullable().optional(),
  completar: z.boolean().default(false),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  if (b.evaluado_id === s.sub) return NextResponse.json({ error: "No puedes evaluarte a ti mismo." }, { status: 400 })

  try {
    const equipo = await equipoIds(s.rol, s.sub)
    if (!equipo.some((e) => e.id === b.evaluado_id)) {
      return NextResponse.json({ error: "Solo puedes evaluar a las personas a tu cargo." }, { status: 403 })
    }
    // Limpia competencias a las claves válidas.
    const competencias: Record<string, number> = {}
    for (const c of COMPETENCIAS) if (b.competencias[c.clave]) competencias[c.clave] = b.competencias[c.clave]
    const global = calcularGlobal(competencias)

    const evaluacion = await upsertEvaluacion({
      evaluado_id: b.evaluado_id,
      evaluador_id: s.sub,
      periodo: b.periodo,
      estado: b.completar ? "completada" : "abierta",
      puntajes: { competencias, global },
      puntos_mejora: b.mejoras ?? null,
      puntos_criticos: b.fortalezas ?? null,
      comentarios: b.comentarios ?? null,
      completado_en: b.completar ? new Date().toISOString() : null,
    })
    return NextResponse.json({ evaluacion })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: falla(msg) ? "Falta la tabla evaluaciones (schema.sql) o correr NOTIFY pgrst, 'reload schema';" : msg }, { status: falla(msg) ? 409 : 500 })
  }
}
