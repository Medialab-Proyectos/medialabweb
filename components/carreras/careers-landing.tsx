"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin, Briefcase, Clock, Wifi, ChevronDown, ChevronUp,
  CheckCircle2, Send, Linkedin, Sparkles, Heart, Rocket,
  GraduationCap, Globe, Users, Star, Coffee, Zap, Brain,
  ArrowRight, X, ExternalLink, FileText, Palette
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/* ── Job listing data ── */
const POSITIONS = [
  {
    id: "ux-ui-middle-bogota",
    titleEs: "Diseñador/a UX/UI Middle",
    titleEn: "UX/UI Middle Designer",
    locationEs: "Remoto · Bogotá, Colombia",
    locationEn: "Remote · Bogotá, Colombia",
    typeEs: "Tiempo completo",
    typeEn: "Full-time",
    levelEs: "Middle (3-5 años)",
    levelEn: "Middle (3-5 years)",
    descEs: "Buscamos un/a diseñador/a UX/UI con experiencia intermedia que quiera crecer dentro de un equipo que combina investigación de usuarios con inteligencia artificial. Vas a trabajar en proyectos reales para marcas B2B y B2C en LATAM y USA, con mentoría directa del equipo senior.",
    descEn: "We're looking for a mid-level UX/UI designer who wants to grow within a team that combines user research with artificial intelligence. You'll work on real projects for B2B and B2C brands in LATAM and USA, with direct mentorship from the senior team.",
    responsibilitiesEs: [
      "Diseñar flujos e interfaces para productos web y móviles en Figma",
      "Participar en sesiones de investigación de usuarios y síntesis de hallazgos",
      "Colaborar con desarrolladores para asegurar la fidelidad del diseño",
      "Iterar basándote en datos, pruebas de usabilidad y feedback real",
      "Contribuir al sistema de diseño y a la documentación de patrones UX",
      "Explorar cómo la IA puede optimizar procesos de diseño",
    ],
    responsibilitiesEn: [
      "Design flows and interfaces for web and mobile products in Figma",
      "Participate in user research sessions and findings synthesis",
      "Collaborate with developers to ensure design fidelity",
      "Iterate based on data, usability testing, and real feedback",
      "Contribute to the design system and UX pattern documentation",
      "Explore how AI can optimize design processes",
    ],
    requirementsEs: [
      "3-5 años de experiencia en diseño UX/UI",
      "Portafolio con proyectos reales (no solo ejercicios académicos)",
      "Dominio de Figma y herramientas de prototipado",
      "Conocimiento de principios de diseño conductual y psicología del usuario",
      "Familiaridad con sistemas de diseño (tokens, componentes, variantes)",
      "Español fluido (inglés intermedio es un plus)",
    ],
    requirementsEn: [
      "3-5 years of UX/UI design experience",
      "Portfolio with real projects (not just academic exercises)",
      "Figma and prototyping tools proficiency",
      "Knowledge of behavioral design principles and user psychology",
      "Familiarity with design systems (tokens, components, variants)",
      "Fluent Spanish (intermediate English is a plus)",
    ],
    bonusEs: [
      "Experiencia con herramientas de IA (ChatGPT, Midjourney, v0, Cursor)",
      "Conocimiento de HTML/CSS básico",
      "Experiencia en metodologías ágiles (Scrum/Kanban)",
      "Haber participado en hackathons o comunidades de diseño",
    ],
    bonusEn: [
      "Experience with AI tools (ChatGPT, Midjourney, v0, Cursor)",
      "Basic HTML/CSS knowledge",
      "Experience with agile methodologies (Scrum/Kanban)",
      "Participation in hackathons or design communities",
    ],
  },
  {
    id: "ux-junior-ia-bogota",
    titleEs: "Diseñador/a UX Junior IA",
    titleEn: "UX Junior AI Designer",
    locationEs: "Remoto · Bogotá, Colombia",
    locationEn: "Remote · Bogotá, Colombia",
    typeEs: "Tiempo completo",
    typeEn: "Full-time",
    levelEs: "Junior (1-2 años)",
    levelEn: "Junior (1-2 years)",
    descEs: "¿Estás empezando tu carrera en UX y te apasiona la inteligencia artificial? Buscamos un/a diseñador/a junior con hambre de aprender, curiosidad por la IA y ganas de trabajar en productos reales desde el día uno. Tendrás mentoría directa del equipo senior y acceso completo a nuestro curso UX + IA.",
    descEn: "Are you starting your UX career and passionate about artificial intelligence? We're looking for a junior designer with a hunger to learn, curiosity about AI, and the desire to work on real products from day one. You'll have direct mentorship from the senior team and full access to our UX + AI course.",
    responsibilitiesEs: [
      "Apoyar en el diseño de interfaces y flujos de usuario en Figma",
      "Participar en investigación de usuarios bajo la guía del equipo senior",
      "Explorar y proponer el uso de herramientas de IA en procesos de diseño",
      "Crear componentes para el sistema de diseño",
      "Documentar patrones UX y hallazgos de investigación",
      "Iterar diseños basándote en feedback del equipo y pruebas de usabilidad",
    ],
    responsibilitiesEn: [
      "Support interface and user flow design in Figma",
      "Participate in user research under senior team guidance",
      "Explore and propose AI tool usage in design processes",
      "Create components for the design system",
      "Document UX patterns and research findings",
      "Iterate designs based on team feedback and usability testing",
    ],
    requirementsEs: [
      "1-2 años de experiencia en diseño UX/UI (proyectos académicos cuentan)",
      "Portafolio que demuestre proceso de diseño, no solo pantallas bonitas",
      "Conocimiento básico de Figma",
      "Curiosidad genuina por la inteligencia artificial y sus aplicaciones en diseño",
      "Capacidad de recibir feedback y actuar rápido sobre él",
      "Español fluido",
    ],
    requirementsEn: [
      "1-2 years of UX/UI design experience (academic projects count)",
      "Portfolio demonstrating design process, not just pretty screens",
      "Basic Figma knowledge",
      "Genuine curiosity about artificial intelligence and its design applications",
      "Ability to receive feedback and act on it quickly",
      "Fluent Spanish",
    ],
    bonusEs: [
      "Haber usado ChatGPT, Midjourney o herramientas de IA para diseño",
      "Conocimiento básico de HTML/CSS",
      "Haber tomado cursos de UX online (Google, Coursera, etc.)",
      "Participar en comunidades de diseño o tener un blog/proyecto personal",
    ],
    bonusEn: [
      "Experience using ChatGPT, Midjourney or AI tools for design",
      "Basic HTML/CSS knowledge",
      "Completed online UX courses (Google, Coursera, etc.)",
      "Active in design communities or maintaining a blog/personal project",
    ],
  },
]

/* ── Benefits data ── */
const BENEFITS_ES = [
  { icon: Wifi, title: "100% Remoto", desc: "Trabaja desde donde te inspire. Sin oficinas obligatorias." },
  { icon: Brain, title: "Mentoría de IA", desc: "Acceso al curso UX + IA y formación continua en nuevas herramientas." },
  { icon: GraduationCap, title: "Crecimiento profesional", desc: "Plan de carrera claro, feedback quincenal y proyectos que retan." },
  { icon: Globe, title: "Proyectos globales", desc: "Clientes en LATAM, USA y España. Diseñas para el mundo." },
  { icon: Users, title: "Equipo senior", desc: "Aprende de diseñadores con 10+ años y acceso directo al CEO." },
  { icon: Coffee, title: "Cultura humana", desc: "Viernes cortos, días de bienestar y cero micromanagement." },
  { icon: Star, title: "Impacto real", desc: "Tus diseños se ven en producción. No se quedan en PowerPoint." },
  { icon: Rocket, title: "Stack moderno", desc: "Figma, IA, Next.js, Vercel. Las herramientas que el mercado pide." },
]

const BENEFITS_EN = [
  { icon: Wifi, title: "100% Remote", desc: "Work from wherever inspires you. No mandatory offices." },
  { icon: Brain, title: "AI Mentorship", desc: "Access to the UX + AI course and continuous training on new tools." },
  { icon: GraduationCap, title: "Professional Growth", desc: "Clear career path, biweekly feedback, and challenging projects." },
  { icon: Globe, title: "Global Projects", desc: "Clients in LATAM, USA, and Spain. You design for the world." },
  { icon: Users, title: "Senior Team", desc: "Learn from 10+ year designers with direct CEO access." },
  { icon: Coffee, title: "Human Culture", desc: "Short Fridays, wellness days, and zero micromanagement." },
  { icon: Star, title: "Real Impact", desc: "Your designs ship to production. They don't stay in PowerPoint." },
  { icon: Rocket, title: "Modern Stack", desc: "Figma, AI, Next.js, Vercel. The tools the market demands." },
]

/* ── Component ── */
export function CareersLanding() {
  const { t, localized } = useLanguage()
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeroVisible(true) },
      { threshold: 0.15 }
    )
    if (heroRef.current) obs.observe(heroRef.current)
    return () => obs.disconnect()
  }, [])

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [showForm])

  const handleApply = (positionTitle: string) => {
    setSelectedPosition(positionTitle)
    setShowForm(true)
    setSubmitted(false)
    setErrors({})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name      = ((data.get("name")      as string) || "").trim()
    const phone     = ((data.get("phone")     as string) || "").trim()
    const email     = ((data.get("email")     as string) || "").trim()
    const linkedin  = ((data.get("linkedin")  as string) || "").trim()
    const portfolio = ((data.get("portfolio") as string) || "").trim()
    const resume    = ((data.get("resume")    as string) || "").trim()
    const challenge = ((data.get("challenge") as string) || "").trim()

    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = t("Tu nombre es necesario.", "Your name is required.")
    if (!phone) newErrors.phone = t("Necesitamos un teléfono para contactarte.", "We need a phone to contact you.")
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = t("Ingresa un email válido.", "Enter a valid email.")
    if (!challenge) newErrors.challenge = t("Cuéntanos tu mayor reto en UX.", "Tell us your biggest UX challenge.")
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setSending(true)

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, linkedin, portfolio, resume, challenge, position: selectedPosition }),
      })
      if (!res.ok) throw new Error("api_error")
      setSubmitted(true)
    } catch {
      setErrors({ challenge: t("Error enviando. Intenta de nuevo o escríbenos por email.", "Error sending. Try again or email us.") })
    } finally {
      setSending(false)
    }
  }

  const benefits = t("es", "en") === "es" ? BENEFITS_ES : BENEFITS_EN

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden dark-hero-text"
        style={{ background: "#0a0a0a" }}
      >
        {/* Background image with overlay — always dark tones, never bleed to white */}
        <div className="absolute inset-0">
          <Image
            src="/images/careers-hero.png"
            alt={t("Equipo MediaLab colaborando", "MediaLab team collaborating")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
          {/* Top dark gradient overlay for transparent header contrast */}
          <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/90 via-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Ambient glow */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,117,26,0.15), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40 w-full transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--magenta)]/20 border border-[var(--magenta)]/30 text-sm mb-8">
            <Sparkles size={14} className="text-[var(--magenta)]" />
            <span className="text-white/90 font-medium">{t("Estamos contratando", "We're hiring")}</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-white max-w-3xl text-balance mb-6">
            {t(
              "Diseña el futuro con nosotros.",
              "Design the future with us."
            )}
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mb-10 text-pretty">
            {t(
              "En MediaLab no buscamos empleados — buscamos personas que quieran transformar la manera en que el mundo interactúa con la tecnología. Si el diseño centrado en el humano es tu pasión, este es tu lugar.",
              "At MediaLab we don't look for employees — we look for people who want to transform how the world interacts with technology. If human-centered design is your passion, this is your place."
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#vacantes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--magenta)] text-white font-bold text-base hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[var(--magenta)]/25"
            >
              {t("Ver vacantes abiertas", "View open positions")}
              <ArrowRight size={18} />
            </a>
            <Link
              href={localized("/curso")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/80 font-medium text-base hover:bg-white/10 hover:text-white transition-all"
            >
              {t("Conoce nuestro curso", "Explore our course")}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8 pt-2">
            {[
              { num: "40+", labelEs: "Productos entregados", labelEn: "Products delivered" },
              { num: "7", labelEs: "Países con clientes", labelEn: "Countries with clients" },
              { num: "100%", labelEs: "Remoto", labelEn: "Remote" },
            ].map((stat) => (
              <div key={stat.num} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-white">{stat.num}</span>
                <span className="text-sm text-white/50">{t(stat.labelEs, stat.labelEn)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY JOIN US ═══════════════════ */}
      <section className="py-24 px-6 bg-background" aria-labelledby="why-join-heading">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--magenta)] mb-4">
              <Heart size={14} />
              {t("Ventajas de unirte", "Benefits of joining")}
            </span>
            <h2 id="why-join-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
              {t(
                "¿Por qué unirte a la familia MediaLab?",
                "Why join the MediaLab family?"
              )}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                "No solo ofrecemos trabajo — ofrecemos un lugar donde tu talento crece, tu voz importa y tu diseño cambia vidas.",
                "We don't just offer a job — we offer a place where your talent grows, your voice matters, and your design changes lives."
              )}
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon
              return (
                <div
                  key={b.title}
                  className="group relative p-6 rounded-2xl border border-border bg-card hover:border-[var(--magenta)]/30 hover:shadow-lg hover:shadow-[var(--magenta)]/5 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--magenta)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--magenta)]/20 transition-colors">
                    <Icon size={22} className="text-[var(--magenta)]" />
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Culture images — workspace perspective: tools of the craft */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <Image
                src="/images/careers-remote-work.png"
                alt={t("Diseñadora UX trabajando remotamente", "UX Designer working remotely")}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-bold text-lg" style={{ color: "#fff" }}>{t("Trabaja desde tu lugar favorito", "Work from your favorite place")}</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{t("Flexibilidad real, no un slide de presentación", "Real flexibility, not a presentation slide")}</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <Image
                src="/images/careers-team-working.png"
                alt={t("Herramientas de diseño UX — el oficio del diseñador", "UX design tools — the designer's craft")}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-bold text-lg" style={{ color: "#fff" }}>{t("Diseñamos productos que dejan huella", "We design products that make an impact")}</span>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{t("UX, IA y sostenibilidad digital con propósito real", "UX, AI, and digital sustainability with real purpose")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONNECTION: COURSE + COMMUNITY ═══════════════════ */}
      <section className="py-20 px-6 bg-[var(--surface-mid)]" aria-labelledby="grow-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="grow-heading" className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight mb-4">
              {t("Crece con nosotros, dentro y fuera de la empresa", "Grow with us, inside and outside the company")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                "Como parte de MediaLab, tienes acceso exclusivo a nuestra plataforma de formación y a una comunidad activa de diseñadores que están redefiniendo UX con IA.",
                "As part of MediaLab, you get exclusive access to our training platform and an active community of designers redefining UX with AI."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Course card — with image */}
            <Link
              href={localized("/curso")}
              className="group relative rounded-2xl border border-border bg-card hover:border-[var(--magenta)]/40 transition-all duration-300 overflow-hidden"
            >
              {/* Image header */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/careers-course.png"
                  alt={t("Curso UX + IA en MediaLab", "UX + AI Course at MediaLab")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 careers-card-gradient" />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--magenta)]/90 flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="relative z-10 p-6 pt-2">
                <h3 className="font-bold text-xl text-foreground mb-3">
                  {t("Curso UX + IA", "UX + AI Course")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t(
                    "Acceso completo al programa de formación profesional en diseño UX con inteligencia artificial. Metodología propia, herramientas reales y certificación.",
                    "Full access to the professional UX design training program with artificial intelligence. Proprietary methodology, real tools, and certification."
                  )}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--magenta)] group-hover:gap-3 transition-all">
                  {t("Explorar el curso", "Explore the course")}
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            {/* Community card — with image */}
            <a
              href="https://wa.me/573144236970"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl border border-border bg-card hover:border-[var(--cyan)]/40 transition-all duration-300 overflow-hidden"
            >
              {/* Image header */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/careers-community.png"
                  alt={t("Comunidad de diseñadores UX + IA", "UX + AI designer community")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 careers-card-gradient" />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/90 flex items-center justify-center backdrop-blur-sm">
                    <Users size={20} className="text-white" />
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="relative z-10 p-6 pt-2">
                <h3 className="font-bold text-xl text-foreground mb-3">
                  {t("Comunidad UX + IA", "UX + AI Community")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t(
                    "Únete a nuestra comunidad activa de diseñadores. Compartimos recursos, oportunidades, workshops exclusivos y debatimos las últimas tendencias en UX e IA.",
                    "Join our active designer community. We share resources, opportunities, exclusive workshops, and discuss the latest UX and AI trends."
                  )}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cyan)] group-hover:gap-3 transition-all">
                  {t("Unirse a la comunidad", "Join the community")}
                  <ArrowRight size={16} />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ OPEN POSITIONS ═══════════════════ */}
      <section id="vacantes" className="py-24 px-6 bg-background" aria-labelledby="positions-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--magenta)] mb-4">
              <Briefcase size={14} />
              {t("Vacantes abiertas", "Open positions")}
            </span>
            <h2 id="positions-heading" className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight mb-4">
              {t("Encuentra tu próximo reto", "Find your next challenge")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                "Selecciona la vacante que más se ajuste a tu perfil para conocer los detalles y aplicar. Tiempo de respuesta: máximo 1 semana.",
                "Select the position that best fits your profile to learn more and apply. Response time: 1 week max."
              )}
            </p>
          </div>

          {/* Job listings */}
          {POSITIONS.map((pos) => {
            const isExpanded = expandedJob === pos.id
            const title = t(pos.titleEs, pos.titleEn)
            return (
              <div key={pos.id} className="mb-6">
                {/* Job card header */}
                <button
                  onClick={() => setExpandedJob(isExpanded ? null : pos.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    isExpanded
                      ? "border-[var(--magenta)]/40 bg-card shadow-lg shadow-[var(--magenta)]/5"
                      : "border-border bg-card hover:border-[var(--magenta)]/20 hover:shadow-md"
                  }`}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="font-bold text-xl text-foreground">{title}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-500 border border-green-500/20">
                          {t("Activa", "Active")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[var(--magenta)]" />
                          {t(pos.locationEs, pos.locationEn)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[var(--cyan)]" />
                          {t(pos.typeEs, pos.typeEn)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-[var(--orange)]" />
                          {t(pos.levelEs, pos.levelEn)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Wifi size={14} className="text-green-500" />
                          {t("Remoto", "Remote")}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border text-muted-foreground">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-1 p-6 md:p-8 rounded-2xl border border-[var(--magenta)]/20 bg-card/50 backdrop-blur-sm animate-fade-in-up">
                    {/* Description */}
                    <p className="text-foreground/80 leading-relaxed mb-8 text-pretty">
                      {t(pos.descEs, pos.descEn)}
                    </p>

                    {/* Response time badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 text-sm mb-8">
                      <Clock size={14} className="text-[var(--cyan)]" />
                      <span className="text-foreground/80 font-medium">
                        {t("Tiempo de respuesta: máximo 1 semana", "Response time: 1 week max")}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      {/* Responsibilities */}
                      <div>
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                          <Zap size={16} className="text-[var(--magenta)]" />
                          {t("Lo que harás", "What you'll do")}
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {(t("es", "en") === "es" ? pos.responsibilitiesEs : pos.responsibilitiesEn).map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                          <Star size={16} className="text-[var(--cyan)]" />
                          {t("Lo que buscamos", "What we look for")}
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {(t("es", "en") === "es" ? pos.requirementsEs : pos.requirementsEn).map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 size={16} className="text-[var(--cyan)] shrink-0 mt-0.5" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Nice to have */}
                    <div className="p-5 rounded-xl bg-[var(--magenta)]/5 border border-[var(--magenta)]/10 mb-8">
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles size={16} className="text-[var(--magenta)]" />
                        {t("Sería un plus si tienes...", "It would be a plus if you have...")}
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {(t("es", "en") === "es" ? pos.bonusEs : pos.bonusEn).map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-[var(--magenta)]">+</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Apply CTA */}
                    <button
                      onClick={() => handleApply(title)}
                      className="group w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25"
                    >
                      {t("Aplicar a esta vacante", "Apply to this position")}
                      <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════ APPLICATION FORM — POPUP MODAL ═══════════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-heading"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!sending) { setShowForm(false); setSubmitted(false) } }}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl cta-card-container no-scrollbar">
            {/* Background blobs */}
            <div
              className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none ambient-glow"
              style={{ background: "radial-gradient(circle, rgba(200,0,120,0.25), transparent 70%)", transform: "translate(-50%, -50%)" }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none ambient-glow"
              style={{ background: "radial-gradient(circle, rgba(0,200,220,0.15), transparent 70%)", transform: "translate(50%, 50%)" }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-5 sm:p-8 md:p-10">
              {/* Close button */}
              <button
                onClick={() => { if (!sending) { setShowForm(false); setSubmitted(false) } }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label={t("Cerrar formulario", "Close form")}
              >
                <X size={20} />
              </button>

              {submitted ? (
                /* ── Thank you state ── */
                <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
                  {/* Animated checkmark */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-fade-in-up">
                      <CheckCircle2 size={40} className="text-green-400" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-400/20 animate-ping" style={{ animationDuration: "2s" }} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-white">
                      {t("¡Gracias por tu postulación! 🎉", "Thanks for your application! 🎉")}
                    </h3>
                    <p className="text-white/60 text-sm max-w-sm mx-auto">
                      {t(
                        "Tu perfil ya está en manos de nuestro equipo de talento. Esto es lo que sigue:",
                        "Your profile is now with our talent team. Here's what happens next:"
                      )}
                    </p>
                  </div>

                  <ol className="flex flex-col gap-4 text-left w-full max-w-sm">
                    {[
                      {
                        es: "Revisaremos tu perfil, portafolio y tu historia UX con detalle.",
                        en: "We'll review your profile, portfolio and UX story in detail.",
                      },
                      {
                        es: "Te contactamos en máximo 1 semana.",
                        en: "We'll contact you within 1 week max.",
                      },
                      {
                        es: "Si tu perfil hace match, tendremos una conversación para conocerte y compartir nuestra visión.",
                        en: "If your profile is a match, we'll have a conversation to get to know you and share our vision.",
                      },
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[var(--magenta)]">{i + 1}</span>
                        <span className="pt-1">{t(s.es, s.en)}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-sm">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setSubmitted(false) }}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      {t("Volver a vacantes", "Back to positions")}
                    </button>
                    <Link
                      href={localized("/curso")}
                      onClick={() => { setShowForm(false); setSubmitted(false) }}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[var(--magenta)] text-white text-center hover:brightness-110 transition-all"
                    >
                      {t("Explorar el curso UX + IA", "Explore UX + AI course")}
                    </Link>
                  </div>
                </div>
              ) : (
                /* ── Application form ── */
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  {/* Form header */}
                  <div className="mb-1 pr-8">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--magenta)]/20 border border-[var(--magenta)]/30 text-xs font-semibold text-[var(--magenta)] mb-3">
                      <Briefcase size={12} />
                      {selectedPosition}
                    </span>
                    <h3 id="apply-heading" className="text-xl font-bold text-white">
                      {t("Cuéntanos sobre ti", "Tell us about yourself")}
                    </h3>
                    <p className="text-white/50 text-sm mt-1">
                      {t("Campos con * son requeridos. Respuesta en máximo 1 semana.", "Fields with * are required. Response within 1 week max.")}
                    </p>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="career-name" className="text-xs text-white/50 font-medium">
                      {t("Nombre completo", "Full name")} *
                    </label>
                    <input
                      id="career-name"
                      name="name"
                      type="text"
                      onChange={() => setErrors((p) => ({ ...p, name: "" }))}
                      placeholder={t("Tu nombre completo", "Your full name")}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                  </div>

                  {/* Phone + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="career-phone" className="text-xs text-white/50 font-medium">
                        {t("Teléfono / WhatsApp", "Phone / WhatsApp")} *
                      </label>
                      <input
                        id="career-phone"
                        name="phone"
                        type="tel"
                        onChange={() => setErrors((p) => ({ ...p, phone: "" }))}
                        placeholder={t("+57 300 000 0000", "+1 555 000 0000")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                      />
                      {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="career-email" className="text-xs text-white/50 font-medium">
                        {t("Correo electrónico", "Email")} *
                      </label>
                      <input
                        id="career-email"
                        name="email"
                        type="email"
                        onChange={() => setErrors((p) => ({ ...p, email: "" }))}
                        placeholder={t("tu@email.com", "you@email.com")}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                      />
                      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="career-linkedin" className="text-xs text-white/50 font-medium">
                      LinkedIn <span className="text-white/30">({t("opcional", "optional")})</span>
                    </label>
                    <div className="relative">
                      <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        id="career-linkedin"
                        name="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/tu-perfil"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Portfolio + Resume row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="career-portfolio" className="text-xs text-white/50 font-medium">
                        {t("Portafolio", "Portfolio")} <span className="text-white/30">({t("opcional", "optional")})</span>
                      </label>
                      <div className="relative">
                        <Palette size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          id="career-portfolio"
                          name="portfolio"
                          type="url"
                          placeholder={t("Link a tu portafolio", "Link to your portfolio")}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="career-resume" className="text-xs text-white/50 font-medium">
                        {t("Hoja de vida", "Resume / CV")} <span className="text-white/30">({t("opcional", "optional")})</span>
                      </label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          id="career-resume"
                          name="resume"
                          type="url"
                          placeholder={t("Link a tu hoja de vida", "Link to your resume")}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/60 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Biggest UX Challenge */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="career-challenge" className="text-xs text-white/50 font-medium">
                      {t("¿Cuál ha sido tu mayor reto en UX?", "What has been your biggest UX challenge?")} *
                    </label>
                    <textarea
                      id="career-challenge"
                      name="challenge"
                      rows={3}
                      onChange={() => setErrors((p) => ({ ...p, challenge: "" }))}
                      placeholder={t(
                        "Cuéntanos brevemente sobre un proyecto o situación donde aprendiste algo valioso como diseñador/a...",
                        "Briefly tell us about a project or situation where you learned something valuable as a designer..."
                      )}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--magenta)]/50 focus:ring-1 focus:ring-[var(--magenta)]/30 transition-all resize-none"
                    />
                    {errors.challenge && <p className="text-xs text-red-400">{errors.challenge}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="group flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] bg-[var(--magenta)] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[var(--magenta)]/25 disabled:opacity-70"
                  >
                    {sending ? (
                      t("Enviando postulación...", "Sending application...")
                    ) : (
                      <>
                        {t("Enviar mi postulación", "Submit my application")}
                        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-white/40 text-center">
                    {t(
                      "Tu información será tratada con confidencialidad. Lee nuestra ",
                      "Your information will be treated confidentially. Read our "
                    )}
                    <Link href={localized("/politica-de-privacidad")} className="text-[var(--cyan)]/70 hover:text-[var(--cyan)] underline transition-colors">
                      {t("Política de Privacidad", "Privacy Policy")}
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
