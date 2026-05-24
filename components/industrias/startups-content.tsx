"use client"

import Link from "next/link"
import {
  Sparkles, Rocket, Timer, Target, FlaskConical, TrendingUp, Users,
  ArrowRight, ChevronRight, CheckCircle2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function StartupsContent() {
  const { t, localized } = useLanguage()

  const focus = [
    {
      icon: Timer,
      title: t("Validar antes de invertir", "Validate before investing"),
      desc: t(
        "Discovery con IA para confirmar que resuelves un problema real antes de gastar meses de runway en desarrollo.",
        "AI discovery to confirm you're solving a real problem before spending months of runway on development."
      ),
    },
    {
      icon: Rocket,
      title: t("MVP en semanas, no meses", "MVP in weeks, not months"),
      desc: t(
        "Construimos el núcleo de valor para que salgas al mercado y aprendas con usuarios reales cuanto antes.",
        "We build the core value so you reach the market and learn from real users as soon as possible."
      ),
    },
    {
      icon: Target,
      title: t("Foco en lo que mueve la aguja", "Focus on what moves the needle"),
      desc: t(
        "Priorizamos features por impacto, no por intuición. Menos pantallas, más tracción.",
        "We prioritize features by impact, not intuition. Fewer screens, more traction."
      ),
    },
    {
      icon: TrendingUp,
      title: t("Listos para mostrar a inversores", "Ready to show investors"),
      desc: t(
        "Un producto y una narrativa de UX que comunican madurez y reducen el riesgo percibido en tu ronda.",
        "A product and UX narrative that communicate maturity and reduce perceived risk in your round."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Por qué invertir en UX siendo una startup temprana?", "Why invest in UX as an early-stage startup?"),
      a: t(
        "Porque el mayor riesgo de una startup no es construir mal, es construir lo equivocado. La investigación y el diseño temprano evitan que quemes runway en features que nadie usa. Buena UX desde el día 1 acelera la validación y mejora la conversión y retención que tus inversores miran.",
        "Because a startup's biggest risk isn't building badly — it's building the wrong thing. Early research and design prevent you from burning runway on features nobody uses. Good UX from day 1 speeds validation and improves the conversion and retention your investors look at."
      ),
    },
    {
      q: t("¿Me ayudan a validar la idea antes de desarrollar?", "Do you help validate the idea before building?"),
      a: t(
        "Sí. Con el discovery de producto con IA convertimos tu idea en un brief accionable y hipótesis claras para validar con usuarios, antes de escribir una línea de código.",
        "Yes. With AI product discovery we turn your idea into an actionable brief and clear hypotheses to validate with users, before writing a line of code."
      ),
    },
    {
      q: t("¿También construyen el MVP?", "Do you also build the MVP?"),
      a: t(
        "Sí. Hacemos investigación, diseño y desarrollo. Construimos un MVP enfocado en el núcleo de valor para que valides rápido y escales solo lo que funciona.",
        "Yes. We do research, design, and development. We build an MVP focused on the core value so you validate fast and scale only what works."
      ),
    },
    {
      q: t("¿Trabajan con founders no técnicos?", "Do you work with non-technical founders?"),
      a: t(
        "Claro. Traducimos tu visión a producto: nos encargamos de la parte técnica y de diseño, y te damos claridad para tomar decisiones y comunicar a tu equipo e inversores.",
        "Absolutely. We translate your vision into product: we handle the technical and design side, and give you clarity to make decisions and communicate to your team and investors."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="startups-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
            <ChevronRight size={12} />
            <span className="text-white/40">{t("Industrias", "Industries")}</span>
            <ChevronRight size={12} />
            <span className="text-white/80">Startups</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
            <Sparkles size={14} /> {t("Industria", "Industry")}
          </div>

          <h1 id="startups-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
            {t("UX y producto para startups: de idea a producto validado", "UX and product for startups: from idea to validated product")}
          </h1>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t(
              "El diseño de producto para startups es el proceso de validar, diseñar y construir un producto digital con la velocidad que exige el runway, sin sacrificar el criterio. En MediaLab combinamos discovery con IA, diseño UX y desarrollo para llevarte de idea vaga a producto validado antes de que se acabe la pista.",
              "Product design for startups is the process of validating, designing, and building a digital product at the speed the runway demands, without sacrificing judgment. At MediaLab we combine AI discovery, UX design, and development to take you from vague idea to validated product before the runway runs out."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <BookingModal>
              <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                {t("Valida tu idea con nosotros", "Validate your idea with us")}
              </button>
            </BookingModal>
            <Link href={localized("/servicios/discovery-con-ia")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
              {t("Ver discovery con IA", "See AI discovery")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué UX desde el día 1? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué las startups necesitan UX desde el día 1?", "Why do startups need UX from day 1?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "El recurso más escaso de una startup es el tiempo. Cada sprint que construye sobre supuestos es runway que no vuelve. La investigación y el diseño tempranos no son un lujo: son el seguro contra construir el producto equivocado. Por eso empezamos por entender al usuario y validar antes de escalar.",
              "A startup's scarcest resource is time. Every sprint built on assumptions is runway that doesn't come back. Early research and design aren't a luxury: they're insurance against building the wrong product. That's why we start by understanding the user and validating before scaling."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué hacemos por startups? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-hacemos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-hacemos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué hacemos por startups?", "What do we do for startups?")}
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
            {t("El camino típico: ", "The typical path: ")}
            <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium hover:underline">{t("discovery con IA", "AI discovery")}</Link>
            {" → "}
            <Link href={localized("/servicios/diseno-ux-ui")} className="text-[var(--magenta)] font-medium hover:underline">{t("diseño UX/UI", "UX/UI design")}</Link>
            {" → "}
            <Link href={localized("/servicios/desarrollo-producto-digital")} className="text-[var(--magenta)] font-medium hover:underline">{t("desarrollo del MVP", "MVP development")}</Link>.
          </p>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-20 px-6 bg-background" aria-labelledby="resultados">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="resultados" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué consigues?", "What do you get?")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: FlaskConical, label: t("Hipótesis validadas antes de codear", "Hypotheses validated before coding") },
              { icon: Rocket, label: t("MVP en producción más rápido", "MVP in production faster") },
              { icon: Users, label: t("Métricas que convencen a inversores", "Metrics that convince investors") },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border bg-card">
                <b.icon size={18} style={{ color: "var(--magenta)" }} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {t("Mira startups y productos que ya construimos en el ", "See startups and products we've already built in our ")}
            <Link href={localized("/portafolio")} className="text-[var(--magenta)] font-medium hover:underline">{t("portafolio", "portfolio")}</Link>.
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
            {t("¿Tienes una idea o una startup en marcha?", "Have an idea or a startup in motion?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Te ayudamos a ver tu siguiente mejor paso: validar, diseñar o construir.",
              "30 minutes, no commitment. We help you see your next best step: validate, design, or build."
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
