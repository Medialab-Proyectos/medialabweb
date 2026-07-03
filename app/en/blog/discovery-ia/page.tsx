import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"
import { BlogRelatedArticles } from "@/components/blog/blog-related"

export const metadata: Metadata = {
  title: "Discovery with AI: The End of Endless Workshops",
  description:
    "How intelligent tools are replacing weeks of stakeholder sessions and compressing product discovery into days.",
  alternates: {
    canonical: "/en/blog/discovery-ia",
    languages: {
      es: "/blog/discovery-ia",
      en: "/en/blog/discovery-ia",
      "x-default": "/blog/discovery-ia",
    },
  },
  openGraph: {
    title: "Discovery with AI: The End of Endless Workshops",
    description: "How AI is transforming product discovery.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/discovery-ia",
    publishedTime: "2026-04-20T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-ai.jpg", width: 1200, height: 630, alt: "Discovery with AI" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/blog-ai.jpg"] },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Discovery with AI: The End of Endless Workshops",
  description: "How AI shortens product discovery from weeks to days.",
  image: ["https://medialab.design/images/blog-ai.jpg"],
  datePublished: "2026-04-20T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/discovery-ia" },
  inLanguage: "en",
  articleSection: "AI",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "Discovery with AI", item: "https://medialab.design/en/blog/discovery-ia" },
  ],
}

export default function BlogDiscoveryIAPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-ai.jpg" alt="Discovery with AI" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit" style={{ background: "#2AABB3" }}>
            AI in UX
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Discovery with AI: The End of Endless Workshops
          </h1>
          <BlogChromeMeta dateEs="Ene 2025" dateEn="Jan 2025" readMin={4} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          AI-assisted product discovery makes it possible to compress weeks of workshops and stakeholder sessions into days, without losing research rigor. Intelligent tools analyze market patterns, generate testable hypotheses, and accelerate synthesis — freeing the team to focus on what really matters: evidence-based decisions and real contact with users.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Why Doesn&rsquo;t Traditional Discovery Work Anymore?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The classic product-discovery process involves weeks of workshops, user interviews, competitive analysis, and synthesis sessions. For a mid-sized company, this can easily add up to 80–120 hours of work before writing a single line of code — and a cost few startups can sustain.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Moreover, workshops have a structural problem: they tend to generate false consensus. The loudest stakeholders dominate the conversation, the more introverted ones keep their best ideas to themselves, and the result is usually a lukewarm average of all opinions, not the optimal solution.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How Is AI Changing Product Discovery?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          With tools like GPT-4, Claude, and specialized user-analysis systems, it&rsquo;s possible to compress a week of discovery work into hours. Not because AI replaces human thinking — but because it eliminates repetitive work and accelerates synthesis.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          At MediaLab, we&rsquo;ve developed an <strong className="font-semibold text-foreground">AI-Assisted Discovery</strong> framework that combines:
        </p>
        <ul className="list-disc pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li>Automatic analysis of competitor reviews (App Store, G2, Trustpilot) to extract pain patterns</li>
          <li>Generation of user personas based on real demographic and behavioral data</li>
          <li>Synthesis of interview insights through transcription + semantic analysis</li>
          <li>Semi-automated generation of user stories and acceptance criteria</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Can&rsquo;t AI Replace in Discovery?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          AI is extraordinarily good at synthesizing existing information. But it can&rsquo;t generate insights that aren&rsquo;t in the data — and the most valuable product insights usually come from directly observing how people fail to complete a task, not from reading what they say they do.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Ethnographic observation, deeply empathetic interviews, contextual analysis — these don&rsquo;t disappear with AI. What changes is how much time we spend organizing and synthesizing what we already know versus how much time we spend discovering what we don&rsquo;t yet know.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Is It Possible to Do Discovery in 48 Hours?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          With our current process, we can deliver a complete product brief — including market analysis, target-user definition, unique value proposition, and feature prioritization — in 48 hours. Something that used to take 3–4 weeks.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The time saved doesn&rsquo;t go to margins — it goes where it really matters: more interactions with real users, more iterated prototypes, more evidence-based decisions.
        </p>
      </article>

      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Quieres hacer discovery en 48h?"
          headlineEn="Want to run discovery in 48h?"
          subEs="Nuestro proceso UXBox combina IA y metodología UX para darte claridad en tiempo récord."
          subEn="Our UXBox process combines AI and UX methodology to give you clarity in record time."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Aprende discovery con IA en nuestro curso"
          headlineEn="Learn AI discovery in our course"
          subEs="El módulo de AI-Assisted Discovery es parte de nuestro programa AI User Experience Architect."
          subEn="The AI-Assisted Discovery module is part of our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="discovery-ia" slugs={["mvp-escala", "trono-de-la-decision", "psicologia-adopcion"]} />
      </div>
    </main>
  )
}
