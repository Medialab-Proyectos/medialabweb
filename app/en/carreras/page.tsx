import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { CareersLanding } from "@/components/carreras/careers-landing"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Careers — Join the UX/UI + AI design team",
  description:
    "Work at MediaLab Ingeniería: remote UX/UI design, AI mentorship, global projects, and a culture that prioritizes your growth. Open positions in Bogotá.",
  alternates: {
    canonical: "/en/carreras",
    languages: {
      es: "/carreras",
      en: "/en/carreras",
      "x-default": "/carreras",
    },
  },
  openGraph: {
    title: "Careers at MediaLab — Design the future with us",
    description:
      "Join a remote team of UX/UI designers combining user research with artificial intelligence. Open positions in Bogotá, Colombia.",
    url: "/en/carreras",
    siteName: "MediaLab Ingeniería",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at MediaLab — Design the future with us",
    description:
      "Remote UX/UI + AI design team. Global projects, mentorship, and a culture that prioritizes your growth.",
  },
}

export default function CareersPage() {
  return (
    <main id="main-content">
      <Navbar />
      <CareersLanding />
      <Footer />
    </main>
  )
}
