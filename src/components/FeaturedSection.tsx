import React from 'react';
import styled from 'styled-components';
import LazyImage from './LazyImage';
import portfolioDataService from '../services/portfolioDataService';

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
      <FeaturedHeader>{sectionTitle}</FeaturedHeader>
      <FeaturedGrid>
        {featuredProjects.filter(project => 
          isDevelopment ? project.category === 'development' : project.category === 'design'
        ).map(project => (
          <FeaturedCard
            key={project.id}
            onClick={() => window.location.href = `/project/${project.id}`}
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
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

const FeaturedHeader = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #00ff88 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeaturedCard = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-soft);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
    border-color: var(--color-green-primary);
  }
`;

const FeaturedThumbnail = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const FeaturedOverlay = styled.div`
  position: absolute;
  top: 10px;
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
  background: ${props => props.$isDevelopment 
    ? 'rgba(105, 51, 255, 0.1)' 
    : 'rgba(255, 20, 147, 0.1)'};
  color: ${props => props.$isDevelopment 
    ? 'var(--color-text-primary)' 
    : '#ff69b4'};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${props => props.$isDevelopment 
    ? 'rgba(105, 51, 255, 0.3)' 
    : 'rgba(255, 20, 147, 0.3)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$isDevelopment 
      ? 'rgba(105, 51, 255, 0.2)' 
      : 'rgba(255, 20, 147, 0.2)'};
    border-color: ${props => props.$isDevelopment 
      ? 'var(--color-purple-primary)' 
      : '#ff1493'};
    transform: translateY(-1px);
  }
`;

export default FeaturedSection;
