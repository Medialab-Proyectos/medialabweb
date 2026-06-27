import type { Metadata, Viewport } from 'next'
import { Lato, Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { SkipToContent } from '@/components/skip-to-content'
import { CookieConsent } from '@/components/cookie-consent'
import 'flag-icons/css/flag-icons.min.css'
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

const jost = localFont({
  src: [
    { path: '../public/images/fuentes/jost-latin-400-normal.ttf', weight: '400', style: 'normal' },
    { path: '../public/images/fuentes/jost-latin-500-normal.ttf', weight: '500', style: 'normal' },
    { path: '../public/images/fuentes/jost-latin-600-normal.ttf', weight: '600', style: 'normal' },
    { path: '../public/images/fuentes/jost-latin-700-normal.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-jost',
  display: 'swap',
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
    default: 'Agencia UX con IA y Discovery de Producto | MediaLab Ingeniería',
    template: '%s | MediaLab Ingeniería',
  },
  description:
    'MediaLab diseña productos digitales que las personas aman: UX, IA y psicología del consumidor. Aceleramos tu discovery de producto de meses a días.',
  generator: 'Next.js',
  applicationName: 'MediaLab Ingeniería',
  appleWebApp: {
    title: 'MediaLab Ingeniería',
  },
  category: 'Design, Software, Artificial Intelligence, SEO',
  classification: 'UX/UI design agency, product design, software development, technical SEO, AEO/GEO',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'agencia UX UI Colombia', 'diseño UX con IA', 'AI UX agency',
    'AI product discovery', 'AI product design', 'UX Intelligence',
    'product discovery con IA', 'AI workflow optimization',
    'diseño de productos con IA 2026', 'diseño conductual',
    'agencia de diseño UX Bogotá', 'desarrollo de productos digitales B2B B2C',
    'UXBox discovery con IA', 'consultoría de innovación digital',
    'MVP para startups', 'diseño UX para fintech', 'CRO optimización de conversión',
    'SEO técnico para SaaS', 'diseño emocional B2C', 'experiencia B2B',
    'AEO answer engine optimization', 'GEO generative engine optimization',
    'curso UX con inteligencia artificial', 'AI User Experience Architect',
    'Zero UI Christian Benavides', 'behavioral UX design', 'AI UX Colombia',
  ],
  authors: [{ name: 'Christian Benavides', url: 'https://medialab.design' }],
  creator: 'MediaLab Ingeniería',
  publisher: 'MediaLab Ingeniería',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
  openGraph: {
    title: 'Agencia UX con IA y Discovery de Producto | MediaLab Ingeniería',
    description:
      'Productos digitales que las personas aman: UX, IA y psicología del consumidor. Aceleramos tu discovery de meses a días, validado con criterio humano.',
    url: 'https://medialab.design',
    siteName: 'MediaLab Ingeniería',
    locale: 'es_CO',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [
      {
        url: '/images/og-main-brand-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'MediaLab Ingeniería — Ingeniería de producto digital: UX, IA, Software y SEO técnico',
        type: 'image/png',
      },
      {
        url: '/images/og-image-gallery.png',
        width: 1024,
        height: 1024,
        alt: 'MediaLab Ingeniería — Laboratorio de diseño digital y equipo de trabajo',
        type: 'image/jpeg',
      },
      {
        url: '/images/team-collaboration.png',
        width: 1024,
        height: 1024,
        alt: 'Equipo MediaLab colaborando en diseño UX/UI',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MediaLabIng',
    creator: '@MediaLabIng',
    title: 'Agencia UX con IA y Discovery de Producto | MediaLab Ingeniería',
    description: 'Productos digitales que las personas aman: UX, IA y psicología del consumidor. Discovery de meses a días, validado con criterio humano.',
    images: ['/images/og-main-brand-1200x630.png'],
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
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M4P8P6QJ');
        `}</Script>
        {/* End Google Tag Manager */}
        {/* Google Analytics (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MYCY5YNEV9" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MYCY5YNEV9');
        `}</Script>
        {/* End Google Analytics */}
        <script dangerouslySetInnerHTML={{ __html: `if('scrollRestoration'in history){history.scrollRestoration='manual';}` }} />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="MediaLab (llms.txt)" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="MediaLab (llms-full.txt)" />
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
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
              image: [
                'https://medialab.design/images/og-main-brand-1200x630.png',
                'https://medialab.design/images/og-image-gallery.png',
                'https://medialab.design/images/team-collaboration.png',
                'https://medialab.design/images/ux-research.png',
                'https://medialab.design/images/service-ux-design-team.png',
                'https://medialab.design/images/service-ai-discovery-team.png',
              ],
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
              owns: [
                {
                  '@type': 'SoftwareApplication',
                  name: 'SinDeudas',
                  applicationCategory: 'FinanceApplication',
                  operatingSystem: 'Web, iOS, Android',
                  description:
                    'Plataforma propia de finanzas conductuales que ayuda a las personas a manejar sus finanzas entendiendo el rol psicológico del dinero.',
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Cumbreva',
                  url: 'https://cumbreva.medialab.design/',
                  applicationCategory: 'TravelApplication',
                  operatingSystem: 'Web, iOS, Android',
                  description:
                    'Plataforma propia de movilidad eléctrica que acompaña al conductor antes, durante y después de cada trayecto, convirtiendo rutas, autonomía y carga en decisiones simples.',
                },
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
              alternateName: ['MediaLab'],
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
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://medialab.design/blog?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
                {
                  '@type': 'CommunicateAction',
                  target: 'https://medialab.design/#contact',
                  name: 'Agendar llamada de discovery',
                },
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
                { '@type': 'SiteNavigationElement', position: 1, name: 'Servicios', description: 'Diseño UX/UI, Discovery con IA y Desarrollo de Software a medida', url: 'https://medialab.design/servicios' },
                { '@type': 'SiteNavigationElement', position: 2, name: 'Portafolio', description: 'Casos de éxito y productos digitales entregados', url: 'https://medialab.design/portafolio' },
                { '@type': 'SiteNavigationElement', position: 3, name: 'Curso UX + IA', description: 'Curso profesional de diseño UX con inteligencia artificial', url: 'https://medialab.design/curso' },
                { '@type': 'SiteNavigationElement', position: 4, name: 'Sobre Nosotros', description: 'Equipo, metodología y presencia global de MediaLab Ingeniería', url: 'https://medialab.design/sobre-nosotros' },
                { '@type': 'SiteNavigationElement', position: 5, name: 'Blog', description: 'Artículos sobre UX, IA, diseño conductual y productos digitales', url: 'https://medialab.design/blog' },
                { '@type': 'SiteNavigationElement', position: 6, name: 'Contacto', description: 'Agenda una llamada de discovery gratuita', url: 'https://medialab.design/contacto' },
              ],
            }),
          }}
        />
      </head>
      <body className={`${lato.variable} ${poppins.variable} ${jost.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M4P8P6QJ" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <SkipToContent />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem themes={["light", "dark", "warm", "pure-dark"]}>
          <LanguageProvider>
            {children}
            <CookieConsent />
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
