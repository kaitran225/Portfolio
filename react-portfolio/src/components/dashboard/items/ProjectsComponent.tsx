import React from 'react';
import styled from 'styled-components';

const projects = [
  {
    id: 1,
    title: '3D Portfolio',
    description: 'Interactive 3D portfolio website using Three.js and React',
    tags: ['React', 'Three.js', 'TypeScript'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Dashboard UI',
    description: 'Customizable dashboard with draggable and resizable components',
    tags: ['React', 'TypeScript', 'Styled Components'],
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Creative Coding Experiments',
    description: 'Collection of creative coding experiments and visualizations',
    tags: ['p5.js', 'WebGL', 'Canvas API'],
    image: 'https://via.placeholder.com/300x200',
  },
];

const ProjectsComponent: React.FC = () => {
  return (
    <ProjectsContainer>
      <ProjectsHeading>Projects</ProjectsHeading>
      <ProjectsList>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectImage src={project.image} alt={project.title} />
            <ProjectContent>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <ProjectTags>
                {project.tags.map((tag, index) => (
                  <ProjectTag key={index}>{tag}</ProjectTag>
                ))}
              </ProjectTags>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsList>
    </ProjectsContainer>
  );
};

const ProjectsContainer = styled.div`
  padding: 16px;
  color: #f8f8f8;
  overflow-y: auto;
`;

const ProjectsHeading = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProjectCard = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const ProjectContent = styled.div`
  padding: 16px;
`;

const ProjectTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #fff;
`;

const ProjectDescription = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #ccc;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ProjectTag = styled.span`
  background-color: #333;
  color: #0984e3;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

export default ProjectsComponent; 