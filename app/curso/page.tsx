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
        headline="¿Te suena familiar?"
        subtext="No estás solo. Diseñamos esta metodología exactamente para esto."
        ctaText="Ver cómo lo resolvemos →"
        ctaHref="#diferencia"
        variant="subtle"
      />

      {/* 5. CONTRAST — loss aversion */}
      <CourseComparison />

      {/* 6. SYSTEM — authority */}
      <CourseMethodology />

      {/* 7. MICRO-CTA — commitment escalation */}
      <CourseMidCta
        headline="12 fases. Un sistema completo."
        subtext="¿Quieres ver exactamente qué aprenderás en cada módulo?"
        ctaText="Explorar el programa completo →"
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

      {/* 13. CONVERT — final conversion */}
      <CourseCta />

      <Footer />
    </main>
  )
}
