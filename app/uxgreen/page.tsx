import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { UXGreenLanding } from "@/components/uxgreen-landing"

export const metadata: Metadata = {
  title: "UXGreen™ — Certificación de Eficiencia Digital Sostenible | MediaLab",
  description:
    "UXGreen™ es el primer estándar que une performance, accesibilidad, IA y sostenibilidad digital. Analiza tu sitio y obtén tu score gratuito. Certificación verificable para productos digitales de clase mundial.",
  alternates: {
    canonical: "/uxgreen",
    languages: {
      es: "/uxgreen",
      en: "/en/uxgreen",
      "x-default": "/uxgreen",
    },
  },
  keywords: [
    "UXGreen certificación sostenibilidad digital",
    "sustainable web design certificación",
    "eficiencia digital UX",
    "website carbon footprint análisis",
    "core web vitals certificación",
    "accesibilidad web WCAG certificación",
    "green UX framework",
    "AI efficiency website",
    "cognitive load web design",
    "UX sostenible Colombia",
    "MediaLab UXGreen",
    "certificación digital sostenible",
    "performance UX certificación",
    "sustainable UX agency",
    "digital carbon calculator",
  ],
  openGraph: {
    title: "UXGreen™ — El estándar de eficiencia digital sostenible | MediaLab",
    description:
      "Performance + Accesibilidad + IA + Carbono = UXGreen™. El primer estándar que mide la eficiencia real de tu producto digital. Analiza tu sitio gratis.",
    type: "website",
    url: "/uxgreen",
    images: [
      {
        url: "/images/og-uxgreen.png",
        width: 1200,
        height: 630,
        alt: "UXGreen™ — Certificación de eficiencia digital sostenible por MediaLab Ingeniería",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UXGreen™ — El estándar de eficiencia digital sostenible",
    description: "Performance + Accesibilidad + IA + Carbono. El primer score que mide la eficiencia real de tu sitio. Gratis.",
    images: ["/images/og-uxgreen.png"],
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "UXGreen™", item: "https://medialab.design/uxgreen" },
  ],
}

const certificationSchema = {
  "@context": "https://schema.org",
  "@type": "Certification",
  name: "UXGreen™ Certification",
  description:
    "Certificación de eficiencia digital sostenible que evalúa performance, Core Web Vitals, huella de carbono, accesibilidad, IA y carga cognitiva de productos digitales.",
  issuedBy: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    url: "https://medialab.design",
  },
  url: "https://medialab.design/uxgreen",
  inLanguage: "es",
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UXGreen™ Analyzer",
  url: "https://medialab.design/uxgreen#calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Herramienta gratuita de análisis de eficiencia digital: mide performance, Core Web Vitals, huella de carbono, accesibilidad, AI efficiency y carga cognitiva. Genera el UXGreen™ Score en tiempo real.",
  creator: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Análisis gratuito" },
  featureList: [
    "Análisis de performance en tiempo real",
    "Medición de huella de carbono digital",
    "Evaluación Core Web Vitals",
    "Auditoría de accesibilidad WCAG 2.2",
    "Score de eficiencia para IA",
    "Análisis de carga cognitiva",
    "Certificación UXGreen™",
  ],
  inLanguage: ["es", "en"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es UXGreen™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UXGreen™ es el framework y certificación de MediaLab que evalúa la eficiencia digital total de un sitio: performance, accesibilidad, huella de carbono, carga cognitiva, preparación para IA y UX en un único score. Es el primer estándar que une sostenibilidad digital y excelencia técnica en una certificación verificable.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funciona el UXGreen™ Analyzer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El UXGreen™ Analyzer mide tu sitio usando Website Carbon API y Google PageSpeed Insights en tiempo real, complementado con análisis heurístico por industria y volumen de tráfico. El resultado es un score ponderado de 8 dimensiones: Performance, Core Web Vitals, Carbon Efficiency, UX Efficiency, Accessibility, AI Efficiency, Cognitive Load y Sustainable UX.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuántos niveles de certificación UXGreen™ existen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Existen tres niveles: UXGreen™ Foundation (score 60-74), UXGreen™ Certified (75-89) y UXGreen™ Elite (90+). Cada nivel incluye un badge verificable y beneficios específicos. El análisis inicial es completamente gratuito.",
      },
    },
    {
      "@type": "Question",
      name: "¿Mejora el SEO con la certificación UXGreen™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Core Web Vitals y performance son señales de ranking directas en Google. Un sitio que mejora de 45 a 80 en CWV puede esperar una mejora del 15-35% en posicionamiento orgánico, más la reducción de bounce rate que Google usa como señal de comportamiento.",
      },
    },
  ],
}

export default function UXGreenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(certificationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main id="main-content">
        <UXGreenLanding />
      </main>
    </>
  )
}
