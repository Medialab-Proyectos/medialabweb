"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, Receipt, ClipboardCheck, FileText } from "lucide-react"

type Alertas = { facturasPorPagar: number; ausenciasPendientes: number; cuentasCobroPorPasar: number }

/** Cajas de alerta del CEO: aparecen solo si hay pendientes. */
export function AlertBoxes() {
  const [a, setA] = useState<Alertas | null>(null)

  useEffect(() => {
    let cancel = false
    fetch("/api/empleados/admin/alertas")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancel && d) setA(d) })
      .catch(() => {})
    return () => { cancel = true }
  }, [])

  if (!a) return null
  const boxes: { href: string; icon: React.ElementType; text: string }[] = []
  if (a.facturasPorPagar > 0)
    boxes.push({ href: "/empleados/admin/freelance", icon: Receipt, text: `${a.facturasPorPagar} factura${a.facturasPorPagar > 1 ? "s" : ""} de freelance por revisar o pagar` })
  if (a.ausenciasPendientes > 0)
    boxes.push({ href: "/empleados/aprobaciones", icon: ClipboardCheck, text: `${a.ausenciasPendientes} solicitud${a.ausenciasPendientes > 1 ? "es" : ""} de ausencia por aprobar` })
  if (a.cuentasCobroPorPasar > 0)
    boxes.push({ href: "/empleados/admin/cuentas-cobro", icon: FileText, text: `${a.cuentasCobroPorPasar} cuenta${a.cuentasCobroPorPasar > 1 ? "s" : ""} de cobro por pasar (fecha de pago cercana)` })
  if (boxes.length === 0) return null

  return (
    <div className="mb-6 flex flex-col gap-2">
      {boxes.map((b, i) => {
        const Icon = b.icon
        return (
          <Link
            key={i}
            href={b.href}
            className="flex items-center gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-100 transition hover:bg-amber-400/[0.12]"
          >
            <AlertTriangle size={16} className="shrink-0 text-amber-300" />
            <Icon size={15} className="shrink-0 text-amber-300/80" />
            <span>{b.text}</span>
          </Link>
        )
      })}
    </div>
  )
}
