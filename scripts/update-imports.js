#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import path mapping for reorganized structure
const importMappings = {
  // Feature components
  './components/LandingPage': '@/features/landing/components/LandingPage',
  '../components/LandingPage': '@/features/landing/components/LandingPage',
  './components/HeroSection': '@/features/landing/components/HeroSection',
  '../components/HeroSection': '@/features/landing/components/HeroSection',
  './components/EnhancedHeroSection': '@/features/landing/components/EnhancedHeroSection',
  './components/FeaturedSection': '@/features/landing/components/FeaturedSection',
  './components/ProjectGrid': '@/features/projects/components/ProjectGrid',
  './components/CategoryFilter': '@/features/projects/components/CategoryFilter',
  './components/DevProjectPage': '@/features/projects/components/DevProjectPage',
  './components/DesignProjectPage': '@/features/projects/components/DesignProjectPage',
  './components/SkillsVisualization': '@/features/skills/components/SkillsVisualization',
  './components/EnhancedSkillsVisualization': '@/features/skills/components/EnhancedSkillsVisualization',
  './components/ContactSection': '@/features/contact/components/ContactSection',
  './components/ProfessionalContactForm': '@/features/contact/components/ProfessionalContactForm',
  './components/AvailabilityStatus': '@/features/contact/components/AvailabilityStatus',
  './components/CalendarIntegration': '@/features/contact/components/CalendarIntegration',
  './components/LaTeXCV': '@/features/cv/components/LaTeXCV',
  './components/DesignLandingPage': '@/features/design/components/DesignLandingPage',
  './components/DesignContactSection': '@/features/design/components/DesignContactSection',
  
  // Common components
  './components/BackToTop': '@/components/common/BackToTop',
  '../components/BackToTop': '@/components/common/BackToTop',
  './components/ThemeToggle': '@/components/common/ThemeToggle',
  '../components/ThemeToggle': '@/components/common/ThemeToggle',
  './components/ErrorBoundary': '@/components/common/ErrorBoundary',
  './components/SEOOptimizer': '@/components/common/SEOOptimizer',
  
  // Media components
  './components/OptimizedImage': '@/components/media/OptimizedImage',
  '../components/OptimizedImage': '@/components/media/OptimizedImage',
  './components/LazyImage': '@/components/media/LazyImage',
  './components/VideoEmbed': '@/components/media/VideoEmbed',
  './components/ImageGallery': '@/components/media/ImageGallery',
  
  // Services
  './services/portfolioDataService': '@/shared/services/data/portfolioDataService',
  '../services/portfolioDataService': '@/shared/services/data/portfolioDataService',
  './services/googleAnalytics': '@/shared/services/analytics/googleAnalytics',
  './services/PortfolioAnalytics': '@/shared/services/analytics/PortfolioAnalytics',
  './services/analyticsService': '@/shared/services/analytics/analyticsService',
  
  // Hooks
  './hooks/usePerformanceMonitoring': '@/shared/hooks/usePerformanceMonitoring',
  '../hooks/usePerformanceMonitoring': '@/shared/hooks/usePerformanceMonitoring',
  './hooks/useOptimizedAnimations': '@/shared/hooks/useOptimizedAnimations',
  './hooks/useFastLoading': '@/shared/hooks/useFastLoading',
  
  // Utils
  './utils/codeOptimization': '@/shared/utils/codeOptimization',
  '../utils/codeOptimization': '@/shared/utils/codeOptimization',
  './utils/ProjectImageGenerator': '@/shared/utils/ProjectImageGenerator',
  
  // Types
  './types/portfolioTypes': '@/shared/types/portfolioTypes',
  '../types/portfolioTypes': '@/shared/types/portfolioTypes',
  './types/dashboard': '@/shared/types/dashboard',
  
  // Contexts
  './contexts/ThemeContext': '@/contexts/ThemeContext',
  '../contexts/ThemeContext': '@/contexts/ThemeContext'
};

function updateImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update import statements
  Object.entries(importMappings).forEach(([oldPath, newPath]) => {
    const importRegex = new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"]`, 'g');
    const dynamicImportRegex = new RegExp(`import\\(['"]${oldPath.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"]\\)`, 'g');
    
    if (content.match(importRegex) || content.match(dynamicImportRegex)) {
      content = content.replace(importRegex, `from '${newPath}'`);
      content = content.replace(dynamicImportRegex, `import('${newPath}')`);
      updated = true;
      console.log(`Updated ${oldPath} -> ${newPath} in ${filePath}`);
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated imports in ${filePath}`);
  }
}

function findAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      findAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('🔄 Updating import paths for reorganized structure...');

// Find all TypeScript files in src
const srcDir = path.join(process.cwd(), 'src');
const allFiles = findAllTsxFiles(srcDir);

console.log(`Found ${allFiles.length} TypeScript files to update`);

// Update imports in all files
allFiles.forEach(file => {
  updateImportsInFile(file);
});

console.log('✅ Import path updates complete!');
console.log('📋 Next steps:');
console.log('1. Run npm run build to check for any remaining import issues');
console.log('2. Fix any remaining path issues manually');
console.log('3. Test the application to ensure everything works correctly');
