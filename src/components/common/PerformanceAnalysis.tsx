import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiZap, FiMonitor, FiTrendingUp, FiAlertCircle } from '../ui/IconWrapper';

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'excellent': return '#2ed573';
    case 'good': return '#1e90ff';
    case 'needs-improvement': return '#ffa502';
    case 'poor': return '#ff4757';
    default: return '#747d8c';
  }
};

// ============= PERFORMANCE ANALYSIS COMPONENT =============

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  
  // Additional metrics
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  loadTime: number | null;
  
  // Navigation timing
  domContentLoaded: number | null;
  domComplete: number | null;
  
  // Resource metrics
  totalResources: number;
  totalResourceSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  
  // Memory (if available)
  usedJSHeapSize: number | null;
  totalJSHeapSize: number | null;
}

interface PerformanceAnalysisProps {
  showDetails?: boolean;
  autoHide?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({
  showDetails = false,
  autoHide = true,
  position = 'bottom-right'
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(!autoHide);
  const [score, setScore] = useState<number>(0);
  const [status, setStatus] = useState<'excellent' | 'good' | 'needs-improvement' | 'poor'>('good');

  const getResourceType = (url: string): string => {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return '#2ed573';
      case 'good': return '#1e90ff';
      case 'needs-improvement': return '#ffa502';
      case 'poor': return '#ff4757';
      default: return '#747d8c';
    }
  };

  useEffect(() => {
    const gatherMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Calculate resource sizes
      const resourcesByType = resources.reduce((acc, resource) => {
        const type = getResourceType(resource.name);
        acc[type] = (acc[type] || 0) + (resource.transferSize || 0);
        return acc;
      }, {} as Record<string, number>);

      const newMetrics: PerformanceMetrics = {
        // Core Web Vitals (will be updated by observers)
        lcp: null,
        fid: null,
        cls: null,
        
        // Timing metrics
        fcp: null,
        ttfb: navigation.responseStart - navigation.requestStart,
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        domComplete: navigation.domComplete - navigation.fetchStart,
        
        // Resource metrics
        totalResources: resources.length,
        totalResourceSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
        jsSize: resourcesByType.script || 0,
        cssSize: resourcesByType.stylesheet || 0,
        imageSize: resourcesByType.image || 0,
        
        // Memory metrics
        usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || null,
        totalJSHeapSize: (performance as any).memory?.totalJSHeapSize || null,
      };

      setMetrics(newMetrics);
    };

    // Initial metrics gathering
    setTimeout(gatherMetrics, 2000);

    // Core Web Vitals observers
    if ('PerformanceObserver' in window) {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => prev ? { ...prev, lcp: lastEntry.startTime } : null);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FCP Observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => prev ? { ...prev, fcp: entry.startTime } : null);
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        setMetrics(prev => prev ? { ...prev, cls: clsValue } : null);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          setMetrics(prev => prev ? { ...prev, fid: entry.processingStart - entry.startTime } : null);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      return () => {
        lcpObserver.disconnect();
        fcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (metrics) {
      // Calculate performance score based on Core Web Vitals
      let totalScore = 0;
      let metricCount = 0;

      // LCP scoring (Good: <2.5s, Needs improvement: 2.5-4s, Poor: >4s)
      if (metrics.lcp !== null) {
        const lcpScore = metrics.lcp < 2500 ? 100 : metrics.lcp < 4000 ? 75 : 25;
        totalScore += lcpScore;
        metricCount++;
      }

      // FID scoring (Good: <100ms, Needs improvement: 100-300ms, Poor: >300ms)
      if (metrics.fid !== null) {
        const fidScore = metrics.fid < 100 ? 100 : metrics.fid < 300 ? 75 : 25;
        totalScore += fidScore;
        metricCount++;
      }

      // CLS scoring (Good: <0.1, Needs improvement: 0.1-0.25, Poor: >0.25)
      if (metrics.cls !== null) {
        const clsScore = metrics.cls < 0.1 ? 100 : metrics.cls < 0.25 ? 75 : 25;
        totalScore += clsScore;
        metricCount++;
      }

      // Additional metrics for overall score
      if (metrics.fcp !== null) {
        const fcpScore = metrics.fcp < 1800 ? 100 : metrics.fcp < 3000 ? 75 : 25;
        totalScore += fcpScore;
        metricCount++;
      }

      if (metrics.ttfb !== null) {
        const ttfbScore = metrics.ttfb < 600 ? 100 : metrics.ttfb < 1500 ? 75 : 25;
        totalScore += ttfbScore;
        metricCount++;
      }

      const finalScore = metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
      setScore(finalScore);

      // Determine status
      if (finalScore >= 90) setStatus('excellent');
      else if (finalScore >= 75) setStatus('good');
      else if (finalScore >= 50) setStatus('needs-improvement');
      else setStatus('poor');
    }
  }, [metrics]);

  if (!metrics) return null;

  return (
    <PerformanceContainer
      as={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0.3, scale: isVisible ? 1 : 0.8 }}
      $position={position}
      $expanded={showDetails}
    >
      <PerformanceHeader onClick={() => setIsVisible(!isVisible)}>
        <StatusIndicator $status={status}>
          <FiZap />
        </StatusIndicator>
        <HeaderInfo>
          <ScoreText>{score}</ScoreText>
          <StatusText $status={status}>{status.replace('-', ' ')}</StatusText>
        </HeaderInfo>
        <ToggleIcon $expanded={isVisible}>
          <FiActivity />
        </ToggleIcon>
      </PerformanceHeader>

      {isVisible && showDetails && (
        <PerformanceDetails
          as={motion.div}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <MetricsSection>
            <SectionTitle>
              <FiTrendingUp />
              Core Web Vitals
            </SectionTitle>
            <MetricsGrid>
              <MetricCard $status={metrics.lcp ? (metrics.lcp < 2500 ? 'good' : metrics.lcp < 4000 ? 'warning' : 'poor') : 'unknown'}>
                <MetricLabel>LCP</MetricLabel>
                <MetricValue>{metrics.lcp ? formatTime(metrics.lcp) : 'Measuring...'}</MetricValue>
                <MetricDescription>Largest Contentful Paint</MetricDescription>
              </MetricCard>

              <MetricCard $status={metrics.fid ? (metrics.fid < 100 ? 'good' : metrics.fid < 300 ? 'warning' : 'poor') : 'unknown'}>
                <MetricLabel>FID</MetricLabel>
                <MetricValue>{metrics.fid ? formatTime(metrics.fid) : 'Waiting...'}</MetricValue>
                <MetricDescription>First Input Delay</MetricDescription>
              </MetricCard>

              <MetricCard $status={metrics.cls ? (metrics.cls < 0.1 ? 'good' : metrics.cls < 0.25 ? 'warning' : 'poor') : 'unknown'}>
                <MetricLabel>CLS</MetricLabel>
                <MetricValue>{metrics.cls ? metrics.cls.toFixed(3) : 'Measuring...'}</MetricValue>
                <MetricDescription>Cumulative Layout Shift</MetricDescription>
              </MetricCard>
            </MetricsGrid>
          </MetricsSection>

          <MetricsSection>
            <SectionTitle>
              <FiClock />
              Timing Metrics
            </SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricLabel>FCP</MetricLabel>
                <MetricValue>{metrics.fcp ? formatTime(metrics.fcp) : 'N/A'}</MetricValue>
                <MetricDescription>First Contentful Paint</MetricDescription>
              </MetricCard>

              <MetricCard>
                <MetricLabel>TTFB</MetricLabel>
                <MetricValue>{metrics.ttfb ? formatTime(metrics.ttfb) : 'N/A'}</MetricValue>
                <MetricDescription>Time to First Byte</MetricDescription>
              </MetricCard>

              <MetricCard>
                <MetricLabel>Load</MetricLabel>
                <MetricValue>{metrics.loadTime ? formatTime(metrics.loadTime) : 'N/A'}</MetricValue>
                <MetricDescription>Page Load Time</MetricDescription>
              </MetricCard>
            </MetricsGrid>
          </MetricsSection>

          <MetricsSection>
            <SectionTitle>
              <FiMonitor />
              Resource Analysis
            </SectionTitle>
            <ResourceGrid>
              <ResourceItem>
                <ResourceLabel>Total Resources</ResourceLabel>
                <ResourceValue>{metrics.totalResources}</ResourceValue>
              </ResourceItem>
              <ResourceItem>
                <ResourceLabel>Total Size</ResourceLabel>
                <ResourceValue>{formatBytes(metrics.totalResourceSize)}</ResourceValue>
              </ResourceItem>
              <ResourceItem>
                <ResourceLabel>JavaScript</ResourceLabel>
                <ResourceValue>{formatBytes(metrics.jsSize)}</ResourceValue>
              </ResourceItem>
              <ResourceItem>
                <ResourceLabel>CSS</ResourceLabel>
                <ResourceValue>{formatBytes(metrics.cssSize)}</ResourceValue>
              </ResourceItem>
              <ResourceItem>
                <ResourceLabel>Images</ResourceLabel>
                <ResourceValue>{formatBytes(metrics.imageSize)}</ResourceValue>
              </ResourceItem>
              {metrics.usedJSHeapSize && (
                <ResourceItem>
                  <ResourceLabel>JS Heap</ResourceLabel>
                  <ResourceValue>{formatBytes(metrics.usedJSHeapSize)}</ResourceValue>
                </ResourceItem>
              )}
            </ResourceGrid>
          </MetricsSection>

          <Recommendations $status={status}>
            <SectionTitle>
              <FiAlertCircle />
              Recommendations
            </SectionTitle>
            {status === 'poor' && (
              <RecommendationList>
                <li>Optimize images and use modern formats (WebP, AVIF)</li>
                <li>Minimize JavaScript bundle size</li>
                <li>Implement lazy loading for images and components</li>
                <li>Use a Content Delivery Network (CDN)</li>
              </RecommendationList>
            )}
            {status === 'needs-improvement' && (
              <RecommendationList>
                <li>Consider code splitting for better loading performance</li>
                <li>Optimize web fonts loading</li>
                <li>Review and minimize layout shifts</li>
              </RecommendationList>
            )}
            {(status === 'good' || status === 'excellent') && (
              <RecommendationText>
                Great performance! Your site meets modern web standards.
              </RecommendationText>
            )}
          </Recommendations>
        </PerformanceDetails>
      )}
    </PerformanceContainer>
  );
};

// Styled Components
const PerformanceContainer = styled.div<{ $position: string; $expanded: boolean }>`
  position: fixed;
  ${props => {
    const [vPos, hPos] = props.$position.split('-');
    return `
      ${vPos}: 20px;
      ${hPos}: 20px;
    `;
  }}
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--shadow-medium);
  z-index: 1000;
  max-width: ${props => props.$expanded ? '400px' : '200px'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    max-width: 300px;
    font-size: 0.9rem;
  }
`;

const PerformanceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
`;

const StatusIndicator = styled.div<{ $status: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => getStatusColor(props.$status)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const ScoreText = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
`;

const StatusText = styled.div<{ $status: string }>`
  font-size: 0.75rem;
  color: ${props => getStatusColor(props.$status)};
  text-transform: capitalize;
  margin-top: 0.25rem;
`;

const ToggleIcon = styled.div<{ $expanded: boolean }>`
  color: var(--color-text-muted);
  transition: transform 0.3s ease;
  transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const PerformanceDetails = styled.div`
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
`;

const MetricsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
`;

const MetricCard = styled.div<{ $status?: string }>`
  background: var(--background-tertiary);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid ${props => props.$status ? getStatusColor(props.$status) + '40' : 'var(--border-color)'};
`;

const MetricLabel = styled.div`
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
`;

const MetricDescription = styled.div`
  font-size: 0.6rem;
  color: var(--color-text-muted);
  line-height: 1.2;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const ResourceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--background-tertiary);
  border-radius: 6px;
`;

const ResourceLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-muted);
`;

const ResourceValue = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const Recommendations = styled.div<{ $status: string }>`
  background: ${props => getStatusColor(props.$status)}10;
  border: 1px solid ${props => getStatusColor(props.$status)}40;
  border-radius: 8px;
  padding: 1rem;
`;

const RecommendationList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.4;

  li {
    margin-bottom: 0.5rem;
  }
`;

const RecommendationText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
`;

export default PerformanceAnalysis;
