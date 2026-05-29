import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI User Experience Architect — Arquitecto de Experiencia de Usuario con IA | MediaLab',
  description:
    'Programa Arquitecto de Experiencia de Usuario con IA. Estructuración estratégica de productos digitales funcionales mediante metodologías UX/UI, análisis conductual y validación continua. 9 módulos, 30 cupos, certificación profesional. Por MediaLab Ingeniería.',
  keywords: [
    'AI User Experience Architect', 'Arquitecto de Experiencia de Usuario con IA',
    'curso UX con inteligencia artificial', 'diseño de producto digital con IA',
    'talento híbrido digital', 'product thinking con IA',
    'UX para frontend backend', 'reducción de retrabajo UX',
    'validación de producto digital', 'human-centered AI',
    'digital architecture UX', 'diseño conductual con IA',
    'curso universitario IA diseño', 'formación diseño experiencias',
    'producto digital funcional', 'metodología UX UI',
    'IA como copiloto estratégico', 'curso premium IA',
    'UX Prompt Design', 'curso diseño conductual',
    'prompt engineering para UX', 'curso MediaLab',
    'IA generativa para diseñadores', 'curso online IA diseño',
    'formación IA producto digital', 'diseño con IA Colombia',
    'curso arquitecto experiencia usuario', 'AI assisted design',
    'product design con inteligencia artificial',
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
    title: 'AI User Experience Architect — Arquitecto de Experiencia de Usuario con IA',
    description:
      'Programa Arquitecto de Experiencia de Usuario con IA de MediaLab: 9 módulos para estructurar, validar y optimizar productos digitales funcionales. 30 cupos, certificación profesional.',
    type: 'website',
    locale: 'es_CO',
    url: '/curso',
    images: [
      {
        url: '/images/curso/hero-designer.png',
        width: 1200,
        height: 630,
        alt: 'AI Experience Architect — Programa MediaLab Ingeniería',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI User Experience Architect — MediaLab',
    description: 'Programa de 9 módulos: estructura y valida productos digitales funcionales con IA. 30 cupos. Arquitecto de Experiencia de Usuario con IA.',
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
            name: 'AI User Experience Architect — Arquitecto de Experiencia de Usuario con IA',
            description:
              'Programa especializado en diseño de experiencias digitales impulsadas por inteligencia artificial, orientado a la construcción estratégica de productos digitales funcionales mediante metodologías UX/UI, análisis conductual y procesos de validación continua. La metodología permite acelerar la conceptualización y estructuración de aplicaciones digitales, fortaleciendo la relación entre diseño, negocio y desarrollo tecnológico, sin reemplazar los procesos avanzados de ingeniería de software.',
            provider: {
              '@type': 'Organization',
              name: 'MediaLab Ingeniería',
              url: 'https://medialab.design',
              logo: 'https://medialab.design/logo.svg',
            },
            url: 'https://medialab.design/curso',
            educationalLevel: 'Intermediate',
            coursePrerequisites: 'Profesionales de diseño, ingeniería, marketing, psicología, economía u otras disciplinas interesados en producto digital',
            numberOfCredits: '9 módulos',
            occupationalCategory: [
              'AI User Experience Architect',
              'UX Prompt Designer',
              'Digital Product Strategist',
            ],
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
                  name: 'MediaLab Ingeniería',
                },
              },
            },
            teaches: [
              'Arquitectura de experiencias digitales con IA',
              'Estructuración y validación de productos digitales funcionales',
              'Comunicación UX con equipos frontend y backend',
              'UX Prompt Design',
              'Behavioral AI Design',
              'IA generativa para diseño de producto',
              'Frameworks de decisión con IA',
              'Diseño conductual con inteligencia artificial',
              'Reducción de retrabajo en equipos técnicos',
              'Validación de producto antes de desarrollo complejo',
            ],
            about: [
              'Arquitectura de Experiencias Digitales',
              'Inteligencia Artificial para Diseño de Producto',
              'UX/UI',
              'Product Thinking',
              'Digital Architecture',
              'UX Strategy',
              'Human-Centered AI',
              'Diseño Conductual',
              'Validación de Producto Digital',
            ],
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'student',
              audienceType: 'Diseñadores UX/UI, Product Designers, Developers, Startups, CEOs, Emprendedores, estudiantes de Diseño Gráfico, Multimedia, Ingeniería de Sistemas, Ingeniería Electrónica, Ingeniería Industrial, Artes, Diseño Industrial, Psicología, Marketing, Sociología, Periodismo, Economía',
            },
            inLanguage: 'es',
          }),
        }}
      />
      {/* FAQPage Schema for course */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '¿El curso AI Experience Architect reemplaza al desarrollo de software?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. La metodología permite construir y validar productos digitales funcionales sin necesidad inmediata de desarrollo complejo, acelerando la toma de decisiones antes de inversión técnica avanzada. Cuando llegues a desarrollo, todo estará mejor preparado: menos retrabajo, mejores entregables, más claridad.',
                },
              },
              {
                '@type': 'Question',
                name: '¿El programa sirve para carreras fuera de diseño?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí. Es un puente entre Diseño, Producto, Tecnología, Innovación y Negocio. Sirve para 12+ carreras: Diseño Gráfico, Multimedia, Ingeniería de Sistemas, Ingeniería Electrónica, Ingeniería Industrial, Artes, Diseño Industrial, Psicología, Marketing, Sociología, Periodismo, Economía. Y para roles como CEOs, emprendedores y creadores de experiencias digitales.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué nivel de entregables tendré al finalizar?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Productos digitales funcionales listos para evolucionar hacia desarrollo real. No pantallas sueltas: un producto completo con estrategia, arquitectura UX, validación conductual, auditoría técnica y pruebas con usuarios reales.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Necesito saber programar para tomar el curso?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. La metodología funciona para profesionales de cualquier carrera que nunca han tocado código. Si eres developer, aún mejor — hay módulos que conectan tu background técnico con pensamiento de producto y UX.',
                },
              },
              {
                '@type': 'Question',
                name: '¿En qué se diferencia de un bootcamp de prompts?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Un bootcamp de prompts te enseña a escribir instrucciones para ChatGPT. Aquí aprendes arquitectura de experiencias digitales: cuándo usar IA, cuándo no, cómo estructurar productos, cómo conectar UX con desarrollo, cómo validar antes de invertir. Es la diferencia entre tener una herramienta y tener un sistema de pensamiento.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cuánto cuesta el programa AI Experience Architect?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El precio de prelanzamiento de la Cohorte 02 es $995 USD (precio regular $1,500 USD). Incluye 9 módulos, workshops en vivo, mentoría grupal, comunidad de por vida, herramientas premium y certificación. Garantía de devolución la primera semana. Cohorte 01 cerró con satisfacción 4.7/5.',
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'AI User Experience Architect — Programa MediaLab',
            url: 'https://medialab.design/curso',
            brand: {
              '@type': 'Organization',
              name: 'MediaLab Ingeniería',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              bestRating: '5',
              reviewCount: '4',
            },
            review: [
              {
                '@type': 'Review',
                author: { '@type': 'Person', name: 'Juan Pablo Morán' },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody:
                  'Me hizo replantear todo el onboarding. Ahora mi app es una herramienta de apoyo real, no solo un sistema técnico.',
                datePublished: '2026-05-01',
              },
              {
                '@type': 'Review',
                author: { '@type': 'Person', name: 'Jorge Pineda' },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody:
                  'Ha cambiado mucho el flujo de mi app. Uno se da cuenta de lo importante que es que todo esté en su sitio para que funcione.',
                datePublished: '2026-05-01',
              },
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Jonnathan Joseph Real Vaca',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody:
                  'El curso me enseñó a pensar en el usuario real, no solo en la funcionalidad. Gracias a eso, MedCheckin resuelve un problema que todos sufrimos pero nadie había atacado bien.',
                datePublished: '2026-05-01',
              },
              {
                '@type': 'Review',
                author: { '@type': 'Person', name: 'Mauricio Rojas' },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                reviewBody:
                  'Antes diseñaba pantallas bonitas, pero sin estrategia. Ahora entiendo cómo cada decisión de diseño impacta la adopción. Happy Food existe gracias a esa mentalidad.',
                datePublished: '2026-05-01',
              },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
