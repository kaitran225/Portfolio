import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiPlay, FiCode, FiEye, FiStar } from '../../../components/ui/IconWrapper';

// ============= ENHANCED PROJECT SHOWCASE =============

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl: string;
  status: 'Live' | 'In Development' | 'Completed';
  featured: boolean;
  metrics?: {
    stars?: number;
    commits?: number;
    contributors?: number;
  };
  highlights: string[];
}

interface ProjectShowcaseProps {
  projects: Project[];
  category?: string;
}

const EnhancedProjectShowcase: React.FC<ProjectShowcaseProps> = ({ 
  projects, 
  category = 'all' 
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState(category);

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.category === filter
  );

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  return (
    <ShowcaseContainer>
      <ShowcaseHeader>
        <Title>Featured Projects</Title>
        <Subtitle>
          Live applications and technical demonstrations showcasing full-stack development expertise
        </Subtitle>
      </ShowcaseHeader>

      {/* Category Filter */}
      <FilterContainer>
        {categories.map(cat => (
          <FilterButton
            key={cat}
            $active={filter === cat}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </FilterButton>
        ))}
      </FilterContainer>

      {/* Project Grid */}
      <ProjectGrid>
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => setSelectedProject(project)}
          >
            {project.featured && (
              <FeaturedBadge>
                <FiStar />
                Featured
              </FeaturedBadge>
            )}

            <ProjectImage>
              <img src={project.image} alt={project.title} />
              <ImageOverlay>
                <PlayButton>
                  <FiPlay />
                </PlayButton>
              </ImageOverlay>
              <StatusBadge $status={project.status}>
                {project.status}
              </StatusBadge>
            </ProjectImage>

            <ProjectContent>
              <ProjectHeader>
                <ProjectTitle>{project.title}</ProjectTitle>
                {project.metrics && (
                  <ProjectMetrics>
                    {project.metrics.stars && (
                      <Metric>
                        <FiStar />
                        {project.metrics.stars}
                      </Metric>
                    )}
                    {project.metrics.commits && (
                      <Metric>
                        <FiCode />
                        {project.metrics.commits}
                      </Metric>
                    )}
                  </ProjectMetrics>
                )}
              </ProjectHeader>

              <ProjectDescription>{project.description}</ProjectDescription>

              <TechStack>
                {project.technologies.slice(0, 4).map(tech => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
                {project.technologies.length > 4 && (
                  <TechTag>+{project.technologies.length - 4}</TechTag>
                )}
              </TechStack>

              <ProjectActions>
                {project.demoUrl && (
                  <ActionButton 
                    $primary 
                    href={project.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiExternalLink />
                    View Live
                  </ActionButton>
                )}
                <ActionButton 
                  href={project.githubUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiGithub />
                  Source Code
                </ActionButton>
                <ActionButton onClick={() => setSelectedProject(project)}>
                  <FiEye />
                  Details
                </ActionButton>
              </ProjectActions>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectGrid>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
        >
          <ModalContent
            as={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{selectedProject.title}</ModalTitle>
              <CloseButton onClick={() => setSelectedProject(null)}>×</CloseButton>
            </ModalHeader>

            <ModalBody>
              <ModalImage>
                <img src={selectedProject.image} alt={selectedProject.title} />
              </ModalImage>

              <ModalDescription>
                <h3>Project Overview</h3>
                <p>{selectedProject.longDescription}</p>

                <h3>Key Highlights</h3>
                <HighlightsList>
                  {selectedProject.highlights.map((highlight, index) => (
                    <HighlightItem key={index}>{highlight}</HighlightItem>
                  ))}
                </HighlightsList>

                <h3>Technology Stack</h3>
                <ModalTechStack>
                  {selectedProject.technologies.map(tech => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </ModalTechStack>
              </ModalDescription>

              <ModalActions>
                {selectedProject.demoUrl && (
                  <ActionButton 
                    $primary 
                    href={selectedProject.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiExternalLink />
                    View Live Demo
                  </ActionButton>
                )}
                <ActionButton 
                  href={selectedProject.githubUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiGithub />
                  View Source Code
                </ActionButton>
              </ModalActions>
            </ModalBody>
          </ModalContent>
        </ProjectModal>
      )}
    </ShowcaseContainer>
  );
};


// Styled Components
const ShowcaseContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const ShowcaseHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: 2px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-purple-primary);
    color: ${props => props.$active ? 'white' : 'var(--color-purple-primary)'};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProjectCard = styled.div`
  background: var(--background-secondary);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: var(--shadow-soft);

  &:hover {
    box-shadow: var(--shadow-medium);
    border-color: var(--color-purple-primary);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
`;

const ProjectImage = styled.div`
  position: relative;
  height: 200px;
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

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-purple-primary);
  font-size: 1.5rem;
  transform: scale(0.8);
  transition: transform 0.3s ease;

  ${ImageOverlay}:hover & {
    transform: scale(1);
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'Live': return '#2ed573';
      case 'In Development': return '#ffa502';
      case 'Completed': return '#5352ed';
      default: return '#747d8c';
    }
  }};
  color: white;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
`;

const ProjectMetrics = styled.div`
  display: flex;
  gap: 1rem;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;

  svg {
    font-size: 0.75rem;
  }
`;

const ProjectDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  background: var(--background-tertiary);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.a<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid;
  cursor: pointer;

  ${props => props.$primary ? `
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);

    &:hover {
      background: var(--color-purple-secondary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-soft);
    }
  ` : `
    background: transparent;
    color: var(--color-text-secondary);
    border-color: var(--border-color);

    &:hover {
      color: var(--color-purple-primary);
      border-color: var(--color-purple-primary);
      background: rgba(105, 51, 255, 0.05);
    }
  `}
`;

const ProjectModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: var(--background-secondary);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.h2`
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--background-tertiary);
    color: var(--color-text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalImage = styled.div`
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
`;

const ModalDescription = styled.div`
  color: var(--color-text-secondary);
  line-height: 1.6;

  h3 {
    color: var(--color-text-primary);
    margin: 1.5rem 0 1rem 0;
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 1rem;
  }
`;

const HighlightsList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
`;

const HighlightItem = styled.li`
  margin-bottom: 0.5rem;
`;

const ModalTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export default EnhancedProjectShowcase;
