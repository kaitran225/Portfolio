// Google Analytics 4 Setup for Portfolio
import ReactGA from 'react-ga4';

// Analytics configuration
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (process.env.NODE_ENV === 'production' && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gtagOptions: {
        debug_mode: false,
        send_page_view: false // We'll send page views manually
      }
    });
    
    console.log('✅ Google Analytics initialized');
  } else {
    console.log('🔒 Google Analytics disabled in development');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      action,
      category,
      label,
      value
    });
  }
};

// Track Core Web Vitals
export const trackWebVitals = () => {
  if (process.env.NODE_ENV === 'production' && 'PerformanceObserver' in window) {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      ReactGA.event({
        action: 'LCP',
        category: 'Web Vitals',
        value: Math.round(lastEntry.startTime),
        label: 'ms'
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        ReactGA.event({
          action: 'FID',
          category: 'Web Vitals',
          value: Math.round(entry.processingStart - entry.startTime),
          label: 'ms'
        });
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      // Send CLS after 5 seconds
      setTimeout(() => {
        ReactGA.event({
          action: 'CLS',
          category: 'Web Vitals',
          value: Math.round(clsValue * 1000), // Convert to integer
          label: 'score'
        });
      }, 5000);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
};

// Portfolio-specific tracking
export const trackPortfolioEvents = {
  projectView: (projectId: string, projectType: 'development' | 'design') => {
    trackEvent('view_project', 'Portfolio', `${projectType}_${projectId}`);
  },
  
  contactFormSubmit: (formType: string) => {
    trackEvent('contact_form_submit', 'Engagement', formType);
  },
  
  ctaClick: (ctaType: string, location: string) => {
    trackEvent('cta_click', 'Navigation', `${ctaType}_${location}`);
  },
  
  resumeDownload: () => {
    trackEvent('resume_download', 'Conversion', 'pdf');
  },
  
  externalLinkClick: (linkType: string, destination: string) => {
    trackEvent('external_link', 'Engagement', `${linkType}_${destination}`);
  },
  
  skillsInteraction: (skillCategory: string) => {
    trackEvent('skills_interaction', 'Portfolio', skillCategory);
  },
  
  themeToggle: (newTheme: string) => {
    trackEvent('theme_toggle', 'UX', newTheme);
  },
  
  searchUsage: (searchTerm: string) => {
    trackEvent('search', 'Portfolio', searchTerm);
  }
};

// Performance tracking
export const trackPerformanceMetrics = () => {
  if (process.env.NODE_ENV === 'production' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Track page load time
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        trackEvent('page_load_time', 'Performance', 'ms', Math.round(loadTime));
        
        // Track time to interactive
        const tti = navigation.domInteractive - navigation.fetchStart;
        trackEvent('time_to_interactive', 'Performance', 'ms', Math.round(tti));
        
        // Track first contentful paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          trackEvent('first_contentful_paint', 'Performance', 'ms', Math.round(fcp.startTime));
        }
      }, 0);
    });
  }
};

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      action: 'javascript_error',
      category: 'Error',
      label: error.message,
      value: 1
    });
    
    // Also log to console for debugging
    console.error('Portfolio Error:', error, errorInfo);
  }
};

// Scroll depth tracking
export const trackScrollDepth = () => {
  if (process.env.NODE_ENV === 'production') {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const triggered = new Set();
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);
      
      milestones.forEach(milestone => {
        if (maxScroll >= milestone && !triggered.has(milestone)) {
          triggered.add(milestone);
          trackEvent('scroll_depth', 'Engagement', `${milestone}%`);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('scroll', handleScroll);
    });
  }
};

// Export as named constant to fix ESLint warning
const googleAnalytics = {
  initialize: initializeAnalytics,
  trackPageView,
  trackEvent,
  trackWebVitals,
  trackPortfolioEvents,
  trackPerformanceMetrics,
  trackError,
  trackScrollDepth
};

export default googleAnalytics;
