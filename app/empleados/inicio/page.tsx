import { redirect } from "next/navigation"
import Link from "next/link"
import { FileSignature, ArrowRight } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById, getConfigEmpresa } from "@/lib/empleados/queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { tieneContratoFirmado } from "@/lib/empleados/contrato"
import { ModuleNav } from "../admin/module-nav"
import { PortalHeader } from "../portal-header"
import { CambiarClaveCard } from "../cambiar-clave-card"
import { NdaAlert } from "../nda-alert"
import { PanelCEO } from "../panel-ceo"
import { PortalGrid } from "../portal-grid"

export const dynamic = "force-dynamic"

export default async function InicioPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  if (!empleado) redirect("/empleados")

  // ── CEO: el inicio es el PANEL DE DECISIONES. Su portal personal está en «Mi portal». ──
  if (empleado.rol === "ceo") {
    return (
      <>
        <PortalHeader nombre={empleado.nombre} rol="ceo" />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-6">
            <p className="text-sm text-[#fff]/50">Hola,</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{empleado.nombre}</h1>
          </div>
          <ModuleNav />
          <PanelCEO />
        </main>
      </>
    )
  }

  // Bloqueo por firma: si hay contrato pero NINGUNO firmado, el primer contrato está
  // pendiente → el portal no se activa hasta que el empleado suba el firmado.
  let bloqueadoPorFirma = false
  try {
    const contratos = await listContratos(empleado.id)
    bloqueadoPorFirma = contratos.length > 0 && !tieneContratoFirmado(contratos)
  } catch { /* sin tabla de contratos: no bloquear */ }

  let encuestaHabilitada = false
  let evaluacionesHabilitadas = false
  try {
    const cfg = await getConfigEmpresa()
    encuestaHabilitada = cfg.encuesta_habilitada === true
    evaluacionesHabilitadas = cfg.evaluaciones_habilitadas === true
  } catch { /* config opcional */ }

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
        {empleado.estado === "activo" && <NdaAlert />}

        {bloqueadoPorFirma ? (
          <Link
            href="/empleados/contrato"
            className="flex items-center justify-between rounded-2xl border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.08] px-5 py-5 transition hover:bg-[var(--magenta)]/[0.12]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--magenta)]/15">
                <FileSignature size={20} className="text-[var(--magenta)]" />
              </span>
              <div>
                <p className="text-base font-semibold">Firma tu contrato para activar tu portal</p>
                <p className="text-sm text-[#fff]/60">Descarga tu contrato, fírmalo y súbelo. Hasta entonces el resto del portal y los beneficios están inactivos.</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-[var(--magenta)]" />
          </Link>
        ) : (
          <PortalGrid rol={empleado.rol} tipoVinculacion={empleado.tipo_vinculacion} encuestaHabilitada={encuestaHabilitada} evaluacionesHabilitadas={evaluacionesHabilitadas} horarioHabilitado={empleado.horario_habilitado === true} freelanceModo={empleado.freelance_modo} />
        )}

        <p className="mt-10 text-center text-xs text-[#fff]/35">
          MediaLab Ingeniería · Portal interno · Tus datos se tratan conforme a la Ley 1581 (Habeas Data).
        </p>
      </main>
    </>
  )
}
