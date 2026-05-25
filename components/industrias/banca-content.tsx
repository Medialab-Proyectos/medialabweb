"use client"

import Link from "next/link"
import {
  Sparkles, Landmark, ShieldCheck, Accessibility, Smartphone, Gauge, Users,
  ArrowRight, ChevronRight, CheckCircle2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"

export function BancaContent() {
  const { t, localized } = useLanguage()

  const focus = [
    {
      icon: ShieldCheck,
      title: t("Confianza y seguridad percibida", "Trust and perceived security"),
      desc: t(
        "Diseñamos cada interacción para que el cliente sienta que su dinero está seguro, sin saturarlo de fricción.",
        "We design every interaction so the client feels their money is safe, without overwhelming them with friction."
      ),
    },
    {
      icon: Smartphone,
      title: t("Banca digital y omnicanal", "Digital and omnichannel banking"),
      desc: t(
        "Experiencias coherentes entre app, web y sucursal, para que el cliente nunca tenga que reaprender.",
        "Coherent experiences across app, web, and branch, so the client never has to relearn."
      ),
    },
    {
      icon: Accessibility,
      title: t("Accesibilidad e inclusión", "Accessibility and inclusion"),
      desc: t(
        "Diseño que funciona para todos los públicos, incluidos usuarios mayores o con baja alfabetización digital.",
        "Design that works for all audiences, including older users or those with low digital literacy."
      ),
    },
    {
      icon: Gauge,
      title: t("Modernización sin romper la operación", "Modernization without breaking operations"),
      desc: t(
        "Rediseñamos flujos críticos de forma incremental, respetando sistemas legados y cumplimiento.",
        "We redesign critical flows incrementally, respecting legacy systems and compliance."
      ),
    },
  ]

  const faqs = [
    {
      q: t("¿Por qué la UX es crítica en banca?", "Why is UX critical in banking?"),
      a: t(
        "Porque la banca maneja el dinero y la tranquilidad de las personas. Una experiencia confusa no solo frustra: erosiona la confianza en la institución. Una buena UX reduce la ansiedad, baja la carga en canales de soporte y aumenta la adopción de canales digitales.",
        "Because banking handles people's money and peace of mind. A confusing experience doesn't just frustrate: it erodes trust in the institution. Good UX reduces anxiety, lowers support-channel load, and increases digital channel adoption."
      ),
    },
    {
      q: t("¿Cómo modernizan un banco establecido sin romper la operación?", "How do you modernize an established bank without breaking operations?"),
      a: t(
        "Trabajamos de forma incremental: priorizamos los flujos de mayor impacto, rediseñamos y validamos por fases, y respetamos los sistemas legados y los requisitos regulatorios. La meta es mejorar la experiencia sin arriesgar la estabilidad.",
        "We work incrementally: we prioritize the highest-impact flows, redesign and validate in phases, and respect legacy systems and regulatory requirements. The goal is to improve the experience without risking stability."
      ),
    },
    {
      q: t("¿Qué es el diseño conductual aplicado a banca?", "What is behavioral design applied to banking?"),
      a: t(
        "Es aplicar psicología del consumidor para guiar decisiones financieras de forma clara y ética: reducir la ansiedad en transferencias, hacer entendibles productos complejos y dar al cliente sensación de control en cada paso.",
        "It's applying consumer psychology to guide financial decisions clearly and ethically: reducing anxiety in transfers, making complex products understandable, and giving the client a sense of control at every step."
      ),
    },
    {
      q: t("¿Consideran accesibilidad y cumplimiento?", "Do you consider accessibility and compliance?"),
      a: t(
        "Sí. Diseñamos siguiendo pautas de accesibilidad (WCAG) e integramos los requisitos regulatorios desde el inicio, para que la experiencia sea inclusiva y conforme sin sentirse como un trámite.",
        "Yes. We design following accessibility guidelines (WCAG) and integrate regulatory requirements from the start, so the experience is inclusive and compliant without feeling like paperwork."
      ),
    },
  ]

  return (
    <main id="main-content">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-[var(--surface-dark)] text-white overflow-hidden" aria-labelledby="banca-h1">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link href={localized("/")} className="hover:text-white">{t("Inicio", "Home")}</Link>
            <ChevronRight size={12} />
            <span className="text-white/40">{t("Industrias", "Industries")}</span>
            <ChevronRight size={12} />
            <span className="text-white/80">{t("Banca", "Banking")}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border w-fit"
            style={{ color: "var(--magenta)", borderColor: "rgba(232,117,26,0.3)", background: "rgba(232,117,26,0.08)" }}>
            <Sparkles size={14} /> {t("Industria", "Industry")}
          </div>

          <h1 id="banca-h1" className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
            {t("Diseño UX para banca: experiencias que eliminan la ansiedad del usuario", "Banking UX design: experiences that remove user anxiety")}
          </h1>

          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t(
              "El UX para banca es el diseño de experiencias financieras claras, seguras y accesibles que aumentan la confianza y la adopción de canales digitales. En MediaLab combinamos investigación de usuarios, diseño conductual e IA para modernizar la banca digital sin sacrificar cumplimiento ni estabilidad.",
              "Banking UX is the design of clear, secure, accessible financial experiences that increase trust and digital channel adoption. At MediaLab we combine user research, behavioral design, and AI to modernize digital banking without sacrificing compliance or stability."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <BookingModal>
              <button type="button" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95 shadow-lg hover:brightness-110"
                style={{ background: "#E8751A", boxShadow: "0 8px 30px rgba(232,117,26,0.35)" }}>
                {t("Hablemos de tu banca digital", "Let's talk about your digital banking")}
              </button>
            </BookingModal>
            <Link href={localized("/industrias/fintech")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/15 text-white/75 hover:text-white hover:border-white/30 transition-all">
              {t("Ver también Fintech", "See also Fintech")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué es diferente? */}
      <section className="py-20 px-6 bg-background" aria-labelledby="por-que">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 id="por-que" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Por qué la UX bancaria es diferente?", "Why is banking UX different?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t(
              "La banca atiende a todos: desde nativos digitales hasta personas que desconfían de lo digital. Cada error percibido se traduce en una llamada a soporte o en una visita a sucursal — y en desconfianza. Diseñar banca es equilibrar seguridad, claridad y accesibilidad para que cualquier persona pueda operar con tranquilidad.",
              "Banking serves everyone: from digital natives to people who distrust the digital. Every perceived error turns into a support call or a branch visit — and into distrust. Designing banking means balancing security, clarity, and accessibility so anyone can operate with peace of mind."
            )}
          </p>
        </div>
      </section>

      {/* ¿Qué diseñamos? */}
      <section className="py-20 px-6 bg-secondary/30" aria-labelledby="que-disenamos">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 id="que-disenamos" className="font-display font-bold text-3xl md:text-4xl text-foreground text-balance">
            {t("¿Qué diseñamos para banca?", "What do we design for banking?")}
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
            {t("¿Producto financiero nuevo? Empieza por el ", "New financial product? Start with ")}
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
              { icon: Smartphone, label: t("Mayor adopción de canales digitales", "Higher digital channel adoption") },
              { icon: Users, label: t("Menos carga en soporte y sucursal", "Less load on support and branches") },
              { icon: ShieldCheck, label: t("Mayor confianza y satisfacción", "Higher trust and satisfaction") },
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
            {t("¿Modernizas la experiencia de tu banco?", "Modernizing your bank's experience?")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {t(
              "30 minutos, sin compromiso. Te mostramos dónde tu experiencia genera fricción y cómo resolverla por fases.",
              "30 minutes, no commitment. We'll show you where your experience creates friction and how to solve it in phases."
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
