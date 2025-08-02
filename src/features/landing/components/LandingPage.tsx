import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';
import EnhancedSkillsVisualization from '../../skills/components/SkillsVisualization';
import ContactSection from '../../contact/components/ContactSection';
import BackToTop from '../../../components/common/BackToTop';
import HeroSection from './HeroSection';
import FeaturedSection from './FeaturedSection';
import CategoryFilter from '../../projects/components/CategoryFilter';
import ProjectGrid from '../../projects/components/ProjectGrid';
import { useTheme } from '../../../contexts/ThemeContext';

// Vanta.js topology effect
declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

const LandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'development' | 'design' | 'backend'>('all');
  const { isDark } = useTheme();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Get data from service
  const projects = portfolioDataService.getAllProjects();

  useEffect(() => {
    const loadVanta = async () => {
      try {

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
              resolve(); // Don't reject, just continue with fallback
            };
            document.head.appendChild(script);

            // Timeout to prevent blocking
            setTimeout(() => {
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
          console.log('Initializing optimized Vanta TOPOLOGY effect...');

          vantaEffect.current = window.VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.5, // Reduced scale
            scaleMobile: 0.6, // More reduced for mobile
            color: 0x6933ff,
            backgroundColor: isDark ? 0x0a0a0a : 0xffffff,
            points: window.innerWidth < 768 ? 6 : 12, // Significantly fewer points
            maxDistance: window.innerWidth < 768 ? 20 : 32, // Shorter connections
            spacing: window.innerWidth < 768 ? 16 : 64, // More spacing between points
            backgroundAlpha: 0.8 // Add transparency to reduce visual density
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

          console.log('Vanta effect initialized successfully');

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

  return (
    <>
      {/* Main Portfolio Container */}
      <LandingContainer ref={vantaRef}>
        {/* Hero Section with Featured Projects */}
        <HeroSection isDevelopment={true} />

        {/* Featured Development Projects Section */}
        <FeaturedSectionWrapper>
          <FeaturedSection isDevelopment={true} />
        </FeaturedSectionWrapper>

        {/* Development Project Catalog */}
        <Section id="projects">
          <SectionHeaderWrapper>
            <SectionHeader>Development Portfolio</SectionHeader>
            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={(category: string) => setSelectedCategory(category as any)}
              isDevelopment={true}
              projects={projects}
            />
          </SectionHeaderWrapper>

          {/* Project Grid */}
          <ProjectGrid
            projects={projects.filter(project => project.category === 'development')}
            isDevelopment={true}
          />
        </Section>

        {/* Enhanced Skills Section */}
        <EnhancedSkillsVisualization />

        {/* Enhanced Contact Section (includes availability status) */}
        <ContactSection />
      </LandingContainer>

      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
};

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  color: var(--color-text-primary);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  
  /* Smooth page load animation */
  opacity: 0;
  animation: pageLoadIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
  
  @keyframes pageLoadIn {
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

const FeaturedSectionWrapper = styled.div`
  padding: 2rem 1.5rem;
`;

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionHeaderWrapper = styled.div`
  margin-bottom: 2rem;;
  text-align: center;
  backdrop-filter: blur(10px);
  background: var(--background-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  border: 1px solid var(--border-color);
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const SectionHeader = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 60px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export default LandingPage;
