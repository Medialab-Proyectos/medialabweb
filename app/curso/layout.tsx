import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Experience Architect — Curso UX Prompt Design | MediaLab',
  description:
    'Curso premium de 8 semanas: AI Experience Architect y UX Prompt Design. Aprende a usar IA como copiloto estrategico para disenar, investigar y construir productos digitales. Solo 30 cupos. Por MediaLab Ingenieria.',
  keywords: [
    'curso IA para disenadores', 'AI Experience Architect', 'UX Prompt Design',
    'curso UX con inteligencia artificial', 'diseno con IA', 'IA para UX/UI',
    'curso premium IA', 'pensamiento estrategico IA', 'IA y diseno humano',
    'frameworks IA', 'producto digital con IA', 'curso diseno conductual',
    'prompt engineering para UX', 'curso MediaLab', 'IA generativa para disenadores',
    'curso online IA diseno', 'formacion IA producto digital',
  ],
  alternates: {
    canonical: '/curso',
    languages: {
      es: '/curso',
      en: '/en/curso',
      'x-default': '/curso',
    },
  },
  openGraph: {
    title: 'AI Experience Architect — Curso UX Prompt Design',
    description:
      'Curso premium de MediaLab: 8 semanas para dominar IA como copiloto estrategico en diseno UX/UI. 9 modulos, 30 cupos, certificacion profesional.',
    type: 'website',
    locale: 'es_CO',
    url: '/curso',
    images: [
      {
        url: '/images/curso/hero-designer.png',
        width: 1200,
        height: 630,
        alt: 'AI Experience Architect — Curso MediaLab Ingenieria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Experience Architect — MediaLab',
    description: 'Curso de 8 semanas: aprende a usar IA para disenar productos con criterio humano. Solo 30 cupos.',
    images: ['/images/curso/hero-designer.png'],
  },
}

export default function CursoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Course Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'AI Experience Architect — UX Prompt Design',
            description:
              'Curso premium de 8 semanas para disenadores, developers y startups. Aprende a usar IA como copiloto estrategico con la metodologia que logra 90% de productividad con 10% de esfuerzo.',
            provider: {
              '@type': 'Organization',
              name: 'MediaLab Ingenieria',
              url: 'https://medialab.design',
              logo: 'https://medialab.design/logo.svg',
            },
            url: 'https://medialab.design/curso',
            educationalLevel: 'Intermediate',
            coursePrerequisites: 'Experiencia basica en diseno UX/UI o desarrollo de producto',
            numberOfCredits: '9 modulos',
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'Online',
              duration: 'P8W',
              maximumAttendeeCapacity: 30,
              offers: {
                '@type': 'Offer',
                price: '995',
                priceCurrency: 'USD',
                availability: 'https://schema.org/LimitedAvailability',
                validFrom: '2026-01-01',
              },
              instructor: {
                '@type': 'Person',
                name: 'Christian Benavides',
                jobTitle: 'CEO & Founder',
                worksFor: {
                  '@type': 'Organization',
                  name: 'MediaLab Ingenieria',
                },
              },
            },
            teaches: [
              'UX Prompt Design',
              'Behavioral AI Design',
              'IA generativa para diseno de producto',
              'Frameworks de decision con IA',
              'Diseno conductual con inteligencia artificial',
            ],
            about: [
              'Inteligencia Artificial para Diseno',
              'UX/UI',
              'Prompt Engineering',
              'Diseno Conductual',
              'Producto Digital',
            ],
            inLanguage: 'es',
          }),
        }}
      />
      {children}
    </>
  )
}
