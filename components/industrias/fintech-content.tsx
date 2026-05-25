"use client"

import Link from "next/link"
import {
  Sparkles, ShieldCheck, Eye, HandCoins, Gauge, CheckCircle2,
  ArrowRight, ChevronRight, Lock, Users,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function FintechContent() {
  const { t, localized } = useLanguage()

  const focus = [
    {
      icon: ShieldCheck,
      title: t("Confianza que se siente", "Trust that's felt"),
      desc: t(
        "Cada pantalla comunica seguridad antes de pedir un dato. La confianza no se explica con texto legal, se diseña.",
        "Every screen signals security before asking for data. Trust isn't explained with legal text — it's designed."
      ),
    },
    {
      icon: Gauge,
      title: t("Onboarding sin fricción", "Frictionless onboarding"),
      desc: t(
        "Reducimos el abandono en registro, KYC y primera transacción con flujos claros y progresivos.",
        "We reduce drop-off in signup, KYC, and first transaction with clear, progressive flows."
      ),
    },
    {
      icon: HandCoins,
      title: t("Decisiones financieras claras", "Clear financial decisions"),
      desc: t(
        "Diseño conductual para que el usuario entienda costos, riesgos y beneficios sin ansiedad.",
        "Behavioral design so users understand costs, risks, and benefits without anxiety."
      ),
    },
    {
      icon: Lock,
      title: t("Cumplimiento sin fricción", "Compliance without friction"),
      desc: t(
        "Integramos requisitos regulatorios (KYC/AML) en experiencias que no sienten como un interrogatorio.",
        "We bake regulatory requirements (KYC/AML) into experiences that don't feel like an interrogation."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Por qué la UX en fintech es diferente?", "Why is fintech UX different?"),
      a: t(
        "Porque el usuario arriesga su dinero. La fricción emocional —miedo a equivocarse, desconfianza, ansiedad— pesa más que en otros sectores. Diseñar fintech es diseñar confianza: cada interacción debe reducir la percepción de riesgo y dar control al usuario.",
        "Because the user is risking their money. Emotional friction — fear of mistakes, distrust, anxiety — weighs more than in other sectors. Designing fintech is designing trust: every interaction must reduce perceived risk and give the user control."
      ),
    },
    {
      q: t("¿Qué es el diseño conductual aplicado a fintech?", "What is behavioral design applied to fintech?"),
      a: t(
        "Es aplicar psicología del consumidor —sesgos, anclas de decisión, momentos de fricción— para guiar al usuario hacia decisiones financieras informadas y seguras, de forma ética. No es manipular: es respetar cómo las personas realmente deciden bajo incertidumbre.",
        "It's applying consumer psychology — biases, decision anchors, friction points — to guide users toward informed, safe financial decisions, ethically. It's not manipulation: it's respecting how people actually decide under uncertainty."
      ),
    },
    {
      q: t("¿Cómo reducen el abandono en el onboarding?", "How do you reduce onboarding drop-off?"),
      a: t(
        "Mapeamos cada paso del registro y KYC, identificamos dónde y por qué el usuario duda, y rediseñamos esos momentos: dividir tareas, mostrar progreso, anticipar objeciones y dar señales de seguridad justo donde aparece la ansiedad.",
        "We map every signup and KYC step, identify where and why users hesitate, and redesign those moments: breaking up tasks, showing progress, anticipating objections, and adding security signals right where anxiety appears."
      ),
    },
    {
      q: t("¿Trabajan con startups fintech y con bancos establecidos?", "Do you work with fintech startups and established banks?"),
      a: t(
        "Sí. Con startups aceleramos el discovery y la validación antes de invertir en desarrollo; con bancos y entidades establecidas rediseñamos flujos críticos y modernizamos experiencias sin romper la operación.",
        "Yes. With startups we accelerate discovery and validation before investing in development; with banks and established institutions we redesign critical flows and modernize experiences without breaking operations."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="fintech-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
            <ChevronRight size={12} />
            <span className="text-white/40">{t("Industrias", "Industries")}</span>
            <ChevronRight size={12} />
            <span className="text-white/80">Fintech</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
            <Sparkles size={14} /> {t("Industria", "Industry")}
          </div>

          <h1 id="fintech-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
            {t("Diseño UX para Fintech: donde la confianza se siente, no se explica", "Fintech UX design: where trust is felt, not explained")}
          </h1>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t(
              "El UX para fintech es el diseño de experiencias financieras que reducen el miedo, la fricción y la desconfianza del usuario. En MediaLab combinamos investigación de usuarios, psicología del consumidor e IA para diseñar apps de banca, pagos y crédito donde la gente se siente segura para actuar.",
              "Fintech UX is the design of financial experiences that reduce user fear, friction, and distrust. At MediaLab we combine user research, consumer psychology, and AI to design banking, payments, and lending apps where people feel safe to act."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <BookingModal>
              <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                {t("Hablemos de tu producto fintech", "Let's talk about your fintech product")}
              </button>
            </BookingModal>
            <Link href={localized("/servicios/discovery-con-ia")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
              {t("Ver discovery con IA", "See AI discovery")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué es diferente? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué la UX en fintech es diferente?", "Why is fintech UX different?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "En fintech el usuario no navega flujos: navega estados emocionales como miedo, duda y desconfianza. Un campo mal explicado o un paso de más no es solo fricción — es una razón para abandonar y no volver. Por eso diseñamos cada pantalla para reducir la percepción de riesgo y devolver el control al usuario.",
              "In fintech the user doesn't navigate flows: they navigate emotional states like fear, doubt, and distrust. A poorly explained field or one extra step isn't just friction — it's a reason to abandon and not return. That's why we design every screen to reduce perceived risk and give control back to the user."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué diseñamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-disenamos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-disenamos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué diseñamos para fintech?", "What do we design for fintech?")}
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
        </div>
      </section>

      {/* Resultados / casos */}
      <section className="py-20 px-6 bg-background" aria-labelledby="casos">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="casos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué resultados generamos?", "What results do we drive?")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Gauge, label: t("Menos abandono en onboarding", "Less onboarding drop-off") },
              { icon: Eye, label: t("Mayor confianza percibida", "Higher perceived trust") },
              { icon: Users, label: t("Más usuarios que completan su primera transacción", "More users completing their first transaction") },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border bg-card">
                <b.icon size={18} style={{ color: "var(--magenta)" }} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {t("Mira casos reales en nuestro ", "See real cases in our ")}
            <Link href={localized("/portafolio")} className="text-[var(--magenta)] font-medium hover:underline">{t("portafolio", "portfolio")}</Link>
            {t(" y profundiza en ", " and dive into ")}
            <Link href={localized("/blog/ux-fintech")} className="text-[var(--magenta)] font-medium hover:underline">{t("UX en Fintech: diseñar para la confianza", "UX in Fintech: designing for trust")}</Link>.
            {t(" Optimiza tu producto financiero con nuestros servicios de ", " Optimize your financial product with our services of ")}
            <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium hover:underline">{t("Discovery con IA", "AI Discovery")}</Link>
            {t(", ", ", ")}
            <Link href={localized("/servicios/diseno-ux-ui")} className="text-[var(--magenta)] font-medium hover:underline">{t("Diseño UX/UI", "UX/UI Design")}</Link>
            {t(", ", ", ")}
            <Link href={localized("/servicios/desarrollo-producto-digital")} className="text-[var(--magenta)] font-medium hover:underline">{t("Desarrollo de Producto", "Product Development")}</Link>
            {t(" y ", " and ")}
            <Link href={localized("/servicios/cro-saas")} className="text-[var(--magenta)] font-medium hover:underline">{t("CRO para SaaS", "CRO for SaaS")}</Link>.
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
            {t("¿Construyes un producto fintech?", "Building a fintech product?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "Agenda 30 minutos sin compromiso. Te mostramos dónde tu experiencia genera ansiedad y cómo convertirla en confianza.",
              "Book 30 minutes, no commitment. We'll show you where your experience creates anxiety and how to turn it into trust."
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
