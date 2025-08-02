import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= ENHANCED SKILLS VISUALIZATION =============

interface Skill {
  name: string;
  proficiency: number; // 0-100
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'tools' | 'ai';
  icon?: string;
  yearsExperience?: number;
  projects?: number;
}

interface SkillCategory {
  name: string;
  title: string;
  description: string;
  color: string;
  skills: Skill[];
}

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const progressAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: var(--final-width);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// Styled Components
const SkillsSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SkillsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SkillsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SkillsTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SkillsSubtitle = styled.p`
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ExperienceSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const ExperienceCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-fill-mode: both;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ExperienceNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 0.5rem;
`;

const ExperienceLabel = styled.div`
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const CategoryTab = styled.button<{ active?: boolean; color?: string }>`
  background: ${props => props.active ? 
    `linear-gradient(135deg, ${props.color}20 0%, ${props.color}10 100%)` : 
    'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => props.active ? props.color : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  color: ${props => props.active ? props.color : 'var(--color-text-secondary)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: ${props => props.color};
    color: ${props => props.color};
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SkillCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  animation: ${slideInLeft} 0.6s ease-out;
  animation-fill-mode: both;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SkillItem = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.div`
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const SkillMeta = styled.div`
  color: var(--color-text-muted);
  font-size: 0.85rem;
  display: flex;
  gap: 1rem;
`;

const SkillProficiency = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 60px;
  text-align: right;
`;

const SkillProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const SkillProgressFill = styled.div<{ proficiency: number; color: string; delay: number }>`
  height: 100%;
  background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}80 100%);
  border-radius: 10px;
  width: 0%;
  animation: ${progressAnimation} 1.5s ease-out ${props => props.delay}s forwards;
  --final-width: ${props => props.proficiency}%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, var(--background-secondary), transparent);
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const ProficiencyLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

// Data
const skillCategories: SkillCategory[] = [
  {
    name: 'frontend',
    title: 'Frontend Development',
    description: 'Modern web interfaces & user experiences',
    color: '#667eea',
    skills: [
      { name: 'React', proficiency: 95, category: 'frontend', icon: '⚛️', yearsExperience: 3, projects: 12 },
      { name: 'TypeScript', proficiency: 90, category: 'frontend', icon: '🔷', yearsExperience: 3, projects: 15 },
      { name: 'JavaScript', proficiency: 95, category: 'frontend', icon: '🟨', yearsExperience: 4, projects: 20 },
      { name: 'Next.js', proficiency: 85, category: 'frontend', icon: '▲', yearsExperience: 2, projects: 8 },
      { name: 'Three.js', proficiency: 80, category: 'frontend', icon: '🎮', yearsExperience: 1, projects: 4 },
      { name: 'Styled Components', proficiency: 90, category: 'frontend', icon: '💅', yearsExperience: 2, projects: 10 }
    ]
  },
  {
    name: 'backend',
    title: 'Backend Development',
    description: 'Scalable APIs & database systems',
    color: '#10b981',
    skills: [
      { name: 'Node.js', proficiency: 90, category: 'backend', icon: '🟢', yearsExperience: 3, projects: 15 },
      { name: 'Java', proficiency: 85, category: 'backend', icon: '☕', yearsExperience: 2, projects: 8 },
      { name: 'Spring Boot', proficiency: 85, category: 'backend', icon: '🍃', yearsExperience: 2, projects: 6 },
      { name: 'Python', proficiency: 80, category: 'backend', icon: '🐍', yearsExperience: 2, projects: 10 },
      { name: 'MongoDB', proficiency: 85, category: 'backend', icon: '🍃', yearsExperience: 3, projects: 12 },
      { name: 'PostgreSQL', proficiency: 80, category: 'backend', icon: '🐘', yearsExperience: 2, projects: 8 }
    ]
  },
  {
    name: 'devops',
    title: 'DevOps & Cloud',
    description: 'Deployment, scaling & infrastructure',
    color: '#f59e0b',
    skills: [
      { name: 'Docker', proficiency: 85, category: 'devops', icon: '🐳', yearsExperience: 2, projects: 10 },
      { name: 'AWS', proficiency: 75, category: 'devops', icon: '☁️', yearsExperience: 1, projects: 5 },
      { name: 'Kubernetes', proficiency: 70, category: 'devops', icon: '⚙️', yearsExperience: 1, projects: 3 },
      { name: 'CI/CD', proficiency: 80, category: 'devops', icon: '🔄', yearsExperience: 2, projects: 8 },
      { name: 'Linux', proficiency: 85, category: 'devops', icon: '🐧', yearsExperience: 3, projects: 15 },
      { name: 'Nginx', proficiency: 75, category: 'devops', icon: '🔧', yearsExperience: 2, projects: 6 }
    ]
  },
  {
    name: 'ai',
    title: 'AI & Machine Learning',
    description: 'Intelligent systems & automation',
    color: '#8b5cf6',
    skills: [
      { name: 'Ollama Integration', proficiency: 90, category: 'ai', icon: '🤖', yearsExperience: 1, projects: 3 },
      { name: 'OpenAI API', proficiency: 85, category: 'ai', icon: '🧠', yearsExperience: 1, projects: 4 },
      { name: 'Computer Vision', proficiency: 75, category: 'ai', icon: '👁️', yearsExperience: 1, projects: 2 },
      { name: 'Natural Language Processing', proficiency: 80, category: 'ai', icon: '💬', yearsExperience: 1, projects: 3 },
      { name: 'TensorFlow', proficiency: 70, category: 'ai', icon: '📊', yearsExperience: 1, projects: 2 },
      { name: 'PyTorch', proficiency: 65, category: 'ai', icon: '🔥', yearsExperience: 1, projects: 1 }
    ]
  },
  {
    name: 'tools',
    title: 'Tools & Productivity',
    description: 'Development workflow & collaboration',
    color: '#ef4444',
    skills: [
      { name: 'Git', proficiency: 95, category: 'tools', icon: '📝', yearsExperience: 4, projects: 25 },
      { name: 'VS Code', proficiency: 95, category: 'tools', icon: '💻', yearsExperience: 4, projects: 25 },
      { name: 'Figma', proficiency: 80, category: 'tools', icon: '🎨', yearsExperience: 2, projects: 8 },
      { name: 'Postman', proficiency: 90, category: 'tools', icon: '📮', yearsExperience: 3, projects: 15 },
      { name: 'Jest', proficiency: 80, category: 'tools', icon: '🃏', yearsExperience: 2, projects: 10 },
      { name: 'Webpack', proficiency: 75, category: 'tools', icon: '📦', yearsExperience: 2, projects: 8 }
    ]
  }
];

const experienceData = [
  { number: '4+', label: 'Years Coding' },
  { number: '25+', label: 'Projects Built' },
  { number: '15+', label: 'Technologies' },
  { number: '1000+', label: 'Git Commits' }
];

const proficiencyLevels = [
  { range: '90-100%', label: 'Expert', color: '#10b981' },
  { range: '75-89%', label: 'Advanced', color: '#667eea' },
  { range: '60-74%', label: 'Proficient', color: '#f59e0b' },
  { range: '< 60%', label: 'Learning', color: '#ef4444' }
];

// Component
const SkillsVisualization: React.FC = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState<string>('frontend');
  const [animationDelay, setAnimationDelay] = useState(0);

  const activeSkills = useMemo(() => {
    return skillCategories.find(cat => cat.name === activeCategory) || skillCategories[0];
  }, [activeCategory]);

  useEffect(() => {
    setAnimationDelay(Date.now());
  }, [activeCategory]);

  const getProficiencyColor = (proficiency: number): string => {
    if (proficiency >= 90) return '#10b981';
    if (proficiency >= 75) return '#667eea';
    if (proficiency >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SkillsSection id="skills">
      <SkillsContainer>
        <SkillsHeader>
          <SkillsTitle>Technical Expertise</SkillsTitle>
          <SkillsSubtitle>
            Comprehensive skills across the full development stack, with deep expertise in modern 
            web technologies, AI integration, and scalable architecture design.
          </SkillsSubtitle>
          
          <ExperienceSummary>
            {experienceData.map((item, index) => (
              <ExperienceCard key={item.label} style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <ExperienceNumber>{item.number}</ExperienceNumber>
                <ExperienceLabel>{item.label}</ExperienceLabel>
              </ExperienceCard>
            ))}
          </ExperienceSummary>
        </SkillsHeader>

        <CategoryTabs>
          {skillCategories.map((category) => (
            <CategoryTab
              key={category.name}
              active={activeCategory === category.name}
              color={category.color}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.title}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <SkillsGrid>
          <SkillCard>
            <h3 style={{ 
              color: activeSkills.color, 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              {activeSkills.title}
            </h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              {activeSkills.description}
            </p>
            
            {activeSkills.skills.map((skill, index) => (
              <SkillItem key={skill.name}>
                <SkillHeader>
                  <SkillInfo>
                    <SkillName>
                      {skill.icon} {skill.name}
                    </SkillName>
                    <SkillMeta>
                      <span>{skill.yearsExperience}+ years</span>
                      <span>{skill.projects}+ projects</span>
                    </SkillMeta>
                  </SkillInfo>
                  <SkillProficiency color={getProficiencyColor(skill.proficiency)}>
                    {skill.proficiency}%
                  </SkillProficiency>
                </SkillHeader>
                <SkillProgressBar>
                  <SkillProgressFill
                    proficiency={skill.proficiency}
                    color={getProficiencyColor(skill.proficiency)}
                    delay={index * 0.1}
                    key={`${skill.name}-${animationDelay}`}
                  />
                </SkillProgressBar>
              </SkillItem>
            ))}
          </SkillCard>
        </SkillsGrid>

        <ProficiencyLegend>
          {proficiencyLevels.map((level) => (
            <LegendItem key={level.label}>
              <LegendDot color={level.color} />
              <span>{level.label} ({level.range})</span>
            </LegendItem>
          ))}
        </ProficiencyLegend>
      </SkillsContainer>
    </SkillsSection>
  );
});

export default React.memo(SkillsVisualization);
