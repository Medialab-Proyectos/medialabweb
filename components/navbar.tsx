"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun, BookOpen, Contrast, Leaf } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"

const navLinks = {
  es: [
    { label: "Servicios", href: "/#services" },
    { label: "Portafolio", href: "/portafolio" },
    { label: "Educación", href: "/curso", highlight: true },
    { label: "UXBox", href: "/#uxbox" },
    { label: "UXGreen™", href: "/uxgreen", uxgreen: true },
    { label: "Carreras", href: "/carreras" },
  ],
  en: [
    { label: "Services", href: "/#services" },
    { label: "Portfolio", href: "/portafolio" },
    { label: "Education", href: "/curso", highlight: true },
    { label: "UXBox", href: "/#uxbox" },
    { label: "UXGreen™", href: "/uxgreen", uxgreen: true },
    { label: "Careers", href: "/carreras" },
  ],
}

const FONT_SIZES = [100, 112, 125] // percentage
const FONT_LABELS = ["A", "A+", "A++"]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [fontIndex, setFontIndex] = useState(0)
  const { theme, setTheme } = useTheme()
  const { lang, setLang, localized } = useLanguage()
  const pathname = usePathname()
  const isCurso = pathname === "/curso" || pathname === "/en/curso"
  const isHome = pathname === "/" || pathname === "/en"
  const isUXGreen = pathname === "/uxgreen" || pathname === "/en/uxgreen"
  // El CTA usa anclas same-page solo donde existen (home: #contact, curso: #registro);
  // en el resto apunta a la página real /contacto para no dejar caminos muertos.
  const ctaHref = isCurso ? "#registro" : isHome ? "#contact" : localized("/contacto")
  const currentLinks = navLinks[lang]

  const activeTheme = mounted ? theme : "dark"
  const isDarkTheme = activeTheme === "dark" || activeTheme === "pure-dark"

  // Pages whose top is a hardcoded dark hero (var(--surface-dark)). When the
  // navbar is transparent (pre-scroll), text-foreground is dark in light mode
  // and would disappear on those dark heroes — so override to light colors.
  const isDarkHero =
    (isDarkTheme &&
      (pathname === "/" ||
        pathname === "/en" ||
        pathname === "/curso" ||
        pathname === "/en/curso")) ||
    isUXGreen ||
    pathname === "/carreras" ||
    pathname === "/en/carreras"
  const overDarkHero = !scrolled && isDarkHero
  // UXGreen always has a dark navbar, even when scrolled in light mode
  const isCarreras = pathname === "/carreras" || pathname === "/en/carreras"
  const forceDarkNav = isUXGreen || isCarreras
  const linkIdle = overDarkHero || forceDarkNav
    ? "text-white/70 hover:text-white"
    : "text-muted-foreground hover:text-foreground"
  const iconBtn = overDarkHero || forceDarkNav
    ? "text-white/70 hover:text-white border-white/20 hover:border-white/40"
    : "text-muted-foreground hover:text-foreground hover:border-foreground/30"
  const switcherBorder = overDarkHero || forceDarkNav ? "border-white/20" : "border-border"

  const cycleTheme = useCallback(() => {
    const themes = ["dark", "light", "warm", "pure-dark"]
    const nextIndex = (themes.indexOf(theme || "dark") + 1) % themes.length
    setTheme(themes[nextIndex])
  }, [theme, setTheme])

  const getThemeLabel = useCallback((themeName?: string) => {
    switch (themeName) {
      case "light":
        return lang === "es" ? "Cambiar a modo Lectura (Cálido)" : "Switch to Reading Mode (Warm)"
      case "warm":
        return lang === "es" ? "Cambiar a Noche Pura (Alto Contraste)" : "Switch to Pure Dark (High Contrast)"
      case "pure-dark":
        return lang === "es" ? "Cambiar a modo Cinemático (Oscuro)" : "Switch to Cinematic Mode (Dark)"
      case "dark":
      default:
        return lang === "es" ? "Cambiar a modo Claro (Limpio)" : "Switch to Light Mode (Clean)"
    }
  }, [lang])

  const ThemeIcon = ({ themeName }: { themeName?: string }) => {
    switch (themeName) {
      case "light":
        return <Sun size={15} />
      case "warm":
        return <BookOpen size={15} />
      case "pure-dark":
        return <Contrast size={15} />
      case "dark":
      default:
        return <Moon size={15} />
    }
  }

  const cycleFontSize = useCallback(() => {
    const next = (fontIndex + 1) % FONT_SIZES.length
    setFontIndex(next)
    document.documentElement.style.fontSize = `${FONT_SIZES[next]}%`
  }, [fontIndex])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${forceDarkNav ? "uxgreen-nav" : ""} ${
        scrolled
          ? forceDarkNav
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06] shadow-sm"
            : "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : forceDarkNav
          ? "bg-[#0a0a0a]/70 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          href={localized("/")}
          className="flex items-center gap-2 group"
          aria-label="MediaLab Ingeniería home"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault()
              if (window.location.hash) {
                window.history.replaceState(null, "", window.location.pathname)
              }
              window.scrollTo({ top: 0, behavior: "smooth" })
              return
            }
            // Viniendo de una landing: autoriza restaurar la sección guardada
            sessionStorage.setItem("homeScrollReady", "true")
          }}
        >
          <Image
            src="/logo.svg"
            alt="MediaLab Ingeniería"
            width={45}
            height={32}
            className="h-8 w-auto"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {currentLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href.startsWith("#") ? link.href : localized(link.href)}
              title={link.label}
              className={`text-sm font-medium transition-colors relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:transition-all after:duration-300 ${
                (link as any).uxgreen
                  ? "after:bg-[#00BFA6] hover:after:w-full"
                  : "after:bg-[var(--magenta)] hover:after:w-full"
              } ${
                (link as any).highlight
                  ? "text-[var(--magenta)] font-semibold hover:text-[var(--magenta)]"
                  : (link as any).uxgreen
                  ? overDarkHero
                    ? "text-[#00BFA6]/80 hover:text-[#00BFA6]"
                    : "text-[#00BFA6]/70 hover:text-[#00BFA6]"
                  : linkIdle
              }`}
            >
              {(link as any).highlight && (
                <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--magenta)] animate-pulse" />
              )}
              {(link as any).uxgreen && <Leaf size={12} className="inline-block mr-1 -mt-0.5" />}
              {link.label}
            </Link>
          ))}

        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language switcher */}
          {mounted && (
            <div className={`flex items-center border ${switcherBorder} rounded-full p-0.5 gap-0.5`}>
              <button
                onClick={() => setLang("es")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  lang === "es"
                    ? "bg-[var(--magenta)] text-white"
                    : linkIdle
                }`}
                aria-label="Switch to Spanish"
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  lang === "en"
                    ? "bg-[var(--magenta)] text-white"
                    : linkIdle
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          )}
          {/* Font size toggle — accessibility */}
          {mounted && (
            <button
              onClick={cycleFontSize}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 text-xs font-bold ${iconBtn}`}
              aria-label={`Font size: ${FONT_LABELS[fontIndex]}. Click to increase.`}
              title={lang === "es" ? "Cambiar tamaño de texto" : "Change text size"}
            >
              {FONT_LABELS[fontIndex]}
            </button>
          )}
          {/* Theme mode toggle */}
          {mounted && (
            <button
              onClick={cycleTheme}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${iconBtn}`}
              aria-label={getThemeLabel(theme)}
              title={getThemeLabel(theme)}
            >
              <ThemeIcon themeName={theme} />
            </button>
          )}
          <Link
            href={ctaHref}
            title={isCurso
              ? (lang === "es" ? "Inscribirme al curso" : "Enroll in the course")
              : (lang === "es" ? "Iniciar un proyecto con MediaLab" : "Start a project with MediaLab")
            }
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
              forceDarkNav
                ? "bg-white text-black hover:bg-[#00BFA6] hover:text-black"
                : "bg-foreground text-background hover:bg-[var(--magenta)] hover:text-white"
            }`}
          >
            {isCurso
              ? (lang === "es" ? "Inscribirme" : "Enroll now")
              : (lang === "es" ? "Iniciar proyecto" : "Start project")
            }
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-2">
          {/* Font size — mobile */}
          {mounted && (
            <button
              onClick={cycleFontSize}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 text-xs font-bold ${iconBtn}`}
              aria-label={`Font size: ${FONT_LABELS[fontIndex]}`}
            >
              {FONT_LABELS[fontIndex]}
            </button>
          )}
          {mounted && (
            <button
              onClick={cycleTheme}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${iconBtn}`}
              aria-label={getThemeLabel(theme)}
              title={getThemeLabel(theme)}
            >
              <ThemeIcon themeName={theme} />
            </button>
          )}
          <button
            className={`p-2 transition-colors ${overDarkHero || forceDarkNav ? "text-white" : "text-foreground"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden backdrop-blur-md border-b px-6 pb-6 pt-2 flex flex-col gap-4 ${
          forceDarkNav
            ? "bg-[#0a0a0a]/95 border-white/[0.06]"
            : "bg-background/95 border-border"
        }`}>
          {currentLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href.startsWith("#") ? link.href : localized(link.href)}
              title={link.label}
              onClick={() => setMobileOpen(false)}
              className={`text-base font-medium py-2 last:border-0 flex items-center gap-1.5 ${
                forceDarkNav ? "border-b border-white/10" : "border-b border-border"
              } ${
                (link as any).uxgreen
                  ? "text-[#00BFA6]"
                  : (link as any).highlight
                  ? "text-[var(--magenta)]"
                  : forceDarkNav
                  ? "text-white/80"
                  : "text-foreground"
              }`}
            >
              {(link as any).uxgreen && <Leaf size={14} />}
              {link.label}
            </Link>
          ))}
          {mounted && (
            <div className={`flex items-center gap-2 pt-2 border-t ${forceDarkNav ? "border-white/10" : "border-border"}`}>
              <div className={`flex items-center border rounded-full p-0.5 gap-0.5 flex-1 ${forceDarkNav ? "border-white/20" : "border-border"}`}>
                <button
                  onClick={() => setLang("es")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    lang === "es"
                      ? "bg-[var(--magenta)] text-white"
                      : forceDarkNav ? "text-white/50" : "text-muted-foreground"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    lang === "en"
                      ? "bg-[var(--magenta)] text-white"
                      : forceDarkNav ? "text-white/50" : "text-muted-foreground"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          )}
          <Link
            href={ctaHref}
            title={isCurso
              ? (lang === "es" ? "Inscribirme al curso" : "Enroll in the course")
              : (lang === "es" ? "Iniciar un proyecto con MediaLab" : "Start a project with MediaLab")
            }
            onClick={() => setMobileOpen(false)}
            className={`mt-2 px-5 py-3 rounded-full text-sm font-semibold text-center transition-all duration-200 ${
              forceDarkNav
                ? "bg-white text-black hover:bg-[var(--magenta)] hover:text-white"
                : "bg-foreground text-background hover:bg-[var(--magenta)] hover:text-white"
            }`}
          >
            {isCurso
              ? (lang === "es" ? "Inscribirme" : "Enroll now")
              : (lang === "es" ? "Iniciar proyecto" : "Start project")
            }
          </Link>
        </div>
      )}
    </header>
  )
}
