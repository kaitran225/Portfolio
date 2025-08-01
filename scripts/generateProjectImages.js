// Simple placeholder image generator script
const fs = require('fs');
const path = require('path');

const generatePlaceholderSVG = (title, width = 600, height = 400, colors = ['#6933FF', '#764ba2']) => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${title.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad-${title.replace(/\s+/g, '')})" />
    <rect x="50" y="50" width="${width-100}" height="${height-100}" fill="rgba(255,255,255,0.1)" rx="10" />
    <text x="${width/2}" y="${height/2 - 20}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${title}</text>
    <text x="${width/2}" y="${height/2 + 20}" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="14">Portfolio Project Preview</text>
    <circle cx="${width-100}" cy="100" r="30" fill="rgba(255,255,255,0.2)" />
    <circle cx="${width-150}" cy="${height-80}" r="20" fill="rgba(255,255,255,0.15)" />
    <circle cx="150" cy="${height-80}" r="25" fill="rgba(255,255,255,0.1)" />
  </svg>`;
};

const projects = [
  { name: 'calantha-preview.jpg', title: 'Calantha Platform', colors: ['#667eea', '#764ba2'] },
  { name: 'backend-api-preview.jpg', title: 'Mental Health API', colors: ['#2ed573', '#1e90ff'] },
  { name: 'cybria-ai-preview.jpg', title: 'Cybria AI Assistant', colors: ['#ff6b6b', '#ffa726'] },
  { name: 'notification-service-preview.jpg', title: 'Notification Service', colors: ['#5352ed', '#3742fa'] },
];

const outputDir = path.join(__dirname, '../public/assets/projects');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

projects.forEach(project => {
  const svgContent = generatePlaceholderSVG(project.title, 600, 400, project.colors);
  const outputPath = path.join(outputDir, project.name.replace('.jpg', '.svg'));
  fs.writeFileSync(outputPath, svgContent);
  console.log(`Generated: ${outputPath}`);
});

console.log('All project preview images generated!');
