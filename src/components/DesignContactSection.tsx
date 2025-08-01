import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ============= DESIGN PORTFOLIO CONTACT SECTION =============

interface DesignContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: 'branding' | 'ui-ux' | 'print' | 'digital' | 'consultation' | 'other';
  budget: 'under-5k' | '5k-15k' | '15k-30k' | '30k-plus' | 'discuss';
  timeline: 'asap' | '1-month' | '2-3-months' | '3-plus-months' | 'flexible';
  message: string;
  preferredContact: 'email' | 'phone' | 'video-call';
}

interface DesignContactSectionProps {
  className?: string;
}

const projectTypeLabels = {
  'branding': 'Brand Identity & Logo Design',
  'ui-ux': 'UI/UX & Web Design',
  'print': 'Print & Marketing Materials',
  'digital': 'Digital Marketing Assets',
  'consultation': 'Design Consultation',
  'other': 'Other Design Services'
};

const budgetLabels = {
  'under-5k': 'Under $5,000',
  '5k-15k': '$5,000 - $15,000',
  '15k-30k': '$15,000 - $30,000',
  '30k-plus': '$30,000+',
  'discuss': 'Let\'s discuss'
};

const timelineLabels = {
  'asap': 'ASAP (Rush job)',
  '1-month': 'Within 1 month',
  '2-3-months': '2-3 months',
  '3-plus-months': '3+ months',
  'flexible': 'Flexible timeline'
};

// ============= ANIMATIONS =============

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
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// ============= STYLED COMPONENTS =============

const ContactContainer = styled.section`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const ContactTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--color-purple-primary);
    transform: translateY(-2px);
  }
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const ContactText = styled.div`
  color: #fff;
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

const FormContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  grid-column: ${props => props.$fullWidth ? 'span 2' : 'span 1'};
  
  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

const Label = styled.label`
  display: block;
  color: var(--color-text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-purple-primary);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(105, 51, 255, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-purple-primary);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(105, 51, 255, 0.2);
  }

  option {
    background: var(--color-black-primary);
    color: var(--color-text-primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-purple-primary);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(105, 51, 255, 0.2);
  }
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 1.2rem 2rem;
  background: linear-gradient(135deg, var(--color-purple-primary), var(--color-green-primary));
  color: var(--color-text-primary);
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;

  ${props => props.$loading && `
    background: linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px);
    background-size: 468px 100%;
    animation: ${shimmer} 1.2s ease-in-out infinite;
    cursor: not-allowed;
  `}

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(105, 51, 255, 0.3);
    background: linear-gradient(135deg, var(--color-green-primary), var(--color-purple-primary));
  }

  &:not(:disabled):active {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingShape = styled.div<{ $delay: number; $x: number; $y: number; $size: number }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: ${float} ${props => 3 + props.$delay}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

// ============= MAIN COMPONENT =============

const DesignContactSection: React.FC<DesignContactSectionProps> = ({ className }) => {
  const [formData, setFormData] = useState<DesignContactFormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'branding',
    budget: 'discuss',
    timeline: 'flexible',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Design Contact Form submitted:', formData);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: 'branding',
        budget: 'discuss',
        timeline: 'flexible',
        message: '',
        preferredContact: 'email'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer className={className}>
      <FloatingElements>
        {[...Array(8)].map((_, i) => (
          <FloatingShape
            key={i}
            $delay={i * 0.5}
            $x={Math.random() * 100}
            $y={Math.random() * 100}
            $size={30 + Math.random() * 50}
          />
        ))}
      </FloatingElements>

      <ContentWrapper>
        <ContactInfo>
          <ContactTitle>Let's Create Something Amazing</ContactTitle>
          <ContactSubtitle>
            Ready to bring your brand to life? Let's discuss your project and 
            create a design solution that perfectly captures your vision.
          </ContactSubtitle>
          
          <ContactDetails>
            <ContactItem>
              <ContactIcon>📧</ContactIcon>
              <ContactText>
                <h4>Email</h4>
                <p>hello@designer.com</p>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📱</ContactIcon>
              <ContactText>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📍</ContactIcon>
              <ContactText>
                <h4>Location</h4>
                <p>Manila, Philippines</p>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>⏰</ContactIcon>
              <ContactText>
                <h4>Response Time</h4>
                <p>Within 24 hours</p>
              </ContactText>
            </ContactItem>
          </ContactDetails>
        </ContactInfo>

        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <FormTitle>Start Your Project</FormTitle>
            
            {submitStatus === 'success' && (
              <div style={{ 
                background: 'rgba(76, 175, 80, 0.2)', 
                color: '#4CAF50', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                ✅ Thank you! I'll get back to you within 24 hours.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div style={{ 
                background: 'rgba(244, 67, 54, 0.2)', 
                color: '#f44336', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                ❌ Something went wrong. Please try again.
              </div>
            )}

            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  required
                />
              </FormGroup>

              <FormGroup $fullWidth>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="projectType">Project Type *</Label>
                <Select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                >
                  {Object.entries(projectTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="budget">Budget Range</Label>
                <Select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  {Object.entries(budgetLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  {Object.entries(timelineLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="preferredContact">Preferred Contact</Label>
                <Select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleInputChange}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="video-call">Video Call</option>
                </Select>
              </FormGroup>

              <FormGroup $fullWidth>
                <Label htmlFor="message">Project Details *</Label>
                <TextArea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, goals, and any specific requirements..."
                  required
                />
              </FormGroup>
            </FormGrid>

            <SubmitButton type="submit" disabled={isSubmitting} $loading={isSubmitting}>
              {isSubmitting ? 'Sending Message...' : 'Send Project Inquiry'}
            </SubmitButton>
          </Form>
        </FormContainer>
      </ContentWrapper>
    </ContactContainer>
  );
};

export default DesignContactSection;
