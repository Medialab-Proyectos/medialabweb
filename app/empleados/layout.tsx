import type { Metadata, Viewport } from "next"
import { PWARegister } from "./pwa-register"

export const metadata: Metadata = {
  title: "Portal de Empleados | MediaLab Ingeniería",
  description: "Acceso privado para colaboradores de MediaLab Ingeniería.",
  robots: { index: false, follow: false },
  // PWA instalable solo aquí: manifest e íconos iOS acotados al portal.
  manifest: "/empleados.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Empleados",
    statusBarStyle: "black-translucent",
  },
}

export const viewport: Viewport = {
  themeColor: "#0b0d12",
}

export default function EmpleadosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="emp-portal min-h-screen bg-[#0b0d12] text-[#fff] antialiased">
      <PWARegister />
      {children}
    </div>
  )
}
