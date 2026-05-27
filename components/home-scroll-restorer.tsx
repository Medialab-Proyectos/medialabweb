"use client"

import { useEffect } from "react"

export function HomeScrollRestorer() {
  useEffect(() => {
    const savedY = sessionStorage.getItem("homeScrollY")
    const ready  = sessionStorage.getItem("homeScrollReady")

    // Limpiar flags siempre
    sessionStorage.removeItem("homeScrollReady")
    sessionStorage.removeItem("homeNavBehavior")

    if (ready && savedY) {
      // Usuario volvió desde una landing usando el logo → restaurar sección
      sessionStorage.removeItem("homeScrollY")
      window.scrollTo({ top: parseInt(savedY, 10), behavior: "smooth" })
    } else {
      // Navegación nueva (Google, URL directa, etc.) → ir al tope
      sessionStorage.removeItem("homeScrollY")
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname)
      }
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [])

  return null
}
