import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { CareersLanding } from "@/components/carreras/careers-landing"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Carreras — Únete al equipo de diseño UX/UI + IA",
  description:
    "Trabaja en MediaLab Ingeniería: diseño UX/UI remoto, mentoría en IA, proyectos globales y una cultura que prioriza tu crecimiento. Vacantes abiertas en Bogotá.",
  alternates: {
    canonical: "/carreras",
    languages: {
      es: "/carreras",
      en: "/en/carreras",
      "x-default": "/carreras",
    },
  },
  openGraph: {
    title: "Carreras en MediaLab — Diseña el futuro con nosotros",
    description:
      "Únete a un equipo remoto de diseñadores UX/UI que combinan investigación de usuarios con inteligencia artificial. Vacantes abiertas en Bogotá, Colombia.",
    url: "/carreras",
    siteName: "MediaLab Ingeniería",
  },
}

export default function CarrerasPage() {
  return (
    <main id="main-content">
      <Navbar />
      <CareersLanding />
      <Footer />
    </main>
  )
}
