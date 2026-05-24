import type { Metadata, Viewport } from 'next'
import { Lato, Poppins } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { SkipToContent } from '@/components/skip-to-content'
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://medialab.design'),
  title: {
    default: 'MediaLab Ingeniería | Ingeniería de producto digital',
    template: '%s | MediaLab Ingeniería',
  },
  description:
    'Diseñamos productos digitales que las personas entienden, usan y recomiendan. UX, IA, software y SEO técnico B2B y B2C.',
  generator: 'Next.js',
  applicationName: 'MediaLab Ingeniería',
  category: 'Design, Software, Artificial Intelligence, SEO',
  classification: 'UX/UI design agency, product design, software development, technical SEO, AEO/GEO',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'agencia UX UI Colombia', 'diseño de productos con IA 2026', 'diseño conductual',
    'agencia de diseño UX Bogotá', 'desarrollo de productos digitales B2B B2C',
    'UXBox discovery con IA', 'consultoría de innovación digital',
    'MVP para startups', 'diseño UX para fintech', 'CRO optimización de conversión',
    'SEO técnico para SaaS', 'diseño emocional B2C', 'experiencia B2B',
    'AEO answer engine optimization', 'GEO generative engine optimization',
    'curso UX con inteligencia artificial', 'AI User Experience Architect',
    'Zero UI Christian Benavides',
  ],
  authors: [{ name: 'Christian Benavides', url: 'https://medialab.design' }],
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
      'es': '/',
      'en': '/en',
      'x-default': '/',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
  openGraph: {
    title: 'MediaLab Ingeniería | Ingeniería de producto digital',
    description:
      'UX, IA, software y SEO técnico para productos digitales que la gente entiende, usa y recomienda.',
    url: 'https://medialab.design',
    siteName: 'MediaLab Ingeniería',
    locale: 'es_CO',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MediaLab Ingeniería — Ingeniería de producto digital: UX, IA, Software y SEO técnico',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MediaLabIng',
    creator: '@MediaLabIng',
    title: 'MediaLab Ingeniería | Ingeniería de producto digital',
    description: 'Productos digitales que las personas entienden, usan y recomiendan. UX, IA, software y SEO técnico B2B y B2C.',
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
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
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="MediaLab (llms-full.txt)" />
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
              url: 'https://medialab.design',
              logo: 'https://medialab.design/images/logo-medialab-400.png',
              foundingDate: '2020',
              founder: {
                '@type': 'Person',
                name: 'Christian Benavides',
                jobTitle: 'CEO & Founder',
                sameAs: 'https://www.zeroui.me/',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bogotá',
                addressRegion: 'Cundinamarca',
                addressCountry: 'CO',
              },
              areaServed: ['CO', 'MX', 'AR', 'CL', 'PE', 'EC', 'US', 'ES'],
              knowsAbout: [
                'UX Design',
                'UI Design',
                'Artificial Intelligence',
                'Behavioral Design',
                'Consumer Psychology',
                'B2B SaaS',
                'B2C Applications',
                'Product Discovery',
                'CRO',
                'Technical SEO',
                'Answer Engine Optimization',
                'Generative Engine Optimization',
                'Zero UI',
              ],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  contactType: 'sales',
                  email: 'info@medialab.design',
                  telephone: '+57-305-400-9505',
                  availableLanguage: ['Spanish', 'English'],
                  areaServed: ['CO', 'MX', 'US', 'ES'],
                },
                {
                  '@type': 'ContactPoint',
                  contactType: 'customer support',
                  email: 'info@medialab.design',
                  availableLanguage: ['Spanish', 'English'],
                },
              ],
              sameAs: [
                'https://www.linkedin.com/company/medialab-ingenieria',
                'https://x.com/MediaLabIng',
                'https://www.instagram.com/medialabingenieria',
                'https://github.com/medialabingenieria',
                'https://www.zeroui.me/',
                'https://medium.com/@co.benavides86',
                'https://clutch.co/profile/medialab-ingenier',
                'https://www.goodfirms.co/company/medialab-ingenieria',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                bestRating: '5',
                worstRating: '1',
                ratingCount: '4',
                reviewCount: '4',
              },
              review: [
                {
                  '@type': 'Review',
                  datePublished: '2025-08-15',
                  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                  author: {
                    '@type': 'Person',
                    name: 'Alexander Naranjo',
                    jobTitle: 'CEO',
                    worksFor: { '@type': 'Organization', name: 'Metrics Lab' },
                    sameAs: 'https://www.linkedin.com/in/alexandernaranjo/',
                  },
                  reviewBody: 'MediaLab nos ayudó a construir una experiencia B2C que realmente conecta con nuestros usuarios. Su enfoque basado en datos y psicología del consumidor transformó nuestro producto digital.',
                },
                {
                  '@type': 'Review',
                  datePublished: '2025-11-20',
                  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                  author: {
                    '@type': 'Person',
                    name: 'Rosa Eugenia Beltrán',
                    jobTitle: 'Directora',
                    worksFor: { '@type': 'Organization', name: 'Funcicolombia & ESAF' },
                    sameAs: 'https://www.linkedin.com/in/rosa-eugenia-beltran-332408173/',
                  },
                  reviewBody: 'Trabajar con MediaLab en nuestras plataformas educativas y motores de aprendizaje fue un antes y un después. Entendieron la complejidad de nuestras necesidades institucionales y entregaron soluciones que realmente impactan.',
                },
                {
                  '@type': 'Review',
                  datePublished: '2026-01-10',
                  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                  author: {
                    '@type': 'Person',
                    name: 'Claudia Lazaneo',
                    jobTitle: 'Founder & CEO',
                    worksFor: { '@type': 'Organization', name: 'Vinnove' },
                    sameAs: 'https://www.linkedin.com/in/claudia-lazaneo/',
                  },
                  reviewBody: 'MediaLab entendió nuestra visión B2B desde el primer día. Nos ayudaron a construir una presencia digital sólida y proyectos que generan confianza con nuestros clientes corporativos.',
                },
                {
                  '@type': 'Review',
                  datePublished: '2026-03-05',
                  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                  author: {
                    '@type': 'Person',
                    name: 'Héctor Zuñiga',
                    jobTitle: 'CEO',
                    worksFor: { '@type': 'Organization', name: 'Global Talentech' },
                    sameAs: 'https://www.linkedin.com/in/hector-zd/',
                  },
                  reviewBody: 'MediaLab proporcionó una asesoría clara y dinámica que permitió a nuestros estudiantes desarrollar sus habilidades de manera efectiva. El proyecto fue todo un éxito — entregamos a tiempo, dentro del presupuesto, y el cliente quedó muy satisfecho con un diseño innovador y visualmente atractivo.',
                },
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
              alternateName: ['MediaLab', 'MediaLab Design', 'medialab.design'],
              url: 'https://medialab.design',
              inLanguage: ['es-CO', 'en'],
              description:
                'Sitio oficial de MediaLab Ingeniería. Diseñamos y desarrollamos productos digitales con UX, IA, software y SEO técnico.',
              publisher: {
                '@type': 'Organization',
                name: 'MediaLab Ingeniería',
                url: 'https://medialab.design',
              },
              potentialAction: [
                {
                  '@type': 'CommunicateAction',
                  target: 'https://medialab.design/#contact',
                  name: 'Agendar llamada de discovery',
                },
              ],
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
              url: 'https://medialab.design',
              image: 'https://medialab.design/images/og-image.png',
              logo: 'https://medialab.design/images/logo-medialab-400.png',
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
                url: 'https://medialab.design',
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
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://medialab.design' },
                { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://medialab.design/servicios' },
                { '@type': 'ListItem', position: 3, name: 'Portafolio', item: 'https://medialab.design/portafolio' },
                { '@type': 'ListItem', position: 4, name: 'Curso UX + IA', item: 'https://medialab.design/curso' },
                { '@type': 'ListItem', position: 5, name: 'Sobre Nosotros', item: 'https://medialab.design/sobre-nosotros' },
                { '@type': 'ListItem', position: 6, name: 'Blog', item: 'https://medialab.design/blog' },
                { '@type': 'ListItem', position: 7, name: 'Contacto', item: 'https://medialab.design/contacto' },
              ],
            }),
          }}
        />
        {/* SiteNavigationElement Schema — helps Google generate sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Main Navigation',
              itemListElement: [
                {
                  '@type': 'SiteNavigationElement',
                  position: 1,
                  name: 'Servicios',
                  description: 'Diseño UX/UI, Discovery con IA y Desarrollo de Software a medida',
                  url: 'https://medialab.design/servicios',
                },
                {
                  '@type': 'SiteNavigationElement',
                  position: 2,
                  name: 'Portafolio',
                  description: 'Casos de éxito y productos digitales entregados',
                  url: 'https://medialab.design/portafolio',
                },
                {
                  '@type': 'SiteNavigationElement',
                  position: 3,
                  name: 'Curso UX + IA',
                  description: 'Curso profesional de diseño UX con inteligencia artificial',
                  url: 'https://medialab.design/curso',
                },
                {
                  '@type': 'SiteNavigationElement',
                  position: 4,
                  name: 'Sobre Nosotros',
                  description: 'Equipo, metodología y presencia global de MediaLab Ingeniería',
                  url: 'https://medialab.design/sobre-nosotros',
                },
                {
                  '@type': 'SiteNavigationElement',
                  position: 5,
                  name: 'Blog',
                  description: 'Artículos sobre UX, IA, diseño conductual y productos digitales',
                  url: 'https://medialab.design/blog',
                },
                {
                  '@type': 'SiteNavigationElement',
                  position: 6,
                  name: 'Contacto',
                  description: 'Agenda una llamada de discovery gratuita',
                  url: 'https://medialab.design/contacto',
                },
              ],
            }),
          }}
        />
        {/* FAQ Schema — sincronizado con components/faq-section.tsx */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '¿Qué es UXBox y por qué debería importarme?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'UXBox es nuestra herramienta de IA que toma tu idea de producto y genera una propuesta estructurada — con requisitos, estrategia UX y conceptos de diseño — en días en lugar de meses. Si alguna vez sentiste que tu equipo lleva semanas definiendo sin avanzar, esto es para ti.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cuánto tiempo toma empezar a ver resultados reales?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Con UXBox, puedes tener claridad sobre tu producto en 3-5 días. Un primer prototipo validado, en 2-4 semanas. No te vamos a decir que todo toma meses — porque no tiene por qué.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Trabajan con empresas de mi industria?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Trabajamos con equipos en Fintech, Banca, Movilidad, Startups, Educación, E-commerce, Sostenibilidad y Plataformas Digitales. Si tu producto tiene usuarios — humanos que necesitan sentir confianza — podemos ayudarte.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Pueden construir mi producto completo o solo diseñan?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ambas. Hacemos todo el camino: investigación, diseño UX/UI y desarrollo de software a medida. Si solo necesitas diseño o solo desarrollo, también funciona. Nos adaptamos a lo que tu equipo necesite.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo empiezo si todavía no tengo claro lo que necesito?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ese es justo el punto de partida perfecto. Haz clic en "Quiero transformar mi producto" y te contactaremos en 24h para una sesión de discovery gratuita de 30 minutos. Saldrás con más claridad de la que tienes ahora. Sin compromiso.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Puedo integrarlos como parte de mi equipo?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sí, muchos de nuestros clientes nos integran como su equipo de producto externo. Trabajamos dentro de tus sprints, con tus herramientas y junto a tus desarrolladores. Es como tener un equipo senior de UX + Desarrollo sin el costo de contratación.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo sé que no van a diseñar algo bonito que nadie use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Porque empezamos investigando a tus usuarios, no dibujando pantallas. Cada decisión de diseño está respaldada por datos de comportamiento real. Diseñamos para que funcione primero — y que se vea increíble después.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué los hace diferentes de otras agencias UX?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tres cosas: (1) UXBox — IA que comprime tu discovery 10x, (2) investigamos cómo piensan tus usuarios antes de diseñar, y (3) hacemos todo end-to-end: investigación, diseño y desarrollo. No pasamos el trabajo a un tercero.',
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
                url: 'https://medialab.design',
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
        {/* LocalBusiness Schema for local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://medialab.design/#localbusiness',
              name: 'MediaLab Ingeniería',
              description:
                'Agencia de diseño UX/UI, inteligencia artificial y desarrollo de productos digitales en Bogotá. Especialistas en experiencias B2B y B2C.',
              url: 'https://medialab.design',
              logo: 'https://medialab.design/images/logo-medialab-400.png',
              image: 'https://medialab.design/images/og-image.png',
              telephone: '+57-305-400-9505',
              email: 'info@medialab.design',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bogotá',
                addressRegion: 'Cundinamarca',
                addressCountry: 'CO',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 4.711,
                longitude: -74.0721,
              },
              priceRange: '$$$',
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
              },
              sameAs: [
                'https://www.linkedin.com/company/medialab-ingenieria',
                'https://x.com/MediaLabIng',
                'https://www.instagram.com/medialabingenieria',
              ],
            }),
          }}
        />
      </head>
      <body className={`${lato.variable} ${poppins.variable} font-sans antialiased`}>
        <SkipToContent />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Script id="hotjar" strategy="afterInteractive">{`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:6715870,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</Script>
      </body>
    </html>
  )
}
