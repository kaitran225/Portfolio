#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Updated import path mappings for complete reorganization
const importMappings = {
  // =================== FEATURE COMPONENTS ===================
  
  // Landing page components
  './components/LandingPage': '@/features/landing/components/LandingPage',
  '../components/LandingPage': '@/features/landing/components/LandingPage',
  './components/HeroSection': '@/features/landing/components/HeroSection',
  '../components/HeroSection': '@/features/landing/components/HeroSection',
  './components/EnhancedHeroSection': '@/features/landing/components/EnhancedHeroSection',
  '../components/EnhancedHeroSection': '@/features/landing/components/EnhancedHeroSection',
  './components/FeaturedSection': '@/features/landing/components/FeaturedSection',
  '../components/FeaturedSection': '@/features/landing/components/FeaturedSection',
  './components/SimplePortfolio': '@/features/landing/components/SimplePortfolio',
  '../components/SimplePortfolio': '@/features/landing/components/SimplePortfolio',
  
  // Projects components
  './components/ProjectGrid': '@/features/projects/components/ProjectGrid',
  '../components/ProjectGrid': '@/features/projects/components/ProjectGrid',
  './components/CategoryFilter': '@/features/projects/components/CategoryFilter',
  '../components/CategoryFilter': '@/features/projects/components/CategoryFilter',
  './components/DevProjectPage': '@/features/projects/components/DevProjectPage',
  '../components/DevProjectPage': '@/features/projects/components/DevProjectPage',
  './components/DesignProjectPage': '@/features/projects/components/DesignProjectPage',
  '../components/DesignProjectPage': '@/features/projects/components/DesignProjectPage',
  './components/EnhancedProjectShowcase': '@/features/projects/components/EnhancedProjectShowcase',
  '../components/EnhancedProjectShowcase': '@/features/projects/components/EnhancedProjectShowcase',
  './components/IDECodePreview': '@/features/projects/components/IDECodePreview',
  '../components/IDECodePreview': '@/features/projects/components/IDECodePreview',
  
  // Skills components
  './components/SkillsVisualization': '@/features/skills/components/SkillsVisualization',
  '../components/SkillsVisualization': '@/features/skills/components/SkillsVisualization',
  './components/EnhancedSkillsVisualization': '@/features/skills/components/EnhancedSkillsVisualization',
  '../components/EnhancedSkillsVisualization': '@/features/skills/components/EnhancedSkillsVisualization',
  
  // Contact components
  './components/ContactSection': '@/features/contact/components/ContactSection',
  '../components/ContactSection': '@/features/contact/components/ContactSection',
  './components/ProfessionalContactForm': '@/features/contact/components/ProfessionalContactForm',
  '../components/ProfessionalContactForm': '@/features/contact/components/ProfessionalContactForm',
  './components/AvailabilityStatus': '@/features/contact/components/AvailabilityStatus',
  '../components/AvailabilityStatus': '@/features/contact/components/AvailabilityStatus',
  './components/CalendarIntegration': '@/features/contact/components/CalendarIntegration',
  '../components/CalendarIntegration': '@/features/contact/components/CalendarIntegration',
  './components/CompactAvailability': '@/features/contact/components/CompactAvailability',
  '../components/CompactAvailability': '@/features/contact/components/CompactAvailability',
  './components/CompactCalendar': '@/features/contact/components/CompactCalendar',
  '../components/CompactCalendar': '@/features/contact/components/CompactCalendar',
  
  // CV components
  './components/LaTeXCV': '@/features/cv/components/LaTeXCV',
  '../components/LaTeXCV': '@/features/cv/components/LaTeXCV',
  
  // Design components
  './components/DesignLandingPage': '@/features/design/components/DesignLandingPage',
  '../components/DesignLandingPage': '@/features/design/components/DesignLandingPage',
  './components/DesignContactSection': '@/features/design/components/DesignContactSection',
  '../components/DesignContactSection': '@/features/design/components/DesignContactSection',
  
  // =================== SHARED COMPONENTS ===================
  
  // Common components
  './components/BackToTop': '@/components/common/BackToTop',
  '../components/BackToTop': '@/components/common/BackToTop',
  './components/ThemeToggle': '@/components/common/ThemeToggle',
  '../components/ThemeToggle': '@/components/common/ThemeToggle',
  './components/ErrorBoundary': '@/components/common/ErrorBoundary',
  '../components/ErrorBoundary': '@/components/common/ErrorBoundary',
  './components/SEOOptimizer': '@/components/common/SEOOptimizer',
  '../components/SEOOptimizer': '@/components/common/SEOOptimizer',
  './components/AccessibilityControls': '@/components/common/AccessibilityControls',
  '../components/AccessibilityControls': '@/components/common/AccessibilityControls',
  './components/AccessibilityProvider': '@/components/common/AccessibilityProvider',
  '../components/AccessibilityProvider': '@/components/common/AccessibilityProvider',
  './components/LoadingManager': '@/components/common/LoadingManager',
  '../components/LoadingManager': '@/components/common/LoadingManager',
  './components/PerformanceAnalysis': '@/components/common/PerformanceAnalysis',
  '../components/PerformanceAnalysis': '@/components/common/PerformanceAnalysis',
  './components/PerformanceMonitor': '@/components/common/PerformanceMonitor',
  '../components/PerformanceMonitor': '@/components/common/PerformanceMonitor',
  './components/PWABanner': '@/components/common/PWABanner',
  '../components/PWABanner': '@/components/common/PWABanner',
  './components/PWAManager': '@/components/common/PWAManager',
  '../components/PWAManager': '@/components/common/PWAManager',
  './components/LazyComponents': '@/components/common/LazyComponents',
  '../components/LazyComponents': '@/components/common/LazyComponents',
  
  // Media components
  './components/OptimizedImage': '@/components/media/OptimizedImage',
  '../components/OptimizedImage': '@/components/media/OptimizedImage',
  './components/LazyImage': '@/components/media/LazyImage',
  '../components/LazyImage': '@/components/media/LazyImage',
  './components/VideoEmbed': '@/components/media/VideoEmbed',
  '../components/VideoEmbed': '@/components/media/VideoEmbed',
  './components/ImageGallery': '@/components/media/ImageGallery',
  '../components/ImageGallery': '@/components/media/ImageGallery',
  './components/MusicPlayer': '@/components/media/MusicPlayer',
  '../components/MusicPlayer': '@/components/media/MusicPlayer',
  
  // UI components  
  './components/EnhancedInteractions': '@/components/ui/EnhancedInteractions',
  '../components/EnhancedInteractions': '@/components/ui/EnhancedInteractions',
  './components/IconWrapper': '@/components/ui/IconWrapper',
  '../components/IconWrapper': '@/components/ui/IconWrapper',
  './components/MarkdownRenderer': '@/components/ui/MarkdownRenderer',
  '../components/MarkdownRenderer': '@/components/ui/MarkdownRenderer',
  './components/RedirectSection': '@/components/ui/RedirectSection',
  '../components/RedirectSection': '@/components/ui/RedirectSection',
  './components/Terminal': '@/components/ui/Terminal',
  '../components/Terminal': '@/components/ui/Terminal',
  
  // Layout components
  './components/EnhancedNavigation': '@/components/Layout/EnhancedNavigation',
  '../components/EnhancedNavigation': '@/components/Layout/EnhancedNavigation',
  './components/MobileNavigation': '@/components/Layout/MobileNavigation',
  '../components/MobileNavigation': '@/components/Layout/MobileNavigation',
  
  // =================== SERVICES ===================
  './services/portfolioDataService': '@/shared/services/data/portfolioDataService',
  '../services/portfolioDataService': '@/shared/services/data/portfolioDataService',
  './services/googleAnalytics': '@/shared/services/analytics/googleAnalytics',
  '../services/googleAnalytics': '@/shared/services/analytics/googleAnalytics',
  './services/PortfolioAnalytics': '@/shared/services/analytics/PortfolioAnalytics',
  '../services/PortfolioAnalytics': '@/shared/services/analytics/PortfolioAnalytics',
  './services/analyticsService': '@/shared/services/analytics/analyticsService',
  '../services/analyticsService': '@/shared/services/analytics/analyticsService',
  './services/emailService': '@/shared/services/emailService',
  '../services/emailService': '@/shared/services/emailService',
  './services/pwaService': '@/shared/services/pwaService',
  '../services/pwaService': '@/shared/services/pwaService',
  
  // =================== ROUTER ===================
  './components/PortfolioRouter': '@/app/PortfolioRouter',
  '../components/PortfolioRouter': '@/app/PortfolioRouter',
  
  // =================== HOOKS ===================
  './hooks/usePerformanceMonitoring': '@/shared/hooks/usePerformanceMonitoring',
  '../hooks/usePerformanceMonitoring': '@/shared/hooks/usePerformanceMonitoring',
  './hooks/useOptimizedAnimations': '@/shared/hooks/useOptimizedAnimations',
  '../hooks/useOptimizedAnimations': '@/shared/hooks/useOptimizedAnimations',
  './hooks/useFastLoading': '@/shared/hooks/useFastLoading',
  '../hooks/useFastLoading': '@/shared/hooks/useFastLoading',
  
  // =================== UTILS ===================
  './utils/codeOptimization': '@/shared/utils/codeOptimization',
  '../utils/codeOptimization': '@/shared/utils/codeOptimization',
  './utils/ProjectImageGenerator': '@/shared/utils/ProjectImageGenerator',
  '../utils/ProjectImageGenerator': '@/shared/utils/ProjectImageGenerator',
  
  // =================== TYPES ===================
  './types/portfolioTypes': '@/shared/types/portfolioTypes',
  '../types/portfolioTypes': '@/shared/types/portfolioTypes',
  './types/dashboard': '@/shared/types/dashboard',
  '../types/dashboard': '@/shared/types/dashboard',
  
  // =================== CONTEXTS ===================
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

console.log('🔄 Updating import paths for complete reorganization...');

// Find all TypeScript files in src
const srcDir = path.join(process.cwd(), 'src');
const allFiles = findAllTsxFiles(srcDir);

console.log(`Found ${allFiles.length} TypeScript files to update`);

// Update imports in all files
allFiles.forEach(file => {
  updateImportsInFile(file);
});

console.log('✅ Complete import path updates finished!');
console.log('📋 Next steps:');
console.log('1. Run npm run build to check for any remaining import issues');
console.log('2. Fix any remaining path issues manually');
console.log('3. Test the application to ensure everything works correctly');
