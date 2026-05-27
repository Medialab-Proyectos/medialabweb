import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MarqueeTicker } from "@/components/marquee-ticker"
import { ClientLogos } from "@/components/client-logos"
import { TrustMetrics } from "@/components/trust-metrics"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { ExperienceDesignSection } from "@/components/experience-design-section"
import { UXBoxForm } from "@/components/uxbox-form"
import { IndustriesSection } from "@/components/industries-section"
import { WorldPresence } from "@/components/world-presence"
import { MethodSection } from "@/components/method-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { DigitalProductsSection } from "@/components/digital-products-section"
import { WhyUsSection } from "@/components/why-us-section"
import { FAQSection } from "@/components/faq-section"
import { BlogSection } from "@/components/blog-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { SocialProofBar } from "@/components/social-proof-bar"
import { StickyCTA } from "@/components/sticky-cta"
import { MidCTA } from "@/components/mid-cta"
import { CoursePromoSection } from "@/components/course-promo-section"
import { HomeScrollRestorer } from "@/components/home-scroll-restorer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agencia UX/UI con IA y Psicología del Consumidor | MediaLab Ingeniería",
  description:
    "Diseñamos productos digitales que las personas aman: UX/UI con IA, discovery de producto acelerado, CRO para SaaS y desarrollo a medida. Bogotá, Colombia.",
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "MediaLab Ingeniería — UX/UI, IA y Psicología del Consumidor",
    description:
      "Combinamos investigación de usuarios, diseño conductual e IA para crear experiencias digitales que conectan emocionalmente y convierten.",
    url: "/",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaLab Ingeniería — UX/UI, IA y Psicología del Consumidor",
    description:
      "Diseñamos productos digitales que las personas aman. UX, IA y psicología del consumidor desde Bogotá para el mundo.",
    images: ["/images/og-image.png"],
  },
}

/**
 * Information Architecture Flow (2026 UX Best Practices):
 *
 * 1. AWARENESS  — Hero + Marquee: captura inmediata, propuesta de valor clara
 * 2. TRUST      — Client Logos + Metrics: prueba social temprana (reduce bounce)
 * 3. IDENTITY   — About: quiénes somos, diferencial humano
 * 4. VALUE      — Services: qué hacemos (responde "¿cómo me ayuda?")
 * 5. METHOD     — Methodology: cómo lo hacemos (transparencia = confianza)
 * 6. PROOF      — Testimonials: validación de terceros
 * 7. MID-CTA    — Primera conversión suave tras construir confianza
 * 7.5 EDUCATE   — Course Promo: formación profesional IA (segundo embudo)
 * 8. ACTIVATE   — UXBox Form: herramienta interactiva (engagement alto)
 * 9. CONTEXT    — Industries + World Presence: relevancia sectorial + alcance
 * 10. SHOWCASE  — Digital Products: portafolio tangible
 * 11. REINFORCE — Why Us: refuerzo de diferenciadores
 * 12. CONTENT   — Blog: contenido de valor (SEO + autoridad)
 * 13. RESOLVE   — FAQ: elimina objeciones finales
 * 14. CONVERT   — CTA final: cierre con urgencia y claridad
 */
export default function Home() {
  return (
    <main id="main-content">
      <HomeScrollRestorer />
      <Navbar />

      {/* — AWARENESS — */}
      <HeroSection />
      <MarqueeTicker />

      {/* — TRUST — */}
      <ClientLogos />
      <TrustMetrics />

      {/* — IDENTITY — */}
      <AboutSection />

      {/* — VALUE PROPOSITION — */}
      <ServicesSection />

      {/* — EXPERIENCE STRATEGY — */}
      <ExperienceDesignSection />

      {/* — METHODOLOGY (transparencia) — */}
      <MethodSection />

      {/* — SOCIAL PROOF — */}
      <TestimonialsSection />

      {/* — MID-FUNNEL CONVERSION — */}
      <MidCTA
        headline="Cada sprint sin investigación de usuarios es inversión que no regresa"
        headlineEn="Every sprint without user research is investment that doesn't come back"
        subheadline="Ya viste cómo trabajamos. Ahora imagina eso aplicado a tu producto. 40+ equipos ya dieron el paso — ¿y tú?"
        subheadlineEn="You've seen how we work. Now imagine that applied to your product. 40+ teams already took the step — what about you?"
      />

      {/* — EDUCATION & TRAINING — */}
      <CoursePromoSection />

      {/* — INTERACTIVE ENGAGEMENT — */}
      <UXBoxForm />

      {/* — CONTEXTUAL RELEVANCE — */}
      <IndustriesSection />
      <WorldPresence />

      {/* — PORTFOLIO — */}
      <DigitalProductsSection />

      {/* — REINFORCEMENT — */}
      <WhyUsSection />

      {/* — CONTENT & AUTHORITY — */}
      <BlogSection />

      {/* — OBJECTION HANDLING — */}
      <FAQSection />

      {/* — FINAL CONVERSION — */}
      <CTASection />

      <Footer />

      {/* Engagement overlays */}
      <SocialProofBar />
      <StickyCTA />
    </main>
  )
}
