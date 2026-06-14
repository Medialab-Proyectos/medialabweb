"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Opt-in de notificaciones push (Web Push). El usuario decide si quiere recibir avisos de
 * nuevos análisis en su dispositivo. VALIDA el estado actual al montar para no volver a
 * pedir permiso si ya está activo: muestra "activadas" (con opción de desactivar),
 * "bloqueadas" (si el navegador las denegó) o el botón para activar.
 *
 * Requiere NEXT_PUBLIC_VAPID_PUBLIC_KEY. Si no está, el bloque no se muestra.
 */
type State = "loading" | "unsupported" | "blocked" | "subscribed" | "idle" | "working"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

export function PushOptIn() {
  const { t } = useLanguage()
  const [state, setState] = useState<State>("loading")
  const [error, setError] = useState<string | null>(null)

  // Al montar: detecta soporte y si YA hay una suscripción activa (no re-pide permiso).
  // Si no la hay y el permiso sigue sin decidir, PIDE el permiso automáticamente (sin que
  // el usuario toque el botón). Ojo: Firefox y Safari (iPhone) IGNORAN esta petición si no
  // hubo un gesto del usuario; en esos navegadores queda el botón "Activar" como respaldo.
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
        // Auto-petición: solo si el permiso aún no se ha decidido ("default").
        if (Notification.permission === "default") void enable()
      } catch {
        if (active) setState("idle")
      }
    })()
    return () => {
      active = false
    }
    // enable es estable (no depende de props/estado cambiante); auto-pedir solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const enable = async () => {
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
      setError(t("No se pudo activar. Intenta de nuevo.", "Couldn't enable. Try again."))
      setState("idle")
    }
  }

  const disable = async () => {
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
      setError(t("No se pudo desactivar.", "Couldn't disable."))
      setState("subscribed")
    }
  }

  // No soportado / sin clave VAPID: no mostramos nada (no es una función crítica).
  if (state === "loading" || state === "unsupported") return null

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-white/12 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--magenta)]/12 text-[var(--magenta)]">
          {state === "subscribed" ? <BellRing size={18} /> : <Bell size={18} />}
        </span>
        <div>
          <p className="text-sm font-bold">
            {state === "subscribed"
              ? t("Notificaciones activadas", "Notifications on")
              : t("Avísame de cada nuevo análisis", "Notify me of each new analysis")}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {state === "blocked"
              ? t(
                  "Están bloqueadas en este navegador. Actívalas desde los permisos del sitio.",
                  "Blocked in this browser. Enable them from the site permissions.",
                )
              : state === "subscribed"
                ? t("Recibirás un push en este dispositivo cuando publiquemos un análisis.", "You'll get a push on this device when we publish an analysis.")
                : t("Recibe un aviso en tu dispositivo, sin correo. Puedes desactivarlo cuando quieras.", "Get a heads-up on your device, no email. Turn it off anytime.")}
          </p>
          {error && <p className="mt-1 text-xs font-medium text-[#DC2626]">{error}</p>}
        </div>
      </div>

      {state !== "blocked" && (
        <button
          type="button"
          onClick={state === "subscribed" ? disable : enable}
          disabled={state === "working"}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
            state === "subscribed"
              ? "border border-border text-foreground/80 hover:bg-muted"
              : "bg-[var(--magenta)] text-[#fff] hover:opacity-90"
          }`}
        >
          {state === "working" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : state === "subscribed" ? (
            <BellOff size={15} />
          ) : (
            <Bell size={15} />
          )}
          {state === "subscribed" ? t("Desactivar", "Turn off") : t("Activar", "Turn on")}
        </button>
      )}
    </div>
  )
}

function isSupported(): boolean {
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
