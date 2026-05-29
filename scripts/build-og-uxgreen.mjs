import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Set square dimensions to match all other OG images in the project (1024x1024)
const SIZE = 1024;

// Read the REAL SVG logo — NOT modified, trademark
const svgPath = join(ROOT, 'public/images/curso/logos/Green UX v 2.svg');
const svgContent = readFileSync(svgPath, 'utf-8');

// Resize SVG badge for the center of the square OG image
const BADGE_SIZE = 450;
const resizedSvg = svgContent
  .replace(/width="244"/, `width="${BADGE_SIZE}"`)
  .replace(/height="244"/, `height="${BADGE_SIZE}"`);

// Create the badge PNG from the real SVG
const badgePng = await sharp(Buffer.from(resizedSvg))
  .resize(BADGE_SIZE, BADGE_SIZE)
  .png()
  .toBuffer();

// Read MediaLab main logo SVG to place at the top-left or top-center (to match corporate identity)
const logoPath = join(ROOT, 'public/logo.svg');
let logoPng = null;
try {
  const logoContent = readFileSync(logoPath, 'utf-8');
  // Resize the MediaLab logo to be a elegant tag at the top
  logoPng = await sharp(Buffer.from(logoContent))
    .resize(180) // 180px width
    .png()
    .toBuffer();
} catch (e) {
  console.log('MediaLab logo not found, continuing without top logo asset');
}

// Build the background as an SVG (text + gradient + layout)
const bgSvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep premium green/black gradient -->
    <radialGradient id="bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#0c3524"/>
      <stop offset="35%" stop-color="#07251a"/>
      <stop offset="70%" stop-color="#041a12"/>
      <stop offset="100%" stop-color="#020e08"/>
    </radialGradient>
    
    <!-- Luminous glow behind the central badge -->
    <radialGradient id="glow" cx="50%" cy="45%" r="35%">
      <stop offset="0%" stop-color="rgba(16,134,77,0.22)"/>
      <stop offset="50%" stop-color="rgba(16,134,77,0.06)"/>
      <stop offset="100%" stop-color="rgba(16,134,77,0)"/>
    </radialGradient>
    
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&amp;display=swap');
      .label {
        font-family: 'Outfit', sans-serif;
        font-size: 18px;
        font-weight: 500;
        fill: #10864D;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .title-light {
        font-family: 'Outfit', sans-serif;
        font-size: 36px;
        font-weight: 300;
        fill: rgba(255, 255, 255, 0.7);
      }
      .title-bold {
        font-family: 'Outfit', sans-serif;
        font-size: 52px;
        font-weight: 700;
        fill: #ffffff;
      }
      .title-accent {
        font-family: 'Outfit', sans-serif;
        font-size: 52px;
        font-weight: 700;
        fill: #10864D;
      }
      .tagline {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 300;
        fill: rgba(255, 255, 255, 0.35);
        letter-spacing: 1px;
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>

  <!-- Subtle corporate border frame matching og-about -->
  <rect x="36" y="36" width="${SIZE - 72}" height="${SIZE - 72}" rx="24" ry="24"
        fill="none" stroke="rgba(16,134,77,0.15)" stroke-width="1.5"/>

  <!-- Luminous glow ring under badge -->
  <circle cx="512" cy="420" r="240" fill="none" stroke="rgba(16, 134, 77, 0.08)" stroke-width="1"/>
  <circle cx="512" cy="420" r="225" fill="rgba(6, 72, 52, 0.15)"/>

  <!-- Brand label at the top center -->
  <text x="512" y="115" text-anchor="middle" class="label">UXGreen™ Certification</text>
  <line x1="432" y1="135" x2="592" y2="135" stroke="rgba(16, 134, 77, 0.3)" stroke-width="1.5"/>

  <!-- Main copy at the bottom -->
  <text x="512" y="735" text-anchor="middle" class="title-light">Certificación de Sostenibilidad Digital</text>
  <text x="512" y="805" text-anchor="middle" class="title-bold">Eficiencia Digital <tspan class="title-accent">Sostenible</tspan></text>
  
  <line x1="362" y1="845" x2="662" y2="845" stroke="rgba(16, 134, 77, 0.35)" stroke-width="2"/>
  
  <!-- MediaLab Tagline bottom -->
  <text x="512" y="890" text-anchor="middle" font-family="Outfit,sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.9)">Media<tspan font-weight="400" fill="rgba(255,255,255,0.6)">Lab</tspan></text>
  <text x="512" y="922" text-anchor="middle" class="tagline">UX Lab  ·  UX Factory  ·  UX School</text>
</svg>`;

// Create background PNG
const bgPng = await sharp(Buffer.from(bgSvg))
  .resize(SIZE, SIZE)
  .png()
  .toBuffer();

const composites = [
  // Center the real SVG badge
  {
    input: badgePng,
    left: Math.round((SIZE - BADGE_SIZE) / 2),
    top: 195, // Positioned beautifully in the upper-middle section
  }
];

// Add the MediaLab logo at the top left if available (matching og-about)
if (logoPng) {
  composites.push({
    input: logoPng,
    left: 70,
    top: 70,
  });
}

const outputPath = join(ROOT, 'public/images/og-uxgreen.png');

await sharp(bgPng)
  .composite(composites)
  .png({ quality: 95 })
  .toFile(outputPath);

console.log(`✅ OG image square (1024x1024) guardado en: ${outputPath}`);
console.log(`   Logo SVG original usado: ${svgPath}`);
