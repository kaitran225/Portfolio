import React, { useState } from 'react';
import styled from 'styled-components';

const ContactComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    alert('Thanks for your message! This is a demo, so no message was actually sent.');
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };
  
  return (
    <ContactContainer>
      <ContactHeading>Contact Me</ContactHeading>
      
      <ContactForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
          />
        </FormGroup>
        
        <SubmitButton type="submit">Send Message</SubmitButton>
      </ContactForm>
      
      <SocialLinks>
        <SocialLink href="https://github.com/" target="_blank" rel="noopener noreferrer">
          GitHub
        </SocialLink>
        <SocialLink href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </SocialLink>
        <SocialLink href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
          Instagram
        </SocialLink>
      </SocialLinks>
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  padding: 16px;
  color: #f8f8f8;
  overflow-y: auto;
`;

const ContactHeading = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px 12px;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  
  &:focus {
    outline: 2px solid #0984e3;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: 2px solid #0984e3;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  background-color: #0984e3;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0873c4;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const SocialLink = styled.a`
  color: #0984e3;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default ContactComponent; 