import { useEffect, useState, useCallback } from 'react';

// ============= FAST LOADING OPTIMIZATION HOOK =============

interface LoadingOptimizationOptions {
  enablePrefetch?: boolean;
  enableLazyLoading?: boolean;
  criticalResourceHints?: boolean;
  hrOptimization?: boolean;
}

interface LoadingMetrics {
  isOptimized: boolean;
  loadingTime: number | null;
  criticalResourcesLoaded: boolean;
  hrReadyTime: number | null;
  optimizationTips: string[];
}

export const useFastLoading = (options: LoadingOptimizationOptions = {}) => {
  const {
    enablePrefetch = true,
    enableLazyLoading = true,
    criticalResourceHints = true,
    hrOptimization = true
  } = options;

  const [loadingMetrics, setLoadingMetrics] = useState<LoadingMetrics>({
    isOptimized: false,
    loadingTime: null,
    criticalResourcesLoaded: false,
    hrReadyTime: null,
    optimizationTips: []
  });

  const [isPageReady, setIsPageReady] = useState(false);

  // Preload critical HR assets
  const preloadCriticalAssets = useCallback(() => {
    if (!enablePrefetch) return;

    const criticalAssets = [
      // Profile image for immediate HR recognition
      '/assets/images/profile.jpg',
      '/assets/images/profile.webp',
      // Key fonts for professional appearance
      '/assets/fonts/devicon.woff',
      // Critical icons for quick scanning
      '/assets/icons/react.svg',
      '/assets/icons/typescript.svg',
      '/assets/icons/nodejs.svg'
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (asset.includes('.jpg') || asset.includes('.webp')) {
        link.as = 'image';
      } else if (asset.includes('.woff')) {
        link.as = 'font';
        link.type = 'font/woff';
        link.crossOrigin = 'anonymous';
      } else {
        link.as = 'image';
      }
      
      link.href = asset;
      document.head.appendChild(link);
    });
  }, [enablePrefetch]);

  // Optimize images for HR quick scanning
  const optimizeImageLoading = useCallback(() => {
    if (!enableLazyLoading) return;

    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // Load 50px before entering viewport
      threshold: 0.1
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));

    return () => {
      lazyImages.forEach(img => imageObserver.unobserve(img));
    };
  }, [enableLazyLoading]);

  // Add critical resource hints for HR optimization
  const addResourceHints = useCallback(() => {
    if (!criticalResourceHints) return;

    const hints = [
      // DNS prefetch for external services
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//calendly.com' },
      { rel: 'dns-prefetch', href: '//github.com' },
      { rel: 'dns-prefetch', href: '//linkedin.com' },
      
      // Preconnect for critical third-party resources
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossOrigin) {
          link.crossOrigin = hint.crossOrigin;
        }
        document.head.appendChild(link);
      }
    });
  }, [criticalResourceHints]);

  // Measure and optimize for HR requirements
  const measureHRReadiness = useCallback(() => {
    if (!hrOptimization) return;

    const startTime = performance.now();
    
    // Check critical elements for HR scanning
    const checkCriticalElements = () => {
      const criticalSelectors = [
        '[data-testid="hero-section"]',
        '[data-testid="contact-section"]',
        'img[alt*="profile"]',
        '.availability-status',
        '.skills-section'
      ];

      const loadedElements = criticalSelectors.filter(selector => 
        document.querySelector(selector) !== null
      );

      const allCriticalLoaded = loadedElements.length === criticalSelectors.length;
      
      if (allCriticalLoaded) {
        const hrReadyTime = performance.now() - startTime;
        setLoadingMetrics(prev => ({
          ...prev,
          criticalResourcesLoaded: true,
          hrReadyTime,
          isOptimized: hrReadyTime < 3000, // Target: Under 3 seconds for HR
          optimizationTips: hrReadyTime > 3000 ? [
            'Consider optimizing critical images',
            'Enable compression for faster loading',
            'Preload essential fonts and assets'
          ] : [
            'Excellent loading performance for HR!'
          ]
        }));
        setIsPageReady(true);
      }
    };

    // Check immediately and then poll
    checkCriticalElements();
    const interval = setInterval(checkCriticalElements, 100);
    
    // Cleanup after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (!isPageReady) {
        setLoadingMetrics(prev => ({
          ...prev,
          optimizationTips: [
            'Loading taking longer than expected',
            'Check network connection',
            'Consider enabling PWA for offline access'
          ]
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [hrOptimization, isPageReady]);

  // Initialize performance monitoring
  const measurePageLoad = useCallback(() => {
    const loadStartTime = performance.now();

    const handleLoad = () => {
      const loadTime = performance.now() - loadStartTime;
      setLoadingMetrics(prev => ({
        ...prev,
        loadingTime: loadTime
      }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Optimize for HR quick decisions
  const optimizeForHR = useCallback(() => {
    // Prioritize above-the-fold content
    const prioritizeATF = () => {
      const atfElements = document.querySelectorAll('[data-priority="high"]');
      atfElements.forEach(element => {
        (element as HTMLElement).style.willChange = 'transform';
      });
    };

    // Reduce layout shift for professional appearance
    const reduceLayoutShift = () => {
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        const image = img as HTMLImageElement;
        if (image.naturalWidth && image.naturalHeight) {
          const aspectRatio = image.naturalHeight / image.naturalWidth;
          image.style.aspectRatio = `1 / ${aspectRatio}`;
        }
      });
    };

    prioritizeATF();
    reduceLayoutShift();

    // Monitor for layout shifts
    if ('LayoutShift' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let cls = 0;
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        });
        
        if (cls > 0.1) { // Poor CLS threshold
          setLoadingMetrics(prev => ({
            ...prev,
            optimizationTips: [
              ...prev.optimizationTips,
              'Layout shifts detected - consider optimizing image dimensions'
            ]
          }));
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    preloadCriticalAssets();
    addResourceHints();
    
    const cleanupImage = optimizeImageLoading();
    const cleanupMeasure = measurePageLoad();
    const cleanupHR = measureHRReadiness();
    const cleanupOptimize = optimizeForHR();

    return () => {
      cleanupImage?.();
      cleanupMeasure?.();
      cleanupHR?.();
      cleanupOptimize?.();
    };
  }, [
    preloadCriticalAssets,
    addResourceHints,
    optimizeImageLoading,
    measurePageLoad,
    measureHRReadiness,
    optimizeForHR
  ]);

  return {
    loadingMetrics,
    isPageReady,
    preloadCriticalAssets,
    optimizeImageLoading
  };
};
