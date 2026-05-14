import Link from "next/link"
import Image from "next/image"
import { Linkedin, Twitter, Instagram } from "lucide-react"

const navColumns = [
  {
    title: "Servicios",
    links: [
      { label: "UX y Diseño Conductual", href: "#services" },
      { label: "Discovery con IA", href: "#services" },
      { label: "Desarrollo a Medida", href: "#services" },
    ],
  },
  {
    title: "Productos",
    links: [
      { label: "Portafolio", href: "/portafolio" },
      { label: "UXBox", href: "#uxbox" },
      { label: "SinDeudas", href: "#products" },
      { label: "Electrolineras", href: "#products" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nosotros", href: "#about" },
      { label: "Metodología", href: "#method" },
      { label: "Industrias", href: "#industries" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "#blog" },
      { label: "Curso UX + IA", href: "/curso" },
      { label: "FAQ", href: "#faq" },
      { label: "Contacto", href: "#contact" },
    ],
  },
]

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/medialab-ingenieria" },
  { icon: Twitter, label: "X", href: "https://x.com/MediaLabIng" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/medialabingenieria" },
]

export function Footer() {
  return (
    <footer
      className="bg-[var(--surface-dark)] text-[var(--surface-dark-fg)] pt-16 pb-8 px-6"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top: brand + nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="MediaLab Ingeniería home">
              <Image src="/logo.svg" alt="MediaLab Ingeniería" width={140} height={32} className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Investigamos cómo piensan tus usuarios, diseñamos lo que necesitan sentir y construimos el producto que tu negocio necesita. Sin suposiciones. Con datos.
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
                    aria-label={`Visitar ${s.label}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:bg-[var(--magenta)] hover:text-white hover:border-[var(--magenta)] transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-4" aria-label={col.title}>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} MediaLab Ingeniería. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="/politica-de-privacidad" className="hover:text-white/60 transition-colors">Política de Privacidad</a>
            <a href="/terminos-de-servicio" className="hover:text-white/60 transition-colors">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
