#!/usr/bin/env node
/**
 * Performance Check Script
 * Verifies bundle sizes, image optimization, and critical assets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📊 PERFORMANCE CHECK\n');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// ============= CHECK 1: Bundle Sizes =============
console.log('1. Checking bundle sizes...');

const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  checks.failed.push('dist/ directory not found. Run: npm run build');
} else {
  const files = {};
  
  function getFileSizes(dir, prefix = '') {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        getFileSizes(fullPath, prefix + file + '/');
      } else {
        const sizeKB = (stat.size / 1024).toFixed(2);
        files[prefix + file] = { bytes: stat.size, kb: sizeKB };
      }
    });
  }
  
  getFileSizes(distDir);
  
  // Check main JS bundle
  const jsFiles = Object.entries(files).filter(([name]) => name.includes('assets/') && name.endsWith('.js') && !name.endsWith('.map'));
  const mainJs = jsFiles.sort((a, b) => b[1].bytes - a[1].bytes)[0];
  
  if (mainJs) {
    const sizeKB = parseFloat(mainJs[1].kb);
    if (sizeKB < 500) {
      checks.passed.push(`✓ Main JS bundle: ${mainJs[1].kb} KB (< 500 KB gzipped est.)`);
    } else {
      checks.warnings.push(`⚠ Main JS bundle: ${mainJs[1].kb} KB (consider code-splitting)`);
    }
  }
  
  // Check CSS bundle
  const cssFiles = Object.entries(files).filter(([name]) => name.includes('assets/') && name.endsWith('.css'));
  const mainCss = cssFiles.sort((a, b) => b[1].bytes - a[1].bytes)[0];
  
  if (mainCss) {
    const sizeKB = parseFloat(mainCss[1].kb);
    if (sizeKB < 50) {
      checks.passed.push(`✓ Main CSS bundle: ${mainCss[1].kb} KB (< 50 KB gzipped est.)`);
    } else {
      checks.warnings.push(`⚠ Main CSS bundle: ${mainCss[1].kb} KB (may impact FCP)`);
    }
  }
  
  // Check HTML
  const htmlFile = files['index.html'];
  if (htmlFile) {
    const sizeKB = parseFloat(htmlFile.kb);
    checks.passed.push(`✓ HTML: ${htmlFile.kb} KB`);
  }
}

// ============= CHECK 2: Image Optimization =============
console.log('2. Checking image optimization...');

const imageDir = path.join(__dirname, '../public/images/immersion');
if (!fs.existsSync(imageDir)) {
  checks.warnings.push('⚠ Image directory not found: public/images/immersion');
} else {
  const files = fs.readdirSync(imageDir);
  const webpCount = files.filter(f => f.endsWith('.webp')).length;
  const jpgCount = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg')).length;
  const pngCount = files.filter(f => f.endsWith('.png')).length;
  
  if (webpCount > 0) {
    checks.passed.push(`✓ WebP images present: ${webpCount} files`);
  } else {
    checks.failed.push('✗ No WebP images found (required for modern format support)');
  }
  
  if (jpgCount > 0) {
    checks.passed.push(`✓ JPEG fallbacks present: ${jpgCount} files`);
  }
  
  if (pngCount > 0 && pngCount > webpCount / 2) {
    checks.warnings.push(`⚠ Many PNG files: ${pngCount} (consider converting to WebP)`);
  }
}

// ============= CHECK 3: Cache Headers in .htaccess =============
console.log('3. Checking .htaccess cache headers...');

const htaccessPath = path.join(__dirname, '../public/.htaccess');
if (!fs.existsSync(htaccessPath)) {
  checks.warnings.push('⚠ .htaccess not found at public/.htaccess (won\'t work without it on Bluehost)');
} else {
  const htaccess = fs.readFileSync(htaccessPath, 'utf8');
  
  if (htaccess.includes('max-age=31536000')) {
    checks.passed.push('✓ 1-year image cache configured');
  } else {
    checks.failed.push('✗ Image cache headers missing (add max-age=31536000)');
  }
  
  if (htaccess.includes('max-age=2592000')) {
    checks.passed.push('✓ 30-day asset cache configured');
  } else {
    checks.warnings.push('⚠ Asset cache headers missing (add max-age=2592000)');
  }
  
  if (htaccess.includes('gzip') || htaccess.includes('brotli')) {
    checks.passed.push('✓ Compression headers configured');
  } else {
    checks.warnings.push('⚠ Compression headers not found (enable gzip in cPanel)');
  }
}

// ============= CHECK 4: SmartImage Component =============
console.log('4. Checking SmartImage component...');

const smartImagePath = path.join(__dirname, '../components/ui/SmartImage.tsx');
if (!fs.existsSync(smartImagePath)) {
  checks.failed.push('✗ SmartImage component not found');
} else {
  const smartImage = fs.readFileSync(smartImagePath, 'utf8');
  
  if (smartImage.includes('getFallbackPath')) {
    checks.passed.push('✓ SmartImage has fallback support');
  }
  
  if (smartImage.includes('responsiveSizes')) {
    if (smartImage.includes('generateSrcSet')) {
      checks.passed.push('✓ SmartImage supports responsive images');
    }
  }
}

// ============= CHECK 5: Code Splitting =============
console.log('5. Checking code splitting...');

const distFiles = fs.readdirSync(path.join(distDir, 'assets'));
const jsChunks = distFiles.filter(f => f.endsWith('.js') && !f.endsWith('.map'));

if (jsChunks.length > 2) {
  checks.passed.push(`✓ Code splitting active: ${jsChunks.length} JS chunks`);
} else {
  checks.warnings.push(`⚠ Few JS chunks detected: ${jsChunks.length} (could split more for performance)`);
}

// ============= PRINT RESULTS =============
console.log('\n' + '='.repeat(60));
console.log('RESULTS\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED:');
  checks.passed.forEach(p => console.log('  ' + p));
  console.log();
}

if (checks.warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  checks.warnings.forEach(w => console.log('  ' + w));
  console.log();
}

if (checks.failed.length > 0) {
  console.log('❌ FAILED:');
  checks.failed.forEach(f => console.log('  ' + f));
  console.log();
  process.exit(1);
}

console.log('='.repeat(60));
console.log('\n✨ Pre-deployment checks complete!\n');
console.log('Next steps:');
console.log('  1. Run local Lighthouse: lighthouse http://localhost:3000 --view');
console.log('  2. Deploy to Bluehost');
console.log('  3. Verify cache headers with curl (see PERFORMANCE_AUDIT_PLAN.md)');
console.log('  4. Run production Lighthouse audit\n');
