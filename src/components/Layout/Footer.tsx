import React from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../shared/services/data/portfolioDataService';

const Footer: React.FC = () => {
  const personalInfo = portfolioDataService.getPersonalInfo();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.location.reload();
  };

  return (
    <FooterContainer id="contact">
      <FooterContent>
        <SlimFooterGrid>
          {/* Contact Info */}
          <ContactInfo>
            <ContactTitle>Trần Nguyên Khánh</ContactTitle>
            <ContactSubtitle>Full-Stack Developer • Available for New Opportunities</ContactSubtitle>
          </ContactInfo>

          {/* Quick Links */}
          <QuickLinks>
            <QuickLink href={`mailto:${personalInfo.contact.email}`}>
              📧 Email
            </QuickLink>
            <QuickLink href="https://linkedin.com/in/kaitran225" target="_blank">
              💼 LinkedIn
            </QuickLink>
            <QuickLink href="https://github.com/kaitran225" target="_blank">
              💻 GitHub
            </QuickLink>
            <QuickLinkButton onClick={() => navigateTo('/resume')}>
              📄 Resume
            </QuickLinkButton>
          </QuickLinks>

          {/* Copyright */}
          <Copyright>
            © {currentYear} • Built with React & TypeScript
          </Copyright>
        </SlimFooterGrid>

        <BackToTopButton onClick={scrollToTop}>
          ↑
        </BackToTopButton>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: var(--color-background-secondary);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 1rem;
  }
`;

const Copyright = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  opacity: 0.7;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: center;
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

const ContactTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  min-width: 60px;
`;

// Slim Footer Components
const SlimFooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem 1rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const QuickLink = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  
  &:hover {
    color: var(--color-purple-primary);
    background: rgba(102, 126, 234, 0.1);
  }
`;

const QuickLinkButton = styled.button`
  color: var(--color-text-secondary);
  background: none;
  border: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    color: var(--color-purple-primary);
    background: rgba(102, 126, 234, 0.1);
  }
`;

export default Footer;
