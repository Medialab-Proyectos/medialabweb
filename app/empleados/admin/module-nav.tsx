import Link from "next/link"
import { Users, HeartHandshake, Wallet, Home } from "lucide-react"

type Modulo = "empleado" | "empleados" | "talento" | "contabilidad"

const MODULOS: { key: Modulo; href: string; icon: React.ElementType; label: string }[] = [
  { key: "empleado", href: "/empleados/inicio", icon: Home, label: "Mi portal" },
  { key: "empleados", href: "/empleados/admin", icon: Users, label: "Gestión de empleados" },
  { key: "talento", href: "/empleados/admin/talento", icon: HeartHandshake, label: "Talento Humano" },
  { key: "contabilidad", href: "/empleados/admin/contabilidad", icon: Wallet, label: "Contabilidad" },
]

/** Navegación de los 4 módulos grandes del panel del CEO. */
export function ModuleNav({ active }: { active?: Modulo }) {
  return (
    <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {MODULOS.map((m) => {
        const Icon = m.icon
        const on = m.key === active
        return (
          <Link
            key={m.key}
            href={m.href}
            aria-current={on ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              on
                ? "border-[var(--cyan)]/40 bg-[var(--cyan)]/[0.08] text-[#fff]"
                : "border-white/10 bg-white/[0.03] text-[#fff]/65 hover:bg-white/[0.06] hover:text-[#fff]"
            }`}
          >
            <Icon size={17} className={on ? "text-[var(--cyan)]" : "text-[#fff]/50"} /> {m.label}
          </Link>
        )
      })}
    </div>
  )
}
