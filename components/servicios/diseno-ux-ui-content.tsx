"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Microscope, Compass, PenTool, LayoutGrid, BarChart3,
  ArrowRight, ChevronRight, CheckCircle2, Heart,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function DisenoUxUiContent() {
  const { t, localized } = useLanguage()

  const includes = [
    {
      icon: Microscope,
      title: t("Investigación de usuarios", "User research"),
      desc: t(
        "Entrevistas, análisis de comportamiento y mapas de fricción para diseñar sobre evidencia, no suposiciones.",
        "Interviews, behavioral analysis, and friction maps to design on evidence, not assumptions."
      ),
    },
    {
      icon: Compass,
      title: t("Arquitectura de información", "Information architecture"),
      desc: t(
        "Estructuramos el producto para que el usuario siempre sepa dónde está y qué sigue.",
        "We structure the product so the user always knows where they are and what's next."
      ),
    },
    {
      icon: PenTool,
      title: t("Diseño de interacción y UI", "Interaction & UI design"),
      desc: t(
        "Interfaces claras, accesibles y con identidad — cada pantalla diseñada para generar confianza y acción.",
        "Clear, accessible interfaces with identity — every screen designed to build trust and drive action."
      ),
    },
    {
      icon: LayoutGrid,
      title: t("Sistemas de diseño", "Design systems"),
      desc: t(
        "Bibliotecas de componentes que escalan con tu producto y mantienen la coherencia entre equipos.",
        "Component libraries that scale with your product and keep consistency across teams."
      ),
    },
    {
      icon: Heart,
      title: t("Diseño conductual", "Behavioral design"),
      desc: t(
        "Psicología del consumidor aplicada: diseñamos para cómo las personas realmente piensan y deciden.",
        "Applied consumer psychology: we design for how people really think and decide."
      ),
    },
    {
      icon: BarChart3,
      title: t("Optimización de conversión (CRO)", "Conversion optimization (CRO)"),
      desc: t(
        "Medimos, iteramos y optimizamos cada punto de contacto para que más usuarios actúen.",
        "We measure, iterate, and optimize every touchpoint so more users take action."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Cuál es la diferencia entre UX y UI?", "What's the difference between UX and UI?"),
      a: t(
        "UX (experiencia de usuario) es cómo funciona y se siente el producto: la investigación, los flujos y la lógica detrás de cada decisión. UI (interfaz de usuario) es lo visual: tipografía, color, componentes e interacción. Un buen producto necesita ambas alineadas — y nosotros las trabajamos juntas, no por separado.",
        "UX (user experience) is how the product works and feels: the research, flows, and logic behind every decision. UI (user interface) is the visual layer: typography, color, components, and interaction. A good product needs both aligned — and we work them together, not separately."
      ),
    },
    {
      q: t("¿Cómo aplican IA al diseño UX/UI?", "How do you apply AI to UX/UI design?"),
      a: t(
        "Usamos IA para acelerar el discovery, generar hipótesis de usuarios y explorar variaciones de diseño más rápido. Pero las decisiones finales nacen de investigación real y criterio humano: la IA es un copiloto que multiplica al equipo, no un reemplazo del juicio de diseño.",
        "We use AI to accelerate discovery, generate user hypotheses, and explore design variations faster. But final decisions come from real research and human judgment: AI is a copilot that multiplies the team, not a replacement for design judgment."
      ),
    },
    {
      q: t("¿Solo diseñan o también desarrollan el producto?", "Do you only design or also build the product?"),
      a: t(
        "Hacemos el camino completo: investigación, diseño UX/UI y desarrollo de software. Si solo necesitas diseño, también funciona. Nos integramos como tu equipo de producto end-to-end o en la fase que necesites.",
        "We do the full path: research, UX/UI design, and software development. If you only need design, that works too. We integrate as your end-to-end product team or in the phase you need."
      ),
    },
    {
      q: t("¿Trabajan con startups y con empresas establecidas?", "Do you work with startups and established companies?"),
      a: t(
        "Sí. Con startups priorizamos velocidad y validación; con empresas, rediseñamos productos existentes y construimos sistemas de diseño que escalan sin perder coherencia.",
        "Yes. With startups we prioritize speed and validation; with companies, we redesign existing products and build design systems that scale without losing consistency."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="uxui-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
              <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
              <ChevronRight size={12} />
              <Link href={localized("/servicios")} className="hover:text-white">{t("Servicios", "Services")}</Link>
              <ChevronRight size={12} />
              <span className="text-white/80">{t("Diseño UX/UI", "UX/UI Design")}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
              style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
              <Heart size={14} /> {t("UX Strategy by MediaLab", "UX Strategy by MediaLab")}
            </div>

            <h1 id="uxui-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
              {t("Diseño UX/UI con IA y psicología del consumidor", "UX/UI design with AI and consumer psychology")}
            </h1>

            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {t(
                "El diseño UX/UI es el proceso de investigar, estructurar y diseñar productos digitales para que las personas los entiendan, los usen y los recomienden. En MediaLab combinamos investigación de usuarios, diseño conductual e IA para crear experiencias que conectan emocionalmente y convierten.",
                "UX/UI design is the process of researching, structuring, and designing digital products so people understand, use, and recommend them. At MediaLab we combine user research, behavioral design, and AI to create experiences that connect emotionally and convert."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 w-full sm:w-auto">
              <BookingModal>
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                  style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                  {t("Agenda una consulta gratis", "Book a free consultation")}
                </button>
              </BookingModal>
              <Link href={localized("/portafolio")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
                {t("Ver portafolio", "See portfolio")} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-secondary/20">
              <Image
                src="/images/uxui-design-hero.png"
                alt={t("Diseño UX/UI con IA y psicología", "UX/UI design with AI and psychology")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué incluye? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="que-incluye">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-incluye" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué incluye el diseño UX/UI?", "What does UX/UI design include?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {includes.map((f) => (
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

      {/* ¿Cómo trabajamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="como">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="como" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Cómo trabajamos el diseño?", "How do we approach design?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "No empezamos por las pantallas. Empezamos por entender a quién diseñas, qué necesita sentir para avanzar y qué lo frena hoy. Ese discovery —acelerado con IA— alimenta cada decisión de UX y UI. Luego diseñamos, prototipamos, probamos con usuarios y optimizamos sobre datos reales.",
              "We don't start with screens. We start by understanding who you're designing for, what they need to feel to move forward, and what holds them back today. That discovery — accelerated with AI — feeds every UX and UI decision. Then we design, prototype, test with users, and optimize on real data."
            )}
          </p>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("¿Tienes una idea sin definir? Empieza por el ", "Have an undefined idea? Start with ")}
                <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">
                  {t("discovery de producto con IA", "AI product discovery")}
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("Genera un brief al instante con ", "Generate an instant brief with ")}
                <Link href={localized("/")+"#uxbox"} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">UXBox</Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("¿Ya tienes tráfico pero poca conversión? Mira ", "Already have traffic but low conversion? See ")}
                <Link href={localized("/servicios/cro-saas")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">{t("CRO para SaaS", "CRO for SaaS")}</Link>
              </span>
            </li>
          </ul>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2.5">{t("Diseñamos experiencias para industrias de alta exigencia:", "We design experiences for high-demand industries:")}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("Fintech", "Fintech"), href: "/industrias/fintech" },
                { name: t("Banca", "Banking"), href: "/industrias/banca" },
                { name: t("E-commerce", "E-commerce"), href: "/industrias/ecommerce" },
                { name: t("Educación", "Education"), href: "/industrias/educacion" },
                { name: t("Movilidad", "Mobility"), href: "/industrias/movilidad" },
                { name: t("Startups", "Startups"), href: "/industrias/startups" },
              ].map((ind) => (
                <Link key={ind.name} href={localized(ind.href)} className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-card text-[var(--magenta)] hover:bg-secondary transition-all">
                  {ind.name}
                </Link>
              ))}
            </div>
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
            {t("Diseñemos un producto que tus usuarios amen", "Let's design a product your users love")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Cuéntanos tu producto y te mostramos cómo lo abordaríamos.",
              "30 minutes, no commitment. Tell us about your product and we'll show you how we'd approach it."
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <BookingModal>
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A" }}>
                {t("Agenda tu consulta gratuita", "Book your free consultation")} <CheckCircle2 size={16} />
              </button>
            </BookingModal>
            <Link href={localized("/curso")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-border text-foreground hover:bg-secondary transition-all">
              {t("¿Quieres aprender UX + IA? Ver el curso", "Want to learn UX + AI? See the course")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
