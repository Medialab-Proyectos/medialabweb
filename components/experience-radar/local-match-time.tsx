"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"

/**
 * Muestra la fecha/hora del partido en la ZONA HORARIA del visitante (la del navegador),
 * no en una fija. Como el servidor no conoce la zona del usuario, el formateo se hace tras
 * montar en el cliente; antes de montar usa un respaldo neutro. Incluye SIEMPRE el nombre
 * de la zona (p. ej. "GMT-5") para que quede explícito desde dónde se está leyendo la hora.
 *
 * - variant "datetime": fecha larga + hora (cabecera de la nota).
 * - variant "time": solo la hora + zona (tarjetas del listado).
 */
export function LocalMatchTime({
  iso,
  date,
  variant = "datetime",
}: {
  iso?: string
  date: string
  variant?: "datetime" | "time"
}) {
  const { lang } = useLanguage()
  const locale = lang === "es" ? "es-CO" : "en-US"

  const fallback = variant === "time"
    ? ""
    : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(`${date}T12:00:00`))
  const [text, setText] = useState<string>(fallback)

  useEffect(() => {
    if (!iso) {
      setText(variant === "time" ? "" : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(`${date}T12:00:00`)))
      return
    }
    const d = new Date(iso)
    if (variant === "time") {
      setText(
        new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(d),
      )
      return
    }
    const datePart = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(d)
    const timePart = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(d)
    setText(`${datePart} · ${timePart}`)
  }, [iso, date, locale, variant])

  return <span suppressHydrationWarning>{text}</span>
}
