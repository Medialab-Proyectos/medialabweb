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
  title: 'MediaLab Ingeniería — Agencia experta en Diseño UX/UI, IA y Psicología del Consumidor',
  description:
    'Transformamos ideas en productos digitales que tus usuarios amarán (B2C) y que impulsarán el crecimiento de tu empresa (B2B). MediaLab Ingeniería es tu agencia aliada de innovación y diseño UX.',
  generator: 'Next.js',
  applicationName: 'MediaLab',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'agencia diseño UX/UI B2B B2C', 'diseño de productos con IA', 'diseño conductual', 
    'desarrollo de productos digitales', 'UXBox discovery', 'agencia UX Bogotá Colombia',
    'diseño de experiencias de usuario', 'desarrollo de software a medida', 
    'consultoría de innovación digital', 'MVP para startups', 'diseño para fintech',
    'experiencia del cliente CX', 'aumento de conversión CRO'
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
    title: 'MediaLab Ingeniería — Creamos productos digitales que conectan y convierten',
    description:
      'Transformamos ideas en productos digitales exitosos. Conectamos emocionalmente con tus usuarios y resolvemos los retos complejos de tu negocio mediante UX, IA y diseño conductual.',
    url: 'https://medialabingenieria.com',
    siteName: 'MediaLab Ingeniería',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaLab Ingeniería — Innovación en UX e Inteligencia Artificial',
    description: 'Creamos productos digitales B2B y B2C que tus usuarios amarán y tu negocio necesita. Descubre el poder del diseño centrado en el ser humano.',
    creator: '@MediaLabIng',
    images: ['/images/og-image.jpg'],
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
                  name: '¿Cómo garantizan que la experiencia conecte emocionalmente con mis usuarios?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Aplicamos principios de diseño conductual y psicología del consumidor en cada proyecto. Realizamos investigación de usuarios reales, mapeo de emociones (emotion mapping), pruebas de usabilidad y análisis de microinteracciones para asegurar que cada touchpoint genere confianza, satisfacción y engagement genuino.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué diferencia a MediaLab de otras agencias UX?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tres cosas nos hacen únicos: (1) Nuestra plataforma UXBox con IA que acelera el discovery 10x, (2) Nuestro enfoque en diseño conductual basado en psicología real del consumidor, y (3) Nuestra capacidad end-to-end de llevar un producto desde la idea hasta producción — todo bajo un mismo equipo.',
                  },
                },
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
