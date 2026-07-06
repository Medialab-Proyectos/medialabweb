"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import {
  type Beneficio, type EstadoBeneficio, TIPO_BENEFICIO_LABEL, ESTADO_BENEFICIO_LABEL,
} from "@/lib/empleados/beneficio"

type BeneficioRow = Beneficio & { empleado: { nombre: string; cedula: string } | null }

const estadoStyle: Record<EstadoBeneficio, string> = {
  solicitado: "bg-amber-400/10 text-amber-300",
  activo: "bg-emerald-400/10 text-emerald-300",
  inactivo: "bg-white/5 text-[#fff]/50",
}

export function BeneficiosAdminClient() {
  const [rows, setRows] = useState<BeneficioRow[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [guardandoId, setGuardandoId] = useState<string | null>(null)

  async function cargar() {
    setCargando(true)
    try {
      const res = await fetch("/api/empleados/admin/beneficios")
      const data = await res.json()
      if (res.ok) setRows(data.beneficios ?? [])
      else setError(data.error || "Error al cargar.")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  async function setEstado(id: string, estado: EstadoBeneficio) {
    setError(""); setGuardandoId(id)
    try {
      const res = await fetch("/api/empleados/admin/beneficios", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...(data.beneficio as Beneficio) } : r)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.")
    } finally {
      setGuardandoId(null)
    }
  }

  return (
    <div>
      <Link href="/empleados/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#fff]/55 hover:text-[#fff]">
        <ArrowLeft size={15} /> Volver al panel
      </Link>
      <div className="mb-6 flex items-center gap-2.5">
        <Gift size={20} className="text-[#E8751A]" />
        <h1 className="font-display text-xl font-bold">Beneficios</h1>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#fff]/50">{rows.length}</span>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      {cargando ? (
        <div className="flex items-center gap-2 py-10 text-[#fff]/60"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-[#fff]/50">
          Aún no hay activaciones de beneficios. Aparecerán aquí cuando un empleado active uno.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">{r.empleado?.nombre ?? "—"} <span className="text-[#fff]/45">· CC {r.empleado?.cedula ?? "—"}</span></p>
                <p className="text-xs text-[#fff]/55">
                  {TIPO_BENEFICIO_LABEL[r.tipo]}{r.proveedor ? ` · ${r.proveedor}` : ""}
                  {(() => {
                    const d = (r.datos ?? {}) as { plan?: string }
                    return d.plan ? ` · ${d.plan}` : ""
                  })()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoStyle[r.estado]}`}>
                  {ESTADO_BENEFICIO_LABEL[r.estado]}
                </span>
                {guardandoId === r.id ? (
                  <Loader2 size={15} className="animate-spin text-[#fff]/50" />
                ) : (
                  <div className="flex items-center gap-1">
                    {r.estado !== "activo" && (
                      <button onClick={() => setEstado(r.id, "activo")} title="Marcar activo" className="rounded-lg p-1.5 text-emerald-300/70 hover:bg-emerald-500/10 hover:text-emerald-300"><CheckCircle2 size={15} /></button>
                    )}
                    {r.estado !== "inactivo" && (
                      <button onClick={() => setEstado(r.id, "inactivo")} title="Dar de baja" className="rounded-lg p-1.5 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"><XCircle size={15} /></button>
                    )}
                    {r.estado === "inactivo" && (
                      <button onClick={() => setEstado(r.id, "solicitado")} title="Reabrir solicitud" className="rounded-lg p-1.5 text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-300"><RotateCcw size={15} /></button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
