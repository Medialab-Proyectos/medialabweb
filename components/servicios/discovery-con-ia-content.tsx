"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Search, Users, FileText, Rocket, CheckCircle2,
  ArrowRight, ChevronRight, Clock, Brain, Target,
  CreditCard, Landmark, GraduationCap, ShoppingCart, Car, Box,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { StickyServiceBreadcrumb } from "./sticky-service-breadcrumb"

export function DiscoveryConIAContent() {
  const { t, localized } = useLanguage()

  const steps = [
    {
      icon: Search,
      title: t("1. Captura de la idea", "1. Idea capture"),
      desc: t(
        "Nos cuentas tu idea, tu industria y tus referentes. La IA estructura el problema y detecta supuestos débiles.",
        "You tell us your idea, industry, and references. AI structures the problem and flags weak assumptions."
      ),
    },
    {
      icon: Brain,
      title: t("2. Análisis con IA", "2. AI analysis"),
      desc: t(
        "Generamos requisitos preliminares, análisis competitivo y un primer mapa de usuarios y fricciones.",
        "We generate preliminary requirements, competitive analysis, and a first map of users and frictions."
      ),
    },
    {
      icon: Users,
      title: t("3. Criterio humano", "3. Human judgment"),
      desc: t(
        "Un experto revisa y afina la propuesta con investigación de usuarios y psicología del consumidor.",
        "An expert reviews and refines the proposal with user research and consumer psychology."
      ),
    },
    {
      icon: FileText,
      title: t("4. Brief accionable", "4. Actionable brief"),
      desc: t(
        "Recibes un brief de una página: problema, usuario, requisitos, métrica y siguiente experimento.",
        "You receive a one-page brief: problem, user, requirements, metric, and next experiment."
      ),
    },
  ]

  const audiences = [
    {
      title: t("Startups y founders", "Startups & founders"),
      desc: t(
        "Validar una idea antes de invertir meses de desarrollo.",
        "Validate an idea before investing months of development."
      ),
    },
    {
      title: t("Equipos de producto B2B / SaaS", "B2B / SaaS product teams"),
      desc: t(
        "Salir de la parálisis de definición y alinear al equipo con evidencia.",
        "Escape definition paralysis and align the team with evidence."
      ),
    },
    {
      title: t("Empresas en transformación digital", "Companies in digital transformation"),
      desc: t(
        "Priorizar iniciativas con impacto medible, no por intuición.",
        "Prioritize initiatives by measurable impact, not intuition."
      ),
    },
  ]

  const industries = [
    { name: t("Fintech", "Fintech"), href: "/industrias/fintech", icon: CreditCard },
    { name: t("Banca", "Banking"), href: "/industrias/banca", icon: Landmark },
    { name: t("Educación", "Education"), href: "/industrias/educacion", icon: GraduationCap },
    { name: t("E-commerce", "E-commerce"), href: "/industrias/ecommerce", icon: ShoppingCart },
    { name: t("Movilidad", "Mobility"), href: "/industrias/movilidad", icon: Car },
    { name: t("Startups y SaaS", "Startups & SaaS"), href: "/industrias/startups", icon: Rocket },
  ]

  const faqs = [
    {
      q: t("¿Qué es el discovery de producto con IA?", "What is AI product discovery?"),
      a: t(
        "Es el proceso de transformar una idea de producto en una definición estructurada — problema, usuarios, requisitos y enfoque de diseño — usando inteligencia artificial para acelerar el análisis, y validándola con investigación de usuarios y criterio humano. Reduce semanas de workshops a días.",
        "It's the process of turning a product idea into a structured definition — problem, users, requirements, and design approach — using AI to accelerate analysis, then validating it with user research and human judgment. It cuts weeks of workshops down to days."
      ),
    },
    {
      q: t("¿La IA reemplaza la investigación de usuarios?", "Does AI replace user research?"),
      a: t(
        "No. La IA acelera el análisis y generates hipótesis, pero la investigación con usuarios reales y la psicología del consumidor siguen siendo el filtro que evita construir el producto equivocado. Usamos IA como copiloto, no como reemplazo del criterio.",
        "No. AI accelerates analysis and generates hypotheses, but research with real users and consumer psychology remain the filter that prevents building the wrong product. We use AI as a copilot, not a replacement for judgment."
      ),
    },
    {
      q: t("¿Cuánto tiempo toma un discovery con IA?", "How long does AI discovery take?"),
      a: t(
        "Un primer brief estructurado puede estar listo en días, no meses. El alcance exacto depende de la complejidad, pero el objetivo es darte claridad accionable rápido para que puedas validar o diseñar sin perder tiempo.",
        "A first structured brief can be ready in days, not months. The exact scope depends on complexity, but the goal is to give you actionable clarity fast so you can validate or design without wasting time."
      ),
    },
    {
      q: t("¿En qué se diferencia de UXBox?", "How is it different from UXBox?"),
      a: t(
        "UXBox es la herramienta de IA que genera el brief inicial al instante. El servicio de discovery con IA es el acompañamiento completo: toma ese punto de partida y lo lleva a una definición validada con expertos, investigación y un plan de siguiente paso.",
        "UXBox is the AI tool that generates the initial brief instantly. The AI discovery service is the full engagement: it takes that starting point and turns it into a definition validated with experts, research, and a next-step plan."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      <StickyServiceBreadcrumb pageEs="Discovery con IA" pageEn="AI Discovery" />

      {/* Hero */}
      <section className="relative pt-6 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="discovery-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
              style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
              <Brain size={14} /> {t("AI-powered UX Research", "AI-powered UX Research")}
            </div>

            <h1 id="discovery-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
              {t("Discovery de producto con IA sin perder criterio humano", "AI product discovery without losing human judgment")}
            </h1>

            {/* Answer-first summary (AEO) */}
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {t(
                "El discovery de producto con IA convierte una idea vaga en un brief accionable —problema, usuarios, requisitos y enfoque de diseño— en días en lugar de meses. En MediaLab combinamos IA, investigación de usuarios y psicología del consumidor para darte claridad con evidencia, no solo velocidad.",
                "AI product discovery turns a vague idea into an actionable brief —problem, users, requirements, and design approach— in days instead of months. At MediaLab we combine AI, user research, and consumer psychology to give you clarity with evidence, not just speed."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 w-full sm:w-auto">
              <BookingModal>
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                  style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                  {t("Agenda un discovery gratis", "Book a free discovery")}
                </button>
              </BookingModal>
              <Link href={localized("/")+"#uxbox"} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
                <Box size={14} /> {t("Probar UXBox gratis", "Try UXBox free")} <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-xs text-white/50 flex items-center gap-2">
              <Clock size={12} /> {t("De idea vaga a roadmap accionable en días", "From vague idea to actionable roadmap in days")}
            </p>
          </div>
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-secondary/20">
              <Image
                src="/images/service-ai-discovery-team.png"
                alt={t("Discovery de producto con IA", "AI product discovery")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué resuelve? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="que-resuelve">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="que-resuelve" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué problema resuelve?", "What problem does it solve?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "La mayoría de los equipos se estancan porque diseñan demasiado pronto y entienden demasiado tarde. Se discuten features cuando aún no está claro qué necesita el usuario, y cada sprint construye sobre supuestos. El discovery con IA rompe ese ciclo: te da una definición clara y verificable antes de invertir en diseño o desarrollo.",
              "Most teams stall because they design too soon and understand too late. Features get debated before it's clear what the user needs, and every sprint builds on assumptions. AI discovery breaks that cycle: it gives you a clear, verifiable definition before you invest in design or development."
            )}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            {[
              { icon: Clock, label: t("Menos tiempo de definición", "Less definition time") },
              { icon: Target, label: t("Decisiones con evidencia", "Evidence-based decisions") },
              { icon: CheckCircle2, label: t("Menos retrabajo costoso", "Less costly rework") },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
                <b.icon size={18} style={{ color: "var(--magenta)" }} className="shrink-0" />
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Para quién funciona? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="para-quien">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="para-quien" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Para quién funciona?", "Who is it for?")}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {audiences.map((a) => (
              <div key={a.title} className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-display font-bold text-lg text-foreground">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso paso a paso */}
      <section className="py-20 px-6 bg-background" aria-labelledby="proceso">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="proceso" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Cómo es el proceso, paso a paso?", "What does the process look like, step by step?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {steps.map((s) => (
              <div key={s.title} className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>
                  <s.icon size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold text-base text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("¿Quieres ver el punto de partida automático? ", "Want to see the automatic starting point? ")}
                <Link href={localized("/")+"#uxbox"} className="inline-flex items-center gap-1 text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">
                  <Box size={12} className="shrink-0" />{t("Genera tu brief con UXBox", "Generate your brief with UXBox")}
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("Lee ", "Read ")}
                <Link href={localized("/blog/discovery-ia")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">
                  {t("Discovery con IA: el fin de los workshops interminables", "AI Discovery: the end of endless workshops")}
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("¿Quieres un diagnóstico rápido? Prueba el ", "Want a quick diagnosis? Try the ")}
                <Link href={localized("/recursos/analizador-ux-ia")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">
                  {t("UX + AI Discovery Analyzer gratis", "free UX + AI Discovery Analyzer")}
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Casos de uso por industria */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="industrias">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="industrias" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿En qué industrias aplica?", "Which industries does it apply to?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Hemos aplicado discovery con IA en sectores con usuarios exigentes y alta necesidad de confianza:",
              "We've applied AI discovery in sectors with demanding users and a high need for trust:"
            )}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {industries.map((ind) => (
              <Link key={ind.name} href={localized(ind.href)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-border bg-card text-[var(--magenta)] hover:bg-secondary transition-all">
                <ind.icon size={14} className="shrink-0" />
                {ind.name}
              </Link>
            ))}
          </div>
          <div className="flex items-start gap-2.5 text-sm text-muted-foreground pt-2">
            <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
            <span>
              {t("Mira ejemplos reales en nuestro ", "See real examples in our ")}
              <Link href={localized("/portafolio")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">{t("portafolio de casos", "case portfolio")}</Link>
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-background" aria-labelledby="faq">
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
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="cta">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 id="cta" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("Empieza tu discovery con IA hoy", "Start your AI discovery today")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Saldrás con más claridad sobre tu producto de la que tienes hoy.",
              "30 minutes, no commitment. You'll leave with more clarity about your product than you have today."
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <BookingModal>
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A" }}>
                {t("Agenda tu sesión gratuita", "Book your free session")} <Rocket size={16} />
              </button>
            </BookingModal>
            <Link href={localized("/curso")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-border text-foreground hover:bg-secondary transition-all">
              {t("¿Prefieres aprender el método? Ver el curso", "Prefer to learn the method? See the course")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
