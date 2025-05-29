/**
 * Script to copy portfolio assets to the React public folder
 * 
 * Usage: node copyAssets.js
 */

const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceRoot = path.join(__dirname, '../../Portfolio');
const destRoot = path.join(__dirname, '../public/assets');

// Ensure the destination directory exists
if (!fs.existsSync(destRoot)) {
  fs.mkdirSync(destRoot, { recursive: true });
}

// Portfolio folders to process
const portfolioFolders = ['Calantha', 'Zena', 'Slab', 'Personal', 'GateWay', 'Cloud'];

// Create placeholder data for missing images
const createPlaceholder = (destPath, filename) => {
  const placeholderContent = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#222" />
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
        ${filename} Placeholder
      </text>
    </svg>
  `;
  fs.writeFileSync(destPath, placeholderContent, 'utf8');
  console.log(`Created placeholder: ${destPath}`);
};

// Copy file or create placeholder if it doesn't exist
const copyFileOrCreatePlaceholder = (sourcePath, destPath, filename) => {
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    } else {
      // If source file doesn't exist, create a placeholder
      createPlaceholder(destPath, filename);
    }
  } catch (err) {
    console.error(`Error processing ${sourcePath}: ${err.message}`);
  }
};

// Process each portfolio folder
portfolioFolders.forEach(folder => {
  // Create destination folder if it doesn't exist
  const destFolder = path.join(destRoot, folder);
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  // Copy Calantha.mp4 if it exists
  if (folder === 'Calantha') {
    const sourceVideoPath = path.join(sourceRoot, 'Calantha.mp4');
    const destVideoPath = path.join(destFolder, 'Calantha.mp4');
    copyFileOrCreatePlaceholder(sourceVideoPath, destVideoPath, 'Calantha Video');
  }

  // Create placeholder images for each folder
  const placeholderPaths = [
    path.join(destFolder, 'placeholder1.jpg'),
    path.join(destFolder, 'placeholder2.jpg')
  ];
  
  placeholderPaths.forEach((placeholderPath, index) => {
    if (!fs.existsSync(placeholderPath)) {
      createPlaceholder(placeholderPath, `${folder} Image ${index + 1}`);
    }
  });
});

console.log('Asset processing complete!'); 