import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock analytics and other external services
jest.mock('../shared/services/analytics/googleAnalytics', () => ({
  initializeAnalytics: jest.fn(),
  trackWebVitals: jest.fn(),
  trackPerformanceMetrics: jest.fn(),
  trackScrollDepth: jest.fn(),
}));

jest.mock('../components/common/LazyComponents', () => ({
  preloadCriticalComponents: jest.fn(),
}));

// Mock PWAManager to avoid complex PWA logic in tests
jest.mock('../components/common/PWAManager', () => {
  return function MockPWAManager() {
    return null;
  };
});

test('renders without crashing', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.App')).toBeTruthy();
});

test('shows loading state initially', () => {
  render(<App />);
  const loadingElements = screen.getAllByText(/Loading.../i);
  expect(loadingElements.length).toBeGreaterThan(0);
});
