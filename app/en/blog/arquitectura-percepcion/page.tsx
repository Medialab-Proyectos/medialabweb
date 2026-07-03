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
  title: { absolute: "The Architecture of Perception | MediaLab" },
  description:
    "Users don't abandon products for lack of logic but because of invisible emotional friction. Discover MediaLab's Conscious Experience Design (CXD).",
  alternates: {
    canonical: "/en/blog/arquitectura-percepcion",
    languages: {
      es: "/blog/arquitectura-percepcion",
      en: "/en/blog/arquitectura-percepcion",
      "x-default": "/blog/arquitectura-percepcion",
    },
  },
  openGraph: {
    title: "The Architecture of Perception",
    description:
      "Users move through emotional states, not logical flows. Learn to design from conscious perception.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/arquitectura-percepcion",
    publishedTime: "2026-05-01T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    tags: ["UX", "Conscious Design", "Perception", "CXD"],
    images: [
      { url: "/images/blog-zero-ui-percepcion.png", width: 1200, height: 630, alt: "Architecture of perception" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Architecture of Perception",
    description: "4 critical states for designing conscious experiences.",
    images: ["/images/blog-zero-ui-percepcion.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "The Architecture of Perception: Why Your Users Don't Navigate Flows, They Navigate Emotional States",
  description:
    "Users don't abandon products for lack of logic but because of invisible emotional friction. Discover Conscious Experience Design (CXD).",
  image: ["https://medialab.design/images/blog-zero-ui-percepcion.png"],
  datePublished: "2026-05-01T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: {
    "@type": "Person",
    name: "Christian Benavides",
    url: "https://www.zeroui.me/",
  },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://medialab.design/en/blog/arquitectura-percepcion",
  },
  inLanguage: "en",
  keywords: "UX, perception, CXD, conscious design, emotional states, Zero UI",
  articleSection: "UX Design",
  wordCount: 1800,
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "The Architecture of Perception",
      item: "https://medialab.design/en/blog/arquitectura-percepcion",
    },
  ],
}

export default function BlogArquitecturaPercepcionPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-arquitectura-percepcion.jpg" alt="UX design team analyzing the user's emotional states" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#E8751A" }}>
              UX Design
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            The Architecture of Perception: Why Your Users Don&rsquo;t Navigate Flows, They Navigate Emotional States
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={8} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          There are digital products that are perfect… at least on paper. Their flows are clear, their interfaces impeccable.
          And still, something fails. It&rsquo;s an <em className="italic text-foreground">invisible friction</em>. When this happens, the problem isn&rsquo;t in the code or the aesthetics — it&rsquo;s a failure in the architecture of perception.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Is the Central Misunderstanding of Modern UX?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          For decades, the digital design industry has been built on a flawed equation: <strong className="font-semibold text-foreground">Click + Screen + Action = Experience</strong>. This atomic view ignores a fundamental truth: an interaction is just an isolated event, while experience is a <em className="italic text-foreground">sustained state of consciousness</em>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The most costly mistake of contemporary technology has been designing for an ideal user — a rational abstraction operating in a vacuum — instead of the real user, whose navigation is conditioned by their environment, their emotions, and their momentary cognitive capacity.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--magenta)" }}>
          &ldquo;People don&rsquo;t navigate through logical flows; they navigate through emotional states. The user doesn&rsquo;t inhabit buttons or wireframes; they inhabit sensations of clarity, doubt, control, anxiety, or security.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Are the 4 Critical States of Perception?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Conscious Experience Design (CXD) holds that for a design to be truly conscious, it must respond precisely to four critical states:
        </p>
        <ol className="list-decimal pl-6 space-y-4 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">State of Orientation:</strong> The user needs to feel: &ldquo;I know exactly where I am and I understand what will happen next.&rdquo; Achieved with contextual progress indicators and microcopy that removes any ambiguity.</li>
          <li><strong className="font-semibold text-foreground">Cognitive Load Management:</strong> The user perceives: &ldquo;The information overwhelms me and keeps me from deciding.&rdquo; The solution is progressive disclosure — breaking complex processes into micro-stages.</li>
          <li><strong className="font-semibold text-foreground">Control of Subjective Time:</strong> &ldquo;This wait feels endless.&rdquo; Implementing skeleton screens keeps the user focused on progress, not on the wait.</li>
          <li><strong className="font-semibold text-foreground">Safety and Trust:</strong> &ldquo;I fully trust that the system won&rsquo;t make mistakes with my information.&rdquo; This requires total transparency, especially in AI-driven systems.</li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Why Does Logic Produce Incorrect Experiences?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A paradigmatic case: McDonald&apos;s deployed an AI voice-ordering system for its drive-thrus. The system, designed to optimize efficiency, failed spectacularly by not considering the real context: ambient noise, regional accents, overlapping voices. Absurd orders went viral.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Technically, the code processed data following its internal logic, but <strong className="font-semibold text-foreground">phenomenologically the system was blind</strong> to the customer&rsquo;s confusion. A conscious design approach would have detected the degradation in response quality and handed control to a human before the error escalated.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Apply Phenomenology to Practical UX Design?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Phenomenology offers us actionable UX patterns for any B2B or B2C product:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Emotional-state mapping</strong> at every touchpoint of the user journey</li>
          <li><strong className="font-semibold text-foreground">Context-adaptive design</strong> — not just responsive in size, but in mental state</li>
          <li><strong className="font-semibold text-foreground">Progressive cognitive-load reduction</strong> based on user fatigue signals</li>
          <li><strong className="font-semibold text-foreground">Radical transparency</strong> in AI systems to generate genuine trust</li>
        </ul>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Why Design for Consciousness and Not for the Click?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The fundamental question of CXD isn&rsquo;t <em className="italic">&ldquo;what should the user do?&rdquo;</em> but <em className="italic text-foreground">&ldquo;from what mental state are they trying to do it?&rdquo;</em>. When we design from conscious perception, we don&rsquo;t just create more usable products — we create experiences that respect the humanity of whoever uses them.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Quieres diseñar desde la percepción consciente?"
          headlineEn="Want to design from conscious perception?"
          subEs="Descubre cómo aplicamos el CXD en productos B2B y B2C reales. Agenda una llamada gratuita."
          subEn="Discover how we apply CXD in real B2B and B2C products. Book a free call."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Aprende a diseñar experiencias con IA"
          headlineEn="Learn to design experiences with AI"
          subEs="Nuestro curso AI User Experience Architect te enseña a aplicar psicología del consumidor e IA en productos reales."
          subEn="Our AI User Experience Architect course teaches you to apply consumer psychology and AI to real products."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="arquitectura-percepcion" slugs={["adn-del-significado", "psicologia-adopcion", "influencia-sin-erosion"]} />
      </div>
    </main>
  )
}
