import Link from "next/link"
import { ArrowLeft, FileSignature, Wallet } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById, getConfigEmpresa } from "@/lib/empleados/queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { condicionesVigentesFirmadas, esEnviadoPendiente, totalMensualContrato, inicioContrato, nombreDocumento, type Contrato } from "@/lib/empleados/contrato"
import { formatCOP } from "@/lib/empleados/desprendible"
import { formatMoneda } from "@/lib/empleados/freelance"
import { esVinculacionPorFactura, FREELANCE_MODO_LABEL } from "@/lib/empleados/types"
import { PortalHeader } from "../portal-header"
import { FirmarContrato } from "./firmar-contrato"

export const dynamic = "force-dynamic"

export default async function ContratoEmpleadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  const esFreelance = empleado ? esVinculacionPorFactura(empleado.tipo_vinculacion) : false

  let contratos: Contrato[] = []
  let sinConfigurar = false
  try {
    contratos = await listContratos(sesion.sub)
  } catch {
    sinConfigurar = true
  }
  const vigente = condicionesVigentesFirmadas(contratos)
  const conArchivo = contratos.filter((c) => c.archivo_path)
  // Solo los que el CEO ya ENVIÓ para firma (los borradores no los ve el empleado).
  const pendientesFirma = contratos.filter((c) => esEnviadoPendiente(c))
  const config = await getConfigEmpresa().catch(() => ({ caja_compensacion: null, arl: null, fecha_fundacion: null }))
  const modoLabelValor = (m: NonNullable<typeof empleado>["freelance_modo"]) =>
    m === "por_hora" ? "Valor por hora" : m === "por_mes" ? "Valor por mes" : m === "por_proyecto" ? "Valor del proyecto" : m === "aprendizaje" ? "Valor" : "Valor fijo"

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-8 flex items-center gap-2.5">
          <FileSignature size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Mi contrato</h1>
        </div>

        {/* Pendientes de firma: descargar el generado, firmar y subir */}
        {pendientesFirma.length > 0 && (
          <div className="mb-6 flex flex-col gap-4">
            {pendientesFirma.map((c) => (
              <section key={c.id} className="rounded-2xl border border-[var(--magenta)]/30 bg-[var(--magenta)]/[0.07] p-6">
                <h2 className="text-base font-semibold text-[#fff]">
                  {c.tipo === "inicial" ? "Tienes tu contrato por firmar" : "Tienes un otrosí por firmar"}
                </h2>
                <p className="mb-4 mt-1 text-sm text-[#fff]/70">
                  {!vigente && c.tipo === "inicial"
                    ? "Para activar tu portal y tus beneficios, descarga tu contrato, fírmalo y súbelo aquí."
                    : "Descárgalo, fírmalo y súbelo para dejarlo vigente."}
                </p>
                <FirmarContrato id={c.id} etiqueta={c.tipo === "inicial" ? "contrato" : "otrosí"} />
              </section>
            ))}
          </div>
        )}

        {esFreelance ? (
          <div className="flex flex-col gap-6">
            {/* Pago acordado */}
            <section className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Wallet size={16} className="text-[var(--cyan)]" />
                <h2 className="text-sm font-semibold text-[#fff]/85">Pago acordado</h2>
              </div>
              {empleado?.freelance_modo ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Dato k="Modalidad" v={FREELANCE_MODO_LABEL[empleado.freelance_modo]} />
                  {empleado.freelance_modo !== "aprendizaje" && (
                    <Dato
                      k={modoLabelValor(empleado.freelance_modo)}
                      v={formatMoneda(Number(empleado.freelance_tarifa) || 0, empleado.freelance_moneda ?? "COP")}
                    />
                  )}
                  {empleado.fecha_ingreso && <Dato k="Fecha de ingreso" v={empleado.fecha_ingreso} />}
                  {empleado.fecha_fin_probable && <Dato k="Fecha posible de terminación" v={empleado.fecha_fin_probable} />}
                </div>
              ) : (
                <p className="text-sm text-[#fff]/55">Tu pago acordado aún no está definido en el portal. Consúltalo con administración.</p>
              )}
              {empleado?.freelance_modo === "aprendizaje" && (
                <p className="mt-4 border-t border-white/10 pt-3 text-xs text-[#fff]/50">
                  Tu vínculo es <b className="text-[#fff]/70">por aprendizaje</b>: no tiene remuneración ni facturación. Registras tu horario y tus permisos como cualquier otro colaborador.
                </p>
              )}
              {empleado?.freelance_modo === "por_hora" && (
                <p className="mt-4 border-t border-white/10 pt-3 text-xs text-[#fff]/50">Al facturar, indica las horas trabajadas del mes: se multiplican por este valor.</p>
              )}
              {empleado?.freelance_modo === "por_proyecto" && (empleado.freelance_meses ?? 1) > 1 && (
                <p className="mt-4 border-t border-white/10 pt-3 text-xs text-[#fff]/50">
                  Proyecto pagado en {empleado.freelance_meses} cuotas de {formatMoneda(Math.round((Number(empleado.freelance_tarifa) || 0) / (empleado.freelance_meses ?? 1)), empleado.freelance_moneda ?? "COP")} / mes.
                </p>
              )}
              {vigente?.descripcion && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-[11px] text-[#fff]/45">Objeto del contrato</p>
                  <p className="text-sm text-[#fff]/80">{vigente.descripcion}</p>
                </div>
              )}
              {/* ARL y caja de compensación NO aplican a freelance / prestación de servicios. */}
            </section>

            {/* Documento del contrato (solo lectura; la descarga la gestiona la empresa) */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-2 text-sm font-semibold text-[#fff]/85">Documento del contrato</h2>
              <p className="text-sm text-[#fff]/55">
                {conArchivo.length > 0
                  ? "Tu contrato está firmado y archivado. La copia del documento la gestiona la empresa; solicítala a administración si la necesitas."
                  : "Aquí verás el estado de tu contrato. La copia del documento la gestiona la empresa."}
              </p>
            </section>
          </div>
        ) : sinConfigurar ? (
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-6 py-10 text-center text-sm text-amber-200/90">
            La sección de contratos aún no está habilitada. (Falta correr la migración
            <code className="mx-1 rounded bg-black/30 px-1">schema-fase3-contratos.sql</code> en Supabase.)
          </div>
        ) : !vigente ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-[#fff]/55">
            Aún no hay condiciones registradas para tu contrato.
          </div>
        ) : (
          <>
            {/* Condiciones vigentes */}
            <section className="rounded-2xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#fff]/85">Condiciones vigentes</h2>
                <span className="text-[11px] text-[#fff]/45">desde {inicioContrato(vigente, empleado?.fecha_ingreso ?? null)}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Dato k="Salario básico" v={formatCOP(vigente.salario_basico)} />
                <Dato k="Auxilio de transporte" v={formatCOP(vigente.auxilio_transporte)} />
                <Dato k="Cargo" v={vigente.cargo || "—"} />
                <Dato k="Tipo de contrato" v={vigente.tipo_contrato || "—"} />
              </div>
              {(vigente.otros_devengos ?? []).length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-3 text-sm text-[#fff]/70">
                  {vigente.otros_devengos.map((l, i) => (
                    <div key={i} className="flex justify-between py-0.5"><span>{l.concepto}</span><span>{formatCOP(l.valor)}</span></div>
                  ))}
                </div>
              )}
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-xs text-[#fff]/50">Total mensual devengado</p>
                <p className="font-display text-3xl font-bold text-[var(--cyan)]">{formatCOP(totalMensualContrato(vigente))}</p>
              </div>
              {vigente.descripcion && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-[11px] text-[#fff]/45">Objeto del contrato</p>
                  <p className="text-sm text-[#fff]/80">{vigente.descripcion}</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-white/10 pt-3 text-[11px] text-[#fff]/55 sm:grid-cols-3">
                {config.arl && <span>ARL: <b className="text-[#fff]/80">{config.arl}</b></span>}
                {config.caja_compensacion && <span>Caja: <b className="text-[#fff]/80">{config.caja_compensacion}</b></span>}
                {vigente.fecha_fin_probable && <span>Fin probable: <b className="text-[#fff]/80">{vigente.fecha_fin_probable}</b></span>}
                {vigente.fecha_fin && <span className="text-red-300/80">Finalizado: <b>{vigente.fecha_fin}</b></span>}
              </div>
            </section>

            {/* Historial */}
            {contratos.length > 1 && (
              <>
                <h2 className="mb-3 mt-8 text-sm font-semibold text-[#fff]/70">Historial de ajustes</h2>
                <ol className="flex flex-col gap-3">
                  {contratos.map((c) => (
                    <li key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/70">{nombreDocumento(c)}</span>
                        <span className="text-xs text-[#fff]/45">desde {inicioContrato(c, empleado?.fecha_ingreso ?? null)}</span>
                      </div>
                      <p className="mt-2 text-sm text-[#fff]/85">{formatCOP(totalMensualContrato(c))} / mes</p>
                      <p className="text-[11px] text-[#fff]/45">Básico {formatCOP(c.salario_basico)} · Aux. transporte {formatCOP(c.auxilio_transporte)}</p>
                      {c.motivo && <p className="mt-1 text-xs italic text-[#fff]/55">“{c.motivo}”</p>}
                      {c.archivo_path && <p className="mt-1 text-[11px] text-emerald-300/70">Documento firmado y archivado</p>}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}

function Dato({ k, v }: { k: string; v: string }) {
  return <div><p className="text-[11px] text-[#fff]/45">{k}</p><p className="text-base font-medium text-[#fff]/90">{v}</p></div>
}
