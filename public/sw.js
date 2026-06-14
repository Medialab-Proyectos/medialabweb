/* Service Worker — Experience Radar push notifications.
 * Recibe el push del servidor y muestra la notificación; al hacer clic abre la nota.
 * Mínimo a propósito: no cachea ni intercepta fetch (no es un PWA offline). */

self.addEventListener("push", (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (_e) {
    data = { title: "Experience Radar", body: event.data ? event.data.text() : "" }
  }

  const title = data.title || "Experience Radar — nuevo análisis"
  const options = {
    body: data.body || "Hay un nuevo análisis disponible.",
    icon: data.icon || "/images/logo-medialab-400.png",
    badge: data.badge || "/images/logo-medialab-400.png",
    tag: data.tag || "experience-radar",
    data: { url: data.url || "/experience-radar/mundial-2026" },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || "/experience-radar/mundial-2026"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Si ya hay una pestaña del sitio abierta, la enfoca y navega; si no, abre una nueva.
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    }),
  )
})
