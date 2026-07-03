import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal de Empleados | MediaLab Ingeniería",
  description: "Acceso privado para colaboradores de MediaLab Ingeniería.",
  robots: { index: false, follow: false },
}

export default function EmpleadosLayout({ children }: { children: React.ReactNode }) {
  return <div className="emp-portal min-h-screen bg-[#0b0d12] text-[#fff] antialiased">{children}</div>
}
