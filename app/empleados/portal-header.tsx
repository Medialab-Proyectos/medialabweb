"use client"

import Image from "next/image"
import Link from "next/link"
import { LogOut, ShieldCheck, Contact, LayoutDashboard } from "lucide-react"
import type { Rol } from "@/lib/empleados/types"
import { ROL_LABEL } from "@/lib/empleados/types"

export function PortalHeader({ nombre, rol }: { nombre: string; rol: Rol }) {
  async function logout() {
    await fetch("/api/empleados/logout", { method: "POST" })
    window.location.href = "/empleados"
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <Link href="/empleados/inicio" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="MediaLab" width={120} height={32} className="h-7 w-auto" unoptimized />
          <span className="hidden text-sm font-semibold text-[#fff]/80 sm:inline">Portal de Empleados</span>
        </Link>
        <div className="flex items-center gap-3">
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
              className="hidden items-center gap-1.5 rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--cyan)] transition hover:bg-[var(--cyan)]/20 sm:inline-flex"
            >
              <ShieldCheck size={13} /> Administración
            </Link>
          )}
          <div className="hidden text-right sm:block">
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
      </div>
    </header>
  )
}
