import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PortfolioRouter from './components/PortfolioRouter';
import LaTeXCV from './components/LaTeXCV';
import { LoadingManager } from './components/LoadingManager';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import './App.css';

function App(): React.ReactElement {
  // Initialize performance monitoring
  usePerformanceMonitoring({
    reportToAnalytics: false, // Set to true when Google Analytics is configured
    logToConsole: true,
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

  if (isSimpleMode) {
    return (
      <LoadingManager>
        <LaTeXCV />
      </LoadingManager>
    );
  }

  return (
    <LoadingManager>
      <BrowserRouter>
        <div className="App">
          <PortfolioRouter />
        </div>
      </BrowserRouter>
    </LoadingManager>
  );
}

export default App;
