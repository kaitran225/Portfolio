import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Vanta.js topology effect
declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

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
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Initialize Vanta.js topology background
  useEffect(() => {
    const loadVanta = async () => {
      try {
        // Load Vanta.js topology effect
        if (!window.VANTA) {
          const script2 = document.createElement('script');
          script2.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
          script2.crossOrigin = 'anonymous';
          document.head.appendChild(script2);

          await new Promise((resolve, reject) => {
            script2.onload = resolve;
            script2.onerror = reject;
            setTimeout(reject, 10000); // 10s timeout
          });
        }

        // Wait a bit for scripts to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize Vanta effect
        if (window.VANTA && window.VANTA.TOPOLOGY && vantaRef.current && !vantaEffect.current) {
          vantaEffect.current = window.VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x6933ff, // Purple primary
            backgroundColor: 0x0a0a0a, // Black primary
            points: 12.00,
            maxDistance: 25.00,
            spacing: 18.00,
            showDots: true
          });
        }
      } catch (error) {
        console.warn('Failed to load Vanta.js:', error);
        // Fallback: Create a simple animated background
        if (vantaRef.current) {
          vantaRef.current.style.background = `
            radial-gradient(circle at 20% 20%, rgba(105, 51, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(105, 51, 255, 0.1) 0%, transparent 50%)
          `;
        }
      }
    };

    // Delay loading to ensure DOM is ready
    const timer = setTimeout(loadVanta, 100);

    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          console.warn('Error destroying Vanta effect:', e);
        }
        vantaEffect.current = null;
      }
    };
  }, []);

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
    <LandingContainer ref={vantaRef}>
      {/* Hero Section */}
      <ContentBGContainer>
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
      </ContentBGContainer>
    </LandingContainer>
  );
};

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  color: var(--color-text-primary);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  
  /* Ensure Vanta.js background is behind content */
  & > canvas {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: -10 !important; /* Further behind */
    pointer-events: none !important; /* Prevent interaction blocking */
  }
  
  /* Smooth page load animation */
  opacity: 0;
  animation: pageLoadIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
  
  @keyframes pageLoadIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContentBGContainer = styled.div`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
  min-height: 100vh;
  position: relative;
  z-index: 1; /* Above Vanta background but below content */
`;

const HeroSection = styled.section`
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-purple-primary) 100%);
  position: relative;
  overflow: hidden;
  animation: heroSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
  
  @keyframes heroSlideIn {
    from {
      opacity: 0;
      transform: translateY(50px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
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
  animation: profileFloatIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
  
  @keyframes profileFloatIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.8) rotateY(-15deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1) rotateY(0);
    }
  }
  
  img {
    width: 200px;
    height: 200px;
    border-radius: 8px;  /* Smaller corner radius */
    object-fit: cover;
    border: 4px solid var(--color-purple-primary);
    box-shadow: 0 10px 30px var(--color-purple-primary)30, 0 0 40px var(--color-green-primary)20;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    
    &:hover {
      transform: translateY(-10px) scale(1.05) rotateY(5deg);
      box-shadow: 0 20px 40px var(--color-purple-primary)40, 0 0 60px var(--color-green-primary)30;
      border-color: var(--color-green-primary);
    }
  }
`;

const HeroText = styled.div`
  flex: 1;
  text-align: left;
  animation: heroTextSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
  
  @keyframes heroTextSlideIn {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @media (max-width: 768px) {
    text-align: center;
    
    @keyframes heroTextSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
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
  animation: nameReveal 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s both;
  position: relative;
  
  @keyframes nameReveal {
    from {
      opacity: 0;
      transform: translateY(20px);
      background-position: 200% center;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      background-position: 0% center;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
    animation: underlineGrow 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s forwards;
    border-radius: 2px;
  }
  
  @keyframes underlineGrow {
    from {
      width: 0;
    }
    to {
      width: 100px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    
    &::after {
      @keyframes underlineGrow {
        to {
          width: 80px;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    
    &::after {
      @keyframes underlineGrow {
        to {
          width: 80px;
        }
      }
    }
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
  animation: skillPillsStagger 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
  
  @keyframes skillPillsStagger {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Stagger children animations */
  & > * {
    animation: skillPillFloat 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 1.4s; }
  & > *:nth-child(2) { animation-delay: 1.5s; }
  & > *:nth-child(3) { animation-delay: 1.6s; }
  & > *:nth-child(4) { animation-delay: 1.7s; }
  
  @keyframes skillPillFloat {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SkillPill = styled.span`
  background: var(--color-purple-primary)30;
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 6px; /* Smaller corner radius */
  font-size: 0.9rem;
  border: 1px solid var(--color-purple-primary);
  color: var(--color-text-primary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 20px var(--color-purple-primary)40;
    border-color: var(--color-green-primary);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s ease;
  }
`;

const Section = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  position: relative;
  z-index: 10; /* Ensure links are clickable */
  
  &:hover {
    background: var(--color-purple-primary);
    color: var(--color-text-primary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(105, 51, 255, 0.30);
  }
`;

// Tech Stack Components
const TechStackSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
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
