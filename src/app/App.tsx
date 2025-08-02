import React, { Suspense, lazy, useMemo, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LoadingManager } from '../components/common/LoadingManager';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AnalyticsProvider } from '../shared/services/analytics/PortfolioAnalytics';
import { createMaterialTheme } from '../theme/materialTheme';
import { preloadCriticalComponents } from '../components/common/LazyComponents';
import { 
  initializeAnalytics, 
  trackWebVitals, 
  trackPerformanceMetrics, 
  trackScrollDepth 
} from '../shared/services/analytics/googleAnalytics';
import './App.css';

// Fix isolatedModules warning
export {};

// Lazy load everything for instant loading
const PortfolioRouter = lazy(() => import('./PortfolioRouter'));
const LaTeXCV = lazy(() => import('../features/cv/components/LaTeXCV'));
const ThemeToggle = lazy(() => import('../components/common/ThemeToggle'));
const PWAManager = lazy(() => import('../components/common/PWAManager'));

// Development-only components
const PerformanceMonitor = lazy(() => import('../components/common/PerformanceMonitor'));

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
  
  // Initialize analytics and performance tracking
  useEffect(() => {
    initializeAnalytics();
    trackWebVitals();
    trackPerformanceMetrics();
    trackScrollDepth();
  }, []);
  
  // Preload critical components on app start
  useEffect(() => {
    preloadCriticalComponents();
  }, []);
  
  // Create Material-UI theme based on current theme with fallback
  const materialTheme = useMemo(() => {
    try {
      const themeOptions = createMaterialTheme(currentTheme || 'light');
      const theme = createTheme(themeOptions);
      
      // Ensure required palette colors exist
      if (!theme.palette.common) {
        theme.palette.common = {
          black: '#000000',
          white: '#FFFFFF'
        };
      }
      
      return theme;
    } catch (error) {
      console.warn('Failed to create material theme, using MUI default:', error);
      // Complete fallback to Material-UI default theme
      return createTheme({
        palette: {
          mode: currentTheme === 'dark' ? 'dark' : 'light',
        },
      });
    }
  }, [currentTheme]);

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const isSimpleMode = urlParams.get('view') === 'simple';
  const showPerformancePanel = process.env.NODE_ENV === 'development' && urlParams.get('debug') === 'performance';

  if (isSimpleMode) {
    return (
      <MUIThemeProvider theme={materialTheme}>
        <CssBaseline />
        <LoadingManager>
          <Suspense fallback={<ComponentLoader />}>
            <LaTeXCV />
          </Suspense>
          <Suspense fallback={null}>
            <ThemeToggle />
          </Suspense>
          <Suspense fallback={null}>
            <PWAManager showInstallPrompt={true} enableOfflineMode={true} />
          </Suspense>
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
            {/* Main Portfolio Content - Load First */}
            <Suspense fallback={<ComponentLoader />}>
              <PortfolioRouter />
            </Suspense>

            {/* Secondary Components - Load After */}
            <Suspense fallback={null}>
              <ThemeToggle />
            </Suspense>

            {/* PWA Manager for HR Optimization */}
            <Suspense fallback={null}>
              <PWAManager showInstallPrompt={true} enableOfflineMode={true} />
            </Suspense>

            {/* Performance Monitor (Development Only with Debug Flag) */}
            {showPerformancePanel && (
              <Suspense fallback={null}>
                <PerformanceMonitor 
                  isVisible={true} 
                  onMetricsUpdate={(metrics) => {
                    if (metrics.lcp && metrics.lcp > 3000) {
                      console.warn('Loading too slow for HR - optimizing...');
                    }
                  }}
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
