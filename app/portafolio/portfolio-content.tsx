"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { PortfolioCases } from "@/components/portfolio/portfolio-cases"
import { CTASection } from "@/components/cta-section"
import { StickyCTA } from "@/components/sticky-cta"

export function PortfolioContent() {
  return (
    <main id="main-content">
      <Navbar />
      <PortfolioHero />
      <PortfolioCases />
      <CTASection />
      <Footer />
      <StickyCTA />
    </main>
  )
}
