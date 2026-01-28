#!/usr/bin/env node
/**
 * Image File Renaming Script
 * Converts image filenames with spaces to URL-safe slugs
 * Example: "WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg" → "whatsapp-image-2026-01-23-1-01-54-pm.jpeg"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🖼️  IMAGE RENAMING SCRIPT\n');

const imageDir = path.join(__dirname, '../public/images/immersion');

if (!fs.existsSync(imageDir)) {
  console.error(`❌ Image directory not found: ${imageDir}`);
  process.exit(1);
}

// Function to generate URL-safe filename
function slugifyFilename(filename) {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  
  return name
    .toLowerCase()                    // lowercase
    .replace(/\s+/g, '-')             // spaces → hyphens
    .replace(/at\s+/g, '')            // remove "at "
    .replace(/pm|am/gi, 'pm')         // normalize pm/am
    .replace(/\([0-9]+\)/g, '')       // remove (1), (2), etc
    .replace(/-+/g, '-')              // collapse multiple hyphens
    .replace(/^-|-$/g, '')            // remove leading/trailing hyphens
    + ext;                            // add extension back
}

// Get all files
const files = fs.readdirSync(imageDir);
const renames = [];

files.forEach(file => {
  // Skip files already clean (no spaces)
  if (!file.includes(' ') && !file.includes('(')) {
    return;
  }
  
  const newName = slugifyFilename(file);
  
  // Skip if name didn't change
  if (newName === file) {
    return;
  }
  
  const oldPath = path.join(imageDir, file);
  const newPath = path.join(imageDir, newName);
  
  try {
    fs.renameSync(oldPath, newPath);
    renames.push({ old: file, new: newName });
    console.log(`✓ ${file}`);
    console.log(`  → ${newName}\n`);
  } catch (err) {
    console.error(`❌ Failed to rename ${file}: ${err.message}`);
  }
});

if (renames.length === 0) {
  console.log('ℹ️  No files needed renaming.\n');
  process.exit(0);
}

// Save mapping for code updates
const mapPath = path.join(__dirname, '../image-rename-map.json');
fs.writeFileSync(mapPath, JSON.stringify(renames, null, 2));

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Renamed ${renames.length} files`);
console.log(`📝 Mapping saved to: image-rename-map.json\n`);

console.log('Next steps:');
console.log('1. Run code update script: node scripts/update-image-references.js');
console.log('2. Update SmartImage component to enable responsive images');
console.log('3. Test locally: npm run dev');
console.log('4. Rebuild and deploy: npm run build\n');
