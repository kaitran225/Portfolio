import { useEffect, useCallback } from 'react';

// ============= PERFORMANCE MONITORING HOOK =============

interface UsePerformanceOptions {
  reportToAnalytics?: boolean;
  logToConsole?: boolean;
  thresholds?: {
    FCP: number;
    LCP: number;
    FID: number;
    CLS: number;
  };
}

const defaultThresholds = {
  FCP: 1800, // Good < 1.8s
  LCP: 2500, // Good < 2.5s
  FID: 100,  // Good < 100ms
  CLS: 0.1   // Good < 0.1
};

export const usePerformanceMonitoring = (options: UsePerformanceOptions = {}) => {
  const {
    reportToAnalytics = false,
    logToConsole = true,
    thresholds = defaultThresholds
  } = options;

  const reportMetric = useCallback((metric: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' }) => {
    if (logToConsole) {
      console.log(`🚀 Performance Metric - ${metric.name}:`, {
        value: `${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'}`,
        rating: metric.rating,
        threshold: thresholds[metric.name as keyof typeof thresholds]
      });
    }

    if (reportToAnalytics && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_rating: metric.rating }
      });
    }
  }, [logToConsole, reportToAnalytics, thresholds]);

  const getRating = useCallback((name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (name === 'CLS') {
      if (value <= 0.1) return 'good';
      if (value <= 0.25) return 'needs-improvement';
      return 'poor';
    } else {
      if (value <= threshold) return 'good';
      if (value <= threshold * 1.5) return 'needs-improvement';
      return 'poor';
    }
  }, [thresholds]);

  useEffect(() => {
    // Check if Web Vitals API is supported
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      console.warn('Performance monitoring not supported in this browser');
      return;
    }

    // Monitor First Contentful Paint (FCP)
    const observeFCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            const value = fcpEntry.startTime;
            reportMetric({
              name: 'FCP',
              value,
              rating: getRating('FCP', value)
            });
            observer.disconnect();
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('FCP monitoring failed:', error);
      }
    };

    // Monitor Largest Contentful Paint (LCP)
    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const value = lastEntry.startTime;
            reportMetric({
              name: 'LCP',
              value,
              rating: getRating('LCP', value)
            });
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP monitoring failed:', error);
      }
    };

    // Monitor First Input Delay (FID)
    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const value = entry.processingStart - entry.startTime;
            reportMetric({
              name: 'FID',
              value,
              rating: getRating('FID', value)
            });
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID monitoring failed:', error);
      }
    };

    // Monitor Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        // Report CLS when the page is about to be unloaded
        const reportCLS = () => {
          reportMetric({
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue)
          });
        };

        window.addEventListener('beforeunload', reportCLS);
        
        // Also report after a delay
        setTimeout(reportCLS, 5000);

        return () => {
          window.removeEventListener('beforeunload', reportCLS);
          observer.disconnect();
        };
      } catch (error) {
        console.warn('CLS monitoring failed:', error);
      }
    };

    // Monitor Time to First Byte (TTFB)
    const observeTTFB = () => {
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          reportMetric({
            name: 'TTFB',
            value: ttfb,
            rating: ttfb <= 600 ? 'good' : ttfb <= 1500 ? 'needs-improvement' : 'poor'
          });
        }
      } catch (error) {
        console.warn('TTFB monitoring failed:', error);
      }
    };

    // Initialize all observers
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
    observeTTFB();

    // General performance logging
    if (logToConsole) {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log('📊 Page Load Performance:', {
            'DOM Content Loaded': `${(navigation.domContentLoadedEventEnd - navigation.fetchStart).toFixed(2)}ms`,
            'Page Load Complete': `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`,
            'DNS Lookup': `${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`,
            'TCP Connection': `${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`,
            'Server Response': `${(navigation.responseEnd - navigation.requestStart).toFixed(2)}ms`,
            'DOM Processing': `${(navigation.domComplete - navigation.responseEnd).toFixed(2)}ms`
          });
        }
      }, 2000);
    }

    // Cleanup function
    return () => {
      // Observers are cleaned up in their respective functions
    };
  }, [reportMetric, getRating, logToConsole]);

  // Return utility functions for manual performance tracking
  return {
    // Manual metric reporting
    reportCustomMetric: useCallback((name: string, value: number) => {
      reportMetric({
        name,
        value,
        rating: 'good' // Custom metrics don't have predefined ratings
      });
    }, [reportMetric]),

    // Performance mark/measure utilities
    mark: useCallback((name: string) => {
      performance.mark(name);
    }, []),

    measure: useCallback((name: string, startMark: string, endMark?: string) => {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure && logToConsole) {
          console.log(`⏱️ Performance Measure - ${name}: ${measure.duration.toFixed(2)}ms`);
        }
        
        return measure?.duration || 0;
      } catch (error) {
        console.warn(`Performance measure failed for ${name}:`, error);
        return 0;
      }
    }, [logToConsole])
  };
};

// Additional utility for component-level performance tracking
export const useComponentPerformance = (componentName: string) => {
  const { mark, measure } = usePerformanceMonitoring();

  useEffect(() => {
    const mountTime = `${componentName}-mount-start`;
    mark(mountTime);

    return () => {
      const unmountTime = `${componentName}-unmount`;
      mark(unmountTime);
      measure(`${componentName}-lifecycle`, mountTime, unmountTime);
    };
  }, [componentName, mark, measure]);
};

export default usePerformanceMonitoring;
