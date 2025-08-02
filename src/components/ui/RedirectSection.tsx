import React from 'react';
import styled from 'styled-components';

interface RedirectSectionProps {
  isDevelopment?: boolean;
}

// Navigation utility
const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.location.reload();
};

const RedirectSection: React.FC<RedirectSectionProps> = ({ isDevelopment = true }) => {
  const handleRedirect = () => {
    if (isDevelopment) {
      navigateTo('/design');
    } else {
      navigateTo('/');
    }
  };

  const linkText = isDevelopment 
    ? 'Design Portfolio' 
    : 'Development Portfolio';
    
  const description = isDevelopment 
    ? 'Also explore my'
    : 'Need development work? Check out my';
    
  const suffix = isDevelopment 
    ? 'for creative projects'
    : 'for technical projects';

  return (
    <SimpleRedirectSection $isDevelopment={isDevelopment}>
      <RedirectContent>
        <RedirectText>
          {description} <RedirectLink onClick={handleRedirect}>{linkText}</RedirectLink> {suffix}
        </RedirectText>
      </RedirectContent>
    </SimpleRedirectSection>
  );
};

// Styled Components
const SimpleRedirectSection = styled.section<{ $isDevelopment?: boolean }>`
  background: ${props => props.$isDevelopment 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(255, 20, 147, 0.02)'};
  border-top: 1px solid ${props => props.$isDevelopment 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 20, 147, 0.1)'};
  padding: 1.5rem 2rem;
  text-align: center;
`;

const RedirectContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const RedirectText = styled.p`
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
`;

const RedirectLink = styled.span`
  color: var(--color-green-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-text-primary);
    text-decoration: underline;
  }
`;

export default RedirectSection;
