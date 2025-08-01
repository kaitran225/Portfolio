import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FiMail, FiUser, FiBriefcase, FiMessageSquare, FiSend, FiCheck, FiAlert } from './IconWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { emailService, ContactFormData } from '../services/emailService';
import { usePWA } from '../services/pwaService';

// ============= ENHANCED CONTACT FORM =============

interface FormData extends ContactFormData {
  projectType: 'OJT' | 'Freelance' | 'Full-time' | 'Consultation';
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error' | 'offline';
  message: string;
}

const EnhancedContactForm: React.FC = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: 'idle', message: '' });
  const { connectionStatus, submitFormOffline } = usePWA();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setFormStatus({ type: 'loading', message: 'Sending your message...' });
    
    // Check if offline
    if (connectionStatus === 'offline') {
      try {
        await submitFormOffline(data, '/api/contact');
        setFormStatus({ 
          type: 'offline', 
          message: 'You are offline. Your message has been saved and will be sent when you reconnect.' 
        });
        reset();
        return;
      } catch (error) {
        setFormStatus({ 
          type: 'error', 
          message: 'Failed to save message for offline sending. Please try again when you have an internet connection.' 
        });
        return;
      }
    }
    
    try {
      const result = await emailService.sendContactEmail(data);
      
      if (result.success) {
        setFormStatus({ 
          type: 'success', 
          message: result.message 
        });
        reset();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      setFormStatus({ 
        type: 'error', 
        message: 'Sorry, there was an error sending your message. Please try again or contact me directly at contact@kaitran.dev.' 
      });
    }
  };

  return (
    <ContactFormContainer>
      <FormHeader>
        <FormTitle>Let's Work Together</FormTitle>
        <FormSubtitle>
          Available for OJT Fall 2025 • Open to freelance projects • Ready to contribute to your team
        </FormSubtitle>
      </FormHeader>

      <ContactFormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <InputGroup>
            <InputIcon>
              <FiUser />
            </InputIcon>
            <FloatingInput
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              placeholder=" "
              $hasError={!!errors.name}
            />
            <FloatingLabel htmlFor="name">Full Name *</FloatingLabel>
            {errors.name && (
              <ErrorMessage>
                <FiAlert />
                {errors.name.message}
              </ErrorMessage>
            )}
          </InputGroup>

          {/* Email Field */}
          <InputGroup>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <FloatingInput
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              type="email"
              placeholder=" "
              $hasError={!!errors.email}
            />
            <FloatingLabel htmlFor="email">Email Address *</FloatingLabel>
            {errors.email && (
              <ErrorMessage>
                <FiAlert />
                {errors.email.message}
              </ErrorMessage>
            )}
          </InputGroup>

          {/* Company Field */}
          <InputGroup>
            <InputIcon>
              <FiBriefcase />
            </InputIcon>
            <FloatingInput
              {...register('company')}
              placeholder=" "
              $hasError={false}
            />
            <FloatingLabel htmlFor="company">Company/Organization</FloatingLabel>
          </InputGroup>

          {/* Project Type Select */}
          <InputGroup>
            <SelectWrapper>
              <FloatingSelect
                {...register('projectType', { required: 'Please select a project type' })}
                $hasError={!!errors.projectType}
              >
                <option value="">Select Project Type</option>
                <option value="OJT">OJT Opportunity</option>
                <option value="Full-time">Full-time Position</option>
                <option value="Freelance">Freelance Project</option>
                <option value="Consultation">Technical Consultation</option>
              </FloatingSelect>
              <SelectLabel>Project Type *</SelectLabel>
            </SelectWrapper>
            {errors.projectType && (
              <ErrorMessage>
                <FiAlert />
                {errors.projectType.message}
              </ErrorMessage>
            )}
          </InputGroup>

          {/* Message Field */}
          <InputGroup>
            <TextareaIcon>
              <FiMessageSquare />
            </TextareaIcon>
            <FloatingTextarea
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Message must be at least 10 characters' }
              })}
              placeholder=" "
              rows={5}
              $hasError={!!errors.message}
            />
            <FloatingLabel htmlFor="message">Your Message *</FloatingLabel>
            {errors.message && (
              <ErrorMessage>
                <FiAlert />
                {errors.message.message}
              </ErrorMessage>
            )}
          </InputGroup>

          {/* Submit Button */}
          <SubmitButton
            type="submit"
            disabled={formStatus.type === 'loading'}
            $status={formStatus.type}
          >
            <ButtonContent
              as={motion.div}
              animate={{ scale: formStatus.type === 'loading' ? 0.95 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {formStatus.type === 'loading' ? (
                <>
                  <LoadingSpinner />
                  Sending...
                </>
              ) : formStatus.type === 'success' ? (
                <>
                  <FiCheck />
                  Message Sent!
                </>
              ) : (
                <>
                  <FiSend />
                  Send Message
                </>
              )}
            </ButtonContent>
          </SubmitButton>
        </form>

        {/* Status Message */}
        <AnimatePresence>
          {formStatus.message && (
            <StatusMessage
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              $type={formStatus.type}
            >
              {formStatus.type === 'success' ? (
                <FiCheck />
              ) : formStatus.type === 'offline' ? (
                <FiSend />
              ) : (
                <FiAlert />
              )}
              {formStatus.message}
            </StatusMessage>
          )}
        </AnimatePresence>
      </ContactFormWrapper>

      {/* Alternative Contact Methods */}
      <AlternativeContact>
        <ContactMethodsTitle>Prefer direct contact?</ContactMethodsTitle>
        <ContactMethods>
          <ContactMethod href="mailto:kaitran225@gmail.com">
            <FiMail />
            kaitran225@gmail.com
          </ContactMethod>
          <ContactMethod href="https://linkedin.com/in/kaitran225" target="_blank">
            LinkedIn Message
          </ContactMethod>
          <ContactMethod href="https://calendly.com/kaitran225" target="_blank">
            Schedule a Call
          </ContactMethod>
        </ContactMethods>
      </AlternativeContact>
    </ContactFormContainer>
  );
};

// Styled Components
const ContactFormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--background-secondary);
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  border: 1px solid var(--border-color);
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ContactFormWrapper = styled.div`
  position: relative;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  z-index: 2;
  transition: color 0.3s ease;
`;

const TextareaIcon = styled(InputIcon)`
  top: 1.5rem;
  transform: none;
`;

const FloatingInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: 1.25rem 1rem 1.25rem 3rem;
  background: var(--background-tertiary);
  border: 2px solid ${props => props.$hasError ? '#ff4757' : 'var(--border-color)'};
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: var(--color-purple-primary);
    box-shadow: 0 0 0 3px rgba(105, 51, 255, 0.1);
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    transform: translateY(-2.5rem) scale(0.85);
    color: var(--color-purple-primary);
  }

  &::placeholder {
    color: transparent;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  left: 3rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  background: var(--background-tertiary);
  padding: 0 0.5rem;
`;

const FloatingTextarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  padding: 1.25rem 1rem 1.25rem 3rem;
  background: var(--background-tertiary);
  border: 2px solid ${props => props.$hasError ? '#ff4757' : 'var(--border-color)'};
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: var(--color-purple-primary);
    box-shadow: 0 0 0 3px rgba(105, 51, 255, 0.1);
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    transform: translateY(-2.5rem) scale(0.85);
    color: var(--color-purple-primary);
  }

  &::placeholder {
    color: transparent;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const FloatingSelect = styled.select<{ $hasError: boolean }>`
  width: 100%;
  padding: 1.25rem 1rem;
  background: var(--background-tertiary);
  border: 2px solid ${props => props.$hasError ? '#ff4757' : 'var(--border-color)'};
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-purple-primary);
    box-shadow: 0 0 0 3px rgba(105, 51, 255, 0.1);
  }

  option {
    background: var(--background-tertiary);
    color: var(--color-text-primary);
  }
`;

const SelectLabel = styled.label`
  position: absolute;
  left: 1rem;
  top: -0.5rem;
  transform: scale(0.85);
  color: var(--color-text-muted);
  font-size: 1rem;
  background: var(--background-tertiary);
  padding: 0 0.5rem;
  pointer-events: none;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff4757;
  font-size: 0.85rem;
  margin-top: 0.5rem;

  svg {
    flex-shrink: 0;
  }
`;

const SubmitButton = styled.button<{ $status: string }>`
  width: 100%;
  padding: 1.25rem 2rem;
  background: ${props => {
    switch (props.$status) {
      case 'loading': return 'var(--color-text-muted)';
      case 'success': return '#2ed573';
      case 'error': return '#ff4757';
      default: return 'linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%)';
    }
  }};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.$status === 'loading' ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  background: ${props => {
    switch (props.$type) {
      case 'success': return 'rgba(46, 213, 115, 0.1)';
      case 'error': return 'rgba(255, 71, 87, 0.1)';
      case 'offline': return 'rgba(255, 193, 7, 0.1)';
      default: return 'var(--background-tertiary)';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'success': return '#2ed573';
      case 'error': return '#ff4757';
      case 'offline': return '#ffc107';
      default: return 'var(--color-text-primary)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$type) {
      case 'success': return 'rgba(46, 213, 115, 0.3)';
      case 'error': return 'rgba(255, 71, 87, 0.3)';
      case 'offline': return 'rgba(255, 193, 7, 0.3)';
      default: return 'var(--border-color)';
    }
  }};

  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }
`;

const AlternativeContact = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
`;

const ContactMethodsTitle = styled.h3`
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ContactMethods = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const ContactMethod = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--background-tertiary);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);

  &:hover {
    color: var(--color-purple-primary);
    border-color: var(--color-purple-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  svg {
    font-size: 1rem;
  }
`;

export default EnhancedContactForm;
