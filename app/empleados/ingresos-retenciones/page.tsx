import Link from "next/link"
import { ArrowLeft, FileText, Download } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { listCertificadosIREmpleado } from "@/lib/empleados/certificado-ir-queries"
import type { CertificadoIR } from "@/lib/empleados/certificado-ir"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

export default async function IngresosRetencionesEmpleadoPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)

  let certificados: CertificadoIR[] = []
  let sinConfigurar = false
  try {
    certificados = await listCertificadosIREmpleado(sesion.sub, true)
  } catch {
    sinConfigurar = true
  }
  const conArchivo = certificados.filter((c) => c.archivo_path)

  return (
    <>
      <PortalHeader nombre={empleado?.nombre ?? sesion.nombre} rol={sesion.rol} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver
        </Link>
        <div className="mb-2 flex items-center gap-2.5">
          <FileText size={20} className="text-[#8b5cf6]" />
          <h1 className="font-display text-2xl font-bold">Ingresos y retenciones</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/55">
          Tu Certificado de Ingresos y Retenciones (DIAN) por año gravable. Lo publica la empresa cuando está
          disponible (por lo general en el primer semestre, del año anterior).
        </p>

        {sinConfigurar ? (
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-6 py-10 text-center text-sm text-amber-200/90">
            La sección aún no está habilitada. (Falta correr la migración
            <code className="mx-1 rounded bg-black/30 px-1">schema-fase26</code> en Supabase.)
          </div>
        ) : conArchivo.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-[#fff]/55">
            Aún no hay certificados publicados. Cuando la empresa cargue el tuyo, podrás descargarlo aquí.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {conArchivo.map((c) => (
              <a
                key={c.id}
                href={`/api/empleados/ingresos-retenciones/${c.id}/archivo`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-[#8b5cf6]/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8b5cf6]/15">
                    <FileText size={20} className="text-[#8b5cf6]" />
                  </span>
                  <div>
                    <p className="text-base font-semibold">Año gravable {c.anio}</p>
                    <p className="text-sm text-[#fff]/55">Certificado de Ingresos y Retenciones</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b5cf6]">
                  <Download size={15} /> Descargar
                </span>
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
