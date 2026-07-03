"use client"

import { Loader2, AlertTriangle } from "lucide-react"

type Tone = "danger" | "warn" | "default"

/** Diálogo de confirmación dentro de la app (reemplaza window.confirm). */
export function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "danger",
  cargando = false,
  onConfirm,
  onCancel,
}: {
  abierto: boolean
  titulo: string
  mensaje: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: Tone
  cargando?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!abierto) return null

  const btn: Record<Tone, string> = {
    danger: "bg-red-500/90 text-[#fff] hover:bg-red-500",
    warn: "bg-amber-400/90 text-[#181200] hover:bg-amber-400",
    default: "bg-[var(--cyan)] text-[#04191b] hover:brightness-110",
  }
  const icon: Record<Tone, string> = {
    danger: "text-red-300",
    warn: "text-amber-300",
    default: "text-[var(--cyan)]",
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={cargando ? undefined : onCancel}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12151c] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2.5">
          <AlertTriangle size={20} className={icon[tone]} />
          <h2 className="text-base font-semibold">{titulo}</h2>
        </div>
        <p className="text-sm leading-relaxed text-[#fff]/70">{mensaje}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} disabled={cargando} className="rounded-lg px-4 py-2 text-sm text-[#fff]/60 hover:text-[#fff] disabled:opacity-50">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={cargando} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${btn[tone]}`}>
            {cargando ? <Loader2 size={14} className="animate-spin" /> : null} {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
