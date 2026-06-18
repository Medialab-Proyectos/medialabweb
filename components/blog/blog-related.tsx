"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { BLOG_POSTS_BY_SLUG } from "@/lib/blog-posts"

export function BlogRelatedArticles({ currentSlug, slugs }: { currentSlug: string; slugs: string[] }) {
  const { t, localized } = useLanguage()

  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => BLOG_POSTS_BY_SLUG[s])
    .filter(Boolean)

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
              title={t(article.shortTitleEs, article.shortTitleEn)}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-[var(--magenta)]/40 hover:bg-card transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-[var(--magenta)]">
                  {t(article.categoryEs, article.categoryEn)}
                </span>
                <p className="text-sm font-semibold text-foreground mt-1 truncate">
                  {t(article.shortTitleEs, article.shortTitleEn)}
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
