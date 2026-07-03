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
  title: { absolute: "The DNA of Meaning | MediaLab" },
  description:
    "Motivation starts the action, but meaning sustains the habit. Discover how purpose-driven design creates digital products that users love.",
  alternates: {
    canonical: "/en/blog/adn-del-significado",
    languages: {
      es: "/blog/adn-del-significado",
      en: "/en/blog/adn-del-significado",
      "x-default": "/blog/adn-del-significado",
    },
  },
  openGraph: {
    title: "The DNA of Meaning",
    description:
      "Motivation starts the action, but meaning sustains the habit. Noetic design for products that transcend.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/adn-del-significado",
    publishedTime: "2026-05-05T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-zero-ui-significado.png", width: 1200, height: 630, alt: "The DNA of Meaning" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The DNA of Meaning",
    description: "Noetic design: 4 patterns for products that retain through purpose.",
    images: ["/images/blog-zero-ui-significado.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The DNA of Meaning: Why Motivation Isn't Enough to Retain Users",
  description:
    "Motivation starts the action, but meaning sustains the habit. 4 noetic design patterns for products that transcend.",
  image: ["https://medialab.design/images/blog-zero-ui-significado.png"],
  datePublished: "2026-05-05T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/adn-del-significado" },
  inLanguage: "en",
  articleSection: "Product",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "The DNA of Meaning", item: "https://medialab.design/en/blog/adn-del-significado" },
  ],
}

export default function BlogAdnSignificadoPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-adn-del-significado.jpg" alt="Team collaborating on the purpose and meaning of a digital product" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#2AABB3" }}>
              Product
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            The DNA of Meaning: Why Motivation Isn&rsquo;t Enough to Retain Users
          </h1>
          <BlogChromeMeta dateEs="Mayo 2026" dateEn="May 2026" readMin={7} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Why do certain digital products become part of the user&rsquo;s identity while others, technically superior, fade into oblivion? The answer isn&rsquo;t in the features — it&rsquo;s in the <em className="italic text-foreground">meaning</em>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Is Noetics and How Does It Apply to Design?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Noetics is the branch of philosophy that studies thought and the intuitive knowledge that transcends the traditional senses. Applied to experience design, it reveals something profound: <strong className="font-semibold text-foreground">people don&rsquo;t return to products that merely execute tasks; they return to those that reinforce who they are or who they want to be</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Consider Nike Run Club. Users don&rsquo;t come back for the buttons or the interface — they come back because the platform reinforces their identity as an athlete. Duolingo doesn&rsquo;t retain users through its streaks, but because the user sees themselves as &ldquo;someone who is learning a language.&rdquo;
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan)" }}>
          &ldquo;Conscious design doesn&rsquo;t ask: &lsquo;What can the user do here?&rsquo; It asks: &lsquo;What version of themselves is the user building by doing it?&rsquo;&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Are the 4 Noetic Design Patterns?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          For purpose to become operational in your B2B or B2C product, it must translate into clear patterns:
        </p>
        <ol className="list-decimal pl-6 space-y-5 text-lg text-muted-foreground mb-8">
          <li>
            <strong className="font-semibold text-foreground">Active Identity — The end of the generic user.</strong> The system must act as a mirror that reinforces the user&rsquo;s self-image. Instead of impersonal labels, use roles like &ldquo;Mentor,&rdquo; &ldquo;Builder,&rdquo; or &ldquo;Leader.&rdquo; By placing the subject in an active state, identity sustains usage even when motivation falters.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Meaningful Progress — Beyond cold numbers.</strong> A conscious system doesn&rsquo;t say &ldquo;you&rsquo;ve completed 10 lessons,&rdquo; but: &ldquo;You&rsquo;re building the foundation of your knowledge in X.&rdquo; Progress must be tied to personal goals and narrative milestones.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Coherent Narrative — The product as story.</strong> Noetic design creates temporal continuity: clear beginning, development, and closure in every flow. The system has &ldquo;memory&rdquo; to recall past milestones and contextualize the future.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Explicit Purpose — The justification of the &ldquo;what for.&rdquo;</strong> Justifying recommendations based on the user&rsquo;s values reduces internal friction. Connect small tasks to larger goals.
          </li>
        </ol>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Is the Difference Between Motivation and Meaning?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          <strong className="font-semibold text-foreground">Motivation starts the action, but meaning sustains the habit.</strong> Without the noetic layer, the risk is generating fleeting engagement without real loyalty. It&rsquo;s the difference between a social network that devours time through variable rewards and a platform that facilitates intellectual growth.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Today, AI lets meaning be dynamic: it translates cold metrics into personal impact and adapts the narrative to the user&rsquo;s stage of life. But if the AI doesn&rsquo;t understand the user&rsquo;s deep purpose, it will only optimize their surface behavior, not their lived experience.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Design Identity, Purpose, and Narrative in Your Product?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Noetics explains why some products endure and others die. Meaning sustains what motivation cannot. Your product must design identity, purpose, and narrative — and AI lets you personalize meaning, not just action.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu producto genera significado o solo engagement?"
          headlineEn="Does your product create meaning, or just engagement?"
          subEs="Descubre cómo implementar diseño noético en tu producto B2B o B2C. Hablemos."
          subEn="Learn how to implement noetic design in your B2B or B2C product. Let's talk."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Conoce nuestros servicios de diseño conductual"
          headlineEn="Explore our behavioral design services"
          subEs="Investigación UX, diseño conductual y desarrollo de producto digital end-to-end."
          subEn="UX research, behavioral design, and end-to-end digital product development."
          ctaEs="Ver servicios"
          ctaEn="View services"
          href="/servicios"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="adn-del-significado" slugs={["arquitectura-percepcion", "influencia-sin-erosion", "psicologia-adopcion"]} />
      </div>
    </main>
  )
}
