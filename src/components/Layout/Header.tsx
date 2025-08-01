import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../services/portfolioDataService';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const personalInfo = portfolioDataService.getPersonalInfo();

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.location.reload();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'skills', 'contact'];

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => navigateTo('/')}>
          <LogoText>{personalInfo.name}</LogoText>
          <LogoSubText>Full-Stack Developer</LogoSubText>
        </Logo>

        <DesktopNav>
          <NavItem 
            $active={window.location.pathname === '/'}
            onClick={() => navigateTo('/')}
          >
            Development
          </NavItem>
          <NavItem 
            $active={window.location.pathname === '/design'}
            onClick={() => navigateTo('/design')}
          >
            Design
          </NavItem>
          <NavItem onClick={() => scrollToSection('projects')}>
            Projects
          </NavItem>
          <NavItem onClick={() => scrollToSection('skills')}>
            Skills
          </NavItem>
          <NavItem onClick={() => scrollToSection('contact')}>
            Contact
          </NavItem>
        </DesktopNav>

        <HeaderActions>
          <HeaderCTAGroup>
            <GitHubStyleCTA onClick={() => window.open('mailto:kaitran225@gmail.com', '_blank')}>
              <CTAIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </CTAIcon>
              <CTAText>Contact</CTAText>
            </GitHubStyleCTA>
            <GitHubStyleCTA onClick={() => window.open('/resume.pdf', '_blank')}>
              <CTAIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </CTAIcon>
              <CTAText>Resume</CTAText>
            </GitHubStyleCTA>
            <GitHubStyleCTA onClick={() => window.open('https://github.com/kaitran225', '_blank')}>
              <CTAIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
              </CTAIcon>
              <CTAText>GitHub</CTAText>
            </GitHubStyleCTA>
          </HeaderCTAGroup>
          <MobileMenuButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            $isOpen={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>
        </HeaderActions>
      </HeaderContent>

      <MobileMenu $isOpen={isMenuOpen}>
        <MobileNavItem onClick={() => { navigateTo('/'); setIsMenuOpen(false); }}>
          Development Portfolio
        </MobileNavItem>
        <MobileNavItem onClick={() => { navigateTo('/design'); setIsMenuOpen(false); }}>
          Design Portfolio
        </MobileNavItem>
        <MobileNavItem onClick={() => scrollToSection('projects')}>
          Projects
        </MobileNavItem>
        <MobileNavItem onClick={() => scrollToSection('skills')}>
          Skills
        </MobileNavItem>
        <MobileNavItem onClick={() => scrollToSection('contact')}>
          Contact
        </MobileNavItem>
        <MobileCTASection>
          <MobileCTA onClick={() => { window.open('mailto:kaitran225@gmail.com', '_blank'); setIsMenuOpen(false); }}>
            📧 Email
          </MobileCTA>
          <MobileCTA onClick={() => { window.open('/resume.pdf', '_blank'); setIsMenuOpen(false); }}>
            📄 Resume
          </MobileCTA>
          <MobileCTA onClick={() => { window.open('https://github.com/kaitran225', '_blank'); setIsMenuOpen(false); }}>
            💻 GitHub
          </MobileCTA>
        </MobileCTASection>
      </MobileMenu>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--background-primary);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(105, 51, 255, 0.1) 0%, 
      var(--background-primary) 50%, 
      rgba(71, 208, 104, 0.05) 100%);
    z-index: -1;
  }
`;

const HeaderContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  height: 80px;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoText = styled.div`
  color: var(--color-text-primary);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
`;

const LogoSubText = styled.div`
  color: var(--color-purple-primary);
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1;
  margin-top: 2px;
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--color-text-secondary)'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 8px;

  &:hover {
    color: var(--color-text-primary);
    background: var(--background-secondary);
  }

  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: var(--color-purple-primary);
      border-radius: 1px;
    }
  `}
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CVButton = styled.a`
  background: var(--color-purple-primary);
  color: white;
  text-decoration: none;
  padding: 0.7rem 1.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid var(--color-purple-primary);
  
  &:hover {
    background: transparent;
    color: var(--color-purple-primary);
    border-color: var(--color-purple-primary);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 30px;
  height: 30px;
  justify-content: space-around;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: var(--color-text-primary);
    transition: all 0.3s ease;
    transform-origin: center;
  }

  ${props => props.$isOpen && `
    span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--background-primary);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 1rem 0;
  box-shadow: var(--shadow-medium);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavItem = styled.div`
  padding: 1rem 2rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;

  &:hover {
    color: var(--color-text-primary);
    background: var(--background-secondary);
    border-left-color: var(--color-purple-primary);
  }
`;

// GitHub-Style CTA Components for Header
const HeaderCTAGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const GitHubStyleCTA = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  color: var(--color-text-primary);
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: var(--background-tertiary);
    border-color: var(--border-color-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-soft);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CTAIcon = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    width: 18px;
    height: 18px;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }
  
  ${GitHubStyleCTA}:hover & svg {
    color: var(--color-text-primary);
  }
`;

const CTAText = styled.span`
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.85rem;
`;

// Mobile CTA Components
const MobileCTASection = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MobileCTA = styled.button`
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  color: var(--color-text-primary);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: var(--background-tertiary);
    border-color: var(--border-color-hover);
    box-shadow: var(--shadow-soft);
  }
`;

export default Header;
