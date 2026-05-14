"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"

const navLinks = {
  es: [
    { label: "Servicios", href: "#services" },
    { label: "Curso UX + IA", href: "/curso", highlight: true },
    { label: "UXBox", href: "#uxbox" },
    { label: "Metodología", href: "#method" },
    { label: "Productos", href: "#products" },
    { label: "Blog", href: "#blog" },
  ],
  en: [
    { label: "Services", href: "#services" },
    { label: "Learn AI", href: "/curso", highlight: true },
    { label: "UXBox", href: "#uxbox" },
    { label: "Methodology", href: "#method" },
    { label: "Products", href: "#products" },
    { label: "Blog", href: "#blog" },
  ],
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { lang, setLang } = useLanguage()
  const currentLinks = navLinks[lang]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="MediaLab Ingeniería home">
          <Image
            src="/logo.svg"
            alt="MediaLab Ingeniería"
            width={45}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {currentLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:bg-[var(--magenta)] hover:after:w-full after:transition-all after:duration-300 ${
                (link as any).highlight
                  ? "text-[var(--magenta)] font-semibold hover:text-[var(--magenta)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {(link as any).highlight && (
                <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--magenta)] animate-pulse" />
              )}
              {link.label}
            </Link>
          ))}

        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          {mounted && (
            <div className="flex items-center border border-border rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setLang("es")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  lang === "es"
                    ? "bg-[var(--magenta)] text-white"
                    : "text-muted-foreground hover:text-foreground"
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
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          )}
          {/* Dark mode toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
          <Link
            href="#contact"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-foreground text-background hover:bg-[var(--magenta)] hover:text-white transition-all duration-200 active:scale-95"
          >
            {lang === "es" ? "Iniciar proyecto" : "Start project"}
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-muted-foreground"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
          <button
            className="p-2 text-foreground"
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
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-6 pt-2 flex flex-col gap-4">
          {currentLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border last:border-0"
            >
              {link.label}
            </Link>
          ))}
          {mounted && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <div className="flex items-center border border-border rounded-full p-0.5 gap-0.5 flex-1">
                <button
                  onClick={() => setLang("es")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    lang === "es"
                      ? "bg-[var(--magenta)] text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    lang === "en"
                      ? "bg-[var(--magenta)] text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          )}
          <Link
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-5 py-3 rounded-full text-sm font-semibold bg-foreground text-background text-center hover:bg-[var(--magenta)] hover:text-white transition-all duration-200"
          >
            {lang === "es" ? "Iniciar proyecto" : "Start project"}
          </Link>
        </div>
      )}
    </header>
  )
}
