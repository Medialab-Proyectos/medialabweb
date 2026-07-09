import Link from "next/link"
import { Users, HeartHandshake, Wallet, Home } from "lucide-react"

type Modulo = "empleado" | "empleados" | "talento" | "contabilidad"

const MODULOS: { key: Modulo; href: string; icon: React.ElementType; label: string; color: string }[] = [
  { key: "empleado", href: "/empleados/mi-portal", icon: Home, label: "Mi portal", color: "#38bdf8" },
  { key: "empleados", href: "/empleados/admin", icon: Users, label: "Gestión de empleados", color: "#c026a8" },
  { key: "talento", href: "/empleados/admin/talento", icon: HeartHandshake, label: "Talento Humano", color: "#00BFA6" },
  { key: "contabilidad", href: "/empleados/admin/contabilidad", icon: Wallet, label: "Contabilidad", color: "#E8751A" },
]

/** Navegación de los 4 módulos grandes del panel del CEO. Cada uno con su color propio. */
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
            className="group flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition"
            style={{
              borderColor: on ? m.color : `color-mix(in srgb, ${m.color} 30%, transparent)`,
              background: on ? `color-mix(in srgb, ${m.color} 18%, transparent)` : `color-mix(in srgb, ${m.color} 7%, transparent)`,
              color: on ? "#fff" : "rgba(255,255,255,0.82)",
            }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `color-mix(in srgb, ${m.color} 22%, transparent)` }}
            >
              <Icon size={17} style={{ color: m.color }} />
            </span>
            {m.label}
          </Link>
        )
      })}
    </div>
  )
}
