import React from 'react';
import styled from 'styled-components';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';

const SimplePortfolio: React.FC = () => {
  // Get data from service
  const personalInfo = portfolioDataService.getPersonalInfo();
  const technicalSkills = portfolioDataService.getTechnicalSkills();
  const projectCategories = portfolioDataService.getSimplePortfolioCategories();

  return (
    <SimpleWrapper>
      <Header>
        <ProfileSection>
          <Name>Kai Tran</Name>
          <Title>{personalInfo.title}</Title>
          <Contact>
            <ContactItem href={personalInfo.contact.instagram}>Instagram</ContactItem>
            <ContactItem href={personalInfo.contact.github}>GitHub</ContactItem>
            <ContactItem href={`mailto:${personalInfo.contact.email}`}>Email</ContactItem>
          </Contact>
        </ProfileSection>
      </Header>

      <Section>
        <SectionTitle>About</SectionTitle>
        <Description>
          {personalInfo.aboutDescription}
        </Description>
      </Section>

      <Section>
        <SectionTitle>Technical Skills</SectionTitle>
        <SkillsGrid>
          <SkillCategory>
            <SkillTitle>Frontend</SkillTitle>
            <SkillList>{technicalSkills.frontend.join(', ')}</SkillList>
          </SkillCategory>
          <SkillCategory>
            <SkillTitle>Backend</SkillTitle>
            <SkillList>{technicalSkills.backend.join(', ')}</SkillList>
          </SkillCategory>
          <SkillCategory>
            <SkillTitle>DevOps</SkillTitle>
            <SkillList>{technicalSkills.devops.join(', ')}</SkillList>
          </SkillCategory>
          <SkillCategory>
            <SkillTitle>Tools</SkillTitle>
            <SkillList>{technicalSkills.tools.join(', ')}</SkillList>
          </SkillCategory>
        </SkillsGrid>
      </Section>

      <Section>
        <SectionTitle>Featured Projects</SectionTitle>
        <ProjectsGrid>
          {projectCategories.map((project, index) => (
            <ProjectCard key={index}>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TechStack>
                {project.tech.map((tech, techIndex) => (
                  <TechTag key={techIndex}>{tech}</TechTag>
                ))}
              </TechStack>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Section>

      <Footer>
        <FooterText>
          This portfolio showcases my technical skills and project experience. 
          Available for internship opportunities starting September 2025.
        </FooterText>
      </Footer>
    </SimpleWrapper>
  );
};

const SimpleWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-text-primary);
  color: var(--color-black-primary);
  line-height: 1.6;

  @media print {
    padding: 20px;
    background: white;
  }
`;

const Header = styled.header`
  margin-bottom: 60px;
  padding: 40px 0;
  border-bottom: 2px solid var(--color-purple-primary);
`;

const ProfileSection = styled.div`
  text-align: center;
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--color-black-primary);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-purple-primary);
  margin-bottom: 20px;
`;

const Contact = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
`;

const ContactItem = styled.a`
  color: var(--color-purple-primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    color: var(--color-green-primary);
  }
`;

const Section = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: var(--color-black-primary);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--color-purple-primary);
  }
    background: #3498db;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 800px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const SkillCategory = styled.div`
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const SkillTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2c3e50;
`;

const SkillList = styled.p`
  color: #555;
  font-size: 0.95rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const ProjectCard = styled.div`
  background: #ffffff;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2c3e50;
`;

const ProjectDescription = styled.p`
  color: #555;
  margin-bottom: 20px;
  font-size: 0.95rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechTag = styled.span`
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 40px 0;
  border-top: 1px solid #e1e8ed;
  margin-top: 60px;
`;

const FooterText = styled.p`
  color: #7f8c8d;
  font-style: italic;
`;

export default SimplePortfolio;
