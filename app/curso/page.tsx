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
import { CourseObjective } from "@/components/curso/course-objective"
import { CourseAudience } from "@/components/curso/course-audience"
import { CourseTools } from "@/components/curso/course-tools"
import { CourseValidation } from "@/components/curso/course-validation"
import { CourseFaq } from "@/components/curso/course-faq"
import { CourseCta } from "@/components/curso/course-cta"
import { CourseCommunity } from "@/components/curso/course-community"
import { StickyCTA } from "@/components/sticky-cta"
import { CourseChatAssistant } from "@/components/curso/course-chat-assistant"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Curso AI UX Architect — Diseña Productos con IA en 8 Semanas | MediaLab",
  description:
    "Domina UX, psicología de adopción digital e IA en 8 semanas. Conviértete en AI UX Architect y diseña productos digitales que las personas aman y los algoritmos priorizan.",
  alternates: {
    canonical: "/curso",
    languages: {
      es: "/curso",
      en: "/en/curso",
      "x-default": "/curso",
    },
  },
  openGraph: {
    title: "Curso AI UX Architect | MediaLab Ingeniería",
    description:
      "UX + IA + psicología de adopción digital en 8 semanas. Para diseñadores, PMs y founders que quieren crear productos digitales de alto impacto.",
    url: "/curso",
    images: [{ url: "/images/og-curso.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curso AI UX Architect — UX con IA en 8 semanas | MediaLab",
    description:
      "Domina UX, psicología de adopción digital e IA. Certifícate como AI UX Architect.",
    images: ["/images/og-curso.png"],
  },
}

export default function CursoPage() {
  return (
    <main id="main-content" className="overflow-x-hidden">
      <Navbar />

      {/* 1. Hook */}
      <CourseHero />

      <CourseSectionNav />

      {/* 2. Problem */}
      <CourseProblem />

      {/* 2.5 Micro-commitment: low-friction action after pain activation (Clear + Eyal) */}
      <CourseMidCta
        headline="No tienes que decidir ahora."
        headlineEn="You don't have to decide now."
        subtext="Descarga el currículo completo y revísalo con calma. 9 módulos, herramientas, entregables y todo lo que vas a construir."
        subtextEn="Download the full curriculum and review it at your pace. 9 modules, tools, deliverables, and everything you'll build."
        ctaText="Descargar currículo en PDF →"
        ctaTextEn="Download curriculum PDF →"
        ctaHref="/images/curso/Curso2026.pdf"
        variant="subtle"
      />

      {/* 3. Objective: what the course is about */}
      <CourseObjective />

      {/* 4. Audience: who it's for */}
      <CourseAudience />

      {/* 4. Proof */}
      <CourseTestimonials />

      {/* 5. Soft commitment */}
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

      {/* 6. Contrast */}
      <CourseComparison />

      {/* 7. System */}
      <CourseMethodology />

      {/* 8. Commitment escalation */}
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

      {/* 9. Curriculum */}
      <CourseCurriculum />

      {/* 10. Transformation */}
      <CourseTransformation />

      {/* 11. Tools */}
      <CourseTools />

      {/* 12. Trust */}
      <CourseValidation />

      {/* 13. FAQ */}
      <CourseFaq />

      {/* 14. Community */}
      <CourseCommunity />

      {/* 15. Community statement */}
      <CourseMidCta
        headline="La IA evoluciona cada semana. Tu comunidad también."
        headlineEn="AI evolves every week. So does your community."
        subtext="Mientras otros profesionales se quedan solos después de un curso, tú tendrás un equipo permanente para navegar cada cambio en la industria."
        subtextEn="While other professionals are on their own after a course, you'll have a permanent team to navigate every shift in the industry."
        variant="primary"
        bgImage="/images/curso/midcta-community.png"
      />

      {/* 16. Conversion */}
      <CourseCta />

      <Footer />
      <StickyCTA scrollToId="registro" labelEs="Inscribirme al curso" labelEn="Enroll in the course" />
      <CourseChatAssistant />
    </main>
  )
}
