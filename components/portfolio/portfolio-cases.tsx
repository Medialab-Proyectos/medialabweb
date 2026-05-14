"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight, TrendingUp, Users, Clock, Target, Zap, BarChart3, Package } from "lucide-react"

type Category = "todos" | "uxbox" | "ux-ui" | "ia" | "desarrollo"

const categories: { id: Category; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "uxbox", label: "UXBox" },
  { id: "ux-ui", label: "UX/UI" },
  { id: "ia", label: "IA" },
  { id: "desarrollo", label: "Desarrollo" },
]

const cases = [
  {
    id: "fintech-b2c",
    title: "Plataforma de Finanzas Conductuales",
    client: "Startup FinTech B2C",
    industry: "FinTech",
    image: "/images/case-fintech.png",
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, #E8751A, #c65a10)",
    challenge: "Los usuarios abandonaban el onboarding al 65%. La app no conectaba emocionalmente con personas en situación de deuda — generaba culpa en lugar de motivación.",
    solution: "Rediseñamos la experiencia completa aplicando psicología conductual. Creamos un onboarding empático con micro-recompensas, gamificación emocional y un sistema de metas visuales que celebra el progreso.",
    results: [
      { icon: TrendingUp, value: "+180%", label: "Retención a 30 días" },
      { icon: Users, value: "65→12%", label: "Abandono en onboarding" },
      { icon: Clock, value: "6 sem", label: "Tiempo de entrega" },
    ],
    tags: ["UX Research", "Diseño Conductual", "Mobile App", "IA"],
    categories: ["ux-ui", "ia"] as Category[],
    usedUxbox: false,
    testimonial: { quote: "MediaLab transformó nuestro producto. Pasamos de una app que la gente desinstalaba a una que recomiendan a sus amigos.", author: "María R.", role: "CPO" },
  },
  {
    id: "saas-b2b",
    title: "Dashboard Enterprise para Gestión de Activos",
    client: "Enterprise SaaS B2B",
    industry: "Banca & Finanzas",
    image: "/images/case-saas.png",
    color: "var(--cyan)",
    gradient: "linear-gradient(135deg, #2AABB3, #1d8a91)",
    challenge: "Un dashboard B2B con +200 funciones que nadie encontraba. Los usuarios corporativos tardaban 3 semanas en ser productivos. El churn estaba en 22% anual.",
    solution: "Simplificamos la arquitectura de información usando card sorting con 40 usuarios reales. Implementamos roles contextuales, búsqueda inteligente y un sistema de onboarding progresivo.",
    results: [
      { icon: Target, value: "-60%", label: "Tiempo de aprendizaje" },
      { icon: TrendingUp, value: "22→8%", label: "Churn anual" },
      { icon: BarChart3, value: "+40%", label: "Activación de features" },
    ],
    tags: ["UX Enterprise", "Design System", "Dashboard", "B2B"],
    categories: ["ux-ui", "desarrollo"] as Category[],
    usedUxbox: false,
    testimonial: { quote: "Su expertise en psicología del consumidor nos ayudó a aumentar la activación de usuarios B2C en 40%.", author: "Carlos M.", role: "Head of Product" },
  },
  {
    id: "movilidad-b2b2c",
    title: "Red de Carga Eléctrica — App + Dashboard",
    client: "Movilidad Sustentable",
    industry: "Movilidad",
    image: "/images/case-mobility.png",
    color: "var(--orange)",
    gradient: "linear-gradient(135deg, #E8751A, #d4851f)",
    challenge: "Dos audiencias opuestas: conductores B2C que necesitan encontrar estaciones rápido, y operadores B2B que necesitan monitorear su red en tiempo real.",
    solution: "Usamos UXBox para comprimir el discovery de dos audiencias opuestas en 5 días. Diseñamos dos experiencias conectadas: una app B2C con UX tipo Google Maps optimizada para urgencia, y un dashboard B2B con alertas inteligentes y analítica predictiva.",
    results: [
      { icon: Zap, value: "4.8★", label: "Rating en App Store" },
      { icon: Users, value: "+320%", label: "Usuarios activos mensuales" },
      { icon: Clock, value: "8 sem", label: "De idea a producción" },
    ],
    tags: ["UXBox", "Mobile App", "Dashboard B2B", "Maps"],
    categories: ["uxbox", "ux-ui", "desarrollo"] as Category[],
    usedUxbox: true,
    testimonial: { quote: "UXBox nos dio la claridad que nunca habíamos tenido. Pasamos de ideas vagas a un roadmap validado en días.", author: "Ana T.", role: "Founder & CEO" },
  },
  {
    id: "ecommerce-b2c",
    title: "Rediseño de E-commerce con IA Conversacional",
    client: "Marca de Retail B2C",
    industry: "E-commerce",
    image: "/images/case-ecommerce.png",
    color: "var(--magenta)",
    gradient: "linear-gradient(135deg, #E8751A, oklch(0.45 0.24 300))",
    challenge: "Tasa de conversión del 1.2% en un e-commerce con +5,000 SKUs. Los usuarios se perdían en el catálogo y abandonaban el carrito al 78%.",
    solution: "UXBox identificó los 3 puntos de fricción principales en 48 horas. Integramos un asistente de IA conversacional, rediseñamos el flujo de checkout en 3 pasos, y creamos un sistema de recomendación visual basado en comportamiento de navegación.",
    results: [
      { icon: TrendingUp, value: "1.2→3.8%", label: "Conversión" },
      { icon: Target, value: "-45%", label: "Abandono de carrito" },
      { icon: BarChart3, value: "+62%", label: "Ticket promedio" },
    ],
    tags: ["UXBox", "IA Conversacional", "CRO", "E-commerce"],
    categories: ["uxbox", "ia", "desarrollo"] as Category[],
    usedUxbox: true,
    testimonial: { quote: "El asistente IA que diseñaron aumentó nuestro ticket promedio en 62%. Los clientes sienten que la tienda los entiende.", author: "Laura S.", role: "CMO" },
  },
]

function CaseCard({ c, i, visible }: { c: typeof cases[0]; i: number; visible: boolean }) {
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
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">El reto</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.challenge}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: c.color }}>Nuestra solución</span>
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

        {/* Inline testimonial */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: c.gradient }}>
            {c.testimonial.author.split(" ").map(w => w[0]).join("")}
          </div>
          <div>
            <p className="text-sm text-foreground italic leading-relaxed">&ldquo;{c.testimonial.quote}&rdquo;</p>
            <p className="text-xs text-muted-foreground mt-1">{c.testimonial.author}, {c.testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PortfolioCases() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [filter, setFilter] = useState<Category>("todos")

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const filtered = filter === "todos"
    ? cases
    : cases.filter((c) => c.categories.includes(filter))

  return (
    <section id="cases" ref={ref} className="py-24 px-6 bg-background" aria-labelledby="cases-heading">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">Casos de éxito</span>
          <h2 id="cases-heading" className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground text-balance">
            Cada proyecto tiene una historia. Estas son las que más nos enorgullecen.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Productos reales en producción, con usuarios reales y resultados medibles.
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
              {cat.id === "uxbox" && <Package size={12} className="inline mr-1.5 -mt-0.5" />}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {filtered.map((c, i) => <CaseCard key={c.id} c={c} i={i} visible={visible} />)}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No hay casos en esta categoría aún.</p>
          )}
        </div>
      </div>
    </section>
  )
}
