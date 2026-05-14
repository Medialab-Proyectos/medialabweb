import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog de UX, IA y Producto Digital",
  description:
    "Ideas sobre diseño UX, inteligencia artificial, psicología del consumidor y productos digitales B2B/B2C por MediaLab Ingeniería. Lecturas para fundadores, diseñadores y product managers.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog MediaLab — UX, IA y Producto Digital",
    description: "Artículos firmados sobre diseño consciente, IA aplicada al producto y comportamiento humano.",
    type: "website",
    url: "/blog",
  },
}

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog MediaLab Ingeniería",
  url: "https://medialab.design/blog",
  description: "Artículos sobre UX, IA y diseño de productos digitales B2B/B2C.",
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  inLanguage: "es-CO",
}

const articles = [
  {
    slug: "arquitectura-percepcion",
    category: "Diseño UX",
    title: "La Arquitectura de la Percepción: Tus Usuarios No Navegan Flujos, Sino Estados Emocionales",
    excerpt: "El error más costoso del UX moderno es diseñar para un usuario ideal en lugar del usuario real. Descubre los 4 estados críticos de la percepción consciente.",
    readTime: "8 min",
    date: "Mayo 2026",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    color: "#E8751A",
  },
  {
    slug: "adn-del-significado",
    category: "Producto",
    title: "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios",
    excerpt: "La motivación inicia la acción, pero el significado sostiene el hábito. 4 patrones de diseño noético para crear productos que trascienden.",
    readTime: "7 min",
    date: "Mayo 2026",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    color: "#2AABB3",
  },
  {
    slug: "trono-de-la-decision",
    category: "IA y Ética",
    title: "El Trono de la Decisión: IA, Autonomía Humana y Diseño Ético",
    excerpt: "En la era de los agentes de IA, el mayor riesgo no es la privacidad — es la infantilización del usuario.",
    readTime: "9 min",
    date: "Mayo 2026",
    image: "/images/blog-zero-ui-decision.png",
    color: "#E8751A",
  },
  {
    slug: "influencia-sin-erosion",
    category: "Diseño Conductual",
    title: "Influencia sin Erosión: Diseño de Comportamiento Sostenible sin Manipular",
    excerpt: "El comportamiento sostenido no nace de la presión. Nace de una conciencia respetada.",
    readTime: "10 min",
    date: "Mayo 2026",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop",
    color: "#2AABB3",
  },
  {
    slug: "psicologia-adopcion",
    category: "UX",
    title: "Psicología de la Adopción Digital",
    excerpt: "Cómo aplicar principios de psicología del consumidor para acelerar la adopción de productos digitales B2B y B2C.",
    readTime: "6 min",
    date: "Abril 2026",
    image: "/images/blog-behavioral.jpg",
    color: "#E8751A",
  },
  {
    slug: "discovery-ia",
    category: "IA",
    title: "Discovery de Producto con IA",
    excerpt: "Cómo la inteligencia artificial está transformando el proceso de discovery de producto y reduciendo tiempos de definición.",
    readTime: "7 min",
    date: "Abril 2026",
    image: "/images/blog-ai.jpg",
    color: "#2AABB3",
  },
  {
    slug: "ux-fintech",
    category: "Fintech",
    title: "UX en Fintech: Diseñar para la Confianza",
    excerpt: "Estrategias de diseño UX específicas para productos fintech que necesitan construir confianza desde el primer contacto.",
    readTime: "8 min",
    date: "Marzo 2026",
    image: "/images/blog-fintech.jpg",
    color: "#E8751A",
  },
  {
    slug: "mvp-escala",
    category: "Startups",
    title: "Del MVP a la Escala",
    excerpt: "Cómo diseñar un MVP que no solo valide tu idea, sino que esté preparado para escalar sin deuda técnica.",
    readTime: "6 min",
    date: "Marzo 2026",
    image: "/images/blog-mvp.jpg",
    color: "#2AABB3",
  },
]

export default function BlogIndex() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://medialab.design/blog/${a.slug}`,
      name: a.title,
    })),
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <div className="flex flex-col gap-4 mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Blog
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground text-balance">
            Ideas sobre diseño UX, IA y experiencias B2B/B2C
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Artículos sobre diseño de producto, inteligencia artificial, psicología del consumidor
            y desarrollo de experiencias digitales que conectan y convierten.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: article.color }}
                >
                  {article.category}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-6 flex-1">
                <h2 className="font-display font-semibold text-base text-foreground leading-snug text-balance group-hover:opacity-80 transition-opacity line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {article.readTime}
                  </span>
                  <span className="text-muted-foreground/60">{article.date}</span>
                  <span
                    className="ml-auto font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all"
                    style={{ color: article.color }}
                  >
                    Leer <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
