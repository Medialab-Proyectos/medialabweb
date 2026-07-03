import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeAuthorLine,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"
import { BlogRelatedArticles } from "@/components/blog/blog-related"

export const metadata: Metadata = {
  title: { absolute: "The Throne of Decision | MediaLab" },
  description:
    "In the age of AI agents, the greatest risk isn't privacy — it's the infantilization of the user. Discover Agentic Experience Design (AXD).",
  alternates: {
    canonical: "/en/blog/trono-de-la-decision",
    languages: {
      es: "/blog/trono-de-la-decision",
      en: "/en/blog/trono-de-la-decision",
      "x-default": "/blog/trono-de-la-decision",
    },
  },
  openGraph: {
    title: "The Throne of Decision",
    description: "The ethics of design in the age of AI.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/trono-de-la-decision",
    publishedTime: "2026-05-08T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-zero-ui-decision.png", width: 1200, height: 630, alt: "The Throne of Decision" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Throne of Decision",
    description: "AI, autonomy, and ethical design.",
    images: ["/images/blog-zero-ui-decision.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Throne of Decision: AI, Human Autonomy, and Ethical Design",
  description:
    "In the age of AI agents, the greatest risk isn't privacy — it's the infantilization of the user.",
  image: ["https://medialab.design/images/blog-zero-ui-decision.png"],
  datePublished: "2026-05-08T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/trono-de-la-decision" },
  inLanguage: "en",
  articleSection: "AI & Ethics",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "The Throne of Decision", item: "https://medialab.design/en/blog/trono-de-la-decision" },
  ],
}

export default function BlogTronoDecisionPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-zero-ui-decision.png" alt="AI, human autonomy, and ethical design" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "var(--magenta, #E8751A)" }}>
              AI &amp; Ethics
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            The Throne of Decision: AI, Human Autonomy, and the Future of Ethical Design
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={9} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          We&rsquo;re at the epicenter of the era of <strong className="font-semibold text-foreground">Agentic Experience Design (AXD)</strong> — a paradigm where AI stops being reactive and becomes a proactive agent that acts on the user&rsquo;s behalf. The greatest ethical concern isn&rsquo;t privacy: it&rsquo;s the <em className="italic text-foreground">integrity of human will</em>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Is User Infantilization and Why Is It a Risk?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          If technology begins to decide everything for us — from which news to consume to how to manage our finances — we risk losing our <strong className="font-semibold text-foreground">agency</strong>: that uniquely human capacity to act with intention and purpose.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          AXD promises a frictionless experience, a world where common tasks are replaced by fluid interactions with data. But this convenience carries a hidden cost if it isn&rsquo;t designed with rigorous ethical awareness.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--orange, #E8751A)" }}>
          &ldquo;A well-designed system doesn&rsquo;t decide for you. It helps you decide better.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Is the Ethical Dilemma of AI-Driven UX?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          There&rsquo;s an uncomfortable truth: many of the most successful digital products reached that status precisely because they managed to <strong className="font-semibold text-foreground">erode the user&rsquo;s autonomy</strong>. For years, persuasive design was celebrated: less friction, faster decisions, higher conversion rates.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Yet this approach hides a deep tension: when a system decides &ldquo;too well,&rdquo; the human stops deciding. CXD emerges as an act of ethical rebellion against this tendency.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Apply Stoicism to Digital Design?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Stoicism teaches us a fundamental lesson for the digital age: we must clearly distinguish between what is within our control and what is not. In product design, this translates into a technical imperative:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Create systems that strengthen the user&rsquo;s internal control</strong> instead of generating debilitating dependence</li>
          <li><strong className="font-semibold text-foreground">Reject dark patterns</strong> — those design tricks, from impossible-to-cancel subscriptions to notifications that trigger addictive impulses</li>
          <li><strong className="font-semibold text-foreground">Enhance the human&rsquo;s capacity to decide</strong>, not nullify it</li>
          <li>Ask: <em className="italic">&ldquo;What kind of control relationship are we building between human and machine?&rdquo;</em></li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Design AI That Is a Guardian and Not a Dictator?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Within the framework of conscious design, AI stops being an engagement engine and becomes an <strong className="font-semibold text-foreground">ethical mediator</strong> between intention and action. Ethical AI:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>Detects signals of fatigue or emotional saturation</li>
          <li>Adjusts the pace and tone of the interface to the user&rsquo;s mental clarity</li>
          <li>Offers real options, not the illusion of options</li>
          <li>Suggests pauses before impulsive decisions</li>
        </ul>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Move from Persuasion to Consciousness in Design?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The future of digital design isn&rsquo;t about who gets the most clicks, but about who builds systems that strengthen human agency. In a world where AI can simulate us, the real differentiator will be whoever best understands the human being that technology is affecting.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu IA fortalece o debilita a tus usuarios?"
          headlineEn="Is your AI empowering or weakening your users?"
          subEs="Te ayudamos a diseñar sistemas de IA éticos que generen confianza y lealtad genuina."
          subEn="We help you design ethical AI systems that build genuine trust and loyalty."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Formamos arquitectos de experiencias con IA"
          headlineEn="We train AI experience architects"
          subEs="Ética, diseño conductual e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Ethics, behavioral design, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="trono-de-la-decision" slugs={["influencia-sin-erosion", "discovery-ia", "arquitectura-percepcion"]} />
      </div>
    </main>
  )
}
