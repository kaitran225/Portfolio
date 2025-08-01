import React, { useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import ContactForm, { ContactFormData } from './ContactForm';

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

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const ContactSectionWrapper = styled.section`
  padding: 4rem 2rem;
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

const AvailabilityStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--color-green-primary);
  color: var(--color-green-primary);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: var(--color-green-primary);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

const ContactMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactCardsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--color-purple-primary);
    transform: translateY(-5px);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const ContactIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const ContactMethodTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
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

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px);
  }
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-purple-primary);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
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

const quickStats = [
  { number: '4+', label: 'Years Experience' },
  { number: '17+', label: 'Projects Completed' },
  { number: '24h', label: 'Response Time' },
  { number: '95%', label: 'Client Satisfaction' }
];

// Component
const ContactSection: React.FC = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleFormSubmit = useCallback(async (formData: ContactFormData) => {
    setIsSubmittingForm(true);
    
    try {
      // Simulate API call - replace with actual implementation
      console.log('Form submission:', formData);
      
      // Create mailto link with form data
      const subject = encodeURIComponent(`${formData.projectType} Inquiry from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Company: ${formData.company || 'Not specified'}\n` +
        `Position: ${formData.position || 'Not specified'}\n` +
        `Project Type: ${formData.projectType}\n` +
        `Priority: ${formData.urgency}\n\n` +
        `Message:\n${formData.message}`
      );
      
      // Open email client
      window.open(`mailto:kaitran225@gmail.com?subject=${subject}&body=${body}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmittingForm(false);
    }
  }, []);

  const handleContactMethod = useCallback((method: typeof contactMethods[0]) => {
    if (method.href.startsWith('mailto:') || method.href.startsWith('http')) {
      window.open(method.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <ContactSectionWrapper id="contact">
      <ContactContainer>
        <ContactHeader>
          <ContactTitle>Let's Create Something Amazing</ContactTitle>
          <ContactSubtitle>
            Ready to bring your ideas to life? I'm currently available for OJT opportunities 
            and excited to collaborate on innovative projects.
          </ContactSubtitle>
        </ContactHeader>

        <ContactMethodsGrid>
          <ContactCardsColumn>
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

          <FormColumn>
            <ContactForm onSubmit={handleFormSubmit} isLoading={isSubmittingForm} />
          </FormColumn>
        </ContactMethodsGrid>
      </ContactContainer>
    </ContactSectionWrapper>
  );
};

export default ContactSection;
