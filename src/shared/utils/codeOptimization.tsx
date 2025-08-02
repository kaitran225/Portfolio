import React, { memo } from 'react';
import { ComponentType, LazyExoticComponent } from 'react';

// ============= CODE SPLITTING UTILITIES =============

/**
 * Enhanced lazy loading with preloading capabilities
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  const Component = React.lazy(factory);
  (Component as any).preload = factory;
  return Component as any;
}

/**
 * Route-based code splitting with automatic preloading
 */
export function createRouteLazy<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  preloadDelay: number = 2000
): LazyExoticComponent<T> {
  const Component = lazyWithPreload(factory);
  
  // Preload after delay
  setTimeout(() => {
    (Component as any).preload();
  }, preloadDelay);
  
  return Component;
}

/**
 * Higher-order component for memoization with custom comparison
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, areEqual);
}

/**
 * Performance-optimized component wrapper
 */
export function withPerformance<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) {
  const MemoizedComponent = memo(Component);
  
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }
  
  return MemoizedComponent;
}

// ============= LAZY COMPONENT DEFINITIONS =============

// Main portfolio components (critical path)
export const LazyHeroSection = lazyWithPreload(() => import('../../features/landing/components/EnhancedHeroSection'));
export const LazyProjectGrid = lazyWithPreload(() => import('../../features/projects/components/ProjectGrid'));
export const LazyContactSection = lazyWithPreload(() => import('../../features/contact/components/ContactSection'));

// Heavy components (load on demand)
export const LazyTerminal = React.lazy(() => import('../../components/ui/Terminal'));

// Form components
export const LazyProfessionalContactForm = React.lazy(() => import('../../features/contact/components/ProfessionalContactForm'));

// Development tools
export const LazyPerformanceMonitor = React.lazy(() => import('../../components/common/PerformanceMonitor'));

// ============= PRELOADING STRATEGIES =============

/**
 * Preload critical components on user interaction
 */
export const preloadCriticalComponents = () => {
  Promise.all([
    (LazyProjectGrid as any).preload(),
    (LazyContactSection as any).preload(),
    (LazyHeroSection as any).preload()
  ]).catch(console.error);
};

/**
 * Preload components based on user behavior
 */
export const preloadOnHover = (componentName: string) => {
  const preloadMap: Record<string, () => Promise<any>> = {
    'contact': () => (LazyProfessionalContactForm as any).preload(),
    'terminal': () => (LazyTerminal as any).preload()
  };
  
  if (preloadMap[componentName]) {
    preloadMap[componentName]().catch(console.error);
  }
};

/**
 * Preload components on intersection (viewport)
 */
export const preloadOnIntersection = (element: Element, componentName: string) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        preloadOnHover(componentName);
        observer.disconnect();
      }
    },
    { rootMargin: '100px' }
  );
  
  observer.observe(element);
};

// ============= BUNDLE OPTIMIZATION COMPONENT =============

interface BundleOptimizerProps {
  children: React.ReactNode;
  enablePreloading?: boolean;
}

export const BundleOptimizer: React.FC<BundleOptimizerProps> = memo(({
  children,
  enablePreloading = true
}) => {
  React.useEffect(() => {
    if (!enablePreloading) return;
    
    // Preload critical components after initial render
    const timer = setTimeout(preloadCriticalComponents, 1000);
    
    // Preload on user interaction
    const handleUserInteraction = () => {
      preloadCriticalComponents();
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('mousemove', handleUserInteraction, { passive: true });
    document.addEventListener('scroll', handleUserInteraction, { passive: true });
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [enablePreloading]);
  
  return <>{children}</>;
});

BundleOptimizer.displayName = 'BundleOptimizer';

// ============= PERFORMANCE HOOKS =============

/**
 * Hook for measuring component render performance
 */
export const useRenderPerformance = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      // Report to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_timing', {
          event_category: 'render',
          event_label: componentName,
          value: Math.round(renderTime)
        });
      }
    };
  });
};

/**
 * Hook for optimizing expensive computations
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  return React.useMemo(() => {
    const startTime = performance.now();
    const result = factory();
    const computeTime = performance.now() - startTime;
    
    if (computeTime > 5 && debugName) {
      console.debug(`Expensive computation in ${debugName}: ${computeTime.toFixed(2)}ms`);
    }
    
    return result;
  }, deps);
}

export default BundleOptimizer;
