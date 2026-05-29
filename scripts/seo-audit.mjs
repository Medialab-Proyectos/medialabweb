import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const APP_DIR = join(ROOT, 'app');

console.log('🔍 Iniciando Auditoría SEO y OpenGraph de las páginas de MediaLab...');

// Buscar recursivamente todos los archivos page.tsx
function getPageFiles(dir, filesList = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      if (file !== 'api' && file !== '.next') {
        getPageFiles(fullPath, filesList);
      }
    } else if (file === 'page.tsx') {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const pageFiles = getPageFiles(APP_DIR);
console.log(`📄 Se encontraron ${pageFiles.length} rutas de páginas principales.`);

const auditResults = [];

for (const file of pageFiles) {
  const content = readFileSync(file, 'utf-8');
  const relPath = relative(ROOT, file).replace(/\\/g, '/');
  
  // Extraer propiedades individuales de la metadata con expresiones regulares robustas
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const descMatch = content.match(/description:\s*"([^"]+)"/s);
  
  // Alternates / Canonical
  const canonicalMatch = content.match(/canonical:\s*"([^"]+)"/);
  
  // OpenGraph
  const ogTitleMatch = content.match(/openGraph:\s*\{.*?title:\s*"([^"]+)"/s);
  const ogDescMatch = content.match(/openGraph:\s*\{.*?description:\s*"([^"]+)"/s);
  
  // Buscar imágenes en openGraph (busca urls y cadenas directas)
  const ogImageMatch = content.match(/images:\s*\[\s*(?:\{\s*url:\s*"([^"]+)"|["']([^"']+)["'])/s);
  const ogImageUrl = ogImageMatch ? (ogImageMatch[1] || ogImageMatch[2]) : null;

  // Twitter
  const twitterTitleMatch = content.match(/twitter:\s*\{.*?title:\s*"([^"]+)"/s);
  const twitterDescMatch = content.match(/twitter:\s*\{.*?description:\s*"([^"]+)"/s);
  const twitterImageMatch = content.match(/twitter:\s*\{.*?images:\s*\[\s*["']([^"']+)["']/s);
  const twitterImageUrl = twitterImageMatch ? twitterImageMatch[1] : null;

  const pageName = relPath.replace('app/', '').replace('/page.tsx', '');
  const displayName = pageName === 'page.tsx' ? '/' : `/${pageName}`;

  // 1. Validar Título SEO
  const title = titleMatch ? titleMatch[1] : null;
  const titleLen = title ? title.length : 0;
  let titleStatus = '✅ Correcto';
  if (titleLen === 0) titleStatus = '❌ Faltante';
  else if (titleLen > 70) titleStatus = `⚠️ Truncado (Largo: ${titleLen} car.)`;
  else if (titleLen > 60) titleStatus = `💡 Al límite (Largo: ${titleLen} car.)`;

  // 2. Validar Descripción SEO
  let desc = descMatch ? descMatch[1] : null;
  if (desc) desc = desc.replace(/\s+/g, ' ').trim();
  const descLen = desc ? desc.length : 0;
  let descStatus = '✅ Correcto';
  if (descLen === 0) descStatus = '❌ Faltante';
  else if (descLen > 160) descStatus = `⚠️ Truncado (Largo: ${descLen} car.)`;
  else if (descLen < 110) descStatus = `💡 Corto (Largo: ${descLen} car.)`;

  // 3. Validar Canonical
  const canonical = canonicalMatch ? canonicalMatch[1] : null;
  const canonicalStatus = canonical ? '✅ Correcto' : '❌ Faltante';

  // 4. Validar Imagen OpenGraph
  let ogImageStatus = '✅ Correcto';
  let ogFileExists = false;
  let ogDetails = 'N/A';
  if (!ogImageUrl) {
    ogImageStatus = '❌ Faltante';
  } else {
    // Resolver la ruta física del archivo
    const fullImgPath = join(ROOT, 'public', ogImageUrl);
    if (existsSync(fullImgPath)) {
      ogFileExists = true;
      try {
        const stats = statSync(fullImgPath);
        ogDetails = `Existe (${(stats.size / 1024).toFixed(0)} KB)`;
      } catch (e) {
        ogDetails = 'Existe';
      }
    } else {
      ogImageStatus = `❌ Roto (No existe archivo físico: ${ogImageUrl})`;
    }
  }

  // 5. Validar Imagen Twitter Card
  let twitterImageStatus = '✅ Correcto';
  if (!twitterImageUrl) {
    twitterImageStatus = '❌ Faltante';
  } else {
    const fullImgPath = join(ROOT, 'public', twitterImageUrl);
    if (!existsSync(fullImgPath)) {
      twitterImageStatus = `❌ Roto (No existe archivo físico)`;
    }
  }

  auditResults.push({
    file: relPath,
    route: displayName,
    title,
    titleLen,
    titleStatus,
    desc,
    descLen,
    descStatus,
    canonical,
    canonicalStatus,
    ogImageUrl,
    ogImageStatus,
    ogDetails,
    twitterImageUrl,
    twitterImageStatus
  });
}

// ----------------------------------------------------
// CONSTRUIR EL REPORTE EN MARKDOWN
// ----------------------------------------------------
let mdReport = `# Reporte de Auditoría SEO y OpenGraph — MediaLab Ingeniería

Este reporte analiza de manera exhaustiva todas las páginas de MediaLab (\`app/**/*.page.tsx\`) para asegurar que el SEO técnico de indexación (Títulos, Descripciones, Canonical Links y archivos de imágenes de OpenGraph y Twitter) cumpla con los estándares más exigentes (Google SERP constraints).

---

## 📊 Tabla Resumen General

| Ruta de Página | Título SEO | Desc. SEO | Canonical | Imagen OG | Imagen Twitter | Estado General |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

for (const res of auditResults) {
  let generalStatus = '✅ Listo';
  if (res.titleStatus.includes('❌') || res.descStatus.includes('❌') || res.canonicalStatus.includes('❌') || res.ogImageStatus.includes('❌') || res.twitterImageStatus.includes('❌')) {
    generalStatus = '❌ Requiere Atención';
  } else if (res.titleStatus.includes('⚠️') || res.descStatus.includes('⚠️') || res.titleStatus.includes('💡') || res.descStatus.includes('💡')) {
    generalStatus = '⚠️ Sugerencias de Optimización';
  }

  mdReport += `| **\`${res.route}\`** | ${res.titleStatus} | ${res.descStatus} | ${res.canonicalStatus} | ${res.ogImageStatus} | ${res.twitterImageStatus} | **${generalStatus}** |\n`;
}

mdReport += `
---

## 🔍 Análisis Detallado por Ruta

`;

for (const res of auditResults) {
  mdReport += `### Ruta: \`${res.route}\`
- **Archivo**: [${res.file}](file:///${ROOT.replace(/\\/g, '/')}/${res.file})
- **Título SEO**: 
  - Texto: \`${res.title || 'FALTANTE'}\`
  - Longitud: \`${res.titleLen} caracteres\` (Límite sugerido: 60, Truncación Google a los 70)
  - Estado: ${res.titleStatus}
- **Descripción SEO**: 
  - Texto: \`${res.desc || 'FALTANTE'}\`
  - Longitud: \`${res.descLen} caracteres\` (Rango ideal: 120-160, Truncación Google a los 160)
  - Estado: ${res.descStatus}
- **Enlace Canonical**: 
  - URL: \`${res.canonical || 'FALTANTE'}\`
  - Estado: ${res.canonicalStatus}
- **OpenGraph Image (Meta OG)**:
  - Ruta de Imagen: \`${res.ogImageUrl || 'FALTANTE'}\`
  - Archivo físico: \`${res.ogDetails}\`
  - Estado: ${res.ogImageStatus}
- **Twitter Card Image**:
  - Ruta de Imagen: \`${res.twitterImageUrl || 'FALTANTE'}\`
  - Estado: ${res.twitterImageStatus}

---
`;
}

const outputPath = 'C:\\Users\\coben\\.gemini\\antigravity-ide\\brain\\c6a5172f-7425-4094-a27e-8d97be49e26f\\seo_audit_results.md';
writeFileSync(outputPath, mdReport);

console.log(`\n🎉 Auditoría SEO completada con éxito. El reporte detallado se ha guardado en: ${outputPath}`);
