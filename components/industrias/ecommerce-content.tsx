"use client"

import Link from "next/link"
import {
  Sparkles, ShoppingCart, Search, CreditCard, Repeat, Heart, Gauge,
  ArrowRight, ChevronRight, CheckCircle2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function EcommerceContent() {
  const { t, localized } = useLanguage()

  const focus = [
    {
      icon: Search,
      title: t("Descubrimiento y búsqueda", "Discovery and search"),
      desc: t(
        "Que el usuario encuentre lo que busca (y lo que no sabía que quería) rápido y sin frustración.",
        "Help the user find what they're looking for (and what they didn't know they wanted) fast and without frustration."
      ),
    },
    {
      icon: CreditCard,
      title: t("Checkout sin abandono", "Drop-off-free checkout"),
      desc: t(
        "Reducimos los pasos, las dudas y los costos sorpresa que hacen abandonar el carrito.",
        "We cut the steps, doubts, and surprise costs that cause cart abandonment."
      ),
    },
    {
      icon: Heart,
      title: t("Confianza y prueba social", "Trust and social proof"),
      desc: t(
        "Reseñas, garantías y señales de seguridad en el momento exacto en que el usuario duda.",
        "Reviews, guarantees, and security signals at the exact moment the user hesitates."
      ),
    },
    {
      icon: Repeat,
      title: t("Recompra y fidelidad", "Repurchase and loyalty"),
      desc: t(
        "Diseño conductual para convertir un primer pedido en un cliente que vuelve.",
        "Behavioral design to turn a first order into a returning customer."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Por qué la UX define las ventas en e-commerce?", "Why does UX define sales in e-commerce?"),
      a: t(
        "Porque en e-commerce cada paso de fricción es dinero que se pierde. Una búsqueda confusa, un checkout largo o una duda no resuelta se traducen en carritos abandonados. Una buena UX no solo mejora la experiencia: aumenta directamente la conversión y el ticket promedio.",
        "Because in e-commerce every friction step is money lost. A confusing search, a long checkout, or an unresolved doubt turns into abandoned carts. Good UX doesn't just improve the experience: it directly increases conversion and average order value."
      ),
    },
    {
      q: t("¿Cómo reducen el abandono del carrito?", "How do you reduce cart abandonment?"),
      a: t(
        "Analizamos dónde y por qué los usuarios abandonan, y rediseñamos el checkout: menos pasos, costos transparentes desde el inicio, métodos de pago claros y señales de confianza. Validamos cada cambio con datos reales.",
        "We analyze where and why users abandon, and redesign the checkout: fewer steps, transparent costs from the start, clear payment methods, and trust signals. We validate every change with real data."
      ),
    },
    {
      q: t("¿Trabajan con la conversión además del diseño?", "Do you work on conversion beyond design?"),
      a: t(
        "Sí. El diseño y el CRO van juntos: diseñamos la experiencia y luego medimos y optimizamos cada punto de contacto para que más visitantes compren y vuelvan.",
        "Yes. Design and CRO go together: we design the experience and then measure and optimize every touchpoint so more visitors buy and return."
      ),
    },
    {
      q: t("¿Diseñan para tiendas nuevas y existentes?", "Do you design for new and existing stores?"),
      a: t(
        "Ambas. Para tiendas nuevas definimos la experiencia desde cero; para existentes, auditamos, priorizamos los puntos de mayor fuga y rediseñamos por fases sin frenar las ventas.",
        "Both. For new stores we define the experience from scratch; for existing ones, we audit, prioritize the biggest leak points, and redesign in phases without stopping sales."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="ecom-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
            <ChevronRight size={12} />
            <span className="text-white/40">{t("Industrias", "Industries")}</span>
            <ChevronRight size={12} />
            <span className="text-white/80">E-commerce</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
            <Sparkles size={14} /> {t("Industria", "Industry")}
          </div>

          <h1 id="ecom-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
            {t("Diseño UX para e-commerce: experiencias de compra que convierten", "E-commerce UX design: shopping experiences that convert")}
          </h1>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t(
              "El UX para e-commerce es el diseño de experiencias de compra que reducen la fricción y convierten visitantes en clientes fieles. En MediaLab combinamos investigación de usuarios, diseño conductual, IA y CRO para optimizar descubrimiento, checkout y recompra — y aumentar conversión y ticket promedio.",
              "E-commerce UX is the design of shopping experiences that reduce friction and turn visitors into loyal customers. At MediaLab we combine user research, behavioral design, AI, and CRO to optimize discovery, checkout, and repurchase — and increase conversion and average order value."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <BookingModal>
              <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                {t("Hablemos de tu tienda", "Let's talk about your store")}
              </button>
            </BookingModal>
            <Link href={localized("/servicios/cro-saas")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
              {t("Ver optimización de conversión", "See conversion optimization")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué es diferente? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué la UX define las ventas en e-commerce?", "Why does UX define sales in e-commerce?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "En e-commerce el usuario decide en segundos y compara sin esfuerzo. Cada duda no resuelta, cada paso de más y cada costo sorpresa es una razón para abandonar. Diseñar e-commerce es eliminar fricción y construir confianza justo en los momentos donde se decide la compra.",
              "In e-commerce the user decides in seconds and compares effortlessly. Every unresolved doubt, every extra step, and every surprise cost is a reason to abandon. Designing e-commerce means removing friction and building trust right at the moments where the purchase is decided."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué optimizamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-optimizamos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-optimizamos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué optimizamos para e-commerce?", "What do we optimize for e-commerce?")}
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
            {t("Combínalo con ", "Combine it with ")}
            <Link href={localized("/servicios/cro-saas")} className="text-[var(--magenta)] font-medium hover:underline">{t("optimización de conversión (CRO)", "conversion optimization (CRO)")}</Link>
            {t(" y ", " and ")}
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
              { icon: ShoppingCart, label: t("Menos abandono de carrito", "Less cart abandonment") },
              { icon: Gauge, label: t("Mayor tasa de conversión", "Higher conversion rate") },
              { icon: Repeat, label: t("Más recompra y fidelidad", "More repurchase and loyalty") },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border bg-card">
                <b.icon size={18} style={{ color: "var(--magenta)" }} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {t("Mira casos reales en nuestro ", "See real cases in our ")}
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
            {t("¿Tu tienda recibe visitas pero vende poco?", "Does your store get visits but few sales?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Te mostramos dónde pierdes ventas y cómo recuperarlas.",
              "30 minutes, no commitment. We'll show you where you lose sales and how to recover them."
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
