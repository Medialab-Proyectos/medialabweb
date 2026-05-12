import type { Metadata } from 'next'
import { Lato, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://medialabingenieria.com'),
  title: {
    default: 'MediaLab Ingeniería | Diseño UX/UI, IA, SEO y productos digitales B2B/B2C',
    template: '%s | MediaLab Ingeniería',
  },
  description:
    'Agencia de diseño UX/UI, IA, SEO técnico y desarrollo de productos digitales para empresas B2B y marcas B2C. Creamos experiencias humanas, indexables y medibles.',
  generator: 'Next.js',
  applicationName: 'MediaLab',
  category: 'Design, Software, Artificial Intelligence, SEO',
  classification: 'UX/UI design agency, product design, software development, technical SEO',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'agencia diseño UX/UI B2B B2C', 'diseño de productos con IA', 'diseño conductual', 
    'desarrollo de productos digitales', 'UXBox discovery', 'agencia UX Bogotá Colombia',
    'diseño de experiencias de usuario', 'desarrollo de software a medida', 
    'consultoría de innovación digital', 'MVP para startups', 'diseño para fintech',
    'experiencia del cliente CX', 'aumento de conversión CRO', 'SEO técnico para productos digitales',
    'diseño emocional B2C', 'experiencia B2B', 'rediseño UX para conversión'
  ],
  authors: [{ name: 'MediaLab Ingeniería', url: 'https://medialabingenieria.com' }],
  creator: 'MediaLab Ingeniería',
  publisher: 'MediaLab Ingeniería',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-CO': '/',
    },
  },
  openGraph: {
    title: 'MediaLab Ingeniería | Productos digitales que posicionan, conectan y convierten',
    description:
      'Diseño UX/UI, IA, SEO técnico y desarrollo de software para experiencias B2B y B2C humanas, indexables y orientadas a conversión.',
    url: 'https://medialabingenieria.com',
    siteName: 'MediaLab Ingeniería',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/images/ux-research.jpg',
        width: 1200,
        height: 630,
        alt: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaLab Ingeniería | UX, IA, SEO y productos digitales',
    description: 'Creamos experiencias B2B y B2C que posicionan, conectan emocionalmente y convierten con diseño centrado en el ser humano.',
    creator: '@MediaLabIng',
    images: ['/images/ux-research.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="MediaLab (llms.txt)" />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MediaLab Ingeniería',
              description:
                'Agencia experta en diseño UX/UI, inteligencia artificial y psicología del consumidor. Creamos productos digitales B2B y B2C que conectan emocionalmente con los usuarios y generan resultados comerciales medibles.',
              url: 'https://medialabingenieria.com',
              logo: 'https://medialabingenieria.com/logo.svg',
              foundingDate: '2020',
              areaServed: 'Worldwide',
              knowsAbout: ['UX Design', 'UI Design', 'Artificial Intelligence', 'Behavioral Design', 'Consumer Psychology', 'B2B Software', 'B2C Applications', 'Product Discovery', 'CRO'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'sales',
                availableLanguage: ['Spanish', 'English'],
              },
              sameAs: [
                'https://www.linkedin.com/company/medialab-ingenieria',
                'https://x.com/MediaLabIng',
                'https://www.instagram.com/medialabingenieria',
                'https://github.com/medialabingenieria',
              ],
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MediaLab Ingeniería',
              url: 'https://medialabingenieria.com',
              inLanguage: 'es-CO',
              description:
                'Sitio oficial de MediaLab Ingeniería, agencia de diseño UX/UI, IA, SEO técnico y desarrollo de productos digitales B2B y B2C.',
              publisher: {
                '@type': 'Organization',
                name: 'MediaLab Ingeniería',
                url: 'https://medialabingenieria.com',
              },
              potentialAction: {
                '@type': 'CommunicateAction',
                target: 'https://medialabingenieria.com/#contact',
                name: 'Agendar llamada de discovery',
              },
            }),
          }}
        />
        {/* ProfessionalService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'MediaLab Ingeniería',
              url: 'https://medialabingenieria.com',
              image: 'https://medialabingenieria.com/images/ux-research.jpg',
              logo: 'https://medialabingenieria.com/logo.svg',
              description:
                'Agencia especializada en diseño UX/UI, IA, SEO técnico, CRO, diseño conductual y desarrollo de software para productos digitales B2B y B2C.',
              areaServed: ['Colombia', 'Latinoamérica', 'United States', 'Worldwide'],
              serviceType: [
                'Diseño UX/UI',
                'SEO técnico',
                'Diseño de producto digital',
                'Desarrollo de software a medida',
                'Discovery de producto con IA',
                'CRO y optimización de conversión',
              ],
              audience: [
                { '@type': 'BusinessAudience', audienceType: 'Empresas B2B' },
                { '@type': 'Audience', audienceType: 'Marcas B2C y startups' },
              ],
              knowsAbout: [
                'User Experience',
                'Technical SEO',
                'Artificial Intelligence',
                'Behavioral Design',
                'Conversion Rate Optimization',
                'B2B SaaS',
                'B2C Applications',
              ],
            }),
          }}
        />
        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              serviceType: 'Diseño UX/UI y Desarrollo de Productos Digitales',
              provider: {
                '@type': 'Organization',
                name: 'MediaLab Ingeniería',
                url: 'https://medialabingenieria.com',
              },
              areaServed: 'Worldwide',
              description: 'Servicios de diseño UX/UI, inteligencia artificial y desarrollo de software a medida para empresas B2B y marcas B2C. Incluye discovery de producto con IA (UXBox), diseño conductual, arquitectura de experiencia emocional y optimización CRO.',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Servicios MediaLab',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UX y Diseño Conductual', description: 'Investigación UX, diseño de interacción, sistemas de diseño y estrategia de producto B2B/B2C' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Discovery con IA (UXBox)', description: 'Plataforma inteligente de descubrimiento de producto que comprime meses de definición en días' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desarrollo de Software a Medida', description: 'Plataformas web B2B, apps B2C, MVPs y arquitecturas escalables con React, Next.js y Node.js' } },
                ],
              },
            }),
          }}
        />
        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://medialabingenieria.com' },
                { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://medialabingenieria.com/#services' },
                { '@type': 'ListItem', position: 3, name: 'Metodología', item: 'https://medialabingenieria.com/#method' },
                { '@type': 'ListItem', position: 4, name: 'Industrias', item: 'https://medialabingenieria.com/#industries' },
                { '@type': 'ListItem', position: 5, name: 'Contacto', item: 'https://medialabingenieria.com/#contact' },
              ],
            }),
          }}
        />
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '¿Qué es UXBox y cómo ayuda a mi negocio?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'UXBox es nuestra plataforma inteligente de descubrimiento de producto potenciada por IA. Analiza tu idea y genera una propuesta de producto estructurada — incluyendo requisitos, estrategia UX y conceptos de diseño — en días en lugar de meses. Ideal tanto para líderes B2B que necesitan validar rápidamente como para fundadores B2C que quieren llegar antes al mercado.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cuánto tiempo toma el discovery de producto?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Con UXBox, el discovery de producto puede completarse en tan solo 3-5 días. Los procesos tradicionales toman semanas o meses. Nuestro enfoque acelerado por IA comprime ese tiempo dramáticamente, permitiendo a equipos B2B y B2C tomar decisiones informadas más rápido.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Con qué industrias y modelos de negocio trabajan?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Trabajamos con empresas B2B (SaaS, plataformas enterprise, fintech corporativa) y marcas B2C (e-commerce, apps de consumo, movilidad). Nuestras industrias incluyen Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Sostenibilidad y Plataformas Digitales.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Construyen plataformas digitales completas?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sí. Ofrecemos servicios end-to-end desde discovery y diseño UX/UI hasta desarrollo de software a medida. Construimos dashboards B2B, apps móviles B2C, MVPs para startups y plataformas empresariales escalables usando React, Next.js, Node.js e infraestructura cloud.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo inicio un proyecto con MediaLab?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'La forma más fácil es hacer clic en "Agenda tu llamada gratuita" y contarnos sobre tu idea. También puedes usar UXBox para enviar un brief estructurado. Nuestro equipo te contactará en 24 horas para una sesión de discovery gratuita — sin compromiso.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo garantizan que la experiencia conecte emocionalmente con los usuarios?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Aplicamos psicología del consumidor y diseño conductual en cada proyecto. Investigamos cómo piensan, sienten y deciden tus usuarios para diseñar experiencias que generen conexión emocional real — no solo flujos funcionales. Esto aplica tanto para productos B2C que buscan engagement como para plataformas B2B que necesitan eficiencia y satisfacción.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué diferencia a MediaLab de otras agencias UX?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tres diferenciadores: (1) UXBox — nuestra IA que comprime el discovery de producto 10x, (2) Enfoque en psicología del consumidor — no solo diseñamos interfaces bonitas, diseñamos para el comportamiento humano, y (3) Capacidad end-to-end — desde la investigación hasta el desarrollo de software, entregamos productos listos para el mercado.',
                  },
                },
              ],
            }),
          }}
        />
        {/* Book Schema for authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Book',
              name: 'Bienvenidos al Zero UI',
              subtitle: 'Diseño de experiencia consciente en la era de la inteligencia artificial',
              author: {
                '@type': 'Person',
                name: 'Christian Benavides',
                url: 'https://medialabingenieria.com',
              },
              publisher: {
                '@type': 'Organization',
                name: 'MediaLab Ingeniería',
              },
              datePublished: '2026-01',
              inLanguage: 'es',
              url: 'https://www.zeroui.me/',
              about: [
                'Diseño de Experiencia Consciente',
                'Zero UI',
                'Neurociencia del diseño',
                'IA Adaptativa',
                'Estoicismo digital',
              ],
            }),
          }}
        />
      </head>
      <body className={`${lato.variable} ${poppins.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Saltar al contenido principal
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
