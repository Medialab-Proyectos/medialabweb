import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { actualizarSaldoVacaciones } from "@/lib/empleados/ausencia-queries"

export const runtime = "nodejs"

const schema = z.object({
  empleado_id: z.string().uuid(),
  saldo_inicial: z.number().min(0).max(365),
  corte: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
})

export async function POST(req: Request) {
  if (!portalConfigurado()) return NextResponse.json({ error: "Portal sin configurar." }, { status: 503 })
  const s = await getSession()
  if (!s) return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  if (s.rol !== "ceo") return NextResponse.json({ error: "Solo el CEO." }, { status: 403 })

  let b: z.infer<typeof schema>
  try {
    b = schema.parse(await req.json())
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Datos inválidos."
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    await actualizarSaldoVacaciones(b.empleado_id, b.saldo_inicial, b.corte ?? null)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    const falta = /schema cache|does not exist|relation|column|PGRST205/i.test(msg)
    return NextResponse.json(
      { error: falta ? "Falta correr schema-fase4-ausencias.sql en Supabase." : msg },
      { status: falta ? 409 : 500 },
    )
  }
}
