import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ============= PROFESSIONAL CONTACT FORM =============

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: 'web-development' | 'mobile-app' | 'cloud-infrastructure' | 'consultation' | 'other';
  budget: 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'discuss';
  timeline: 'asap' | 'within-month' | 'within-quarter' | 'flexible';
  message: string;
  preferredContact: 'email' | 'phone' | 'video-call';
  urgency: 'low' | 'medium' | 'high';
}

interface ProfessionalContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  onClose?: () => void;
}

const ProfessionalContactForm: React.FC<ProfessionalContactFormProps> = ({ 
  onSubmit, 
  onClose 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'web-development',
    budget: 'discuss',
    timeline: 'flexible',
    message: '',
    preferredContact: 'email',
    urgency: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const validateField = (field: keyof ContactFormData, value: string): string | null => {
    switch (field) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : null;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : null;
      case 'message':
        return value.trim().length < 10 ? 'Please provide more details (min 10 characters)' : null;
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (step === 1) {
      const nameError = validateField('name', formData.name);
      const emailError = validateField('email', formData.email);
      
      if (nameError) newErrors.name = nameError;
      if (emailError) newErrors.email = emailError;
    }
    
    if (step === 3) {
      const messageError = validateField('message', formData.message);
      if (messageError) newErrors.message = messageError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Track form submission
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submission', {
          event_category: 'contact',
          event_label: 'professional_contact_form',
          project_type: formData.projectType,
          budget_range: formData.budget
        });
      }

      // Create mailto URL with all form data
      const subject = encodeURIComponent(`New Project Inquiry: ${formData.projectType.replace('-', ' ').toUpperCase()}`);
      const body = encodeURIComponent(`
New Professional Contact Form Submission:

CONTACT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not specified'}

PROJECT DETAILS:
Project Type: ${formData.projectType.replace('-', ' ').toUpperCase()}
Budget Range: ${formData.budget.replace('-', ' ').toUpperCase()}
Timeline: ${formData.timeline.replace('-', ' ').toUpperCase()}
Urgency: ${formData.urgency.toUpperCase()}

COMMUNICATION PREFERENCE:
Preferred Contact Method: ${formData.preferredContact.replace('-', ' ').toUpperCase()}

MESSAGE:
${formData.message}

---
Sent via Portfolio Professional Contact Form
${new Date().toLocaleString()}
      `);
      
      // Open email client
      window.open(`mailto:kaitran225@gmail.com?subject=${subject}&body=${body}`, '_blank');
      
      // Call onSubmit callback if provided
      onSubmit?.(formData);
      
      // Show success message or close form
      setTimeout(() => {
        onClose?.();
      }, 2000);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <StepContent>
      <StepTitle>Contact Information</StepTitle>
      <StepDescription>Let's start with your basic information</StepDescription>
      
      <FormGroup>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="John Doe"
          $hasError={!!errors.name}
        />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john@company.com"
          $hasError={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="company">Company/Organization</Label>
        <Input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          placeholder="Your Company (Optional)"
        />
      </FormGroup>
    </StepContent>
  );

  const renderStep2 = () => (
    <StepContent>
      <StepTitle>Project Details</StepTitle>
      <StepDescription>Tell me about your project requirements</StepDescription>
      
      <FormGroup>
        <Label htmlFor="projectType">Project Type</Label>
        <Select
          id="projectType"
          value={formData.projectType}
          onChange={(e) => handleInputChange('projectType', e.target.value)}
        >
          <option value="web-development">Web Development</option>
          <option value="mobile-app">Mobile Application</option>
          <option value="cloud-infrastructure">Cloud Infrastructure</option>
          <option value="consultation">Technical Consultation</option>
          <option value="other">Other</option>
        </Select>
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label htmlFor="budget">Budget Range</Label>
          <Select
            id="budget"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
          >
            <option value="under-5k">Under $5,000</option>
            <option value="5k-15k">$5,000 - $15,000</option>
            <option value="15k-50k">$15,000 - $50,000</option>
            <option value="50k-plus">$50,000+</option>
            <option value="discuss">Let's Discuss</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="timeline">Timeline</Label>
          <Select
            id="timeline"
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
          >
            <option value="asap">ASAP</option>
            <option value="within-month">Within a Month</option>
            <option value="within-quarter">Within 3 Months</option>
            <option value="flexible">Flexible</option>
          </Select>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="preferredContact">Preferred Contact</Label>
          <Select
            id="preferredContact"
            value={formData.preferredContact}
            onChange={(e) => handleInputChange('preferredContact', e.target.value)}
          >
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="video-call">Video Call</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select
            id="urgency"
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </FormGroup>
      </FormRow>
    </StepContent>
  );

  const renderStep3 = () => (
    <StepContent>
      <StepTitle>Project Description</StepTitle>
      <StepDescription>Provide details about your project and requirements</StepDescription>
      
      <FormGroup>
        <Label htmlFor="message">Project Description *</Label>
        <TextArea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Please describe your project, goals, and any specific requirements or challenges you're facing..."
          rows={6}
          $hasError={!!errors.message}
        />
        {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
        <CharacterCount $isNearLimit={formData.message.length > 450}>
          {formData.message.length}/500 characters
        </CharacterCount>
      </FormGroup>

      <ProjectTypeHints>
        <HintsTitle>💡 Include these details for faster response:</HintsTitle>
        <HintsList>
          {formData.projectType === 'web-development' && (
            <>
              <li>Type of website (e-commerce, portfolio, SaaS, etc.)</li>
              <li>Required features and functionality</li>
              <li>Design preferences or existing branding</li>
              <li>Target audience and user goals</li>
            </>
          )}
          {formData.projectType === 'mobile-app' && (
            <>
              <li>Platform preferences (iOS, Android, or both)</li>
              <li>App category and main features</li>
              <li>Backend requirements</li>
              <li>Integration needs (APIs, third-party services)</li>
            </>
          )}
          {formData.projectType === 'cloud-infrastructure' && (
            <>
              <li>Current infrastructure setup</li>
              <li>Scale and performance requirements</li>
              <li>Security and compliance needs</li>
              <li>Preferred cloud providers</li>
            </>
          )}
          {formData.projectType === 'consultation' && (
            <>
              <li>Specific technical challenges</li>
              <li>Current technology stack</li>
              <li>Team size and structure</li>
              <li>Goals for the consultation</li>
            </>
          )}
        </HintsList>
      </ProjectTypeHints>
    </StepContent>
  );

  return (
    <FormOverlay>
      <FormContainer ref={containerRef}>
        <FormHeader>
          <CloseButton onClick={onClose} type="button">×</CloseButton>
          <FormTitle>Professional Contact Form</FormTitle>
          <ProgressIndicator>
            <ProgressBar $progress={(currentStep / 3) * 100} />
            <ProgressText>Step {currentStep} of 3</ProgressText>
          </ProgressIndicator>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <FormActions>
            {currentStep > 1 && (
              <SecondaryButton type="button" onClick={handlePrevious}>
                ← Previous
              </SecondaryButton>
            )}
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
              {currentStep < 3 ? (
                <PrimaryButton type="button" onClick={handleNext}>
                  Next →
                </PrimaryButton>
              ) : (
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message 📧'}
                </SubmitButton>
              )}
            </div>
          </FormActions>
        </form>
      </FormContainer>
    </FormOverlay>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Styled Components
const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const FormContainer = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.4s ease-out;
  border: 1px solid var(--border-color);
`;

const FormHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: var(--background-hover);
    color: var(--color-text-primary);
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
`;

const ProgressIndicator = styled.div`
  position: relative;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 4px;
  background: var(--background-secondary);
  border-radius: 2px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  text-align: center;
`;

const StepContent = styled.div`
  padding: 2rem;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'var(--border-color)'};
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--color-purple-primary);
    box-shadow: 0 0 0 3px rgba(105, 51, 255, 0.1);
  }

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--color-purple-primary);
    box-shadow: 0 0 0 3px rgba(105, 51, 255, 0.1);
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'var(--border-color)'};
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--color-purple-primary);
    box-shadow: 0 0 0 3px rgba(105, 51, 255, 0.1);
  }

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const CharacterCount = styled.div<{ $isNearLimit: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isNearLimit ? '#f59e0b' : 'var(--color-text-tertiary)'};
  text-align: right;
  margin-top: 0.25rem;
`;

const ProjectTypeHints = styled.div`
  background: rgba(105, 51, 255, 0.05);
  border: 1px solid rgba(105, 51, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const HintsTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const HintsList = styled.ul`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
  padding-left: 1.2rem;
  
  li {
    margin-bottom: 0.25rem;
    line-height: 1.4;
  }
`;

const FormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, var(--color-purple-primary), var(--color-purple-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(105, 51, 255, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--background-hover);
    border-color: var(--color-purple-primary);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default ProfessionalContactForm;
