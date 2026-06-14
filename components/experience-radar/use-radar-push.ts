"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Hook de suscripción Web Push del Experience Radar. Encapsula la detección de soporte,
 * el estado de la suscripción y las acciones activar/desactivar. Lo usa la campana de la
 * barra inferior (`RadarFloatingMenu`).
 *
 * `autoPrompt`: si el permiso aún no se decidió, pide permiso automáticamente al montar.
 * Ojo: Firefox y Safari (iPhone) IGNORAN la petición sin gesto del usuario; ahí el botón
 * de la campana queda como respaldo.
 *
 * Requiere NEXT_PUBLIC_VAPID_PUBLIC_KEY; sin ella el estado queda "unsupported".
 */
export type RadarPushState = "loading" | "unsupported" | "blocked" | "subscribed" | "idle" | "working"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

export function useRadarPush({ autoPrompt = false }: { autoPrompt?: boolean } = {}) {
  const [state, setState] = useState<RadarPushState>("loading")
  const [error, setError] = useState<string | null>(null)

  const enable = useCallback(async () => {
    setError(null)
    setState("working")
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "idle")
        return
      }
      const reg = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY as string),
      })
      const res = await fetch("/api/experience-radar/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      })
      if (!res.ok) throw new Error("subscribe_failed")
      setState("subscribed")
    } catch {
      setError("No se pudo activar. Intenta de nuevo.")
      setState("idle")
    }
  }, [])

  const disable = useCallback(async () => {
    setError(null)
    setState("working")
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = reg ? await reg.pushManager.getSubscription() : null
      if (sub) {
        await fetch("/api/experience-radar/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setState("idle")
    } catch {
      setError("No se pudo desactivar.")
      setState("subscribed")
    }
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!isSupported() || !VAPID_PUBLIC_KEY) {
        if (active) setState("unsupported")
        return
      }
      if (Notification.permission === "denied") {
        if (active) setState("blocked")
        return
      }
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        const existing = reg ? await reg.pushManager.getSubscription() : null
        if (!active) return
        if (existing) {
          setState("subscribed")
          return
        }
        setState("idle")
        if (autoPrompt && Notification.permission === "default") void enable()
      } catch {
        if (active) setState("idle")
      }
    })()
    return () => {
      active = false
    }
  }, [autoPrompt, enable])

  return { state, error, enable, disable }
}

export function isSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )
}

/** Convierte la clave VAPID pública (base64url) al formato que espera pushManager. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}
