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
                        <FooterTitle>Let's Work Together</FooterTitle>
                        <FooterDescription>
                            Available for freelance projects, full-time opportunities, and exciting collaborations.
                            Let's create something amazing together!
                        </FooterDescription>
                        <ContactButton href={`mailto:${personalInfo.contact.email}`}>
                            Get In Touch
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
                            <SocialLink href={personalInfo.contact.github} target="_blank" rel="noopener noreferrer">
                                <GitHubIcon>⚡</GitHubIcon>
                                GitHub
                            </SocialLink>
                            <SocialLink href={personalInfo.contact.instagram} target="_blank" rel="noopener noreferrer">
                                <InstagramIcon>📷</InstagramIcon>
                                Instagram
                            </SocialLink>
                            <SocialLink href={`mailto:${personalInfo.contact.email}`}>
                                <EmailIcon>✉️</EmailIcon>
                                Email
                            </SocialLink>
                            <SocialLink href="https://linkedin.com/in/kaitran-dev" target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon>💼</LinkedInIcon>
                                LinkedIn
                            </SocialLink>
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

const SocialLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0;

  &:hover {
    color: var(--color-text-primary);
    transform: translateX(5px);
  }
`;

const GitHubIcon = styled.span`
  font-size: 1.1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${SocialLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const InstagramIcon = styled.span`
  font-size: 1.1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${SocialLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const EmailIcon = styled.span`
  font-size: 1.1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${SocialLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
`;

const LinkedInIcon = styled.span`
  font-size: 1.1rem;
  filter: grayscale(1) brightness(0.8);
  transition: all 0.3s ease;
  
  ${SocialLink}:hover & {
    filter: grayscale(0) brightness(1.2);
  }
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

export default Footer;
