import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../services/portfolioDataService';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Future implementation: set active section state
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
          <CVButton href="?view=simple">
            📄 Resume
          </CVButton>
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
        <MobileNavItem>
          <CVButton href="?view=simple" onClick={() => setIsMenuOpen(false)}>
            📄 Download Resume
          </CVButton>
        </MobileNavItem>
      </MobileMenu>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(105, 51, 255, 0.1) 0%, 
      rgba(0, 0, 0, 0.95) 50%, 
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
  color: #ffffff;
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
    background: rgba(255, 255, 255, 0.05);
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
  background: rgba(0, 0, 0, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 1rem 0;

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
    background: rgba(255, 255, 255, 0.05);
    border-left-color: var(--color-purple-primary);
  }
`;

export default Header;
