import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// ============= PERFORMANCE MONITORING COMPONENT =============

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  
  // Other metrics
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  loadTime: number | null;
}

interface PerformanceMonitorProps {
  isVisible?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  isVisible = false, 
  onMetricsUpdate 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    loadTime: null
  });

  const [isOptimal, setIsOptimal] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;
    
    // Delay observer initialization to prevent blocking
    timeoutId = setTimeout(() => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          const newMetrics = { ...metrics };
          
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              newMetrics.lcp = entry.startTime;
              break;
            case 'first-input':
              newMetrics.fid = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                newMetrics.cls = (newMetrics.cls || 0) + (entry as any).value;
              }
              break;
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                newMetrics.fcp = entry.startTime;
              }
              break;
            case 'navigation':
              const navEntry = entry as PerformanceNavigationTiming;
              newMetrics.ttfb = navEntry.responseStart - navEntry.requestStart;
              newMetrics.loadTime = navEntry.loadEventEnd - navEntry.startTime;
              break;
          }
          
          setMetrics(newMetrics);
          onMetricsUpdate?.(newMetrics);
          
          // Check if performance is optimal
          const optimal = (
            (!newMetrics.lcp || newMetrics.lcp < 2500) &&
            (!newMetrics.fid || newMetrics.fid < 100) &&
            (!newMetrics.cls || newMetrics.cls < 0.1) &&
            (!newMetrics.fcp || newMetrics.fcp < 1800)
          );
          setIsOptimal(optimal);
        });
      });

      // Observe different performance entry types
      const entryTypes = [
        'largest-contentful-paint',
        'first-input',
        'layout-shift',
        'paint',
        'navigation'
      ];

      entryTypes.forEach(type => {
        try {
          observer.observe({ type, buffered: true });
        } catch (e) {
          // Some browsers might not support all entry types
          console.debug(`Performance observer type '${type}' not supported`);
        }
      });

      return () => observer.disconnect();
    }, 100); // Delay by 100ms

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [metrics, onMetricsUpdate]);

  const getMetricStatus = (value: number | null, good: number, needs: number) => {
    if (value === null) return 'loading';
    if (value <= good) return 'good';
    if (value <= needs) return 'needs-improvement';
    return 'poor';
  };

  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return '--';
    return `${Math.round(value)}${unit}`;
  };

  if (!isVisible) return null;

  return (
    <PerformanceContainer $isOptimal={isOptimal}>
      <PerformanceHeader>
        <StatusIndicator $isOptimal={isOptimal} />
        <HeaderText>
          <Title>Performance Monitor</Title>
          <Status $isOptimal={isOptimal}>
            {isOptimal ? 'Optimized for HR' : 'Optimizing...'}
          </Status>
        </HeaderText>
      </PerformanceHeader>

      <MetricsGrid>
        <MetricCard $status={getMetricStatus(metrics.lcp, 2500, 4000)}>
          <MetricLabel>LCP</MetricLabel>
          <MetricValue>{formatMetric(metrics.lcp)}</MetricValue>
          <MetricDescription>Largest Contentful Paint</MetricDescription>
        </MetricCard>

        <MetricCard $status={getMetricStatus(metrics.fid, 100, 300)}>
          <MetricLabel>FID</MetricLabel>
          <MetricValue>{formatMetric(metrics.fid)}</MetricValue>
          <MetricDescription>First Input Delay</MetricDescription>
        </MetricCard>

        <MetricCard $status={getMetricStatus(metrics.cls, 0.1, 0.25)}>
          <MetricLabel>CLS</MetricLabel>
          <MetricValue>{formatMetric(metrics.cls, '')}</MetricValue>
          <MetricDescription>Cumulative Layout Shift</MetricDescription>
        </MetricCard>

        <MetricCard $status={getMetricStatus(metrics.fcp, 1800, 3000)}>
          <MetricLabel>FCP</MetricLabel>
          <MetricValue>{formatMetric(metrics.fcp)}</MetricValue>
          <MetricDescription>First Contentful Paint</MetricDescription>
        </MetricCard>
      </MetricsGrid>

      <PerformanceNote>
        Optimized for instant HR evaluation • Target: Sub-3s load times
      </PerformanceNote>
    </PerformanceContainer>
  );
};

// Styled Components
const PerformanceContainer = styled.div<{ $isOptimal: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid ${props => props.$isOptimal ? '#2ed573' : '#ffa502'};
  box-shadow: var(--shadow-medium);
  min-width: 280px;
  z-index: 1000;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
`;

const PerformanceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatusIndicator = styled.div<{ $isOptimal: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$isOptimal ? '#2ed573' : '#ffa502'};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  color: var(--color-text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
`;

const Status = styled.div<{ $isOptimal: boolean }>`
  color: ${props => props.$isOptimal ? '#2ed573' : '#ffa502'};
  font-size: 0.75rem;
  font-weight: 500;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const MetricCard = styled.div<{ $status: string }>`
  background: var(--background-tertiary);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'good': return '#2ed573';
      case 'needs-improvement': return '#ffa502';
      case 'poor': return '#ff4757';
      default: return 'var(--border-color)';
    }
  }};
`;

const MetricLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const MetricDescription = styled.div`
  color: var(--color-text-muted);
  font-size: 0.6rem;
  line-height: 1.2;
`;

const PerformanceNote = styled.div`
  color: var(--color-text-muted);
  font-size: 0.7rem;
  text-align: center;
  font-style: italic;
`;

export default PerformanceMonitor;
