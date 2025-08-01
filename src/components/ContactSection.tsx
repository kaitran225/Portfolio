import React, { useCallback, lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';

// Lazy load heavy components for instant loading
const CompactAvailability = lazy(() => import('./CompactAvailability'));
const CompactCalendar = lazy(() => import('./CompactCalendar'));

// ============= ENHANCED CONTACT SECTION =============

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const ContactSectionWrapper = styled.section`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const ContactTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContactMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactCardsColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 968px) {
    grid-column: 1;
    order: -1;
  }
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--color-purple-primary);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ContactIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const ContactMethodTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
`;

const ContactMethodDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const ContactAction = styled.span`
  color: var(--color-purple-primary);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    color: var(--color-green-primary);
  }
`;

const ResponseTimeChip = styled.div`
  background: rgba(102, 126, 234, 0.15);
  color: var(--color-purple-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.75rem;
  display: inline-block;
`;

// Integration Wrappers
const AvailabilityStatusWrapper = styled.div`
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
`;

const CalendarWrapper = styled.div`
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
`;

// Contact Methods Data
const contactMethods = [
  {
    icon: '📧',
    title: 'Email',
    description: 'Best for detailed discussions',
    action: 'kaitran225@gmail.com',
    responseTime: '< 6 hours',
    href: 'mailto:kaitran225@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Kai,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20discuss...'
  },
  {
    icon: '💼',
    title: 'LinkedIn',
    description: 'Professional networking',
    action: 'Connect with me',
    responseTime: '< 12 hours', 
    href: 'https://linkedin.com/in/kaitran225'
  },
  {
    icon: '💻',
    title: 'GitHub',
    description: 'View code & projects',
    action: 'Follow @kaitran225',
    responseTime: '< 24 hours',
    href: 'https://github.com/kaitran225'
  }
];

// Component
const ContactSection: React.FC = () => {
  const handleContactMethod = useCallback((method: typeof contactMethods[0]) => {
    if (method.href.startsWith('mailto:') || method.href.startsWith('http')) {
      window.open(method.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <ContactSectionWrapper id="contact">
      <ContactContainer>
        <ContactHeader>
          <ContactTitle>Let's Connect</ContactTitle>
          <ContactSubtitle>
            Available for OJT Fall 2025 • Ready to collaborate on innovative projects
          </ContactSubtitle>
        </ContactHeader>

        <ContactMethodsGrid>
          <ContactCardsColumn>
            {/* Contact Methods */}
            {contactMethods.map((method, index) => (
              <ContactCard 
                key={method.title}
                onClick={() => handleContactMethod(method)}
              >
                <ContactIcon>{method.icon}</ContactIcon>
                <ContactMethodTitle>{method.title}</ContactMethodTitle>
                <ContactMethodDescription>{method.description}</ContactMethodDescription>
                <ContactAction>{method.action} →</ContactAction>
                <ResponseTimeChip>Response: {method.responseTime}</ResponseTimeChip>
              </ContactCard>
            ))}
          </ContactCardsColumn>

          <ContactSidebar>
            {/* Compact Availability Status */}
            <AvailabilityStatusWrapper>
              <Suspense fallback={<div style={{height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)'}}>Loading...</div>}>
                <CompactAvailability />
              </Suspense>
            </AvailabilityStatusWrapper>

            {/* Compact Calendar Integration */}
            <CalendarWrapper>
              <Suspense fallback={<div style={{height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)'}}>Loading...</div>}>
                <CompactCalendar />
              </Suspense>
            </CalendarWrapper>
          </ContactSidebar>
        </ContactMethodsGrid>
      </ContactContainer>
    </ContactSectionWrapper>
  );
};

export default ContactSection;
