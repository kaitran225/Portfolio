import React from 'react';

// This component generates SVG placeholder images for projects
const ProjectImageGenerator: React.FC = () => {
  const generateProjectImage = (title: string, colors: string[], techStack: string[]) => {
    const svgContent = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${title}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#grad-${title})" />
        <rect x="50" y="50" width="500" height="300" fill="rgba(255,255,255,0.1)" rx="10" />
        <text x="300" y="150" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">${title}</text>
        <text x="300" y="200" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="16">${techStack.join(' • ')}</text>
        <circle cx="500" cy="100" r="30" fill="rgba(255,255,255,0.2)" />
        <circle cx="450" cy="320" r="20" fill="rgba(255,255,255,0.15)" />
        <circle cx="150" cy="320" r="25" fill="rgba(255,255,255,0.1)" />
      </svg>
    `;
    return svgContent;
  };

  return null; // This is just a helper component
};

export default ProjectImageGenerator;
