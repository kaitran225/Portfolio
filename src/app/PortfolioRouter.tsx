import React, { Suspense, useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';

// Lazy load heavy components for better code splitting
const LandingPage = React.lazy(() => import('../features/landing/components/LandingPage'));
const DesignLandingPage = React.lazy(() => import('../features/design/components/DesignLandingPage'));
const DevProjectPage = React.lazy(() => import('../features/projects/components/DevProjectPage'));
const DesignProjectPage = React.lazy(() => import('../features/projects/components/DesignProjectPage'));
const HTMLCV = React.lazy(() => import('../features/cv/components/HTMLCV'));

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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  const path = currentPath.toLowerCase().replace(/\/$/, '') || '/';
  
  // Handle resume route
  if (path === '/resume') {
    return (
      <Suspense fallback={<RouteLoadingFallback />}>
        <HTMLCV />
      </Suspense>
    );
  }
  
  // Handle design portfolio route
  if (path === '/design') {
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
    console.log('Project route detected:', { path, projectId });
    
    // Determine project type based on project ID or could be passed as query param
    const projectType = getProjectType(projectId);
    console.log('Project type determined:', { projectId, projectType });
    
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
  
  // Default to development landing page (for / and any unknown routes)
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
    'portfolio-website',
    'mental-health-backend',
    'cybria-ai-assistant',
    'notification-microservice',
    'autofish-automation',
    'camera-check-system',
    'csharp-map-generator',
    'game-prototypes',
    'environment-design-tools',
    'travel-planner-mobile',
    'anti-swearing-chatbox',
    'prn212-coursework-series'
  ];
  
  const designProjects = [
    'zenna-brand-identity',
    'heaven-gateway-ui',
    'kai-tran-personal-branding',
    'kotezone-brand-design',
    'cloud-visual-identity',
    'donut-brand-package',
    'noddle-restaurant-branding',
    'womens-day-campaign',
    'robotoslab-typography-project'
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
