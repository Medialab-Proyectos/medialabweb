import { requireCEO } from "@/lib/empleados/auth"
import { getEmpleadoById, listEmpleados } from "@/lib/empleados/queries"
import { listCuentas } from "@/lib/empleados/contabilidad-queries"
import { listContratos } from "@/lib/empleados/contrato-queries"
import { condicionesVigentesFirmadas, totalMensualContrato } from "@/lib/empleados/contrato"
import { aportesEmpleado } from "@/lib/empleados/nomina-co"
import { esVinculacionPorFactura } from "@/lib/empleados/types"
import { PortalHeader } from "../../../portal-header"
import { NominaClient, type SugeridoNomina } from "./nomina-client"

export const dynamic = "force-dynamic"

export default async function NominaPage() {
  const sesion = await requireCEO()
  const [ceo, empleados, cuentas] = await Promise.all([
    getEmpleadoById(sesion.sub),
    listEmpleados(),
    listCuentas().catch(() => []),
  ])
  // Nómina = empleados laborales activos (los freelance se pagan por sus facturas).
  const laborales = empleados.filter((e) => e.estado === "activo" && !esVinculacionPorFactura(e.tipo_vinculacion))

  // Valor sugerido a pagar (neto del contrato = devengado − seguridad social del empleado)
  // + base salarial y fecha de ingreso, para estimar prima y cesantías en sus meses de ley.
  const sugeridos: SugeridoNomina[] = await Promise.all(
    laborales.map(async (e) => {
      const contratos = await listContratos(e.id).catch(() => [])
      const vigente = condicionesVigentesFirmadas(contratos)
      const salarioBasico = Number(vigente?.salario_basico) || 0
      const auxilio = Number(vigente?.auxilio_transporte) || 0
      const devengado = vigente ? totalMensualContrato(vigente) : 0
      const ap = aportesEmpleado(salarioBasico)
      const seguridadSocial = ap.salud + ap.pension + ap.fsp
      const inicial = contratos.find((c) => c.tipo === "inicial")
      const fechaIngreso = inicial?.fecha_ingreso ?? vigente?.fecha_ingreso ?? e.fecha_ingreso ?? null
      return { id: e.id, salarioBasico, auxilio, devengado, seguridadSocial, neto: Math.max(0, devengado - seguridadSocial), fechaIngreso }
    }),
  )

  return (
    <>
      <PortalHeader nombre={ceo?.nombre ?? sesion.nombre} rol="ceo" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <NominaClient empleados={laborales} cuentas={cuentas} sugeridos={sugeridos} />
      </main>
    </>
  )
}
