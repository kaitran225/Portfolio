import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { ContactFormProvider, useContactForm } from '../../contexts/ContactFormContext';
import Header from './Header';
import Footer from './Footer';

// Lazy load the contact form
const ProfessionalContactForm = React.lazy(() => import('../../features/contact/components/ProfessionalContactForm'));

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const { showContactForm, closeContactForm } = useContactForm();

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  };

  return (
    <LayoutContainer>
      <Header />
      <MainContent>
          <FloatingProgLangs>
              <ProgLangElement delay={0} size="large">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
              </ProgLangElement>
              <ProgLangElement delay={1.5} size="medium">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" />
              </ProgLangElement>
              <ProgLangElement delay={3} size="small">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
              </ProgLangElement>
              <ProgLangElement delay={2} size="medium">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring" />
              </ProgLangElement>
              <ProgLangElement delay={4} size="large">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />
              </ProgLangElement>
              <ProgLangElement delay={0.5} size="small">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />
              </ProgLangElement>
              <ProgLangElement delay={3.5} size="medium">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />
              </ProgLangElement>
              <ProgLangElement delay={1} size="small">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" />
              </ProgLangElement>
            </FloatingProgLangs>

        {children}
      </MainContent>
      <Footer />
      
      {/* Global Contact Form Modal - Covers entire site */}
      <AnimatePresence mode="wait">
        {showContactForm && (
          <Suspense fallback={null}>
            <ProfessionalContactForm 
              onSubmit={handleFormSubmit}
              onClose={closeContactForm}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </LayoutContainer>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ContactFormProvider>
      <LayoutContent>{children}</LayoutContent>
    </ContactFormProvider>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  background: transparent;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

// Floating programming languages for development version
const progLangFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-30px) translateX(15px) rotate(5deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-60px) translateX(-10px) rotate(-5deg);
    opacity: 0.7;
  }
  75% {
    transform: translateY(-30px) translateX(20px) rotate(3deg);
    opacity: 0.9;
  }
`;

const FloatingProgLangs = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const ProgLangElement = styled.div<{ delay: number; size: 'small' | 'medium' | 'large' }>`
  position: absolute;
  animation: ${progLangFloat} ${props => 8 + (props.delay * 2)}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  user-select: none;
  pointer-events: none;
  
  img {
    width: ${props => {
      switch(props.size) {
        case 'small': return '40px';
        case 'medium': return '60px';
        case 'large': return '80px';
        default: return '60px';
      }
    }};
    height: ${props => {
      switch(props.size) {
        case 'small': return '40px';
        case 'medium': return '60px';
        case 'large': return '80px';
        default: return '60px';
      }
    }};
    opacity: 0.7;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1;
    }
  }
  
  &:nth-child(1) { top: 15%; left: 8%; }
  &:nth-child(2) { top: 85%; left: 55%; }
  &:nth-child(3) { top: 15%; left: 50%; }
  &:nth-child(4) { top: 60%; left: 90%; }
  &:nth-child(5) { top: 75%; left: 10%; }
  &:nth-child(6) { top: 35%; left: 88%; }
  &:nth-child(7) { top: 80%; left: 85%; }
  &:nth-child(8) { top: 10%; left: 75%; }
  &:nth-child(9) { top: 50%; left: 50%; }
  &:nth-child(10) { top: 20%; left: 92%; }
  
  @media (max-width: 768px) {
    img {
      width: ${props => {
        switch(props.size) {
          case 'small': return '30px';
          case 'medium': return '45px';
          case 'large': return '60px';
          default: return '45px';
        }
      }};
      height: ${props => {
        switch(props.size) {
          case 'small': return '30px';
          case 'medium': return '45px';
          case 'large': return '60px';
          default: return '45px';
        }
      }};
    }
  }
`;


export default Layout;
