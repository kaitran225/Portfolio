import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const header = document.querySelector('[data-header="design-project-header"]') as HTMLElement;
      
      if (header && headerHeight === 0) {
        setHeaderHeight(header.offsetHeight);
      }
      
      // Navigation becomes sticky when header is fully scrolled past
      setIsScrolled(scrollTop >= headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
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
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
          style={{ '--tab-index': 0 } as React.CSSProperties}
        >
          🎨 Overview
        </Tab>
        <Tab 
          active={activeTab === 'process'} 
          onClick={() => setActiveTab('process')}
          style={{ '--tab-index': 1 } as React.CSSProperties}
        >
          🧠 Thought Process
        </Tab>
        <Tab 
          active={activeTab === 'typography'} 
          onClick={() => setActiveTab('typography')}
          style={{ '--tab-index': 2 } as React.CSSProperties}
        >
          🔤 Typography & Colors
        </Tab>
        <Tab 
          active={activeTab === 'mockups'} 
          onClick={() => setActiveTab('mockups')}
          style={{ '--tab-index': 3 } as React.CSSProperties}
        >
          📱 Applications
        </Tab>
      </TabNavigation>

      {/* Content Sections */}
      <ContentContainer $navHeight={isScrolled ? 70 : 0}>
        {activeTab === 'overview' && (
          <OverviewSection>
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
                    active={selectedImageCategory === 'final'}
                    onClick={() => {
                      setSelectedImageCategory('final');
                      setSelectedImage(0);
                    }}
                  >
                    Final Designs
                  </CategoryTab>
                  <CategoryTab 
                    active={selectedImageCategory === 'process'}
                    onClick={() => {
                      setSelectedImageCategory('process');
                      setSelectedImage(0);
                    }}
                  >
                    Process Work
                  </CategoryTab>
                  <CategoryTab 
                    active={selectedImageCategory === 'mockups'}
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
                    active={index === selectedImage}
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
          <ProcessSection>
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
          <TypographySection>
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
          <MockupsSection>
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
      </ContentContainer>
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

const ProjectContainer = styled.div`
  min-height: 100vh;
  background: var(--color-black-primary);
  color: var(--color-text-primary);
`;

const ProjectHeader = styled.header`
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-purple-primary) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, var(--color-purple-primary)25, transparent 50%),
                radial-gradient(circle at 70% 30%, var(--color-green-primary)20, transparent 40%);
    opacity: 0.15;
    z-index: 1;
  }
`;

const BackButton = styled.button`
  background: var(--color-black-secondary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-purple-primary);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  z-index: 2;
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--color-purple-primary)30;
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
  margin-bottom: 10px;
  background: linear-gradient(45deg, var(--color-purple-primary), var(--color-green-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProjectCategory = styled.h2`
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
  font-weight: 400;
  position: relative;
  z-index: 2;
`;

const ProjectDescription = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 800px;
  position: relative;
  z-index: 2;
`;

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ToolTag = styled.span`
  background: var(--color-purple-secondary);
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--color-purple-primary);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-1px);
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

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'var(--color-purple-primary)' : 'transparent'};
  color: var(--color-text-primary);
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 3px solid ${props => props.active ? 'var(--color-green-primary)' : 'transparent'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active ? 'var(--color-purple-primary)' : 'var(--color-purple-secondary)'};
    border-bottom-color: ${props => props.active ? 'var(--color-green-primary)' : 'var(--color-green-secondary)'};
    transform: translateY(-1px);
  }
  
  /* Sliver bar shimmer effect */
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

const ContentContainer = styled.div<ContentContainerProps>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  min-height: calc(100vh - ${props => props.$navHeight}px);
  
  ${props => props.$navHeight > 0 && `
    padding-top: ${props.$navHeight + 20}px;
  `}
`;

const OverviewSection = styled.div``;
const ProcessSection = styled.div``;
const TypographySection = styled.div``;
const MockupsSection = styled.div``;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: white;
`;

const LongDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
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

const CategoryTab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#ff6b6b' : 'white'};
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

const Thumbnail = styled.div<{ active: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${props => props.active ? 'white' : 'transparent'};
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
`;

const ProcessCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ProcessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
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
`;

const MockupCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 15px;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

export default DesignProjectPage;
