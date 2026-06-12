/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      // Experience Radar: migración /articulos → /mundial-2026 (especial Mundial 2026).
      {
        source: '/experience-radar/articulos',
        destination: '/experience-radar/mundial-2026',
        permanent: true,
      },
      {
        source: '/experience-radar/articulos/:slug',
        destination: '/experience-radar/mundial-2026/:slug',
        permanent: true,
      },
      {
        source: '/en/experience-radar/articulos',
        destination: '/en/experience-radar/world-cup-2026',
        permanent: true,
      },
      {
        source: '/en/experience-radar/articulos/:slug',
        destination: '/en/experience-radar/world-cup-2026/:slug',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // Favicons: short cache so Google picks up the new logo faster
        source: '/(favicon\\.ico|icon\\.svg|icon-.*\\.png|apple-icon\\.png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
