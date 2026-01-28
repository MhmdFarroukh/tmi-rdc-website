import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/images/immersion');
const backupDir = path.join(__dirname, '../public/images/immersion-backup');
const optimizedDir = path.join(__dirname, '../public/images/immersion-optimized');

// Create backup and optimized directories
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

async function optimizeImages() {
  try {
    console.log('🖼️  Starting image optimization...\n');

    const files = fs.readdirSync(sourceDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    console.log(`📁 Found ${files.length} images to optimize\n`);

    let optimizedCount = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const stats = fs.statSync(sourcePath);
      totalOriginalSize += stats.size;

      const fileNameWithoutExt = path.parse(file).name;
      const webpPath = path.join(sourceDir, `${fileNameWithoutExt}.webp`);
      const jpegPath = path.join(sourceDir, `${fileNameWithoutExt}.jpg`);

      try {
        // Always create WebP (primary format)
        const webpStats = await sharp(sourcePath)
          .webp({ quality: 78, effort: 6 })
          .toFile(webpPath);

        // Create optimized JPEG as fallback
        const jpegStats = await sharp(sourcePath)
          .jpeg({ quality: 78, progressive: true })
          .toFile(jpegPath);

        totalOptimizedSize += webpStats.size + jpegStats.size;
        optimizedCount++;

        const originalSize = (stats.size / 1024).toFixed(2);
        const webpSize = (webpStats.size / 1024).toFixed(2);
        const jpegSize = (jpegStats.size / 1024).toFixed(2);
        const reduction = (((stats.size - webpStats.size) / stats.size) * 100).toFixed(1);

        console.log(`✅ ${file}`);
        console.log(`   Original: ${originalSize} KB → WebP: ${webpSize} KB (${reduction}% smaller)`);
        console.log(`   Fallback JPEG: ${jpegSize} KB\n`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }

    const totalReduction = (((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1);
    console.log('✨ Optimization complete!');
    console.log(`📊 Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Overall reduction: ${totalReduction}%\n`);
    console.log('🎉 All images have been optimized!');
    console.log('📝 Update your img attributes to use .webp with .jpg fallback');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

optimizeImages();
