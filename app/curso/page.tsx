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
import { CourseAudience } from "@/components/curso/course-audience"
import { CourseTools } from "@/components/curso/course-tools"
import { CourseValidation } from "@/components/curso/course-validation"
import { CourseFaq } from "@/components/curso/course-faq"
import { CourseCta } from "@/components/curso/course-cta"
import { CourseCommunity } from "@/components/curso/course-community"
import { StickyCTA } from "@/components/sticky-cta"

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
 * 6. SYSTEM      → Methodology: 9-module system — authority + competence
 * 7. MICRO-CTA   → Commitment escalation — "¿Quieres ver el programa?"
 * 8. VALUE       → Curriculum: 9 modules — tangible value
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
        headline="Si te identificaste con algo de esto, no es casualidad."
        headlineEn="If any of this resonated, it's not a coincidence."
        subtext="Diseñamos esta metodología para personas como tú."
        subtextEn="We designed this methodology for people like you."
        ctaText="Inscribirme →"
        ctaTextEn="Enroll now →"
        ctaHref="#registro"
        variant="primary"
        bgImage="/images/curso/midcta-identified.png"
      />

      {/* 5. CONTRAST — loss aversion */}
      <CourseComparison />

      {/* 6. SYSTEM — authority */}
      <CourseMethodology />

      {/* 7. MICRO-CTA — commitment escalation */}
      <CourseMidCta
        headline="Cada fase existe por una razón."
        headlineEn="Every phase exists for a reason."
        subtext="¿Quieres ver qué vas a poder hacer después de cada módulo?"
        subtextEn="Want to see what you'll be able to do after each module?"
        ctaText="Ver el programa →"
        ctaTextEn="See the program →"
        ctaHref="#programa"
        variant="subtle"
        bgImage="/images/curso/midcta-methodology.png"
      />

      {/* 8. VALUE */}
      <CourseCurriculum />

      {/* 9. VISION — aspirational identity */}
      <CourseTransformation />

      {/* 9.5 AUDIENCE — expanded target: hybrid talent, 12+ university programs */}
      <CourseAudience />

      {/* 10. ENABLEMENT — value stacking */}
      <CourseTools />

      {/* 11. TRUST */}
      <CourseValidation />

      {/* 12. RESOLVE — friction removal */}
      <CourseFaq />

      {/* 13. COMMUNITY — continuous UX collaboration */}
      <CourseCommunity />

      {/* 13.5. COMMUNITY CTA — no button, just statement */}
      <CourseMidCta
        headline="La IA evoluciona cada semana. Tu comunidad también."
        headlineEn="AI evolves every week. So does your community."
        subtext="Mientras otros profesionales se quedan solos después de un curso, tú tendrás un equipo permanente para navegar cada cambio en la industria."
        subtextEn="While other professionals are on their own after a course, you'll have a permanent team to navigate every shift in the industry."
        variant="primary"
        bgImage="/images/curso/midcta-community.png"
      />

      {/* 14. CONVERT + REGISTER — final conversion with registration form */}
      <CourseCta />

      <Footer />

      {/* Mobile sticky inscription CTA */}
      <StickyCTA scrollToId="registro" labelEs="Inscribirme al curso" labelEn="Enroll in the course" />
    </main>
  )
}
