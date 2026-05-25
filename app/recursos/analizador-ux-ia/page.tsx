import type { Metadata } from "next"
import { AnalizadorUxIaContent } from "@/components/recursos/analizador-ux-ia-content"

export const metadata: Metadata = {
  title: "UX + AI Discovery Analyzer: diagnostica tu producto digital (gratis)",
  description:
    "Diagnóstico interactivo gratuito: mide la madurez de tu producto en claridad, UX, IA, diferenciación y conversión. Score, bloqueadores y quick wins al instante.",
  alternates: {
    canonical: "/recursos/analizador-ux-ia",
    languages: {
      es: "/recursos/analizador-ux-ia",
      en: "/en/recursos/analizador-ux-ia",
      "x-default": "/recursos/analizador-ux-ia",
    },
  },
  openGraph: {
    title: "UX + AI Discovery Analyzer | MediaLab Ingeniería",
    description:
      "Diagnostica la madurez de tu producto digital en 60 segundos: UX, IA, claridad, diferenciación y conversión. Resultado y roadmap al instante.",
    type: "website",
    url: "/recursos/analizador-ux-ia",
    images: [{ url: "/images/ai-discovery.jpg", width: 1200, height: 630, alt: "UX + AI Discovery Analyzer" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/ai-discovery.jpg"] },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://medialab.design" },
    { "@type": "ListItem", position: 2, name: "Recursos", item: "https://medialab.design/recursos/analizador-ux-ia" },
    { "@type": "ListItem", position: 3, name: "UX + AI Discovery Analyzer", item: "https://medialab.design/recursos/analizador-ux-ia" },
  ],
}

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UX + AI Discovery Analyzer",
  url: "https://medialab.design/recursos/analizador-ux-ia",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Diagnóstico interactivo gratuito que evalúa la madurez de un producto digital en claridad de producto, experiencia (UX), preparación para IA, diferenciación y conversión, y entrega score, bloqueadores y quick wins.",
  creator: { "@type": "Organization", name: "MediaLab Ingeniería", url: "https://medialab.design" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  inLanguage: ["es", "en"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto tarda el diagnóstico del UX + AI Discovery Analyzer?",
      acceptedAnswer: { "@type": "Answer", text: "Menos de 60 segundos. Son 5 preguntas visuales y el resultado es inmediato." },
    },
    {
      "@type": "Question",
      name: "¿Necesito dejar mi correo para empezar?",
      acceptedAnswer: { "@type": "Answer", text: "No. Puedes hacer el diagnóstico y ver tu score sin dar tu correo. Solo lo pedimos para desbloquear el análisis completo: insights, bloqueadores y roadmap." },
    },
    {
      "@type": "Question",
      name: "¿Es realmente gratis?",
      acceptedAnswer: { "@type": "Answer", text: "Sí. Es un recurso gratuito de MediaLab para ayudarte a entender la madurez de tu producto digital." },
    },
    {
      "@type": "Question",
      name: "¿Qué hago con el resultado?",
      acceptedAnswer: { "@type": "Answer", text: "Puedes aplicarlo tú con los quick wins, o agendar una sesión para que MediaLab lo aterrice contigo con discovery, diseño y desarrollo." },
    },
  ],
}

export default function AnalizadorUxIaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <AnalizadorUxIaContent />
    </>
  )
}
