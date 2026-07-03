import Link from "next/link"
import { ArrowLeft, Download, FileSignature } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { condicionesVigentes, totalMensualContrato, inicioContrato, TIPO_VERSION_LABEL, type Contrato } from "@/lib/empleados/contrato"
import { formatCOP } from "@/lib/empleados/desprendible"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

export default async function ContratoEmpleadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  let contratos: Contrato[] = []
  let sinConfigurar = false
  try {
    contratos = await listContratos(sesion.sub)
  } catch {
    sinConfigurar = true
  }
  const vigente = condicionesVigentes(contratos)

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-8 flex items-center gap-2.5">
          <FileSignature size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Mi contrato</h1>
        </div>

        {sinConfigurar ? (
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
            </section>

            {/* Historial */}
            {contratos.length > 1 && (
              <>
                <h2 className="mb-3 mt-8 text-sm font-semibold text-[#fff]/70">Historial de ajustes</h2>
                <ol className="flex flex-col gap-3">
                  {contratos.map((c) => (
                    <li key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#fff]/70">{TIPO_VERSION_LABEL[c.tipo]}</span>
                        <span className="text-xs text-[#fff]/45">desde {inicioContrato(c, empleado?.fecha_ingreso ?? null)}</span>
                      </div>
                      <p className="mt-2 text-sm text-[#fff]/85">{formatCOP(totalMensualContrato(c))} / mes</p>
                      <p className="text-[11px] text-[#fff]/45">Básico {formatCOP(c.salario_basico)} · Aux. transporte {formatCOP(c.auxilio_transporte)}</p>
                      {c.motivo && <p className="mt-1 text-xs italic text-[#fff]/55">“{c.motivo}”</p>}
                      {c.archivo_path && (
                        <a href={`/api/empleados/contratos/${c.id}/archivo`} className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--cyan)] hover:underline">
                          <Download size={13} /> Descargar documento
                        </a>
                      )}
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
