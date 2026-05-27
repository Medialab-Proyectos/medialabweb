"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Code2, Smartphone, Cloud, Cpu, GitBranch, Gauge,
  ArrowRight, ChevronRight, CheckCircle2,
  CreditCard, Landmark, ShoppingCart, BookOpen, Car, Rocket,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { StickyServiceBreadcrumb } from "./sticky-service-breadcrumb"

export function DesarrolloProductoDigitalContent() {
  const { t, localized } = useLanguage()

  const builds = [
    {
      icon: Code2,
      title: t("Plataformas web B2B y dashboards", "B2B web platforms & dashboards"),
      desc: t(
        "Aplicaciones de negocio robustas, con datos en tiempo real y experiencias que tu equipo y tus clientes usan a diario.",
        "Robust business applications with real-time data and experiences your team and clients use daily."
      ),
    },
    {
      icon: Smartphone,
      title: t("Apps móviles y experiencias B2C", "Mobile apps & B2C experiences"),
      desc: t(
        "Productos móviles rápidos y cuidados, diseñados para retener y convertir desde el primer uso.",
        "Fast, polished mobile products designed to retain and convert from first use."
      ),
    },
    {
      icon: Gauge,
      title: t("MVPs listos para validar en semanas", "MVPs ready to validate in weeks"),
      desc: t(
        "Construimos el núcleo de tu producto rápido, para que valides con usuarios reales antes de invertir de más.",
        "We build your product's core fast, so you validate with real users before overinvesting."
      ),
    },
    {
      icon: Cloud,
      title: t("Arquitecturas escalables en la nube", "Scalable cloud architectures"),
      desc: t(
        "Infraestructura que crece contigo sin reescribir todo cuando llega la tracción.",
        "Infrastructure that grows with you without rewriting everything when traction arrives."
      ),
    },
    {
      icon: Cpu,
      title: t("Integraciones con IA y APIs", "AI and API integrations"),
      desc: t(
        "Conectamos modelos de IA, pagos, datos y servicios de terceros dentro de un flujo coherente.",
        "We connect AI models, payments, data, and third-party services into one coherent flow."
      ),
    },
    {
      icon: GitBranch,
      title: t("Entregas incrementales", "Incremental delivery"),
      desc: t(
        "Avances visibles cada semana, sin sorpresas: ves crecer tu producto en tiempo real.",
        "Visible progress every week, no surprises: you watch your product grow in real time."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Qué tecnologías usan?", "What technologies do you use?"),
      a: t(
        "Trabajamos principalmente con React, Next.js y Node.js, sobre arquitecturas en la nube, e integramos IA y APIs según el producto. Elegimos el stack según tus necesidades y tu equipo, no al revés.",
        "We work mainly with React, Next.js, and Node.js on cloud architectures, and integrate AI and APIs as needed. We choose the stack based on your needs and team, not the other way around."
      ),
    },
    {
      q: t("¿Construyen MVPs para startups?", "Do you build MVPs for startups?"),
      a: t(
        "Sí. Construimos el núcleo de valor de tu producto rápido para que valides con usuarios reales antes de invertir en features que quizá nadie use. El objetivo es aprender, no solo entregar código.",
        "Yes. We build your product's core value fast so you validate with real users before investing in features nobody may use. The goal is to learn, not just ship code."
      ),
    },
    {
      q: t("¿Integran inteligencia artificial en el producto?", "Do you integrate AI into the product?"),
      a: t(
        "Sí, cuando aporta valor real: desde funcionalidades con modelos de lenguaje hasta automatización de flujos. Evitamos meter IA por moda — la usamos cuando resuelve un problema concreto del usuario o del negocio.",
        "Yes, when it adds real value: from language-model features to workflow automation. We avoid adding AI as a trend — we use it when it solves a concrete user or business problem."
      ),
    },
    {
      q: t("¿Hacen diseño y desarrollo o solo desarrollo?", "Do you do design and development or just development?"),
      a: t(
        "Ambos. Lo ideal es el camino completo —investigación, diseño UX/UI y desarrollo— para que el producto sea coherente de punta a punta. Pero si ya tienes diseño, también desarrollamos a partir de él.",
        "Both. The ideal is the full path — research, UX/UI design, and development — so the product is coherent end to end. But if you already have design, we build from it too."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      <StickyServiceBreadcrumb pageEs="Desarrollo de producto" pageEn="Product development" />

      {/* Hero */}
      <section className="relative pt-6 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="dev-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
              style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
              <Code2 size={14} /> {t("Producto digital con IA", "Digital product with AI")}
            </div>

            <h1 id="dev-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
              {t("Desarrollo de producto digital con IA", "Digital product development with AI")}
            </h1>

            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {t(
                "El desarrollo de producto digital es la construcción de software —web, móvil o plataformas— que convierte un diseño en un producto real, escalable y mantenible. En MediaLab desarrollamos con código limpio, arquitectura que escala e integración de IA, conectado a la investigación y el diseño para que el producto funcione tan bien como se ve.",
                "Digital product development is the building of software — web, mobile, or platforms — that turns a design into a real, scalable, maintainable product. At MediaLab we build with clean code, scalable architecture, and AI integration, connected to research and design so the product works as well as it looks."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 w-full sm:w-auto">
              <BookingModal>
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                  style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                  {t("Hablemos de tu producto", "Let's talk about your product")}
                </button>
              </BookingModal>
              <Link href={localized("/portafolio")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
                {t("Ver productos entregados", "See shipped products")} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {["React", "Next.js", "Node.js", "Cloud", "AI"].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium border border-white/15 text-white/70">{tech}</span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-secondary/20">
              <Image
                src="/images/service-dev-team.png"
                alt={t("Desarrollo de producto digital", "Digital product development")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué construimos? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="que-construimos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-construimos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué construimos?", "What do we build?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {builds.map((f) => (
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

      {/* ¿Cómo desarrollamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="como">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="como" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Cómo desarrollamos?", "How do we develop?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "No escribimos código hasta entender el problema. El desarrollo se conecta con el discovery y el diseño: construimos en sprints cortos con entregas visibles cada semana, probamos con usuarios y mantenemos la arquitectura limpia para que tu producto crezca sin acumular deuda técnica.",
              "We don't write code until we understand the problem. Development connects to discovery and design: we build in short sprints with visible weekly deliverables, test with users, and keep the architecture clean so your product grows without accumulating technical debt."
            )}
          </p>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("¿Aún defines tu producto? Empieza por el ", "Still defining your product? Start with ")}
                <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">
                  {t("discovery con IA", "AI discovery")}
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("¿Necesitas diseño primero? Ve al ", "Need design first? Go to ")}
                <Link href={localized("/servicios/diseno-ux-ui")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">
                  {t("diseño UX/UI", "UX/UI design")}
                </Link>
              </span>
            </li>
          </ul>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2.5">{t("Desarrollamos software robusto para diversas industrias:", "We develop robust software for various industries:")}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("Fintech", "Fintech"), href: "/industrias/fintech", icon: CreditCard },
                { name: t("Banca", "Banking"), href: "/industrias/banca", icon: Landmark },
                { name: t("E-commerce", "E-commerce"), href: "/industrias/ecommerce", icon: ShoppingCart },
                { name: t("Educación", "Education"), href: "/industrias/educacion", icon: BookOpen },
                { name: t("Movilidad", "Mobility"), href: "/industrias/movilidad", icon: Car },
                { name: t("Startups", "Startups"), href: "/industrias/startups", icon: Rocket },
              ].map((ind) => (
                <Link key={ind.name} href={localized(ind.href)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-border bg-card text-[var(--magenta)] hover:bg-secondary transition-all">
                  <ind.icon size={13} className="shrink-0" />
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
            {t("Construyamos tu producto", "Let's build your product")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Cuéntanos qué quieres construir y te decimos cómo lo abordaríamos.",
              "30 minutes, no commitment. Tell us what you want to build and we'll tell you how we'd approach it."
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
