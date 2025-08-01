import React from 'react';
import styled from 'styled-components';
import LazyImage from './LazyImage';

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  category: string;
}

interface ProjectGridProps {
  projects: Project[];
  isDevelopment?: boolean;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, isDevelopment = true }) => {
  return (
    <GridContainer>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          $isDevelopment={isDevelopment}
          onClick={() => window.location.href = `/project/${project.id}`}
        >
          <ProjectThumbnail>
            <LazyImage 
              src={project.thumbnail} 
              alt={project.title}
              className={isDevelopment ? "featured-project-image" : "design-project-thumbnail"}
            />
            <ProjectOverlay>
            </ProjectOverlay>
          </ProjectThumbnail>
          <ProjectInfo>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagList>
              {project.tags.map(tag => (
                <Tag key={tag} $isDevelopment={isDevelopment}>{tag}</Tag>
              ))}
            </TagList>
          </ProjectInfo>
        </ProjectCard>
      ))}
    </GridContainer>
  );
};

// Styled Components
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div<{ $isDevelopment?: boolean }>`
  background: transparent;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: transparent;
    transform: translateY(-10px);
    box-shadow: ${props => props.$isDevelopment 
      ? '0 20px 40px rgba(105, 51, 255, 0.3)' 
      : '0 20px 40px rgba(255, 107, 107, 0.3)'};
    border-color: ${props => props.$isDevelopment 
      ? 'var(--color-purple-primary)' 
      : '#ff6b6b'};
  }
`;

const ProjectThumbnail = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img, .project-thumbnail, .featured-project-image, .design-project-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img,
  &:hover .project-thumbnail,
  &:hover .featured-project-image,
  &:hover .design-project-thumbnail {
    transform: scale(1.1);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;

const ProjectInfo = styled.div`
  padding: 25px;
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--color-text-primary);
`;

const ProjectDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 0.95rem;
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
      : 'rgba(255, 107, 107, 0.2)'};
    border-color: ${props => props.$isDevelopment 
      ? 'var(--color-purple-primary)' 
      : '#ff6b6b'};
    transform: translateY(-1px);
  }
`;

export default ProjectGrid;
