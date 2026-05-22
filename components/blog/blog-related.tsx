"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type RelatedArticle = {
  slug: string
  titleEs: string
  titleEn: string
  categoryEs: string
  categoryEn: string
}

const allArticles: RelatedArticle[] = [
  { slug: "arquitectura-percepcion", titleEs: "La Arquitectura de la Percepción", titleEn: "The Architecture of Perception", categoryEs: "Diseño UX", categoryEn: "UX Design" },
  { slug: "adn-del-significado", titleEs: "El ADN del Significado", titleEn: "The DNA of Meaning", categoryEs: "Producto", categoryEn: "Product" },
  { slug: "trono-de-la-decision", titleEs: "El Trono de la Decisión: IA y Diseño Ético", titleEn: "The Throne of Decision: AI & Ethical Design", categoryEs: "IA y Ética", categoryEn: "AI & Ethics" },
  { slug: "influencia-sin-erosion", titleEs: "Influencia sin Erosión: Diseño Conductual Sostenible", titleEn: "Influence Without Erosion", categoryEs: "Diseño Conductual", categoryEn: "Behavioral Design" },
  { slug: "psicologia-adopcion", titleEs: "Psicología de la Adopción Digital", titleEn: "Psychology of Digital Adoption", categoryEs: "UX", categoryEn: "UX" },
  { slug: "discovery-ia", titleEs: "Discovery de Producto con IA", titleEn: "Product Discovery with AI", categoryEs: "IA", categoryEn: "AI" },
  { slug: "ux-fintech", titleEs: "UX en Fintech: Diseñar para la Confianza", titleEn: "UX in Fintech: Designing for Trust", categoryEs: "Fintech", categoryEn: "Fintech" },
  { slug: "mvp-escala", titleEs: "Del MVP a la Escala", titleEn: "From MVP to Scale", categoryEs: "Startups", categoryEn: "Startups" },
]

export function BlogRelatedArticles({ currentSlug, slugs }: { currentSlug: string; slugs: string[] }) {
  const { t, localized } = useLanguage()

  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter(Boolean) as RelatedArticle[]

  if (related.length === 0) return null

  return (
    <nav aria-label={t("Artículos relacionados", "Related articles")} className="mt-12">
      <h3 className="font-display font-bold text-lg text-foreground mb-4">
        {t("Sigue leyendo", "Keep reading")}
      </h3>
      <ul className="grid gap-3">
        {related.map((article) => (
          <li key={article.slug}>
            <Link
              href={localized(`/blog/${article.slug}`)}
              title={t(article.titleEs, article.titleEn)}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-[var(--magenta)]/40 hover:bg-card transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-[var(--magenta)]">
                  {t(article.categoryEs, article.categoryEn)}
                </span>
                <p className="text-sm font-semibold text-foreground mt-1 truncate">
                  {t(article.titleEs, article.titleEn)}
                </p>
              </div>
              <ArrowRight size={14} className="shrink-0 text-muted-foreground group-hover:text-[var(--magenta)] transition-colors" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
