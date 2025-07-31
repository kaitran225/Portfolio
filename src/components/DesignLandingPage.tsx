import React, { useState, useEffect, useRef } from 'react';
import styled, {} from 'styled-components';
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

interface Project {
  id: string;
  title: string;
  category: 'development' | 'design';
  description: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
}

const DesignLandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'branding' | 'ui-ux' | 'print'>('all');
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Initialize Vanta.js topology background with design-focused colors
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
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize Vanta effect with design-focused colors
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
            color: 0xff1493, // Deep pink for design theme
            backgroundColor: 0x0a0a0a,
            points: 8.00,
            maxDistance: 25.00,
            spacing: 18.00
          });
          console.log('Vanta effect initialized:', vantaEffect.current);
        }
      } catch (error) {
        console.warn('Failed to load Vanta.js:', error);
        if (vantaRef.current) {
          vantaRef.current.style.background = `
            radial-gradient(circle at 20% 20%, rgba(255, 20, 147, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 20, 147, 0.1) 0%, transparent 50%)
          `;
        }
      }
    };

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

  // Get data from service
  const personalInfo = portfolioDataService.getPersonalInfo();
  const projects = portfolioDataService.getDesignProjects();

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => {
        if (selectedCategory === 'branding') return project.tags.some(tag => tag.includes('Brand') || tag.includes('Logo'));
        if (selectedCategory === 'ui-ux') return project.tags.some(tag => tag.includes('UI') || tag.includes('UX') || tag.includes('Mobile'));
        if (selectedCategory === 'print') return project.tags.some(tag => tag.includes('Print') || tag.includes('Package'));
        return true;
      });

  return (
    <LandingContainer ref={vantaRef}>
      {/* Design Header */}
      <SiteHeader>
        <HeaderContent>
          <Logo>
            <LogoText>{personalInfo.name}</LogoText>
            <LogoSubText>Creative Designer</LogoSubText>
          </Logo>
        </HeaderContent>
      </SiteHeader>

      {/* Hero Section */}
      <ContentBGContainer>
        <DesignHeroSection>
          <FloatingElements>
            <DesignElement delay={0} type="circle" />
            <DesignElement delay={1} type="square" />
            <DesignElement delay={2} type="triangle" />
            <DesignElement delay={3} type="circle" />
            <DesignElement delay={4} type="square" />
          </FloatingElements>
          
          <HeroContent>
            <HeroGrid>
              <HeroTextSection>
                <CreativeTitle>
                  <span>Creative</span>
                  <span>Designer</span>
                </CreativeTitle>
                <CreativeSubtitle>Crafting Visual Stories & Brand Experiences</CreativeSubtitle>
                <CreativeDescription>
                  {personalInfo.designDescription}
                </CreativeDescription>
              </HeroTextSection>
            </HeroGrid>
          </HeroContent>
        </DesignHeroSection>

        {/* Design Portfolio Section */}
        <Section>
          <SectionHeader>Design Portfolio</SectionHeader>

          {/* Category Filter */}
          <CategoryFilter>
            <FilterButton
              $active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              All Designs ({projects.length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'branding'}
              onClick={() => setSelectedCategory('branding')}
            >
              🎨 Branding ({projects.filter(p => p.tags.some(tag => tag.includes('Brand') || tag.includes('Logo'))).length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'ui-ux'}
              onClick={() => setSelectedCategory('ui-ux')}
            >
              📱 UI/UX ({projects.filter(p => p.tags.some(tag => tag.includes('UI') || tag.includes('UX'))).length})
            </FilterButton>
            <FilterButton
              $active={selectedCategory === 'print'}
              onClick={() => setSelectedCategory('print')}
            >
              📄 Print Design ({projects.filter(p => p.tags.some(tag => tag.includes('Print') || tag.includes('Package'))).length})
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
                      🎨
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

        {/* Dev Portfolio Redirect */}
        <SimpleRedirectSection>
          <RedirectContent>
            <RedirectText>
              Need development work? Check out my <RedirectLink onClick={() => navigateTo('/')}>Development Portfolio</RedirectLink> for technical projects
            </RedirectText>
          </RedirectContent>
        </SimpleRedirectSection>

        {/* Contact Section */}
        <SlimFooter>
          <FooterContent>
            <FooterText>
              Available for design projects & creative collaborations • Let's create something beautiful together
            </FooterText>
            <FooterLinks>
              <FooterLink onClick={() => window.open('https://dribbble.com/kaitran', '_blank')}>
                <DribbbleIcon>🏀</DribbbleIcon>
                Dribbble
              </FooterLink>
              <FooterLink onClick={() => window.open('https://behance.net/kaitran', '_blank')}>
                <BehanceIcon>🎨</BehanceIcon>
                Behance
              </FooterLink>
              <FooterLink onClick={() => navigateTo('/')}>
                <DevIcon>⚡</DevIcon>
                Dev Portfolio
              </FooterLink>
              <FooterLink onClick={() => window.open('https://www.instagram.com/kaitran.prt', '_blank')}>
                <InstagramIcon>📸</InstagramIcon>
                Instagram
              </FooterLink>
              <FooterLink onClick={() => window.open('mailto:design@kaitran.dev', '_blank')}>
                <EmailIcon>✉️</EmailIcon>
                Email
              </FooterLink>
            </FooterLinks>
          </FooterContent>
          <FooterBottom>
            <Copyright>© 2025 Kai Tran. Designed with 💜 and creativity</Copyright>
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
  
  & > canvas {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: -10 !important;
    pointer-events: none !important;
  }
  
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
  z-index: 1;
`;

const SiteHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 20, 147, 0.2);
  z-index: 1000;
  padding: 0.75rem 0;
  box-shadow: 0 2px 10px rgba(255, 20, 147, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
`;

const LogoText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
`;

const LogoSubText = styled.div`
  color: #ff69b4;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1;
`;

const DesignHeroSection = styled.section`
  padding: 100px 20px 60px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: heroSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
  border-bottom: 1px solid rgba(255, 20, 147, 0.2);
  
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
      rgba(255, 20, 147, 0.05) 0%, 
      rgba(255, 105, 180, 0.03) 50%, 
      rgba(255, 20, 147, 0.05) 100%);
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const HeroGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const HeroTextSection = styled.div`
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
  
  @media (max-width: 1024px) {
    order: 1;
  }
`;

const CreativeTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 0.9;
  
  span:first-child {
    display: block;
    color: #ff1493;
    background: linear-gradient(135deg, #ff1493 0%, #ff69b4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  span:last-child {
    display: block;
    color: var(--color-text-primary);
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const CreativeSubtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
`;

const CreativeDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  max-width: 500px;
`;

const CreativeSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const CreativeSkillPill = styled.span`
  background: rgba(255, 20, 147, 0.15);
  border: 1px solid rgba(255, 20, 147, 0.3);
  color: #ff69b4;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 20, 147, 0.25);
    border-color: rgba(255, 20, 147, 0.5);
    color: #ffb6c1;
    transform: translateY(-2px);
  }
`;

// Design Stack Components
const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
`;

const DesignElement = styled.div<{ delay: number; type: 'circle' | 'square' | 'triangle' }>`
  position: absolute;
  width: ${props => props.type === 'circle' ? '8px' : '6px'};
  height: ${props => props.type === 'circle' ? '8px' : '6px'};
  background: ${props => props.type === 'circle' ? '#ff1493' : props.type === 'square' ? '#ff69b4' : '#ffb6c1'};
  border-radius: ${props => props.type === 'circle' ? '50%' : props.type === 'square' ? '2px' : '0'};
  opacity: 0.7;
  animation: designFloat 10s ease-in-out infinite ${props => props.delay}s;
  
  ${props => props.type === 'triangle' && `
    width: 0;
    height: 0;
    background: transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 7px solid #ffb6c1;
  `}
  
  &:nth-child(1) { top: 20%; left: 10%; }
  &:nth-child(2) { top: 60%; left: 85%; }
  &:nth-child(3) { top: 30%; left: 75%; }
  &:nth-child(4) { top: 80%; left: 15%; }
  &:nth-child(5) { top: 45%; left: 90%; }
  
  @keyframes designFloat {
    0%, 100% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
      opacity: 0.7;
    }
    25% {
      transform: translateY(-25px) translateX(15px) rotate(90deg);
      opacity: 1;
    }
    50% {
      transform: translateY(-50px) translateX(-10px) rotate(180deg);
      opacity: 0.5;
    }
    75% {
      transform: translateY(-25px) translateX(20px) rotate(270deg);
      opacity: 0.8;
    }
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
  background: linear-gradient(135deg, #ff1493 0%, #ff69b4 100%);
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
  background: ${props => props.$active ? '#ff1493' : 'var(--color-black-secondary)'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-muted)'};
  border: 2px solid ${props => props.$active ? '#ff1493' : 'var(--color-gray-dark)'};
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff1493;
    color: white;
    border-color: #ff1493;
    transform: translateY(-2px);
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const ProjectCard = styled.div`
  background: var(--color-black-secondary);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 20, 147, 0.2);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(255, 20, 147, 0.3);
    border-color: #ff1493;
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
  background: #ff1493;
  color: white;
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
  background: rgba(255, 20, 147, 0.2);
  color: #ff69b4;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(255, 20, 147, 0.3);
`;

// Dev Introduction Section
const DevIntroSection = styled.section`
  background: linear-gradient(135deg, #0e1a0e 0%, #1b352d 50%, #0e1a0e 100%);
  padding: 3rem 2rem;
  position: relative;
  border-top: 1px solid rgba(0, 255, 127, 0.2);
  border-bottom: 1px solid rgba(0, 255, 127, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(0, 255, 127, 0.05) 0%, transparent 70%);
  }
`;

const DevIntroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const DevIntroTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DevHighlight = styled.span`
  background: linear-gradient(135deg, #00ff7f, #32cd32, #98fb98);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const DevIntroText = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DevPortfolioButton = styled.button`
  background: linear-gradient(135deg, #00ff7f, #32cd32);
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
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
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 255, 127, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Simple Redirect Section
const SimpleRedirectSection = styled.section`
  background: rgba(255, 20, 147, 0.02);
  border-top: 1px solid rgba(255, 20, 147, 0.1);
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
  color: #ff69b4;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-text-primary);
    text-decoration: underline;
  }
`;

const SlimFooter = styled.footer`
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  border-top: 1px solid rgba(255, 20, 147, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ff1493, transparent);
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

const FooterLink = styled.div<{ href?: string; onClick?: () => void }>`
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
  cursor: pointer;
  
  &:hover {
    color: #ff69b4;
    background: rgba(255, 20, 147, 0.1);
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: #ff1493;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 80%;
  }
`;

const DribbbleIcon = styled.span`
  font-size: 1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${FooterLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const BehanceIcon = styled.span`
  font-size: 1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${FooterLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const DevIcon = styled.span`
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
  border-top: 1px solid rgba(255, 20, 147, 0.1);
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

export default DesignLandingPage;
