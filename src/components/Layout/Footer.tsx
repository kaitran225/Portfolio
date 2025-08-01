import React from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../services/portfolioDataService';

const Footer: React.FC = () => {
  const personalInfo = portfolioDataService.getPersonalInfo();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterContainer id="contact">
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <FooterTitle>Get In Touch</FooterTitle>
            <FooterDescription>
              Available for freelance projects, full-time opportunities, and exciting collaborations.
              Let's create something amazing together!
            </FooterDescription>
            <ContactButton href={`mailto:${personalInfo.contact.email}`}>
              Send Message
            </ContactButton>

          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <FooterLink onClick={() => window.history.pushState({}, '', '/')}>
                Development Portfolio
              </FooterLink>
              <FooterLink onClick={() => window.history.pushState({}, '', '/design')}>
                Design Portfolio
              </FooterLink>
              <FooterLink href="?view=simple">
                Resume / CV
              </FooterLink>
              <FooterLink onClick={scrollToTop}>
                Back to Top
              </FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Connect</FooterTitle>
            <SocialLinks>

              {/* Contact & Availability Section */}
              <ContactCard onClick={() => window.open('mailto:kaitran225@gmail.com', '_blank')}>
                <ContactIcon>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </ContactIcon>
                <ContactTitle>Email</ContactTitle>
                <ContactDescription>kaitran225@gmail.com</ContactDescription>
                <ContactAction>Send Message →</ContactAction>
              </ContactCard>

              <ContactCard onClick={() => window.open('https://linkedin.com/in/kaitran225', '_blank')}>
                <ContactIcon>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </ContactIcon>
                <ContactTitle>LinkedIn</ContactTitle>
                <ContactDescription>Professional Network</ContactDescription>
                <ContactAction>Connect →</ContactAction>
              </ContactCard>

              <ContactCard onClick={() => window.open('https://github.com/kaitran225', '_blank')}>
                <ContactIcon>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </ContactIcon>
                <ContactTitle>GitHub</ContactTitle>
                <ContactDescription>View My Code</ContactDescription>
                <ContactAction>Explore →</ContactAction>
              </ContactCard>

              <ContactCard onClick={() => window.open('/resume.pdf', '_blank')}>
                <ContactIcon>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </ContactIcon>
                <ContactTitle>Resume</ContactTitle>
                <ContactDescription>Download PDF</ContactDescription>
                <ContactAction>Download →</ContactAction>
              </ContactCard>
            </SocialLinks>
          </FooterSection>
        </FooterTop>

        <FooterDivider />

        <FooterBottom>
          <Copyright>
            © {currentYear} {personalInfo.name}. Built with 💜 using React & TypeScript
          </Copyright>
          <TechStack>
            <TechItem>React 19</TechItem>
            <TechItem>TypeScript</TechItem>
            <TechItem>Styled Components</TechItem>
            <TechItem>Three.js</TechItem>
          </TechStack>
        </FooterBottom>
      </FooterContent>

      <BackToTopButton onClick={scrollToTop}>
        ↑
      </BackToTopButton>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: transparent;
  backdrop-filter: blur(20px) saturate(1.2);
  position: relative;
  overflow: hidden;
  margin-top: auto;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15), 
              inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(105, 51, 255, 0.4), transparent);
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.03) 0%, 
                rgba(255, 255, 255, 0.01) 50%, 
                rgba(255, 255, 255, 0.04) 100%);
    pointer-events: none;
    z-index: 0;
  }
`;

const FooterContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 2rem 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 1rem;
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(40, 40, 60, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(15px) saturate(1.1);
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  &:hover {
    background: rgba(40, 40, 60, 0.4);
    border-color: rgba(105, 51, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(105, 51, 255, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
`;

const FooterTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const FooterDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  opacity: 0.8;
`;

const ContactButton = styled.a`
  background: var(--color-purple-primary);
  color: white;
  text-decoration: none;
  padding: 0.9rem 1.8rem;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border: 2px solid var(--color-purple-primary);

  &:hover {
    background: transparent;
    color: var(--color-purple-primary);
    border-color: var(--color-purple-primary);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: pointer;
  width: fit-content;

  &:hover {
    color: var(--color-text-primary);
    transform: translateX(5px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 2rem 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.7;
`;

const TechStack = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const TechItem = styled.span`
  color: var(--color-text-primary);
  font-size: 0.8rem;
  padding: 0.4rem 1rem;
  background: rgba(40, 40, 60, 0.25);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(1.1);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: rgba(40, 40, 60, 0.35);
    border-color: rgba(105, 51, 255, 0.5);
    transform: translateY(-2px);
    color: var(--color-purple-primary);
    box-shadow: 0 4px 16px rgba(105, 51, 255, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--color-purple-primary);
  color: white;
  border: 2px solid var(--color-purple-primary);
  border-radius: 4px;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    background: transparent;
    color: var(--color-purple-primary);
    border-color: var(--color-purple-primary);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
  }
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: var(--color-green-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 255, 136, 0.15);
  }
`;

const ContactIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--color-text-secondary);
    transition: color 0.3s ease;
  }
  
  ${ContactCard}:hover & svg {
    color: var(--color-green-primary);
  }
`;

const ContactTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  min-width: 60px;
`;

const ContactDescription = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 0.8rem;
  flex: 1;
`;

const ContactAction = styled.span`
  color: var(--color-green-primary);
  font-weight: 500;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  ${ContactCard}:hover & {
    color: var(--color-text-primary);
  }
`;

export default Footer;
