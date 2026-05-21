"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { TrendingUp, Users, Clock, Target, Zap, BarChart3, Package } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type Category = "todos" | "web-design" | "mobile-app" | "ia" | "branding"

type CaseItem = {
  id: string
  title: string
  client: string
  industry: string
  image: string
  color: string
  gradient: string
  challenge: string
  solution: string
  results: { icon: React.ElementType; value: string; label: string }[]
  tags: string[]
  categories: Category[]
  usedUxbox: boolean
}

function CaseCard({ c, i, visible, labels }: { c: CaseItem; i: number; visible: boolean; labels: { challenge: string; solution: string } }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      id={c.id}
      className={`group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border bg-card transition-all duration-700 hover:border-transparent hover:shadow-2xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${i * 150}ms`, boxShadow: hovered ? `0 30px 60px -15px ${c.color}22` : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className={`relative aspect-[16/11] md:aspect-auto overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
        <Image src={c.image} alt={c.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to ${i % 2 === 1 ? "left" : "right"}, ${c.color}30, transparent)` }} />
        {/* Industry badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border" style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: "white" }}>
            {c.industry}
          </span>
          {c.usedUxbox && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md border border-[var(--orange)]/40 bg-[var(--orange)]/20 text-white">
              <Package size={10} /> UXBox
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 p-8 lg:p-10">
        {/* Client label */}
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: c.color }}>{c.client}</span>

        <h3 className="font-display font-bold text-2xl lg:text-3xl text-foreground leading-tight">{c.title}</h3>

        {/* Challenge & Solution */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{labels.challenge}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.challenge}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: c.color }}>{labels.solution}</span>
            <p className="text-sm text-foreground/80 leading-relaxed">{c.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
          {c.results.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.label} className="flex flex-col items-center gap-1 text-center">
                <Icon size={16} style={{ color: c.color }} />
                <span className="font-display font-bold text-lg" style={{ color: c.color }}>{r.value}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{r.label}</span>
              </div>
            )
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {c.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">{tag}</span>
          ))}
        </div>

      </div>
    </div>
  )
}

export function PortfolioCases() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [filter, setFilter] = useState<Category>("todos")
  const { t } = useLanguage()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const categories: { id: Category; label: string }[] = [
    { id: "todos", label: t("Todos", "All") },
    { id: "web-design", label: t("Web Design", "Web Design") },
    { id: "mobile-app", label: t("Mobile Apps", "Mobile Apps") },
    { id: "ia", label: t("IA & Data", "AI & Data") },
    { id: "branding", label: t("Branding", "Branding") },
  ]

  const cases: CaseItem[] = [
    {
      id: "pepsico",
      title: t("Plataforma de Capacitación Interactiva", "Interactive Training Platform"),
      client: "Pepsico",
      industry: t("FMCG / Enterprise", "FMCG / Enterprise"),
      image: "/images/case-fintech.png",
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, #004B93, #0066CC)",
      challenge: t(
        "Pepsico necesitaba una solución avanzada para capacitar a su fuerza de ventas a gran escala, con seguimiento de progreso y evaluación de desempeño en tiempo real.",
        "Pepsico needed an advanced solution to train its sales force at scale, with progress tracking and real-time performance evaluation."
      ),
      solution: t(
        "Desarrollamos una aplicación interactiva con videos educativos, juegos y un sistema de tracking que monitorea los materiales vistos y evalúa el rendimiento de los usuarios. La plataforma soporta múltiples roles — asesores y participantes — con herramientas específicas para gestionar el aprendizaje.",
        "We built an interactive application with educational videos, games, and a tracking system that monitors viewed material and evaluates user performance. The platform supports multiple roles — advisors and participants — with dedicated tools to manage learning."
      ),
      results: [
        { icon: Users, value: "+500", label: t("Usuarios capacitados", "Users trained") },
        { icon: TrendingUp, value: "+85%", label: t("Tasa de completación", "Completion rate") },
        { icon: Clock, value: t("12 sem", "12 wks"), label: t("Tiempo de entrega", "Delivery time") },
      ],
      tags: ["UX Research", "Prototype", "User Testing", "Development"],
      categories: ["mobile-app"],
      usedUxbox: false,
    },
    {
      id: "montaner",
      title: t("Presencia Digital Multi-plataforma", "Multi-Platform Digital Presence"),
      client: "Ricardo Montaner",
      industry: t("Entretenimiento", "Entertainment"),
      image: "/images/case-saas.png",
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, #8B1A4A, #C62E65)",
      challenge: t(
        "Crear una presencia digital cohesiva para Ricardo Montaner a través de múltiples plataformas, con un sitio web visualmente impactante e innovador que refleje la esencia del artista.",
        "Build a cohesive digital presence for Ricardo Montaner across multiple platforms, with a visually striking and innovative website that captures the artist's essence."
      ),
      solution: t(
        "Diseñamos un sitio web visualmente impresionante para exhibir su discografía con una experiencia de usuario intuitiva y atractiva. Además, creamos el sitio web oficial del artista, alineado con su imagen para crear una plataforma visualmente cautivadora que garantiza navegación fluida y participación activa.",
        "We designed a stunning website to showcase his discography with an intuitive, engaging user experience. We also created the artist's official site, aligned with his brand image to deliver a visually captivating platform that ensures smooth navigation and active engagement."
      ),
      results: [
        { icon: Zap, value: t("Premium", "Premium"), label: t("Experiencia visual", "Visual experience") },
        { icon: Users, value: "Multi", label: t("Plataformas conectadas", "Connected platforms") },
        { icon: Target, value: "100%", label: t("Alineación de marca", "Brand alignment") },
      ],
      tags: ["Web Design", "UX/UI", "Prototype", "Development"],
      categories: ["web-design"],
      usedUxbox: false,
    },
    {
      id: "bellanova",
      title: t("Experiencia Digital de Lujo para Clínica Estética", "Luxury Digital Experience for Aesthetic Clinic"),
      client: "Bellanova Clinic",
      industry: t("Salud & Belleza", "Health & Beauty"),
      image: "/images/case-mobility.png",
      color: "var(--orange)",
      gradient: "linear-gradient(135deg, #C8956C, #A67548)",
      challenge: t(
        "Bellanova Clinic necesitaba una experiencia digital que reflejara la excelencia y exclusividad de sus servicios estéticos, generando confianza inmediata en pacientes potenciales.",
        "Bellanova Clinic needed a digital experience that reflected the excellence and exclusivity of its aesthetic services, generating immediate trust with prospective patients."
      ),
      solution: t(
        "Creamos una experiencia digital lujosa con un diseño web intuitivo y elegante que destaca la amplia gama de servicios. El diseño refuerza la presencia online de la clínica y construye confianza con los pacientes a través de cada punto de contacto.",
        "We crafted a luxury digital experience with an intuitive, elegant web design that highlights the wide range of services. The design reinforces the clinic's online presence and builds trust with patients at every touchpoint."
      ),
      results: [
        { icon: TrendingUp, value: "+200%", label: t("Tráfico orgánico", "Organic traffic") },
        { icon: Target, value: t("Premium", "Premium"), label: t("Percepción de marca", "Brand perception") },
        { icon: Clock, value: t("8 sem", "8 wks"), label: t("Tiempo de entrega", "Delivery time") },
      ],
      tags: ["Web Design", "Prototype", "User Testing", "Development"],
      categories: ["web-design", "branding"],
      usedUxbox: false,
    },
    {
      id: "spectrum",
      title: t("Transformación Digital Integral", "End-to-End Digital Transformation"),
      client: "Spectrum Aesthetics",
      industry: t("Cirugía Plástica", "Plastic Surgery"),
      image: "/images/case-ecommerce.png",
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, #2AABB3, #1d8a91)",
      challenge: t(
        "Spectrum Aesthetics, clínica de cirugía plástica en Miami, necesitaba alcanzar mejor a su audiencia objetivo. Su imagen requería una renovación completa: sitio web, SEO y contenido en redes sociales.",
        "Spectrum Aesthetics, a Miami plastic surgery clinic, needed to better reach its target audience. Their image required a full refresh: website, SEO, and social media content."
      ),
      solution: t(
        "Ejecutamos un proyecto integral: renovamos la imagen de marca, rediseñamos el sitio web para mejor funcionalidad, optimizamos el SEO para mayor visibilidad en buscadores, y ajustamos el contenido en redes sociales para atraer a los clientes correctos.",
        "We executed an integrated project: refreshed the brand image, redesigned the website for better functionality, optimized SEO for higher search visibility, and tuned social media content to attract the right clients."
      ),
      results: [
        { icon: TrendingUp, value: "+150%", label: t("Visibilidad SEO", "SEO visibility") },
        { icon: Users, value: "+90%", label: t("Engagement social", "Social engagement") },
        { icon: BarChart3, value: "+120%", label: t("Leads calificados", "Qualified leads") },
      ],
      tags: ["Branding", "Web Design", "SEO", "Social Media"],
      categories: ["web-design", "branding"],
      usedUxbox: false,
    },
    {
      id: "ginseng",
      title: t("Análisis de Reportes Médicos con Machine Learning", "Medical Report Analysis with Machine Learning"),
      client: "Ginseng",
      industry: t("HealthTech & IA", "HealthTech & AI"),
      image: "/images/case-fintech.png",
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, #6B21A8, #9333EA)",
      challenge: t(
        "Se requería una aplicación especializada para el análisis integral de reportes médicos, con enfoque en evaluaciones de cobertura para casos relacionados con cáncer.",
        "A specialized application was needed for comprehensive medical report analysis, focused on coverage evaluations for cancer-related cases."
      ),
      solution: t(
        "Desarrollamos una aplicación especializada integrando Machine Learning para potenciar las capacidades analíticas. El sistema procesa y analiza reportes médicos complejos, proporcionando evaluaciones de cobertura precisas y accionables para casos oncológicos.",
        "We built a specialized application integrating Machine Learning to amplify analytical capabilities. The system processes and analyzes complex medical reports, delivering precise and actionable coverage evaluations for oncology cases."
      ),
      results: [
        { icon: Zap, value: "ML", label: t("Machine Learning integrado", "Machine Learning integrated") },
        { icon: Target, value: "95%+", label: t("Precisión de análisis", "Analysis accuracy") },
        { icon: Clock, value: "10x", label: t("Más rápido que manual", "Faster than manual") },
      ],
      tags: ["Machine Learning", "Prototype", "User Testing", "IA"],
      categories: ["ia", "mobile-app"],
      usedUxbox: false,
    },
    {
      id: "fusapp",
      title: t("App de Gestión de Riesgos Industriales", "Industrial Risk Management App"),
      client: "FusApp",
      industry: t("Industria & Seguridad", "Industry & Safety"),
      image: "/images/case-saas.png",
      color: "var(--orange)",
      gradient: "linear-gradient(135deg, #DC2626, #EF4444)",
      challenge: t(
        "El sector industrial necesitaba una herramienta móvil para optimizar la gestión de riesgos, capacitación del personal y generación de cotizaciones dentro del sistema eléctrico.",
        "The industrial sector needed a mobile tool to optimize risk management, staff training, and quote generation within the electrical system."
      ),
      solution: t(
        "Desarrollamos una aplicación móvil completa que permite crear tareas dentro del sistema eléctrico, capacitar al personal con módulos interactivos, y generar cotizaciones para productos o servicios. Todo integrado en un flujo de trabajo eficiente y seguro.",
        "We built a full mobile application that lets users create tasks within the electrical system, train staff with interactive modules, and generate quotes for products or services. Everything integrated into an efficient, secure workflow."
      ),
      results: [
        { icon: TrendingUp, value: "+70%", label: t("Eficiencia operativa", "Operational efficiency") },
        { icon: Users, value: t("Multi-rol", "Multi-role"), label: t("Gestión de usuarios", "User management") },
        { icon: BarChart3, value: "360°", label: t("Gestión integral", "Integrated management") },
      ],
      tags: ["Mobile App", "UX Research", "Development", "User Testing"],
      categories: ["mobile-app"],
      usedUxbox: false,
    },
  ]

  const filtered = filter === "todos"
    ? cases
    : cases.filter((c) => c.categories.includes(filter))

  const cardLabels = {
    challenge: t("El reto", "The challenge"),
    solution: t("Nuestra solución", "Our solution"),
  }

  return (
    <section id="cases" ref={ref} className="py-24 px-6 bg-background" aria-labelledby="cases-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">{t("Casos de éxito", "Case studies")}</span>
          <h2 id="cases-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            {t("Cada proyecto tiene una historia. Estas son las que más nos enorgullecen.", "Every project has a story. These are the ones we're proudest of.")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("Productos reales en producción, con usuarios reales y resultados medibles.", "Real products in production, with real users and measurable results.")}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                filter === cat.id
                  ? "border-[var(--magenta)]/30 bg-[var(--magenta)]/10 text-[var(--magenta)]"
                  : "border-border bg-card text-muted-foreground hover:border-[var(--magenta)]/20 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {filtered.map((c, i) => <CaseCard key={c.id} c={c} i={i} visible={visible} labels={cardLabels} />)}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t("No hay casos en esta categoría aún.", "No case studies in this category yet.")}</p>
          )}
        </div>
      </div>
    </section>
  )
}
