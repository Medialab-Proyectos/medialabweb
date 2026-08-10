"use client"

import { useEffect } from "react"

/* Registra el service worker del portal con alcance /empleados/.
 * Vive solo en el layout de /empleados, así la PWA instalable es únicamente
 * el Centro de Empleados y nunca la web pública. */
export function PWARegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/sw-empleados.js", { scope: "/empleados/" }).catch(() => {})
  }, [])

  return null
}
