import React from 'react';
import LandingPage from './LandingPage';
import DesignLandingPage from './DesignLandingPage';
import DevProjectPage from './DevProjectPage';
import DesignProjectPage from './DesignProjectPage';

const PortfolioRouter: React.FC = () => {
  const path = window.location.pathname;
  
  // Handle design portfolio route
  if (path === '/design' || path === '/design/') {
    return <DesignLandingPage />;
  }
  
  // Extract project ID from URL path like /project/project-id
  const projectMatch = path.match(/^\/project\/(.+)$/);
  
  if (projectMatch) {
    const projectId = projectMatch[1];
    
    // Determine project type based on project ID or could be passed as query param
    const projectType = getProjectType(projectId);
    
    if (projectType === 'development') {
      return <DevProjectPage projectId={projectId} />;
    } else if (projectType === 'design') {
      return <DesignProjectPage projectId={projectId} />;
    }
  }
  
  // Default to development landing page
  return <LandingPage />;
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
