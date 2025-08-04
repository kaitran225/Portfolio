import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiUser, 
  FiBriefcase, 
  FiMail, 
  FiMenu, 
  FiX,
  FiCode,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiSun,
  FiMoon
} from '../ui/IconWrapper';

// ============= MOBILE-OPTIMIZED NAVIGATION =============

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: string;
  external?: boolean;
}

interface MobileNavigationProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: FiHome },
  { id: 'about', label: 'About', href: '#about', icon: FiUser },
  { id: 'skills', label: 'Skills', href: '#skills', icon: FiCode },
  { id: 'projects', label: 'Projects', href: '#projects', icon: FiBriefcase },
  { id: 'contact', label: 'Contact', href: '#contact', icon: FiMail, badge: 'Open' },
];

const socialLinks = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/kharlsamson', icon: FiGithub, external: true },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/kharlsamson', icon: FiLinkedin, external: true },
  { id: 'twitter', label: 'Twitter', href: 'https://twitter.com/kharlsamson', icon: FiTwitter, external: true },
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentSection = 'home',
  onSectionChange,
  theme = 'dark',
  onThemeToggle,
  className
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('[data-mobile-nav]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const handleNavClick = (item: NavigationItem) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      onSectionChange?.(item.id);
      setIsMenuOpen(false);
    }
  };

  const handleResumeDownload = () => {
    // Navigate to resume page
    window.history.pushState({}, '', '/resume');
    window.location.reload();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <MobileTopBar
        data-mobile-nav
        $isScrolled={isScrolled}
        className={className}
      >
        <Logo>
          <LogoText>KS</LogoText>
          <LogoSubtext>Portfolio</LogoSubtext>
        </Logo>

        <TopBarActions>
          <ThemeToggle onClick={onThemeToggle} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </ThemeToggle>
          
          <MenuToggle
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            $isOpen={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </MenuToggle>
        </TopBarActions>
      </MobileTopBar>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <MenuOverlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            <MobileMenu
              data-mobile-nav
              as={motion.div}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <MenuHeader>
                <MenuTitle>Navigation</MenuTitle>
                <MenuClose onClick={() => setIsMenuOpen(false)}>
                  <FiX />
                </MenuClose>
              </MenuHeader>

              <MenuContent>
                {/* Main Navigation */}
                <MenuSection>
                  <SectionTitle>Main</SectionTitle>
                  <MenuList>
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <MenuItem
                          key={item.id}
                          as={motion.li}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          $isActive={currentSection === item.id}
                          onClick={() => handleNavClick(item)}
                        >
                          <MenuItemIcon $isActive={currentSection === item.id}>
                            <Icon />
                          </MenuItemIcon>
                          <MenuItemContent>
                            <MenuItemLabel>{item.label}</MenuItemLabel>
                            {item.badge && (
                              <MenuItemBadge>{item.badge}</MenuItemBadge>
                            )}
                          </MenuItemContent>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </MenuSection>

                {/* Social Links */}
                <MenuSection>
                  <SectionTitle>Connect</SectionTitle>
                  <SocialGrid>
                    {socialLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <SocialItem
                          key={link.id}
                          as={motion.div}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          onClick={() => handleNavClick(link)}
                        >
                          <Icon />
                          <span>{link.label}</span>
                        </SocialItem>
                      );
                    })}
                  </SocialGrid>
                </MenuSection>

                {/* Action Buttons */}
                <MenuActions>
                  <ActionButton
                    as={motion.button}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={handleResumeDownload}
                    $primary
                  >
                    <FiDownload />
                    Download Resume
                  </ActionButton>
                  
                  <ActionButton
                    as={motion.a}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    href="mailto:kharl.samson@email.com"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiMail />
                    Get in Touch
                  </ActionButton>
                </MenuActions>
              </MenuContent>

              {/* Footer */}
              <MenuFooter>
                <FooterText>Available for new opportunities</FooterText>
                <FooterSubtext>Ready to collaborate and create</FooterSubtext>
              </MenuFooter>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Alternative/Additional) */}
      <BottomNavigation data-mobile-nav>
        {navigationItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <BottomNavItem
              key={item.id}
              $isActive={currentSection === item.id}
              onClick={() => handleNavClick(item)}
            >
              <BottomNavIcon $isActive={currentSection === item.id}>
                <Icon />
              </BottomNavIcon>
              <BottomNavLabel $isActive={currentSection === item.id}>
                {item.label}
              </BottomNavLabel>
              {item.badge && <BottomNavBadge>{item.badge}</BottomNavBadge>}
            </BottomNavItem>
          );
        })}
      </BottomNavigation>
    </>
  );
};

// Styled Components
const MobileTopBar = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  backdrop-filter: blur(10px);
  background: ${props => props.$isScrolled 
    ? 'var(--background-primary-alpha)' 
    : 'transparent'
  };
  backdrop-filter: ${props => props.$isScrolled ? 'blur(20px)' : 'none'};
  border-bottom: ${props => props.$isScrolled 
    ? '1px solid var(--border-color-alpha)' 
    : 'none'
  };
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoSubtext = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 500;
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--background-secondary);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }
`;

const MenuToggle = styled.button<{ $isOpen: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: ${props => props.$isOpen ? 'var(--color-purple-primary)' : 'var(--background-secondary)'};
  color: ${props => props.$isOpen ? 'white' : 'var(--color-text-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1998;
  backdrop-filter: blur(4px);
`;

const MobileMenu = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  width: min(400px, 85vw);
  height: 100vh;
  background: var(--background-secondary);
  border-left: 1px solid var(--border-color);
  z-index: 1999;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-large);
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const MenuTitle = styled.h2`
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const MenuClose = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--background-tertiary);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }
`;

const MenuContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const MenuSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 0;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.li<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.$isActive ? 'var(--color-purple-primary)20' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'var(--color-purple-primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-purple-primary)20;
    border-color: var(--color-purple-primary);
  }
`;

const MenuItemIcon = styled.div<{ $isActive: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.$isActive ? 'var(--color-purple-primary)' : 'var(--background-tertiary)'};
  color: ${props => props.$isActive ? 'white' : 'var(--color-text-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
`;

const MenuItemContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuItemLabel = styled.span`
  color: var(--color-text-primary);
  font-weight: 500;
`;

const MenuItemBadge = styled.span`
  background: var(--color-success);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const SocialItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--background-tertiary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }

  span {
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const MenuActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$primary ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  background: ${props => props.$primary ? 'var(--color-purple-primary)' : 'var(--background-tertiary)'};
  color: ${props => props.$primary ? 'white' : 'var(--color-text-primary)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const MenuFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
`;

const FooterText = styled.p`
  color: var(--color-text-primary);
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
`;

const FooterSubtext = styled.p`
  color: var(--color-text-muted);
  margin: 0;
  font-size: 0.8rem;
`;

const BottomNavigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--background-primary-alpha);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color-alpha);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 1rem;
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
`;

const BottomNavItem = styled.button<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
`;

const BottomNavIcon = styled.div<{ $isActive: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.$isActive ? 'var(--color-purple-primary)' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : 'var(--color-text-muted)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
`;

const BottomNavLabel = styled.span<{ $isActive: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.$isActive ? 'var(--color-purple-primary)' : 'var(--color-text-muted)'};
  font-weight: ${props => props.$isActive ? '600' : '500'};
  transition: all 0.3s ease;
`;

const BottomNavBadge = styled.span`
  position: absolute;
  top: -2px;
  right: 8px;
  background: var(--color-success);
  color: white;
  padding: 0.15rem 0.3rem;
  border-radius: 8px;
  font-size: 0.6rem;
  font-weight: 600;
`;

export default MobileNavigation;
