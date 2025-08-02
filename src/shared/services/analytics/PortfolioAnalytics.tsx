import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';

// ============= PORTFOLIO ANALYTICS COMPONENT =============

interface AnalyticsEvent {
  name: string;
  category: 'navigation' | 'interaction' | 'performance' | 'engagement' | 'contact';
  properties?: Record<string, any>;
  timestamp?: number;
}

interface PageView {
  path: string;
  timestamp: number;
  referrer?: string;
  userAgent?: string;
  screenResolution?: string;
  timeOnPage?: number;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  pageViews: PageView[];
  events: AnalyticsEvent[];
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

class PortfolioAnalytics {
  private currentSession: UserSession;
  private sessionStartTime: number;
  private currentPageStartTime: number;
  private isEnabled: boolean;
  private queue: (AnalyticsEvent | PageView)[] = [];

  constructor() {
    this.sessionStartTime = Date.now();
    this.currentPageStartTime = Date.now();
    this.isEnabled = this.shouldEnableAnalytics();
    
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: this.sessionStartTime,
      pageViews: [],
      events: [],
      device: this.detectDevice()
    };

    if (this.isEnabled) {
      this.initializeSession();
      this.setupEventListeners();
    }
  }

  private shouldEnableAnalytics(): boolean {
    // Check for DNT (Do Not Track) header
    if (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1') {
      return false;
    }

    // Check if user has opted out
    const optOut = localStorage.getItem('analytics-opt-out');
    if (optOut === 'true') {
      return false;
    }

    // Check if this is localhost/development
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('dev')) {
      return false;
    }

    return true;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectDevice() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;

    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (screenWidth < 768) deviceType = 'mobile';
    else if (screenWidth < 1024) deviceType = 'tablet';

    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    return { type: deviceType, os, browser };
  }

  private async initializeSession() {
    // Get user's approximate location (country/region only)
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        this.currentSession.location = {
          country: data.country_name,
          region: data.region,
          city: data.city
        };
      }
    } catch (error) {
      console.debug('Could not fetch location data:', error);
    }

    this.trackPageView();
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent({
          name: 'page_hidden',
          category: 'engagement',
          properties: {
            timeOnPage: Date.now() - this.currentPageStartTime
          }
        });
      } else {
        this.currentPageStartTime = Date.now();
        this.trackEvent({
          name: 'page_visible',
          category: 'engagement'
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
        maxScrollDepth = scrollPercent;
        this.trackEvent({
          name: 'scroll_depth',
          category: 'engagement',
          properties: { depth: scrollPercent }
        });
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.closest('button') || target;
        this.trackEvent({
          name: 'button_click',
          category: 'interaction',
          properties: {
            buttonText: button.textContent?.trim(),
            buttonId: button.id,
            buttonClass: button.className
          }
        });
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = (target.closest('a') || target) as HTMLAnchorElement;
        this.trackEvent({
          name: 'link_click',
          category: 'navigation',
          properties: {
            url: link.href,
            text: link.textContent?.trim(),
            external: link.hostname !== window.location.hostname
          }
        });
      }

      // Track project interactions
      if (target.closest('[data-project]')) {
        const projectEl = target.closest('[data-project]');
        this.trackEvent({
          name: 'project_interaction',
          category: 'engagement',
          properties: {
            projectId: projectEl?.getAttribute('data-project'),
            interactionType: target.tagName.toLowerCase()
          }
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackEvent({
        name: 'form_submit',
        category: 'contact',
        properties: {
          formId: form.id,
          formAction: form.action
        }
      });
    });

    // Track when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => this.trackPerformanceMetrics(), 2000);
    });
  }

  public trackPageView(path?: string) {
    if (!this.isEnabled) return;

    const pageView: PageView = {
      path: path || window.location.pathname,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    this.currentSession.pageViews.push(pageView);
    this.sendData({ type: 'pageview', data: pageView });
  }

  public trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const enhancedEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.currentSession.events.push(enhancedEvent);
    this.sendData({ type: 'event', data: enhancedEvent });
  }

  public trackSkillInteraction(skillName: string, interactionType: string) {
    this.trackEvent({
      name: 'skill_interaction',
      category: 'engagement',
      properties: {
        skillName,
        interactionType
      }
    });
  }

  public trackProjectView(projectId: string, projectName: string) {
    this.trackEvent({
      name: 'project_view',
      category: 'engagement',
      properties: {
        projectId,
        projectName
      }
    });
  }

  public trackContactFormStep(step: string, data?: Record<string, any>) {
    this.trackEvent({
      name: 'contact_form_step',
      category: 'contact',
      properties: {
        step,
        ...data
      }
    });
  }

  public trackThemeChange(theme: string) {
    this.trackEvent({
      name: 'theme_change',
      category: 'interaction',
      properties: { theme }
    });
  }

  public trackSearchUsage(query: string, results: number) {
    this.trackEvent({
      name: 'search_usage',
      category: 'interaction',
      properties: {
        query: query.toLowerCase(),
        resultCount: results
      }
    });
  }

  private trackPerformanceMetrics() {
    if (!window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const metrics = {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      firstContentfulPaint: this.getFirstContentfulPaint(),
      timeToInteractive: this.getTimeToInteractive()
    };

    this.trackEvent({
      name: 'performance_metrics',
      category: 'performance',
      properties: metrics
    });
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  }

  private getTimeToInteractive(): number | null {
    // Simplified TTI calculation
    // In a real implementation, you'd use a more sophisticated algorithm
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation ? navigation.domInteractive - navigation.fetchStart : null;
  }

  private sendData(payload: any) {
    // In development or for privacy, we might just log
    if (process.env.NODE_ENV === 'development') {
      console.debug('Analytics:', payload);
      return;
    }

    // Queue the data if we can't send immediately
    this.queue.push(payload);

    // Try to send queued data
    this.flushQueue();
  }

  private async flushQueue() {
    if (this.queue.length === 0) return;

    try {
      // In a real implementation, you'd send to your analytics endpoint
      // For now, we'll just store locally for demo purposes
      const existingData = localStorage.getItem('portfolio-analytics') || '[]';
      const analytics = JSON.parse(existingData);
      analytics.push(...this.queue);
      
      // Keep only last 1000 events to prevent storage overflow
      if (analytics.length > 1000) {
        analytics.splice(0, analytics.length - 1000);
      }
      
      localStorage.setItem('portfolio-analytics', JSON.stringify(analytics));
      this.queue = [];
    } catch (error) {
      console.debug('Failed to store analytics data:', error);
    }
  }

  private endSession() {
    if (!this.isEnabled) return;

    this.currentSession.endTime = Date.now();
    
    // Add time on page for the last page view
    const lastPageView = this.currentSession.pageViews[this.currentSession.pageViews.length - 1];
    if (lastPageView) {
      lastPageView.timeOnPage = Date.now() - this.currentPageStartTime;
    }

    this.sendData({ type: 'session_end', data: this.currentSession });
  }

  public getSessionSummary() {
    return {
      sessionId: this.currentSession.sessionId,
      duration: Date.now() - this.sessionStartTime,
      pageViews: this.currentSession.pageViews.length,
      events: this.currentSession.events.length,
      device: this.currentSession.device
    };
  }

  public optOut() {
    localStorage.setItem('analytics-opt-out', 'true');
    this.isEnabled = false;
    this.queue = [];
  }

  public optIn() {
    localStorage.removeItem('analytics-opt-out');
    this.isEnabled = true;
    this.initializeSession();
  }

  public clearData() {
    localStorage.removeItem('portfolio-analytics');
    this.queue = [];
  }
}

// React Hook for Analytics
export const useAnalytics = () => {
  const analyticsRef = useRef<PortfolioAnalytics | null>(null);

  useEffect(() => {
    if (!analyticsRef.current) {
      analyticsRef.current = new PortfolioAnalytics();
    }

    return () => {
      // Cleanup is handled by the beforeunload listener
    };
  }, []);

  return analyticsRef.current;
};

// Analytics Context Provider Component

interface AnalyticsContextType {
  analytics: PortfolioAnalytics | null;
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (path?: string) => void;
  trackSkillInteraction: (skillName: string, interactionType: string) => void;
  trackProjectView: (projectId: string, projectName: string) => void;
  trackContactFormStep: (step: string, data?: Record<string, any>) => void;
  trackThemeChange: (theme: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const analytics = useAnalytics();

  const contextValue: AnalyticsContextType = {
    analytics,
    trackEvent: (event) => analytics?.trackEvent(event),
    trackPageView: (path) => analytics?.trackPageView(path),
    trackSkillInteraction: (skillName, interactionType) => 
      analytics?.trackSkillInteraction(skillName, interactionType),
    trackProjectView: (projectId, projectName) => 
      analytics?.trackProjectView(projectId, projectName),
    trackContactFormStep: (step, data) => 
      analytics?.trackContactFormStep(step, data),
    trackThemeChange: (theme) => analytics?.trackThemeChange(theme),
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export default PortfolioAnalytics;
