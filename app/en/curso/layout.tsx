import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Experience Architect — UX Prompt Design Course | MediaLab",
  description:
    "Premium 8-week course: AI Experience Architect and UX Prompt Design. Learn to use AI as a strategic copilot to design, research, and build digital products. Only 30 seats. By MediaLab Ingeniería.",
  keywords: [
    "AI course for designers", "AI Experience Architect", "UX Prompt Design",
    "UX course with AI", "design with AI", "AI for UX/UI",
    "premium AI course", "AI strategic thinking", "AI and human design",
    "AI frameworks", "digital product with AI", "behavioral design course",
    "prompt engineering for UX", "MediaLab course", "generative AI for designers",
    "online AI design course", "AI digital product training",
  ],
  alternates: {
    canonical: "/en/curso",
    languages: {
      es: "/curso",
      en: "/en/curso",
      "x-default": "/curso",
    },
  },
  openGraph: {
    title: "AI Experience Architect — UX Prompt Design Course",
    description:
      "MediaLab premium course: 8 weeks to master AI as a strategic copilot in UX/UI design. 9 modules, 30 seats, professional certification.",
    type: "website",
    locale: "en_US",
    url: "/en/curso",
    images: [
      {
        url: "/images/curso/hero-designer.png",
        width: 1200,
        height: 630,
        alt: "AI Experience Architect — MediaLab Ingeniería Course",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Experience Architect — MediaLab",
    description: "8-week course: learn to use AI to design products with human judgment. Only 30 seats.",
    images: ["/images/curso/hero-designer.png"],
  },
}

export default function CursoEnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Course Schema (English) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "AI Experience Architect — UX Prompt Design",
            description:
              "Premium 8-week course for designers, developers, and startups. Learn to use AI as a strategic copilot with the methodology that delivers 90% productivity with 10% effort.",
            provider: {
              "@type": "Organization",
              name: "MediaLab Ingeniería",
              url: "https://medialab.design",
              logo: "https://medialab.design/logo.svg",
            },
            url: "https://medialab.design/en/curso",
            educationalLevel: "Intermediate",
            coursePrerequisites: "Basic experience in UX/UI design or product development",
            numberOfCredits: "9 modules",
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "Online",
              duration: "P8W",
              maximumAttendeeCapacity: 30,
              offers: {
                "@type": "Offer",
                price: "995",
                priceCurrency: "USD",
                availability: "https://schema.org/LimitedAvailability",
                validFrom: "2026-01-01",
              },
              instructor: {
                "@type": "Person",
                name: "Christian Benavides",
                jobTitle: "CEO & Founder",
                worksFor: {
                  "@type": "Organization",
                  name: "MediaLab Ingeniería",
                },
              },
            },
            teaches: [
              "UX Prompt Design",
              "Behavioral AI Design",
              "Generative AI for product design",
              "Decision frameworks with AI",
              "Behavioral design with AI",
            ],
            about: [
              "Artificial Intelligence for Design",
              "UX/UI",
              "Prompt Engineering",
              "Behavioral Design",
              "Digital Product",
            ],
            inLanguage: "en",
          }),
        }}
      />
      {children}
    </>
  )
}
