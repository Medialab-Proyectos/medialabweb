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
  title: { absolute: "Influence Without Erosion | MediaLab" },
  description:
    "Sustained behavior isn't born from pressure. It's born from a respected consciousness. Discover the 4 layers of action and the $300 million button case.",
  alternates: {
    canonical: "/en/blog/influencia-sin-erosion",
    languages: {
      es: "/blog/influencia-sin-erosion",
      en: "/en/blog/influencia-sin-erosion",
      "x-default": "/blog/influencia-sin-erosion",
    },
  },
  openGraph: {
    title: "Influence Without Erosion",
    description: "5 patterns to influence without eroding.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/influencia-sin-erosion",
    publishedTime: "2026-05-10T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-zero-ui-influencia.png", width: 1200, height: 630, alt: "Influence Without Erosion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Influence Without Erosion",
    description: "Sustainable behavioral design without manipulation.",
    images: ["/images/blog-zero-ui-influencia.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Influence Without Erosion: Sustainable Behavioral Design Without Manipulation",
  description: "The 4 layers of action and the $300 million button case.",
  image: ["https://medialab.design/images/blog-zero-ui-influencia.png"],
  datePublished: "2026-05-10T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/influencia-sin-erosion" },
  inLanguage: "en",
  articleSection: "Behavioral Design",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "Influence Without Erosion", item: "https://medialab.design/en/blog/influencia-sin-erosion" },
  ],
}

export default function BlogInfluenciaSinErosionPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-influencia-sin-erosion.jpg" alt="UX researcher in a usability session with a user" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#2AABB3" }}>
              Behavioral Design
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Influence Without Erosion: How to Design Sustainable Behavior Without Manipulating the User
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={10} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Behavioral design was born from a legitimate intention: to help people do what they already want to do, but can&rsquo;t sustain. The pioneering models solved <em className="italic text-foreground">activation</em>. But they left a vital question: <strong className="font-semibold text-foreground">What happens next?</strong>
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Is the Invisible Limit of Classic Behavioral Design?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Most contemporary behavioral patterns focus obsessively on triggers, immediate gratification, and the total elimination of friction. They are tools designed for the short-term assault, but they fail spectacularly when they try to build well-being, autonomy, or lasting trust.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The underlying mistake: <strong className="font-semibold text-foreground">assuming that if we optimize the external action, the internal human outcome will follow as a bonus</strong>. CXD inverts this logic: if we design the consciousness from which the action occurs, behavior regulates itself organically.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;In conscious design, behavior isn&rsquo;t forced; behavior emerges.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Are the 4 Layers of User Action?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          In the conscious-design ecosystem, behavior isn&rsquo;t an isolated event, but the result of four prior layers in perfect harmony. If one fails, behavior degrades no matter how powerful the technological trigger is:
        </p>
        <ol className="list-decimal pl-6 space-y-5 text-lg text-muted-foreground mb-8">
          <li>
            <strong className="font-semibold text-foreground">Phenomenological State:</strong> How does it <em className="italic">feel</em> to use the system in this moment? Not a satisfaction metric, but the quality of the subjective experience. Does the system expand the user&rsquo;s presence or fragment it?
          </li>
          <li>
            <strong className="font-semibold text-foreground">Noetic Meaning:</strong> What does this action represent for me? Does it have a meaningful place in the narrative of my life? Without a noetic north, the interaction becomes empty dopamine consumption.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Ethical Autonomy:</strong> How much real control does the individual have over what happens? A system that respects autonomy doesn&rsquo;t manipulate the architecture of the decision — it illuminates it.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Adaptive Context:</strong> The system&rsquo;s ability to respond to the user&rsquo;s real state: fatigue, doubt, or need for clarity.
          </li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Are the 5 Patterns of Conscious Behavioral Design?</h2>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--orange, #E8751A)" }}>1. Contextual Activation</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Instead of pushing the user or notifying by fixed rules, conscious design activates the interface based on their emotional and cognitive state. CTAs that appear only on signals of clarity. Recommendations that hold back under saturation. Result: less reactive rejection, more voluntary action.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--cyan, #2AABB3)" }}>2. Conscious Micro-commitment</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The classic pattern aggressively pushes to the next level. Conscious design validates intention at each step: real options to pause, reminders that certain steps aren&rsquo;t mandatory. Result: more durable commitments, less abandonment from stress.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--magenta, #E8751A)" }}>3. Interpretive Reinforcement</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Instead of the empty &ldquo;You did it!&rdquo;, conscious reinforcement explains the real impact. The system shows how that action reduces a specific problem or brings the user closer to their long-term values.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--orange, #E8751A)" }}>4. Conscious Friction</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Friction isn&rsquo;t always the enemy. You remove unnecessary friction but introduce <strong className="font-semibold text-foreground">reflective friction</strong> where it matters: confirmations before irreversible actions, pauses before impulsive decisions.
        </p>

        <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4" style={{ color: "var(--cyan, #2AABB3)" }}>5. Dignified Exit</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The user must be able to leave the flow without feeling they&rsquo;ve failed. &ldquo;Your progress is saved&rdquo; and &ldquo;it&rsquo;s okay not to continue now&rdquo; build unshakable trust, ensuring a return based on loyalty, not guilt.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Does the $300 Million Button Case Teach?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A major e-commerce site changed the &ldquo;Register&rdquo; button to &ldquo;Continue,&rdquo; allowing guest checkout. This small adjustment to user autonomy <strong className="font-semibold text-foreground">increased sales by $300 million dollars a year</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          CXD takes this idea further. Imagine a system that, faced with a late-night impulse purchase, introduces a pause: &ldquo;Are you sure? You&rsquo;ve been browsing for a long time.&rdquo; Although it seems to go against commercial interest, this practice builds deep loyalty and increases customer lifetime value over the long run.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Move from Engagement Engine to Guardian of Context?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Sustained behavior isn&rsquo;t born from pressure. It&rsquo;s born from a consciousness that feels respected. In this new era, AI stops being a tool to maximize clicks and becomes an ethical mediator between the user&rsquo;s intention and action.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Quieres influir sin erosionar a tus usuarios?"
          headlineEn="Want to influence without eroding your users?"
          subEs="Implementamos diseño conductual consciente en plataformas B2B y apps B2C. Hablemos de tu producto."
          subEn="We implement conscious behavioral design in B2B platforms and B2C apps. Let's talk about your product."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Ve cómo aplicamos diseño conductual en producción"
          headlineEn="See how we apply behavioral design in production"
          subEs="Casos reales de productos digitales que mejoraron retención y conversión con nuestro enfoque."
          subEn="Real cases of digital products that improved retention and conversion with our approach."
          ctaEs="Ver portafolio"
          ctaEn="View portfolio"
          href="/portafolio"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="influencia-sin-erosion" slugs={["trono-de-la-decision", "adn-del-significado", "arquitectura-percepcion"]} />
      </div>
    </main>
  )
}
