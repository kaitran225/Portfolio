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
    let styleElement: HTMLStyleElement | null = null;

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

      // Temporarily disable animations for PDF generation
      styleElement = document.createElement('style');
      styleElement.textContent = `
        [data-cv-content] *, [data-cv-content] *::before, [data-cv-content] *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          animation-fill-mode: forwards !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `;
      document.head.appendChild(styleElement);

      // Wait a moment for styles to apply and images to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      // Wait a bit more after forcing sizes
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create high-quality canvas
      const canvas = await html2canvas(cvElement, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: cvElement.scrollWidth,
        height: cvElement.scrollHeight,
        logging: false, // Disable logging to avoid console spam
        imageTimeout: 15000, // Wait up to 15 seconds for images
        removeContainer: true,
      });

      // Calculate PDF dimensions (A4 in mm)
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Calculate scaling to fit content within a single A4 page
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let imgWidth = pdfWidth;
      let imgHeight = pdfHeight;

      // Scale to fit within A4 dimensions while maintaining aspect ratio
      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is wider, scale by width
        imgHeight = pdfWidth / canvasAspectRatio;
      } else {
        // Canvas is taller, scale by height
        imgWidth = pdfHeight * canvasAspectRatio;
      }

      // Center the image on the page
      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = (pdfHeight - imgHeight) / 2;

      // Create PDF with single page
      const pdf = new jsPDF('portrait', 'mm', 'a4');

      // Add image to single page, scaled to fit
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        xOffset,
        yOffset,
        imgWidth,
        imgHeight
      );

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
    } finally {
      // Always clean up the style element
      if (styleElement && styleElement.parentNode) {
        document.head.removeChild(styleElement);
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
      <RadiusWrapper>
        <A4Wrapper data-cv-content>
          {/* Header */}
          <Header>
            <NameSection>
              <Name>TRẦN NGUYÊN KHÁNH</Name>
              <JobTitle>SOFTWARE ENGINEER</JobTitle>
            </NameSection>
            <ProfilePhoto>
              <img
                src="/assets/cv/Profile.JPG"
                alt="Profile Photo"
                crossOrigin="anonymous"
                loading="eager"
                onLoad={(e) => {
                  // Ensure image is properly loaded for PDF generation
                  const img = e.target as HTMLImageElement;
                  img.style.opacity = '1';
                }}
              />
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z" /><path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z" /><path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z" /><path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z" /><path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z" /></svg>
                  <SkillName>Java</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>8 projects</SkillDetailLine>
                    <SkillDetailLine>3 years</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z" /><path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z" /><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z" /></svg>
                  <SkillName>C#</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>5 projects</SkillDetailLine>
                    <SkillDetailLine>2 years</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#fff" d="M22.67 47h99.67v73.67H22.67z" /><path data-name="original" fill="#007acc" d="M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z" /></svg>
                  <SkillName>JavaScript & TypeScript</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>12 projects</SkillDetailLine>
                    <SkillDetailLine>4 years</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#5A9FD4" /><stop offset="1" stop-color="#306998" /></linearGradient><linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#FFD43B" /><stop offset="1" stop-color="#FFE873" /></linearGradient><path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)" /><path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)" /><radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B8B8B8" stop-opacity=".498" /><stop offset="1" stop-color="#7F7F7F" stop-opacity="0" /></radialGradient><path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z" /></svg>
                  <SkillName>Python</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>6 projects</SkillDetailLine>
                    <SkillDetailLine>2 years</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#00c4b3" d="M35.2 34.9l-8.3-8.3v59.7l.1 2.8c0 1.3.2 2.8.7 4.3l65.6 23.1 16.3-7.2-74.4-74.4z" /><path d="M27.7 93.4zm81.9 15.9l-16.3 7.2-65.4-23.1c1.3 4.8 4 10.1 7 13.2l21.3 21.2 47.6.1 5.8-18.6z" fill="#22d3c5" /><path fill="#0075c9" d="M1.7 65.1C-.4 67.3.7 72 4 75.5l14.7 14.8 9.2 3.3c-.3-1.5-.7-3-.7-4.3l-.1-2.8-.2-59.8m82.7 82.6l7.2-16.4-23-65.6c-1.5-.3-3-.6-4.3-.7l-2.9-.1-59.6.1" /><path d="M93.6 27.3c.2 0 .2 0 0 0 .2 0 .2 0 0 0zm16 82l17.7-5.8V54.8l-20.4-20.5c-3-3-8.3-5.8-13.2-7l23.1 65.6" fill="#00a8e1" /><path fill="#00c4b3" d="M90.5 18.2L75.7 3.5c-3.4-3.4-8-4.4-10.4-2.3L26.9 26.6h59.5l2.9.1c1.3 0 2.8.2 4.3.7l-3.1-9.2z" /></svg>
                  <SkillName>Dart (Flutter)</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>3 projects</SkillDetailLine>
                    <SkillDetailLine>1 year</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#00618A" d="M117.688 98.242c-6.973-.191-12.297.461-16.852 2.379-1.293.547-3.355.559-3.566 2.18.711.746.82 1.859 1.387 2.777 1.086 1.754 2.922 4.113 4.559 5.352 1.789 1.348 3.633 2.793 5.551 3.961 3.414 2.082 7.223 3.27 10.504 5.352 1.938 1.23 3.859 2.777 5.75 4.164.934.684 1.563 1.75 2.773 2.18v-.195c-.637-.812-.801-1.93-1.387-2.777l-2.578-2.578c-2.52-3.344-5.719-6.281-9.117-8.719-2.711-1.949-8.781-4.578-9.91-7.73l-.199-.199c1.922-.219 4.172-.914 5.949-1.391 2.98-.797 5.645-.59 8.719-1.387l4.164-1.187v-.793c-1.555-1.594-2.664-3.707-4.359-5.152-4.441-3.781-9.285-7.555-14.273-10.703-2.766-1.746-6.184-2.883-9.117-4.363-.988-.496-2.719-.758-3.371-1.586-1.539-1.961-2.379-4.449-3.566-6.738-2.488-4.793-4.93-10.023-7.137-15.066-1.504-3.437-2.484-6.828-4.359-9.91-9-14.797-18.687-23.73-33.695-32.508-3.195-1.867-7.039-2.605-11.102-3.57l-6.543-.395c-1.332-.555-2.715-2.184-3.965-2.977C16.977 3.52 4.223-3.312.539 5.672-1.785 11.34 4.016 16.871 6.09 19.746c1.457 2.012 3.32 4.273 4.359 6.539.688 1.492.805 2.984 1.391 4.559 1.438 3.883 2.695 8.109 4.559 11.695.941 1.816 1.98 3.727 3.172 5.352.727.996 1.98 1.438 2.18 2.973-1.227 1.715-1.297 4.375-1.984 6.543-3.098 9.77-1.926 21.91 2.578 29.137 1.383 2.223 4.641 6.98 9.117 5.156 3.918-1.598 3.043-6.539 4.164-10.902.254-.988.098-1.715.594-2.379v.199l3.57 7.133c2.641 4.254 7.324 8.699 11.297 11.699 2.059 1.555 3.68 4.242 6.344 5.152v-.199h-.199c-.516-.805-1.324-1.137-1.98-1.781-1.551-1.523-3.277-3.414-4.559-5.156-3.613-4.902-6.805-10.27-9.711-15.855-1.391-2.668-2.598-5.609-3.77-8.324-.453-1.047-.445-2.633-1.387-3.172-1.281 1.988-3.172 3.598-4.164 5.945-1.582 3.754-1.789 8.336-2.375 13.082-.348.125-.195.039-.398.199-2.762-.668-3.73-3.508-4.758-5.949-2.594-6.164-3.078-16.09-.793-23.191.59-1.836 3.262-7.617 2.18-9.316-.516-1.691-2.219-2.672-3.172-3.965-1.18-1.598-2.355-3.703-3.172-5.551-2.125-4.805-3.113-10.203-5.352-15.062-1.07-2.324-2.875-4.676-4.359-6.738-1.645-2.289-3.484-3.977-4.758-6.742-.453-.984-1.066-2.559-.398-3.566.215-.684.516-.969 1.191-1.191 1.148-.887 4.352.297 5.547.793 3.18 1.32 5.832 2.578 8.527 4.363 1.289.855 2.598 2.512 4.16 2.973h1.785c2.789.641 5.914.195 8.523.988 4.609 1.402 8.738 3.582 12.488 5.949 11.422 7.215 20.766 17.48 27.156 29.734 1.027 1.973 1.473 3.852 2.379 5.945 1.824 4.219 4.125 8.559 5.941 12.688 1.816 4.113 3.582 8.27 6.148 11.695 1.348 1.801 6.551 2.766 8.918 3.766 1.66.699 4.379 1.43 5.949 2.379 3 1.809 5.906 3.965 8.723 5.945 1.402.992 5.73 3.168 5.945 4.957zm-88.605-75.52c-1.453-.027-2.48.156-3.566.395v.199h.195c.695 1.422 1.918 2.34 2.777 3.566l1.98 4.164.199-.195c1.227-.867 1.789-2.25 1.781-4.363-.492-.52-.562-1.164-.992-1.785-.562-.824-1.66-1.289-2.375-1.98zm0 0" /></svg>

                  <SkillName>SQL</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>10 projects</SkillDetailLine>
                    <SkillDetailLine>3 years</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z" /><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z" /><path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z" /><path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z" /></svg>
                  <SkillName>HTML5 & CSS3</SkillName>
                  <SkillDetails>
                    <SkillDetailLine>15 projects</SkillDetailLine>
                    <SkillDetailLine>4 years</SkillDetailLine>
                  </SkillDetails>
                </ProgrammingSkillItem>
                <ProgrammingSkillItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 128"><path fill="#293138" d="M112.205 26.129 71.8 2.142A15.326 15.326 0 0 0 64.005 0c-2.688 0-5.386.717-7.796 2.152L15.795 26.14C10.976 28.999 8 34.289 8 40.018v47.975c0 5.729 2.967 11.019 7.796 13.878L56.2 125.858A15.193 15.193 0 0 0 63.995 128a15.32 15.32 0 0 0 7.796-2.142l40.414-23.987c4.819-2.86 7.796-8.16 7.796-13.878V40.007c0-5.718-2.967-11.019-7.796-13.878zm-31.29 74.907.063 3.448c0 .418-.267.889-.588 1.06l-2.046 1.178c-.321.16-.6-.032-.6-.45l-.032-3.394c-1.745.728-3.523.9-4.647.45-.214-.086-.31-.397-.225-.76l.739-3.117c.064-.246.193-.493.364-.643a.726.726 0 0 1 .193-.139c.117-.064.235-.075.332-.032 1.22.407 2.773.214 4.272-.535 1.907-.964 3.18-2.913 3.16-4.84-.022-1.757-.964-2.474-3.267-2.496-2.934.01-5.675-.567-5.718-4.894-.032-3.555 1.81-7.26 4.744-9.595l-.032-3.48c0-.428.257-.9.589-1.07l1.98-1.264c.322-.161.6.042.6.46l.033 3.48c1.456-.578 2.72-.738 3.865-.47.247.063.364.406.257.802l-.77 3.084a1.372 1.372 0 0 1-.354.622.825.825 0 0 1-.203.15c-.108.053-.204.064-.3.053-.525-.118-1.767-.385-3.727.6-2.056 1.038-2.773 2.827-2.763 4.155.022 1.585.825 2.066 3.63 2.11 3.738.063 5.344 1.691 5.387 5.45.053 3.684-1.917 7.657-4.937 10.077zm28.206-64.787L70.89 59.86c-4.765 2.784-8.278 5.911-8.288 11.662v47.107c0 3.437 1.392 5.665 3.523 6.318a12.81 12.81 0 0 1-2.12.204c-2.239 0-4.445-.61-6.383-1.757L17.219 99.408c-3.951-2.345-6.403-6.725-6.403-11.426V40.007c0-4.7 2.452-9.08 6.403-11.426L57.634 4.594a12.555 12.555 0 0 1 6.382-1.756c2.238 0 4.444.61 6.382 1.756l40.415 23.987c3.33 1.981 5.579 5.397 6.21 9.242-1.36-2.86-4.38-3.63-7.902-1.574z" /><path fill="#4fa847" d="m101.614 92.619-10.066 6.018c-.268.16-.46.332-.46.653v2.635c0 .32.214.46.481.3l10.216-6.212c.268-.16.31-.45.31-.77v-2.324c0-.322-.213-.45-.481-.3z" /></svg>

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
                    crossOrigin="anonymous"
                    loading="eager"
                    onLoad={(e) => {
                      // Ensure image is properly loaded for PDF generation
                      const img = e.target as HTMLImageElement;
                      img.style.opacity = '1';
                    }}
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
      </RadiusWrapper>
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
const RadiusWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;
const A4Wrapper = styled.div`
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  background: white;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: photoZoomIn 1s ease-out 0.5s both;

  @keyframes photoZoomIn {
    from {
      opacity: 0;
      transform: scale(0.8) rotate(-5deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    transition: all 0.6s ease;
    opacity: 0;
  }

  &:hover {
    transform: scale(1.08) rotate(2deg);
    border-color: #2563eb;
    box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3);

    &::before {
      opacity: 1;
      animation: shimmer 0.6s ease-in-out;
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.4s ease;
    opacity: 1;
    display: block;
  }

  &:hover img {
    transform: scale(1.1);
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
  animation: slideInLeft 0.6s ease-out;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #475569;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  padding: 6px 8px;
  border-radius: 6px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: calc(var(--animation-order) * 0.1s);

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:nth-child(2) { --animation-order: 1; }
  &:nth-child(3) { --animation-order: 2; }
  &:nth-child(4) { --animation-order: 3; }
  &:nth-child(5) { --animation-order: 4; }
  &:nth-child(6) { --animation-order: 5; }
  &:nth-child(7) { --animation-order: 6; }

  &:hover {
    color: #2563eb;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.12));
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  i {
    width: 16px;
    margin-right: 10px;
    color: #2563eb;
    font-size: 11px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  &:hover i {
    transform: scale(1.2) rotate(5deg);
    color: #1d4ed8;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease;
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
  margin-bottom: 12px;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  color: #1e293b;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 8px;
  animation: titleSlideIn 0.8s ease-out;

  @keyframes titleSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
    border-radius: 2px;
    animation: underlineExpand 1s ease-out 0.3s forwards;
  }

  @keyframes underlineExpand {
    from {
      width: 0;
    }
    to {
      width: 30px;
    }
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
  gap: 8px;
  animation: slideInRight 0.8s ease-out;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ProgrammingSkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  line-height: 1.2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  position: relative;
  opacity: 0;
  animation: skillItemFadeIn 0.6s ease-out forwards;
  animation-delay: calc(var(--skill-order) * 0.1s);

  @keyframes skillItemFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &:nth-child(1) { --skill-order: 1; }
  &:nth-child(2) { --skill-order: 2; }
  &:nth-child(3) { --skill-order: 3; }
  &:nth-child(4) { --skill-order: 4; }
  &:nth-child(5) { --skill-order: 5; }
  &:nth-child(6) { --skill-order: 6; }
  &:nth-child(7) { --skill-order: 7; }
  &:nth-child(8) { --skill-order: 8; }

  &:hover {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.12));
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 6px 0 0 6px;
    transition: width 0.3s ease;
  }

  &:hover::before {
    width: 3px;
  }
`;

const SkillIcon = styled.svg`
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
  margin-bottom: 15px;
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
  margin-bottom: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: experienceSlideIn 0.8s ease-out 0.2s forwards;

  @keyframes experienceSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transition: width 0.4s ease;
  }

  &:hover::before {
    width: 4px;
  }

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
    border-color: rgba(37, 99, 235, 0.2);
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
  gap: 12px;
  animation: gridFadeIn 0.8s ease-out 0.3s both;

  @keyframes gridFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  li {
    padding: 8px 12px;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 10px;
    color: #475569;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1.3;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: frameworkItemFadeIn 0.5s ease-out forwards;
    animation-delay: calc(var(--item-order) * 0.1s);

    @keyframes frameworkItemFadeIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    &:nth-child(1) { --item-order: 1; }
    &:nth-child(2) { --item-order: 2; }
    &:nth-child(3) { --item-order: 3; }
    &:nth-child(4) { --item-order: 4; }
    &:nth-child(5) { --item-order: 5; }
    &:nth-child(6) { --item-order: 6; }
    &:nth-child(7) { --item-order: 7; }
    &:nth-child(8) { --item-order: 8; }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05));
      transition: height 0.3s ease;
    }

    &:hover {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.12));
      transform: translateY(-2px) scale(1.02);
      border-color: rgba(37, 99, 235, 0.3);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
      color: #2563eb;

      &::before {
        height: 100%;
      }
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
