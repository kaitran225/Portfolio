import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

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
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Terminal typing animation
  const fullText = `Microsoft Windows [Version 10.0.22631.4037]
(c) Microsoft Corporation. All rights reserved.

C:\\Users\\kai-tran>cd portfolio

C:\\Users\\kai-tran\\portfolio>dir
 Volume in drive C has no label.
 Volume Serial Number is A1B2-C3D4
 
 Directory of C:\\Users\\kai-tran\\portfolio

07/31/2025  10:30 AM    <DIR>          .
07/31/2025  10:30 AM    <DIR>          ..
07/31/2025  10:30 AM            4,096  portfolio.exe
07/31/2025  10:30 AM            2,048  README.md
               2 File(s)          6,144 bytes
               2 Dir(s)  500,000,000,000 bytes free

C:\\Users\\kai-tran\\portfolio>portfolio.exe
Welcome to Kai Tran's Portfolio System!
System initialized successfully.

C:\\Users\\kai-tran\\portfolio>`;

  useEffect(() => {
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTerminalText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Initialize Vanta.js topology background
  useEffect(() => {
    const loadVanta = async () => {
      try {
        console.log('Starting Vanta.js loading process...');

        // Load p5.js first
        if (!window.p5) {
          console.log('Loading p5.js...');
          const script1 = document.createElement('script');
          script1.src = 'https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js';
          script1.crossOrigin = 'anonymous';
          document.head.appendChild(script1);

          await new Promise((resolve, reject) => {
            script1.onload = () => {
              console.log('p5.js loaded successfully');
              resolve(null);
            };
            script1.onerror = (error) => {
              console.error('Failed to load p5.js:', error);
              reject(error);
            };
            setTimeout(() => reject(new Error('p5.js load timeout')), 10000);
          });
        } else {
          console.log('p5.js already loaded');
        }

        // Load Vanta.js topology effect
        if (!window.VANTA) {
          console.log('Loading Vanta.js...');
          const script2 = document.createElement('script');
          script2.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
          script2.crossOrigin = 'anonymous';
          document.head.appendChild(script2);

          await new Promise((resolve, reject) => {
            script2.onload = () => {
              console.log('Vanta.js loaded successfully');
              resolve(null);
            };
            script2.onerror = (error) => {
              console.error('Failed to load Vanta.js:', error);
              reject(error);
            };
            setTimeout(() => reject(new Error('Vanta.js load timeout')), 10000);
          });
        } else {
          console.log('Vanta.js already loaded');
        }

        // Wait a bit for scripts to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize Vanta effect
        if (window.VANTA && window.VANTA.TOPOLOGY && vantaRef.current && !vantaEffect.current) {
          console.log('Initializing Vanta TOPOLOGY effect...');
          vantaEffect.current = window.VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x6933ff, // Purple primary (portfolio theme)
            backgroundColor: 0x0a0a0a, // Dark background
            points: 10.00,
            maxDistance: 20.00,
            spacing: 15.00
          });
          console.log('Vanta effect initialized:', vantaEffect.current);
        } else {
          console.log('Vanta initialization failed:', {
            VANTA: !!window.VANTA,
            TOPOLOGY: !!(window.VANTA && window.VANTA.TOPOLOGY),
            element: !!vantaRef.current,
            alreadyExists: !!vantaEffect.current
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
          <FloatingParticles>
            <Particle delay={0} />
            <Particle delay={2} />
            <Particle delay={4} />
            <Particle delay={1.5} />
            <Particle delay={3.5} />
          </FloatingParticles>
          
          <HeroContent>
            <CVButtonContainer>
              <CVButton href="?view=simple">
                📄 View My CV
              </CVButton>
            </CVButtonContainer>
            
            <IntegratedSection>
              <TerminalSection>
                <TerminalWindow>
                  <TerminalHeader>
                    <div></div>
                    <TerminalTitle>Command Prompt</TerminalTitle>
                    <TerminalControls>
                      <TerminalButton type="minimize" />
                      <TerminalButton type="maximize" />
                      <TerminalButton type="close" />
                    </TerminalControls>
                  </TerminalHeader>
                  <TerminalBody>
                    <TerminalText>
                      {terminalText.split('\n').map((line, index) => (
                        <TerminalLine key={index}>
                          {line}
                          {index === terminalText.split('\n').length - 1 && showCursor && (
                            <TerminalCursor>_</TerminalCursor>
                          )}
                        </TerminalLine>
                      ))}
                    </TerminalText>
                  </TerminalBody>
                </TerminalWindow>
              </TerminalSection>
              
              <ProfileSection>
                <ProfilePicture>
                  <img src="/assets/profile/kai-tran-profile.jpg" alt="Kai Tran" />
                  <ProfileGlow />
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
                  
                  <StatsGrid>
                    <StatItem>
                      <StatNumber>50+</StatNumber>
                      <StatLabel>Projects Completed</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatNumber>3+</StatNumber>
                      <StatLabel>Years Experience</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatNumber>15+</StatNumber>
                      <StatLabel>Technologies</StatLabel>
                    </StatItem>
                  </StatsGrid>
                </HeroText>
              </ProfileSection>
            </IntegratedSection>
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
                  <TechIcon>
                    <img src="/assets/icons/photoshop/photoshop-plain.svg" alt="Adobe Creative Suite" />
                  </TechIcon>
                  <TechInfo>
                    <TechName>Adobe Creative Suite</TechName>
                    <TechDesc>Photoshop, Illustrator, InDesign for professional design work</TechDesc>
                  </TechInfo>
                </TechItem>
                <TechItem>
                  <TechIcon>
                    <img src="/assets/icons/figma/figma-original.svg" alt="Figma" />
                  </TechIcon>
                  <TechInfo>
                    <TechName>Figma</TechName>
                    <TechDesc>Collaborative interface design and prototyping</TechDesc>
                  </TechInfo>
                </TechItem>
                <TechItem>
                  <TechIcon>
                    <img src="/assets/icons/aftereffects/aftereffects-plain.svg" alt="After Effects" />
                  </TechIcon>
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
                  <TechIcon>
                    <img src="/assets/icons/react/react-original.svg" alt="React & TypeScript" />
                  </TechIcon>
                  <TechInfo>
                    <TechName>React & TypeScript</TechName>
                    <TechDesc>Modern frontend development with type safety</TechDesc>
                  </TechInfo>
                </TechItem>
                <TechItem>
                  <TechIcon>
                    <img src="/assets/icons/nodejs/nodejs-original.svg" alt="Node.js" />
                  </TechIcon>
                  <TechInfo>
                    <TechName>Node.js</TechName>
                    <TechDesc>Server-side JavaScript and API development</TechDesc>
                  </TechInfo>
                </TechItem>
                <TechItem>
                  <TechIcon>
                    <img src="/assets/icons/mongodb/mongodb-original.svg" alt="Database Technologies" />
                  </TechIcon>
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
                  <TechIcon>
                    <img src="/assets/icons/docker/docker-original.svg" alt="Docker" />
                  </TechIcon>
                  <TechInfo>
                    <TechName>Docker</TechName>
                    <TechDesc>Containerization and deployment</TechDesc>
                  </TechInfo>
                </TechItem>
                <TechItem>
                  <TechIcon>
                    <img src="/assets/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" />
                  </TechIcon>
                  <TechInfo>
                    <TechName>AWS</TechName>
                    <TechDesc>Cloud infrastructure and services</TechDesc>
                  </TechInfo>
                </TechItem>
                <TechItem>
                  <TechIcon>
                    <img src="/assets/icons/git/git-original.svg" alt="Git & CI/CD" />
                  </TechIcon>
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
              $active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              All Projects ({projects.length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'development'}
              onClick={() => setSelectedCategory('development')}
            >
              💻 Development ({projects.filter(p => p.category === 'development').length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'design'}
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

        {/* Contact Section - Slim Footer */}
        <SlimFooter>
          <FooterContent>
            <FooterText>
              Available for OJT opportunities Fall 2025 • Open to design & development projects
            </FooterText>
            <FooterLinks>
              <FooterLink href="https://github.com/kaitran225">
                <GitHubIcon>⚡</GitHubIcon>
                GitHub
              </FooterLink>
              <FooterLink href="https://www.instagram.com/kaitran.prt">
                <InstagramIcon>📸</InstagramIcon>
                Instagram
              </FooterLink>
              <FooterLink href="mailto:contact@kaitran.dev">
                <EmailIcon>✉️</EmailIcon>
                Email
              </FooterLink>
            </FooterLinks>
          </FooterContent>
          <FooterBottom>
            <Copyright>© 2025 Kai Tran. Crafted with 💜 and ☕</Copyright>
          </FooterBottom>
        </SlimFooter>
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
  min-height: 100vh;
  position: relative;
  z-index: 1; /* Above Vanta background but below content */
`;

const HeroSection = styled.section`
  padding: 100px 20px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: heroSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
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
    background: linear-gradient(135deg, 
      rgba(105, 51, 255, 0.05) 0%, 
      rgba(0, 255, 136, 0.03) 50%, 
      rgba(105, 51, 255, 0.05) 100%);
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
  position: relative;
  z-index: 2;
`;

const IntegratedSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  min-height: 80vh;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const TerminalSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  animation: terminalSlideDown 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
  
  @keyframes terminalSlideDown {
    from {
      opacity: 0;
      transform: translateY(-30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
  animation: profileFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
  
  @keyframes profileFadeIn {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @media (max-width: 1024px) {
    order: -1;
    padding: 1rem 0;
  }
`;

const TerminalWindow = styled.div`
  background: #0c0c0c;
  border: 1px solid #404040;
  border-radius: 0;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 800px;
  width: 100%;
  overflow: hidden;
  font-family: 'Consolas', 'Courier New', monospace;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 
      0 6px 30px rgba(0, 0, 0, 0.9),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const TerminalHeader = styled.div`
  background: linear-gradient(180deg, #2d2d30 0%, #1e1e1e 100%);
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #404040;
  height: 30px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
`;

const TerminalControls = styled.div`
  display: flex;
  gap: 1px;
  align-items: center;
`;

const TerminalButton = styled.div<{ type: 'minimize' | 'maximize' | 'close' }>`
  width: 45px;
  height: 29px;
  background: ${props => {
    switch(props.type) {
      case 'minimize': return 'transparent';
      case 'maximize': return 'transparent';
      case 'close': return 'transparent';
    }
  }};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  font-weight: normal;
  color: #ffffff;
  transition: all 0.2s ease;
  font-family: 'Segoe MDL2 Assets', 'Segoe UI Symbol', Arial;
  
  &:hover {
    background: ${props => {
      switch(props.type) {
        case 'minimize': return 'rgba(255, 255, 255, 0.1)';
        case 'maximize': return 'rgba(255, 255, 255, 0.1)';
        case 'close': return '#e81123';
      }
    }};
  }
  
  &::after {
    content: ${props => {
      switch(props.type) {
        case 'minimize': return '"🗕"';
        case 'maximize': return '"🗖"';
        case 'close': return '"🗙"';
      }
    }};
    font-size: 10px;
  }
`;

const CVButton = styled.a`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 
    0 4px 20px rgba(99, 102, 241, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 8px 30px rgba(99, 102, 241, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0) scale(1.02);
  }
`;

const TerminalTitle = styled.div`
  color: #cccccc;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 12px;
  font-weight: normal;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 0 10px;
  
  &::before {
    content: '';
    width: 16px;
    height: 16px;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIgMkgxNFYxNEgyVjJaIiBzdHJva2U9IiNjY2NjY2MiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNCAxMEw2IDhMNCAwIiBzdHJva2U9IiNjY2NjY2MiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K') no-repeat center;
    margin-right: 8px;
  }
`;

const CVButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  animation: cvButtonSlide 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
  
  @keyframes cvButtonSlide {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @media (max-width: 1024px) {
    position: static;
    margin: 0 auto 2rem;
    text-align: center;
    order: 1;
  }
  
  @media (max-width: 768px) {
    margin: 0 auto 1.5rem;
  }
`;

const TerminalBody = styled.div`
  background: #0c0c0c;
  padding: 16px;
  min-height: 160px;
  position: relative;
  color: #cccccc;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    pointer-events: none;
  }
`;

const TerminalText = styled.div`
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #cccccc;
`;

const TerminalLine = styled.div`
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  font-weight: normal;
  position: relative;
  z-index: 2;
  color: #cccccc;
  
  &:first-child {
    color: #cccccc;
    font-weight: normal;
  }
  
  &:nth-child(2) {
    color: #cccccc;
  }
  
  &:nth-child(3) {
    margin-bottom: 8px;
  }
  
  &:nth-child(4) {
    margin-bottom: 8px;
  }
  
  &:nth-child(5) {
    color: #cccccc;
  }
  
  &:nth-child(6) {
    color: #cccccc;
  }
  
  &:nth-child(7) {
    color: #cccccc;
  }
  
  &:nth-child(8) {
    color: #cccccc;
  }
  
  &:nth-child(9) {
    color: #cccccc;
  }
  
  &:nth-child(10) {
    color: #cccccc;
    margin-top: 8px;
  }
  
  &:last-child {
    color: #cccccc;
  }
`;

const TerminalCursor = styled.span`
  color: #cccccc;
  animation: blink 1.2s infinite;
  margin-left: 2px;
  font-weight: normal;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const ProfilePicture = styled.div`
  flex-shrink: 0;
  position: relative;
  animation: profileFloatIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
  
  @keyframes profileFloatIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  img {
    width: 200px;
    height: 200px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    z-index: 2;
    
    &:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.4);
    }
  }
`;

const ProfileGlow = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, var(--color-purple-primary), var(--color-green-primary));
  border-radius: 20px;
  opacity: 0.3;
  filter: blur(20px);
  z-index: 1;
  animation: pulseGlow 3s ease-in-out infinite alternate;
  
  @keyframes pulseGlow {
    from {
      opacity: 0.2;
      transform: scale(0.8);
    }
    to {
      opacity: 0.4;
      transform: scale(1.1);
    }
  }
`;

const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
`;

const Particle = styled.div<{ delay: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-purple-primary);
  border-radius: 50%;
  opacity: 0.6;
  animation: float 8s ease-in-out infinite ${props => props.delay}s;
  
  &:nth-child(1) {
    top: 20%;
    left: 10%;
    background: var(--color-purple-primary);
  }
  
  &:nth-child(2) {
    top: 60%;
    left: 80%;
    background: var(--color-green-primary);
  }
  
  &:nth-child(3) {
    top: 30%;
    left: 70%;
    background: var(--color-purple-light);
  }
  
  &:nth-child(4) {
    top: 80%;
    left: 20%;
    background: var(--color-green-primary);
  }
  
  &:nth-child(5) {
    top: 50%;
    left: 50%;
    background: var(--color-purple-primary);
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px) scale(1);
      opacity: 0.6;
    }
    25% {
      transform: translateY(-20px) translateX(10px) scale(1.2);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-40px) translateX(-10px) scale(0.8);
      opacity: 0.4;
    }
    75% {
      transform: translateY(-20px) translateX(15px) scale(1.1);
      opacity: 0.7;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
  animation: statsSlideUp 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2s both;
  
  @keyframes statsSlideUp {
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
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(105, 51, 255, 0.1), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    background: rgba(105, 51, 255, 0.1);
    border-color: var(--color-purple-primary);
    box-shadow: 0 10px 30px rgba(105, 51, 255, 0.2);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Stagger animation for each stat */
  &:nth-child(1) {
    animation-delay: 2.1s;
  }
  
  &:nth-child(2) {
    animation-delay: 2.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 2.3s;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-green-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  animation: countUp 2s ease-out 2.5s both;
  
  @keyframes countUp {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  color: var(--color-text-primary);
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

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--color-black-secondary)'};
  color: ${props => props.$active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'};
  border: 2px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--color-gray-dark)'};
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
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const SlimFooter = styled.footer`
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-purple-primary), transparent);
    opacity: 0.6;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const FooterText = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
  opacity: 0.8;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 25px;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const FooterLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  
  &:hover {
    color: var(--color-text-primary);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--color-purple-primary);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 80%;
  }
`;

const GitHubIcon = styled.span`
  font-size: 1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${FooterLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const InstagramIcon = styled.span`
  font-size: 1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${FooterLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const EmailIcon = styled.span`
  font-size: 1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${FooterLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 15px 20px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
`;

const Copyright = styled.p`
  color: var(--color-text-muted);
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.6;
  font-weight: 400;
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
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: brightness(1.1);
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-purple-primary);
    transform: scale(1.05);
    
    img {
      filter: brightness(1.3) drop-shadow(0 0 8px rgba(105, 51, 255, 0.4));
    }
  }
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
