import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import OptimizedImage from '../../../components/media/OptimizedImage';

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectGridProps {
  projects: Project[];
  isDevelopment?: boolean;
}

const ProjectGrid: React.FC<ProjectGridProps> = React.memo(({ projects, isDevelopment = true }) => {
  const handleViewProject = (projectId: string) => {
    window.location.href = `/project/${projectId}`;
  };

  return (
    <GridContainer>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          $isDevelopment={isDevelopment}
          $featured={project.featured}
          onClick={() => handleViewProject(project.id)}
        >
          <ProjectThumbnail>
            <OptimizedImage 
              src={project.thumbnail} 
              alt={project.title}
              className={isDevelopment ? "featured-project-image" : "design-project-thumbnail"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 3} // Prioritize first 3 images
            />
            {project.featured && <FeaturedBadge>⭐ Featured</FeaturedBadge>}
          </ProjectThumbnail>
          <ProjectInfo>
            <ProjectHeader>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectMeta>
                <TechCount>{project.tags.length} technologies</TechCount>
              </ProjectMeta>
            </ProjectHeader>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagList>
              {project.tags.slice(0, 4).map(tag => (
                <Tag key={tag} $isDevelopment={isDevelopment}>{tag}</Tag>
              ))}
              {project.tags.length > 4 && (
                <Tag $isDevelopment={isDevelopment} $moreIndicator>
                  +{project.tags.length - 4} more
                </Tag>
              )}
            </TagList>
          </ProjectInfo>
        </ProjectCard>
      ))}
    </GridContainer>
  );
});

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

const ProjectCard = styled.div<{ $isDevelopment?: boolean; $featured?: boolean }>`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-soft);
  position: relative;
  
  ${props => props.$featured && `
    border: 2px solid var(--color-purple-primary);
    box-shadow: 0 10px 30px rgba(105, 51, 255, 0.2);
  `}
  
  &:hover {
    background: var(--card-bg);
    transform: translateY(-10px);
    box-shadow: ${props => props.$isDevelopment 
      ? 'var(--shadow-hover)' 
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

const FeaturedBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, var(--color-purple-primary), var(--color-purple-secondary));
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ProjectMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const TechCount = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  opacity: 0.7;
`;

const Tag = styled.span<{ $isDevelopment?: boolean; $moreIndicator?: boolean }>`
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
  
  ${props => props.$moreIndicator && `
    opacity: 0.7;
    font-style: italic;
  `}
  
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



export default React.memo(ProjectGrid);
