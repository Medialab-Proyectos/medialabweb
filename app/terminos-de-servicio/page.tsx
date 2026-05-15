import type { Metadata } from "next"
import { TermsContent } from "./terms-content"

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description:
    "Términos y condiciones de uso de los servicios de MediaLab Ingeniería.",
}

export default function TerminosDeServicio() {
  return <TermsContent />
}
