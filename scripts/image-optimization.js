#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts existing images to WebP format and generates responsive sizes
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/assets');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/optimized');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.tiff', '.gif'];
const RESPONSIVE_SIZES = [400, 800, 1200, 1600]; // Width breakpoints

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(inputPath, outputDir, filename) {
  try {
    const inputBuffer = fs.readFileSync(inputPath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    
    console.log(`📸 Processing: ${filename} (${metadata.width}x${metadata.height})`);
    
    // Create WebP versions at different sizes
    for (const width of RESPONSIVE_SIZES) {
      if (width <= metadata.width) {
        const outputPath = path.join(outputDir, `${path.parse(filename).name}-${width}w.webp`);
        
        await image
          .resize(width, null, { 
            withoutEnlargement: true,
            fastShrinkOnLoad: true
          })
          .webp({ 
            quality: 85,
            effort: 6,
            smartSubsample: true
          })
          .toFile(outputPath);
          
        console.log(`  ✅ Generated: ${path.basename(outputPath)}`);
      }
    }
    
    // Create optimized original size WebP
    const originalWebP = path.join(outputDir, `${path.parse(filename).name}.webp`);
    await image
      .webp({ 
        quality: 90,
        effort: 6,
        smartSubsample: true
      })
      .toFile(originalWebP);
      
    console.log(`  ✅ Generated: ${path.basename(originalWebP)}`);
    
    // Create fallback optimized JPEG
    const fallbackJpeg = path.join(outputDir, `${path.parse(filename).name}.jpg`);
    await image
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(fallbackJpeg);
      
    console.log(`  ✅ Generated: ${path.basename(fallbackJpeg)}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

async function generatePlaceholder(width, height, outputPath) {
  try {
    // Generate a 10px blur placeholder
    const placeholder = sharp({
      create: {
        width: 10,
        height: Math.round((height / width) * 10),
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 }
      }
    })
    .png()
    .blur(1);
    
    await placeholder.toFile(outputPath);
    console.log(`  📱 Generated placeholder: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error generating placeholder:`, error.message);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'optimized') {
      // Create corresponding output directory
      const outputSubDir = path.join(OUTPUT_DIR, entry.name);
      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }
      
      // Recursively process subdirectory
      await processDirectory(fullPath);
      
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        const relativePath = path.relative(INPUT_DIR, dir);
        const outputSubDir = relativePath ? path.join(OUTPUT_DIR, relativePath) : OUTPUT_DIR;
        
        if (!fs.existsSync(outputSubDir)) {
          fs.mkdirSync(outputSubDir, { recursive: true });
        }
        
        await optimizeImage(fullPath, outputSubDir, entry.name);
      }
    }
  }
}

async function generateImageManifest() {
  console.log('\n📋 Generating image manifest...');
  
  const manifest = {
    version: new Date().toISOString(),
    images: {},
    totalSize: 0,
    optimizedSize: 0
  };
  
  // Scan all optimized images
  function scanDirectory(dir, basePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath, path.join(basePath, entry.name));
      } else if (entry.isFile() && entry.name.endsWith('.webp')) {
        const stats = fs.statSync(fullPath);
        const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');
        
        manifest.images[relativePath] = {
          size: stats.size,
          lastModified: stats.mtime.toISOString()
        };
        
        manifest.optimizedSize += stats.size;
      }
    }
  }
  
  scanDirectory(OUTPUT_DIR);
  
  // Save manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Manifest saved: ${manifest.totalSize} bytes optimized to ${manifest.optimizedSize} bytes`);
  console.log(`📊 Compression ratio: ${Math.round((manifest.optimizedSize / manifest.totalSize) * 100)}%`);
}

async function main() {
  console.log('🎨 Portfolio Image Optimization\n');
  console.log('===============================\n');
  
  try {
    console.log(`📂 Input directory: ${INPUT_DIR}`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log(`🔧 Responsive sizes: ${RESPONSIVE_SIZES.join(', ')}px\n`);
    
    if (!fs.existsSync(INPUT_DIR)) {
      console.error('❌ Input directory does not exist:', INPUT_DIR);
      process.exit(1);
    }
    
    await processDirectory(INPUT_DIR);
    await generateImageManifest();
    
    console.log('\n✨ Image optimization complete!');
    console.log('\n📖 Next Steps:');
    console.log('1. Update image paths to use optimized versions');
    console.log('2. Test responsive images on different devices');
    console.log('3. Monitor Core Web Vitals improvements');
    console.log('4. Consider implementing progressive loading');
    
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    process.exit(1);
  }
}

// Only install sharp if it's not available
async function ensureSharp() {
  try {
    require('sharp');
    console.log('✅ Sharp is available');
  } catch (error) {
    console.log('📦 Installing Sharp for image optimization...');
    const { execSync } = require('child_process');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    console.log('✅ Sharp installed successfully');
  }
}

// Run the script
if (require.main === module) {
  ensureSharp().then(() => main());
}

module.exports = {
  optimizeImage,
  processDirectory,
  generateImageManifest
};
