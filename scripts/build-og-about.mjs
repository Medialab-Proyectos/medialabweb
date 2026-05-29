import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SIZE = 1024;

console.log('🚀 Iniciando la actualización de og-about.png con los logos del ecosistema...');

const aboutPath = join(ROOT, 'public/images/og-about.png');
const labPath = join(ROOT, 'public/images/ecosistema/lab.svg');
const factoryPath = join(ROOT, 'public/images/ecosistema/Factory.svg');
const schoolPath = join(ROOT, 'public/images/ecosistema/school.svg');

if (!existsSync(aboutPath)) {
  console.error(`❌ No se encontró la imagen original en: ${aboutPath}`);
  process.exit(1);
}

// 1. CARGAR Y MODIFICAR LOS LOGOS DEL ECOSISTEMA EN MEMORIA
let labPng, factoryPng, schoolPng;

try {
  // UX Lab (Naranja - Usamos el color original ya que resalta perfecto)
  const labSvg = readFileSync(labPath, 'utf-8');
  labPng = await sharp(Buffer.from(labSvg))
    .resize(127, 42)
    .png()
    .toBuffer();
  console.log('✅ Logo de UX Lab cargado.');

  // UX Factory (Morado - Invertimos el texto oscuro a blanco para contraste)
  const factorySvg = readFileSync(factoryPath, 'utf-8');
  const modifiedFactorySvg = factorySvg.replace(/fill="#390B6A"/gi, 'fill="#FFFFFF"');
  factoryPng = await sharp(Buffer.from(modifiedFactorySvg))
    .resize(169, 42)
    .png()
    .toBuffer();
  console.log('✅ Logo de UX Factory cargado con texto invertido a blanco.');

  // UX School (Teal - Invertimos texto oscuro a blanco y teal medio a cian brillante)
  const schoolSvg = readFileSync(schoolPath, 'utf-8');
  const modifiedSchoolSvg = schoolSvg
    .replace(/fill="#023D4A"/gi, 'fill="#FFFFFF"')
    .replace(/fill="#008294"/gi, 'fill="#00E5FF"');
  schoolPng = await sharp(Buffer.from(modifiedSchoolSvg))
    .resize(171, 42)
    .png()
    .toBuffer();
  console.log('✅ Logo de UX School cargado con colores corregidos.');
} catch (e) {
  console.error('❌ Error al cargar los logos del ecosistema:', e.message);
  process.exit(1);
}

// 2. CREAR LA MÁSCARA OSCURA CON EL BRANDING "MediaLab"
// Cubrirá el texto antiguo de forma limpia difuminándose con un gradiente
const maskSvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradiente suave que va de transparente a negro para fundirse con el fondo -->
    <linearGradient id="mask-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#010609" stop-opacity="0"/>
      <stop offset="35%" stop-color="#010609" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
    </linearGradient>
  </defs>
  
  <!-- Rectángulo de máscara que oculta la línea de texto antigua -->
  <rect x="0" y="820" width="${SIZE}" height="204" fill="url(#mask-gradient)"/>
  
  <!-- Branding MediaLab central -->
  <text x="512" y="872" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.95)">Media<tspan font-weight="400" fill="rgba(255,255,255,0.6)">Lab</tspan></text>
</svg>`;

const maskPng = await sharp(Buffer.from(maskSvg))
  .png()
  .toBuffer();

// 3. COMPONER LA IMAGEN FINAL
try {
  const composites = [
    // 1. Colocar la máscara para borrar el texto antiguo
    {
      input: maskPng,
      left: 0,
      top: 0
    },
    // 2. UX Lab (Izquierda)
    {
      input: labPng,
      left: 233,
      top: 910
    },
    // 3. UX Factory (Centro)
    {
      input: factoryPng,
      left: 405,
      top: 910
    },
    // 4. UX School (Derecha)
    {
      input: schoolPng,
      left: 619,
      top: 910
    }
  ];

  const inputBuffer = readFileSync(aboutPath);
  await sharp(inputBuffer)
    .composite(composites)
    .png({ quality: 95 })
    .toFile(aboutPath);

  console.log(`\n🎉 ¡Felicidades! Se ha actualizado og-about.png correctamente en: ${aboutPath}`);
} catch (e) {
  console.error('❌ Error al guardar la imagen final compositada:', e.message);
  process.exit(1);
}
