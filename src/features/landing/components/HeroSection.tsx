import React from 'react';
import styled, { keyframes } from 'styled-components';
import LazyImage from '../../../components/media/LazyImage';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';

interface HeroSectionProps {
  isDevelopment?: boolean;
  isDesign?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = React.memo(({ 
  isDevelopment = false, 
  isDesign = false 
}) => {
  const personalInfo = portfolioDataService.getPersonalInfo();

  if (isDevelopment) {
    return (
      <HeroContainer>
        <ContentBGContainer>
          <DevelopmentHeroSection id="home">
            <HeroContent>
              <SlimIntegratedSection>
                <ProfileSection>
                  <ProfilePicture>
                    <LazyImage 
                      src={personalInfo.avatar} 
                      alt={personalInfo.name}
                      className="profile-image"
                    />
                    <ProfileGlow />
                  </ProfilePicture>
                  <HeroText>
                                        <Name>Trần Nguyên Khánh</Name>
                    <RoleTitle>Full-Stack Developer</RoleTitle>
                    <KeySkills>React • TypeScript • Spring Boot • AI Integration</KeySkills>
                    <ExperienceInfo>
                      <ExperienceBadge>
                        <ExperienceIcon>💼</ExperienceIcon>
                        <ExperienceText>3+ Years Experience</ExperienceText>
                      </ExperienceBadge>
                      <ExperienceBadge>
                        <ExperienceIcon>📍</ExperienceIcon>
                        <ExperienceText>Ho Chi Minh City, Vietnam</ExperienceText>
                      </ExperienceBadge>
                    </ExperienceInfo>
                    <Description>
                      Professional full-stack developer specializing in modern web technologies and enterprise solutions. Expert in React 19, TypeScript, Spring Boot microservices, and AI integration with proven production deployments.
                    </Description>
                  </HeroText>
                </ProfileSection>

                <ActionButtonsWrapper>
                  <CTASection>
                    <CTAButton href="/resume.pdf" className="primary" download>
                      <span>Download Resume</span>
                      <ArrowIcon>⬇</ArrowIcon>
                    </CTAButton>
                    <CTAButton href="#projects" className="secondary">
                      <span>View Projects</span>
                      <ConnectIcon>🚀</ConnectIcon>
                    </CTAButton>
                    <CTAButton href="#contact" className="tertiary">
                      <span>Let's Connect</span>
                      <ConnectIcon>💬</ConnectIcon>
                    </CTAButton>
                  </CTASection>
                </ActionButtonsWrapper>
              </SlimIntegratedSection>
            </HeroContent>
          </DevelopmentHeroSection>
        </ContentBGContainer>
      </HeroContainer>
    );
  }

  if (isDesign) {
    return (
      <HeroContainer>
        <ContentBGContainer>
          <DesignHeroSection id="home">
            <FloatingDesignElements>
              <DesignElement delay={0}>🎨</DesignElement>
              <DesignElement delay={1.5}>✨</DesignElement>
              <DesignElement delay={3}>🌟</DesignElement>
              <DesignElement delay={2}>💫</DesignElement>
              <DesignElement delay={4}>🎭</DesignElement>
            </FloatingDesignElements>

            <HeroContent>
              <SlimIntegratedSection>
                <ProfileSection>
                  <ProfilePicture>
                    <LazyImage 
                      src={personalInfo.avatar} 
                      alt={personalInfo.name}
                      className="profile-image"
                    />
                    <DesignProfileGlow />
                  </ProfilePicture>
                  <HeroText>
                    <DesignRoleTitle>Creative Designer</DesignRoleTitle>
                    <DesignTitle>Crafting Beautiful Digital Experiences</DesignTitle>
                    <ExperienceInfo>
                      <DesignExperienceBadge>
                        <ExperienceIcon>🎨</ExperienceIcon>
                        <ExperienceText>UI/UX Designer</ExperienceText>
                      </DesignExperienceBadge>
                      <DesignExperienceBadge>
                        <ExperienceIcon>📱</ExperienceIcon>
                        <ExperienceText>Mobile & Web Design</ExperienceText>
                      </DesignExperienceBadge>
                      <DesignAvailabilityBadge>
                        <ExperienceIcon>✨</ExperienceIcon>
                        <ExperienceText>Available for Projects</ExperienceText>
                      </DesignAvailabilityBadge>
                    </ExperienceInfo>
                    <DesignDescription>
                      Passionate about creating intuitive and visually stunning digital experiences. Specializing in modern UI/UX design, branding, and user-centered design solutions.
                    </DesignDescription>
                  </HeroText>
                </ProfileSection>

                <ActionButtonsWrapper>
                  <CTASection>
                    <DesignCTAButton href="#projects" className="primary">
                      <span>Explore Design Work</span>
                      <ArrowIcon>→</ArrowIcon>
                    </DesignCTAButton>
                    <DesignCTAButton href="#contact" className="secondary">
                      <span>Start a Project</span>
                      <ConnectIcon>🚀</ConnectIcon>
                    </DesignCTAButton>
                  </CTASection>
                </ActionButtonsWrapper>
              </SlimIntegratedSection>
            </HeroContent>
          </DesignHeroSection>
        </ContentBGContainer>
      </HeroContainer>
    );
  }

  return null;
});

// Shared styled components
const HeroContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentBGContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  backdrop-filter: blur(10px);
  background: var(--card-bg);
  border-radius: 20px;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-soft);

  @media (max-width: 768px) {
    padding: 1rem;
    backdrop-filter: blur(5px);
  }
`;

const DevelopmentHeroSection = styled.section`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem 0;
`;

const DesignHeroSection = styled.section`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem 0;
`;

const HeroContent = styled.div`
  max-width: 1000px;
  width: 100%;
  text-align: center;
  z-index: 10;
  position: relative;
`;

const SlimIntegratedSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    text-align: left;
    gap: 4rem;
  }
`;

const ProfilePicture = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  flex-shrink: 0;
  
  .profile-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(105, 51, 255, 0.3);
    transition: all 0.3s ease;
    box-shadow: 0 20px 40px rgba(105, 51, 255, 0.2);
    
    &:hover {
      transform: scale(1.05);
      border-color: rgba(105, 51, 255, 0.6);
      box-shadow: 0 25px 50px rgba(105, 51, 255, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
  }
`;

const ProfileGlow = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(20px);
  animation: rotate 8s linear infinite;
  z-index: -1;
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const DesignProfileGlow = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff6b6b 50%);
  border-radius: 50%;
  opacity: 0.4;
  filter: blur(20px);
  animation: rotate 10s linear infinite;
  z-index: -1;
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const HeroText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 1024px) {
    text-align: left;
  }
`;

const RoleTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--color-purple-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.2s forwards;
`;

const Name = styled.h1`
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 900;
  margin: 0 0 0.5rem 0;
  line-height: 1.1;
  color: var(--color-text-primary);
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.1s forwards;
`;

const KeySkills = styled.h2`
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 500;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.3;
  color: var(--color-purple-primary);
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.3s forwards;
  letter-spacing: 1px;
`;

const DesignRoleTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--color-design-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.2s forwards;
`;

const DesignTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff6b6b 50%, #43ece1ff 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.4s forwards;
`;

const ExperienceInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.6s forwards;
  
  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`;

const ExperienceBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(105, 51, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: 1px solid rgba(105, 51, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(105, 51, 255, 0.2);
    border-color: rgba(105, 51, 255, 0.4);
    transform: translateY(-2px);
  }
`;

const DesignExperienceBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.4);
    transform: translateY(-2px);
  }
`;

const DesignAvailabilityBadge = styled(DesignExperienceBadge)`
  background: rgba(78, 205, 196, 0.1);
  border-color: rgba(78, 205, 196, 0.2);
  
  &:hover {
    background: rgba(78, 205, 196, 0.2);
    border-color: rgba(78, 205, 196, 0.4);
  }
`;

const ExperienceIcon = styled.span`
  font-size: 1rem;
`;

const ExperienceText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 600px;
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.8s forwards;
  
  @media (min-width: 1024px) {
    margin: 0;
  }
`;

const DesignDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 600px;
  opacity: 0;
  animation: slideInUp 0.8s ease-out 0.8s forwards;
  
  @media (min-width: 1024px) {
    margin: 0;
  }
`;

const ActionButtonsWrapper = styled.div`
  opacity: 0;
  animation: slideInUp 0.8s ease-out 1s forwards;
`;

const CTASection = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (min-width: 1024px) {
    justify-content: center;
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6933ff 0%, #00ff88 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &.secondary {
    background: transparent;
    border: 2px solid #6933ff;
    color: #6933ff;
    
    &:hover {
      background: #6933ff;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(105, 51, 255, 0.4);
    }
  }
  
  &.tertiary {
    background: transparent;
    border: 2px solid #00ff88;
    color: #00ff88;
    
    &:hover {
      background: #00ff88;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 255, 136, 0.4);
    }
  }
  
  &.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(105, 51, 255, 0.4);
  }
  
  span {
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    justify-content: center;
  }
`;

const DesignCTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff6b6b 50%, #43ece1ff 80%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &.secondary {
    background: transparent;
    border: 2px solid #ff6b6b;
    color: #ff6b6b;
    
    &:hover {
      background: #ff6b6b;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
    }
  }
  
  &.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
  }
  
  span {
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    justify-content: center;
  }
`;

const ArrowIcon = styled.span`
  transition: transform 0.3s ease;
  
  ${CTAButton}:hover & {
    transform: translateX(5px);
  }
  
  ${DesignCTAButton}:hover & {
    transform: translateX(5px);
  }
`;

const ConnectIcon = styled.span`
  transition: transform 0.3s ease;
  
  ${CTAButton}:hover & {
    transform: scale(1.2);
  }
  
  ${DesignCTAButton}:hover & {
    transform: scale(1.2);
  }
`;

// Floating design elements for design version
const designFloat = keyframes`
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
`;

const FloatingDesignElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
`;

const DesignElement = styled.div<{ delay: number }>`
  position: absolute;
  font-size: 2rem;
  animation: ${designFloat} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  &:nth-child(1) { top: 20%; left: 10%; }
  &:nth-child(2) { top: 60%; left: 85%; }
  &:nth-child(3) { top: 30%; left: 75%; }
  &:nth-child(4) { top: 80%; left: 15%; }
  &:nth-child(5) { top: 45%; left: 90%; }
`;

export default React.memo(HeroSection);
