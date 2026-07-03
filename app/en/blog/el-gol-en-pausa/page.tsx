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
  title: { absolute: "The Goal on Pause: VAR and Fan Emotion | MediaLab" },
  description:
    "A solution can be technically correct and emotionally damaging. How VAR is changing the emotion, attention, and behavior of the fan — and what it teaches us about designing technology.",
  alternates: {
    canonical: "/en/blog/el-gol-en-pausa",
    languages: {
      es: "/blog/el-gol-en-pausa",
      en: "/en/blog/el-gol-en-pausa",
      "x-default": "/blog/el-gol-en-pausa",
    },
  },
  openGraph: {
    title: "The Goal on Pause: How VAR Is Changing Fan Emotion",
    description:
      "When technology obsesses over being right, it can forget how it feels to use it. VAR as a case study in human experience.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/el-gol-en-pausa",
    publishedTime: "2026-06-30T08:00:00-05:00",
    modifiedTime: "2026-06-30T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-gol-en-pausa.png", width: 1200, height: 630, alt: "The goal on pause: VAR and fan emotion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Goal on Pause: VAR and Fan Emotion",
    description: "A solution can be technically correct and emotionally damaging.",
    images: ["/images/blog-gol-en-pausa.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Goal on Pause: How VAR Is Changing Fan Emotion, Attention, and Behavior",
  description:
    "A solution can be technically correct and emotionally damaging. VAR as a metaphor for technology that obsesses over being right and forgets how it feels to use it.",
  image: ["https://medialab.design/images/blog-gol-en-pausa.png"],
  datePublished: "2026-06-30T08:00:00-05:00",
  dateModified: "2026-06-30T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/el-gol-en-pausa" },
  inLanguage: "en",
  articleSection: "UX & Human Behavior",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "The Goal on Pause", item: "https://medialab.design/en/blog/el-gol-en-pausa" },
  ],
}

export default function BlogGolEnPausaPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-gol-en-pausa.png" alt="The goal on pause: VAR and fan emotion" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "var(--cyan, #2AABB3)" }}>
              UX &amp; Human Behavior
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            The Goal on Pause: How VAR Is Changing the Emotion, Attention, and Behavior of the Fan
          </h1>
          <BlogChromeMeta dateEs="Junio 2026" dateEn="June 2026" readMin={12} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          A goal used to be an immediate reaction. The ball went in, the body jumped, the throat screamed, and the celebration arrived before thought did. Today, the ball goes in, but the fan looks at the referee. On the screen appears a phrase that&rsquo;s now part of modern football: <strong className="font-semibold text-foreground">VAR Review</strong>. And in that instant, the goal stops being an emotion. It becomes a wait.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The case isn&rsquo;t Colombia. The case is all of us.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The goal disallowed for Colombia against Portugal for a razor-thin offside works as a perfect scene to understand the problem: a country goes from euphoria to frustration over an almost invisible detail. But this isn&rsquo;t an article about a match. It&rsquo;s an article about a <strong className="font-semibold text-foreground">new behavior</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          VAR is teaching the fan not to celebrate immediately. It&rsquo;s replacing a natural reaction with a conditioned one. Before, the body responded to the goal. Now the body waits for authorization. That change seems small, but it&rsquo;s enormous. Because football isn&rsquo;t just a sport of rules: it&rsquo;s an <em className="italic text-foreground">emotional system</em>. And when you alter the most important moment of that system —the goal— you alter the entire experience.
        </p>

        <figure className="my-10">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image src="/images/blog-gol-en-pausa-colombia.jpg" alt="Goal disallowed for Colombia against Portugal for a minimal offside" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground text-center">
            The goal disallowed for Colombia against Portugal: from euphoria to frustration over an almost invisible detail.
          </figcaption>
        </figure>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The data shows this isn&rsquo;t an isolated annoyance</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Criticism of VAR isn&rsquo;t explained only by fans frustrated after a loss. A Football Supporters&rsquo; Association survey published in 2026 found that <strong className="font-semibold text-foreground">91.7% of fans</strong> believe VAR has eliminated the spontaneous joy of celebrating goals. Only <strong className="font-semibold text-foreground">3.3%</strong> said the in-stadium experience is better with VAR. In addition, <strong className="font-semibold text-foreground">58%</strong> wanted to keep referee announcements in the stadium and <strong className="font-semibold text-foreground">47.2%</strong> supported a limited per-match challenge system.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          YouGov found in May 2026 that <strong className="font-semibold text-foreground">59%</strong> of Premier League fans think VAR works badly, versus <strong className="font-semibold text-foreground">26%</strong> who think it works well. <strong className="font-semibold text-foreground">72%</strong> of regular viewers feel it has made matches less enjoyable. And yet, only <strong className="font-semibold text-foreground">18%</strong> want to remove it entirely, while <strong className="font-semibold text-foreground">68%</strong> prefer to keep it, but with changes.
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;Fans aren&rsquo;t asking to return to error; they&rsquo;re asking to redesign the experience.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Celebration is no longer free</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The deepest change doesn&rsquo;t happen on the screen. It happens in the user&rsquo;s body. Before, the emotional sequence was simple: <strong className="font-semibold text-foreground">tension → attack → goal → scream → embrace → memory</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Now the sequence fragmented: <strong className="font-semibold text-foreground">tension → attack → goal → doubt → review → wait → anxiety → decision</strong>. VAR introduced a pause right at the highest point of emotion. And when an emotion is paused, it doesn&rsquo;t come back the same. Even if the goal ends up validated, the first explosion is already lost: the celebration arrives late, the collective energy cools, the embrace no longer springs from instinct but from an external confirmation.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Football became more exact, but less spontaneous</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The great argument in favor of VAR is precision, and it&rsquo;s true: some research indicates that refereeing accuracy can go from roughly <strong className="font-semibold text-foreground">92.1% to 98.3%</strong> with its implementation. But in user experience there&rsquo;s an uncomfortable truth:
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;A solution can be technically correct and emotionally damaging.&rdquo;
        </blockquote>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The system improves one metric —refereeing accuracy— but affects others just as important: spontaneity, rhythm, trust, clarity, celebration, and emotional continuity. Football lives a paradox: it can be more correct and feel worse.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The problem isn&rsquo;t the technology. It&rsquo;s the design of the interruption.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Goal-line technology generates almost no rejection because it responds fast, is clear, and doesn&rsquo;t break the emotional flow: the ball is in or it&rsquo;s out. VAR, by contrast, often feels like a black box. The fan doesn&rsquo;t always know what&rsquo;s being reviewed, how long is left, what the criterion is, or why a frozen image changes everything they just felt.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          That&rsquo;s where the real problem appears: <strong className="font-semibold text-foreground">interruption without explanation becomes frustration</strong>. In UX, when a system stops the user at the moment of greatest intent, it must offer immediate clarity. If it doesn&rsquo;t, the wait turns into anxiety. And in football that anxiety multiplies, because you&rsquo;re not waiting for just anything: you&rsquo;re waiting for the validation of a collective emotion.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">VAR changed spectator behavior</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          During a review, the user no longer just stares at the TV. They grab their phone, open social media, look for the replay, read comments, check memes, message the WhatsApp group, read journalists, hunt for someone to blame. Attention fragments.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          VAR doesn&rsquo;t just pause the game: it opens a parallel conversation. While the referee reviews, social media judges. The experience stops being linear. We no longer simply watch a match: we live an ecosystem of tension distributed across pitch, television, social media, chats, commentators, and algorithms.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Tension on social media confirms the emotional impact</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A study published in <em className="italic">PLOS ONE</em> analyzed <strong className="font-semibold text-foreground">643,251 tweets</strong> from <strong className="font-semibold text-foreground">129 Premier League matches</strong>, including <strong className="font-semibold text-foreground">94 VAR incidents</strong>. VAR-related tweets carried a more negative emotional charge than the rest, and that impact could extend <em className="italic text-foreground">after</em> the play.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          VAR doesn&rsquo;t just interrupt a moment: it can emotionally contaminate the rest of the experience. The user doesn&rsquo;t return to the match right away; they stay trapped in the controversy, the sense of injustice, or the doubt about the system. That makes it something more than a refereeing tool: a trigger of social conversation, frustration, and polarization.
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Doubt became part of the product</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Football always had controversy. But before, the controversy came <em className="italic">after</em> the play. Now it appears <em className="italic text-foreground">inside</em> the play. The goal no longer ends when the ball goes in: it ends when the system approves it.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          That transforms the fan&rsquo;s psychology. They learn not to fully trust what they saw, that their first emotion can be invalidated, that celebrating too soon can turn into embarrassment. Over time, they celebrate less intensely, wait more, suspect sooner, look at the referee before their teammate. VAR installed a new emotion in football: <strong className="font-semibold text-foreground">defensive celebration</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The fan isn&rsquo;t waiting for a decision. They&rsquo;re waiting for justice.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The VAR wait isn&rsquo;t neutral. When a person waits for an app to load, they get impatient. But when they wait for their country&rsquo;s goal to be confirmed, the wait touches something deeper: identity, belonging, memory, and justice. When a play is decided by invisible millimeters, a fracture appears between two kinds of justice:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Technical justice:</strong> the line says he was offside.</li>
          <li><strong className="font-semibold text-foreground">Perceived justice:</strong> that difference didn&rsquo;t look like a real advantage.</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          That&rsquo;s where much of the rejection is born. The user doesn&rsquo;t always feel the technology did justice. Sometimes they feel the technology found an excuse.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The fan&rsquo;s body also plays the match</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Sporting emotion isn&rsquo;t an opinion: it&rsquo;s a physical response. A study published in <em className="italic">Scientific Reports</em> collected smartwatch data from <strong className="font-semibold text-foreground">229 fans</strong> over about <strong className="font-semibold text-foreground">12 weeks</strong>. Stress was roughly <strong className="font-semibold text-foreground">41% higher</strong> on match day versus normal days, and average heart rate was higher for those in the stadium.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A review doesn&rsquo;t interrupt just a broadcast: it interrupts a physiological activation. The body was ready to discharge emotion, but the system asks it to wait. It&rsquo;s like stopping a wave right before it breaks. That&rsquo;s why the experience feels so unnatural: the goal is emotionally designed to be immediate, not to be administered.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What this phenomenon teaches about human behavior</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The user doesn&rsquo;t evaluate an experience by the final result alone. They evaluate the <em className="italic text-foreground">emotional path</em> they had to travel to reach that result. That&rsquo;s why a correct decision can feel unfair if:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>it arrives late,</li>
          <li>it isn&rsquo;t understood,</li>
          <li>it interrupts too much,</li>
          <li>it contradicts the user&rsquo;s perception,</li>
          <li>it doesn&rsquo;t explain its criterion,</li>
          <li>it punishes something that seems insignificant,</li>
          <li>it breaks a high-value emotional moment.</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The same principle applies to a financial app that blocks an account, an education platform that cancels progress, an AI that rejects a request without explaining, or a healthcare system that forces you to repeat a process. The lesson is clear: <strong className="font-semibold text-foreground">technology shouldn&rsquo;t just solve problems; it must care for the user&rsquo;s emotional state while solving them.</strong>
        </p>

        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "var(--cyan, #2AABB3)" }}>
          &ldquo;When technology obsesses over being right, it can forget how it feels to use it.&rdquo;
        </blockquote>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What football should learn</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The future shouldn&rsquo;t be football without technology, but football with better experience design. Well-applied technology should meet five principles:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Intervene less:</strong> if the error isn&rsquo;t clear, evident, and relevant, the experience should continue.</li>
          <li><strong className="font-semibold text-foreground">Explain better:</strong> the fan needs to know what&rsquo;s being reviewed, why, and under what criterion.</li>
          <li><strong className="font-semibold text-foreground">Respect emotional timing:</strong> emotion has a short window; if the review arrives late, the experience is already broken.</li>
          <li><strong className="font-semibold text-foreground">Measure emotional impact:</strong> not just goals and possession, but also frustration, comprehension, trust, and lost celebration.</li>
          <li><strong className="font-semibold text-foreground">Protect the goal:</strong> it&rsquo;s the emotional peak of the football product; any technology that touches it must do so with maximum care.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Conclusion: when celebrating needs permission</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          VAR shows one of the most important tensions of our era: the one between technological precision and human experience. On paper, technology promises justice; in practice, it often introduces waiting, suspicion, and frustration. The goal, which used to be an immediate explosion, can now become a question.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          And when the most exciting moment of football turns into an administrative pause, something deep breaks: trust in the first emotion, collective synchrony, the freedom to celebrate. Maybe the great challenge of modern football isn&rsquo;t to make technology see more, but to make it understand better what can&rsquo;t be easily measured: the scream, the embrace, the wait, the rage, the hope, and that small window where a goal stops being a play and becomes memory.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu tecnología cuida la emoción de quien la usa?"
          headlineEn="Does your technology care about how it feels to use it?"
          subEs="Diseñamos productos que resuelven sin romper el momento emocional del usuario — con investigación real, no suposiciones."
          subEn="We design products that solve without breaking the user's emotional moment — with real research, not assumptions."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogChromeCTA
          headlineEs="Formamos arquitectos de experiencias con IA"
          headlineEn="We train AI experience architects"
          subEs="Comportamiento humano, diseño conductual e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Human behavior, behavioral design, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #E8751A, #c65a10)"
        />
        <BlogRelatedArticles currentSlug="el-gol-en-pausa" slugs={["trono-de-la-decision", "influencia-sin-erosion", "psicologia-adopcion"]} />
      </div>
    </main>
  )
}
