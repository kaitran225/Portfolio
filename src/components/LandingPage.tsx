import React, { useState } from 'react';
import styled from 'styled-components';

interface Project {
  id: string;
  title: string;
  category: 'development' | 'design';
  description: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
}

const LandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'development' | 'design'>('all');

  // Dummy projects - you can replace with real data
  const projects: Project[] = [
    // Development Projects
    {
      id: 'calantha-platform',
      title: 'Calantha Interactive Platform',
      category: 'development',
      description: 'Full-stack web application with real-time video processing and interactive media features.',
      thumbnail: '/assets/dev-thumbnails/calantha.jpg',
      tags: ['React', 'Node.js', 'WebRTC', 'MongoDB'],
      featured: true
    },
    {
      id: 'ecommerce-dashboard',
      title: 'E-Commerce Management System',
      category: 'development', 
      description: 'Modern admin dashboard with analytics, inventory management, and payment processing.',
      thumbnail: '/assets/dev-thumbnails/ecommerce.jpg',
      tags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
      featured: true
    },
    {
      id: 'cloud-infrastructure',
      title: 'Cloud Infrastructure Automation',
      category: 'development',
      description: 'DevOps solution for automated deployment and scaling using containerization.',
      thumbnail: '/assets/dev-thumbnails/cloud.jpg',
      tags: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      featured: false
    },
    {
      id: 'mobile-app-api',
      title: 'Mobile App Backend API',
      category: 'development',
      description: 'RESTful API with GraphQL integration for mobile application data management.',
      thumbnail: '/assets/dev-thumbnails/api.jpg',
      tags: ['Python', 'FastAPI', 'GraphQL', 'Redis'],
      featured: false
    },

    // Design Projects
    {
      id: 'brand-identity-zena',
      title: 'Zena Fashion Brand Identity',
      category: 'design',
      description: 'Complete brand identity design including logo, typography, and visual system.',
      thumbnail: '/assets/design-thumbnails/zena-brand.jpg',
      tags: ['Branding', 'Logo Design', 'Typography', 'Adobe Illustrator'],
      featured: true
    },
    {
      id: 'mobile-ui-design',
      title: 'GateWay Mobile App UI/UX',
      category: 'design',
      description: 'User interface and experience design for a financial mobile application.',
      thumbnail: '/assets/design-thumbnails/gateway-ui.jpg',
      tags: ['UI/UX', 'Mobile Design', 'Figma', 'Prototyping'],
      featured: true
    },
    {
      id: 'packaging-design',
      title: 'Slab Coffee Packaging Series',
      category: 'design',
      description: 'Product packaging design series for premium coffee brand with sustainable focus.',
      thumbnail: '/assets/design-thumbnails/slab-packaging.jpg',
      tags: ['Package Design', 'Print Design', 'Sustainability', 'Adobe InDesign'],
      featured: false
    },
    {
      id: 'web-design-portfolio',
      title: 'Personal Creative Portfolio',
      category: 'design',
      description: 'Creative portfolio website design showcasing artistic and experimental works.',
      thumbnail: '/assets/design-thumbnails/personal-web.jpg',
      tags: ['Web Design', 'Creative Direction', 'Animation', 'Adobe XD'],
      featured: false
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <LandingContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <ProfilePicture>
            <img src="/assets/profile/kai-tran-profile.jpg" alt="Kai Tran" />
          </ProfilePicture>
          <HeroText>
            <Name>Kai Tran</Name>
            <Title>Graphic Designer & Software Developer</Title>
            <Description>
              Creative professional bridging the gap between design and technology. 
              I craft beautiful visual experiences and build robust digital solutions 
              that bring ideas to life.
            </Description>
            <SkillPills>
              <SkillPill>UI/UX Design</SkillPill>
              <SkillPill>React Development</SkillPill>
              <SkillPill>Brand Identity</SkillPill>
              <SkillPill>Full-Stack Development</SkillPill>
            </SkillPills>
          </HeroText>
        </HeroContent>
      </HeroSection>

      {/* Tech Stack Section */}
      <TechStackSection>
        <SectionHeader>Tech Stack & Expertise</SectionHeader>
        <TechStackGrid>
          <TechCategory>
            <TechCategoryTitle>🎨 Design Tools</TechCategoryTitle>
            <TechStack>
              <TechItem>
                <TechIcon>🎨</TechIcon>
                <TechInfo>
                  <TechName>Adobe Creative Suite</TechName>
                  <TechDesc>Photoshop, Illustrator, InDesign for professional design work</TechDesc>
                </TechInfo>
              </TechItem>
              <TechItem>
                <TechIcon>🖼️</TechIcon>
                <TechInfo>
                  <TechName>Figma</TechName>
                  <TechDesc>Collaborative interface design and prototyping</TechDesc>
                </TechInfo>
              </TechItem>
              <TechItem>
                <TechIcon>✨</TechIcon>
                <TechInfo>
                  <TechName>After Effects</TechName>
                  <TechDesc>Motion graphics and animation design</TechDesc>
                </TechInfo>
              </TechItem>
            </TechStack>
          </TechCategory>
          
          <TechCategory>
            <TechCategoryTitle>💻 Development</TechCategoryTitle>
            <TechStack>
              <TechItem>
                <TechIcon>⚛️</TechIcon>
                <TechInfo>
                  <TechName>React & TypeScript</TechName>
                  <TechDesc>Modern frontend development with type safety</TechDesc>
                </TechInfo>
              </TechItem>
              <TechItem>
                <TechIcon>🟢</TechIcon>
                <TechInfo>
                  <TechName>Node.js</TechName>
                  <TechDesc>Server-side JavaScript and API development</TechDesc>
                </TechInfo>
              </TechItem>
              <TechItem>
                <TechIcon>🗄️</TechIcon>
                <TechInfo>
                  <TechName>PostgreSQL & MongoDB</TechName>
                  <TechDesc>Database design and management</TechDesc>
                </TechInfo>
              </TechItem>
            </TechStack>
          </TechCategory>
          
          <TechCategory>
            <TechCategoryTitle>☁️ DevOps & Tools</TechCategoryTitle>
            <TechStack>
              <TechItem>
                <TechIcon>🐳</TechIcon>
                <TechInfo>
                  <TechName>Docker</TechName>
                  <TechDesc>Containerization and deployment</TechDesc>
                </TechInfo>
              </TechItem>
              <TechItem>
                <TechIcon>☁️</TechIcon>
                <TechInfo>
                  <TechName>AWS</TechName>
                  <TechDesc>Cloud infrastructure and services</TechDesc>
                </TechInfo>
              </TechItem>
              <TechItem>
                <TechIcon>🔧</TechIcon>
                <TechInfo>
                  <TechName>Git & CI/CD</TechName>
                  <TechDesc>Version control and automation</TechDesc>
                </TechInfo>
              </TechItem>
            </TechStack>
          </TechCategory>
        </TechStackGrid>
      </TechStackSection>

      {/* Featured Projects */}
      <Section>
        <SectionHeader>Featured Work</SectionHeader>
        <ProjectGrid>
          {featuredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              onClick={() => window.location.href = `/project/${project.id}`}
              featured
            >
              <ProjectThumbnail>
                <img src={project.thumbnail} alt={project.title} />
                <ProjectOverlay>
                  <CategoryBadge category={project.category}>
                    {project.category === 'development' ? '💻 Development' : '🎨 Design'}
                  </CategoryBadge>
                </ProjectOverlay>
              </ProjectThumbnail>
              <ProjectInfo>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TagList>
                  {project.tags.slice(0, 3).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Section>

      {/* Project Catalog */}
      <Section>
        <SectionHeader>Project Catalog</SectionHeader>
        
        {/* Category Filter */}
        <CategoryFilter>
          <FilterButton 
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            All Projects ({projects.length})
          </FilterButton>
          <FilterButton 
            active={selectedCategory === 'development'}
            onClick={() => setSelectedCategory('development')}
          >
            💻 Development ({projects.filter(p => p.category === 'development').length})
          </FilterButton>
          <FilterButton 
            active={selectedCategory === 'design'}
            onClick={() => setSelectedCategory('design')}
          >
            🎨 Design ({projects.filter(p => p.category === 'design').length})
          </FilterButton>
        </CategoryFilter>

        {/* Project Grid */}
        <ProjectGrid>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id}
              onClick={() => window.location.href = `/project/${project.id}`}
            >
              <ProjectThumbnail>
                <img src={project.thumbnail} alt={project.title} />
                <ProjectOverlay>
                  <CategoryBadge category={project.category}>
                    {project.category === 'development' ? '💻' : '🎨'}
                  </CategoryBadge>
                </ProjectOverlay>
              </ProjectThumbnail>
              <ProjectInfo>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TagList>
                  {project.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Section>

      {/* Contact Section */}
      <ContactSection>
        <SectionHeader>Let's Work Together</SectionHeader>
        <ContactContent>
          <ContactText>
            Available for OJT opportunities Fall 2025 (September - December).
            Open to both design and development projects.
          </ContactText>
          <ContactLinks>
            <ContactLink href="https://github.com/kaitran225">GitHub</ContactLink>
            <ContactLink href="https://www.instagram.com/kaitran.prt">Instagram</ContactLink>
            <ContactLink href="mailto:contact@kaitran.dev">Email</ContactLink>
            <ContactLink href="?view=simple">📄 Download CV</ContactLink>
          </ContactLinks>
        </ContactContent>
      </ContactSection>
    </LandingContainer>
  );
};

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: var(--color-black-primary);
  color: var(--color-text-primary);
  overflow-y: auto;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-purple-primary) 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, var(--color-purple-primary)20, transparent 50%),
                radial-gradient(circle at 70% 30%, var(--color-green-primary)15, transparent 40%);
    opacity: 0.1;
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const ProfilePicture = styled.div`
  flex-shrink: 0;
  
  img {
    width: 200px;
    height: 200px;
    border-radius: 20px;  /* Squared with slight rounding */
    object-fit: cover;
    border: 4px solid var(--color-purple-primary);
    box-shadow: 0 10px 30px var(--color-purple-primary)30, 0 0 40px var(--color-green-primary)20;
  }
`;

const HeroText = styled.div`
  flex: 1;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Name = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-purple-light) 50%, var(--color-green-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  max-width: 600px;
`;

const SkillPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SkillPill = styled.span`
  background: var(--color-purple-primary)30;
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid var(--color-purple-primary);
  color: var(--color-text-primary);
`;

const Section = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-black-primary);
`;

const SectionHeader = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 60px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-purple-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'var(--color-purple-primary)' : 'var(--color-black-secondary)'};
  color: ${props => props.active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'};
  border: 2px solid ${props => props.active ? 'var(--color-purple-primary)' : 'var(--color-gray-dark)'};
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-purple-primary);
    color: var(--color-text-primary);
    border-color: var(--color-purple-primary);
    transform: translateY(-2px);
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const ProjectCard = styled.div<{ featured?: boolean }>`
  background: var(--color-black-secondary);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-gray-dark);
  ${props => props.featured && `
    border: 2px solid var(--color-purple-primary);
    box-shadow: 0 10px 30px var(--color-purple-primary)20;
  `}
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px var(--color-purple-primary)30;
    border-color: var(--color-purple-primary);
  }
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const ProjectThumbnail = styled.div`
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
    transform: scale(1.1);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;

const CategoryBadge = styled.span<{ category: 'development' | 'design' }>`
  background: ${props => props.category === 'development' ? 'var(--color-green-primary)' : 'var(--color-purple-primary)'};
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
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

const Tag = styled.span`
  background: var(--color-purple-primary)30;
  color: var(--color-text-primary);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--color-purple-primary);
`;

const ContactSection = styled.section`
  background: var(--color-black-secondary);
  padding: 80px 20px;
  text-align: center;
  border-top: 1px solid var(--color-gray-dark);
`;

const ContactContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ContactText = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ContactLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
`;

const ContactLink = styled.a`
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 24px;
  border: 2px solid var(--color-purple-primary);
  background: transparent;
  border-radius: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-purple-primary);
    color: var(--color-text-primary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--color-purple-primary)30;
  }
`;

// Tech Stack Components
const TechStackSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-black-primary);
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 40px;
`;

const TechCategory = styled.div`
  background: var(--color-black-secondary);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid var(--color-gray-dark);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-purple-primary);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px var(--color-purple-primary)20;
  }
`;

const TechCategoryTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text-primary);
  text-align: center;
`;

const TechStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TechItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: var(--color-black-primary);
  border-radius: 12px;
  border: 1px solid var(--color-gray-dark);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-purple-primary);
    background: var(--color-black-primary);
  }
`;

const TechIcon = styled.div`
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-purple-primary)20;
  border-radius: 12px;
  border: 1px solid var(--color-purple-primary);
  flex-shrink: 0;
`;

const TechInfo = styled.div`
  flex: 1;
`;

const TechName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 5px;
`;

const TechDesc = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.4;
`;

export default LandingPage;
