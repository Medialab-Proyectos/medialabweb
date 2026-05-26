"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { PortfolioMetrics } from "@/components/portfolio/portfolio-metrics"
import { PortfolioCases } from "@/components/portfolio/portfolio-cases"
import { PortfolioCTA } from "@/components/portfolio/portfolio-cta"
import { StickyCTA } from "@/components/sticky-cta"

export function PortfolioContent() {
  return (
    <main id="main-content">
      <Navbar />
      <PortfolioHero />
      <PortfolioMetrics />
      <PortfolioCases />
      <PortfolioCTA />
      <Footer />
      <StickyCTA />
    </main>
  )
}
