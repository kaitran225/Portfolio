import React, { useState, useEffect, useRef } from 'react';
import styled, { } from 'styled-components';
import portfolioDataService from '../services/portfolioDataService';

// Navigation utility
const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.location.reload();
};

// Vanta.js topology effect
declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

const LandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'development' | 'design' | 'backend'>('all');
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Get data from service
  const personalInfo = portfolioDataService.getPersonalInfo();
  const projects = portfolioDataService.getAllProjects();
  const featuredProjects = portfolioDataService.getFeaturedDevelopmentProjects();
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

  return (
    <LandingContainer ref={vantaRef}>
      {/* Hero Section */}
      <ContentBGContainer>
        <HeroSection id="hero">
          <FloatingParticles>
            <Particle delay={0} />
            <Particle delay={2} />
            <Particle delay={4} />
            <Particle delay={1.5} />
            <Particle delay={3.5} />
          </FloatingParticles>

          <HeroContent>
            <SlimIntegratedSection>
              <ProfileSection>
                <ProfilePicture>
                  <img src={personalInfo.avatar} alt={personalInfo.name} />
                  <ProfileGlow />
                </ProfilePicture>
                <HeroText>
                                    <RoleTitle>Full-Stack Developer</RoleTitle>
                  <Title>{personalInfo.subtitle}</Title>
                  <Description>
                    {personalInfo.description}
                  </Description>
                </HeroText>
              </ProfileSection>
            </SlimIntegratedSection>

            {/* Featured Development Projects */}
            <FeaturedSection>
              <FeaturedHeader>Featured Development Projects</FeaturedHeader>
              <FeaturedGrid>
                {featuredProjects.filter(project => project.category === 'development').map(project => (
                  <FeaturedCard
                    key={project.id}
                    onClick={() => window.location.href = `/project/${project.id}`}
                  >
                    <FeaturedThumbnail>
                      <img src={project.thumbnail} alt={project.title} />
                      <FeaturedOverlay>
                      </FeaturedOverlay>
                    </FeaturedThumbnail>
                    <FeaturedInfo>
                      <FeaturedTitle>{project.title}</FeaturedTitle>
                      <FeaturedDescription>{project.description}</FeaturedDescription>
                      <TagList>
                        {project.tags.slice(0, 3).map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </TagList>
                    </FeaturedInfo>
                  </FeaturedCard>
                ))}
              </FeaturedGrid>
            </FeaturedSection>
          </HeroContent>
        </HeroSection>

        {/* Development Project Catalog */}
        <Section id="projects">
          <SectionHeader>Development Portfolio</SectionHeader>

          {/* Category Filter */}
          <CategoryFilter>
            <FilterButton
              $active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              All Development Projects ({projects.filter(p => p.category === 'development').length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'development'}
              onClick={() => setSelectedCategory('development')}
            >
              💻 Web Applications ({projects.filter(p => p.category === 'development' && p.tags.some(tag => tag.includes('React') || tag.includes('Next'))).length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'backend'}
              onClick={() => setSelectedCategory('backend')}
            >
              ⚙️ Backend & APIs ({projects.filter(p => p.category === 'development' && p.tags.some(tag => tag.includes('Node') || tag.includes('API'))).length})
            </FilterButton>
          </CategoryFilter>

          {/* Project Grid */}
          <ProjectGrid>
            {projects.filter(project => project.category === 'development').map(project => (
              <ProjectCard
                key={project.id}
                onClick={() => window.location.href = `/project/${project.id}`}
              >
                <ProjectThumbnail>
                  <img src={project.thumbnail} alt={project.title} />
                  <ProjectOverlay>
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



        {/* Skills Section */}
        <Section id="skills">
          <SectionHeader>Technical Skills</SectionHeader>
          <SkillsGrid>
            <SkillCategory>
              <SkillCategoryTitle>Frontend</SkillCategoryTitle>
              <SkillList>
                {portfolioDataService.getSkills().technical.frontend.map(skill => (
                  <SkillPill key={skill}>{skill}</SkillPill>
                ))}
              </SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillCategoryTitle>Backend</SkillCategoryTitle>
              <SkillList>
                {portfolioDataService.getSkills().technical.backend.map(skill => (
                  <SkillPill key={skill}>{skill}</SkillPill>
                ))}
              </SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillCategoryTitle>DevOps</SkillCategoryTitle>
              <SkillList>
                {portfolioDataService.getSkills().technical.devops.map(skill => (
                  <SkillPill key={skill}>{skill}</SkillPill>
                ))}
              </SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillCategoryTitle>Tools</SkillCategoryTitle>
              <SkillList>
                {portfolioDataService.getSkills().technical.tools.map(skill => (
                  <SkillPill key={skill}>{skill}</SkillPill>
                ))}
              </SkillList>
            </SkillCategory>
          </SkillsGrid>
        </Section>

        {/* Design Portfolio Redirect */}
        <SimpleRedirectSection>
          <RedirectContent>
            <RedirectText>
              Also explore my <RedirectLink onClick={() => navigateTo('/design')}>Design Portfolio</RedirectLink> for creative projects
            </RedirectText>
          </RedirectContent>
        </SimpleRedirectSection>
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
  height: calc(100vh - 80px);
  padding: 2rem 1.5rem;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: heroSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  
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
      rgba(0, 255, 136, 0.05) 0%, 
      rgba(105, 51, 255, 0.03) 50%, 
      rgba(0, 255, 136, 0.05) 100%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: calc(100vh - 70px);
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 2rem;
  position: relative;
  z-index: 2;
  padding: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 1rem;
    justify-content: flex-start;
    padding-top: 2rem;
  }
`;


const SlimIntegratedSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const FeaturedSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: featuredSlideUp 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
  min-height: 0; /* Allow flex shrinking */
  
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
    padding: 1rem 0;
    margin-top: 0.5rem;
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
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
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

const ProfileSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  text-align: left;
  padding: 2rem 0;
  flex: 1;
  animation: profileFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
  
  @keyframes profileFadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem 0 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 0 0.5rem;
    gap: 1rem;
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
    width: 180px;
    height: 180px;
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
    
    @media (max-width: 1024px) {
      width: 160px;
      height: 160px;
    }
    
    @media (max-width: 768px) {
      width: 140px;
      height: 140px;
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

const HeroText = styled.div`
  text-align: left;
  flex: 1;
  animation: heroTextSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
  
  @keyframes heroTextSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 1024px) {
    text-align: center;
  }
  
  @media (max-width: 768px) {
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
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
`;

const RoleTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.8rem;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-green-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: roleSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
  
  @keyframes roleSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.85;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
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

// Skills Section Components
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SkillCategory = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(138, 43, 226, 0.1);
  }
`;

const SkillCategoryTitle = styled.h3`
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

// Tech Stack Components
const Section = styled.section`
  padding: 3rem 1.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div<{ featured?: boolean }>`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  ${props => props.featured && `
    border: 2px solid var(--color-purple-primary);
    background: rgba(105, 51, 255, 0.05);
    box-shadow: 0 10px 30px rgba(105, 51, 255, 0.2);
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(105, 51, 255, 0.3);
    border-color: var(--color-purple-primary);
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
  background: rgba(105, 51, 255, 0.1);
  color: var(--color-text-primary);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(105, 51, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(105, 51, 255, 0.2);
    border-color: var(--color-purple-primary);
    transform: translateY(-1px);
  }
`;

// Simple Redirect Section
const SimpleRedirectSection = styled.section`
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

export default LandingPage;
