import { redirect } from "next/navigation"
import { getSession } from "@/lib/empleados/auth"
import { portalConfigurado } from "@/lib/empleados/db"
import { LoginForm } from "./login-form"

export const dynamic = "force-dynamic"

export default async function EmpleadosLoginPage() {
  const configurado = portalConfigurado()
  if (configurado) {
    const s = await getSession()
    if (s) redirect("/empleados/inicio")
  }
  return <LoginForm configurado={configurado} />
}
