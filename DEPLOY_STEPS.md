# 🚀 Deployment Guide - TMI-RDC Website

## Quick Start Checklist

### Pre-Deployment (TODAY)
- [x] ✅ All images optimized and loading
- [x] ✅ Bundle sizes verified (JS: 448KB, CSS: 35KB)
- [x] ✅ 416 WebP images + 237 JPEG fallbacks ready
- [x] ✅ Cache headers configured in .htaccess
- [x] ✅ Code-splitting active (3 JS chunks)
- [x] ✅ SmartImage component with fallback support
- [ ] ⏳ Run Lighthouse locally (next step)
- [ ] ⏳ Deploy to Bluehost
- [ ] ⏳ Verify production headers
- [ ] ⏳ Run production Lighthouse audit

---

## Step 1: Local Lighthouse Audit (5 minutes)

### Install Lighthouse CLI
```bash
npm install -g lighthouse
```

### Run Local Audits
```bash
# Build production bundle
npm run build

# Serve production bundle
npx serve -s dist -l 3000

# In another terminal, run audits:

# Mobile
lighthouse http://localhost:3000 --view --emulated-form-factor=mobile --output=html --output-path=./lighthouse-mobile-pre.html

# Desktop
lighthouse http://localhost:3000 --view --emulated-form-factor=desktop --output=html --output-path=./lighthouse-desktop-pre.html
```

### Expected Metrics
| Metric | Target | Your Pre-Deployment Result |
|--------|--------|----------------------------|
| **Mobile LCP** | < 2.5s | ⏳ _______ms |
| **Mobile CLS** | < 0.1 | ⏳ _______ |
| **Mobile INP** | < 100ms | ⏳ _______ms |
| **Desktop LCP** | < 1.5s | ⏳ _______ms |
| **Desktop CLS** | < 0.1 | ⏳ _______ |
| **Desktop INP** | < 50ms | ⏳ _______ms |
| **Performance Score** | ≥ 85 | ⏳ ___/100 |

**If any metric fails (red in Lighthouse):**
- See "Troubleshooting" section at bottom of PERFORMANCE_AUDIT_PLAN.md

---

## Step 2: Deploy to Bluehost (15 minutes)

### 2.1 Prepare Files

```bash
# Make sure production build is current
npm run build

# List files to upload
ls -la dist/          # Main bundle
ls -la public/images/immersion/  # All images
cat public/.htaccess  # Cache configuration
```

### 2.2 Upload via FTP/SFTP

**Using FileZilla or WinSCP:**

1. Connect to Bluehost with your FTP credentials
2. Navigate to `/public_html/` (NOT a subdirectory)
3. Upload `dist/` contents:
   ```
   ├── index.html
   ├── assets/
   │   ├── *.js
   │   ├── *.css
   │   └── *.map (optional)
   └── [other files]
   ```
4. Upload `public/images/immersion/` → `/public_html/images/immersion/`
5. Upload `public/.htaccess` → `/public_html/.htaccess`

**Using command line (SSH):**
```bash
sftp your-bluehost-username@your-domain.com

# In SFTP shell:
cd public_html
put -r dist/* .
put -r public/images images
put public/.htaccess .

# Verify upload
ls -la
ls -la images/immersion/
cat .htaccess
```

### 2.3 Verify Upload

After upload, in Bluehost cPanel:

1. **File Manager** → `public_html/`
   - ✓ Verify `index.html` exists
   - ✓ Verify `assets/` folder exists with `.js` and `.css`
   - ✓ Verify `images/immersion/` exists with `.webp` and `.jpg` files
   - ✓ Verify `.htaccess` exists at root

2. **Clear Caches:**
   - cPanel → **Apache Handlers** → Ensure `.htaccess` is enabled
   - cPanel → **Optimization** → Clear all cache (if using cache plugin)
   - Browser → Clear site-specific cache (DevTools → Application → Clear storage)

---

## Step 3: Verify Production Headers (10 minutes)

Use these **exact curl commands** to verify cache headers are working:

### Test 1: Homepage HTML (expect 1 day cache)
```bash
curl -I https://your-domain.com/ 2>&1 | grep -i "cache-control\|content-encoding"
```

✓ **Should show:**
```
Cache-Control: public, max-age=86400, must-revalidate
Content-Encoding: gzip
```

---

### Test 2: JavaScript Asset (expect 30 days cache)
```bash
# Replace HASH with actual filename from your assets folder
curl -I https://your-domain.com/assets/index-XXXX.js 2>&1 | grep -i "cache-control"
```

✓ **Should show:**
```
Cache-Control: public, max-age=2592000
```

---

### Test 3: CSS Asset (expect 30 days cache)
```bash
curl -I https://your-domain.com/assets/index-XXXX.css 2>&1 | grep -i "cache-control"
```

✓ **Should show:**
```
Cache-Control: public, max-age=2592000
```

---

### Test 4: WebP Image (expect 1 year cache + immutable)
```bash
curl -I https://your-domain.com/images/immersion/construction.webp 2>&1 | grep -i "cache-control"
```

✓ **Should show:**
```
Cache-Control: public, max-age=31536000, immutable
```

---

### Test 5: JPEG Image (expect 1 year cache + immutable)
```bash
curl -I https://your-domain.com/images/immersion/construction.jpg 2>&1 | grep -i "cache-control"
```

✓ **Should show:**
```
Cache-Control: public, max-age=31536000, immutable
```

---

### ❌ If Headers Missing

**Problem:** Curl shows no `Cache-Control` header or wrong `max-age`

**Fix:**
1. Verify `.htaccess` uploaded to `public_html/` root (NOT subdirectory)
2. In Bluehost cPanel:
   - Go to **Apache Handlers**
   - Enable `.htaccess`
   - Save changes
   - Wait 5-10 minutes
3. Restart Apache (if available in cPanel)
4. Try curl command again

---

## Step 4: Production Lighthouse Audit (10 minutes)

After headers are verified, run Lighthouse on live site:

```bash
# Mobile Audit
lighthouse https://your-domain.com --view --emulated-form-factor=mobile --output=html --output-path=./lighthouse-mobile-post.html

# Desktop Audit
lighthouse https://your-domain.com --view --emulated-form-factor=desktop --output=html --output-path=./lighthouse-desktop-post.html
```

### Compare Pre vs Post Deployment

| Metric | Pre (Local) | Post (Production) | Δ | Status |
|--------|-----------|------------------|---|--------|
| Mobile LCP | ?ms | ?ms | ✓ or ⚠ | |
| Mobile CLS | ? | ? | ✓ or ⚠ | |
| Mobile INP | ?ms | ?ms | ✓ or ⚠ | |
| Desktop LCP | ?ms | ?ms | ✓ or ⚠ | |
| Performance | ?/100 | ?/100 | ✓ or ⚠ | |

**Expected Result:** Post-production metrics should match or be slightly better (cached content)

---

## Step 5: Verify Images Load Correctly (5 minutes)

1. Open https://your-domain.com in browser
2. Go to each section and verify images load:
   - ✓ Homepage hero
   - ✓ Projects/Services galleries
   - ✓ Realisations section
   - ✓ Individual project pages
3. Open DevTools → Network tab
4. Reload page
5. Check image requests:
   - ✓ `.webp` files requested first (modern browsers)
   - ✓ `.jpg` files served as fallback (older browsers)
   - ✓ All requests show `200 OK` status

---

## Success Criteria

### ✅ Deployment is successful when:

| Requirement | Status | Notes |
|-------------|--------|-------|
| HTML loads (no 404) | ✓ | Homepage accessible |
| All images load | ✓ | No broken image icons |
| Cache headers present | ✓ | Verified with curl |
| Gzip compression active | ✓ | `Content-Encoding: gzip` in curl output |
| Lighthouse LCP < 2.5s | ✓ | Mobile target |
| Lighthouse CLS < 0.1 | ✓ | Mobile target |
| No console errors | ✓ | DevTools console clean |

---

## Post-Deployment Monitoring

### Monitor Core Web Vitals (24-48 hours)

1. **Google Search Console:**
   - Go to https://search.google.com/search-console
   - Select your property
   - Check **Core Web Vitals** report
   - Wait 24-48 hours for data

2. **Expected Results:**
   - Green status (good)
   - LCP < 2.5s
   - CLS < 0.1
   - INP < 100ms

3. **If Issues Found:**
   - Check Lighthouse report for specific bottlenecks
   - Review Performance Audit Plan troubleshooting section
   - Contact Bluehost support if headers aren't working

---

## Optional: Future Optimization

### Enable Responsive Images (saves 70-85% mobile bandwidth)

When you're ready to optimize further:

```bash
# 1. Rename image files to remove spaces
node scripts/rename-images.js

# 2. Update code references
node scripts/update-image-references.js

# 3. Enable responsive images in SmartImage
# (See PERFORMANCE_AUDIT_PLAN.md → Step 3.3)

# 4. Test and rebuild
npm run build
npm run dev

# 5. Verify Lighthouse shows improvement
lighthouse http://localhost:3000
```

**Expected Savings:**
- Before: 200-400KB per image on mobile
- After: 30-60KB per image on mobile
- **Total: 85% reduction in image bandwidth** 🎉

---

## Support & Troubleshooting

**Problem: Cache headers not working**
- See: PERFORMANCE_AUDIT_PLAN.md → Troubleshooting → "Cache Headers Not Working"

**Problem: Lighthouse shows high LCP**
- See: PERFORMANCE_AUDIT_PLAN.md → Troubleshooting → "Lighthouse Shows High LCP"

**Problem: Images still feel slow**
- See: PERFORMANCE_AUDIT_PLAN.md → Troubleshooting → "Images Still Slow After Caching"

---

## Final Checklist Before Going Live

- [ ] Local Lighthouse audit complete and documented
- [ ] All files uploaded to Bluehost (`public_html/`)
- [ ] `.htaccess` uploaded and enabled in cPanel
- [ ] Cache headers verified with curl (all 5 tests passing)
- [ ] Images load in browser without 404 errors
- [ ] Production Lighthouse audit complete
- [ ] Core Web Vitals in Google Search Console green (within 24-48 hours)
- [ ] No console errors in DevTools

✨ **When all checks pass: YOU'RE LIVE AND OPTIMIZED!** 🚀

