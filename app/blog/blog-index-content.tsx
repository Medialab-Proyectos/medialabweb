"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type Article = {
  slug: string
  category: string
  title: string
  excerpt: string
  readTime: string
  date: string
  image: string
  color: string
}

export function BlogIndexContent() {
  const { t, localized } = useLanguage()

  const articles: Article[] = [
    {
      slug: "arquitectura-percepcion",
      category: t("Diseño UX", "UX Design"),
      title: t(
        "La Arquitectura de la Percepción: Tus Usuarios No Navegan Flujos, Sino Estados Emocionales",
        "The Architecture of Perception: Your Users Don't Navigate Flows, They Navigate Emotional States"
      ),
      excerpt: t(
        "El error más costoso del UX moderno es diseñar para un usuario ideal en lugar del usuario real. Descubre los 4 estados críticos de la percepción consciente.",
        "Modern UX's costliest mistake is designing for an ideal user instead of the real one. Discover the 4 critical states of conscious perception."
      ),
      readTime: t("8 min", "8 min"),
      date: t("Mayo 2026", "May 2026"),
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
      color: "#E8751A",
    },
    {
      slug: "adn-del-significado",
      category: t("Producto", "Product"),
      title: t(
        "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios",
        "The DNA of Meaning: Why Motivation Isn't Enough to Retain Users"
      ),
      excerpt: t(
        "La motivación inicia la acción, pero el significado sostiene el hábito. 4 patrones de diseño noético para crear productos que trascienden.",
        "Motivation starts the action, but meaning sustains the habit. 4 noetic design patterns to create products that transcend."
      ),
      readTime: t("7 min", "7 min"),
      date: t("Mayo 2026", "May 2026"),
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      color: "#2AABB3",
    },
    {
      slug: "trono-de-la-decision",
      category: t("IA y Ética", "AI & Ethics"),
      title: t(
        "El Trono de la Decisión: IA, Autonomía Humana y Diseño Ético",
        "The Throne of Decision: AI, Human Autonomy, and Ethical Design"
      ),
      excerpt: t(
        "En la era de los agentes de IA, el mayor riesgo no es la privacidad — es la infantilización del usuario.",
        "In the age of AI agents, the greatest risk isn't privacy — it's the infantilization of the user."
      ),
      readTime: t("9 min", "9 min"),
      date: t("Mayo 2026", "May 2026"),
      image: "/images/blog-zero-ui-decision.png",
      color: "#E8751A",
    },
    {
      slug: "influencia-sin-erosion",
      category: t("Diseño Conductual", "Behavioral Design"),
      title: t(
        "Influencia sin Erosión: Diseño de Comportamiento Sostenible sin Manipular",
        "Influence Without Erosion: Sustainable Behavioral Design Without Manipulation"
      ),
      excerpt: t(
        "El comportamiento sostenido no nace de la presión. Nace de una conciencia respetada.",
        "Sustained behavior doesn't come from pressure. It comes from a respected consciousness."
      ),
      readTime: t("10 min", "10 min"),
      date: t("Mayo 2026", "May 2026"),
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop",
      color: "#2AABB3",
    },
    {
      slug: "psicologia-adopcion",
      category: "UX",
      title: t("Psicología de la Adopción Digital", "The Psychology of Digital Adoption"),
      excerpt: t(
        "Cómo aplicar principios de psicología del consumidor para acelerar la adopción de productos digitales B2B y B2C.",
        "How to apply consumer psychology principles to accelerate adoption of B2B and B2C digital products."
      ),
      readTime: t("6 min", "6 min"),
      date: t("Abril 2026", "April 2026"),
      image: "/images/blog-behavioral.jpg",
      color: "#E8751A",
    },
    {
      slug: "discovery-ia",
      category: t("IA", "AI"),
      title: t("Discovery de Producto con IA", "Product Discovery with AI"),
      excerpt: t(
        "Cómo la inteligencia artificial está transformando el proceso de discovery de producto y reduciendo tiempos de definición.",
        "How artificial intelligence is transforming product discovery and reducing definition time."
      ),
      readTime: t("7 min", "7 min"),
      date: t("Abril 2026", "April 2026"),
      image: "/images/blog-ai.jpg",
      color: "#2AABB3",
    },
    {
      slug: "ux-fintech",
      category: "Fintech",
      title: t("UX en Fintech: Diseñar para la Confianza", "UX in Fintech: Designing for Trust"),
      excerpt: t(
        "Estrategias de diseño UX específicas para productos fintech que necesitan construir confianza desde el primer contacto.",
        "UX design strategies specific to fintech products that need to build trust from the first touch."
      ),
      readTime: t("8 min", "8 min"),
      date: t("Marzo 2026", "March 2026"),
      image: "/images/blog-fintech.jpg",
      color: "#E8751A",
    },
    {
      slug: "mvp-escala",
      category: t("Startups", "Startups"),
      title: t("Del MVP a la Escala", "From MVP to Scale"),
      excerpt: t(
        "Cómo diseñar un MVP que no solo valide tu idea, sino que esté preparado para escalar sin deuda técnica.",
        "How to design an MVP that not only validates your idea but is also ready to scale without technical debt."
      ),
      readTime: t("6 min", "6 min"),
      date: t("Marzo 2026", "March 2026"),
      image: "/images/blog-mvp.jpg",
      color: "#2AABB3",
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <Link
          href={localized("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          {t("Volver al inicio", "Back to home")}
        </Link>

        <div className="flex flex-col gap-4 mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--magenta)]">
            Blog
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground text-balance">
            {t("Ideas sobre diseño UX, IA y experiencias B2B/B2C", "Ideas on UX design, AI, and B2B/B2C experiences")}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            {t(
              "Artículos sobre diseño de producto, inteligencia artificial, psicología del consumidor y desarrollo de experiencias digitales que conectan y convierten.",
              "Articles on product design, artificial intelligence, consumer psychology, and building digital experiences that connect and convert."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={localized(`/blog/${article.slug}`)}
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
                    {t("Leer", "Read")} <ArrowRight size={11} />
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
