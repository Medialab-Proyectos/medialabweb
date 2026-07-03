import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, FileSignature, CalendarClock, BadgeCheck, GraduationCap, Gift, ShieldCheck, Clock, ArrowRight, Plane, ClipboardCheck, PiggyBank, Target } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"
import { CambiarClaveCard } from "../cambiar-clave-card"

export const dynamic = "force-dynamic"

type Seccion = {
  key: string
  icon: React.ElementType
  titulo: string
  desc: string
  estado: "activo" | "pronto" | "deshabilitado"
  color: string
  href?: string
}

const secciones: Seccion[] = [
  {
    key: "contrato",
    icon: FileSignature,
    titulo: "Mi contrato",
    desc: "Consulta tus condiciones salariales y el historial de ajustes.",
    estado: "activo",
    color: "var(--cyan)",
    href: "/empleados/contrato",
  },
  {
    key: "desprendibles",
    icon: FileText,
    titulo: "Desprendibles de pago",
    desc: "Descarga tus comprobantes de pago mensuales en PDF.",
    estado: "activo",
    color: "var(--cyan)",
    href: "/empleados/desprendibles",
  },
  {
    key: "prima",
    icon: CalendarClock,
    titulo: "Prima de servicios",
    desc: "Descarga tu comprobante de prima de junio y diciembre.",
    estado: "activo",
    color: "var(--magenta)",
    href: "/empleados/primas",
  },
  {
    key: "cesantias",
    icon: PiggyBank,
    titulo: "Cesantías",
    desc: "Descarga tu comprobante anual de cesantías e intereses.",
    estado: "activo",
    color: "#00BFA6",
    href: "/empleados/cesantias",
  },
  {
    key: "evaluaciones",
    icon: Target,
    titulo: "Mis evaluaciones",
    desc: "Consulta tus evaluaciones de desempeño trimestrales.",
    estado: "activo",
    color: "#8b5cf6",
    href: "/empleados/evaluaciones",
  },
  {
    key: "certificado",
    icon: BadgeCheck,
    titulo: "Certificado laboral",
    desc: "Genera tu certificación laboral con tus fechas y cargo.",
    estado: "activo",
    color: "var(--magenta)",
    href: "/empleados/certificado",
  },
  {
    key: "vacaciones",
    icon: Plane,
    titulo: "Vacaciones y ausencias",
    desc: "Solicita vacaciones, permisos o licencias y consulta tu saldo.",
    estado: "activo",
    color: "#00BFA6",
    href: "/empleados/ausencias",
  },
  {
    key: "cursos",
    icon: GraduationCap,
    titulo: "Cursos",
    desc: "Formaciones y rutas de estudio asignadas.",
    estado: "deshabilitado",
    color: "#8b5cf6",
  },
  {
    key: "beneficios",
    icon: Gift,
    titulo: "Beneficios",
    desc: "Beneficios y reconocimientos otorgados.",
    estado: "deshabilitado",
    color: "#E8751A",
  },
]

export default async function InicioPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  if (!empleado) redirect("/empleados")

  return (
    <>
      <PortalHeader nombre={empleado.nombre} rol={empleado.rol} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Bienvenida */}
        <div className="mb-8">
          <p className="text-sm text-[#fff]/50">Hola,</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{empleado.nombre}</h1>
          <p className="mt-1 text-sm text-[#fff]/60">
            {empleado.cargo || "Colaborador"} ·{" "}
            {empleado.estado === "terminado" ? (
              <span className="text-amber-300/80">Contrato finalizado</span>
            ) : (
              <span className="text-emerald-300/80">Activo</span>
            )}
          </p>
        </div>

        <CambiarClaveCard obligatorio={empleado.must_change_password} />

        {empleado.rol === "ceo" && (
          <Link
            href="/empleados/admin"
            className="mb-8 flex items-center justify-between rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.06] px-5 py-4 transition hover:bg-[var(--cyan)]/[0.1]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cyan)]/15">
                <ShieldCheck size={18} className="text-[var(--cyan)]" />
              </span>
              <div>
                <p className="text-sm font-semibold">Panel de administración</p>
                <p className="text-xs text-[#fff]/55">Empleados, jerarquía y desprendibles de pago.</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[var(--cyan)]" />
          </Link>
        )}

        {(empleado.rol === "lider" || empleado.rol === "ceo") && (
          <Link
            href="/empleados/aprobaciones"
            className="mb-8 flex items-center justify-between rounded-2xl border border-[var(--magenta)]/25 bg-[var(--magenta)]/[0.06] px-5 py-4 transition hover:bg-[var(--magenta)]/[0.1]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--magenta)]/15">
                <ClipboardCheck size={18} className="text-[var(--magenta)]" />
              </span>
              <div>
                <p className="text-sm font-semibold">Aprobaciones de ausencias</p>
                <p className="text-xs text-[#fff]/55">Revisa y decide las solicitudes de tu equipo.</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[var(--magenta)]" />
          </Link>
        )}

        {(empleado.rol === "lider" || empleado.rol === "ceo") && (
          <Link
            href="/empleados/evaluar"
            className="mb-8 flex items-center justify-between rounded-2xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/[0.06] px-5 py-4 transition hover:bg-[#8b5cf6]/[0.1]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b5cf6]/15">
                <Target size={18} className="text-[#8b5cf6]" />
              </span>
              <div>
                <p className="text-sm font-semibold">Evaluar a mi equipo</p>
                <p className="text-xs text-[#fff]/55">Evaluación de desempeño trimestral de tu equipo.</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#8b5cf6]" />
          </Link>
        )}

        {/* Secciones */}
        <div className="grid gap-4 sm:grid-cols-2">
          {secciones.map((s) => {
            const Icon = s.icon
            const off = s.estado === "deshabilitado"
            const activo = s.estado === "activo" && s.href
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${s.color} 16%, transparent)` }}>
                    <Icon size={20} style={{ color: off ? "rgba(255,255,255,0.4)" : s.color }} />
                  </span>
                  {s.estado === "activo" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cyan)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--cyan)]">
                      Entrar <ArrowRight size={10} />
                    </span>
                  ) : s.estado === "pronto" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/55">
                      <Clock size={10} /> Disponible pronto
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/40">Deshabilitado</span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[#fff]">{s.titulo}</h3>
                <p className="text-sm text-[#fff]/55">{s.desc}</p>
              </>
            )
            const cls = `relative flex flex-col gap-3 rounded-2xl border p-5 ${
              off ? "border-white/[0.06] bg-white/[0.02] opacity-60" : "border-white/10 bg-white/[0.04]"
            } ${activo ? "transition hover:border-[var(--cyan)]/40 hover:bg-white/[0.06]" : ""}`
            return activo ? (
              <Link key={s.key} href={s.href!} className={cls}>{inner}</Link>
            ) : (
              <div key={s.key} className={cls}>{inner}</div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-xs text-[#fff]/35">
          MediaLab Ingeniería · Portal interno · Tus datos se tratan conforme a la Ley 1581 (Habeas Data).
        </p>
      </main>
    </>
  )
}
