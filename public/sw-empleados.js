/* Service Worker del Centro de Empleados — habilita la instalación como PWA.
 * Alcance: /empleados/ (se registra con { scope: "/empleados/" }).
 *
 * A propósito NO cachea páginas ni respuestas de API: el portal es privado y
 * sus datos (nómina, certificados, cédulas) no deben quedar almacenados en el
 * dispositivo. El handler de fetch existe únicamente para que el navegador
 * ofrezca "Instalar app"; solo pasa las peticiones a la red. */

self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()))

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return
  // Pass-through puro, sin caché de contenido privado.
  event.respondWith(fetch(req))
})
