// Google Analytics 4 Integration
interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface GAPageView {
  page_title: string;
  page_location: string;
  page_path: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class GoogleAnalyticsService {
  private measurementId: string;
  private isInitialized = false;
  private isEnabled: boolean;

  constructor() {
    this.measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || '';
    this.isEnabled = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';
    
    if (this.isEnabled && this.measurementId) {
      this.initialize();
    }
  }

  private initialize() {
    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };

      // Configure GA
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: false, // We'll manually control page views
        anonymize_ip: true,
        allow_google_signals: false,
        cookie_flags: 'SameSite=Strict;Secure',
      });

      this.isInitialized = true;
      console.log('Google Analytics initialized');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  // Track page views
  trackPageView(pageData: Partial<GAPageView> = {}) {
    if (!this.isInitialized || !this.isEnabled) return;

    const pageView: GAPageView = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...pageData
    };

    window.gtag('config', this.measurementId, pageView);
  }

  // Track custom events
  trackEvent(event: GAEvent) {
    if (!this.isInitialized || !this.isEnabled) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  // Track portfolio-specific events
  trackProjectView(projectId: string, projectTitle: string) {
    this.trackEvent({
      action: 'view_project',
      category: 'Portfolio',
      label: `${projectId}: ${projectTitle}`,
    });
  }

  trackContactFormSubmit(projectType: string) {
    this.trackEvent({
      action: 'contact_form_submit',
      category: 'Lead Generation',
      label: projectType,
    });
  }

  trackDownload(fileName: string) {
    this.trackEvent({
      action: 'download',
      category: 'Resources',
      label: fileName,
    });
  }

  trackExternalLink(url: string, linkText: string) {
    this.trackEvent({
      action: 'external_link_click',
      category: 'Outbound Links',
      label: `${linkText}: ${url}`,
    });
  }

  trackPerformanceMetric(metricName: string, value: number) {
    this.trackEvent({
      action: 'performance_metric',
      category: 'Web Vitals',
      label: metricName,
      value: Math.round(value),
    });
  }

  // Track user engagement
  trackTimeOnPage() {
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent({
        action: 'time_on_page',
        category: 'User Engagement',
        label: window.location.pathname,
        value: timeSpent,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }

  // GDPR compliant methods
  enableAnalytics() {
    this.isEnabled = true;
    if (!this.isInitialized) {
      this.initialize();
    }
  }

  disableAnalytics() {
    this.isEnabled = false;
    // Disable GA collection
    if (window.gtag) {
      window.gtag('config', this.measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_features: false,
      });
    }
  }

  getAnalyticsStatus() {
    return {
      isEnabled: this.isEnabled,
      isInitialized: this.isInitialized,
      measurementId: this.measurementId ? this.measurementId.substring(0, 8) + '...' : 'Not configured',
    };
  }
}

// Error Tracking Service
class ErrorTrackingService {
  private isEnabled: boolean;
  private errors: Array<{
    message: string;
    stack?: string;
    timestamp: number;
    url: string;
    userAgent: string;
    userId?: string;
  }> = [];

  constructor() {
    this.isEnabled = process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true';
    
    if (this.isEnabled) {
      this.initialize();
    }
  }

  private initialize() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      });
    });

    // React error boundary integration
    this.setupReactErrorBoundary();
  }

  private setupReactErrorBoundary() {
    // This would typically be integrated with your React Error Boundary component
    // For now, we'll just expose a method that can be called from error boundaries
  }

  logError(error: {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    userId?: string;
    context?: any;
  }) {
    if (!this.isEnabled) return;

    const errorEntry = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: error.userId,
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno,
      context: error.context,
    };

    this.errors.push(errorEntry);

    // In a real application, you would send this to your error tracking service
    console.error('Error tracked:', errorEntry);

    // Keep only last 50 errors in memory
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Trigger analytics event for critical errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  // Report error to external service (mock implementation)
  async reportError(error: any) {
    if (!this.isEnabled) return;

    try {
      // In a real implementation, you would send to Sentry, LogRocket, etc.
      const errorReport = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        buildVersion: process.env.REACT_APP_VERSION || 'unknown',
      };

      console.log('Error report (would be sent to external service):', errorReport);
      
      // Mock API call
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
      
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
}

// Performance Monitoring Service
class PerformanceMonitoringService {
  private observer?: PerformanceObserver;
  private metrics: { [key: string]: number } = {};

  constructor() {
    this.initialize();
  }

  private initialize() {
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObserver();
    }
    
    this.measureInitialLoad();
  }

  private setupPerformanceObserver() {
    try {
      // Observe Core Web Vitals
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.observer.observe({ type: 'navigation', buffered: true });
      this.observer.observe({ type: 'paint', buffered: true });
      this.observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observer.observe({ type: 'first-input', buffered: true });
      this.observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
        this.metrics.loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;
        break;
        
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
        break;
        
      case 'largest-contentful-paint':
        this.metrics.lcp = entry.startTime;
        break;
        
      case 'first-input':
        const fiEntry = entry as any;
        this.metrics.fid = fiEntry.processingStart - fiEntry.startTime;
        break;
        
      case 'layout-shift':
        const lsEntry = entry as any;
        if (!lsEntry.hadRecentInput) {
          this.metrics.cls = (this.metrics.cls || 0) + lsEntry.value;
        }
        break;
    }
  }

  private measureInitialLoad() {
    window.addEventListener('load', () => {
      // Measure bundle size impact
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      this.metrics.jsLoadTime = jsResources.reduce((total, resource) => 
        total + (resource.responseEnd - resource.requestStart), 0);
      this.metrics.cssLoadTime = cssResources.reduce((total, resource) => 
        total + (resource.responseEnd - resource.requestStart), 0);
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }

  measureCustomMetric(name: string, startTime: number) {
    const endTime = performance.now();
    this.metrics[name] = endTime - startTime;
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(endTime - startTime),
      });
    }
  }

  // React-specific performance hooks
  measureComponentRender(componentName: string) {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      this.metrics[`${componentName}_render`] = renderTime;
      
      // Log slow renders
      if (renderTime > 50) {
        console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Create singleton instances
export const analyticsService = new GoogleAnalyticsService();
export const errorTrackingService = new ErrorTrackingService();
export const performanceMonitoringService = new PerformanceMonitoringService();

// React hooks for easy integration
import { useEffect } from 'react';

export const useAnalytics = () => {
  useEffect(() => {
    const cleanup = analyticsService.trackTimeOnPage();
    return cleanup;
  }, []);

  return {
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    trackProjectView: analyticsService.trackProjectView.bind(analyticsService),
    trackContactFormSubmit: analyticsService.trackContactFormSubmit.bind(analyticsService),
    trackDownload: analyticsService.trackDownload.bind(analyticsService),
    trackExternalLink: analyticsService.trackExternalLink.bind(analyticsService),
  };
};

export const useErrorTracking = () => {
  return {
    logError: errorTrackingService.logError.bind(errorTrackingService),
    reportError: errorTrackingService.reportError.bind(errorTrackingService),
    getErrors: errorTrackingService.getErrors.bind(errorTrackingService),
  };
};

export const usePerformanceMonitoring = () => {
  return {
    measureCustomMetric: performanceMonitoringService.measureCustomMetric.bind(performanceMonitoringService),
    measureComponentRender: performanceMonitoringService.measureComponentRender.bind(performanceMonitoringService),
    getMetrics: performanceMonitoringService.getMetrics.bind(performanceMonitoringService),
  };
};

export default {
  analyticsService,
  errorTrackingService,
  performanceMonitoringService,
};
