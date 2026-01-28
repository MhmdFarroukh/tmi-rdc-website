import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/images/immersion');
const sizes = [480, 768, 1024, 1440]; // Responsive breakpoints

async function generateResponsiveImages() {
  try {
    console.log('📱 Generating responsive image variants...\n');

    const files = fs.readdirSync(sourceDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.webp', '.jpg', '.jpeg', '.png', '.gif'].includes(ext) && 
             !sizes.some(s => file.includes(`_${s}px`));
    });

    console.log(`📁 Found ${files.length} images to resize\n`);

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const filename = path.parse(file).name;
      const ext = path.parse(file).ext.toLowerCase();

      // Skip files that are already sized variants
      if (sizes.some(s => file.includes(`_${s}px`))) {
        continue;
      }

      try {
        for (const size of sizes) {
          const outputFile = `${filename}_${size}px.webp`;
          const outputPath = path.join(sourceDir, outputFile);

          // Skip if already exists
          if (fs.existsSync(outputPath)) {
            console.log(`⏭️  ${outputFile} (already exists)`);
            continue;
          }

          const metadata = await sharp(sourcePath).metadata();
          
          // Only resize if original is larger than target size
          if (metadata.width && metadata.width > size) {
            const stats = await sharp(sourcePath)
              .resize(size, Math.round((metadata.height || size) * (size / metadata.width)), {
                fit: 'cover',
                position: 'center'
              })
              .webp({ quality: 78, effort: 6 })
              .toFile(outputPath);

            const originalSize = fs.statSync(sourcePath).size;
            const reduction = (((originalSize - stats.size) / originalSize) * 100).toFixed(1);
            console.log(`✅ ${outputFile}: ${(stats.size / 1024).toFixed(1)} KB (${reduction}% smaller)`);
          } else {
            console.log(`⏭️  ${outputFile} (original smaller than ${size}px)`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }

    console.log('\n✨ Responsive image generation complete!');
    console.log('📝 Use image filenames without _XYZpx for srcset generation\n');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

generateResponsiveImages();
