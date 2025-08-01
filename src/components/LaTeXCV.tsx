import React from 'react';
import styled from 'styled-components';

const LaTeXCV: React.FC = () => {
  return (
    <CVContainer>
      <CVPage>
        {/* LaTeX-style header */}
        <CVHeader>
                    <Name>Kai Tran</Name>
          <ContactInfo>
            <ContactItem>📧 kaifx225@gmail.com</ContactItem>
            <ContactItem>📞 (+84) 123-456-789</ContactItem>
            <ContactItem>🌐 github.com/kaitran225</ContactItem>
            <ContactItem>💼 linkedin.com/in/kaitran225</ContactItem>
          </ContactInfo>
        </CVHeader>

        <CVLine />

        {/* Education Section */}
        <Section>
          <SectionTitle>EDUCATION</SectionTitle>
          <Entry>
            <EntryHeader>
              <EntryTitle>Bachelor of Computer Science</EntryTitle>
              <EntryDate>2020 - 2024</EntryDate>
            </EntryHeader>
            <EntrySubtitle>University of Technology, Ho Chi Minh City</EntrySubtitle>
            <EntryDescription>
              • GPA: 3.8/4.0 | Relevant Coursework: Data Structures, Algorithms, Web Development, Database Design
              <br />• Final Project: Full-stack e-commerce platform using React, Node.js, and MongoDB
            </EntryDescription>
          </Entry>
        </Section>

        {/* Experience Section */}
        <Section>
          <SectionTitle>PROFESSIONAL EXPERIENCE</SectionTitle>
          <Entry>
            <EntryHeader>
              <EntryTitle>Full Stack Developer Intern</EntryTitle>
              <EntryDate>Jun 2023 - Dec 2023</EntryDate>
            </EntryHeader>
            <EntrySubtitle>TechCorp Solutions, Ho Chi Minh City</EntrySubtitle>
            <EntryDescription>
              • Developed responsive web applications using React, TypeScript, and Node.js
              <br />• Collaborated with design team to implement pixel-perfect UI components
              <br />• Optimized database queries resulting in 40% faster page load times
              <br />• Participated in code reviews and followed Agile development methodologies
            </EntryDescription>
          </Entry>
          
          <Entry>
            <EntryHeader>
              <EntryTitle>Graphic Designer</EntryTitle>
              <EntryDate>Jan 2022 - May 2023</EntryDate>
            </EntryHeader>
            <EntrySubtitle>Creative Studio Zena, Ho Chi Minh City</EntrySubtitle>
            <EntryDescription>
              • Created brand identities and visual systems for 15+ clients
              <br />• Designed marketing materials including brochures, social media content, and web assets
              <br />• Collaborated with clients to understand requirements and deliver creative solutions
              <br />• Managed multiple projects simultaneously while meeting tight deadlines
            </EntryDescription>
          </Entry>
        </Section>

        {/* Technical Skills */}
        <Section>
          <SectionTitle>TECHNICAL SKILLS</SectionTitle>
          <SkillsGrid>
            <SkillCategory>
              <SkillCategoryTitle>Programming Languages:</SkillCategoryTitle>
              <SkillList>JavaScript, TypeScript, Python, Java, C++, HTML5, CSS3</SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillCategoryTitle>Frameworks & Libraries:</SkillCategoryTitle>
              <SkillList>React, Node.js, Express.js, Next.js, Vue.js, Bootstrap, Tailwind CSS</SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillCategoryTitle>Databases & Tools:</SkillCategoryTitle>
              <SkillList>MongoDB, MySQL, PostgreSQL, Git, Docker, AWS, Firebase</SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillCategoryTitle>Design Tools:</SkillCategoryTitle>
              <SkillList>Adobe Creative Suite, Figma, Sketch, Canva, Blender</SkillList>
            </SkillCategory>
          </SkillsGrid>
        </Section>

        {/* Projects */}
        <Section>
          <SectionTitle>KEY PROJECTS</SectionTitle>
          <Entry>
            <EntryHeader>
              <EntryTitle>Calantha Interactive Platform</EntryTitle>
              <EntryDate>2024</EntryDate>
            </EntryHeader>
            <EntryDescription>
              Full-stack web application with real-time video processing and interactive media features
              <br />• Technologies: React, TypeScript, Node.js, MongoDB, WebRTC, Socket.io
              <br />• Features: Real-time communication, media processing, responsive design
            </EntryDescription>
          </Entry>
          
          <Entry>
            <EntryHeader>
              <EntryTitle>Zena Brand Identity System</EntryTitle>
              <EntryDate>2023</EntryDate>
            </EntryHeader>
            <EntryDescription>
              Complete brand identity design for modern fashion brand including logo, typography, and visual system
              <br />• Deliverables: Logo design, brand guidelines, marketing materials, packaging design
              <br />• Client satisfaction: 98% approval rate with positive feedback on brand coherence
            </EntryDescription>
          </Entry>
        </Section>

        {/* Awards & Achievements */}
        <Section>
          <SectionTitle>ACHIEVEMENTS</SectionTitle>
          <Entry>
            <EntryDescription>
              • Dean's List - Fall 2022, Spring 2023 (Top 10% of class)
              <br />• Winner - University Hackathon 2023 (Best UI/UX Design)
              <br />• Certified - Google UX Design Professional Certificate (2023)
              <br />• Volunteer - Vietnam Tech Community Events (2022-2024)
            </EntryDescription>
          </Entry>
        </Section>

        {/* Footer */}
        <CVFooter>
          <FooterText>
            References available upon request • Portfolio: kaitran-portfolio.vercel.app
          </FooterText>
        </CVFooter>
      </CVPage>
    </CVContainer>
  );
};

// LaTeX-style Styled Components
const CVContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  font-family: 'Computer Modern', 'Latin Modern Roman', serif;
`;

const CVPage = styled.div`
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 25mm;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  font-size: 11pt;
  line-height: 1.4;
  color: #000;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    box-shadow: none;
  }
`;

const CVHeader = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Name = styled.h1`
  font-size: 24pt;
  font-weight: bold;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  font-family: 'Computer Modern', serif;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const ContactItem = styled.span`
  font-size: 10pt;
  color: #333;
`;

const CVLine = styled.hr`
  border: none;
  border-top: 1px solid #000;
  margin: 20px 0;
`;

const Section = styled.section`
  margin-bottom: 18px;
`;

const SectionTitle = styled.h2`
  font-size: 12pt;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
  padding-bottom: 2px;
  border-bottom: 1px solid #000;
  text-transform: uppercase;
`;

const Entry = styled.div`
  margin-bottom: 12px;
  padding-left: 0;
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EntryTitle = styled.h3`
  font-size: 11pt;
  font-weight: bold;
  margin: 0;
`;

const EntryDate = styled.span`
  font-size: 10pt;
  font-style: italic;
  color: #555;
`;

const EntrySubtitle = styled.h4`
  font-size: 10pt;
  font-weight: normal;
  font-style: italic;
  margin: 0 0 4px 0;
  color: #444;
`;

const EntryDescription = styled.p`
  font-size: 10pt;
  margin: 0;
  text-align: justify;
  line-height: 1.3;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SkillCategory = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const SkillCategoryTitle = styled.span`
  font-weight: bold;
  font-size: 10pt;
  min-width: 140px;
  flex-shrink: 0;
`;

const SkillList = styled.span`
  font-size: 10pt;
  line-height: 1.3;
`;

const CVFooter = styled.footer`
  text-align: center;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #ccc;
`;

const FooterText = styled.p`
  font-size: 9pt;
  color: #666;
  margin: 0;
  font-style: italic;
`;

export default LaTeXCV;
