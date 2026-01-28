#!/usr/bin/env node
/**
 * Update Image References Script
 * Automatically replaces old image filenames with new slugified names
 * Uses the mapping from rename-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔄 UPDATE IMAGE REFERENCES\n');

// Load rename map
const mapPath = path.join(__dirname, '../image-rename-map.json');

if (!fs.existsSync(mapPath)) {
  console.error('❌ image-rename-map.json not found');
  console.error('Run this first: node scripts/rename-images.js\n');
  process.exit(1);
}

const renameMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

if (renameMap.length === 0) {
  console.log('ℹ️  No renames to process.\n');
  process.exit(0);
}

// Files to update
const filesToUpdate = [
  'src/pages/Services.tsx',
  'src/pages/CaseStudy.tsx',
  'src/pages/Realisations.tsx',
  'src/pages/Politique.tsx',
  'src/pages/Projects.tsx',
  'src/pages/Home.tsx',
  'src/components/ui/HorizontalScrollCarousel.tsx',
  'src/data/caseStudies.ts',
  'src/components/ui/DiveIntoImageSection.tsx',
  'src/components/ui/HoverImageLinks.tsx'
];

let totalUpdates = 0;
let filesModified = [];

console.log(`Processing ${renameMap.length} renamed images...\n`);

renameMap.forEach(({ old, new: newName }) => {
  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, '../', filePath);
    
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Create regex to match old filename (handle encoding)
    // Match both encoded (%20) and unencoded versions
    const unencodedOld = old;
    const encodedOld = old.replace(/\s+/g, '%20');
    const regex1 = new RegExp(
      unencodedOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g'
    );
    const regex2 = new RegExp(
      encodedOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g'
    );
    
    const before = content;
    content = content.replace(regex1, newName);
    content = content.replace(regex2, newName);
    
    if (content !== before) {
      fs.writeFileSync(fullPath, content, 'utf8');
      totalUpdates++;
      
      if (!filesModified.includes(filePath)) {
        filesModified.push(filePath);
      }
    }
  });
});

console.log(`${'='.repeat(60)}`);
console.log(`✅ Updates complete\n`);
console.log(`📊 Statistics:`);
console.log(`  - Renames processed: ${renameMap.length}`);
console.log(`  - Files modified: ${filesModified.length}`);
console.log(`  - Total replacements: ${totalUpdates}`);

if (filesModified.length > 0) {
  console.log(`\n📝 Modified files:`);
  filesModified.forEach(f => console.log(`  - ${f}`));
}

console.log(`\n${'='.repeat(60)}`);
console.log('\nNext steps:');
console.log('1. Review the changes: git diff');
console.log('2. Test locally: npm run dev');
console.log('3. Enable responsive images in SmartImage component');
console.log('4. Rebuild: npm run build');
console.log('5. Verify Lighthouse: lighthouse http://localhost:3000\n');
