"use client"

import Link from "next/link"
import {
  Sparkles, Car, MapPin, Navigation, ShieldCheck, Clock, Zap,
  ArrowRight, ChevronRight, CheckCircle2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function MovilidadContent() {
  const { t, localized } = useLanguage()

  const focus = [
    {
      icon: Navigation,
      title: t("Diseño para el contexto real", "Design for the real context"),
      desc: t(
        "Una mano, en movimiento, con prisa y poca atención. Diseñamos para ese momento, no para una oficina.",
        "One hand, on the move, in a hurry, with little attention. We design for that moment, not for an office."
      ),
    },
    {
      icon: Clock,
      title: t("Información en tiempo real", "Real-time information"),
      desc: t(
        "Tiempos de llegada, estados y rutas claros al instante, para que el usuario decida sin dudar.",
        "Arrival times, statuses, and routes clear instantly, so the user decides without hesitation."
      ),
    },
    {
      icon: ShieldCheck,
      title: t("Confianza y seguridad", "Trust and safety"),
      desc: t(
        "Señales de seguridad, identidad y soporte que reducen la ansiedad de moverse o pagar.",
        "Safety, identity, and support signals that reduce the anxiety of moving or paying."
      ),
    },
    {
      icon: MapPin,
      title: t("Conductores y pasajeros", "Drivers and riders"),
      desc: t(
        "Diseñamos las dos caras del producto: la experiencia del usuario y la del operador en la calle.",
        "We design both sides of the product: the user experience and the on-the-road operator experience."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Por qué la UX es crítica en apps de movilidad?", "Why is UX critical in mobility apps?"),
      a: t(
        "Porque el usuario las usa en movimiento, con prisa y atención dividida. Cada segundo de confusión es frustración (y a veces riesgo). Una buena UX hace que la información correcta aparezca en el momento exacto, con el mínimo esfuerzo.",
        "Because users use them on the move, in a hurry, with divided attention. Every second of confusion is frustration (and sometimes risk). Good UX makes the right information appear at the exact moment, with minimum effort."
      ),
    },
    {
      q: t("¿Cómo diseñan para el uso en movimiento?", "How do you design for use on the move?"),
      a: t(
        "Priorizamos lo esencial, usamos objetivos táctiles grandes, jerarquía clara y feedback inmediato. Reducimos la carga cognitiva para que el usuario actúe casi sin pensar, incluso con una sola mano.",
        "We prioritize the essentials, use large touch targets, clear hierarchy, and immediate feedback. We reduce cognitive load so the user acts almost without thinking, even one-handed."
      ),
    },
    {
      q: t("¿Diseñan para conductores y pasajeros?", "Do you design for both drivers and riders?"),
      a: t(
        "Sí. La movilidad es un producto de dos caras: la experiencia de quien se mueve y la de quien opera. Diseñamos ambas para que el sistema completo funcione con fluidez.",
        "Yes. Mobility is a two-sided product: the experience of the person moving and the one operating. We design both so the whole system flows."
      ),
    },
    {
      q: t("¿Consideran seguridad y tiempo real?", "Do you consider safety and real-time?"),
      a: t(
        "Sí. Integramos estados en vivo, señales de seguridad e identidad, y diseñamos para situaciones límite (sin señal, retrasos, cancelaciones) para que el usuario nunca se sienta perdido.",
        "Yes. We integrate live states, safety and identity signals, and design for edge cases (no signal, delays, cancellations) so the user never feels lost."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="mov-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
            <ChevronRight size={12} />
            <span className="text-white/40">{t("Industrias", "Industries")}</span>
            <ChevronRight size={12} />
            <span className="text-white/80">{t("Movilidad", "Mobility")}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
            <Sparkles size={14} /> {t("Industria", "Industry")}
          </div>

          <h1 id="mov-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
            {t("Diseño UX para movilidad: que moverte sea simple y seguro", "Mobility UX design: making getting around simple and safe")}
          </h1>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t(
              "El UX para movilidad es el diseño de experiencias de transporte y logística que funcionan en el mundo real: en movimiento, con prisa y atención dividida. En MediaLab combinamos investigación de usuarios, diseño conductual e IA para crear apps de movilidad claras, en tiempo real y seguras — para usuarios y operadores.",
              "Mobility UX is the design of transport and logistics experiences that work in the real world: on the move, in a hurry, with divided attention. At MediaLab we combine user research, behavioral design, and AI to create clear, real-time, safe mobility apps — for users and operators."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <BookingModal>
              <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                {t("Hablemos de tu producto de movilidad", "Let's talk about your mobility product")}
              </button>
            </BookingModal>
            <Link href={localized("/servicios/diseno-ux-ui")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
              {t("Ver diseño UX/UI", "See UX/UI design")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué es diferente? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué la UX en movilidad es diferente?", "Why is mobility UX different?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "En movilidad el usuario no está sentado con calma: está caminando, conduciendo o esperando bajo presión. El contexto manda. Diseñar movilidad es reducir todo a lo esencial, dar información en tiempo real y generar confianza en cada momento de decisión — porque un error aquí cuesta tiempo, dinero o tranquilidad.",
              "In mobility the user isn't calmly seated: they're walking, driving, or waiting under pressure. Context rules. Designing mobility means reducing everything to the essentials, delivering real-time information, and building trust at every decision moment — because a mistake here costs time, money, or peace of mind."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué diseñamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-disenamos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-disenamos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué diseñamos para movilidad?", "What do we design for mobility?")}
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
            {t("¿Producto nuevo? Empieza por el ", "New product? Start with ")}
            <Link href={localized("/servicios/discovery-con-ia")} className="text-[var(--magenta)] font-medium hover:underline">{t("discovery con IA", "AI discovery")}</Link>
            {t(" o el ", " or ")}
            <Link href={localized("/servicios/desarrollo-producto-digital")} className="text-[var(--magenta)] font-medium hover:underline">{t("desarrollo de producto", "product development")}</Link>.
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
              { icon: Zap, label: t("Decisiones más rápidas en pantalla", "Faster on-screen decisions") },
              { icon: ShieldCheck, label: t("Mayor confianza y seguridad percibida", "Higher perceived trust and safety") },
              { icon: Car, label: t("Mejor experiencia para usuarios y operadores", "Better experience for users and operators") },
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
            {t("¿Construyes un producto de movilidad?", "Building a mobility product?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Te mostramos dónde tu experiencia genera fricción en el momento de uso real.",
              "30 minutes, no commitment. We'll show you where your experience creates friction at the real moment of use."
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
