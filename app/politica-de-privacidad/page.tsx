import type { Metadata } from "next"
import { PrivacyContent } from "./privacy-content"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de MediaLab Ingeniería. Conoce cómo recopilamos, usamos y protegemos tu información personal.",
}

export default function PoliticaDePrivacidad() {
  return <PrivacyContent />
}
