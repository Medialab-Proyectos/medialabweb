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
  title: { absolute: "Moriyasu UX: How to Design Interfaces for Users Under Pressure | MediaLab" },
  description:
    "Under pressure, a good interface doesn't explain more: it reduces ambiguity, shows what's urgent, and guides the next safe action. What a football whiteboard teaches about UX and behavioral design.",
  alternates: {
    canonical: "/en/blog/moriyasu-ux",
    languages: { es: "/blog/moriyasu-ux", en: "/en/blog/moriyasu-ux", "x-default": "/blog/moriyasu-ux" },
  },
  openGraph: {
    title: "Moriyasu UX: Designing Interfaces for When the User Can't Think Calmly",
    description:
      "A practical design pattern for moments of pressure: visible, minimal, actionable signals for users under stress who need to act fast.",
    type: "article",
    locale: "en_US",
    url: "/en/blog/moriyasu-ux",
    publishedTime: "2026-07-03T08:00:00-05:00",
    modifiedTime: "2026-07-03T08:00:00-05:00",
    authors: ["Christian Benavides"],
    images: [{ url: "/images/blog-moriyasu-ux.png", width: 1200, height: 630, alt: "Moriyasu UX — designing under pressure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moriyasu UX: Designing Interfaces for Users Under Pressure",
    description: "Under pressure, a good interface doesn't explain more: it reduces ambiguity and guides the next action.",
    images: ["/images/blog-moriyasu-ux.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Moriyasu UX: Designing Interfaces for When the User Can't Think Calmly",
  description:
    "A practical design pattern for high-pressure moments: visible, minimal, actionable signals for users under stress. Inspired by coach Hajime Moriyasu's whiteboard.",
  image: ["https://medialab.design/images/blog-moriyasu-ux.png"],
  datePublished: "2026-07-03T08:00:00-05:00",
  dateModified: "2026-07-03T08:00:00-05:00",
  author: { "@type": "Person", name: "Christian Benavides", url: "https://www.zeroui.me/" },
  publisher: {
    "@type": "Organization",
    name: "MediaLab Ingeniería",
    logo: { "@type": "ImageObject", url: "https://medialab.design/logo.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://medialab.design/en/blog/moriyasu-ux" },
  inLanguage: "en",
  articleSection: "UX & Human Behavior",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medialab.design/en" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://medialab.design/en/blog" },
    { "@type": "ListItem", position: 3, name: "Moriyasu UX", item: "https://medialab.design/en/blog/moriyasu-ux" },
  ],
}

export default function BlogMoriyasuUXPageEN() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/blog-moriyasu-ux.png" alt="Moriyasu UX: designing interfaces for users under pressure" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto dark-hero-text">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ background: "#8b5cf6" }}>
              UX &amp; Human Behavior
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance">
            Moriyasu UX: designing interfaces for when the user can&rsquo;t think calmly
          </h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-white/80">
            What a whiteboard in a football match teaches us about UX, behavioral design, and decision-making under pressure.
          </p>
          <BlogChromeMeta dateEs="Julio 2026" dateEn="July 2026" readMin={11} />
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <BlogChromeBackLink />
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
          In UX we talk a lot about clarity, consistency, accessibility, and reducing friction. These are necessary principles. But one question is often left out of the conversation: <strong className="font-semibold text-foreground">what happens when the user isn&rsquo;t calm?</strong> When they&rsquo;re scared, tired, short on time, made a mistake, or need to decide fast.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Most interfaces are designed as if the user were seated, with a good connection, reading everything carefully. But real life doesn&rsquo;t work like that: people use digital products while driving, caring for someone, making an urgent payment, or uploading a document before a deadline. That&rsquo;s where an interesting idea appears: the so-called <strong className="font-semibold text-foreground">Moriyasu method</strong>. It wasn&rsquo;t born in a design school or in Silicon Valley. It comes from football. And that&rsquo;s exactly why it&rsquo;s so useful.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">What is the Moriyasu method?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The &ldquo;Moriyasu method&rdquo; became popular thanks to a practice by Japanese coach Hajime Moriyasu: using an <strong className="font-semibold text-foreground">analog whiteboard with large numbers</strong> to communicate critical information to his players in high-pressure moments. It&rsquo;s not a formal UX or sports-theory doctrine; it&rsquo;s a label for a concrete practice: communicating from the sideline, through simple visual signals, relevant information like the time remaining or abbreviated instructions.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The explanation was simple: several players couldn&rsquo;t clearly see the stadium clock or hear the bench. So the coaching staff turned a critical variable —time— into a large, direct, shared visual signal. That&rsquo;s <strong className="font-semibold text-foreground">design</strong>: not graphic, not decorative, but as <em className="italic text-foreground">mediation between information, context, and action</em>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The big lesson for UX</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The main lesson isn&rsquo;t &ldquo;use big numbers.&rdquo; It&rsquo;s this:
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#8b5cf6" }}>
          &ldquo;When a person is under stress, the interface should show the minimum needed to make the next correct decision.&rdquo;
        </blockquote>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Under pressure, more information doesn&rsquo;t mean more clarity: often it means more cognitive load. A user under stress doesn&rsquo;t analyze like a calm one. They <strong className="font-semibold text-foreground">scan, recognize patterns, look for signals.</strong> They want to know what&rsquo;s happening and what to do now. So an interface designed for stress can&rsquo;t behave like a dashboard full of options: it must behave like a <strong className="font-semibold text-foreground">critical signal</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The problem with many of today&rsquo;s interfaces</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Many experiences fail because they&rsquo;re designed to <strong className="font-semibold text-foreground">organize functions, not to guide decisions</strong>. A user stranded on the road, low on battery and worried, opens their app and sees: History, Maintenance, Workshops, Insurance, Profile, Documents, Requests, Parts, Quotes, Notifications. From an information-architecture standpoint it looks complete. From a human-experience standpoint it&rsquo;s a disaster. <strong className="font-semibold text-foreground">The user doesn&rsquo;t need to navigate. They need to solve.</strong>
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The question shouldn&rsquo;t be &ldquo;where do we put each function?&rdquo; but rather: <em className="italic text-foreground">what does this person need to understand in the next 10 seconds to feel safe and act well?</em> That&rsquo;s the difference between designing an interface and designing a behavioral experience.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Moriyasu UX: a conceptual proposal</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          We can call <strong className="font-semibold text-foreground">Moriyasu UX</strong> a design approach for high-pressure moments: <em className="italic text-foreground">designing visible, minimal, actionable signals for users who are under stress, with limited processing capacity and a need to act fast</em>. Its goal isn&rsquo;t to explain more. It&rsquo;s to <strong className="font-semibold text-foreground">reduce ambiguity</strong>. It doesn&rsquo;t try to show everything: it shows what changes the immediate decision.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Why this matters from cognitive psychology</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          When a person is under pressure, their mental capacity shrinks. <strong className="font-semibold text-foreground">Working memory has limits</strong>, and under stress, cognitive flexibility, executive control, and calm evaluation of alternatives all deteriorate. In an open match, a player attends to the ball, opponents, spaces, fatigue, instructions, and the pressure of the score. Asking them to also calculate the remaining time adds unnecessary load. The whiteboard <strong className="font-semibold text-foreground">externalizes that information</strong> so it doesn&rsquo;t compete with other mental demands.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The same happens in digital products. When someone is trying to upload a document before a deadline or resolve a declined payment, we shouldn&rsquo;t force them to read long text, interpret ten states, or compare several options. <strong className="font-semibold text-foreground">The interface should help them think less, not more.</strong>
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Designing for stress isn&rsquo;t manipulation</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Designing for tense moments doesn&rsquo;t mean creating false urgency or using fear. That would be manipulation. The correct approach is different: <strong className="font-semibold text-foreground">if the tension already exists, design should make it understandable and manageable.</strong>
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">Bad practice:</strong> &ldquo;Last chance! If you don&rsquo;t do this now, you&rsquo;ll lose everything.&rdquo; (exploits anxiety)</li>
          <li><strong className="font-semibold text-foreground">Good practice:</strong> &ldquo;Your request is due today at 5:00 p.m. You can submit it now or save your progress and finish later.&rdquo; (organizes the decision)</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Ethical behavioral design doesn&rsquo;t seek to control the user. It seeks to <strong className="font-semibold text-foreground">improve the conditions under which they decide</strong>.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Beyond Nielsen</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Nielsen&rsquo;s heuristics remain fundamental: visibility of system status, recognition over recall, error prevention, minimalism. The Moriyasu case&rsquo;s contribution is <strong className="font-semibold text-foreground">taking those principles to an extreme scenario</strong>: noise, pressure, fatigue, little time, low attention, and high cost of error. Moriyasu doesn&rsquo;t replace Nielsen; it <em className="italic text-foreground">operationalizes</em> several heuristics where clarity must be far more severe.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Nielsen says system status must be visible. Moriyasu UX asks: <strong className="font-semibold text-foreground">visible to whom, in what emotional state, with how much time, and under what pressure?</strong>
        </p>

        <div className="my-12 h-px w-full bg-border" />

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The 5 principles of Moriyasu UX</h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">1. One dominant signal.</strong> The interface must choose the variable that orders the action (time, risk, status, next step…). If everything shouts, nothing guides.</li>
          <li><strong className="font-semibold text-foreground">2. Information must become action.</strong> Not just &ldquo;Document pending&rdquo;: better &ldquo;1 document missing to submit your request: utility bill&rdquo; + CTA &ldquo;Upload bill.&rdquo; Signal and action coupled.</li>
          <li><strong className="font-semibold text-foreground">3. Fewer options at the critical moment.</strong> A critical screen: one primary action, one secondary alternative, and a safe exit. No more.</li>
          <li><strong className="font-semibold text-foreground">4. The user shouldn&rsquo;t remember what the system can show.</strong> Not &ldquo;complete the required documents,&rdquo; but &ldquo;you&rsquo;re missing 2 documents: utility bill and enrollment certificate.&rdquo;</li>
          <li><strong className="font-semibold text-foreground">5. The signal must be shared and consistent.</strong> Design systems should define a <em className="italic">grammar of critical states</em> (pending, in review, urgent, approved, rejected, expired, recoverable, irreversible). Consistency isn&rsquo;t aesthetics: it&rsquo;s cognitive speed.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Applied example: roadside assistance app</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The user is on the road and their vehicle stops. A traditional design greets them with &ldquo;What would you like to do?&rdquo; and seven options. Fine for normal navigation, but not for an emergency. With a Moriyasu UX approach, the app <strong className="font-semibold text-foreground">orders reality</strong>: first safety (&ldquo;Are you in a safe place?&rdquo;), then location (&ldquo;Share location and request help&rdquo;), then diagnosis and follow-up.
        </p>

        <figure className="my-10">
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl border border-border">
            <Image src="/images/blog-moriyasu-ejemplo.png" alt="Moriyasu UX example: an interface that orders the decision under pressure" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground text-center">
            The interface changes the <strong className="font-semibold text-foreground">dominant signal</strong> depending on the moment: first safety, then location, then waiting and follow-up.
          </figcaption>
        </figure>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          After requesting help, the critical variable changes: it&rsquo;s no longer safety, it&rsquo;s the <strong className="font-semibold text-foreground">wait</strong>. &ldquo;Assistance requested · Estimated time: 18 min · Your location has been shared,&rdquo; with the CTA &ldquo;View assistance status.&rdquo; That&rsquo;s Moriyasu UX: the interface changes the dominant signal according to the moment of tension.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Applied example: complex forms</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A rural user with low digital literacy must upload documents before a deadline. Instead of &ldquo;attach the required documents to continue,&rdquo; the dominant signal is <strong className="font-semibold text-foreground">&ldquo;you&rsquo;re missing 1 document: utility bill&rdquo;</strong> + CTA &ldquo;Upload bill,&rdquo; with contextual help (&ldquo;if you don&rsquo;t have it now, you can save your progress&rdquo;) and a safe exit (&ldquo;Save and continue later&rdquo;). The user doesn&rsquo;t have to interpret the whole process: they understand what&rsquo;s missing and what to do.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">How to evaluate an interface under stress</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          A classic usability test asks whether the user completed the task. A <strong className="font-semibold text-foreground">Moriyasu</strong> test adds harder questions:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li>Did the user understand what was urgent?</li>
          <li>Could they identify the next action without reading the whole screen?</li>
          <li>Did the interface reduce anxiety or increase it?</li>
          <li>Was the critical signal visible at a distance, in motion, or with distractions?</li>
          <li>Did they rely on their memory or on visible information?</li>
          <li>What error could they make under pressure, and how do they recover?</li>
        </ul>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Designing for stress means testing in less-than-ideal conditions: it&rsquo;s not enough to validate the screen in Figma — you have to ask how it behaves when the user is tired, rushed, or worried.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Five questions before designing a critical screen</h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-8">
          <li><strong className="font-semibold text-foreground">What is the user&rsquo;s real tension?</strong> Not the task: the tension (fear, urgency, financial pressure, fatigue, uncertainty).</li>
          <li><strong className="font-semibold text-foreground">What is the critical variable?</strong> The data that changes the immediate decision (time, missing document, risk, location, amount, consequence).</li>
          <li><strong className="font-semibold text-foreground">What information is unnecessary right now?</strong> Under stress, hiding the secondary can be a way to help.</li>
          <li><strong className="font-semibold text-foreground">What is the safe default action?</strong> The least risky path, not necessarily the most profitable for the business.</li>
          <li><strong className="font-semibold text-foreground">How does the user recover if they make a mistake?</strong> Under pressure errors increase: you need clear exits and simple recovery.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">The value for companies</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          This approach impacts metrics: <strong className="font-semibold text-foreground">less abandonment in critical flows, fewer upload errors, fewer support calls, better conversion, and greater trust</strong>. But the most important value is another: the user feels the product understands them exactly when they need it most. And trust is one of the most important metrics of any digital experience.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-12 mb-6">Conclusion: when the user doesn&rsquo;t need a complete interface</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The Moriyasu method doesn&rsquo;t need to become a trend to be useful. Its value is reminding us of something essential: a good experience isn&rsquo;t measured only when the user is calm, but <strong className="font-semibold text-foreground">when they&rsquo;re under pressure</strong>. In those moments, design must be less decorative and more behavioral. Less explanation, more signal. Fewer competing options, more clarity about the next action.
        </p>
        <blockquote className="border-l-4 pl-6 py-2 my-10 text-xl font-medium text-foreground italic" style={{ borderColor: "#8b5cf6" }}>
          &ldquo;In moments of tension, a good interface doesn&rsquo;t explain more: it reduces ambiguity, shows what&rsquo;s urgent, and guides the next safe action.&rdquo;
        </blockquote>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Because in critical moments, the user doesn&rsquo;t need a complete interface. They need an interface that <strong className="font-semibold text-foreground">helps them decide</strong>.
        </p>
        <BlogChromeAuthorLine />
      </article>

      {/* CTA footer */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        <BlogChromeCTA
          headlineEs="¿Tu producto acompaña al usuario cuando está bajo presión?"
          headlineEn="Does your product support users when they're under pressure?"
          subEs="Diseñamos flujos críticos que reducen ambigüedad y guían la siguiente acción — con investigación real, no suposiciones."
          subEn="We design critical flows that reduce ambiguity and guide the next action — with real research, not assumptions."
          ctaEs="Agendar llamada"
          ctaEn="Book a call"
          gradient="linear-gradient(90deg, #8b5cf6, #6d28d9)"
        />
        <BlogChromeCTA
          headlineEs="Formamos arquitectos de experiencias con IA"
          headlineEn="We train AI experience architects"
          subEs="Diseño conductual, psicología cognitiva e IA aplicada en nuestro programa AI User Experience Architect."
          subEn="Behavioral design, cognitive psychology, and applied AI in our AI User Experience Architect program."
          ctaEs="Ver curso"
          ctaEn="View course"
          href="/curso"
          gradient="linear-gradient(90deg, #2AABB3, #1d8a91)"
        />
        <BlogRelatedArticles currentSlug="moriyasu-ux" slugs={["el-gol-en-pausa", "arquitectura-percepcion", "trono-de-la-decision"]} />
      </div>
    </main>
  )
}
