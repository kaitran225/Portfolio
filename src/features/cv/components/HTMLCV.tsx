import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../../contexts/ThemeContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const HTMLCV: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const [copiedText, setCopiedText] = useState<string>('');

  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, navigate to home
      window.location.href = '/';
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Show loading state
      const button = document.querySelector('[data-download-button]') as HTMLButtonElement;
      if (button) {
        button.textContent = '⏳ Generating PDF...';
        button.disabled = true;
      }

      // Get the A4 wrapper element (the CV content)
      const cvElement = document.querySelector('[data-cv-content]') as HTMLElement;
      if (!cvElement) {
        throw new Error('CV content not found');
      }

      // Create high-quality canvas
      const canvas = await html2canvas(cvElement, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: cvElement.scrollWidth,
        height: cvElement.scrollHeight
      });

      // Calculate PDF dimensions (A4 in mm)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      // Calculate image height proportionally
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF('portrait', 'mm', 'a4');

      // If image is taller than A4, we might need multiple pages
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save('Trần_Nguyên_Khánh_CV.pdf');

      // Reset button state
      if (button) {
        button.textContent = '📄 Download PDF';
        button.disabled = false;
      }

    } catch (error) {
      console.error('Error generating PDF:', error);

      // Fallback to pre-generated PDF
      const link = document.createElement('a');
      link.href = '/assets/cv/Trần_Nguyên_Khánh_CV.pdf';
      link.download = 'Trần_Nguyên_Khánh_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset button state
      const button = document.querySelector('[data-download-button]') as HTMLButtonElement;
      if (button) {
        button.textContent = '📄 Download PDF';
        button.disabled = false;
      }
    }
  };

  return (
    <CVContainer data-cv-container>
      <CVHeader>
        <BackButton onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </BackButton>

        <HeaderActions>
          <ThemeToggleButton onClick={toggleTheme} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </ThemeToggleButton>

          <DownloadButton onClick={handleDownloadPDF} data-download-button>
            📄 Download PDF
          </DownloadButton>
        </HeaderActions>
      </CVHeader>

      <A4Wrapper data-cv-content>
        {/* Header */}
        <Header>
          <NameSection>
            <Name>TRẦN NGUYÊN KHÁNH</Name>
            <JobTitle>SOFTWARE ENGINEER</JobTitle>
          </NameSection>
          <ProfilePhoto>
            <img src="/assets/cv/Profile.JPG" alt="Profile Photo" />
          </ProfilePhoto>
        </Header>

        {/* Left Sidebar */}
        <Sidebar>
          <ContactSection>
             <SectionTitle>CONTACT</SectionTitle>
            <ContactItem onClick={() => handleCopyToClipboard('+84339961844', 'phone')}>
              <i className="fas fa-phone"></i>
              <CopyableText>
                +84 339961844
                {copiedText === 'phone' && <CopiedIndicator>Copied!</CopiedIndicator>}
              </CopyableText>
            </ContactItem>
            <ContactItem onClick={() => handleCopyToClipboard('kaitran225@gmail.com', 'email')}>
              <i className="fas fa-envelope"></i>
              <CopyableText>
                kaitran225@gmail.com
                {copiedText === 'email' && <CopiedIndicator>Copied!</CopiedIndicator>}
              </CopyableText>
            </ContactItem>
            <ContactItem>
              <i className="fas fa-map-marker-alt"></i>
              <a href="https://maps.google.com/?q=Thủ+Dầu+Một,+Bình+Dương,+Vietnam" target="_blank" rel="noopener noreferrer">
                Thủ Dầu Một, Bình Dương
              </a>
            </ContactItem>
            <ContactItem>
              <i className="fab fa-github"></i>
              <a href="https://github.com/kaitran225" target="_blank" rel="noopener noreferrer">
                github.com/kaitran225
              </a>
            </ContactItem>
            <ContactItem>
              <i className="fab fa-linkedin"></i>
              <a href="https://linkedin.com/in/kaitran2205" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/kaitran2205
              </a>
            </ContactItem>
            <ContactItem>
              <i className="fab fa-globe"></i>
              <a href="http://www.cybriadev.com/Portfolio" target="_blank" rel="noopener noreferrer">
                cybriadev.com/Portfolio
              </a>
            </ContactItem>
          </ContactSection>

          <ContentSection>
            <SectionTitle>PROGRAMMING LANGUAGES</SectionTitle>
            <ProgrammingSkillsList>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />
                <SkillName>Java</SkillName>
                <SkillDetails>
                  <SkillDetailLine>8 projects</SkillDetailLine>
                  <SkillDetailLine>3 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" alt="C#" />
                <SkillName>C#</SkillName>
                <SkillDetails>
                  <SkillDetailLine>5 projects</SkillDetailLine>
                  <SkillDetailLine>2 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" />
                <SkillName>JavaScript & TypeScript</SkillName>
                <SkillDetails>
                  <SkillDetailLine>12 projects</SkillDetailLine>
                  <SkillDetailLine>4 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />
                <SkillName>Python</SkillName>
                <SkillDetails>
                  <SkillDetailLine>6 projects</SkillDetailLine>
                  <SkillDetailLine>2 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" alt="Dart" />
                <SkillName>Dart (Flutter)</SkillName>
                <SkillDetails>
                  <SkillDetailLine>3 projects</SkillDetailLine>
                  <SkillDetailLine>1 year</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="SQL" />
                <SkillName>SQL</SkillName>
                <SkillDetails>
                  <SkillDetailLine>10 projects</SkillDetailLine>
                  <SkillDetailLine>3 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" />
                <SkillName>HTML5 & CSS3</SkillName>
                <SkillDetails>
                  <SkillDetailLine>15 projects</SkillDetailLine>
                  <SkillDetailLine>4 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
              <ProgrammingSkillItem>
                <SkillIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" alt="Bash" />
                <SkillName>PowerShell & Bash</SkillName>
                <SkillDetails>
                  <SkillDetailLine>4 projects</SkillDetailLine>
                  <SkillDetailLine>2 years</SkillDetailLine>
                </SkillDetails>
              </ProgrammingSkillItem>
            </ProgrammingSkillsList>
          </ContentSection>


          <ContentSection>
            <QRSection>
              <QRCode>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=http://cybriadev.com/"
                  alt="Portfolio QR Code"
                />
              </QRCode>
              <QRText>
                <p>Scan to view my portfolio</p>
                <a href="http://cybriadev.com/" target="_blank" rel="noopener noreferrer">
                  wwww.cybriadev.com
                </a>
              </QRText>
            </QRSection>
          </ContentSection>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          <ContentSection>
            <SectionTitle>PROFILE</SectionTitle>
            <ProfileText>
              <strong>Software Engineer</strong> with a passion for building robust backend systems, interactive web applications, and scalable cloud services. Experienced in Spring Boot, TypeScript/React, and containerized deployments using Docker, Render, and Aiven. Skilled at integrating AI assistants, optimizing performance, and delivering full product experiences from backend to frontend. On the side, I also enjoy working on graphic design projects — blending technical precision with creative expression. Always eager to learn, collaborate, and bring ideas to life in clean, maintainable code.
            </ProfileText>
          </ContentSection>
          <ContentSection>
            <SectionTitle>EXPERIENCE</SectionTitle>
            <ExperienceItem>
              <ExperienceHeader>
                <ExperienceLeft>
                  <PositionTitle>SELF-TAUGHT SOFTWARE DEVELOPER</PositionTitle>
                  <CompanyName>Independent Learning & Personal Projects</CompanyName>
                </ExperienceLeft>
                <DateRange>2020 - Present</DateRange>
              </ExperienceHeader>
              <JobResponsibilities>
                <li>Self-directed learning of multiple programming languages including Java, C#, Python, and JavaScript</li>
                <li>Built 17+ personal projects and repositories with 1000+ commits on GitHub</li>
                <li>Developed full-stack applications using Spring Boot, React, and modern web technologies</li>
                <li>Created mobile applications using Flutter and cross-platform development frameworks</li>
                <li>Practiced enterprise development patterns including RESTful APIs, database design, and authentication</li>
                <li>Continuously learning new technologies and staying updated with industry best practices</li>
              </JobResponsibilities>
            </ExperienceItem>
          </ContentSection>

          <ContentSection>
            <SectionTitle>FRAMEWORKS & TOOLS</SectionTitle>
            <FrameworksList>
              <li>Spring Boot & Spring Framework</li>
              <li>React.js & Node.js</li>
              <li>Flutter & Dart SDK</li>
              <li>MySQL & Database Design</li>
              <li>Docker & Containerization</li>
              <li>Git & Version Control</li>
              <li>RESTful API Development</li>
              <li>JWT Authentication</li>
            </FrameworksList>
          </ContentSection>
                    <ContentSection>
            <SectionTitle>EDUCATION</SectionTitle>
            <EducationItem>
              <EducationTitle>Bachelor of Software Engineering</EducationTitle>
              <EducationSchool>FPT University</EducationSchool>
              <EducationDate>2022 - 2025</EducationDate>
            </EducationItem>
          </ContentSection>
        </MainContent>
      </A4Wrapper>
    </CVContainer>
  );
};

const CVContainer = styled.div`
  min-height: 100vh;
  background: var(--color-black-primary);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text-primary);
  position: relative;
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    padding: 70px 15px 15px;
  }
`;

const DownloadButton = styled.button`
  background: var(--color-green-primary);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const A4Wrapper = styled.div`
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  position: relative;
  transition: box-shadow 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 10;

  @media (max-width: 768px) {
    position: relative;
    height: auto;
    padding: 20px;
    flex-direction: column;
    gap: 20px;
  }
`;

const NameSection = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 3px;
  color: white;
  margin-bottom: 8px;
  text-transform: uppercase;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const JobTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ProfilePhoto = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 20px;
  margin-top: 50px;
  overflow: hidden;
  background: #1e293b;
  border: 6px solid #1e293b;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
`;

const Sidebar = styled.div`
  width: 35%;
  background: #f1f5f9;
  padding: 160px 25px 25px 25px;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const ContactSection = styled.div`
  margin-bottom: 20px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
  color: #475569;
  transition: color 0.2s ease;
  cursor: pointer;
  position: relative;
  padding: 4px 6px;

  &:hover {
    color: #2563eb;
    background: rgba(37, 99, 235, 0.05);
    border-radius: 4px;
  }

  i {
    width: 16px;
    margin-right: 8px;
    color: #2563eb;
    font-size: 11px;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  &:hover i {
    transform: scale(1.1);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
    font-size: 11px;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }
`;

const CopyableText = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
  }
`;

const CopiedIndicator = styled.span`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  animation: fadeInOut 2s ease-in-out;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #10b981;
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
    10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;

const ContentSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  color: #1e293b;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 6px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 25px;
    height: 2px;
    background: #2563eb;
    border-radius: 2px;
  }
`;

const SkillsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: 10px;
    padding: 8px 15px;
    background: white;
    border-radius: 6px;
    font-size: 12px;
    color: #475569;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    border-left: 3px solid transparent;

    &:hover {
      border-left-color: #2563eb;
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }
  }
`;

const ProgrammingSkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProgrammingSkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(37, 99, 235, 0.05);
    border-radius: 4px;
  }
`;

const SkillIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  ${ProgrammingSkillItem}:hover & {
    transform: scale(1.1);
  }
`;

const SkillName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  flex: 1;
`;

const SkillDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
`;

const SkillDetailLine = styled.div`
  font-size: 9px;
  color: #64748b;
  font-weight: 500;
  text-align: right;
  line-height: 1.2;
`;

const EducationItem = styled.div`
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 8px 8px;
  border-left: 20px solid #2563eb;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: #2563eb;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(37, 99, 235, 0.15);
  }
`;

const EducationTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const EducationSchool = styled.div`
  font-size: 11px;
  color: #2563eb;
  margin-bottom: 6px;
  font-weight: 600;
  line-height: 1.3;
`;

const EducationDate = styled.div`
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.2;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
`;

const QRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
`;

const QRCode = styled.div`
  margin-bottom: 10px;
  margin-top: 10px;

  img {
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 2px solid #f1f5f9;
    width: 100px;
    height: 100px;
  }
`;

const QRText = styled.div`
  p {
    font-size: 11px;
    color: #64748b;
    margin-bottom: 6px;
    font-weight: 500;
    line-height: 1.3;
  }

  a {
    font-size: 10px;
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;
    line-height: 1.2;

    &:hover {
      border-bottom-color: #2563eb;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 160px 25px 25px 25px;
  background: white;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProfileText = styled.div`
  font-size: 10px;
  line-height: 1.4;
  color: #475569;
  text-align: justify;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #2563eb;
  position: relative;
`;

const ExperienceItem = styled.div`
  margin-bottom: 25px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: #2563eb;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.1);
  }
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ExperienceLeft = styled.div`
  flex: 1;
`;

const PositionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1e293b;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const CompanyName = styled.div`
  font-size: 12px;
  color: #2563eb;
  font-weight: 500;
  line-height: 1.3;
`;

const DateRange = styled.div`
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
  flex-shrink: 0;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    align-self: flex-start;
  }
`;

const JobResponsibilities = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: 6px;
    padding-left: 16px;
    position: relative;
    font-size: 11px;
    color: #475569;
    line-height: 1.4;

    &:before {
      content: '▸';
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
      font-size: 10px;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCategory = styled.div`
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #2563eb;

  h4 {
    font-size: 12px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  ${SkillsList} li {
    margin-bottom: 6px;
    padding: 6px 12px;
    background: white;
    border-radius: 4px;
    font-size: 11px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
`;

const FrameworksList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  li {
    padding: 4px 8px;
    background: #f8fafc;
  border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 10px;
    color: #475569;
    transition: all 0.2s ease;
    line-height: 1.3;

    &:hover {
      background: rgba(37, 99, 235, 0.05);
      transform: translateX(2px);
    }
  }
`;

// CV Header and Navigation Components
const CVHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-black-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 12px 15px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-purple-primary);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-purple-secondary);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const ThemeToggleButton = styled.button`
  background: var(--color-black-secondary);
  border: 1px solid var(--border-color);
  color: var(--color-text-primary);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-black-tertiary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

export default HTMLCV;
