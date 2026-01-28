# Performance Audit & Deployment Checklist

## Phase 1: Pre-Deployment Local Audit

### Step 1.1: Generate Lighthouse Reports (Local Dev)

```bash
# Install lighthouse CLI globally (if not already)
npm install -g lighthouse

# Build production bundle
npm run build

# Start local server on production bundle
# Using npx serve to simulate production
npx serve -s dist -l 3000
```

Then in a separate terminal:

```bash
# Mobile Lighthouse Audit
lighthouse http://localhost:3000 --view --emulated-form-factor=mobile --output=html --output-path=./lighthouse-mobile-pre.html

# Desktop Lighthouse Audit
lighthouse http://localhost:3000 --view --emulated-form-factor=desktop --output=html --output-path=./lighthouse-desktop-pre.html
```

**Expected Output Files:**
- `lighthouse-mobile-pre.html` - Mobile performance report
- `lighthouse-desktop-pre.html` - Desktop performance report

**Success Criteria:**
| Metric | Target | Pass/Fail |
|--------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5s | ⏳ |
| CLS (Cumulative Layout Shift) | < 0.1 | ⏳ |
| INP (Interaction to Next Paint) | < 100ms | ⏳ |
| Performance Score | ≥ 85 | ⏳ |

**Note:** Open the HTML reports in your browser to view detailed metrics.

---

### Step 1.2: Local Performance Verification

Create a Node script to verify bundle sizes and asset metrics:

```bash
# Create performance-check.js
node scripts/check-performance.js
```

Expected output:
```
✓ Main JS bundle: < 500KB gzipped
✓ CSS bundle: < 50KB gzipped
✓ Images optimized: .webp + .jpg fallbacks present
✓ Caching headers configured in .htaccess
```

---

## Phase 2: Post-Deployment Bluehost Verification

### Step 2.1: Prepare Deployment Files

**Files to upload to Bluehost (`public_html/`):**
```
dist/
  ├── index.html
  ├── assets/
  │   ├── *.js
  │   ├── *.css
  │   └── *.map
  └── (other assets)
  
public/
  ├── images/
  │   └── immersion/
  │       ├── *.webp
  │       ├── *.jpg
  │       └── *.jpeg
  └── .htaccess (CRITICAL - with Cache-Control headers)
```

**Before uploading:** Verify `.htaccess` is in `public_html/` with:
```apache
# Check that this section exists:
<IfModule mod_headers.c>
  <FilesMatch "\.(webp|jpg|jpeg|png|gif|avif)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.(js|css)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  <FilesMatch "\.html?$">
    Header set Cache-Control "public, max-age=86400, must-revalidate"
  </FilesMatch>
</IfModule>
```

---

### Step 2.2: Verify Cache Headers (Use These Exact Commands)

Run these from your local machine (or Bluehost terminal):

**1. Homepage HTML (expect 1 day cache):**
```bash
curl -I https://tmi-rdc.com/ 2>&1 | grep -i "cache-control\|content-encoding"
```

Expected output:
```
Cache-Control: public, max-age=86400, must-revalidate
Content-Encoding: gzip
```

**Pass Criteria:** ✓ `max-age=86400` and `Content-Encoding: gzip`

---

**2. JavaScript Asset (expect 30 days cache):**
```bash
curl -I https://tmi-rdc.com/assets/index-*.js 2>&1 | grep -i "cache-control\|content-encoding"
```

Expected output:
```
Cache-Control: public, max-age=2592000
Content-Encoding: gzip
```

**Pass Criteria:** ✓ `max-age=2592000` and `Content-Encoding: gzip`

---

**3. CSS Asset (expect 30 days cache):**
```bash
curl -I https://tmi-rdc.com/assets/index-*.css 2>&1 | grep -i "cache-control\|content-encoding"
```

Expected output:
```
Cache-Control: public, max-age=2592000
Content-Encoding: gzip
```

**Pass Criteria:** ✓ `max-age=2592000` and `Content-Encoding: gzip`

---

**4. WebP Image (expect 1 year cache + immutable):**
```bash
curl -I https://tmi-rdc.com/images/immersion/construction.webp 2>&1 | grep -i "cache-control\|content-type"
```

Expected output:
```
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/webp
```

**Pass Criteria:** ✓ `max-age=31536000, immutable` and correct Content-Type

---

**5. JPEG Image (expect 1 year cache + immutable):**
```bash
curl -I https://tmi-rdc.com/images/immersion/construction.jpg 2>&1 | grep -i "cache-control\|content-type"
```

Expected output:
```
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/jpeg
```

**Pass Criteria:** ✓ `max-age=31536000, immutable` and correct Content-Type

---

### Step 2.3: Full Deployment Verification Checklist

```bash
# Run this to check all headers at once (requires curl + grep)
echo "=== CACHE HEADERS VERIFICATION ==="
echo "1. HTML (1 day):"
curl -sI https://tmi-rdc.com/ | grep "Cache-Control"
echo "2. JS (30 days):"
curl -sI https://tmi-rdc.com/assets/index*.js | head -1 | grep "Cache-Control"
echo "3. CSS (30 days):"
curl -sI https://tmi-rdc.com/assets/index*.css | head -1 | grep "Cache-Control"
echo "4. WebP Image (1 year):"
curl -sI https://tmi-rdc.com/images/immersion/construction.webp | grep "Cache-Control"
echo "5. JPEG Image (1 year):"
curl -sI https://tmi-rdc.com/images/immersion/construction.jpg | grep "Cache-Control"
echo "=== COMPRESSION VERIFICATION ==="
echo "HTML Compression:"
curl -sI https://tmi-rdc.com/ | grep "Content-Encoding"
echo "JS Compression:"
curl -sI https://tmi-rdc.com/assets/index*.js | head -1 | grep "Content-Encoding"
```

---

### Step 2.4: Post-Deployment Lighthouse Audit

After uploading to Bluehost, run audits on live site:

```bash
# Mobile Audit (Production)
lighthouse https://tmi-rdc.com --view --emulated-form-factor=mobile --output=html --output-path=./lighthouse-mobile-post.html

# Desktop Audit (Production)
lighthouse https://tmi-rdc.com --view --emulated-form-factor=desktop --output=html --output-path=./lighthouse-desktop-post.html
```

**Compare Pre vs Post:**
```
| Metric | Pre-Deploy | Post-Deploy | Δ | Status |
|--------|-----------|-------------|---|--------|
| Mobile LCP | ? | ? | ? | ? |
| Mobile CLS | ? | ? | ? | ? |
| Mobile INP | ? | ? | ? | ? |
| Desktop LCP | ? | ? | ? | ? |
| Desktop CLS | ? | ? | ? | ? |
| Desktop INP | ? | ? | ? | ? |
```

**If metrics are worse post-deployment:**
- Check if .htaccess caching headers are active (Step 2.2)
- Verify gzip compression is enabled in Bluehost cPanel
- Check Content Delivery Network (CDN) settings if enabled
- Review Lighthouse report for specific bottlenecks

---

## Phase 3: Optional Future Optimization - Responsive Images

### Step 3.1: Rename Image Files (Remove Spaces)

Create a Node script to rename all image files with spaces:

**File:** `scripts/rename-images.js`

```javascript
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '../public/images/immersion');

// Get all files
const files = fs.readdirSync(imageDir);

let renamed = [];

files.forEach(file => {
  // Skip if no spaces in filename
  if (!file.includes(' ')) return;

  // Convert spaces to hyphens, lowercase
  const newName = file
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/\([0-9]+\)/g, '')    // remove (1), (2), etc
    .replace(/-+/g, '-')           // collapse multiple hyphens
    .toLowerCase();

  const oldPath = path.join(imageDir, file);
  const newPath = path.join(imageDir, newName);

  fs.renameSync(oldPath, newPath);
  renamed.push({ old: file, new: newName });

  console.log(`✓ Renamed: ${file} → ${newName}`);
});

// Write mapping to JSON for code updates
fs.writeFileSync(
  path.join(__dirname, '../image-rename-map.json'),
  JSON.stringify(renamed, null, 2)
);

console.log(`\n✓ Renamed ${renamed.length} files`);
console.log('✓ Mapping saved to: image-rename-map.json');
```

**Run:**
```bash
node scripts/rename-images.js
```

**Output:**
```
✓ Renamed: WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg → whatsapp-image-2026-01-23-1-01-54-pm.jpeg
✓ Renamed: WhatsApp Image 2026-01-23 at 1.01.43 PM.jpeg → whatsapp-image-2026-01-23-1-01-43-pm.jpeg
...
✓ Renamed 47 files
✓ Mapping saved to: image-rename-map.json
```

---

### Step 3.2: Update All Code References

Create a script to automatically update all image paths in components/pages:

**File:** `scripts/update-image-references.js`

```javascript
const fs = require('fs');
const path = require('path');

// Load rename map
const renameMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../image-rename-map.json'), 'utf8')
);

// Files to search/update
const filesToUpdate = [
  'src/pages/Services.tsx',
  'src/pages/CaseStudy.tsx',
  'src/pages/Realisations.tsx',
  'src/pages/Politique.tsx',
  'src/pages/Projects.tsx',
  'src/components/ui/HorizontalScrollCarousel.tsx',
  'src/data/caseStudies.ts'
];

let updateCount = 0;

renameMap.forEach(({ old, new: newName }) => {
  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, '../', filePath);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    const oldRegex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    
    if (oldRegex.test(content)) {
      content = content.replace(oldRegex, newName);
      fs.writeFileSync(fullPath, content, 'utf8');
      updateCount++;
      console.log(`✓ Updated: ${filePath}`);
    }
  });
});

console.log(`\n✓ Total updates: ${updateCount} files modified`);
```

**Run:**
```bash
node scripts/update-image-references.js
```

---

### Step 3.3: Update SmartImage Component for Responsive Images

After renaming files, enable responsive srcset in SmartImage:

**File:** `components/ui/SmartImage.tsx`

Replace the component with:

```tsx
import React, { useMemo } from "react";

export type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: "high" | "low" | "auto";
  responsiveSizes?: boolean;
  forGrid?: boolean;
};

function getWebPPath(src: string | undefined, size: number | null = null): string | undefined {
  if (!src) return src;
  
  if (src.toLowerCase().endsWith('.webp')) {
    if (size) return src.replace(/\.webp$/i, `_${size}px.webp`);
    return src;
  }
  
  if (src.toLowerCase().endsWith('.jpg') || src.toLowerCase().endsWith('.jpeg')) {
    return src;
  }
  
  const ext = /\.(png|gif)$/i;
  if (ext.test(src)) {
    const base = src.replace(ext, '');
    if (size) return `${base}_${size}px.webp`;
    return `${base}.webp`;
  }
  
  return src;
}

function getFallbackPath(src: string | undefined, size: number | null = null): string | undefined {
  if (!src) return src;
  
  if (src.toLowerCase().endsWith('.webp')) {
    const base = src.replace(/\.webp$/i, '');
    if (size) return `${base}_${size}px.jpg`;
    return `${base}.jpg`;
  }
  
  if (src.toLowerCase().endsWith('.jpg') || src.toLowerCase().endsWith('.jpeg')) {
    if (size) return src.replace(/\.(jpg|jpeg)$/i, `_${size}px.jpg`);
    return src;
  }
  
  const ext = /\.(png|gif)$/i;
  if (ext.test(src)) {
    const base = src.replace(ext, '');
    if (size) return `${base}_${size}px.jpg`;
    return `${base}.jpg`;
  }
  
  return src;
}

function generateSrcSet(src: string | undefined, forGrid: boolean = false): string {
  if (!src) return '';
  
  // Only generate srcset for clean filenames (no encoded characters)
  if (src.includes('%')) return '';
  
  const breakpoints = forGrid 
    ? [480, 768, 1024]
    : [768, 1024, 1440];
  
  const srcset = breakpoints
    .map(size => {
      const webpPath = getWebPPath(src, size);
      return `${webpPath} ${size}w`;
    })
    .join(', ');
  
  return srcset;
}

function generateFallbackSrcSet(src: string | undefined, forGrid: boolean = false): string {
  if (!src) return '';
  
  // Only generate srcset for clean filenames (no encoded characters)
  if (src.includes('%')) return '';
  
  const breakpoints = forGrid 
    ? [480, 768, 1024]
    : [768, 1024, 1440];
  
  const srcset = breakpoints
    .map(size => {
      const jpegPath = getFallbackPath(src, size);
      return `${jpegPath} ${size}w`;
    })
    .join(', ');
  
  return srcset;
}

function generateSizes(forGrid: boolean = false): string {
  if (forGrid) {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
  return '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px';
}

function isWebP(src: string | undefined): boolean {
  if (!src) return false;
  return src.toLowerCase().endsWith('.webp');
}

function isJPEG(src: string | undefined): boolean {
  if (!src) return false;
  const lower = src.toLowerCase();
  return lower.endsWith('.jpg') || lower.endsWith('.jpeg');
}

export function SmartImage({
  loading = "lazy",
  decoding = "async",
  fetchpriority,
  src,
  responsiveSizes = false,
  forGrid = false,
  sizes: userSizes,
  ...rest
}: SmartImageProps) {
  const webpSrc = useMemo(() => getWebPPath(src), [src]);
  const fallbackSrc = useMemo(() => getFallbackPath(src), [src]);
  const webpSrcSet = useMemo(() => responsiveSizes && isWebP(src) ? generateSrcSet(src, forGrid) : '', [src, responsiveSizes, forGrid]);
  const fallbackSrcSet = useMemo(() => responsiveSizes && isJPEG(src) ? generateFallbackSrcSet(src, forGrid) : '', [src, responsiveSizes, forGrid]);
  const responsiveSizesAttr = useMemo(() => userSizes || (responsiveSizes ? generateSizes(forGrid) : undefined), [userSizes, responsiveSizes, forGrid]);

  // If we have srcsets, use picture element; otherwise use img
  if (responsiveSizes && (webpSrcSet || fallbackSrcSet)) {
    return (
      <picture>
        {isWebP(src) && webpSrcSet && (
          <source srcSet={webpSrcSet} type="image/webp" sizes={responsiveSizesAttr} />
        )}
        {fallbackSrcSet && (
          <source srcSet={fallbackSrcSet} type="image/jpeg" sizes={responsiveSizesAttr} />
        )}
        <img
          loading={loading}
          decoding={decoding}
          src={fallbackSrc || src}
          sizes={responsiveSizesAttr}
          {...(fetchpriority ? ({ fetchpriority } as any) : {})}
          {...rest}
        />
      </picture>
    );
  }

  // Fallback to simple img tag
  return (
    <img
      loading={loading}
      decoding={decoding}
      src={fallbackSrc || src}
      {...(fetchpriority ? ({ fetchpriority } as any) : {})}
      {...rest}
    />
  );
}

export default SmartImage;
```

---

### Step 3.4: Expected Bandwidth Savings

**Before Responsive Images:**
- Mobile user on 480px viewport downloads **full-size image** (~200-400KB each)
- Total for 6-image gallery: **1.2-2.4 MB**

**After Responsive Images:**
- Mobile user on 480px viewport downloads **480px variant** (~30-60KB each)
- Total for 6-image gallery: **180-360 KB**
- **Savings: 85% reduction** ✓

**How to Verify in DevTools:**

1. Open DevTools → Network tab
2. Set device to iPhone 12 (375px width)
3. Reload page with throttling: "Slow 4G"
4. Check each image's actual size downloaded in Network tab
5. Compare:
   - Before: "Size" shows full resolution (200-400KB)
   - After: "Size" shows 480px variant (30-60KB)

---

## Deployment Checklist

### Pre-Deployment
- [ ] Run local Lighthouse audits (Mobile + Desktop)
- [ ] Review Lighthouse reports for bottlenecks
- [ ] Build production bundle: `npm run build`
- [ ] Verify .htaccess has Cache-Control headers
- [ ] Verify all images load without errors locally

### Deployment Day
- [ ] Upload `/dist` contents to `public_html/`
- [ ] Upload `/public/images` to `public_html/images`
- [ ] Upload `.htaccess` to `public_html/` root
- [ ] Clear Bluehost cache
- [ ] Clear browser cache (Ctrl+Shift+Delete)

### Post-Deployment
- [ ] Verify cache headers with curl commands (Section 2.2)
- [ ] Run Lighthouse audits on live site
- [ ] Compare pre vs post metrics
- [ ] Monitor Core Web Vitals in Google Search Console (24-48 hours)

### Optional Next Steps
- [ ] Rename image files (Step 3.1)
- [ ] Update code references (Step 3.2)
- [ ] Enable responsive images (Step 3.3)
- [ ] Re-test Lighthouse and Network tab bandwidth

---

## Success Criteria

| Check | Status | Notes |
|-------|--------|-------|
| LCP < 2.5s (mobile) | ⏳ | |
| CLS < 0.1 (mobile) | ⏳ | |
| INP < 100ms (mobile) | ⏳ | |
| Cache headers correct | ⏳ | |
| Gzip compression active | ⏳ | |
| All images load without 404 | ⏳ | |
| Performance Score ≥ 85 | ⏳ | |

---

## Troubleshooting

### Cache Headers Not Working
**Symptom:** `curl -I https://...` shows no `Cache-Control` header
**Fix:**
1. Verify `.htaccess` is in `public_html/` (not subdirectory)
2. Check Bluehost cPanel → "Apache Handlers" → Enable `.htaccess`
3. Restart Apache: cPanel → "Restart Services"
4. Wait 5-10 minutes for changes to propagate

### Lighthouse Shows High LCP
**Symptom:** LCP > 2.5s on mobile
**Possible Causes:**
- Images not cached (max-age too low)
- Large JavaScript bundle (check if code-splitting is working)
- No gzip compression (check Content-Encoding header)
**Fix:** Review "Performance" tab in Lighthouse report for specific bottlenecks

### Images Still Slow After Caching
**Symptom:** Images still feel slow on repeat visits
**Cause:** Browser cache not working or .htaccess not applied
**Verify:** Open DevTools → Network tab → Look at "Size" column
- Blue text = served from cache (instant)
- Regular text = downloaded from server
**Fix:** If all downloads are regular (not cached), .htaccess isn't working

