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
  title: { absolute: "We're No Longer Learning to Work — We're Learning to Direct Intelligences | MediaLab" },
  description:
    "The end of prompt engineering. How a decision in universities, a statement from Anthropic, and the Zero UI movement point to the same future: directing AI agents instead of executing tasks.",
  keywords: [
    "end of prompts",
    "prompt engineering",
    "AI agents",
    "AI loops",
    "Zero UI",
    "future of work",
    "AI orchestration",
    "systems thinking",
    "Boris Cherny",
    "Anthropic",
  ],
  alternates: {
    canonical: "/en/blog/dirigir-inteligencias",
    languages: {
      es: "/blog/dirigir-inteligencias",
      en: "/en/blog/dirigir-inteligencias",
      "x-default": "/blog/dirigir-inteligencias",
    },
  },
  openGraph: {
    title: "We're No Longer Learning to Work. We're Learning to Direct Intelligences",
    description:
      "The end of prompts. The next competitive edge won't be asking better — it will be building systems that think, learn, and act with you.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/dirigir-inteligencias",
    publishedTime: "2026-06-18T08:00:00-05:00",
    modifiedTime: "2026-06-18T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-dirigir-inteligencias-og-v2.png", width: 1200, height: 630, alt: "The end of prompts: directing intelligences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "We're No Longer Learning to Work. We're Learning to Direct Intelligences",
    description: "The end of prompts and the rise of AI orchestration.",
    images: ["/images/blog-dirigir-inteligencias-og-v2.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "We're No Longer Learning to Work. We're Learning to Direct Intelligences",
  alternativeHeadline: "The end of prompts: from executing tasks to directing AI agents",
  description:
    "How a decision in universities, a statement from Anthropic, and the Zero UI movement point to the same future: stop executing intellectual work and start orchestrating systems that do it.",
  image: ["https://medialab.design/images/blog-dirigir-inteligencias-og-v2.png"],
  datePublished: "2026-06-18T08:00:00-05:00",
  dateModified: "2026-06-18T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/dirigir-inteligencias" },
  inLanguage: "en",
  articleSection: "AI & Future of Work",
  keywords:
    "end of prompts, prompt engineering, AI agents, loops, Zero UI, future of work, orchestration, systems thinking",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "We're Learning to Direct Intelligences, Not to Work", item: "https://medialab.design/en/blog/dirigir-inteligencias" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is prompt engineering dying?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A prompt is still manual work: you instruct, the AI responds, and the process ends. The systems Anthropic, OpenAI, and other labs are building no longer work that way — they use agents and loops that receive objectives instead of instructions. Execution is being automated; what gains value is judgment, direction, and vision.",
      },
    },
    {
      "@type": "Question",
      name: "What is an AI loop or an AI agent?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A loop is an intelligence that keeps working when you stop. It doesn't receive instructions, it receives objectives. Instead of asking it to 'analyze this website,' you give it a goal like 'help me grow organic traffic,' and then it researches, analyzes, compares, proposes, corrects, tries again, learns, and repeats while you do something else.",
      },
    },
    {
      "@type": "Question",
      name: "What does Zero UI have to do with AI agents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Traditional interfaces — buttons, menus, forms — exist because the system needs constant human instructions. When systems start to understand objectives instead of clicks, the interface stops being the center of the experience. Zero UI argues that designing isn't creating interfaces, but designing states of consciousness: less friction and more intention.",
      },
    },
    {
      "@type": "Question",
      name: "What will be the most valuable skill of the next decade?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Probably not learning to use artificial intelligence, but learning to direct it: designing systems capable of thinking, learning, and acting with you, or even without you. The most productive professional of the future won't be the one who does the most work, but the one who builds the best systems for the work to happen.",
      },
    },
  ],
}

export default function BlogDirigirInteligenciasEnPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-dirigir-inteligencias-v2.png" alt="The end of prompts: learning to direct intelligences" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#2AABB3" }}>
              AI &amp; Future of Work
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            We&rsquo;re No Longer Learning to Work. We&rsquo;re Learning to Direct Intelligences
          </h1>
          <BlogChromeMeta dateEs="Junio 2026" dateEn="June 2026" readMin={9} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          How a decision in universities, a statement from Anthropic, and the{" "}
          <strong className="font-semibold text-foreground">Zero UI</strong> movement might all be pointing to the same future.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Just two years ago, the internet was obsessed with one skill: <strong className="font-semibold text-foreground">learning to write prompts</strong>. Thousands of courses promised to teach you how to talk to ChatGPT. Specialists, certifications, and new job titles appeared. It seemed logical: if artificial intelligence was going to change the world, the edge would be in knowing how to communicate with it.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          We say the printing press changed the world. But the printing press didn&rsquo;t change the world. <em className="italic text-foreground">Literacy</em> did.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          We say the internet changed the world. But the internet didn&rsquo;t change the world. <em className="italic text-foreground">Mass access to information</em> did.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Something similar is happening with artificial intelligence. We think the change is ChatGPT. It isn&rsquo;t. The change is that, for the first time in history, we can <strong className="font-semibold text-foreground">delegate intellectual work</strong>. Not physical tasks. Not calculations. Not storage. Intellectual work.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The end of the prompt paradigm</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A prompt is still manual work. Every time you type <em className="italic">&ldquo;summarize this document,&rdquo; &ldquo;analyze this report,&rdquo; &ldquo;create a marketing strategy,&rdquo;</em> or <em className="italic">&ldquo;design an interface,&rdquo;</em> you&rsquo;re still the operator. The AI responds, the process ends, and you start over.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          But the systems Anthropic, OpenAI, and other labs are building no longer work that way. Now we talk about <strong className="font-semibold text-foreground">agents</strong>. And after agents, we talk about <strong className="font-semibold text-foreground">loops</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What is a loop, really?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The technical explanation is boring. The human explanation is more interesting.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#2AABB3" }}>
          &ldquo;A loop is an intelligence that keeps working when you stop.&rdquo;
        </blockquote>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          It doesn&rsquo;t receive instructions. It receives objectives. You don&rsquo;t tell it &ldquo;analyze this website.&rdquo; You tell it <em className="italic text-foreground">&ldquo;help me grow organic traffic.&rdquo;</em> And then it researches, analyzes, compares, proposes, corrects, tries again, learns, and repeats. While you do something else.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Work is shifting: from doing it to orchestrating it</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Maybe the best way to understand it is to think about how a film director&rsquo;s role has changed. A director doesn&rsquo;t hold the camera. Doesn&rsquo;t control the lighting. Doesn&rsquo;t edit every scene. They coordinate systems, specialists, talent, and decisions.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The professional of the future might look a lot more like that:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>Less execution, <strong className="font-semibold text-foreground">more direction</strong>.</li>
          <li>Less production, <strong className="font-semibold text-foreground">more orchestration</strong>.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Why Zero UI matters far more than it seems</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Here a notion enters that usually stays out of the tech conversation. Most interfaces were designed for humans to operate systems: buttons, menus, forms, panels, settings. All of that exists because the system needs constant human instructions.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          But what happens when systems start to understand <strong className="font-semibold text-foreground">objectives</strong> instead of clicks? This is where the concept of <strong className="font-semibold text-foreground">Zero UI</strong> becomes relevant. Not because interfaces disappear, but because they stop being the center of the experience.
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#2AABB3" }}>
          &ldquo;Designing isn&rsquo;t creating interfaces. It&rsquo;s designing states of consciousness.&rdquo;
        </blockquote>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Human attention is becoming the scarcest resource in the digital economy. Every unnecessary button, every redundant screen, and every complex setting is a form of <strong className="font-semibold text-foreground">cognitive debt</strong>. The future isn&rsquo;t about building more interfaces. It&rsquo;s about building less friction and more intention.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The new skill no one is teaching</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Universities keep teaching tools. Companies keep hiring tools. Courses keep selling tools. But the market is starting to value something else: <strong className="font-semibold text-foreground">systems thinking</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Because when you have ten agents working for you, the problem stops being technical and becomes strategic. The question is no longer <em className="italic">&ldquo;how do I do this?&rdquo;</em> It&rsquo;s now <em className="italic text-foreground">&ldquo;what system should exist so that this happens automatically?&rdquo;</em>
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What Boris Cherny is really trying to say</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Many people read his statements as &ldquo;programmers are going to disappear.&rdquo; I don&rsquo;t think that&rsquo;s the message. In fact, Cherny himself has said that engineers matter more than ever, even as their work changes radically.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The message is different: <strong className="font-semibold text-foreground">execution is being automated. Judgment isn&rsquo;t. Direction isn&rsquo;t. Vision isn&rsquo;t. Responsibility isn&rsquo;t.</strong>
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The question that will define the next decade</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Twenty years ago the edge was having access to the internet. Ten years ago it was learning to code. Today it seems to be learning to use artificial intelligence. But maybe that isn&rsquo;t the right answer either.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Maybe the most valuable skill of the next decade will be <strong className="font-semibold text-foreground">designing systems capable of thinking, learning, and acting with you</strong>. Or even without you. Because the most productive professional of the future won&rsquo;t be the one who does the most work. It&rsquo;ll be the one who builds the best systems for the work to happen.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          And if the decisions of universities, the statements of Boris Cherny, and movements like Zero UI are all pointing in the same direction, then the future isn&rsquo;t about learning to use artificial intelligence. It&rsquo;s about learning to <strong className="font-semibold text-foreground">direct it</strong>.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Sources to go deeper</h2>
        <ul className="list-disc pl-6 space-y-2 text-base text-muted-foreground mb-8">
          <li>
            <a href="https://www.zeroui.me/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline decoration-[#2AABB3] underline-offset-4 hover:text-[#2AABB3] transition-colors">
              Zero UI Manifesto
            </a>{" "}
            — Christian Benavides&rsquo;s frictionless design manifesto.
          </li>
          <li>The Verge — interview with Boris Cherny (Anthropic) on how the engineer&rsquo;s role is changing.</li>
          <li>Business Insider — &ldquo;Thousands of AI Agents Overnight&rdquo;: the rise of autonomous agents.</li>
          <li>Reference communities: r/ClaudeAI, r/LocalLLaMA, r/singularity, and r/ArtificialIntelligence.</li>
        </ul>

        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu equipo ejecuta tareas o dirige sistemas?"
          headlineEn="Does your team execute tasks or direct systems?"
          subEs="Te ayudamos a rediseñar tus productos y procesos para que la IA trabaje en loops, no en prompts."
          subEn="We help you redesign your products and processes so AI works in loops, not prompts."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Formamos a quienes dirigen inteligencias"
          headlineEn="We train those who direct intelligences"
          subEs="Pensamiento sistémico, Zero UI e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Systems thinking, Zero UI, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="dirigir-inteligencias" slugs={["trono-de-la-decision", "arquitectura-percepcion", "influencia-sin-erosion"]} />
      </div>
    </main>
  )
}
