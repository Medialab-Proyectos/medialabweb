import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SIZE = 1024;

console.log('🚀 Iniciando la generación de imágenes OG premium...');

// ----------------------------------------------------
// 1. Cargar recursos base comunes
// ----------------------------------------------------

// Cargar Logo Corporativo MediaLab para la esquina superior izquierda
const logoPath = join(ROOT, 'public/logo.svg');
let logoPng = null;
if (existsSync(logoPath)) {
  try {
    const logoContent = readFileSync(logoPath, 'utf-8');
    logoPng = await sharp(Buffer.from(logoContent))
      .resize(180) // Ancho elegante de 180px
      .png()
      .toBuffer();
    console.log('✅ Logo corporativo MediaLab cargado y redimensionado.');
  } catch (e) {
    console.error('⚠️ Error al procesar el logo de MediaLab:', e.message);
  }
}

// ----------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------

// Crear el SVG con los estilos comunes
function createStyleDefs(accentColor) {
  return `<defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&amp;display=swap');
      .label {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 26px;
        font-weight: 600;
        fill: ${accentColor};
        letter-spacing: 4px;
        text-transform: uppercase;
      }
      .title-light {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 34px;
        font-weight: 300;
        fill: rgba(255, 255, 255, 0.85);
      }
      .title-bold {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 52px;
        font-weight: 700;
        fill: #ffffff;
      }
      .title-accent {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 52px;
        font-weight: 700;
        fill: ${accentColor};
      }
      .tagline {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 300;
        fill: rgba(255, 255, 255, 0.4);
        letter-spacing: 1.5px;
      }
    </style>
    
    <!-- Filtro de resplandor de neón premium -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>`;
}

// ============================================================================
// GENERACIÓN 1: og-contact.png (Contacto - Enfoque de Personas/Colaboración)
// ============================================================================
async function generateContactOG() {
  const bgImgPath = join(ROOT, 'public/images/team-collaboration.png');
  const outputPath = join(ROOT, 'public/images/og-contact.png');

  if (!existsSync(bgImgPath)) {
    console.error(`❌ No se encontró la imagen de fondo para Contacto en: ${bgImgPath}`);
    return;
  }

  console.log('🔄 Generando og-contact.png (Contacto)...');

  // Redimensionar la foto de equipo a 1024x1024 como base
  const bgBuffer = await sharp(bgImgPath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
    .toBuffer();

  const overlaySvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente oscuro azul/teal premium para dar el toque dark sofisticado -->
      <radialGradient id="bg-gradient" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#02141F" stop-opacity="0.80"/>
        <stop offset="45%" stop-color="#010A10" stop-opacity="0.90"/>
        <stop offset="85%" stop-color="#000407" stop-opacity="0.97"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
      </radialGradient>
      
      <!-- Luminous glow ring bajo el chevron central -->
      <radialGradient id="badge-glow" cx="50%" cy="40%" r="30%">
        <stop offset="0%" stop-color="rgba(0, 229, 255, 0.16)"/>
        <stop offset="100%" stop-color="rgba(0, 229, 255, 0)"/>
      </radialGradient>
    </defs>
    
    ${createStyleDefs('#00E5FF')}

    <!-- Fondo de gradiente sobrepuesto con opacidad para fusionarse con la foto -->
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-gradient)"/>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#badge-glow)"/>

    <!-- Borde luminoso de neón turquesa corporativo -->
    <rect x="36" y="36" width="${SIZE - 72}" height="${SIZE - 72}" rx="24" ry="24"
          fill="none" stroke="rgba(0, 229, 255, 0.18)" stroke-width="1.5"/>

    <!-- Anillos concéntricos flotantes en el centro -->
    <circle cx="512" cy="420" r="220" fill="none" stroke="rgba(0, 229, 255, 0.08)" stroke-width="1"/>
    <circle cx="512" cy="420" r="205" fill="rgba(0, 130, 148, 0.05)"/>

    <!-- Chevron de la marca central en tamaño premium con resplandor -->
    <g transform="translate(425.6, 365.6) scale(1.6)" filter="url(#neon-glow)">
      <!-- Chevron izquierdo (Teal brillante) -->
      <path d="M35.5239 1.48203C30.9462 -0.616123 25.5927 1.32661 23.4201 5.91148L0.842044 54.48C-1.25283 59.0647 0.686867 64.5045 5.26457 66.6026C6.50596 67.1464 7.82497 67.4574 9.14396 67.4574C12.5578 67.4574 15.8941 65.5146 17.3683 62.1732L39.9464 13.6047C42.0413 9.01985 40.1015 3.65791 35.5239 1.48203Z" fill="#00E5FF"/>
      <!-- Chevron derecho (Naranja vibrante original) -->
      <path d="M104.968 51.9316L82.6874 6.28769C80.8241 2.40639 76.9427 0 72.6729 0H71.6638C67.4717 0 63.5901 2.40639 61.6493 6.21005L38.9032 51.854C35.1769 59.2284 40.6112 68 48.9177 68H49.4611C53.9638 68 58.0783 65.2831 59.786 61.0139L71.0427 33.2237C71.198 32.9133 71.5085 32.6803 71.8189 32.6803C72.1295 32.6803 72.5177 32.9133 72.5953 33.2237L84.6282 61.2466C86.4137 65.3608 90.4504 68 94.8754 68C103.182 68 108.539 59.3836 104.968 51.9316Z" fill="#F67327"/>
    </g>

    <!-- Brand label en la parte superior central -->
    <text x="512" y="120" text-anchor="middle" class="label">CONTACTO</text>
    <line x1="382" y1="140" x2="642" y2="140" stroke="rgba(0, 229, 255, 0.3)" stroke-width="1.5"/>

    <!-- Textos informativos de alta legibilidad en la parte inferior -->
    <text x="512" y="735" text-anchor="middle" class="title-light">Hablemos de tu producto digital</text>
    <text x="512" y="805" text-anchor="middle" class="title-bold">Agenda tu Discovery <tspan class="title-accent">Gratuito</tspan></text>
    
    <line x1="362" y1="845" x2="662" y2="845" stroke="rgba(0, 229, 255, 0.35)" stroke-width="2"/>
    
    <!-- Branding e Identidad inferior -->
    <text x="512" y="890" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.95)">Media<tspan font-weight="400" fill="rgba(255,255,255,0.6)">Lab</tspan></text>
    <text x="512" y="922" text-anchor="middle" class="tagline">UX Lab  ·  UX Factory  ·  UX School</text>
  </svg>`;

  const overlayBuffer = Buffer.from(overlaySvg);

  const composites = [
    {
      input: overlayBuffer,
      left: 0,
      top: 0
    }
  ];

  if (logoPng) {
    composites.push({
      input: logoPng,
      left: 70,
      top: 70
    });
  }

  await sharp(bgBuffer)
    .composite(composites)
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`✅ Imagen og-contact.png creada con éxito en: ${outputPath}`);
}

// ============================================================================
// GENERACIÓN 2: og-careers.png (Carreras - Enfoque de Personas/Crecimiento)
// ============================================================================
async function generateCareersOG() {
  const bgImgPath = join(ROOT, 'public/images/careers-team-culture.png');
  const outputPath = join(ROOT, 'public/images/og-careers.png');

  if (!existsSync(bgImgPath)) {
    console.error(`❌ No se encontró la imagen de fondo para Carreras en: ${bgImgPath}`);
    return;
  }

  console.log('🔄 Generando og-careers.png (Carreras)...');

  // Redimensionar la foto de cultura de equipo a 1024x1024 como base
  const bgBuffer = await sharp(bgImgPath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
    .toBuffer();

  const overlaySvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente oscuro cálido/bronceado sofisticado para complementar el naranja corporativo -->
      <radialGradient id="bg-gradient" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#1B0A02" stop-opacity="0.80"/>
        <stop offset="45%" stop-color="#0E0501" stop-opacity="0.90"/>
        <stop offset="85%" stop-color="#050100" stop-opacity="0.97"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
      </radialGradient>
      
      <!-- Luminous glow ring bajo el chevron central -->
      <radialGradient id="badge-glow" cx="50%" cy="40%" r="30%">
        <stop offset="0%" stop-color="rgba(246, 115, 39, 0.16)"/>
        <stop offset="100%" stop-color="rgba(246, 115, 39, 0)"/>
      </radialGradient>
    </defs>
    
    ${createStyleDefs('#F67327')}

    <!-- Fondo de gradiente sobrepuesto con opacidad para fusionarse con la foto -->
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-gradient)"/>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#badge-glow)"/>

    <!-- Borde luminoso de neón naranja corporativo -->
    <rect x="36" y="36" width="${SIZE - 72}" height="${SIZE - 72}" rx="24" ry="24"
          fill="none" stroke="rgba(246, 115, 39, 0.18)" stroke-width="1.5"/>

    <!-- Anillos concéntricos flotantes en el centro -->
    <circle cx="512" cy="420" r="220" fill="none" stroke="rgba(246, 115, 39, 0.08)" stroke-width="1"/>
    <circle cx="512" cy="420" r="205" fill="rgba(246, 115, 39, 0.05)"/>

    <!-- Chevron de la marca central en color neón naranja con resplandor -->
    <g transform="translate(425.6, 365.6) scale(1.6)" filter="url(#neon-glow)">
      <!-- Chevron izquierdo (Naranja neón brillante) -->
      <path d="M35.5239 1.48203C30.9462 -0.616123 25.5927 1.32661 23.4201 5.91148L0.842044 54.48C-1.25283 59.0647 0.686867 64.5045 5.26457 66.6026C6.50596 67.1464 7.82497 67.4574 9.14396 67.4574C12.5578 67.4574 15.8941 65.5146 17.3683 62.1732L39.9464 13.6047C42.0413 9.01985 40.1015 3.65791 35.5239 1.48203Z" fill="#FFA500"/>
      <!-- Chevron derecho (Naranja coral intenso original) -->
      <path d="M104.968 51.9316L82.6874 6.28769C80.8241 2.40639 76.9427 0 72.6729 0H71.6638C67.4717 0 63.5901 2.40639 61.6493 6.21005L38.9032 51.854C35.1769 59.2284 40.6112 68 48.9177 68H49.4611C53.9638 68 58.0783 65.2831 59.786 61.0139L71.0427 33.2237C71.198 32.9133 71.5085 32.6803 71.8189 32.6803C72.1295 32.6803 72.5177 32.9133 72.5953 33.2237L84.6282 61.2466C86.4137 65.3608 90.4504 68 94.8754 68C103.182 68 108.539 59.3836 104.968 51.9316Z" fill="#F67327"/>
    </g>

    <!-- Brand label en la parte superior central -->
    <text x="512" y="120" text-anchor="middle" class="label">CARRERAS</text>
    <line x1="382" y1="140" x2="642" y2="140" stroke="rgba(246, 115, 39, 0.3)" stroke-width="1.5"/>

    <!-- Textos informativos de alta legibilidad en la parte inferior -->
    <text x="512" y="735" text-anchor="middle" class="title-light">Diseña el futuro con nosotros</text>
    <text x="512" y="805" text-anchor="middle" class="title-bold">Únete al Equipo de <tspan class="title-accent">UX/UI + IA</tspan></text>
    
    <line x1="362" y1="845" x2="662" y2="845" stroke="rgba(246, 115, 39, 0.35)" stroke-width="2"/>
    
    <!-- Branding e Identidad inferior -->
    <text x="512" y="890" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.95)">Media<tspan font-weight="400" fill="rgba(255,255,255,0.6)">Lab</tspan></text>
    <text x="512" y="922" text-anchor="middle" class="tagline">UX Lab  ·  UX Factory  ·  UX School</text>
  </svg>`;

  const overlayBuffer = Buffer.from(overlaySvg);

  const composites = [
    {
      input: overlayBuffer,
      left: 0,
      top: 0
    }
  ];

  if (logoPng) {
    composites.push({
      input: logoPng,
      left: 70,
      top: 70
    });
  }

  await sharp(bgBuffer)
    .composite(composites)
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`✅ Imagen og-careers.png creada con éxito en: ${outputPath}`);
}

// ============================================================================
// GENERACIÓN 3: og-curso.png (Curso AI UX Architect - Alta Visibilidad UX School)
// ============================================================================
async function generateCursoOG() {
  const logoSrcPath = join(ROOT, 'public/images/ecosistema/school.svg');
  const outputPath = join(ROOT, 'public/images/og-curso.png');

  if (!existsSync(logoSrcPath)) {
    console.error(`❌ No se encontró el logo de UX School en: ${logoSrcPath}`);
    return;
  }

  console.log('🔄 Generando og-curso.png (Curso AI UX Architect)...');

  // 1. MODIFICAR EL SVG DEL LOGO EN MEMORIA PARA INVERTIR EL TEXTO E IMPACTAR
  // Reemplazamos el deep dark teal #023D4A con blanco puro #FFFFFF para que resalte.
  // Reemplazamos el medium teal #008294 con un cian eléctrico brillante #00E5FF.
  const rawSvgContent = readFileSync(logoSrcPath, 'utf-8');
  const modifiedSvgContent = rawSvgContent
    .replace(/fill="#023D4A"/g, 'fill="#FFFFFF"')
    .replace(/fill="#008294"/g, 'fill="#00E5FF"');

  // Redimensionar el logo modificado a un tamaño impactante (550px ancho)
  const LOGO_WIDTH = 550;
  const LOGO_HEIGHT = 135; // Manteniendo el ratio original del SVG (480x118)
  
  const logoBadgePng = await sharp(Buffer.from(modifiedSvgContent))
    .resize(LOGO_WIDTH, LOGO_HEIGHT)
    .png()
    .toBuffer();

  // 2. CREAR EL FONDO CON UN DISEÑO DE CÉLULA/RED DIGITAL EN NEÓN CIAN
  // Usamos un gradiente radial oscuro con un resplandor fuerte de neón cian detrás del logo
  const bgSvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente radial de cian-tecnológico a negro absoluto -->
      <radialGradient id="bg-gradient" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#00242B"/>
        <stop offset="35%" stop-color="#00161B"/>
        <stop offset="70%" stop-color="#00090B"/>
        <stop offset="100%" stop-color="#000203"/>
      </radialGradient>
      
      <!-- Fuerte resplandor detrás del logo de UX School -->
      <radialGradient id="neon-backglow" cx="50%" cy="42%" r="35%">
        <stop offset="0%" stop-color="rgba(0, 229, 255, 0.24)"/>
        <stop offset="60%" stop-color="rgba(0, 229, 255, 0.05)"/>
        <stop offset="100%" stop-color="rgba(0, 229, 255, 0)"/>
      </radialGradient>
    </defs>
    
    ${createStyleDefs('#00E5FF')}

    <!-- Renders de fondo -->
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-gradient)"/>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#neon-backglow)"/>

    <!-- Borde de neón elegante -->
    <rect x="36" y="36" width="${SIZE - 72}" height="${SIZE - 72}" rx="24" ry="24"
          fill="none" stroke="rgba(0, 229, 255, 0.22)" stroke-width="1.5"/>

    <!-- Anillos y guías circulares retro-futuristas de precisión -->
    <circle cx="512" cy="420" r="230" fill="none" stroke="rgba(0, 229, 255, 0.08)" stroke-width="1"/>
    <circle cx="512" cy="420" r="215" fill="rgba(0, 72, 85, 0.12)"/>

    <!-- Detalle de radar tecnológico / IA en las esquinas interiores -->
    <path d="M 60,60 L 90,60 M 60,60 L 60,90" fill="none" stroke="rgba(0, 229, 255, 0.25)" stroke-width="2"/>
    <path d="M 964,60 L 934,60 M 964,60 L 964,90" fill="none" stroke="rgba(0, 229, 255, 0.25)" stroke-width="2"/>
    <path d="M 60,964 L 90,964 M 60,964 L 60,934" fill="none" stroke="rgba(0, 229, 255, 0.25)" stroke-width="2"/>
    <path d="M 964,964 L 934,964 M 964,964 L 964,934" fill="none" stroke="rgba(0, 229, 255, 0.25)" stroke-width="2"/>

    <!-- Brand label en la parte superior central en español -->
    <text x="512" y="120" text-anchor="middle" class="label">ACADEMIA Y CERTIFICACIÓN</text>
    <line x1="220" y1="140" x2="804" y2="140" stroke="rgba(0, 229, 255, 0.3)" stroke-width="1.5"/>

    <!-- Textos informativos de alta legibilidad en la parte inferior -->
    <text x="512" y="735" text-anchor="middle" class="title-light">Certificación AI UX Architect</text>
    <text x="512" y="805" text-anchor="middle" class="title-bold">Diseña con IA en <tspan class="title-accent">8 Semanas</tspan></text>
    
    <line x1="362" y1="845" x2="662" y2="845" stroke="rgba(0, 229, 255, 0.35)" stroke-width="2"/>
    
    <!-- Branding e Identidad inferior -->
    <text x="512" y="890" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.95)">Media<tspan font-weight="400" fill="rgba(255,255,255,0.6)">Lab</tspan></text>
    <text x="512" y="922" text-anchor="middle" class="tagline">UX Lab  ·  UX Factory  ·  UX School</text>
  </svg>`;

  const bgBuffer = await sharp(Buffer.from(bgSvg))
    .resize(SIZE, SIZE)
    .png()
    .toBuffer();

  const composites = [
    // El logo de UX School modificado, súper legible y centrado en el medio
    {
      input: logoBadgePng,
      left: Math.round((SIZE - LOGO_WIDTH) / 2),
      top: Math.round(420 - LOGO_HEIGHT / 2),
    }
  ];

  if (logoPng) {
    composites.push({
      input: logoPng,
      left: 70,
      top: 70
    });
  }

  await sharp(bgBuffer)
    .composite(composites)
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`✅ Imagen og-curso.png creada con éxito en: ${outputPath}`);
}

// ----------------------------------------------------
// EJECUCIÓN PRINCIPAL
// ----------------------------------------------------
async function main() {
  try {
    await generateContactOG();
    await generateCareersOG();
    await generateCursoOG();
    console.log('\n🎉 ¡Proceso finalizado! Todas las imágenes OG cuadradas (1024x1024) han sido actualizadas exitosamente.');
  } catch (error) {
    console.error('❌ Error crítico durante la generación de las imágenes:', error);
  }
}

main();
