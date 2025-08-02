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
  const heroData = portfolioDataService.getHeroSectionData();

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
                  </ProfilePicture>
                  <HeroText>
                    <RoleTitle>{heroData.development.roleTitle}</RoleTitle>
                    <Name>{heroData.development.name}</Name>
                    <KeySkills>{heroData.development.keySkills}</KeySkills>
                    <ExperienceInfo>
                      {heroData.development.experienceBadges.map((badge, index) => (
                        <ExperienceBadge key={index}>
                          <ExperienceIcon>{badge.icon}</ExperienceIcon>
                          <ExperienceText>{badge.text}</ExperienceText>
                        </ExperienceBadge>
                      ))}
                    </ExperienceInfo>
                    <Description>
                      {heroData.development.description}
                    </Description>
                  </HeroText>
                </ProfileSection>

                <ActionButtonsWrapper>
                  <CTASection>
                    {heroData.development.ctaButtons.map((button, index) => (
                      <CTAButton
                        key={index}
                        href={button.href}
                        className={button.type}
                        {...(button.download && { download: true })}
                      >
                        <span>{button.text}</span>
                        <ArrowIcon>{button.icon}</ArrowIcon>
                      </CTAButton>
                    ))}
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
                    <DesignRoleTitle>{heroData.design.roleTitle}</DesignRoleTitle>
                    <DesignTitle>{heroData.design.title}</DesignTitle>
                    <ExperienceInfo>
                      {heroData.design.experienceBadges.map((badge, index) => {
                        const BadgeComponent = badge.text === "Available for Projects" 
                          ? DesignAvailabilityBadge 
                          : DesignExperienceBadge;
                        return (
                          <BadgeComponent key={index}>
                            <ExperienceIcon>{badge.icon}</ExperienceIcon>
                            <ExperienceText>{badge.text}</ExperienceText>
                          </BadgeComponent>
                        );
                      })}
                    </ExperienceInfo>
                    <DesignDescription>
                      {heroData.design.description}
                    </DesignDescription>
                  </HeroText>
                </ProfileSection>

                <ActionButtonsWrapper>
                  <CTASection>
                    {heroData.design.ctaButtons.map((button, index) => (
                      <DesignCTAButton
                        key={index}
                        href={button.href}
                        className={button.type}
                      >
                        <span>{button.text}</span>
                        <ArrowIcon>{button.icon}</ArrowIcon>
                      </DesignCTAButton>
                    ))}
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

// Animations
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Shared styled components
const HeroContainer = styled.div`
  min-height: 36vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const ContentBGContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--color-black-primary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 12px;
    margin: 0 0.5rem;
  }
`;

const DevelopmentHeroSection = styled.section`
  position: relative;
  z-index: 3;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const DesignHeroSection = styled.section`
  position: relative;
  z-index: 3;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  z-index: 10;
  position: relative;
`;

const SlimIntegratedSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;
  text-align: left;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  grid-column: 1 / 3;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    grid-column: 1;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ProfilePicture = styled.div`
  position: relative;
  min-width: 280px;
  min-height: 280px;
  flex-shrink: 0;
  
  .profile-image {
    width: 100%;
    height: 100%;
    min-width: 280px;
    min-height: 280px;
    object-fit: cover;
    border: 1px solid var(--color-background-primary);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      border-color: var(--color-purple-accent);
    }
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const DesignProfileGlow = styled.div`
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  background: var(--color-design-primary);
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(15px);
  z-index: -1;
`;

const HeroText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const RoleTitle = styled.h3`
  font-size: 0.9rem;
  color: var(--color-purple-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.1s forwards;
`;

const Name = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  color: var(--color-text-primary);
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.2s forwards;
`;

const KeySkills = styled.h2`
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 500;
  margin: 0;
  line-height: 1.3;
  color: var(--color-text-secondary);
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.3s forwards;
  letter-spacing: 0.5px;
`;

const DesignRoleTitle = styled.h3`
  font-size: 0.9rem;
  color: var(--color-design-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.1s forwards;
`;

const DesignTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  color: var(--color-design-primary);
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.2s forwards;
`;

const ExperienceInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.4s forwards;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const ExperienceBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--color-black-secondary);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  border: 1px solid var(--color-purple-primary);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-purple-primary);
    color: white;
    transform: translateY(-1px);
  }
`;

const DesignExperienceBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--color-black-secondary);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  border: 1px solid var(--color-design-primary);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-design-primary);
    color: white;
    transform: translateY(-1px);
  }
`;

const DesignAvailabilityBadge = styled(DesignExperienceBadge)`
  border-color: var(--color-design-secondary);
  
  &:hover {
    background: var(--color-design-secondary);
    color: white;
  }
`;

const ExperienceIcon = styled.span`
  font-size: 0.8rem;
`;

const ExperienceText = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 800px;
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.5s forwards;
  
  @media (max-width: 1024px) {
    margin: 0 auto;
  }
`;

const DesignDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 500px;
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.5s forwards;
  
  @media (max-width: 1024px) {
    margin: 0 auto;
  }
`;

const ActionButtonsWrapper = styled.div`
  grid-column: 3;
  opacity: 0;
  animation: ${slideInUp} 0.6s ease-out 0.6s forwards;
  
  @media (max-width: 1024px) {
    grid-column: 1;
  }
`;

const CTASection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (max-width: 1024px) {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-purple-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 2px solid var(--color-purple-primary);
  cursor: pointer;
  position: relative;
  min-width: 140px;
  
  &.secondary {
    background: transparent;
    color: var(--color-purple-primary);
    
    &:hover {
      background: var(--color-purple-primary);
      color: white;
      transform: translateY(-2px);
    }
  }
  
  &.tertiary {
    background: transparent;
    border-color: var(--color-green-primary);
    color: var(--color-green-primary);
    
    &:hover {
      background: var(--color-green-primary);
      color: white;
      transform: translateY(-2px);
    }
  }
  
  &.primary:hover {
    background: var(--color-purple-accent);
    border-color: var(--color-purple-accent);
    transform: translateY(-2px);
  }
  
  span {
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 1024px) {
    min-width: auto;
    flex: 1;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }
`;

const DesignCTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-design-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 2px solid var(--color-design-primary);
  cursor: pointer;
  position: relative;
  min-width: 140px;
  
  &.secondary {
    background: transparent;
    color: var(--color-design-primary);
    
    &:hover {
      background: var(--color-design-primary);
      color: white;
      transform: translateY(-2px);
    }
  }
  
  &.primary:hover {
    background: var(--color-design-secondary);
    border-color: var(--color-design-secondary);
    transform: translateY(-2px);
  }
  
  span {
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 1024px) {
    min-width: auto;
    flex: 1;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }
`;

const ArrowIcon = styled.span`
  transition: transform 0.3s ease;
  
  ${CTAButton}:hover & {
    transform: translateX(3px);
  }
  
  ${DesignCTAButton}:hover & {
    transform: translateX(3px);
  }
`;

const ConnectIcon = styled.span`
  transition: transform 0.3s ease;
  
  ${CTAButton}:hover & {
    transform: scale(1.1);
  }
  
  ${DesignCTAButton}:hover & {
    transform: scale(1.1);
  }
`;

export default React.memo(HeroSection);
