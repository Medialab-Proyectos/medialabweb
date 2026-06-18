"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { BLOG_POSTS } from "@/lib/blog-posts"

export function BlogIndexContent() {
  const { t, localized } = useLanguage()

  const articles = BLOG_POSTS.map((post) => ({
    slug: post.slug,
    category: t(post.categoryEs, post.categoryEn),
    title: t(post.titleEs, post.titleEn),
    excerpt: t(post.excerptEs, post.excerptEn),
    readTime: post.readTime,
    date: t(post.dateEs, post.dateEn),
    image: post.image,
    color: post.color,
  }))

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
