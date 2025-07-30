import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Vanta.js topology effect
declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

interface DesignProjectProps {
  projectId: string;
}

interface DesignProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  client: string;
  year: string;
  role: string;
  tools: string[];
  images: {
    final: string[];
    process: string[];
    mockups: string[];
  };
  colorPalette: string[];
  typography: {
    primary: string;
    secondary: string;
    body: string;
  };
  thoughtProcess: {
    problem: string;
    solution: string;
    approach: string;
    outcome: string;
  };
  achievements: string[];
}

const DesignProjectPage: React.FC<DesignProjectProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'typography' | 'mockups'>('overview');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'final' | 'process' | 'mockups'>('final');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tabKey, setTabKey] = useState(0); // Force re-render for animations
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

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
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x00ff88, // Green primary (design theme)
            backgroundColor: 0x0a0a0a, // Dark background
            points: 8.00,
            maxDistance: 22.00,
            spacing: 16.00
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
            radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(105, 51, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)
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

  // Enhanced tab switching with transition
  const handleTabSwitch = (newTab: 'overview' | 'process' | 'typography' | 'mockups') => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Smooth transition timing
    setTimeout(() => {
      setActiveTab(newTab);
      setTabKey(prev => prev + 1); // Force animation restart
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 150);
  };

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const header = document.querySelector('[data-header="design-project-header"]') as HTMLElement;
      
      if (header && headerHeight === 0) {
        setHeaderHeight(header.offsetHeight);
      }
      
      // Calculate when navigation should become sticky
      const shouldBeSticky = scrollTop > headerHeight + 50; // Add some buffer
      setIsScrolled(shouldBeSticky);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [headerHeight]);

  // Dummy design project data - replace with real data based on projectId
  const projectData: DesignProjectData = {
    id: 'zena-brand-identity',
    title: 'Zena Fashion Brand Identity',
    category: 'Brand Identity Design',
    description: 'Complete brand identity design including logo, typography, and visual system for a modern fashion brand.',
    longDescription: `Zena is a contemporary fashion brand targeting young professionals who value both style and sustainability. The brand needed a complete visual identity that would communicate sophistication while maintaining approachability.

The design challenge was to create a brand identity that could work across various touchpoints - from digital platforms to physical packaging and retail spaces. The solution needed to be versatile, memorable, and aligned with the brand's core values of sustainability and modern elegance.

The final identity system includes a custom logotype, comprehensive color palette, typography system, and visual guidelines that ensure consistent brand application across all channels. The design successfully positioned Zena as a premium yet accessible fashion brand in the competitive market.`,
    client: 'Zena Fashion Co.',
    year: '2024',
    role: 'Lead Brand Designer',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Figma', 'Sketch'],
    images: {
      final: [
        '/assets/projects/zena/final-logo-variations.jpg',
        '/assets/projects/zena/brand-applications.jpg',
        '/assets/projects/zena/packaging-design.jpg',
        '/assets/projects/zena/website-mockup.jpg',
        '/assets/projects/zena/business-cards.jpg',
        '/assets/projects/zena/storefront-signage.jpg'
      ],
      process: [
        '/assets/projects/zena/initial-sketches.jpg',
        '/assets/projects/zena/concept-exploration.jpg',
        '/assets/projects/zena/logo-iterations.jpg',
        '/assets/projects/zena/color-exploration.jpg',
        '/assets/projects/zena/typography-testing.jpg',
        '/assets/projects/zena/brand-guidelines.jpg'
      ],
      mockups: [
        '/assets/projects/zena/mobile-app-mockup.jpg',
        '/assets/projects/zena/social-media-templates.jpg',
        '/assets/projects/zena/product-tags.jpg',
        '/assets/projects/zena/tote-bag-design.jpg',
        '/assets/projects/zena/email-templates.jpg',
        '/assets/projects/zena/billboard-mockup.jpg'
      ]
    },
    colorPalette: ['#1A1A1A', '#F5F5F5', '#D4B996', '#8B4513', '#FFE4E1'],
    typography: {
      primary: 'Playfair Display',
      secondary: 'Source Sans Pro',
      body: 'Inter'
    },
    thoughtProcess: {
      problem: 'Zena Fashion needed a sophisticated brand identity that would appeal to young professionals while communicating their commitment to sustainable fashion. The existing brand lacked cohesion and failed to differentiate from competitors.',
      solution: 'Developed a minimalist yet elegant brand identity system featuring a custom logotype, earthy color palette, and sophisticated typography that reflects both modernity and sustainability values.',
      approach: 'Started with extensive market research and competitor analysis. Created mood boards and brand personas. Developed multiple logo concepts and tested them across various applications. Refined the chosen direction based on stakeholder feedback.',
      outcome: 'The new brand identity successfully positioned Zena as a premium sustainable fashion brand. Brand recognition increased by 85% and social media engagement improved by 120% within the first quarter after launch.'
    },
    achievements: [
      'Brand recognition increased by 85% post-launch',
      'Social media engagement improved by 120%',
      'Won "Best Brand Identity" at 2024 Design Awards',
      'Featured in Design Week magazine',
      'Successful rollout across 15+ retail locations',
      'Client satisfaction score: 9.8/10'
    ]
  };

  const currentImages = projectData.images[selectedImageCategory];

  return (
    <ProjectContainer>
      {/* Header */}
      <ProjectHeader data-header="design-project-header">
        <BackButton onClick={() => window.history.back()}>
          ← Back to Projects
        </BackButton>
        <HeaderContent>
          <ProjectMeta>
            <MetaItem>
              <MetaLabel>Client:</MetaLabel>
              <MetaValue>{projectData.client}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Year:</MetaLabel>
              <MetaValue>{projectData.year}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Role:</MetaLabel>
              <MetaValue>{projectData.role}</MetaValue>
            </MetaItem>
          </ProjectMeta>
          <ProjectTitle>{projectData.title}</ProjectTitle>
          <ProjectCategory>{projectData.category}</ProjectCategory>
          <ProjectDescription>{projectData.description}</ProjectDescription>
          <ToolsList>
            {projectData.tools.map(tool => (
              <ToolTag key={tool}>{tool}</ToolTag>
            ))}
          </ToolsList>
        </HeaderContent>
      </ProjectHeader>

      {/* Navigation Tabs */}
      <TabNavigation $isSticky={isScrolled} data-sticky={isScrolled}>
        <Tab 
          $active={activeTab === 'overview'} 
          onClick={() => handleTabSwitch('overview')}
          style={{ '--tab-index': 0 } as React.CSSProperties}
        >
          🎨 Overview
        </Tab>
        <Tab 
          $active={activeTab === 'process'} 
          onClick={() => handleTabSwitch('process')}
          style={{ '--tab-index': 1 } as React.CSSProperties}
        >
          🧠 Thought Process
        </Tab>
        <Tab 
          $active={activeTab === 'typography'} 
          onClick={() => handleTabSwitch('typography')}
          style={{ '--tab-index': 2 } as React.CSSProperties}
        >
          🔤 Typography & Colors
        </Tab>
        <Tab 
          $active={activeTab === 'mockups'} 
          onClick={() => handleTabSwitch('mockups')}
          style={{ '--tab-index': 3 } as React.CSSProperties}
        >
          📱 Applications
        </Tab>
      </TabNavigation>

      {/* Content Sections */}
      <ContentBGContainer $navHeight={isScrolled ? 70 : 0} ref={vantaRef}>
        <ContentContainer $navHeight={isScrolled ? 70 : 0}>
          <ContentTransition $isTransitioning={isTransitioning}>
            {activeTab === 'overview' && (
            <OverviewSection key={`overview-${tabKey}`}>
              <Section>
                <SectionTitle>Project Overview</SectionTitle>
                <LongDescription>{projectData.longDescription}</LongDescription>
              </Section>

              {/* Image Gallery */}
              <ImageGallerySection>
              <GalleryHeader>
                <SectionTitle>Final Designs</SectionTitle>
                <ImageCategoryTabs>
                  <CategoryTab 
                    $active={selectedImageCategory === 'final'}
                    onClick={() => {
                      setSelectedImageCategory('final');
                      setSelectedImage(0);
                    }}
                  >
                    Final Designs
                  </CategoryTab>
                  <CategoryTab 
                    $active={selectedImageCategory === 'process'}
                    onClick={() => {
                      setSelectedImageCategory('process');
                      setSelectedImage(0);
                    }}
                  >
                    Process Work
                  </CategoryTab>
                  <CategoryTab 
                    $active={selectedImageCategory === 'mockups'}
                    onClick={() => {
                      setSelectedImageCategory('mockups');
                      setSelectedImage(0);
                    }}
                  >
                    Mockups
                  </CategoryTab>
                </ImageCategoryTabs>
              </GalleryHeader>

              <MainImage>
                <img 
                  src={currentImages[selectedImage]} 
                  alt={`${projectData.title} ${selectedImageCategory} ${selectedImage + 1}`}
                />
              </MainImage>
              
              <ImageThumbnails>
                {currentImages.map((image, index) => (
                  <Thumbnail 
                    key={index}
                    $active={index === selectedImage}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </Thumbnail>
                ))}
              </ImageThumbnails>
            </ImageGallerySection>

            {/* Achievements */}
            <Section>
              <SectionTitle>Project Achievements</SectionTitle>
              <AchievementsList>
                {projectData.achievements.map((achievement, index) => (
                  <AchievementItem key={index}>
                    🏆 {achievement}
                  </AchievementItem>
                ))}
              </AchievementsList>
            </Section>
          </OverviewSection>
        )}

        {activeTab === 'process' && (
          <ProcessSection key={`process-${tabKey}`}>
            <SectionTitle>Design Thinking Process</SectionTitle>
            
            <ProcessGrid>
              <ProcessCard>
                <ProcessIcon>🎯</ProcessIcon>
                <ProcessTitle>Problem</ProcessTitle>
                <ProcessDescription>{projectData.thoughtProcess.problem}</ProcessDescription>
              </ProcessCard>
              
              <ProcessCard>
                <ProcessIcon>💡</ProcessIcon>
                <ProcessTitle>Solution</ProcessTitle>
                <ProcessDescription>{projectData.thoughtProcess.solution}</ProcessDescription>
              </ProcessCard>
              
              <ProcessCard>
                <ProcessIcon>🛠️</ProcessIcon>
                <ProcessTitle>Approach</ProcessTitle>
                <ProcessDescription>{projectData.thoughtProcess.approach}</ProcessDescription>
              </ProcessCard>
              
              <ProcessCard>
                <ProcessIcon>🎉</ProcessIcon>
                <ProcessTitle>Outcome</ProcessTitle>
                <ProcessDescription>{projectData.thoughtProcess.outcome}</ProcessDescription>
              </ProcessCard>
            </ProcessGrid>

            {/* Process Images */}
            <Section>
              <SectionTitle>Process Documentation</SectionTitle>
              <ProcessImageGrid>
                {projectData.images.process.map((image, index) => (
                  <ProcessImage key={index}>
                    <img src={image} alt={`Process step ${index + 1}`} />
                  </ProcessImage>
                ))}
              </ProcessImageGrid>
            </Section>
          </ProcessSection>
        )}

        {activeTab === 'typography' && (
          <TypographySection key={`typography-${tabKey}`}>
            <Section>
              <SectionTitle>Color Palette</SectionTitle>
              <ColorPalette>
                {projectData.colorPalette.map((color, index) => (
                  <ColorSwatch key={index}>
                    <ColorCircle color={color} />
                    <ColorCode>{color}</ColorCode>
                  </ColorSwatch>
                ))}
              </ColorPalette>
            </Section>

            <Section>
              <SectionTitle>Typography System</SectionTitle>
              <TypographyShowcase>
                <TypeSample>
                  <TypeLabel>Primary Font - {projectData.typography.primary}</TypeLabel>
                  <TypeExample style={{ fontFamily: projectData.typography.primary, fontSize: '3rem', fontWeight: 'bold' }}>
                    Zena Fashion
                  </TypeExample>
                  <TypeDescription>Used for headlines, logo, and primary brand messaging</TypeDescription>
                </TypeSample>

                <TypeSample>
                  <TypeLabel>Secondary Font - {projectData.typography.secondary}</TypeLabel>
                  <TypeExample style={{ fontFamily: projectData.typography.secondary, fontSize: '2rem', fontWeight: '600' }}>
                    Modern Elegance
                  </TypeExample>
                  <TypeDescription>Used for subheadings and important secondary text</TypeDescription>
                </TypeSample>

                <TypeSample>
                  <TypeLabel>Body Font - {projectData.typography.body}</TypeLabel>
                  <TypeExample style={{ fontFamily: projectData.typography.body, fontSize: '1.2rem' }}>
                    This is the body text that provides excellent readability across all platforms and devices. It maintains clarity while supporting the overall brand aesthetic.
                  </TypeExample>
                  <TypeDescription>Used for body text, descriptions, and general content</TypeDescription>
                </TypeSample>
              </TypographyShowcase>
            </Section>
          </TypographySection>
        )}

        {activeTab === 'mockups' && (
          <MockupsSection key={`mockups-${tabKey}`}>
            <SectionTitle>Brand Applications</SectionTitle>
            <MockupGrid>
              {projectData.images.mockups.map((mockup, index) => (
                <MockupCard key={index}>
                  <img src={mockup} alt={`Brand application ${index + 1}`} />
                </MockupCard>
              ))}
            </MockupGrid>
          </MockupsSection>
        )}
        </ContentTransition>
      </ContentContainer>
      </ContentBGContainer>
    </ProjectContainer>
  );
};

// Styled Components
interface TabNavigationProps {
  $isSticky: boolean;
}

interface ContentContainerProps {
  $navHeight: number;
}

interface ContentTransitionProps {
  $isTransitioning: boolean;
}

const ProjectContainer = styled.div`
  min-height: 100vh;
  background: var(--color-black-primary);
  color: var(--color-text-primary);
  position: relative;
  
  /* Ensure Vanta.js background is behind content */
  /* Ensure Vanta.js background covers full content */
  & > canvas {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important; /* Will match container height */
    z-index: -10 !important; /* Further behind */
    pointer-events: none !important; /* Prevent interaction blocking */
  }
`;

const ProjectHeader = styled.header`
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-green-primary) 100%);
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
  animation: headerSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes headerSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(0, 255, 136, 0.25) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(105, 51, 255, 0.20) 0%, transparent 40%);
    opacity: 0.15;
    z-index: 1;
    animation: backgroundPulse 4s ease-in-out infinite alternate;
  }
  
  @keyframes backgroundPulse {
    from { opacity: 0.15; }
    to { opacity: 0.25; }
  }
`;

const BackButton = styled.button`
  background: var(--color-black-secondary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-green-primary);
  padding: 12px 24px;
  border-radius: 8px;  /* Smaller corner radius */
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 600;
  position: relative;
  z-index: 2;
  overflow: hidden;
  animation: buttonSlideIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
  
  @keyframes buttonSlideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
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
    background: var(--color-green-primary);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 255, 136, 0.30);
    border-color: var(--color-purple-primary);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s ease;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MetaLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
`;

const MetaValue = styled.span`
  color: white;
  font-weight: 700;
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(45deg, var(--color-green-primary), var(--color-purple-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
  animation: titleReveal 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s both;
  
  @keyframes titleReveal {
    from {
      opacity: 0;
      transform: translateY(30px);
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
    bottom: -10px;
    left: 0;
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-green-primary), var(--color-purple-primary));
    animation: underlineGrow 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s forwards;
    border-radius: 2px;
  }
  
  @keyframes underlineGrow {
    from { width: 0; }
    to { width: 120px; }
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    
    &::after {
      @keyframes underlineGrow {
        to { width: 80px; }
      }
    }
  }
`;

const ProjectCategory = styled.h2`
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
  font-weight: 400;
  position: relative;
  z-index: 2;
  animation: categorySlideIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s both;
  
  @keyframes categorySlideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ProjectDescription = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 800px;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s both;
  
  @keyframes fadeInUp {
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

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  animation: toolsSlideIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.1s both;
  
  @keyframes toolsSlideIn {
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
    animation: toolTagFloat 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 1.2s; }
  & > *:nth-child(2) { animation-delay: 1.3s; }
  & > *:nth-child(3) { animation-delay: 1.4s; }
  & > *:nth-child(4) { animation-delay: 1.5s; }
  & > *:nth-child(5) { animation-delay: 1.6s; }
  & > *:nth-child(n+6) { animation-delay: 1.7s; }
  
  @keyframes toolTagFloat {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ToolTag = styled.span`
  background: var(--color-green-secondary);
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 6px;  /* Smaller corner radius */
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--color-green-primary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(0, 255, 136, 0.30) 0%, transparent 70%);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
  
  &:hover {
    background: var(--color-green-primary);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.40);
    border-color: var(--color-purple-primary);
  }
  
  &:hover::before {
    width: 200px;
    height: 200px;
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
    transition: all 0.1s ease;
  }
`;

const TabNavigation = styled.nav<TabNavigationProps>`
  background: rgba(0, 0, 0, 0.2);
  padding: 0 20px;
  display: flex;
  justify-content: center;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.$isSticky && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(105, 51, 255, 0.3);
    padding: 0 20px;
    height: 60px;
    
    /* Sliver bar animation */
    animation: slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    @keyframes slideInFromTop {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    /* Sliver bar glow effect */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent, 
        var(--color-purple-primary), 
        var(--color-green-primary), 
        var(--color-purple-primary), 
        transparent
      );
      animation: sliverGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes sliverGlow {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }
  `}
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'transparent'};
  color: var(--color-text-primary);
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 3px solid ${props => props.$active ? 'var(--color-green-primary)' : 'transparent'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--color-purple-secondary)'};
    border-bottom-color: ${props => props.$active ? 'var(--color-green-primary)' : 'var(--color-green-secondary)'};
    transform: translateY(-1px);
  }
  
  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Individual tab slide-in animation when nav becomes sticky */
  ${TabNavigation}[data-sticky="true"] & {
    padding: 12px 25px;
    font-size: 0.9rem;
    border-bottom-width: 2px;
    animation: tabSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation-delay: calc(var(--tab-index, 0) * 0.1s);
    animation-fill-mode: both;
    
    @keyframes tabSlideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
`;

const ContentBGContainer = styled.div<ContentContainerProps>`
  margin: 0 auto;
  padding: 60px 20px;
  max-height: 100vh;
  overflow-y: auto;
  transition: padding-top 0.3s ease;
  position: relative;
  z-index: 1; /* Above Vanta background but below content */

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--color-green-primary), var(--color-purple-primary));
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--color-purple-primary), var(--color-green-primary));
  }

  ${props => props.$navHeight > 0 && `
    padding-top: ${props.$navHeight + 20}px;
  `}
  
  @media (max-width: 768px) {
    padding: 40px 15px;
    
    ${props => props.$navHeight > 0 && `
      padding-top: ${props.$navHeight + 20}px;
    `}
  }
`;

const ContentContainer = styled.div<ContentContainerProps>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  
  ${props => props.$navHeight > 0 && `
    padding-top: ${props.$navHeight + 20}px;
  `}
`;

const ContentTransition = styled.div<ContentTransitionProps>`
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center;
  
  ${props => props.$isTransitioning && `
    opacity: 0.7;
    transform: translateY(10px) scale(0.99);
    filter: blur(1px);
  `}
  
  /* Particle effect overlay during transitions */
  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(105, 51, 255, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 60%);
    opacity: ${props => props.$isTransitioning ? '1' : '0'};
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: -1;
    border-radius: 12px;
  }
`;

const OverviewSection = styled.div`
  animation: catalogAppear 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes catalogAppear {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ProcessSection = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  animation: catalogSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Custom scrollbar for process section */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--color-green-primary), var(--color-purple-primary));
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--color-purple-primary), var(--color-green-primary));
  }
  
  @keyframes catalogSlideIn {
    from {
      opacity: 0;
      transform: translateX(-50px) rotateY(-15deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotateY(0);
    }
  }
`;

const TypographySection = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  animation: catalogFlipIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Custom scrollbar for typography section */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--color-green-primary), var(--color-purple-primary));
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--color-purple-primary), var(--color-green-primary));
  }
  
  @keyframes catalogFlipIn {
    from {
      opacity: 0;
      transform: rotateX(-20deg) translateY(30px);
    }
    to {
      opacity: 1;
      transform: rotateX(0) translateY(0);
    }
  }
`;

const MockupsSection = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  animation: catalogZoomReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Custom scrollbar for mockups section */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--color-green-primary), var(--color-purple-primary));
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--color-purple-primary), var(--color-green-primary));
  }
  
  @keyframes catalogZoomReveal {
    from {
      opacity: 0;
      transform: scale(1.1) rotateZ(-2deg);
      filter: blur(5px);
    }
    to {
      opacity: 1;
      transform: scale(1) rotateZ(0);
      filter: blur(0);
    }
  }
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: white;
  position: relative;
  animation: sectionTitleSlide 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes sectionTitleSlide {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    width: 4px;
    height: 0;
    background: linear-gradient(180deg, var(--color-green-primary), var(--color-purple-primary));
    transition: height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s;
    transform: translateY(-50%);
    border-radius: 2px;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const LongDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
  animation: descriptionFadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
  
  @keyframes descriptionFadeIn {
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

const ImageGallerySection = styled.div`
  margin-bottom: 60px;
`;

const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const ImageCategoryTabs = styled.div`
  display: flex;
  gap: 10px;
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#ff6b6b' : 'white'};
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    color: #ff6b6b;
  }
`;

const MainImage = styled.div`
  margin-bottom: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  img {
    width: 100%;
    height: 500px;
    object-fit: contain;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${props => props.$active ? 'white' : 'transparent'};
  transition: all 0.3s ease;
  
  img {
    width: 80px;
    height: 60px;
    object-fit: cover;
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const AchievementsList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const AchievementItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  /* Stagger children animations */
  & > * {
    animation: processCardSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 0.2s; }
  & > *:nth-child(2) { animation-delay: 0.4s; }
  & > *:nth-child(3) { animation-delay: 0.6s; }
  & > *:nth-child(4) { animation-delay: 0.8s; }
  
  @keyframes processCardSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ProcessCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 8px;  /* Smaller corner radius */
  text-align: center;
  border: 1px solid rgba(0, 255, 136, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(0, 255, 136, 0.1) 0%, 
      transparent 50%, 
      rgba(105, 51, 255, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 255, 136, 0.2);
    border-color: var(--color-green-primary);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:active {
    transform: translateY(-5px) scale(0.98);
    transition: all 0.1s ease;
  }
`;

const ProcessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  animation: iconBounce 2s ease-in-out infinite;
  
  @keyframes iconBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  /* Hover animation */
  ${ProcessCard}:hover & {
    animation: iconSpin 0.6s ease-in-out;
  }
  
  @keyframes iconSpin {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(360deg); }
  }
`;

const ProcessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
`;

const ProcessDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const ProcessImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ProcessImage = styled.div`
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ColorSwatch = styled.div`
  text-align: center;
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin: 0 auto 10px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ColorCode = styled.p`
  color: white;
  font-weight: 600;
  font-family: monospace;
`;

const TypographyShowcase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const TypeSample = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TypeLabel = styled.h4`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const TypeExample = styled.div`
  color: white;
  margin-bottom: 15px;
`;

const TypeDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const MockupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  
  /* Stagger children animations */
  & > * {
    animation: mockupCardReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.2s; }
  & > *:nth-child(3) { animation-delay: 0.3s; }
  & > *:nth-child(4) { animation-delay: 0.4s; }
  & > *:nth-child(5) { animation-delay: 0.5s; }
  & > *:nth-child(6) { animation-delay: 0.6s; }
  
  @keyframes mockupCardReveal {
    from {
      opacity: 0;
      transform: scale(0.9) rotateY(10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotateY(0deg);
    }
  }
`;

const MockupCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;  /* Smaller corner radius */
  border: 1px solid rgba(0, 255, 136, 0.2);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 136, 0.1) 50%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
    border-color: var(--color-green-primary);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 6px;  /* Smaller corner radius */
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    z-index: 2;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &:active {
    transform: translateY(-5px) scale(1.01);
    transition: all 0.1s ease;
  }
`;

export default DesignProjectPage;
