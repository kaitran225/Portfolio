import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';
import ContactSection from '../../contact/components/ContactSection'; // Using the dev contact section
import BackToTop from '../../../components/common/BackToTop';
import HeroSection from '../../landing/components/HeroSection';
import CategoryFilter from '../../projects/components/CategoryFilter';
import ProjectGrid from '../../projects/components/ProjectGrid';
import RedirectSection from '../../../components/ui/RedirectSection';
import { useTheme } from '../../../contexts/ThemeContext';

// Vanta.js topology effect
declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

const DesignLandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'branding' | 'ui-ux' | 'print'>('all');
  const { isDark } = useTheme();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Get data from service
  const projects = portfolioDataService.getDesignProjects();

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => {
        if (selectedCategory === 'branding') return project.tags.some(tag => tag.includes('Brand') || tag.includes('Logo'));
        if (selectedCategory === 'ui-ux') return project.tags.some(tag => tag.includes('UI') || tag.includes('UX') || tag.includes('Mobile'));
        if (selectedCategory === 'print') return project.tags.some(tag => tag.includes('Print') || tag.includes('Package'));
        return true;
      });

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
            color: 0xff6b6b, // Design-specific coral color
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

  return (
    <LandingContainer ref={vantaRef}>
      {/* Hero Section */}
      <HeroSection isDesign={true} />

      {/* Design Portfolio Section */}
      <Section id="projects">
        <SectionHeader>Design Portfolio</SectionHeader>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={(category: string) => setSelectedCategory(category as any)}
          isDevelopment={false}
          projects={projects}
        />

        {/* Project Grid */}
        <ProjectGrid projects={filteredProjects} isDevelopment={false} />
      </Section>

      {/* Enhanced Contact Section */}
      <ContactSection />

      {/* Dev Portfolio Redirect */}
      <RedirectSection isDevelopment={false} />

      {/* Back to Top Button */}
      <BackToTop />
    </LandingContainer>
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

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionHeader = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 60px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-design-primary) 0%, var(--color-design-primary) 50%, var(--color-design-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export default DesignLandingPage;
