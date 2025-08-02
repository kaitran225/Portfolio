import React from 'react';
import styled from 'styled-components';
import { EnhancedButton, EnhancedCard } from '../../../components/ui/EnhancedInteractions';
import { responsiveTypography, media, spacing } from '../../../styles/responsive';
import useOptimizedAnimations from '../../../shared/hooks/useOptimizedAnimations';

// ============= ENHANCED HERO SECTION =============

interface EnhancedHeroSectionProps {
  isDevelopment?: boolean;
  isDesign?: boolean;
}

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = React.memo(({
  isDevelopment = false,
  isDesign = false
}) => {
  const { elementRef, getAnimationStyles, getStaggeredDelay } = useOptimizedAnimations({
    threshold: 0.2,
    triggerOnce: true,
  });

  const handleCTAClick = (action: string) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: action,
        value: 1
      });
    }

    // Handle navigation actions
    if (action === 'download_resume') {
      window.history.pushState({}, '', '/resume');
      window.location.reload();
    } else if (action === 'view_projects') {
      const projectsElement = document.getElementById('projects');
      if (projectsElement) {
        projectsElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'contact') {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <HeroContainer ref={elementRef} id="main-content">
      <HeroContent>
        {/* Enhanced Profile Section with Micro-interactions */}
        <ProfileSection style={getAnimationStyles('fadeIn', getStaggeredDelay(0))}>
          <EnhancedCard interactive elevation="medium">
            <ProfileImage
              src="/api/placeholder/180/180"
              alt="Kai Tran - Full Stack Developer"
              loading="eager"
              style={getAnimationStyles('scale', getStaggeredDelay(1))}
            />
          </EnhancedCard>
          
          <ProfileInfo>
            <RoleTitle style={getAnimationStyles('slideLeft', getStaggeredDelay(2))}>
              {isDevelopment ? 'Full-Stack Developer' : 'Creative Designer'}
            </RoleTitle>
            
            <MainHeading style={getAnimationStyles('slideUp', getStaggeredDelay(3))}>
              Kai Tran
            </MainHeading>
            
            <Tagline style={getAnimationStyles('fadeIn', getStaggeredDelay(4))}>
              {isDevelopment 
                ? 'Building enterprise-ready applications with modern tech stacks'
                : 'Crafting beautiful, user-centered digital experiences'
              }
            </Tagline>
            
            <SkillTags style={getAnimationStyles('slideUp', getStaggeredDelay(5))}>
              {isDevelopment ? (
                <>
                  <SkillTag variant="primary">React 19</SkillTag>
                  <SkillTag variant="secondary">TypeScript</SkillTag>
                  <SkillTag variant="accent">Spring Boot</SkillTag>
                  <SkillTag variant="success">AI Integration</SkillTag>
                </>
              ) : (
                <>
                  <SkillTag variant="primary">UI/UX Design</SkillTag>
                  <SkillTag variant="secondary">Figma</SkillTag>
                  <SkillTag variant="accent">Prototyping</SkillTag>
                  <SkillTag variant="success">User Research</SkillTag>
                </>
              )}
            </SkillTags>
          </ProfileInfo>
        </ProfileSection>

        {/* Enhanced Statistics Section */}
        <StatsSection style={getAnimationStyles('slideUp', getStaggeredDelay(6))}>
          <StatCard>
            <StatNumber>3+</StatNumber>
            <StatLabel>Years Experience</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>15+</StatNumber>
            <StatLabel>Projects Completed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>100%</StatNumber>
            <StatLabel>Client Satisfaction</StatLabel>
          </StatCard>
        </StatsSection>

        {/* Enhanced CTA Section */}
        <CTASection style={getAnimationStyles('fadeIn', getStaggeredDelay(7))}>
          <EnhancedButton 
            variant="primary" 
            size="large"
            icon="📄"
            onClick={() => handleCTAClick('download_resume')}
          >
            Download Resume
          </EnhancedButton>
          
          <EnhancedButton 
            variant="outline" 
            size="large"
            icon="🚀"
            onClick={() => handleCTAClick('view_projects')}
          >
            View Projects
          </EnhancedButton>
          
          <EnhancedButton 
            variant="secondary" 
            size="large"
            icon="💬"
            onClick={() => handleCTAClick('contact')}
          >
            Let's Connect
          </EnhancedButton>
        </CTASection>

        {/* Availability Banner */}
        <AvailabilityBanner style={getAnimationStyles('slideUp', getStaggeredDelay(8))}>
          <AvailabilityIndicator />
          <AvailabilityText>
            Available for new opportunities and exciting challenges
          </AvailabilityText>
        </AvailabilityBanner>
      </HeroContent>

      {/* Background Elements */}
      <BackgroundElements aria-hidden="true">
        <FloatingElement delay={0} />
        <FloatingElement delay={2} />
        <FloatingElement delay={4} />
        <FloatingElement delay={1.5} />
        <FloatingElement delay={3.5} />
      </BackgroundElements>
    </HeroContainer>
  );
});

// Enhanced Styled Components
const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--bg-primary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-primary) 100%
  );
  
  /* Accessibility: Respect reduced motion */
  .reduced-motion & {
    background: var(--bg-primary);
  }
`;

const HeroContent = styled.div`
  max-width: 1400px;
  width: 100%;
  padding: ${spacing.xl} ${spacing.md};
  position: relative;
  z-index: 2;
  
  ${media.up('md')(`
    padding: ${spacing.xxl} ${spacing.lg};
  `)}
  
  ${media.up('xl')(`
    padding: ${spacing.xxxl} ${spacing.xl};
  `)}
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${spacing.xl};
  margin-bottom: ${spacing.xxl};
  
  ${media.up('lg')(`
    flex-direction: row;
    text-align: left;
    gap: ${spacing.xxxl};
  `)}
`;

const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-purple-primary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* High contrast mode support */
  .high-contrast & {
    border-width: 6px;
    filter: contrast(1.2);
  }
  
  ${media.up('md')(`
    width: 200px;
    height: 200px;
  `)}
`;

const ProfileInfo = styled.div`
  flex: 1;
  max-width: 600px;
`;

const RoleTitle = styled.p`
  ${responsiveTypography('body1')}
  color: var(--color-purple-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: ${spacing.sm};
  
  /* Large text mode support */
  .large-text & {
    font-size: 1.25rem;
  }
`;

const MainHeading = styled.h1`
  ${responsiveTypography('display1')}
  color: var(--color-text-primary);
  margin-bottom: ${spacing.md};
  
  /* High contrast mode */
  .high-contrast & {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
`;

const Tagline = styled.p`
  ${responsiveTypography('h3')}
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: ${spacing.lg};
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.xl};
  
  ${media.up('md')(`
    gap: ${spacing.md};
  `)}
`;

const SkillTag = styled.span<{ variant: 'primary' | 'secondary' | 'accent' | 'success' }>`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: default;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: var(--color-purple-primary);
          color: white;
        `;
      case 'secondary':
        return `
          background: rgba(105, 51, 255, 0.1);
          color: var(--color-purple-primary);
          border: 1px solid rgba(105, 51, 255, 0.3);
        `;
      case 'accent':
        return `
          background: var(--color-green-primary);
          color: white;
        `;
      case 'success':
        return `
          background: rgba(0, 255, 136, 0.1);
          color: var(--color-green-primary);
          border: 1px solid rgba(0, 255, 136, 0.3);
        `;
      default:
        return '';
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Reduced motion support */
  .reduced-motion &:hover {
    transform: none;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xxl};
  
  ${media.up('md')(`
    gap: ${spacing.xl};
  `)}
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${spacing.lg};
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--card-border);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .reduced-motion &:hover {
    transform: none;
  }
`;

const StatNumber = styled.div`
  ${responsiveTypography('display2')}
  color: var(--color-purple-primary);
  font-weight: 800;
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  ${responsiveTypography('body2')}
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const CTASection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  align-items: center;
  margin-bottom: ${spacing.xxl};
  
  ${media.up('md')(`
    flex-direction: row;
    justify-content: center;
    gap: ${spacing.lg};
  `)}
`;

const AvailabilityBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.md};
  padding: ${spacing.md} ${spacing.lg};
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(10px);
`;

const AvailabilityIndicator = styled.div`
  width: 12px;
  height: 12px;
  background: var(--color-green-primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 255, 136, 0);
    }
  }
  
  .reduced-motion & {
    animation: none;
  }
`;

const AvailabilityText = styled.span`
  color: var(--color-green-primary);
  font-weight: 600;
  font-size: 0.875rem;
  
  ${media.up('md')(`
    font-size: 1rem;
  `)}
`;

const BackgroundElements = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  
  .reduced-motion & {
    display: none;
  }
`;

const FloatingElement = styled.div<{ delay: number }>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(45deg, var(--color-purple-primary), var(--color-green-primary));
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  &:nth-child(1) { top: 20%; left: 10%; }
  &:nth-child(2) { top: 60%; left: 85%; }
  &:nth-child(3) { top: 30%; left: 75%; }
  &:nth-child(4) { top: 80%; left: 15%; }
  &:nth-child(5) { top: 45%; left: 90%; }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
      opacity: 0.7;
    }
    25% {
      transform: translateY(-20px) translateX(10px);
      opacity: 1;
    }
    50% {
      transform: translateY(-40px) translateX(-5px);
      opacity: 0.5;
    }
    75% {
      transform: translateY(-20px) translateX(15px);
      opacity: 0.8;
    }
  }
`;

export default React.memo(EnhancedHeroSection);
