import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= ENHANCED NAVIGATION WITH SEARCH =============

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'skill' | 'section';
  href: string;
  relevance: number;
}

// Animations
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const NavigationWrapper = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 
    'var(--bg-blur)' : 
    'var(--card-bg)'
  };
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.scrolled ? 
    'var(--border-color)' : 
    'var(--border-color)'
  };
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);
  
  ${props => props.scrolled && css`
    box-shadow: var(--shadow-medium);
  `}
  
  ${props => props.scrolled && css`
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  `}
`;

const NavigationContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    animation: ${pulse} 1s ease-in-out;
  }
`;

const NavigationItems = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 1024px) {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavigationLink = styled.a<{ active?: boolean }>`
  color: ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
  padding: 0.5rem 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.active ? '100%' : '0%'};
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #667eea;
    
    &::after {
      width: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchInputWrapper = styled.div<{ expanded: boolean }>`
  position: relative;
  width: ${props => props.expanded ? '300px' : '40px'};
  transition: width 0.3s ease;
  
  @media (max-width: 768px) {
    width: ${props => props.expanded ? '200px' : '40px'};
  }
`;

const SearchInput = styled.input<{ expanded: boolean }>`
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0 1rem;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  opacity: ${props => props.expanded ? 1 : 0};
  pointer-events: ${props => props.expanded ? 'auto' : 'none'};

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const SearchResults = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: 400px;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin-top: 0.5rem;
  overflow-y: auto;
  z-index: 1001;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  animation: ${props => props.visible ? slideDown : 'none'} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 300px;
    right: -130px;
  }
`;

const SearchResultItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const SearchResultTitle = styled.div`
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const SearchResultDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  line-height: 1.4;
`;

const SearchResultType = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.5rem;
  background: ${props => {
    switch (props.type) {
      case 'project': return 'rgba(102, 126, 234, 0.2)';
      case 'skill': return 'rgba(16, 185, 129, 0.2)';
      case 'section': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'project': return '#667eea';
      case 'skill': return '#10b981';
      case 'section': return '#f59e0b';
      default: return '#ffffff';
    }
  }};
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ open: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem;
    transform: ${props => props.open ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.open ? 1 : 0};
    visibility: ${props => props.open ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
  }
`;

const MobileMenuItem = styled.a`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  transition: color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #667eea;
  }
`;

// Navigation items data
const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: '🏠' },
  { id: 'about', label: 'About', href: '#about', icon: '👤' },
  { id: 'skills', label: 'Skills', href: '#skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', href: '#projects', icon: '💼' },
  { id: 'contact', label: 'Contact', href: '#contact', icon: '📧' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/kaitran225', icon: '💻', external: true },
];

// Sample search data - in real app, this would come from your data layer
const searchData: SearchResult[] = [
  {
    id: 'calantha',
    title: 'Calantha Interactive Platform',
    description: 'Full-stack web application with real-time video processing',
    type: 'project',
    href: '#projects',
    relevance: 100
  },
  {
    id: 'cybria',
    title: 'Cybria AI Assistant',
    description: 'AI-powered chatbot with 3D avatar and voice synthesis',
    type: 'project',
    href: '#projects',
    relevance: 95
  },
  {
    id: 'react-skill',
    title: 'React Development',
    description: '95% proficiency in React.js and modern hooks',
    type: 'skill',
    href: '#skills',
    relevance: 90
  },
  {
    id: 'typescript-skill',
    title: 'TypeScript',
    description: '90% proficiency in TypeScript development',
    type: 'skill',
    href: '#skills',
    relevance: 88
  },
  {
    id: 'contact-section',
    title: 'Contact Information',
    description: 'Get in touch for OJT opportunities and collaborations',
    type: 'section',
    href: '#contact',
    relevance: 85
  }
];

// Component
const EnhancedNavigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.filter(item => !item.external);
      let current = 'home';

      for (const section of sections) {
        const element = document.querySelector(section.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            current = section.id;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search functionality
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchData
      .filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }, [searchQuery]);

  useEffect(() => {
    setSearchResults(filteredResults);
    setShowResults(searchExpanded && filteredResults.length > 0);
  }, [filteredResults, searchExpanded]);

  const handleSearchToggle = useCallback(() => {
    setSearchExpanded(prev => !prev);
    if (!searchExpanded) {
      setTimeout(() => {
        const input = document.querySelector('#search-input') as HTMLInputElement;
        input?.focus();
      }, 300);
    } else {
      setSearchQuery('');
      setShowResults(false);
    }
  }, [searchExpanded]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchResultClick = useCallback((result: SearchResult) => {
    setSearchExpanded(false);
    setSearchQuery('');
    setShowResults(false);
    
    // Navigate to result
    if (result.href.startsWith('#')) {
      const element = document.querySelector(result.href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(result.href, '_blank');
    }
  }, []);

  const handleNavClick = useCallback((href: string, external?: boolean) => {
    setMobileMenuOpen(false);
    
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <NavigationWrapper scrolled={scrolled}>
      <NavigationContainer>
        <Logo onClick={() => handleNavClick('#home')}>
          KT
        </Logo>

        <NavigationItems>
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.id}
              href={item.href}
              active={activeSection === item.id}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, item.external);
              }}
            >
              {item.label}
            </NavigationLink>
          ))}
        </NavigationItems>

        <SearchContainer>
          <SearchInputWrapper expanded={searchExpanded}>
            <SearchInput
              id="search-input"
              type="text"
              placeholder="Search projects, skills..."
              value={searchQuery}
              onChange={handleSearchChange}
              expanded={searchExpanded}
            />
            <SearchButton onClick={handleSearchToggle}>
              {searchExpanded ? '✕' : '🔍'}
            </SearchButton>
          </SearchInputWrapper>

          <SearchResults visible={showResults}>
            {searchResults.map((result) => (
              <SearchResultItem
                key={result.id}
                onClick={() => handleSearchResultClick(result)}
              >
                <SearchResultTitle>{result.title}</SearchResultTitle>
                <SearchResultDescription>{result.description}</SearchResultDescription>
                <SearchResultType type={result.type}>{result.type}</SearchResultType>
              </SearchResultItem>
            ))}
          </SearchResults>
        </SearchContainer>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>

        <MobileMenu open={mobileMenuOpen}>
          {navigationItems.map((item) => (
            <MobileMenuItem
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, item.external);
              }}
            >
              {item.icon} {item.label}
            </MobileMenuItem>
          ))}
        </MobileMenu>
      </NavigationContainer>
    </NavigationWrapper>
  );
};

export default EnhancedNavigation;
