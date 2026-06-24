"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { TrendingUp, Users, Clock, Target, Zap, BarChart3, Package, Globe, Smartphone, PlayCircle, ChevronDown, Volume2, VolumeX, Play, ExternalLink, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type Category = "todos" | "web-design" | "mobile-app" | "ia" | "branding"

type MediaKind = "web" | "mobile" | "video"
type GalleryItem = { kind: MediaKind; src: string; fit?: "cover" | "contain"; label?: string }

function CaseVideo({ src }: { src: string }) {
  const vref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(0.6)
  const { t } = useLanguage()

  useEffect(() => {
    const v = vref.current
    if (v) { v.volume = volume; v.muted = muted }
  }, [volume, muted])

  const togglePlay = () => {
    const v = vref.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  const toggleMute = () => setMuted((m) => {
    const next = !m
    if (!next && volume === 0) setVolume(0.6)
    return next
  })

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    setMuted(val === 0)
  }

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={togglePlay}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={vref} src={src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />

      {/* Indicador cuando está en pausa */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
            <Play size={26} className="ml-1" />
          </span>
        </div>
      )}

      {/* Control de volumen */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={toggleMute} aria-label={t("Activar/silenciar sonido", "Toggle sound")} className="text-[#fff]/90 hover:text-[#fff] transition-colors">
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range" min={0} max={1} step={0.05}
          value={muted ? 0 : volume}
          onChange={onVolume}
          aria-label={t("Volumen", "Volume")}
          className="w-16 h-1 accent-white cursor-pointer"
        />
      </div>
    </div>
  )
}

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
  footnote?: string
  customImage?: React.ReactNode
  gallery?: GalleryItem[]
  liveLinks?: { label: string; url: string }[]
  results: { icon: React.ElementType; value: string; label: string }[]
  tags: string[]
  categories: Category[]
  usedUxbox: boolean
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const { t } = useLanguage()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("Cerrar", "Close")}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#fff] flex items-center justify-center transition-colors"
      >
        <X size={20} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[94vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-fade-in-up"
      />
    </div>,
    document.body
  )
}

function CaseCard({ c, i, visible, labels, open, onToggle }: { c: CaseItem; i: number; visible: boolean; labels: { challenge: string; solution: string; seeChallenge: string; hide: string }; open: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [zoom, setZoom] = useState<string | null>(null)
  const { t } = useLanguage()

  const gallery = c.gallery ?? []
  const [activeIdx, setActiveIdx] = useState(0)

  const kindMeta: Record<MediaKind, { icon: React.ElementType; label: string }> = {
    web: { icon: Globe, label: c.id === "bellanova" ? t("Web Clínica", "Clinic Web") : t("Web", "Web") },
    mobile: { icon: c.id === "bellanova" ? Users : Smartphone, label: c.id === "bellanova" ? t("Dr. Menéndez", "Dr. Menéndez") : t("Móvil", "Mobile") },
    video: { icon: PlayCircle, label: t("Video", "Video") },
  }

  const current = gallery[activeIdx]

  return (
    <div
      id={c.id}
      className={`group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border bg-card transition-all duration-700 hover:border-transparent hover:shadow-2xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${i * 150}ms`, boxShadow: hovered ? `0 30px 60px -15px ${c.color}22` : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media */}
      <div
        className={`relative aspect-[16/11] md:aspect-auto overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}
        style={{ background: c.gradient }}
      >
        {current ? (
          current.kind === "video" ? (
            <CaseVideo src={current.src} />
          ) : (
            <Image
              key={current.src}
              src={current.src}
              alt={`${c.title} — ${kindMeta[current.kind].label}`}
              fill
              onClick={() => setZoom(current.src)}
              className={`cursor-zoom-in object-top transition-transform duration-700 ${
                (current.fit ?? (current.kind === "mobile" ? "contain" : "cover")) === "contain"
                  ? "object-contain p-2"
                  : "object-cover group-hover:scale-105"
              }`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )
        ) : c.customImage ? (
          c.customImage
        ) : (
          <Image src={c.image} alt={c.title} fill onClick={() => setZoom(c.image)} className="cursor-zoom-in object-cover object-top transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        )}

        {/* Decorative gradient (keeps badge legible) */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to ${i % 2 === 1 ? "left" : "right"}, ${c.color}30, transparent)` }} />

        {/* Industry badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border" style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: "white" }}>
            {c.industry}
          </span>
          {c.usedUxbox && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md border border-[var(--orange)]/40 bg-[var(--orange)]/20 text-[#fff]">
              <Package size={10} /> UXBox
            </span>
          )}
        </div>

        {/* Pestañas — una por vista (esquina inferior izquierda) */}
        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {gallery.map((item, gi) => {
              const Meta = kindMeta[item.kind]
              const isActive = gi === activeIdx
              return (
                <button
                  key={`${item.src}-${gi}`}
                  type="button"
                  onClick={() => setActiveIdx(gi)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-md border transition-all ${isActive ? "text-[#fff] shadow-lg" : "text-[#fff]/80 border-white/20 bg-black/30 hover:bg-black/40"}`}
                  style={isActive ? { background: `${c.color}`, borderColor: `${c.color}` } : undefined}
                >
                  <Meta.icon size={12} /> {item.label ?? Meta.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 md:p-8 lg:p-10">
        {/* Client label */}
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: c.color }}>{c.client}</span>

        <h3 className="font-display font-bold text-2xl lg:text-3xl text-foreground leading-tight">{c.title}</h3>

        {/* Toggle — solo móvil */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="md:hidden flex w-full items-center justify-between gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-all"
          style={{ color: c.color, borderColor: `${c.color}40`, background: `${c.color}12` }}
        >
          {open ? labels.hide : labels.seeChallenge}
          <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Collapsible content — acordeón en móvil, siempre abierto en desktop */}
        <div className={`grid transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[1fr] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-5 pt-1">
              {/* Challenge & Solution */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{labels.challenge}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.challenge}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: c.color }}>{labels.solution}</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{c.solution}</p>
                  {c.footnote && (
                    <p className="mt-2 text-[11px] italic text-muted-foreground/70 leading-snug">{c.footnote}</p>
                  )}
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

              {/* Sitios en vivo */}
              {c.liveLinks && c.liveLinks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {c.liveLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:brightness-110"
                      style={{ color: c.color, borderColor: `${c.color}40`, background: `${c.color}12` }}
                    >
                      <ExternalLink size={13} /> {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {zoom && <Lightbox src={zoom} alt={c.title} onClose={() => setZoom(null)} />}
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
      id: "crea-adn",
      title: t("Plataforma de Capacitación Interactiva", "Interactive Training Platform"),
      client: "Crea ADN",
      industry: t("FMCG / Enterprise", "FMCG / Enterprise"),
      image: "/images/Portafolio/ADN/adn-heel.png",
      color: "var(--cyan)",
      gradient: "linear-gradient(135deg, #004B93, #0066CC)",
      gallery: [
        { kind: "mobile", src: "/images/Portafolio/ADN/adn-heel.png", fit: "cover", label: "Heel" },
        { kind: "mobile", src: "/images/Portafolio/ADN/adn-alpina-v2.png", fit: "cover", label: "Alpina Ecuador" },
        { kind: "mobile", src: "/images/Portafolio/ADN/adn-abbott.png", fit: "cover", label: "Abbott" },
        { kind: "mobile", src: "/images/Portafolio/ADN/adn-pepsico-v2.png", fit: "cover", label: "Pepsico" },
      ],
      challenge: t(
        "Junto a Andrés Cadena, autor de Rompiendo Hábitos, desarrollamos una plataforma de aprendizaje para fortalecer las habilidades comerciales de equipos de ventas en empresas como Abbott, Heel, PepsiCo y Alpina, mediante una experiencia digital que incrementara el compromiso y permitiera medir el desempeño de los participantes.",
        "Together with Andrés Cadena, author of Rompiendo Hábitos, we developed a learning platform to strengthen the commercial skills of sales teams at companies like Abbott, Heel, PepsiCo, and Alpina — through a digital experience that boosts engagement and makes it possible to measure participants' performance."
      ),
      solution: t(
        "Diseñamos una plataforma de aprendizaje gamificada con rutas de formación, evaluaciones, retos, logros y recompensas que convierten la capacitación en una experiencia interactiva. La solución permite gestionar programas de entrenamiento a gran escala y hacer seguimiento al progreso de cada usuario de forma intuitiva.",
        "We designed a gamified learning platform with training paths, assessments, challenges, achievements, and rewards that turn training into an interactive experience. The solution makes it possible to manage large-scale training programs and track each user's progress intuitively."
      ),
      footnote: t(
        "Metodología basada en el libro Rompiendo Hábitos de Andrés Cadena.",
        "Methodology based on Andrés Cadena's book Rompiendo Hábitos."
      ),
      results: [
        { icon: Package, value: "4", label: t("Marcas desplegadas", "Brands deployed") },
        { icon: Users, value: "+500", label: t("Usuarios capacitados", "Users trained") },
        { icon: TrendingUp, value: "+85%", label: t("Tasa de completación", "Completion rate") },
      ],
      tags: ["UX Research", "Prototype", "User Testing", "Development"],
      categories: ["mobile-app"],
      liveLinks: [
        { label: t("Rompiendo Hábitos (Amazon)", "Rompiendo Hábitos (Amazon)"), url: "https://www.amazon.com/dp/B08FVSKLQK" },
      ],
      usedUxbox: false,
    },
    {
      id: "montaner",
      title: t("Presencia Digital Multi-plataforma", "Multi-Platform Digital Presence"),
      client: "Ricardo Montaner",
      industry: t("Entretenimiento", "Entertainment"),
      image: "/images/Portafolio/Montaner/montaner-web.png",
      color: "var(--magenta)",
      gradient: "linear-gradient(135deg, #12020A, #2C0519)",
      gallery: [
        { kind: "web", src: "/images/Portafolio/Montaner/montaner-web.png" },
        { kind: "mobile", src: "/images/Portafolio/Montaner/montaner-mobile.png", fit: "cover" },
      ],
      challenge: t(
        "Con el lanzamiento de \"Yo No Fumo\", Ricardo Montaner necesitaba una experiencia digital que transmitiera la esencia emocional del sencillo y fortaleciera la conexión entre el artista y sus seguidores. El desafío consistía en integrar música, contenido exclusivo y fechas de la gira dentro de una plataforma inmersiva, elegante y fácil de explorar.",
        "With the release of \"Yo No Fumo,\" Ricardo Montaner needed a digital experience that conveyed the emotional essence of the single and strengthened the connection between the artist and his followers. The challenge was to integrate music, exclusive content, and tour dates within an immersive, elegant, and easy-to-explore platform."
      ),
      solution: t(
        "Diseñamos una experiencia digital premium centrada en el universo de \"Yo No Fumo\", desarrollando un sitio web inmersivo con una navegación intuitiva que integra música, discografía, letras, giras y contenido exclusivo. Cada interacción fue pensada para amplificar la identidad artística de Ricardo Montaner y generar una conexión emocional con sus fans.",
        "We designed a premium digital experience centered on the world of \"Yo No Fumo,\" building an immersive website with intuitive navigation that integrates music, discography, lyrics, tours, and exclusive content. Every interaction was crafted to amplify Ricardo Montaner's artistic identity and create an emotional connection with his fans."
      ),
      results: [
        { icon: Zap, value: t("Premium", "Premium"), label: t("Experiencia visual", "Visual experience") },
        { icon: Users, value: "Multi", label: t("Plataformas conectadas", "Connected platforms") },
        { icon: Target, value: "100%", label: t("Alineación de marca", "Brand alignment") },
      ],
      tags: ["Web Design", "UX/UI", "Prototype", "Development"],
      categories: ["web-design", "mobile-app"],
      usedUxbox: false,
    },
    {
      id: "bellanova",
      title: t("Experiencia Digital de Lujo para Clínica Estética", "Luxury Digital Experience for Aesthetic Clinic"),
      client: "Bellanova Clinic",
      industry: t("Salud & Belleza", "Health & Beauty"),
      image: "/images/Portafolio/Bellanova/bellanova-web.png",
      color: "var(--orange)",
      gradient: "linear-gradient(135deg, #021a14, #083c30)",
      gallery: [
        { kind: "web", src: "/images/Portafolio/Bellanova/bellanova-web.png" },
        { kind: "mobile", src: "/images/Portafolio/Bellanova/bellanova-menendez.png", fit: "cover" },
        { kind: "video", src: "/images/Portafolio/Bellanova/VideoMarca.mp4" },
      ],
      challenge: t(
        "Bellanova Clinic necesitaba una experiencia digital que reflejara la calidad, confianza y exclusividad de sus servicios, diferenciando la marca y generando credibilidad desde el primer contacto.",
        "Bellanova Clinic needed a digital experience that reflected the quality, trust, and exclusivity of its services — setting the brand apart and building credibility from the very first interaction."
      ),
      solution: t(
        "Diseñamos una experiencia digital elegante e intuitiva que combina estrategia, usabilidad y diseño para destacar cada procedimiento y facilitar la conversión de nuevos pacientes. El resultado es un sitio web que fortalece la marca y transmite confianza en cada interacción.",
        "We designed an elegant, intuitive digital experience that blends strategy, usability, and design to highlight every procedure and drive new-patient conversion. The result is a website that strengthens the brand and conveys trust at every interaction."
      ),
      results: [
        { icon: TrendingUp, value: "+200%", label: t("Tráfico orgánico", "Organic traffic") },
        { icon: Target, value: t("Premium", "Premium"), label: t("Percepción de marca", "Brand perception") },
        { icon: Clock, value: t("8 sem", "8 wks"), label: t("Tiempo de entrega", "Delivery time") },
      ],
      tags: ["Web Design", "Prototype", "User Testing", "Development"],
      categories: ["web-design", "branding"],
      liveLinks: [
        { label: "clinicabellanova.net", url: "https://clinicabellanova.net/" },
        { label: "jpmenendez.com", url: "https://jpmenendez.com/" },
      ],
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

  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = filter === "todos"
    ? cases
    : cases.filter((c) => c.categories.includes(filter))

  const cardLabels = {
    challenge: t("El reto", "The challenge"),
    solution: t("Nuestra solución", "Our solution"),
    seeChallenge: t("Ver el reto", "See the challenge"),
    hide: t("Ocultar", "Hide"),
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
          {filtered.map((c, i) => (
            <CaseCard
              key={c.id}
              c={c}
              i={i}
              visible={visible}
              labels={cardLabels}
              open={openId === c.id}
              onToggle={() => setOpenId((prev) => (prev === c.id ? null : c.id))}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t("No hay casos en esta categoría aún.", "No case studies in this category yet.")}</p>
          )}
        </div>
      </div>
    </section>
  )
}
