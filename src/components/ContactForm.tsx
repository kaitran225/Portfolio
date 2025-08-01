import React, { useState, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= PROFESSIONAL CONTACT FORM =============

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  position: string;
  message: string;
  projectType: 'OJT' | 'Freelance' | 'Full-time' | 'Consultation' | 'Collaboration';
  urgency: 'Low' | 'Medium' | 'High';
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
}

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// Styled Components
const ContactFormContainer = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  animation: ${slideIn} 0.6s ease-out;
  box-shadow: var(--shadow-medium);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }
`;

const FormTitle = styled.h2`
  color: var(--color-text-primary, #ffffff);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const FormSubtitle = styled.p`
  color: var(--color-text-secondary, rgba(255, 255, 255, 0.8));
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormField = styled.div<{ fullWidth?: boolean; hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  ${props => props.fullWidth && css`
    grid-column: 1 / -1;
  `}

  ${props => props.hasError && css`
    animation: ${shake} 0.5s ease-in-out;
  `}
`;

const FormLabel = styled.label`
  color: var(--color-text-primary, #ffffff);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${props => props.hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 1rem;
  color: var(--color-text-primary, #ffffff);
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#667eea'};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(102, 126, 234, 0.2)'};
  }

  &:hover {
    border-color: ${props => props.hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.4)'};
  }
`;

const FormSelect = styled.select<{ hasError?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${props => props.hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 1rem;
  color: var(--color-text-primary, #ffffff);
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#667eea'};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(102, 126, 234, 0.2)'};
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const FormTextarea = styled.textarea<{ hasError?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${props => props.hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 1rem;
  color: var(--color-text-primary, #ffffff);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#667eea'};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(102, 126, 234, 0.2)'};
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button<{ isLoading?: boolean }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  min-height: 56px;
  
  ${props => props.isLoading && css`
    cursor: not-allowed;
    opacity: 0.7;
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    animation: ${pulse} 2s infinite;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: ${keyframes`to { transform: rotate(360deg); }`} 1s linear infinite;
  margin: 0 auto;
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: ${slideIn} 0.5s ease-out;
`;

// Component
const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    position: '',
    message: '',
    projectType: 'OJT',
    urgency: 'Medium'
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          position: '',
          message: '',
          projectType: 'OJT',
          urgency: 'Medium'
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [formData, onSubmit, validateForm, isLoading]);

  const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const projectTypeOptions = useMemo(() => [
    { value: 'OJT', label: '🎓 OJT Opportunity' },
    { value: 'Full-time', label: '💼 Full-time Position' },
    { value: 'Freelance', label: '🚀 Freelance Project' },
    { value: 'Consultation', label: '💡 Technical Consultation' },
    { value: 'Collaboration', label: '🤝 Collaboration' }
  ], []);

  const urgencyOptions = useMemo(() => [
    { value: 'Low', label: '🟢 Low Priority' },
    { value: 'Medium', label: '🟡 Medium Priority' },
    { value: 'High', label: '🔴 High Priority' }
  ], []);

  if (isSubmitted) {
    return (
      <ContactFormContainer>
        <SuccessMessage>
          ✅ Thank you! Your message has been sent successfully. I'll get back to you within 24 hours.
        </SuccessMessage>
      </ContactFormContainer>
    );
  }

  return (
    <ContactFormContainer>
      <FormTitle>Let's Work Together</FormTitle>
      <FormSubtitle>
        Ready to discuss your next project? I'm available for OJT opportunities starting Fall 2025 
        and always open to exciting collaborations.
      </FormSubtitle>

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormField hasError={!!errors.name}>
            <FormLabel htmlFor="name">Your Name *</FormLabel>
            <FormInput
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              hasError={!!errors.name}
              required
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormField>

          <FormField hasError={!!errors.email}>
            <FormLabel htmlFor="email">Email Address *</FormLabel>
            <FormInput
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              hasError={!!errors.email}
              required
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormField>

          <FormField>
            <FormLabel htmlFor="company">Company/Organization</FormLabel>
            <FormInput
              id="company"
              type="text"
              placeholder="Amazing Tech Co."
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="position">Your Position</FormLabel>
            <FormInput
              id="position"
              type="text"
              placeholder="HR Manager, CTO, etc."
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="projectType">Project Type</FormLabel>
            <FormSelect
              id="projectType"
              value={formData.projectType}
              onChange={(e) => handleInputChange('projectType', e.target.value as ContactFormData['projectType'])}
            >
              {projectTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="urgency">Priority Level</FormLabel>
            <FormSelect
              id="urgency"
              value={formData.urgency}
              onChange={(e) => handleInputChange('urgency', e.target.value as ContactFormData['urgency'])}
            >
              {urgencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField fullWidth hasError={!!errors.message}>
            <FormLabel htmlFor="message">Your Message *</FormLabel>
            <FormTextarea
              id="message"
              placeholder="Tell me about your project, requirements, or just say hello! I'm excited to hear from you."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              hasError={!!errors.message}
              required
            />
            {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
          </FormField>
        </FormGrid>

        <SubmitButton type="submit" disabled={isLoading} isLoading={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            '🚀 Send Message'
          )}
        </SubmitButton>
      </form>
    </ContactFormContainer>
  );
};

export default ContactForm;
export type { ContactFormData };
