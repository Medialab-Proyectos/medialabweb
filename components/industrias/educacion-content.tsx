"use client"

import Link from "next/link"
import {
  Sparkles, GraduationCap, Trophy, Repeat, Users, BookOpen, Gauge,
  ArrowRight, ChevronRight, CheckCircle2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function EducacionContent() {
  const { t, localized } = useLanguage()

  const focus = [
    {
      icon: Trophy,
      title: t("Motivación y finalización", "Motivation and completion"),
      desc: t(
        "Diseñamos progreso visible, micro-logros y refuerzos para que más estudiantes terminen lo que empiezan.",
        "We design visible progress, micro-achievements, and reinforcement so more students finish what they start."
      ),
    },
    {
      icon: BookOpen,
      title: t("Aprendizaje sin fricción", "Frictionless learning"),
      desc: t(
        "Quitamos todo lo que distrae del contenido: navegación clara, ritmo adecuado y carga cognitiva controlada.",
        "We remove everything that distracts from the content: clear navigation, right pace, and controlled cognitive load."
      ),
    },
    {
      icon: Repeat,
      title: t("Hábito y retorno", "Habit and return"),
      desc: t(
        "Diseño conductual para crear el hábito de volver: recordatorios útiles, no culpa, y sensación de avance.",
        "Behavioral design to build the habit of returning: useful reminders, no guilt, and a sense of progress."
      ),
    },
    {
      icon: Users,
      title: t("Multi-rol y gestión", "Multi-role and management"),
      desc: t(
        "Experiencias para estudiantes, docentes y administradores, con herramientas de seguimiento y evaluación.",
        "Experiences for students, instructors, and admins, with tracking and assessment tools."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Por qué la UX importa en plataformas educativas?", "Why does UX matter in educational platforms?"),
      a: t(
        "Porque la mayor pérdida en educación digital es el abandono. Si la plataforma es confusa o desmotivante, el estudiante no vuelve. Una buena UX reduce la fricción, sostiene la motivación y aumenta las tasas de finalización — el resultado que de verdad importa.",
        "Because the biggest loss in digital education is drop-off. If the platform is confusing or demotivating, the student doesn't return. Good UX reduces friction, sustains motivation, and increases completion rates — the result that truly matters."
      ),
    },
    {
      q: t("¿Cómo aumentan la finalización de cursos?", "How do you increase course completion?"),
      a: t(
        "Aplicamos diseño conductual: progreso visible, metas alcanzables, refuerzo positivo y recordatorios que motivan sin culpar. Combinado con investigación de los estudiantes reales, rediseñamos los momentos donde la gente abandona.",
        "We apply behavioral design: visible progress, achievable goals, positive reinforcement, and reminders that motivate without guilt. Combined with research on real students, we redesign the moments where people drop off."
      ),
    },
    {
      q: t("¿Diseñan para LMS y e-learning corporativo?", "Do you design for LMS and corporate e-learning?"),
      a: t(
        "Sí. Hemos diseñado plataformas de capacitación y motores de aprendizaje para instituciones y empresas, con soporte multi-rol, seguimiento de progreso y evaluación de desempeño.",
        "Yes. We've designed training platforms and learning engines for institutions and companies, with multi-role support, progress tracking, and performance evaluation."
      ),
    },
    {
      q: t("¿Trabajan con instituciones y con EdTech?", "Do you work with institutions and EdTech?"),
      a: t(
        "Ambos. Con instituciones entendemos la complejidad de necesidades académicas y administrativas; con EdTech priorizamos validación rápida y experiencias que retienen y convierten.",
        "Both. With institutions we understand the complexity of academic and administrative needs; with EdTech we prioritize fast validation and experiences that retain and convert."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="edu-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
            <ChevronRight size={12} />
            <span className="text-white/40">{t("Industrias", "Industries")}</span>
            <ChevronRight size={12} />
            <span className="text-white/80">{t("Educación", "Education")}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
            <Sparkles size={14} /> {t("Industria", "Industry")}
          </div>

          <h1 id="edu-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
            {t("Diseño UX para educación: plataformas donde aprender se siente natural", "Education UX design: platforms where learning feels natural")}
          </h1>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t(
              "El UX para educación es el diseño de plataformas de aprendizaje que sostienen la motivación y aumentan la finalización. En MediaLab combinamos investigación de usuarios, diseño conductual e IA para crear experiencias educativas —LMS, e-learning y capacitación corporativa— donde aprender se siente natural, no forzado.",
              "Education UX is the design of learning platforms that sustain motivation and increase completion. At MediaLab we combine user research, behavioral design, and AI to create educational experiences — LMS, e-learning, and corporate training — where learning feels natural, not forced."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <BookingModal>
              <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                {t("Hablemos de tu plataforma educativa", "Let's talk about your learning platform")}
              </button>
            </BookingModal>
            <Link href={localized("/portafolio")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
              {t("Ver casos", "See cases")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué es diferente? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué la UX educativa es diferente?", "Why is education UX different?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "En educación el éxito no es que el usuario entre: es que termine y aprenda. La motivación es frágil y la carga cognitiva es real. Diseñar educación es equilibrar claridad, ritmo y refuerzo emocional para que el estudiante sienta que avanza y quiera volver.",
              "In education, success isn't the user logging in: it's finishing and learning. Motivation is fragile and cognitive load is real. Designing education means balancing clarity, pace, and emotional reinforcement so the student feels they're progressing and wants to return."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué diseñamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-disenamos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-disenamos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué diseñamos para educación?", "What do we design for education?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {focus.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>
                  <f.icon size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold text-base text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("¿Plataforma nueva? Empieza por el ", "New platform? Start with ")}
            <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium hover:underline">{t("discovery con IA", "AI discovery")}</Link>
            {t(" o el ", " or ")}
            <Link href={localized("/servicios/diseno-ux-ui")} className="text-[var(--magenta)] font-medium hover:underline">{t("diseño UX/UI", "UX/UI design")}</Link>.
          </p>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-20 px-6 bg-background" aria-labelledby="resultados">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="resultados" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué resultados generamos?", "What results do we drive?")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Trophy, label: t("Mayor tasa de finalización", "Higher completion rate") },
              { icon: Repeat, label: t("Más retorno y constancia", "More return and consistency") },
              { icon: Gauge, label: t("Menos abandono temprano", "Less early drop-off") },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border bg-card">
                <b.icon size={18} style={{ color: "var(--magenta)" }} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {t("Hemos diseñado plataformas educativas y de capacitación reales — míralas en el ", "We've designed real educational and training platforms — see them in our ")}
            <Link href={localized("/portafolio")} className="text-[var(--magenta)] font-medium hover:underline">{t("portafolio", "portfolio")}</Link>.
            {t(" Te ayudamos a través de nuestros servicios de ", " We help you through our services of ")}
            <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium hover:underline">{t("Discovery con IA", "AI Discovery")}</Link>
            {t(", ", ", ")}
            <Link href={localized("/servicios/diseno-ux-ui")} className="text-[var(--magenta)] font-medium hover:underline">{t("Diseño UX/UI", "UX/UI Design")}</Link>
            {t(" y ", " and ")}
            <Link href={localized("/servicios/desarrollo-producto-digital")} className="text-[var(--magenta)] font-medium hover:underline">{t("Desarrollo de Producto", "Product Development")}</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="faq">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <h2 id="faq" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("Preguntas frecuentes", "Frequently asked questions")}
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((f) => (
              <div key={f.q} className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-display font-bold text-lg text-foreground">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-background" aria-labelledby="cta">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 id="cta" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Construyes o mejoras una plataforma educativa?", "Building or improving a learning platform?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Te mostramos dónde pierdes estudiantes y cómo retenerlos.",
              "30 minutes, no commitment. We'll show you where you lose students and how to retain them."
            )}
          </p>
          <BookingModal>
            <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
              style={{ background: "#E8751A" }}>
              {t("Agenda tu sesión gratuita", "Book your free session")} <CheckCircle2 size={16} />
            </button>
          </BookingModal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
