import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MarqueeTicker } from "@/components/marquee-ticker"
import { ClientLogos } from "@/components/client-logos"
import { TrustMetrics } from "@/components/trust-metrics"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
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

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <MarqueeTicker />
      <ClientLogos />
      <TrustMetrics />
      <AboutSection />
      <ServicesSection />
      {/* UXBox Discovery Form */}
      <UXBoxForm />
      <IndustriesSection />
      {/* World Presence Map */}
      <WorldPresence />
      <MethodSection />
      <TestimonialsSection />
      {/* Second conversion point after social proof */}
      <MidCTA
        headline="Únete a más de 40 empresas que aceleraron su producto"
        subheadline="Desde startups hasta enterprise — te ayudamos a lanzar más rápido y con confianza."
      />
      <DigitalProductsSection />
      <WhyUsSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
      <Footer />
      {/* Conversion-focused components */}
      <SocialProofBar />
      <StickyCTA />
    </main>
  )
}

