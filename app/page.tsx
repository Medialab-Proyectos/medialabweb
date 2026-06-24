import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MarqueeTicker } from "@/components/marquee-ticker"
import { ClientLogos } from "@/components/client-logos"
import { TrustMetrics } from "@/components/trust-metrics"
import { ValueSection } from "@/components/value-section"
import { ServicesSummarySection } from "@/components/services-summary-section"
import { MethodSection } from "@/components/method-section"
import { UXBoxForm } from "@/components/uxbox-form"
import { IndustriesSection } from "@/components/industries-section"
import { WorldPresence } from "@/components/world-presence"
import { TestimonialsSection } from "@/components/testimonials-section"
import { DigitalProductsSection } from "@/components/digital-products-section"
import { FAQSection } from "@/components/faq-section"
import { BlogSection } from "@/components/blog-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { SocialProofBar } from "@/components/social-proof-bar"
import { StickyCTA } from "@/components/sticky-cta"
import { MidCTA } from "@/components/mid-cta"
import { EntryDoorsSection } from "@/components/entry-doors-section"
import { HomeChatAssistant } from "@/components/home-chat-assistant"
import { HomeSectionNav } from "@/components/home-section-nav"
import { CoursePromoSection } from "@/components/course-promo-section"
import { HomeScrollRestorer } from "@/components/home-scroll-restorer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diseño de Productos Digitales con UX, IA y Psicología | MediaLab",
  description:
    "Productos digitales que las personas aman. MediaLab combina UX/UI, inteligencia artificial y psicología del consumidor para diseñar y desarrollar tu producto — de idea a producción en semanas.",
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
      "Combinamos investigación de usuarios, diseño conductual e IA para crear experiencias digitales que convierten. Prueba UXBox: discovery de producto con IA gratis.",
    url: "/",
    siteName: "MediaLab Ingeniería",
    images: [{ url: "/images/og-main-brand.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaLab Ingeniería — UX/UI, IA y Psicología del Consumidor",
    description:
      "Diseñamos productos digitales que las personas aman. UX, IA y psicología del consumidor desde Bogotá para el mundo.",
    images: ["/images/og-main-brand.png"],
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
      {/* FAQ Schema — synchronized with components/faq-section.tsx */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué es UXBox y por qué debería importarme?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "UXBox es nuestra herramienta de IA que toma tu idea de producto y genera una propuesta estructurada — con requisitos, estrategia UX y conceptos de diseño — en días en lugar de meses. Si alguna vez sentiste que tu equipo lleva semanas definiendo sin avanzar, esto es para ti."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuánto tiempo toma empezar a ver resultados reales?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Con UXBox, puedes tener claridad sobre tu producto en 3-5 días. Un primer prototipo validado, en 2-4 semanas. No te vamos a decir que todo toma meses — porque no tiene por qué."
                }
              },
              {
                "@type": "Question",
                "name": "¿Trabajan con empresas de mi industria?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Trabajamos con equipos en Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Sostenibilidad y Plataformas Digitales. Si tu producto tiene usuarios — humanos que necesitan sentir confianza — podemos ayudarte."
                }
              },
              {
                "@type": "Question",
                "name": "¿Pueden construir mi producto completo o solo diseñan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ambas. Hacemos todo el camino: investigación, diseño UX/UI y desarrollo de software a medida. Si solo necesitas diseño o solo desarrollo, también funciona. Nos adaptamos a lo que tu equipo necesite."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo empiezo si todavía no tengo claro lo que necesito?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ese es justo el punto de partida perfecto. Haz clic en \"Quiero transformar mi producto\" y te contactaremos en 24h para una sesión de discovery gratuita de 30 minutos. Saldrás con más claridad de la que tienes ahora. Sin compromiso."
                }
              },
              {
                "@type": "Question",
                "name": "¿Puedo integrarlos como parte de mi equipo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, muchos de nuestros clientes nos integran como su equipo de producto externo. Trabajamos dentro de tus sprints, con tus herramientas y junto a tus desarrolladores. Es como tener un equipo senior de UX + Desarrollo sin el costo de contratación."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo sé que no van a diseñar algo bonito que nadie use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Porque empezamos investigando a tus usuarios, no dibujando pantallas. Cada decisión de diseño está respaldada por datos de comportamiento real. Diseñamos para que funcione primero — y que se vea increíble después."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué los hace diferentes de otras agencias UX?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tres cosas: (1) UXBox — IA que comprime tu discovery 10x, (2) investigamos cómo piensan tus usuarios antes de diseñar, y (3) hacemos todo end-to-end: investigación, diseño y desarrollo. No pasamos el trabajo a un tercero."
                }
              }
            ]
          })
        }}
      />
      {/* Book Schema for authority */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "@id": "https://medialab.design/#book",
            "name": "Bienvenidos al Zero UI",
            "author": {
              "@type": "Person",
              "name": "Christian Benavides",
              "url": "https://medialab.design"
            },
            "publisher": {
              "@type": "Organization",
              "name": "MediaLab Ingeniería"
            },
            "datePublished": "2026-01",
            "inLanguage": "es",
            "url": "https://www.zeroui.me/",
            "about": [
              "Diseño de Experiencia Consciente",
              "Zero UI",
              "Neurociencia del diseño",
              "IA Adaptativa",
              "Estoicismo digital"
            ]
          })
        }}
      />
      {/* LocalBusiness Schema for local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://medialab.design/#localbusiness",
            "name": "MediaLab Ingeniería",
            "description": "Agencia de diseño UX/UI, inteligencia artificial y desarrollo de productos digitales en Bogotá. Especialistas en experiencias B2B y B2C.",
            "url": "https://medialab.design",
            "logo": "https://medialab.design/images/logo-medialab-400.png",
            "image": "https://medialab.design/images/og-main-brand.png",
            "telephone": "+57-305-400-9505",
            "email": "info@medialab.design",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bogotá",
              "addressRegion": "Cundinamarca",
              "addressCountry": "CO"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 4.711,
              "longitude": -74.0721
            },
            "priceRange": "$$$",
            "currenciesAccepted": "COP, USD",
            "paymentAccepted": "Cash, Credit Card, Wire Transfer",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            ],
            "sameAs": [
              "https://www.linkedin.com/company/medialab-ingenieria",
              "https://x.com/MediaLabIng",
              "https://www.instagram.com/medialabingenieria"
            ]
          })
        }}
      />
      {/* ProfessionalService Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "@id": "https://medialab.design/#professionalservice",
            "name": "MediaLab Ingeniería",
            "url": "https://medialab.design",
            "image": "https://medialab.design/images/og-main-brand.png",
            "logo": "https://medialab.design/images/logo-medialab-400.png",
            "description": "Agencia especializada en diseño UX/UI, IA, SEO técnico, CRO, diseño conductual y desarrollo de software para productos digitales B2B y B2C.",
            "areaServed": ["Colombia", "Latinoamérica", "United States", "Worldwide"],
            "serviceType": [
              "Diseño UX/UI",
              "SEO técnico",
              "Diseño de producto digital",
              "Desarrollo de software a medida",
              "Discovery de producto con IA",
              "CRO y optimización de conversión"
            ],
            "audience": [
              { "@type": "BusinessAudience", "audienceType": "Empresas B2B" },
              { "@type": "Audience", "audienceType": "Marcas B2C y startups" }
            ],
            "knowsAbout": [
              "User Experience",
              "Technical SEO",
              "Artificial Intelligence",
              "Behavioral Design",
              "Conversion Rate Optimization",
              "B2B SaaS",
              "B2C Applications"
            ]
          })
        }}
      />
      {/* ImageGallery Schema — helps Google show image thumbnails in search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "MediaLab Ingeniería — Laboratorio de Diseño Digital",
            "description": "Espacios de trabajo, equipo y proyectos de MediaLab Ingeniería. Agencia de diseño UX/UI, IA y desarrollo de productos digitales en Bogotá.",
            "url": "https://medialab.design",
            "creator": {
              "@type": "Organization",
              "name": "MediaLab Ingeniería",
              "url": "https://medialab.design"
            },
            "image": [
              {
                "@type": "ImageObject",
                "url": "https://medialab.design/images/og-image-gallery.png",
                "name": "Laboratorio de diseño digital MediaLab",
                "description": "Espacio de trabajo del equipo MediaLab: diseño UX/UI, desarrollo de producto y colaboración con IA",
                "width": 1200,
                "height": 630
              },
              {
                "@type": "ImageObject",
                "url": "https://medialab.design/images/team-collaboration.png",
                "name": "Equipo MediaLab en sesión de diseño colaborativo",
                "description": "Profesionales de UX, diseño e ingeniería trabajando en proyectos de producto digital",
                "width": 1200,
                "height": 630
              },
              {
                "@type": "ImageObject",
                "url": "https://medialab.design/images/ux-research.png",
                "name": "Investigación UX en MediaLab",
                "description": "Sesión de investigación de usuarios y diseño conductual en MediaLab Ingeniería",
                "width": 1200,
                "height": 630
              },
              {
                "@type": "ImageObject",
                "url": "https://medialab.design/images/service-ux-design-team.png",
                "name": "Equipo de diseño UX/UI MediaLab",
                "description": "Diseñadores UX/UI trabajando en interfaces y sistemas de diseño",
                "width": 1200,
                "height": 630
              },
              {
                "@type": "ImageObject",
                "url": "https://medialab.design/images/service-ai-discovery-team.png",
                "name": "Discovery de producto con IA",
                "description": "Equipo de discovery utilizando inteligencia artificial para acelerar la definición de productos digitales",
                "width": 1200,
                "height": 630
              }
            ]
          })
        }}
      />
      {/* UXGreen™ Certification Schema — entidad de certificación propia */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "UXGreen™ Analyzer",
            "alternateName": ["UXGreen™", "UXGreen Certification", "UXGreen™ Framework"],
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": "https://medialab.design/uxgreen",
            "description": "Herramienta gratuita de análisis de eficiencia digital sostenible. Mide performance, Core Web Vitals, huella de carbono, accesibilidad WCAG 2.2, AI efficiency y carga cognitiva en un único UXGreen™ Score.",
            "creator": {
              "@type": "Organization",
              "name": "MediaLab Ingeniería",
              "url": "https://medialab.design"
            },
            "featureList": [
              "Análisis de performance en tiempo real (Google PageSpeed)",
              "Medición de huella de carbono digital (Website Carbon API)",
              "Evaluación Core Web Vitals (LCP, CLS, TBT)",
              "Auditoría de accesibilidad WCAG 2.2",
              "Score de eficiencia para IA y LLMs",
              "Análisis de carga cognitiva",
              "Certificación UXGreen™ verificable"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Análisis UXGreen™ gratuito"
            }
          })
        }}
      />
      {/* UXBox SoftwareApplication Schema — entidad de producto propio */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "UXBox",
            "alternateName": "UXBox Discovery",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": "https://medialab.design/#uxbox",
            "description": "Herramienta de discovery de producto con IA de MediaLab: convierte una idea en un brief de producto estructurado (problema, usuarios, requisitos y enfoque de diseño) en minutos, revisado por un equipo humano.",
            "creator": {
              "@type": "Organization",
              "name": "MediaLab Ingeniería",
              "url": "https://medialab.design"
            },
            "featureList": [
              "Brief de producto generado con IA",
              "Definición de problema y público objetivo",
              "Requisitos y enfoque de diseño UX",
              "Revisión por expertos humanos"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Generación de brief de discovery gratuita"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "12",
              "bestRating": "5"
            },
            "screenshot": "https://medialab.design/images/og-main-brand.png",
            "softwareVersion": "2.0",
            "releaseNotes": "Generación de brief de producto con IA, análisis competitivo automático y prototipado conceptual en minutos."
          })
        }}
      />
      <HomeScrollRestorer />
      <Navbar />

      {/* — AWARENESS — */}
      <HeroSection />
      <HomeSectionNav />
      <MarqueeTicker />

      {/* — ÍNDICE DE DECISIÓN — 3 puertas sobre el pliegue */}
      <EntryDoorsSection />

      {/* — TRUST — prueba social temprana */}
      <ClientLogos />
      <TrustMetrics />

      {/* — PROBLEMA / VALOR (fusión de About + ExperienceDesign + WhyUs) — */}
      <ValueSection />

      {/* — VALOR — resumen en la home; el detalle vive en /servicios/* */}
      <ServicesSummarySection />

      {/* — CÓMO TRABAJAMOS — método original "5 pasos" con indicadores (tiempo, satisfacción…) */}
      <MethodSection />

      {/* — ACTIVACIÓN — UXBox subido: el CTA del hero ahora encuentra su destino cerca */}
      <UXBoxForm />

      {/* — CONTEXTO — relevancia sectorial + alcance antes de la prueba */}
      <IndustriesSection />
      <WorldPresence />

      {/* — PRUEBA / DESEO (cluster) — testimonios + portafolio UXLab */}
      <TestimonialsSection />
      <DigitalProductsSection />

      {/* — OTRA PUERTA — UXSchool (audiencia profesional), fuera del hilo B2B */}
      <CoursePromoSection />

      {/* — AUTORIDAD / CONTENIDO — */}
      <BlogSection />

      {/* — EMPUJÓN FINAL — justo antes de objeciones y cierre */}
      <MidCTA
        headline="Cada sprint sin investigación de usuarios es inversión que no regresa"
        headlineEn="Every sprint without user research is investment that doesn't come back"
        subheadline="Ya viste cómo trabajamos. Ahora imagina eso aplicado a tu producto. 40+ equipos ya dieron el paso — ¿y tú?"
        subheadlineEn="You've seen how we work. Now imagine that applied to your product. 40+ teams already took the step — what about you?"
      />

      {/* — OBJECIONES — */}
      <FAQSection />

      {/* — CIERRE — */}
      <CTASection />

      <Footer />

      {/* Engagement overlays */}
      <SocialProofBar />
      <StickyCTA />

      {/* Asistente conversacional Ada (guía no intrusiva) */}
      <HomeChatAssistant />
    </main>
  )
}
