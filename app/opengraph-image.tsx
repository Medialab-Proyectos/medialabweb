import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MediaLab Ingeniería — Ingeniería de producto digital'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(145deg, #0a0a0a 0%, #111111 50%, #0d1b1e 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,130,148,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(246,115,39,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #008294, #F67327)',
            display: 'flex',
          }}
        />

        {/* Logo mark — MA letters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: '#008294',
                letterSpacing: '-3px',
              }}
            >
              Media
            </span>
            <span
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: '#F67327',
                letterSpacing: '-3px',
              }}
            >
              Lab
            </span>
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, #008294, #F67327)',
            marginBottom: '28px',
            borderRadius: '2px',
            display: 'flex',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#e0e0e0',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '800px',
            display: 'flex',
          }}
        >
          Ingeniería de producto digital
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 400,
            color: '#888888',
            textAlign: 'center',
            marginTop: '16px',
            display: 'flex',
          }}
        >
          UX + IA + Psicología del consumidor + SEO técnico
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <span style={{ fontSize: '15px', color: '#555', fontWeight: 500, display: 'flex' }}>
            medialab.design
          </span>
          <span style={{ fontSize: '15px', color: '#333', display: 'flex' }}>|</span>
          <span style={{ fontSize: '15px', color: '#555', fontWeight: 500, display: 'flex' }}>
            B2B & B2C
          </span>
          <span style={{ fontSize: '15px', color: '#333', display: 'flex' }}>|</span>
          <span style={{ fontSize: '15px', color: '#555', fontWeight: 500, display: 'flex' }}>
            Bogotá, Colombia
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
