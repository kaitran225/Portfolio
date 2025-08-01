import React, { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PortfolioRouter from './components/PortfolioRouter';
import LaTeXCV from './components/LaTeXCV';
import { LoadingManager } from './components/LoadingManager';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import { AnalyticsProvider } from './services/PortfolioAnalytics';
import { createMaterialTheme } from './theme/materialTheme';
import PWABanner from './components/PWABanner';
import './App.css';

// Lazy load heavy components for better performance
const SEOOptimizer = lazy(() => import('./components/SEOOptimizer'));
const PerformanceAnalysis = lazy(() => import('./components/PerformanceAnalysis'));
const AccessibilityControls = lazy(() => import('./components/AccessibilityControls'));
const MobileNavigation = lazy(() => import('./components/MobileNavigation'));

// Loading fallback component
const ComponentLoader: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '1rem',
    opacity: 0.5 
  }}>
    Loading...
  </div>
);

// App content wrapper with Material-UI theme
const AppContent: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  
  // Create Material-UI theme based on current theme
  const materialTheme = useMemo(() => 
    createMaterialTheme(currentTheme), 
    [currentTheme]
  );

  // Initialize performance monitoring
  usePerformanceMonitoring({
    reportToAnalytics: true, // Now using our analytics system
    logToConsole: process.env.NODE_ENV === 'development',
    thresholds: {
      FCP: 1800,
      LCP: 2500, 
      FID: 100,
      CLS: 0.1
    }
  });

  // Check if we're in simple mode (now LaTeX CV mode)
  const urlParams = new URLSearchParams(window.location.search);
  const isSimpleMode = urlParams.get('view') === 'simple';
  const showPerformancePanel = urlParams.get('debug') === 'performance';

  if (isSimpleMode) {
    return (
      <MUIThemeProvider theme={materialTheme}>
        <CssBaseline />
        <LoadingManager>
          <Suspense fallback={<ComponentLoader />}>
            <SEOOptimizer 
              title="Kai Tran - Portfolio"
              description="Professional CV of Kai Tran - Full Stack Developer"
              type="article"
            />
          </Suspense>
          <LaTeXCV />
          <ThemeToggle />
          <Suspense fallback={<ComponentLoader />}>
            <AccessibilityControls position="bottom-right" />
          </Suspense>
          <PWABanner position="top" autoHide={true} />
        </LoadingManager>
      </MUIThemeProvider>
    );
  }

  return (
    <MUIThemeProvider theme={materialTheme}>
      <CssBaseline />
      <LoadingManager>
        <BrowserRouter>
          <div className="App">
            {/* SEO Optimization */}
            <Suspense fallback={<ComponentLoader />}>
              <SEOOptimizer />
            </Suspense>

            {/* Main Portfolio Content */}
            <PortfolioRouter />

            {/* Mobile Navigation */}
            <Suspense fallback={<ComponentLoader />}>
              <MobileNavigation />
            </Suspense>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Accessibility Controls */}
            <Suspense fallback={<ComponentLoader />}>
              <AccessibilityControls position="bottom-left" />
            </Suspense>

            {/* PWA Banner */}
            <PWABanner position="bottom" autoHide={false} showCacheInfo={true} />

            {/* Performance Monitoring (Debug Mode) */}
            {showPerformancePanel && (
              <Suspense fallback={<ComponentLoader />}>
                <PerformanceAnalysis 
                  showDetails={true} 
                  autoHide={false}
                  position="bottom-right"
                />
              </Suspense>
            )}
          </div>
        </BrowserRouter>
      </LoadingManager>
    </MUIThemeProvider>
  );
};

function App(): React.ReactElement {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AnalyticsProvider>
          <AppContent />
        </AnalyticsProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
