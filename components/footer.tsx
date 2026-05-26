"use client"

import Link from "next/link"
import Image from "next/image"
import { Linkedin, Twitter, Instagram } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const UXGREEN_BADGE = "/images/curso/logos/Green%20UX%20v%202.svg"

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/medialab-ingenieria" },
  { icon: Twitter, label: "X", href: "https://x.com/MediaLabIng" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/medialabingenieria" },
]

export function Footer() {
  const { t, localized } = useLanguage()

  const navColumns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
    {
      title: t("Servicios", "Services"),
      links: [
        { label: t("Diseño UX/UI", "UX/UI Design"), href: "/servicios/diseno-ux-ui" },
        { label: t("Discovery con IA", "Discovery with AI"), href: "/servicios/discovery-con-ia" },
        { label: t("Desarrollo a Medida", "Custom Development"), href: "/servicios/desarrollo-producto-digital" },
        { label: t("CRO para SaaS", "CRO for SaaS"), href: "/servicios/cro-saas" },
      ],
    },
    {
      title: t("Productos", "Products"),
      links: [
        { label: t("Portafolio", "Portfolio"), href: "/portafolio" },
        { label: "UXBox", href: "/#uxbox" },
        { label: "UXGreen™", href: "/uxgreen" },
      ],
    },
    {
      title: t("Empresa", "Company"),
      links: [
        { label: t("Sobre Nosotros", "About Us"), href: "/sobre-nosotros" },
        { label: t("Educación", "Education"), href: "/curso" },
        { label: t("Carreras", "Careers"), href: "/carreras" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: t("Recursos", "Resources"),
      links: [
        { label: t("Analizador UX + IA", "UX + AI Analyzer"), href: "/recursos/analizador-ux-ia" },
        { label: t("Contacto", "Contact"), href: "/contacto" },
        { label: "FAQ", href: "/#faq" },
        { label: "Medium", href: "https://medium.com/@co.benavides86", external: true },
        { label: "Clutch", href: "https://clutch.co/profile/medialab-ingenier", external: true },
        { label: "GoodFirms", href: "https://www.goodfirms.co/company/medialab-ingenieria", external: true },
      ],
    },
  ]

  return (
    <footer
      className="bg-[#090909] text-white/70 pt-16 pb-8 px-6 border-t border-white/5"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top: brand + nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <Link href={localized("/")} className="inline-flex items-center gap-2" aria-label="MediaLab Ingeniería home">
              <Image src="/logo.svg" alt="MediaLab Ingeniería" width={140} height={32} className="h-8 w-auto" unoptimized />
            </Link>
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              {t(
                "Investigamos cómo piensan tus usuarios, diseñamos lo que necesitan sentir y construimos el producto que tu negocio necesita. Sin suposiciones. Con datos.",
                "We research how your users think, design what they need to feel, and build the product your business needs. No assumptions. With data."
              )}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("Visitar", "Visit")} ${s.label}`}
                    title={`${t("Visitar", "Visit")} MediaLab ${t("en", "on")} ${s.label}`}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:bg-[var(--magenta)] hover:text-white hover:border-[var(--magenta)] transition-all duration-200"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-4" aria-label={col.title}>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${t("Visitar", "Visit")} ${link.label}`}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href.startsWith("#") ? link.href : localized(link.href)}
                        title={link.label}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col gap-4 text-xs text-white/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} MediaLab Ingeniería.{" "}
              {t("Todos los derechos reservados.", "All rights reserved.")}
            </p>
            <div className="flex items-center gap-6">
              <Link href={localized("/politica-de-privacidad")} title={t("Política de Privacidad", "Privacy Policy")} className="hover:text-white/60 transition-colors">
                {t("Política de Privacidad", "Privacy Policy")}
              </Link>
              <Link href={localized("/terminos-de-servicio")} title={t("Términos de Servicio", "Terms of Service")} className="hover:text-white/60 transition-colors">
                {t("Términos de Servicio", "Terms of Service")}
              </Link>
            </div>
          </div>
          {/* UXGreen™ Badge */}
          <div className="flex justify-center sm:justify-start">
            <Link
              href={localized("/uxgreen")}
              title="UXGreen™ — Certificación de eficiencia digital sostenible"
              className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all hover:border-[#00BFA6]/30 hover:bg-[#00BFA6]/5 group"
              style={{ borderColor: "rgba(0,191,166,0.15)", background: "rgba(0,191,166,0.04)" }}
            >
              <Image
                src={UXGREEN_BADGE}
                alt="UXGreen™ Certified badge"
                width={28}
                height={28}
                className="opacity-85 group-hover:opacity-100 transition-opacity"
                unoptimized
              />
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase leading-tight"
                  style={{ color: "rgba(0,191,166,0.75)" }}
                >
                  UXGreen™
                </span>
                <span className="text-[9px] text-white/25 leading-tight">
                  {t("Eficiencia Digital Sostenible", "Sustainable Digital Efficiency")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
