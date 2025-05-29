import React from 'react';
import styled from 'styled-components';

const AboutComponent = () => {
  return (
    <AboutContainer>
      <AboutHeading>About Me</AboutHeading>
      <AboutText>
        I'm a creative developer focused on building interactive web experiences.
        With expertise in frontend development and design, I create visually
        appealing and functional websites.
      </AboutText>
      <SkillsHeading>Skills</SkillsHeading>
      <SkillsList>
        <SkillItem>React</SkillItem>
        <SkillItem>TypeScript</SkillItem>
        <SkillItem>Three.js</SkillItem>
        <SkillItem>Creative Coding</SkillItem>
      </SkillsList>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  padding: 16px;
  color: #f8f8f8;
`;

const AboutHeading = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #fff;
`;

const AboutText = styled.p`
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-size: 15px;
`;

const SkillsHeading = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #0984e3;
`;

const SkillsList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
  list-style-type: circle;
`;

const SkillItem = styled.li`
  margin-bottom: 8px;
  font-size: 15px;
`;

export default AboutComponent; 