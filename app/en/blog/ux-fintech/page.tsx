import type { Metadata } from "next"
import Image from "next/image"
import {
  BlogChromeBackLink,
  BlogChromeMeta,
  BlogChromeCTA,
} from "@/components/blog/blog-chrome"
import { BlogRelatedArticles } from "@/components/blog/blog-related"

export const metadata: Metadata = {
  title: "Designing for Trust: UX and Financial Behavior",
  description:
    "The UX design principles that make people feel safe making financial decisions digitally. Strategies for fintech and banking.",
  alternates: {
    canonical: "/en/blog/ux-fintech",
    languages: {
      es: "/blog/ux-fintech",
      en: "/en/blog/ux-fintech",
      "x-default": "/blog/ux-fintech",
    },
  },
  openGraph: {
    title: "Designing for Trust: UX and Financial Behavior",
    description: "Designing for trust in financial products.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/ux-fintech",
    publishedTime: "2026-03-15T08:00:00-05:00",
    modifiedTime: "2026-05-14T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-fintech.jpg", width: 1200, height: 630, alt: "UX in Fintech" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/blog-fintech.jpg"] },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "UX in Fintech: Designing for Trust",
  description: "UX strategies for fintech products that build trust from the first touch.",
  image: ["https://medialab.design/images/blog-fintech.jpg"],
  datePublished: "2026-03-15T08:00:00-05:00",
  dateModified: "2026-05-14T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/ux-fintech" },
  inLanguage: "en",
  articleSection: "Fintech",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "UX in Fintech", item: "https://medialab.design/en/blog/ux-fintech" },
  ],
}

export default function BlogUXFintechPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-fintech.jpg" alt="UX in Fintech" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit" style={{ background: "#E8751A" }}>
            Behavioral Design
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Designing for Trust: UX and Financial Behavior
          </h1>
          <BlogChromeMeta dateEs="Ene 2025" dateEn="Jan 2025" readMin={6} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          Designing fintech products requires understanding that money activates the limbic system more intensely than almost any other digital decision. The UX principles that make people feel safe making financial decisions — transferring, investing, applying for credit — aren&rsquo;t the same ones that apply to e-commerce or entertainment. Trust is designed, not assumed.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Why Are Money and Fear Inseparable in UX?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Financial decisions activate the limbic system far more intensely than other digital decisions. Transferring money, investing savings, or applying for credit are actions loaded with anxiety — even for people with high levels of financial literacy. Fintech design that ignores this psychological reality is built on sand.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          According to a Nielsen Norman Group study, users of financial applications are 3 times more likely to abandon a task halfway through than users of entertainment apps. The main reason: the sense of irreversible risk. Unlike choosing the wrong movie, a botched transfer can&rsquo;t easily be undone.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Are the 5 Pillars of Financial Trust Design?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">After designing dozens of fintech products, we&rsquo;ve identified five principles that build genuine trust:</p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Total Transparency, Not Just Legal</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Showing costs and conditions clearly isn&rsquo;t just a legal obligation — it&rsquo;s a competitive advantage. Users who understand exactly what they&rsquo;re going to pay and why have conversion rates 40% higher than those exposed to ambiguous information or fine print.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. Confirmation and Perceived Reversibility</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Confirmation steps aren&rsquo;t friction — they&rsquo;re security. A &ldquo;Confirm transfer&rdquo; button with a clear summary of what&rsquo;s about to happen reduces abandonment in high-value transactions. The perception of reversibility (even when it&rsquo;s not always technically possible) also reduces action anxiety.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Visual Signals of Security</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Locks, visible SSL certificates, encryption indicators — they&rsquo;re not just marketing. They&rsquo;re cognitive signals that activate trust in the limbic system before the user has consciously processed whether the system is safe or not.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Human Language, Not Financial</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          &ldquo;Debit to checking account&rdquo; vs. &ldquo;Deducted from your main account.&rdquo; The first message is financially correct but cognitively loaded. The second is more accessible and reduces the anxiety associated with the word &ldquo;debit.&rdquo; In fintech, language is design.
        </p>

        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Visible Progress in Long Operations</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The biggest generator of anxiety in a financial app is waiting without feedback. A &ldquo;processing…&rdquo; animation that lasts more than 3 seconds without indicating progress can trigger cancellation behaviors even when the operation is working perfectly.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to Redesign the First-Transfer Flow?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          In a recent project with a digital-payments client, we identified that 45% of abandonment occurred at the confirmation step of the first transfer. The analysis revealed that users didn&rsquo;t understand exactly what was going to happen to their money or when it would arrive.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The solution was simple: we added a visual timeline that showed exactly the journey of the money (where it leaves from, when it&rsquo;s processed, when it arrives), personalized the message with the recipient&rsquo;s name, and added a &ldquo;confirmed&rdquo; state visible for 10 seconds after the operation. Abandonment at that step dropped to 12%.
        </p>
      </article>

      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Estás construyendo un producto financiero?"
          headlineEn="Building a financial product?"
          subEs="Nuestro equipo tiene experiencia comprobada en UX para fintech. Conversemos."
          subEn="Our team has proven UX experience in fintech. Let's talk."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogChromeCTA
          headlineEs="Ve nuestros casos en producción"
          headlineEn="See our production case studies"
          subEs="Productos fintech, banca y e-commerce que ya están generando resultados reales."
          subEn="Fintech, banking, and e-commerce products already driving real results."
          ctaEs="Ver portafolio"
          ctaEn="View portfolio"
          href="/portafolio"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="ux-fintech" slugs={["psicologia-adopcion", "mvp-escala", "influencia-sin-erosion"]} />
      </div>
    </main>
  )
}
