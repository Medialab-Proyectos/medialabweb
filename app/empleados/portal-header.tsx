"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LogOut, ShieldCheck, Contact, LayoutDashboard, Menu, X, Home, Users, HeartHandshake, Wallet } from "lucide-react"
import type { Rol } from "@/lib/empleados/types"
import { ROL_LABEL } from "@/lib/empleados/types"

/** Módulos del menú móvil (los mismos de ModuleNav, que en responsive se oculta). */
const MODULOS_CEO = [
  { href: "/empleados/mi-portal", icon: Home, label: "Mi portal", color: "#38bdf8" },
  { href: "/empleados/admin", icon: Users, label: "Gestión de empleados", color: "#c026a8" },
  { href: "/empleados/admin/talento", icon: HeartHandshake, label: "Talento Humano", color: "#00BFA6" },
  { href: "/empleados/admin/contabilidad", icon: Wallet, label: "Contabilidad", color: "#E8751A" },
]

export function PortalHeader({ nombre, rol }: { nombre: string; rol: Rol }) {
  const [abierto, setAbierto] = useState(false)

  async function logout() {
    await fetch("/api/empleados/logout", { method: "POST" })
    window.location.href = "/empleados"
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3.5 sm:px-6">
        <Link href="/empleados/inicio" className="flex min-w-0 items-center gap-2.5">
          <Image src="/logo.svg" alt="MediaLab" width={120} height={32} className="h-7 w-auto" unoptimized />
          <span className="hidden text-sm font-semibold text-[#fff]/80 sm:inline">Portal de Empleados</span>
        </Link>

        {/* Escritorio */}
        <div className="hidden items-center gap-3 md:flex">
          {rol === "ceo" && (
            <Link href="/empleados/inicio" title="Mi dashboard" aria-label="Mi dashboard" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#fff]/70 transition hover:bg-white/5 hover:text-[#fff]">
              <LayoutDashboard size={15} />
            </Link>
          )}
          <Link href="/empleados/directorio" title="Directorio de contactos" aria-label="Directorio de contactos" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#fff]/70 transition hover:bg-white/5 hover:text-[#fff]">
            <Contact size={15} />
          </Link>
          {rol === "ceo" && (
            <Link
              href="/empleados/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/20"
            >
              <ShieldCheck size={13} /> Administración
            </Link>
          )}
          <div className="text-right">
            <p className="text-xs font-semibold leading-tight text-[#fff]/90">{nombre}</p>
            <p className="text-[10px] text-[#fff]/45">{ROL_LABEL[rol]}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-[#fff]/70 transition hover:bg-white/5 hover:text-[#fff]"
          >
            <LogOut size={13} /> Salir
          </button>
        </div>

        {/* Móvil: un solo botón de menú */}
        <button
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#fff]/75 transition hover:bg-white/5 md:hidden"
        >
          {abierto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Panel del menú móvil */}
      {abierto && (
        <div className="border-t border-white/10 bg-[#0b0d12] md:hidden">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <div className="mb-3 border-b border-white/10 pb-3">
              <p className="text-sm font-semibold text-[#fff]/90">{nombre}</p>
              <p className="text-[11px] text-[#fff]/45">{ROL_LABEL[rol]}</p>
            </div>

            <nav className="flex flex-col gap-1.5">
              {rol === "ceo" && MODULOS_CEO.map((m) => {
                const Icon = m.icon
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    onClick={() => setAbierto(false)}
                    className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition"
                    style={{
                      borderColor: `color-mix(in srgb, ${m.color} 30%, transparent)`,
                      background: `color-mix(in srgb, ${m.color} 7%, transparent)`,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${m.color} 22%, transparent)` }}>
                      <Icon size={15} style={{ color: m.color }} />
                    </span>
                    {m.label}
                  </Link>
                )
              })}

              <Link href="/empleados/directorio" onClick={() => setAbierto(false)} className="flex items-center gap-2.5 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-[#fff]/80 transition hover:bg-white/5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5"><Contact size={15} /></span>
                Directorio de contactos
              </Link>

              <button
                onClick={() => { setAbierto(false); logout() }}
                className="mt-1 flex items-center gap-2.5 rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm font-medium text-[#fff]/80 transition hover:bg-white/5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5"><LogOut size={15} /></span>
                Salir
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
