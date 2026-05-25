"use client"

import Link from "next/link"
import { Home, Compass, BookOpen, MessageCircle, Sparkles, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function NotFound() {
  const { t, localized } = useLanguage()

  const links = [
    { href: "/", icon: Home, label: t("Inicio", "Home"), desc: t("Vuelve al principio", "Back to the start") },
    { href: "/servicios", icon: Compass, label: t("Servicios", "Services"), desc: t("UX, IA, desarrollo y CRO", "UX, AI, development & CRO") },
    { href: "/recursos/analizador-ux-ia", icon: Sparkles, label: t("Diagnóstico UX + IA", "UX + AI Diagnosis"), desc: t("Analiza tu producto gratis", "Analyze your product free") },
    { href: "/blog", icon: BookOpen, label: "Blog", desc: t("Ideas sobre UX, IA y producto", "Ideas on UX, AI & product") },
  ]

  return (
    <main id="main-content">
      <Navbar />

      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-32 bg-[var(--surface-dark)] text-white overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #E8751A 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="absolute -bottom-32 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ background: "radial-gradient(circle, #2AABB3 0%, transparent 70%)" }} aria-hidden="true" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-7">
          <span className="font-display font-bold text-7xl md:text-8xl bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #E8751A, #2AABB3)" }}>
            404
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white text-balance">
            {t("Esta página se perdió en el discovery", "This page got lost in discovery")}
          </h1>
          <p className="text-base text-white/60 max-w-md leading-relaxed">
            {t(
              "El enlace que seguiste no existe o cambió de lugar. Pero no te vayas con las manos vacías — aquí tienes por dónde seguir.",
              "The link you followed doesn't exist or moved. But don't leave empty-handed — here's where to go next."
            )}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 w-full mt-2">
            {links.map((l) => (
              <Link key={l.href} href={localized(l.href)}
                className="group flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 text-left hover:border-[var(--orange)] hover:bg-white/[0.08] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--magenta), var(--orange))" }}>
                  <l.icon size={18} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{l.label}</span>
                  <span className="text-xs text-white/50">{l.desc}</span>
                </div>
                <ArrowRight size={15} className="ml-auto text-white/30 group-hover:text-[var(--orange)] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>

          <Link href={localized("/contacto")} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mt-2">
            <MessageCircle size={15} /> {t("¿Buscabas algo en concreto? Escríbenos", "Looking for something specific? Contact us")}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
