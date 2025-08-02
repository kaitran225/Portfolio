import React, { Suspense } from 'react';
import styled from 'styled-components';
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

export default Layout;
