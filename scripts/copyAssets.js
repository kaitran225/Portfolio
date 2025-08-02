const fs = require('fs');
const path = require('path');

/**
 * Copy Assets Script for Vercel Deployment
 * Ensures all required assets are properly copied to the build directory
 */

const copyDirectory = (src, dest) => {
  try {
    if (!fs.existsSync(src)) {
      console.log(`Source directory ${src} does not exist, skipping...`);
      return;
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    });
  } catch (error) {
    console.error(`Error copying directory ${src} to ${dest}:`, error.message);
  }
};

const copyFile = (src, dest) => {
  try {
    if (!fs.existsSync(src)) {
      console.log(`Source file ${src} does not exist, skipping...`);
      return;
    }

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(src, dest);
    console.log(`Copied file: ${src} -> ${dest}`);
  } catch (error) {
    console.error(`Error copying file ${src} to ${dest}:`, error.message);
  }
};

const main = () => {
  console.log('🚀 Starting asset copy process...');

  // Define paths
  const publicDir = path.join(__dirname, '..', 'public');
  const buildDir = path.join(__dirname, '..', 'build');

  // Create build directory if it doesn't exist
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Copy specific asset directories from public to build
  const assetsToCopy = [
    { src: path.join(publicDir, 'assets'), dest: path.join(buildDir, 'assets') },
  ];

  // Copy individual files
  const filesToCopy = [
    { src: path.join(publicDir, 'sitemap.xml'), dest: path.join(buildDir, 'sitemap.xml') },
    { src: path.join(publicDir, 'robots.txt'), dest: path.join(buildDir, 'robots.txt') },
    { src: path.join(publicDir, 'humans.txt'), dest: path.join(buildDir, 'humans.txt') },
    { src: path.join(publicDir, 'manifest.json'), dest: path.join(buildDir, 'manifest.json') },
    { src: path.join(publicDir, 'favicon.ico'), dest: path.join(buildDir, 'favicon.ico') },
    { src: path.join(publicDir, 'sw.js'), dest: path.join(buildDir, 'sw.js') },
  ];

  // Copy directories
  assetsToCopy.forEach(({ src, dest }) => {
    copyDirectory(src, dest);
  });

  // Copy individual files
  filesToCopy.forEach(({ src, dest }) => {
    copyFile(src, dest);
  });

  console.log('✅ Asset copy process completed!');
};

// Run the script
main();
