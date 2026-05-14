import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CourseSectionNav } from "@/components/curso/course-section-nav"
import { CourseHero } from "@/components/curso/course-hero"
import { CourseProblem } from "@/components/curso/course-problem"
import { CourseTestimonials } from "@/components/curso/course-testimonials"
import { CourseComparison } from "@/components/curso/course-comparison"
import { CourseMethodology } from "@/components/curso/course-methodology"
import { CourseMidCta } from "@/components/curso/course-mid-cta"
import { CourseCurriculum } from "@/components/curso/course-curriculum"
import { CourseTransformation } from "@/components/curso/course-transformation"
import { CourseTools } from "@/components/curso/course-tools"
import { CourseValidation } from "@/components/curso/course-validation"
import { CourseFaq } from "@/components/curso/course-faq"
import { CourseCta } from "@/components/curso/course-cta"
import { CourseCommunity } from "@/components/curso/course-community"

/**
 * Landing Page — Metodología IA by MediaLab
 *
 * BEHAVIORAL DESIGN FUNNEL:
 *
 * 1. HOOK        → Hero: emotional hook + social proof + clear value prop
 * 2. MIRROR      → Problem: empathy — "we see what you feel"
 * 3. PROOF       → Testimonials: social proof EARLY (trust before explaining)
 * 4. MICRO-CTA   → Soft commitment — "¿Te identificas?"
 * 5. CONTRAST    → Comparison: traditional vs MediaLab — loss aversion
 * 6. SYSTEM      → Methodology: 12-phase system — authority + competence
 * 7. MICRO-CTA   → Commitment escalation — "¿Quieres ver el programa?"
 * 8. VALUE       → Curriculum: 14 modules — tangible value
 * 9. VISION      → Transformation: before vs after — aspirational identity
 * 10. ENABLEMENT → Tools: premium stack — value stacking
 * 11. TRUST      → Validation: academic + ethical — credibility
 * 12. RESOLVE    → FAQ: objection handling — remove friction
 * 13. CONVERT    → CTA: epic final — urgency + clarity
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Behavioral AI Experience Design — UX Prompt Design | Curso MediaLab',
  description: 'Curso premium de 8 semanas: 14 modulos, 12 fases. Aprende a usar IA como copiloto estrategico para disenar, investigar y construir productos digitales. Solo 30 cupos por cohorte. $995 USD.',
  openGraph: {
    title: 'Behavioral AI Experience Design — UX Prompt Design | MediaLab',
    description: 'Curso premium de 8 semanas para disenadores, developers y startups. Domina la IA sin perder tu criterio humano. 14 modulos, certificacion profesional.',
    url: '/curso',
    type: 'website',
  },
}

export default function CursoPage() {
  return (
    <main id="main-content" className="overflow-x-hidden">
      <Navbar />
      <CourseSectionNav />

      {/* 1. HOOK */}
      <CourseHero />

      {/* 2. MIRROR */}
      <CourseProblem />

      {/* 3. PROOF (social proof early) */}
      <CourseTestimonials />

      {/* 4. MICRO-CTA — soft commitment after emotional sections */}
      <CourseMidCta
        headline="Si te identificaste con algo de esto, no es casualidad."
        subtext="Diseñamos esta metodología para personas como tú."
        ctaText="Registrarme al curso →"
        ctaHref="#registro"
        variant="primary"
      />

      {/* 5. CONTRAST — loss aversion */}
      <CourseComparison />

      {/* 6. SYSTEM — authority */}
      <CourseMethodology />

      {/* 7. MICRO-CTA — commitment escalation */}
      <CourseMidCta
        headline="Cada fase existe por una razón."
        subtext="¿Quieres ver qué vas a poder hacer después de cada módulo?"
        ctaText="Ver el programa →"
        ctaHref="#programa"
        variant="subtle"
      />

      {/* 8. VALUE */}
      <CourseCurriculum />

      {/* 9. VISION — aspirational identity */}
      <CourseTransformation />

      {/* 10. ENABLEMENT — value stacking */}
      <CourseTools />

      {/* 11. TRUST */}
      <CourseValidation />

      {/* 12. RESOLVE — friction removal */}
      <CourseFaq />

      {/* 13. COMMUNITY — continuous UX collaboration */}
      <CourseCommunity />

      {/* 14. CONVERT + REGISTER — final conversion with registration form */}
      <CourseCta />

      <Footer />
    </main>
  )
}
