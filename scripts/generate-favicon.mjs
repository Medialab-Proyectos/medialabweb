/**
 * Generate a proper multi-size favicon.ico from the existing icon-192x192.png
 * Google requires at least 48x48px for search results display.
 * This generates 16x16, 32x32, 48x48, and 64x64 embedded in one .ico file.
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const inputPath = join(publicDir, 'icon-192x192.png');
const outputPath = join(publicDir, 'favicon.ico');

const sizes = [16, 32, 48, 64];

async function createIco() {
  const bitmaps = [];

  for (const size of sizes) {
    const pngBuffer = await sharp(inputPath)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    bitmaps.push({ size, buffer: pngBuffer });
  }

  // ICO file format: header + directory entries + image data
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = bitmaps.length;

  // Calculate offsets
  let dataOffset = headerSize + dirEntrySize * numImages;
  const entries = bitmaps.map(({ size, buffer }) => {
    const entry = { size, buffer, offset: dataOffset };
    dataOffset += buffer.length;
    return entry;
  });

  const totalSize = dataOffset;
  const ico = Buffer.alloc(totalSize);

  // ICO Header
  ico.writeUInt16LE(0, 0);      // Reserved
  ico.writeUInt16LE(1, 2);      // Type: 1 = ICO
  ico.writeUInt16LE(numImages, 4); // Number of images

  // Directory entries
  entries.forEach((entry, i) => {
    const pos = headerSize + i * dirEntrySize;
    ico.writeUInt8(entry.size >= 256 ? 0 : entry.size, pos);     // Width
    ico.writeUInt8(entry.size >= 256 ? 0 : entry.size, pos + 1); // Height
    ico.writeUInt8(0, pos + 2);            // Color palette
    ico.writeUInt8(0, pos + 3);            // Reserved
    ico.writeUInt16LE(1, pos + 4);         // Color planes
    ico.writeUInt16LE(32, pos + 6);        // Bits per pixel
    ico.writeUInt32LE(entry.buffer.length, pos + 8);  // Image size
    ico.writeUInt32LE(entry.offset, pos + 12);        // Image offset
  });

  // Image data (PNG format embedded in ICO)
  entries.forEach((entry) => {
    entry.buffer.copy(ico, entry.offset);
  });

  writeFileSync(outputPath, ico);
  console.log(`✅ Generated favicon.ico (${(totalSize / 1024).toFixed(1)}KB) with sizes: ${sizes.join(', ')}px`);
}

createIco().catch(console.error);
