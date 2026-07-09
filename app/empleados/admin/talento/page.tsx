import Link from "next/link"
import { Receipt, Gift, ClipboardCheck, Target, ArrowRight, Building2, SmilePlus } from "lucide-react"
import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../../portal-header"
import { ModuleNav } from "../module-nav"
import { AlertBoxes } from "../alert-boxes"

export const dynamic = "force-dynamic"

const HERRAMIENTAS = [
  { href: "/empleados/admin/freelance", icon: Receipt, color: "var(--cyan)", titulo: "Facturas de freelance", desc: "Facturas y prestación de servicios: aprueba, rechaza con motivo y paga." },
  { href: "/empleados/admin/beneficios", icon: Gift, color: "#E8751A", titulo: "Beneficios", desc: "Medicina prepagada y activaciones de beneficios del equipo." },
  { href: "/empleados/aprobaciones", icon: ClipboardCheck, color: "var(--magenta)", titulo: "Aprobaciones de ausencias", desc: "Vacaciones, permisos y licencias por aprobar." },
  { href: "/empleados/evaluar", icon: Target, color: "#8b5cf6", titulo: "Evaluaciones de desempeño", desc: "Evalúa a tu equipo por periodo." },
  { href: "/empleados/admin/satisfaccion", icon: SmilePlus, color: "#00BFA6", titulo: "Satisfacción", desc: "Encuesta a empleados, registro de empresas e indicadores." },
  { href: "/empleados/admin/empresa-config", icon: Building2, color: "var(--cyan)", titulo: "Datos de la empresa", desc: "Configuración común: caja de compensación de toda la empresa." },
]

export default async function TalentoHumanoPage() {
  const sesion = await requireCEO()
  const ceo = await getEmpleadoById(sesion.sub)

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <ModuleNav active="talento" />
        <AlertBoxes />
        <h1 className="mb-1 font-display text-xl font-bold">Talento Humano</h1>
        <p className="mb-6 text-sm text-[#fff]/55">Freelance, beneficios, aprobaciones y evaluaciones del equipo.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {HERRAMIENTAS.map((h) => {
            const Icon = h.icon
            return (
              <Link key={h.href} href={h.href} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[var(--cyan)]/40 hover:bg-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${h.color} 16%, transparent)` }}>
                    <Icon size={20} style={{ color: h.color }} />
                  </span>
                  <ArrowRight size={16} className="text-[#fff]/40" />
                </div>
                <h3 className="text-base font-semibold text-[#fff]">{h.titulo}</h3>
                <p className="text-sm text-[#fff]/55">{h.desc}</p>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
