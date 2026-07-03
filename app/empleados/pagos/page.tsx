import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Gift, PiggyBank, ArrowRight, ArrowLeft } from "lucide-react"
import { requireEmpleado } from "@/lib/empleados/auth"
import { getEmpleadoById } from "@/lib/empleados/queries"
import { PortalHeader } from "../portal-header"

export const dynamic = "force-dynamic"

const opciones = [
  {
    icon: FileText,
    titulo: "Desprendibles de pago",
    desc: "Descarga tus comprobantes de pago mensuales en PDF.",
    color: "var(--cyan)",
    href: "/empleados/desprendibles",
  },
  {
    icon: Gift,
    titulo: "Prima de servicios",
    desc: "Descarga tu comprobante de prima de junio y diciembre.",
    color: "var(--magenta)",
    href: "/empleados/primas",
  },
  {
    icon: PiggyBank,
    titulo: "Cesantías",
    desc: "Descarga tu comprobante anual de cesantías e intereses.",
    color: "#00BFA6",
    href: "/empleados/cesantias",
  },
]

export default async function PagosPage() {
  const sesion = await requireEmpleado()
  const empleado = await getEmpleadoById(sesion.sub)
  if (!empleado) redirect("/empleados")

  return (
    <>
      <PortalHeader nombre={empleado.nombre} rol={empleado.rol} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/empleados/inicio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
          <ArrowLeft size={15} /> Volver al inicio
        </Link>
        <div className="mb-6 flex items-center gap-2.5">
          <FileText size={20} className="text-[var(--cyan)]" />
          <h1 className="font-display text-2xl font-bold">Desprendibles</h1>
        </div>
        <p className="mb-8 text-sm text-[#fff]/60">Tus comprobantes de pago, prima de servicios y cesantías.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {opciones.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[var(--cyan)]/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${s.color} 16%, transparent)` }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cyan)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--cyan)]">
                    Entrar <ArrowRight size={10} />
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#fff]">{s.titulo}</h3>
                <p className="text-sm text-[#fff]/55">{s.desc}</p>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
