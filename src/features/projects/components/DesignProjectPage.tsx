import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'typography' | 'mockups' | 'videos'>('overview');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'final' | 'process' | 'mockups' | 'videos'>('final');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tabKey, setTabKey] = useState(0); // Force re-render for animations

  // Fullscreen modal state
  const [fullscreenMedia, setFullscreenMedia] = useState<{ src: string; type: 'image' | 'video' } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const { isDark } = useTheme();

  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Initialize Vanta.js topology background
  useEffect(() => {
    const loadVanta = async () => {
      try {
        console.log('Starting optimized Vanta.js loading for Design...');

        // Create fallback background immediately with design colors
        if (vantaRef.current) {
          vantaRef.current.style.background = `
                  radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 60%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)
                `;
        }

        // Load scripts asynchronously and non-blocking
        const loadScript = (src: string, name: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.onload = () => {
              console.log(`${name} loaded successfully`);
              resolve();
            };
            script.onerror = () => {
              console.warn(`Failed to load ${name}, using fallback`);
              resolve(); // Don't reject, just continue with fallback
            };
            document.head.appendChild(script);

            // Timeout to prevent blocking
            setTimeout(() => {
              console.warn(`${name} load timeout, using fallback`);
              resolve();
            }, 5000);
          });
        };

        // Load p5.js only if not already loaded
        if (!window.p5) {
          await loadScript('https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js', 'p5.js');
        }

        // Load Vanta.js only if not already loaded
        if (!window.VANTA) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js', 'Vanta.js');
        }

        // Small delay to ensure scripts are initialized
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize Vanta effect only if everything loaded successfully
        if (window.VANTA && window.VANTA.TOPOLOGY && vantaRef.current && !vantaEffect.current) {
          console.log('Initializing optimized Vanta TOPOLOGY effect for Design...');

          vantaEffect.current = window.VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 0.8, // Reduce complexity on mobile
            color: 0x6933ff, // Design-specific blue color
            backgroundColor: isDark ? 0x0a0a0a : 0xffffff,
            points: window.innerWidth < 768 ? 8 : 10, // Fewer points on mobile
            maxDistance: window.innerWidth < 768 ? 15 : 20,
            spacing: window.innerWidth < 768 ? 12 : 15
          });
          setTimeout(() => {
            if (vantaEffect.current?.scene) {
              vantaEffect.current.scene.traverse((child: { type: string; material: { linewidth: number; }; }) => {
                if (child.type === "LineSegments" && child.material) {
                  child.material.linewidth = 10;
                }
              });
            }
          }, 100);
          console.log('Vanta effect initialized successfully for Design');

          // Clear fallback background once Vanta is loaded
          if (vantaRef.current) {
            vantaRef.current.style.background = '';
          }
        } else {
          console.log('Using fallback background (Vanta not available)');
        }
      } catch (error) {
        console.warn('Error in Vanta loading, using fallback:', error);
        // Fallback is already set above
      }
    };

    // Use requestIdleCallback for non-critical loading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loadVanta());
    } else {
      // Delay loading to not block initial render
      setTimeout(loadVanta, 1000);
    }

    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          console.warn('Error destroying Vanta effect:', e);
        }
        vantaEffect.current = null;
      }
    };
  }, [isDark]);

  // Enhanced tab switching with transition
  const handleTabSwitch = (newTab: 'overview' | 'process' | 'typography' | 'mockups' | 'videos') => {
    if (newTab === activeTab) return;

    setIsTransitioning(true);

    // Smooth transition timing with better feel
    setTimeout(() => {
      setActiveTab(newTab);
      setTabKey(prev => prev + 1); // Force animation restart

      setTimeout(() => {
        setIsTransitioning(false);
        resizeVantaCanvas(); // Resize Vanta canvas after transition
      }, 200);
    }, 200);
  };

  // Fullscreen modal handlers
  const openFullscreen = (src: string, type: 'image' | 'video') => {
    setFullscreenMedia({ src, type });
    setZoomLevel(1); // Reset zoom when opening
    setPanPosition({ x: 0, y: 0 }); // Reset pan when opening
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
    setZoomLevel(1); // Reset zoom when closing
    setPanPosition({ x: 0, y: 0 }); // Reset pan when closing
    setIsPanning(false); // Stop panning when closing
  };

  // Mouse and keyboard event handlers for fullscreen modal
  const handleWheel = (e: React.WheelEvent) => {
    if (!fullscreenMedia || fullscreenMedia.type === 'video') return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!fullscreenMedia || fullscreenMedia.type === 'video') return;
    if (e.button === 1 || (e.button === 0 && zoomLevel > 1)) { // Middle click or left click when zoomed
      e.preventDefault();
      setIsPanning(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !fullscreenMedia || fullscreenMedia.type === 'video') return;

    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;

    setPanPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (!fullscreenMedia || fullscreenMedia.type === 'video') return;
    e.stopPropagation();
    setZoomLevel(prev => prev === 1 ? 2 : 1);
    setPanPosition({ x: 0, y: 0 }); // Reset pan when toggling zoom
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Keyboard shortcuts for fullscreen modal
  useEffect(() => {
    if (!fullscreenMedia) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenMedia || fullscreenMedia.type === 'video') return;

      const step = 50;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setPanPosition(prev => ({ ...prev, x: prev.x + step }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPanPosition(prev => ({ ...prev, x: prev.x - step }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setPanPosition(prev => ({ ...prev, y: prev.y + step }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPanPosition(prev => ({ ...prev, y: prev.y - step }));
          break;
      }
    };

    const handleGlobalMouseUp = () => {
      setIsPanning(false);
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [fullscreenMedia, zoomLevel]);

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


  // Function to resize Vanta.js canvas
  const resizeVantaCanvas = () => {
    if (vantaEffect.current && vantaEffect.current.resize) {
      try {
        vantaEffect.current.resize();
      } catch (e) {
        // Some Vanta.js builds may not have resize, fallback to manual size update
        if (vantaEffect.current.el) {
          vantaEffect.current.el.style.width = '100%';
          vantaEffect.current.el.style.height = `${vantaRef.current?.offsetHeight || window.innerHeight}px`;
        }
      }
    }
  };

  // Get design project data from service based on projectId
  const serviceData = portfolioDataService.getProjectById(projectId);
  const designProjects = portfolioDataService.getDesignProjects();
  const fallbackProject = designProjects[0];

  // Use real data from service or fallback to first design project
  const realProjectData = serviceData || fallbackProject;

  // Transform service data to match DesignProjectData interface
  const projectData: DesignProjectData = {
    id: realProjectData?.id || 'unknown',
    title: realProjectData?.title || 'Design Project',
    category: realProjectData?.category || 'Design',
    description: realProjectData?.description || '',
    longDescription: realProjectData?.longDescription || realProjectData?.description || '',
    client: realProjectData?.client || 'Client',
    year: realProjectData?.year || new Date().getFullYear().toString(),
    role: realProjectData?.role || 'Designer',
    tools: realProjectData?.tools || ['Adobe Creative Suite'],
    images: {
      final: Array.isArray(realProjectData?.images)
        ? realProjectData.images.filter(img => img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.webp'))
        : realProjectData?.images?.final || [],
      process: Array.isArray(realProjectData?.images)
        ? []
        : realProjectData?.images?.process || [],
      mockups: Array.isArray(realProjectData?.images)
        ? []
        : realProjectData?.images?.mockups || []
    },
    colorPalette: ['#1A1A1A', '#F5F5F5', '#D4B996', '#8B4513', '#FFE4E1'],
    typography: {
      primary: 'Playfair Display',
      secondary: 'Source Sans Pro',
      body: 'Inter'
    },
    thoughtProcess: {
      problem: 'Design challenge that needed to be solved through creative problem-solving and user-centered design approach.',
      solution: 'Comprehensive design solution that addresses user needs and business objectives.',
      approach: 'Systematic design methodology combining research, ideation, prototyping, and testing.',
      outcome: 'Successful design implementation that achieves project goals and delivers value.'
    },
    achievements: realProjectData?.features || [
      'Successful project completion',
      'Enhanced user experience',
      'Improved brand recognition',
      'Positive client feedback'
    ]
  };

  // Helper to get images array (handle both string[] and object with arrays)
  const getProjectImages = () => {
    if (!projectData.images) return [];
    if (Array.isArray(projectData.images)) {
      // Filter only image files (no videos)
      return projectData.images.filter(image =>
        image.endsWith('.jpg') ||
        image.endsWith('.jpeg') ||
        image.endsWith('.png') ||
        image.endsWith('.webp') ||
        image.endsWith('.gif')
      );
    }
    // If it's an object, combine all image arrays (design projects)
    const { final = [], process = [], mockups = [] } = projectData.images;
    return [...final, ...process, ...mockups].filter(image =>
      image.endsWith('.jpg') ||
      image.endsWith('.jpeg') ||
      image.endsWith('.png') ||
      image.endsWith('.webp') ||
      image.endsWith('.gif')
    );
  };

  // Helper to get videos array
  const getProjectVideos = () => {
    if (!projectData.images) return [];
    let videos = [];

    if (Array.isArray(projectData.images)) {
      // Filter only video files
      videos = projectData.images.filter(image =>
        image.endsWith('.mp4') ||
        image.endsWith('.webm') ||
        image.endsWith('.mov')
      );
    } else {
      // If it's an object, combine all arrays and filter videos
      const { final = [], process = [], mockups = [] } = projectData.images;
      videos = [...final, ...process, ...mockups].filter(image =>
        image.endsWith('.mp4') ||
        image.endsWith('.webm') ||
        image.endsWith('.mov')

      );
    }
    return videos;
  };

  const projectImages = getProjectImages();
  const projectVideos = getProjectVideos();

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
        <Tab
          $active={activeTab === 'videos'}
          onClick={() => handleTabSwitch('videos')}
          style={{ '--tab-index': 4 } as React.CSSProperties}
        >
          🎥 Videos
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
                  {projectImages.length > 0 && (
                    <>
                      <MainImage>
                        <div style={{
                          position: 'relative',
                          cursor: 'zoom-in',
                          border: '2px solid transparent'
                        }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openFullscreen(projectImages[selectedImage], 'image');
                          }}
                          onMouseEnter={() => { }}
                        >
                          <img
                            src={projectImages[selectedImage]}
                            alt={`${projectData.title} screenshot ${selectedImage + 1}`}
                            style={{ pointerEvents: 'none' }}
                          />
                          <ZoomIndicator>🔍 Click to zoom</ZoomIndicator>
                        </div>
                      </MainImage>
                      <ImageThumbnails>
                        {projectImages.map((image: string, index: number) => (
                          <Thumbnail
                            key={index}
                            $active={index === selectedImage}
                            onClick={() => setSelectedImage(index)}
                            onDoubleClick={() => openFullscreen(image, 'image')}
                            title="Click to select, double-click to fullscreen"
                          >
                            <img src={image} alt={`Thumbnail ${index + 1}`} />
                          </Thumbnail>
                        ))}
                      </ImageThumbnails>
                    </>
                  )}
                  
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
                        <div style={{
                          position: 'relative',
                          cursor: 'zoom-in'
                        }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openFullscreen(image, 'image');
                          }}
                        >
                          <img src={image} alt={`Process step ${index + 1}`} style={{ pointerEvents: 'none' }} />
                          <ZoomIndicator>🔍 Click to zoom</ZoomIndicator>
                        </div>
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
                      <div style={{
                        position: 'relative',
                        cursor: 'zoom-in'
                      }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openFullscreen(mockup, 'image');
                        }}
                      >
                        <img src={mockup} alt={`Brand application ${index + 1}`} style={{ pointerEvents: 'none' }} />
                        <ZoomIndicator>🔍 Click to zoom</ZoomIndicator>
                      </div>
                    </MockupCard>
                  ))}
                </MockupGrid>
              </MockupsSection>
            )}

            {projectVideos.length > 0 && activeTab === 'videos' ? (
                  <VideoGallery>
                    {projectVideos.map((video, index) => (
                      <VideoDemo key={index}>
                        <div style={{ position: 'relative' }}>
                          <video
                            controls
                            width="100%"
                            autoPlay
                            muted
                            loop
                            style={{ borderRadius: '8px' }}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openFullscreen(video, 'video');
                            }}
                          >
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <ZoomIndicator style={{ opacity: 1 }}>🔍 Double-click for fullscreen</ZoomIndicator>
                        </div>
                       
                      </VideoDemo>
                    ))}
                  </VideoGallery>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No demo videos available for this project.
                  </p>
                )}
          </ContentTransition>
        </ContentContainer>
      </ContentBGContainer>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={!!fullscreenMedia}
        onClick={closeFullscreen}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        {fullscreenMedia && (
          <FullscreenContent
            zoom={zoomLevel}
            panX={panPosition.x}
            panY={panPosition.y}
            isPanning={isPanning}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
          >
            <CloseButton onClick={closeFullscreen}>×</CloseButton>
            <ZoomInfo>
              {Math.round(zoomLevel * 100)}%
              {fullscreenMedia.type === 'image' && zoomLevel > 1 && ' • Middle-click + drag or ← → ↑ ↓ to pan'}
              {fullscreenMedia.type === 'image' && zoomLevel === 1 && ' • Click to zoom • Scroll to zoom'}
              {fullscreenMedia.type === 'video' && ' • Scroll to zoom'}
            </ZoomInfo>
            {fullscreenMedia.type === 'video' ? (
              <video
                controls
                autoPlay
                muted
                loop
                src={fullscreenMedia.src}
              />
            ) : (
              <img
                src={fullscreenMedia.src}
                alt="Fullscreen view"
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
                draggable={false}
              />
            )}
          </FullscreenContent>
        )}
      </FullscreenModal>
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
  background: var(--bg-primary);
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
const VideoGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const VideoDemo = styled.div`
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  video {
    border-radius: 8px;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover video {
    transform: scale(1.02);
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
  background: var(--bg-secondary);
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
  color: var(--color-text-secondary);
  font-weight: 600;
`;

const MetaValue = styled.span`
  color: var(--color-text-primary);
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
  min-height: unset;
  transition: padding-top 0.3s ease;
  position: relative;
  z-index: 1; /* Above Vanta background but below content */

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
  max-width: 1400px;
  margin: 0 auto;
    backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 0.5px solid var(--color-purple-secondary);
  color: var(--color-text-primary);
  padding: 60px 80px;
  
  ${props => props.$navHeight > 0 && `
    padding-top: ${props.$navHeight + 20}px;
  `}
`;

const ContentTransition = styled.div<ContentTransitionProps>`
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center;
  
  ${props => props.$isTransitioning && `
    opacity: 0.3;
    transform: translateY(20px) scale(0.98);
    filter: blur(3px);
  `}
  
  /* Enhanced particle effect overlay during transitions */
  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    opacity: ${props => props.$isTransitioning ? '0.4' : '0'};
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: -1;
    border-radius: 12px;
    animation: ${props => props.$isTransitioning ? 'particleFlow 1s ease-in-out infinite alternate' : 'none'};
  }
  
  @keyframes particleFlow {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    100% {
      transform: translateY(-5px) rotate(1deg);
    }
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
  animation: catalogSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 20px 0;
  
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
  animation: catalogFlipIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 20px 0;
  
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
  animation: catalogZoomReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 20px 0;
  
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
  margin-bottom: 80px;
  padding: 20px 0;
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Progressive reveal for sections */
  &:nth-child(even) {
    animation-delay: 0.1s;
  }
  
  &:nth-child(odd) {
    animation-delay: 0.2s;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: --color-text-primary;
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
  color: var(--color-text-primary);
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
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-primary)'};
  color: ${props => props.$active ? '#ff6b6b' : 'var(--color-text-secondary)'};
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-bg-muted);
    color: #ff6b6b;
  }
`;

const MainImage = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  min-width: 300px;
  max-width: 70%;
  min-height: 300px;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  video {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover img, &:hover video {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    min-height: 200px;
    max-height: 60vh;
  }
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: scroll;
  padding: 20px 0;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, var(--color-purple-secondary), var(--color-green-secondary));}
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  margin: 0 auto;
  border-radius: 6px;
  overflow: hidden;
  border: 3px solid ${props => props.$active ? 'var(--color-green-primary)' : 'transparent'};
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-purple-primary)30, var(--color-green-primary)30);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  img, video {
    width: 80px;
    height: 60px;
    object-fit: contain;
    background-color: rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    border-color: ${props => props.$active ? 'var(--color-green-primary)' : 'var(--color-purple-primary)'};
    transform: translateY(-2px) scale(1.05);
  }
  
  &:hover::before {
    opacity: 0.2;
  }
  
  &:hover img, &:hover video {
    transform: scale(1.1);
  }
  
  &:active {
    transform: translateY(0) scale(1);
    transition: all 0.1s ease;
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
  color: var(--color-text-primary);
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
  color: var(--color-text-primary);
`;

const ProcessDescription = styled.p`
  color: var(--color-text-secondary);
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
  color: var(--color-text-primary);
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
  color: var(--color-text-primary);
  font-size: 1rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const TypeExample = styled.div`
  color: var(--color-text-primary);
  margin-bottom: 15px;
`;

const TypeDescription = styled.p`
  color: var(--color-text-secondary);
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

// Fullscreen Modal Components
const FullscreenModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
  cursor: zoom-out;
  overflow: auto;
`;

const FullscreenContent = styled.div<{
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
}>`
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  transform: scale(${props => props.zoom}) translate(${props => props.panX}px, ${props => props.panY}px);
  transition: ${props => props.isPanning ? 'none' : 'transform 0.3s ease'};
  cursor: ${props => props.isPanning ? 'grabbing' : 'grab'};
  
  img, video {
    max-width: 100%;
    max-height: 95vh;
    object-fit: contain;
    border-radius: 8px;
    user-select: none;
  }
  
  video {
    cursor: default;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ZoomInfo = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
  }
`;

const ZoomIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  
  ${ProcessImage}:hover &,
  ${MockupCard}:hover &,
  ${MainImage}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 8px;
  }
`;

export default DesignProjectPage;
