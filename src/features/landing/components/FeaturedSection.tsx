import React from 'react';
import styled from 'styled-components';
import LazyImage from '../../../components/media/LazyImage';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';

interface FeaturedSectionProps {
  isDevelopment?: boolean;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ isDevelopment = true }) => {
  const featuredProjects = isDevelopment 
    ? portfolioDataService.getFeaturedDevelopmentProjects()
    : portfolioDataService.getDesignProjects().slice(0, 3); // Get first 3 design projects as featured

  const sectionTitle = isDevelopment 
    ? 'Featured Development Projects'
    : 'Featured Design Projects';

  return (
    <FeaturedContainer>
      <FeaturedHeader $isDevelopment={isDevelopment}>{sectionTitle}</FeaturedHeader>
      <FeaturedGrid>
        {featuredProjects.filter(project => 
          isDevelopment ? project.category === 'development' : project.category === 'design'
        ).map(project => (
          <FeaturedCard
            key={project.id}
            $isDevelopment={isDevelopment}
            onClick={() => {
              // Use SPA navigation instead of full page reload
              const path = `/project/${project.id}`;
              if (window.location.pathname !== path) {
                window.history.pushState({}, '', path);
                // Trigger popstate event to update the router
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
          >
            <FeaturedThumbnail>
              <LazyImage 
                src={project.thumbnail} 
                alt={project.title}
                className="project-thumbnail"
              />
              <FeaturedOverlay>
              </FeaturedOverlay>
            </FeaturedThumbnail>
            <FeaturedInfo>
              <FeaturedTitle>{project.title}</FeaturedTitle>
              <FeaturedDescription>{project.description}</FeaturedDescription>
              <TagList>
                {project.tags.slice(0, 3).map(tag => (
                  <Tag key={tag} $isDevelopment={isDevelopment}>{tag}</Tag>
                ))}
              </TagList>
            </FeaturedInfo>
          </FeaturedCard>
        ))}
      </FeaturedGrid>
    </FeaturedContainer>
  );
};

// Styled Components
const FeaturedContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 2rem auto;
  display: flex;
  backdrop-filter: blur(100px);
  background: var(props => props.$isDevelopment ? '--background-secondary' : '--color-design-secondary');
  opacity: 0.9;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  border: 1px solid var(--border-color);
  margin-top: 2rem;
  padding: 2rem 1.5rem;
  flex-direction: column;
  padding: 2rem 0;
  animation: featuredSlideUp 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
  
  @keyframes featuredSlideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`;

const FeaturedHeader = styled.h3<{ $isDevelopment?: boolean }>`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.$isDevelopment === false 
    ? 'var(--color-design-primary)' 
    : 'var(--color-purple-primary)'};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: auto 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeaturedCard = styled.div<{ $isDevelopment?: boolean }>`
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$isDevelopment === false 
    ? 'var(--color-design-primary)' 
    : 'var(--color-purple-primary)'};
  box-shadow: var(--shadow-soft);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
    border-color: ${props => props.$isDevelopment === false 
      ? 'var(--color-design-secondary)' 
      : 'var(--color-green-primary)'};
  }
`;

const FeaturedThumbnail = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  
  img {
    height: 160px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const FeaturedOverlay = styled.div`
  position: absolute;
  right: 10px;
`;

const FeaturedInfo = styled.div`
  padding: 1.2rem;
`;

const FeaturedTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
`;

const FeaturedDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span<{ $isDevelopment?: boolean }>`
  background: ${props => props.$isDevelopment === false 
    ? 'rgba(255, 107, 107, 0.1)' 
    : 'rgba(105, 51, 255, 0.1)'};
  color: ${props => props.$isDevelopment === false 
    ? 'var(--color-design-primary)' 
    : 'var(--color-text-primary)'};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${props => props.$isDevelopment === false 
    ? 'rgba(255, 107, 107, 0.3)' 
    : 'rgba(105, 51, 255, 0.3)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$isDevelopment === false 
      ? 'rgba(255, 107, 107, 0.2)' 
      : 'rgba(105, 51, 255, 0.2)'};
    border-color: ${props => props.$isDevelopment === false 
      ? 'var(--color-design-primary)' 
      : 'var(--color-purple-primary)'};
    transform: translateY(-1px);
  }
`;

export default FeaturedSection;
