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
  title: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
  description:
    'MediaLab Ingeniería es una agencia de diseño UX, inteligencia artificial y diseño conductual que ayuda a empresas a crear productos digitales de alto impacto mediante diseño centrado en el humano y tecnología inteligente.',
  generator: 'Next.js',
  applicationName: 'MediaLab',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'diseño UX', 'diseño de productos con IA', 'diseño conductual', 
    'productos digitales', 'UXBox', 'product discovery', 'agencia UX Bogotá',
    'agencia IA Colombia', 'desarrollo de software a medida', 
    'consultoría de innovación', 'MVP', 'diseño para fintech'
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
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
    description:
      'MediaLab Ingeniería es una agencia de diseño UX, inteligencia artificial y diseño conductual que ayuda a empresas a crear productos digitales de alto impacto.',
    url: 'https://medialabingenieria.com',
    siteName: 'MediaLab Ingeniería',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaLab Ingeniería — Agencia de UX, IA y Diseño Conductual',
    description: 'Agencia especializada en crear productos de software innovadores combinando inteligencia artificial y diseño centrado en el usuario.',
    creator: '@MediaLabIng',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MediaLab Ingeniería',
              description:
                'Agencia de diseño UX, IA y diseño conductual especializada en crear productos digitales de alto impacto.',
              url: 'https://medialabingenieria.com',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${lato.variable} ${poppins.variable} font-sans antialiased`}>
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
