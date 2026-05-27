"use client"

import Link from "next/link"
import Image from "next/image"
import {
  BarChart3, MousePointerClick, FlaskConical, TrendingUp, Filter, Eye,
  ArrowRight, ChevronRight, CheckCircle2,
  Rocket, ShoppingCart, CreditCard,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { StickyServiceBreadcrumb } from "./sticky-service-breadcrumb"

export function CroSaasContent() {
  const { t, localized } = useLanguage()

  const optimize = [
    {
      icon: Filter,
      title: t("Embudos de activación y onboarding", "Activation & onboarding funnels"),
      desc: t(
        "Detectamos dónde se pierden los usuarios entre el registro y el primer momento de valor, y lo arreglamos.",
        "We find where users drop between signup and first value moment, and fix it."
      ),
    },
    {
      icon: MousePointerClick,
      title: t("Páginas de pricing y checkout", "Pricing & checkout pages"),
      desc: t(
        "Optimizamos las páginas donde el usuario decide pagar: claridad, confianza y reducción de fricción.",
        "We optimize the pages where the user decides to pay: clarity, trust, and friction reduction."
      ),
    },
    {
      icon: TrendingUp,
      title: t("Retención y expansión", "Retention & expansion"),
      desc: t(
        "Mejoramos los momentos que hacen que el usuario vuelva, se quede y suba de plan.",
        "We improve the moments that make users return, stay, and upgrade."
      ),
    },
    {
      icon: FlaskConical,
      title: t("Experimentación A/B", "A/B experimentation"),
      desc: t(
        "Probamos hipótesis con datos reales en lugar de opiniones, y escalamos solo lo que funciona.",
        "We test hypotheses with real data instead of opinions, and scale only what works."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Qué es el CRO (optimización de conversión)?", "What is CRO (conversion rate optimization)?"),
      a: t(
        "El CRO is el proceso de aumentar el porcentaje de visitantes que realizan la acción deseada —registrarse, pagar, activar— mejorando la experiencia en lugar de comprar más tráfico. Combina análisis de datos, investigación de usuarios y experimentación.",
        "CRO is the process of increasing the percentage of visitors who take the desired action — sign up, pay, activate — by improving the experience instead of buying more traffic. It combines data analysis, user research, and experimentation."
      ),
    },
    {
      q: t("¿En qué se diferencia el CRO para SaaS?", "How is CRO for SaaS different?"),
      a: t(
        "En SaaS la conversión no termina en el registro: importa la activación, la retención y la expansión a planes superiores. Optimizamos todo el ciclo de vida, no solo la landing, porque un usuario que se registra pero no activa no genera valor.",
        "In SaaS, conversion doesn't end at signup: activation, retention, and expansion to higher tiers matter. We optimize the whole lifecycle, not just the landing, because a user who signs up but doesn't activate generates no value."
      ),
    },
    {
      q: t("¿Cómo usan los datos y la IA en el CRO?", "How do you use data and AI in CRO?"),
      a: t(
        "Analizamos comportamiento real (analítica, mapas de calor, grabaciones) para encontrar dónde y por qué se pierde la conversión, y usamos IA para acelerar el análisis y generar hipótesis. Cada cambio se valida con experimentos, no con suposiciones.",
        "We analyze real behavior (analytics, heatmaps, recordings) to find where and why conversion is lost, and use AI to speed up analysis and generate hypotheses. Every change is validated with experiments, not assumptions."
      ),
    },
    {
      q: t("¿Cuánto tarda en verse resultados?", "How long until results show?"),
      a: t(
        "Las primeras mejoras de fricción pueden verse en semanas; los experimentos significativos dependen de tu volumen de tráfico para alcanzar significancia estadística. El CRO es un proceso continuo de mejora, no un arreglo único.",
        "Initial friction improvements can show in weeks; meaningful experiments depend on your traffic volume to reach statistical significance. CRO is a continuous improvement process, not a one-time fix."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      <StickyServiceBreadcrumb pageEs="CRO para SaaS" pageEn="CRO for SaaS" />

      {/* Hero */}
      <section className="relative pt-6 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="cro-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
              style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
              <TrendingUp size={14} /> {t("Interfaces diseñadas para conversión", "Interfaces designed for conversion")}
            </div>

            <h1 id="cro-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
              {t("CRO para SaaS: convierte más sin gastar más en tráfico", "CRO for SaaS: convert more without spending more on traffic")}
            </h1>

            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {t(
                "El CRO (optimización de la tasa de conversión) es el proceso de lograr que más visitantes se conviertan en usuarios activos y clientes, mejorando la experiencia en vez de comprar más tráfico. En MediaLab optimizamos todo el ciclo SaaS —activación, retención y expansión— con datos, investigación de usuarios e IA.",
                "CRO (conversion rate optimization) is the process of getting more visitors to become active users and customers by improving the experience instead of buying more traffic. At MediaLab we optimize the whole SaaS lifecycle — activation, retention, and expansion — with data, user research, and AI."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 w-full sm:w-auto">
              <BookingModal>
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                  style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                  {t("Audita tu conversión gratis", "Audit your conversion free")}
                </button>
              </BookingModal>
              <Link href={localized("/servicios/diseno-ux-ui")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
                {t("Ver diseño UX/UI", "See UX/UI design")} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-secondary/20">
              <Image
                src="/images/service-cro-saas-team.png"
                alt={t("CRO para SaaS", "CRO for SaaS")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ¿Por qué importa? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué el CRO importa más en SaaS?", "Why does CRO matter more in SaaS?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "Comprar más tráfico es caro y temporal; mejorar la conversión es un activo que compone. En SaaS, además, la conversión no termina en el registro: un usuario que no activa, no retiene o no expande es ingreso que se fuga. Por eso optimizamos cada punto de fricción del ciclo de vida, no solo la landing.",
              "Buying more traffic is expensive and temporary; improving conversion is a compounding asset. In SaaS, conversion doesn't end at signup: a user who doesn't activate, retain, or expand is leaking revenue. That's why we optimize every friction point of the lifecycle, not just the landing."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué optimizamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-optimizamos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-optimizamos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué optimizamos?", "What do we optimize?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {optimize.map((f) => (
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

      {/* ¿Cómo es el proceso? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="proceso">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="proceso" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Cómo es el proceso de CRO?", "What does the CRO process look like?")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Eye, label: t("1. Analizamos comportamiento real y datos", "1. Analyze real behavior and data") },
              { icon: FlaskConical, label: t("2. Formulamos y priorizamos hipótesis", "2. Form and prioritize hypotheses") },
              { icon: BarChart3, label: t("3. Experimentamos y escalamos lo que funciona", "3. Experiment and scale what works") },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border bg-card">
                <b.icon size={18} style={{ color: "var(--magenta)" }} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("El CRO funciona mejor sobre una base sólida de ", "CRO works best on a solid foundation of ")}
                <Link href={localized("/servicios/diseno-ux-ui")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">{t("diseño UX/UI", "UX/UI design")}</Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-[var(--magenta)]" />
              <span>
                {t("Mira resultados reales en el ", "See real results in our ")}
                <Link href={localized("/portafolio")} className="text-[var(--magenta)] font-medium underline decoration-[var(--magenta)]/30 hover:decoration-[var(--magenta)] transition-colors">{t("portafolio", "portfolio")}</Link>
              </span>
            </li>
          </ul>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2.5">{t("Aplicamos CRO estratégico especialmente en:", "We apply strategic CRO especially in:")}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("Startups y SaaS", "Startups & SaaS"), href: "/industrias/startups", icon: Rocket },
                { name: t("E-commerce", "E-commerce"), href: "/industrias/ecommerce", icon: ShoppingCart },
                { name: t("Fintech", "Fintech"), href: "/industrias/fintech", icon: CreditCard },
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
            {t("¿Tu SaaS tiene tráfico pero poca conversión?", "Does your SaaS have traffic but low conversion?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Te mostramos dónde se fuga tu conversión y cómo recuperarla.",
              "30 minutes, no commitment. We'll show you where your conversion leaks and how to recover it."
            )}
          </p>
          <BookingModal>
            <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
              style={{ background: "#E8751A" }}>
              {t("Agenda tu auditoría gratuita", "Book your free audit")} <CheckCircle2 size={16} />
            </button>
          </BookingModal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
