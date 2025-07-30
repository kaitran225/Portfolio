const fs = require('fs');
const path = require('path');

// Create SVG placeholder images for the portfolio
const createPlaceholder = (width, height, text, filename, outputDir) => {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#2c3e50"/>
  <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="none" stroke="#ecf0f1" stroke-width="2" stroke-dasharray="10,5"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#ecf0f1" text-anchor="middle" dominant-baseline="middle">
    ${text}
  </text>
  <circle cx="40" cy="40" r="15" fill="#3498db" opacity="0.3"/>
  <circle cx="${width-40}" cy="40" r="15" fill="#e74c3c" opacity="0.3"/>
  <circle cx="40" cy="${height-40}" r="15" fill="#f1c40f" opacity="0.3"/>
  <circle cx="${width-40}" cy="${height-40}" r="15" fill="#2ecc71" opacity="0.3"/>
</svg>`;
  
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, svg.trim());
  console.log(`Created: ${filePath}`);
};

// Create directories if they don't exist
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Base directories
const baseDir = path.join(__dirname, '..', 'public', 'assets');

// Profile image
createDir(path.join(baseDir, 'profile'));
createPlaceholder(400, 400, 'Kai Tran\nProfile Photo', 'kai-tran-profile.jpg', path.join(baseDir, 'profile'));

// Development project thumbnails
createDir(path.join(baseDir, 'dev-thumbnails'));
const devProjects = [
  { name: 'calantha.jpg', title: 'Calantha Platform\nReact + WebRTC' },
  { name: 'ecommerce.jpg', title: 'E-Commerce System\nNext.js + Stripe' },
  { name: 'cloud.jpg', title: 'Cloud Infrastructure\nDocker + Kubernetes' },
  { name: 'api.jpg', title: 'Mobile API\nPython + GraphQL' }
];

devProjects.forEach(project => {
  createPlaceholder(400, 300, project.title, project.name, path.join(baseDir, 'dev-thumbnails'));
});

// Design project thumbnails
createDir(path.join(baseDir, 'design-thumbnails'));
const designProjects = [
  { name: 'zena-brand.jpg', title: 'Zena Brand Identity\nLogo + Typography' },
  { name: 'gateway-ui.jpg', title: 'GateWay Mobile UI\nUI/UX Design' },
  { name: 'slab-packaging.jpg', title: 'Slab Coffee Packaging\nProduct Design' },
  { name: 'personal-web.jpg', title: 'Personal Portfolio\nWeb Design' }
];

designProjects.forEach(project => {
  createPlaceholder(400, 300, project.title, project.name, path.join(baseDir, 'design-thumbnails'));
});

// Calantha project images
createDir(path.join(baseDir, 'projects', 'calantha'));
const calanthaImages = [
  { name: 'screenshot-1.jpg', title: 'Calantha Dashboard\nMain Interface' },
  { name: 'screenshot-2.jpg', title: 'Video Processing\nReal-time Features' },
  { name: 'screenshot-3.jpg', title: 'User Profile\nSocial Features' },
  { name: 'architecture.jpg', title: 'System Architecture\nMicroservices Design' },
  { name: 'demo-video.mp4', title: 'Demo Video\nProject Showcase' }
];

calanthaImages.forEach(image => {
  if (image.name.endsWith('.mp4')) {
    // Create a video placeholder (SVG)
    createPlaceholder(800, 600, image.title + '\n🎥 Video Demo', image.name, path.join(baseDir, 'projects', 'calantha'));
  } else {
    createPlaceholder(800, 600, image.title, image.name, path.join(baseDir, 'projects', 'calantha'));
  }
});

// Zena project images  
createDir(path.join(baseDir, 'projects', 'zena'));
const zenaImages = [
  { name: 'final-logo-variations.jpg', title: 'Zena Logo Variations\nFinal Designs' },
  { name: 'brand-applications.jpg', title: 'Brand Applications\nComplete System' },
  { name: 'packaging-design.jpg', title: 'Product Packaging\nSustainable Design' },
  { name: 'website-mockup.jpg', title: 'Website Design\nResponsive Layout' },
  { name: 'business-cards.jpg', title: 'Business Cards\nPrint Materials' },
  { name: 'storefront-signage.jpg', title: 'Store Signage\nRetail Applications' },
  { name: 'initial-sketches.jpg', title: 'Initial Sketches\nIdeation Process' },
  { name: 'concept-exploration.jpg', title: 'Concept Exploration\nDesign Iterations' },
  { name: 'logo-iterations.jpg', title: 'Logo Development\nRefinement Process' },
  { name: 'color-exploration.jpg', title: 'Color Palette\nBrand Colors' },
  { name: 'typography-testing.jpg', title: 'Typography System\nFont Selection' },
  { name: 'brand-guidelines.jpg', title: 'Brand Guidelines\nUsage Standards' },
  { name: 'mobile-app-mockup.jpg', title: 'Mobile App UI\nUser Experience' },
  { name: 'social-media-templates.jpg', title: 'Social Templates\nDigital Marketing' },
  { name: 'product-tags.jpg', title: 'Product Tags\nRetail Materials' },
  { name: 'tote-bag-design.jpg', title: 'Tote Bag Design\nMerchandise' },
  { name: 'email-templates.jpg', title: 'Email Design\nDigital Communications' },
  { name: 'billboard-mockup.jpg', title: 'Billboard Design\nOutdoor Advertising' }
];

zenaImages.forEach(image => {
  createPlaceholder(800, 600, image.title, image.name, path.join(baseDir, 'projects', 'zena'));
});

console.log('✅ All placeholder images created successfully!');
console.log('📁 Generated images in:');
console.log('   • Profile photos');
console.log('   • Development project thumbnails');
console.log('   • Design project thumbnails');
console.log('   • Detailed project images');
console.log('🎨 Ready for portfolio showcase!');
