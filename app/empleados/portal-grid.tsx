import Link from "next/link"
import { FileText, FileSignature, BadgeCheck, GraduationCap, Gift, Clock, ArrowRight, Plane, ClipboardCheck, Target, Receipt, Wrench, SmilePlus, Timer, CalendarClock } from "lucide-react"
import type { Rol, TipoVinculacion, FreelanceModo } from "@/lib/empleados/types"
import { esVinculacionPorFactura, esModoSinValor } from "@/lib/empleados/types"

type Seccion = {
  key: string
  icon: React.ElementType
  titulo: string
  desc: string
  estado: "activo" | "pronto" | "deshabilitado"
  color: string
  href?: string
  /** Solo aplica a vinculación laboral (se oculta a freelancers). */
  laboral?: boolean
  /** Solo para freelancers (se oculta a empleados laborales). */
  soloFreelance?: boolean
}

const secciones: Seccion[] = [
  { key: "freelance", icon: Receipt, titulo: "Freelance · Facturación", desc: "Sube tu factura firmada cada mes y gestiona tus datos de pago.", estado: "activo", color: "var(--cyan)", href: "/empleados/freelance", soloFreelance: true },
  { key: "contrato", icon: FileSignature, titulo: "Mi contrato", desc: "Consulta tus condiciones salariales y el historial de ajustes.", estado: "activo", color: "var(--cyan)", href: "/empleados/contrato", laboral: true },
  { key: "convenio-freelance", icon: FileSignature, titulo: "Mi contrato", desc: "Consulta tu pago acordado y descarga tu convenio de freelance.", estado: "activo", color: "var(--cyan)", href: "/empleados/contrato", soloFreelance: true },
  { key: "desprendibles", icon: FileText, titulo: "Desprendibles", desc: "Desprendibles de pago, prima de servicios y cesantías en un solo lugar.", estado: "activo", color: "var(--cyan)", href: "/empleados/pagos", laboral: true },
  { key: "evaluaciones", icon: Target, titulo: "Mis evaluaciones", desc: "Consulta tus evaluaciones de desempeño trimestrales.", estado: "activo", color: "#8b5cf6", href: "/empleados/evaluaciones", laboral: true },
  { key: "certificado", icon: BadgeCheck, titulo: "Certificado laboral", desc: "Genera tu certificación con tus fechas y cargo (los freelance, sin valor salarial).", estado: "activo", color: "var(--magenta)", href: "/empleados/certificado" },
  { key: "ingresos-retenciones", icon: FileText, titulo: "Ingresos y retenciones", desc: "Descarga tu certificado de ingresos y retenciones (DIAN) por año.", estado: "activo", color: "#8b5cf6", href: "/empleados/ingresos-retenciones", laboral: true },
  { key: "encuesta", icon: SmilePlus, titulo: "Encuesta de satisfacción", desc: "Cuéntanos cómo te sientes en la empresa. Tu opinión ayuda a mejorar.", estado: "activo", color: "#00BFA6", href: "/empleados/satisfaccion" },
  { key: "vacaciones", icon: Plane, titulo: "Permisos y ausencias", desc: "Solicita permisos, licencias o vacaciones (según tu vínculo).", estado: "activo", color: "#00BFA6", href: "/empleados/ausencias" },
  { key: "horas-extras", icon: Timer, titulo: "Horas extra", desc: "Reporta las horas extra que trabajaste; tu líder las aprueba.", estado: "activo", color: "#00BFA6", href: "/empleados/horas-extras", laboral: true },
  { key: "horario", icon: CalendarClock, titulo: "Mi horario", desc: "Registra tu horario de lunes a viernes; tu líder lo aprueba.", estado: "activo", color: "#00BFA6", href: "/empleados/horario", laboral: true },
  { key: "cursos", icon: GraduationCap, titulo: "Cursos", desc: "Formaciones y rutas de estudio en plataformas externas, abiertas a todo el equipo.", estado: "activo", color: "#8b5cf6", href: "/empleados/cursos" },
  { key: "beneficios", icon: Gift, titulo: "Beneficios", desc: "Activa medicina prepagada y pide tus permisos de media jornada.", estado: "activo", color: "#E8751A", href: "/empleados/beneficios" },
  { key: "herramientas", icon: Wrench, titulo: "Herramientas", desc: "Accesos y credenciales de las herramientas del equipo.", estado: "deshabilitado", color: "#8b5cf6" },
]

/** Grilla del portal personal del colaborador (accesos a su contrato, pagos, beneficios…). */
export function PortalGrid({ rol, tipoVinculacion, encuestaHabilitada = false, evaluacionesHabilitadas = false, horarioHabilitado = false, freelanceModo = null }: { rol: Rol; tipoVinculacion: TipoVinculacion; encuestaHabilitada?: boolean; evaluacionesHabilitadas?: boolean; horarioHabilitado?: boolean; freelanceModo?: FreelanceModo | null }) {
  const esFreelance = esVinculacionPorFactura(tipoVinculacion)
  const esAprendizaje = esModoSinValor(freelanceModo)
  const seccionesVisibles = secciones.filter((s) => {
    // Vínculo por aprendizaje: no hay remuneración, así que no factura.
    if (s.key === "freelance" && esAprendizaje) return false
    // Horario y Permisos/ausencias: laborales siempre; freelance/prestación solo si el CEO
    // habilitó el registro de horario en su contrato.
    if (s.key === "horario" || s.key === "vacaciones") return esFreelance ? horarioHabilitado : true
    if (esFreelance ? s.laboral : s.soloFreelance) return false
    // Los módulos deshabilitados / "pronto" solo los ve el CEO; el empleado solo ve los ACTIVOS
    // (los demás se dejan ver únicamente cuando ya tienen contenido y se marcan activos).
    if (rol !== "ceo" && s.estado !== "activo") return false
    // La encuesta de satisfacción solo aparece si el CEO la habilitó (o si eres el CEO).
    if (s.key === "encuesta" && rol !== "ceo" && !encuestaHabilitada) return false
    // Las evaluaciones solo aparecen si el CEO las habilitó (o si eres el CEO).
    if (s.key === "evaluaciones" && rol !== "ceo" && !evaluacionesHabilitadas) return false
    return true
  })

  return (
    <>
      {rol === "lider" && (
        <div className="mb-8 grid gap-2 sm:grid-cols-2">
          <Link href="/empleados/aprobaciones" className="flex items-center justify-between rounded-2xl border border-[var(--magenta)]/25 bg-[var(--magenta)]/[0.06] px-5 py-4 transition hover:bg-[var(--magenta)]/[0.1]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--magenta)]/15"><ClipboardCheck size={18} className="text-[var(--magenta)]" /></span>
              <div><p className="text-sm font-semibold">Aprobaciones</p><p className="text-xs text-[#fff]/55">Revisa ausencias y horas extra de tu equipo.</p></div>
            </div>
            <ArrowRight size={16} className="text-[var(--magenta)]" />
          </Link>
          {evaluacionesHabilitadas && (
            <Link href="/empleados/evaluar" className="flex items-center justify-between rounded-2xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/[0.06] px-5 py-4 transition hover:bg-[#8b5cf6]/[0.1]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b5cf6]/15"><Target size={18} className="text-[#8b5cf6]" /></span>
                <div><p className="text-sm font-semibold">Evaluar a mi equipo</p><p className="text-xs text-[#fff]/55">Evaluación de desempeño trimestral de tu equipo.</p></div>
              </div>
              <ArrowRight size={16} className="text-[#8b5cf6]" />
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {seccionesVisibles.map((s) => {
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cyan)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--cyan)]">Entrar <ArrowRight size={10} /></span>
                ) : s.estado === "pronto" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/55"><Clock size={10} /> Disponible pronto</span>
                ) : (
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/40">Deshabilitado</span>
                )}
              </div>
              <h3 className="text-base font-semibold text-[#fff]">{s.titulo}</h3>
              <p className="text-sm text-[#fff]/55">{s.desc}</p>
            </>
          )
          const cls = `relative flex flex-col gap-3 rounded-2xl border p-5 ${off ? "border-white/[0.06] bg-white/[0.02] opacity-60" : "border-white/10 bg-white/[0.04]"} ${activo ? "transition hover:border-[var(--cyan)]/40 hover:bg-white/[0.06]" : ""}`
          return activo ? <Link key={s.key} href={s.href!} className={cls}>{inner}</Link> : <div key={s.key} className={cls}>{inner}</div>
        })}
      </div>
    </>
  )
}
