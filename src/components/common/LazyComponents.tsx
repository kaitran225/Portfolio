// Implement lazy loading for expensive components
import { lazyWithPreload } from '@/shared/utils/codeOptimization';

// Lazy load expensive components with preloading
export const LazyProjectGrid = lazyWithPreload(() => import('./ProjectGrid'));
export const LazySkillsVisualization = lazyWithPreload(() => import('./SkillsVisualization'));
export const LazyHeroSection = lazyWithPreload(() => import('./HeroSection'));
export const LazyEnhancedHeroSection = lazyWithPreload(() => import('./EnhancedHeroSection'));
export const LazyContactSection = lazyWithPreload(() => import('./ContactSection'));
export const LazyPerformanceAnalysis = lazyWithPreload(() => import('./PerformanceAnalysis'));
export const LazyDevProjectPage = lazyWithPreload(() => import('./DevProjectPage'));
export const LazyDesignProjectPage = lazyWithPreload(() => import('./DesignProjectPage'));

// Preload critical components on app start
export const preloadCriticalComponents = () => {
  // Preload hero sections for immediate display
  LazyHeroSection.preload();
  LazyEnhancedHeroSection.preload();
  
  // Preload contact section (high conversion priority)
  LazyContactSection.preload();
  
  // Preload skills for quick portfolio overview
  LazySkillsVisualization.preload();
};

// Preload project-related components when hovering over project links
export const preloadProjectComponents = () => {
  LazyProjectGrid.preload();
  LazyDevProjectPage.preload();
  LazyDesignProjectPage.preload();
};

// Preload performance tools for development
export const preloadDevelopmentTools = () => {
  if (process.env.NODE_ENV === 'development') {
    LazyPerformanceAnalysis.preload();
  }
};
