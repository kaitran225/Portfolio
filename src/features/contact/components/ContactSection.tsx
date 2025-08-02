import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useContactForm } from '../../../contexts/ContactFormContext';

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
  padding: 1.5rem 2rem;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem 1rem;
  }
`;

const ContactContainer = styled.div`
  max-width: 1400px;
  padding: 1.5rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(10px);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const ContactTitle = styled.h2<{ $isDevelopment?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$isDevelopment === false
    ? 'var(--color-design-primary)'
    : 'var(--color-purple-primary)'};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto 1rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ContactMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ContactCard = styled.div<{ $isDevelopment?: boolean }>`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.$isDevelopment
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 107, 107, 0.2)'};
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  &:hover {
    background: ${props => props.$isDevelopment
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 107, 107, 0.05)'};
    border-color: ${props => props.$isDevelopment
    ? 'var(--color-purple-primary)'
    : 'var(--color-design-primary)'};
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ContactIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
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
  margin-bottom: 0.8rem;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const ContactAction = styled.span<{ $isDevelopment?: boolean }>`
  color: ${props => props.$isDevelopment
    ? 'var(--color-purple-primary)'
    : 'var(--color-design-primary)'};
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    color: ${props => props.$isDevelopment
    ? 'var(--color-green-primary)'
    : 'var(--color-design-secondary)'};
  }
`;

const ResponseTimeChip = styled.div<{ $isDevelopment?: boolean }>`
  background: ${props => props.$isDevelopment
    ? 'rgba(102, 126, 234, 0.15)'
    : 'rgba(255, 107, 107, 0.15)'};
  color: ${props => props.$isDevelopment
    ? 'var(--color-purple-primary)'
    : 'var(--color-design-primary)'};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 0.5rem;
  display: inline-block;
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
  },
  {
    icon: '📅',
    title: 'Schedule Call',
    description: 'Quick 30-min consultation',
    action: 'Book a time slot',
    responseTime: 'Instant booking',
    href: 'https://calendly.com/kaitran225/30min'
  }
];

interface ContactSectionProps {
  isDevelopment?: boolean;
}

// Component
const ContactSection: React.FC<ContactSectionProps> = ({ isDevelopment = true }) => {
  const { openContactForm } = useContactForm();

  const handleContactMethod = useCallback((method: typeof contactMethods[0]) => {
    if (method.href.startsWith('mailto:') || method.href.startsWith('http')) {
      window.open(method.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleFormSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
  };

  return (
    <ContactSectionWrapper id="contact">
      <ContactContainer>
        <ContactHeader>
          <ContactTitle $isDevelopment={isDevelopment}>Let's Connect</ContactTitle>
          <ContactSubtitle>
            Available for new opportunities • Ready to collaborate on innovative projects
          </ContactSubtitle>
        </ContactHeader>

        <ContactMethodsGrid>
          {contactMethods.map((method, index) => (
            <ContactCard
              key={method.title}
              $isDevelopment={isDevelopment}
              onClick={() => handleContactMethod(method)}
            >
              <ContactIcon>{method.icon}</ContactIcon>

              <ContactMethodTitle>{method.title}</ContactMethodTitle>
              <ContactMethodDescription>{method.description}</ContactMethodDescription>
              <ContactAction $isDevelopment={isDevelopment}>{method.action} →</ContactAction>
              <ResponseTimeChip $isDevelopment={isDevelopment}>Response: {method.responseTime}</ResponseTimeChip>
            </ContactCard>
          ))}
          <CTAButtonContainer>
            <ProfessionalFormButton $isDevelopment={isDevelopment} onClick={openContactForm}>
              🚀 Start a Project
              <ButtonSubtext>Professional consultation form</ButtonSubtext>
            </ProfessionalFormButton>
          </CTAButtonContainer>
        </ContactMethodsGrid>
      </ContactContainer>
    </ContactSectionWrapper>
  );
};

// New styled components for enhanced contact system
const CTAButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfessionalFormButton = styled.button<{ $isDevelopment?: boolean }>`
  background: ${props => props.$isDevelopment === false
    ? 'var(--color-design-primary)'
    : 'var(--color-purple-primary)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-align: center;
  box-shadow: ${props => props.$isDevelopment
    ? '0 4px 15px rgba(105, 51, 255, 0.3)'
    : '0 4px 15px rgba(255, 107, 107, 0.3)'};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.$isDevelopment
    ? '0 8px 25px rgba(105, 51, 255, 0.4)'
    : '0 8px 25px rgba(255, 107, 107, 0.4)'};
  }

  &:active {
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ButtonSubtext = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 0.25rem;
  font-weight: 400;
`;

export default ContactSection;
