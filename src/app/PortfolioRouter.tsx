import React, { Suspense } from 'react';
import Layout from './Layout/Layout';

// Lazy load heavy components for better code splitting
const LandingPage = React.lazy(() => import('./LandingPage'));
const DesignLandingPage = React.lazy(() => import('./DesignLandingPage'));
const DevProjectPage = React.lazy(() => import('./DevProjectPage'));
const DesignProjectPage = React.lazy(() => import('./DesignProjectPage'));

// Loading fallback for route components
const RouteLoadingFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid var(--color-purple-primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ 
      color: 'var(--color-text-secondary)', 
      fontSize: '0.9rem',
      opacity: 0.8 
    }}>
      Loading...
    </p>
  </div>
);

const PortfolioRouter: React.FC = () => {
  const path = window.location.pathname;
  
  // Handle design portfolio route
  if (path === '/design' || path === '/design/') {
    return (
      <Layout>
        <Suspense fallback={<RouteLoadingFallback />}>
          <DesignLandingPage />
        </Suspense>
      </Layout>
    );
  }
  
  // Extract project ID from URL path like /project/project-id
  const projectMatch = path.match(/^\/project\/(.+)$/);
  
  if (projectMatch) {
    const projectId = projectMatch[1];
    
    // Determine project type based on project ID or could be passed as query param
    const projectType = getProjectType(projectId);
    
    if (projectType === 'development') {
      return (
        <Layout>
          <Suspense fallback={<RouteLoadingFallback />}>
            <DevProjectPage projectId={projectId} />
          </Suspense>
        </Layout>
      );
    } else if (projectType === 'design') {
      return (
        <Layout>
          <Suspense fallback={<RouteLoadingFallback />}>
            <DesignProjectPage projectId={projectId} />
          </Suspense>
        </Layout>
      );
    }
  }
  
  // Default to development landing page
  return (
    <Layout>
      <Suspense fallback={<RouteLoadingFallback />}>
        <LandingPage />
      </Suspense>
    </Layout>
  );
};

// Helper function to determine project type based on ID
const getProjectType = (projectId: string): 'development' | 'design' => {
  const developmentProjects = [
    'calantha-platform',
    'ecommerce-dashboard', 
    'cloud-infrastructure',
    'mobile-app-api'
  ];
  
  const designProjects = [
    'brand-identity-zena',
    'mobile-ui-design',
    'packaging-design',
    'web-design-portfolio'
  ];
  
  if (developmentProjects.includes(projectId)) {
    return 'development';
  } else if (designProjects.includes(projectId)) {
    return 'design';
  }
  
  // Default to development for unknown projects
  return 'development';
};

export default PortfolioRouter;
