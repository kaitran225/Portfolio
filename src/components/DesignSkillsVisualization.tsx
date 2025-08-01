import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= DESIGN PORTFOLIO ENHANCED SKILLS VISUALIZATION =============

interface DesignSkill {
  name: string;
  category: 'visual' | 'digital' | 'tools' | 'soft-skills';
  proficiency: number; // 1-5 scale
  years: number;
  projects: number;
  icon?: string;
}

interface DesignSkillsVisualizationProps {
  className?: string;
}

// Sample design skills data - this should come from portfolioDataService
const designSkills: DesignSkill[] = [
  // Visual Design
  { name: 'Brand Identity', category: 'visual', proficiency: 5, years: 3, projects: 12, icon: '🎨' },
  { name: 'Logo Design', category: 'visual', proficiency: 5, years: 3, projects: 15, icon: '✏️' },
  { name: 'Typography', category: 'visual', proficiency: 4, years: 2, projects: 20, icon: '🔤' },
  { name: 'Color Theory', category: 'visual', proficiency: 4, years: 2, projects: 18, icon: '🎨' },
  { name: 'Layout Design', category: 'visual', proficiency: 5, years: 3, projects: 25, icon: '📐' },
  
  // Digital Design  
  { name: 'UI/UX Design', category: 'digital', proficiency: 4, years: 2, projects: 8, icon: '📱' },
  { name: 'Web Design', category: 'digital', proficiency: 4, years: 2, projects: 10, icon: '💻' },
  { name: 'Mobile Design', category: 'digital', proficiency: 4, years: 1, projects: 6, icon: '📲' },
  { name: 'Prototyping', category: 'digital', proficiency: 4, years: 2, projects: 12, icon: '🔧' },
  { name: 'User Research', category: 'digital', proficiency: 3, years: 1, projects: 5, icon: '🔍' },

  // Tools
  { name: 'Adobe Photoshop', category: 'tools', proficiency: 5, years: 3, projects: 30, icon: '🎭' },
  { name: 'Adobe Illustrator', category: 'tools', proficiency: 5, years: 3, projects: 25, icon: '✨' },
  { name: 'Adobe InDesign', category: 'tools', proficiency: 4, years: 2, projects: 15, icon: '📑' },
  { name: 'Figma', category: 'tools', proficiency: 4, years: 2, projects: 12, icon: '🎯' },
  { name: 'Sketch', category: 'tools', proficiency: 3, years: 1, projects: 8, icon: '⚡' },

  // Soft Skills
  { name: 'Creative Thinking', category: 'soft-skills', proficiency: 5, years: 3, projects: 30, icon: '💡' },
  { name: 'Client Communication', category: 'soft-skills', proficiency: 4, years: 2, projects: 20, icon: '💬' },
  { name: 'Project Management', category: 'soft-skills', proficiency: 4, years: 2, projects: 15, icon: '📊' },
  { name: 'Problem Solving', category: 'soft-skills', proficiency: 5, years: 3, projects: 25, icon: '🧩' },
  { name: 'Team Collaboration', category: 'soft-skills', proficiency: 4, years: 2, projects: 18, icon: '🤝' }
];

const categoryLabels = {
  'visual': 'Visual Design',
  'digital': 'Digital Design',
  'tools': 'Design Tools',
  'soft-skills': 'Soft Skills'
};

const categoryColors = {
  'visual': '#ff6b6b',      // Coral for visual design
  'digital': '#4ecdc4',     // Teal for digital design  
  'tools': '#45b7d1',      // Blue for tools
  'soft-skills': '#96ceb4'  // Green for soft skills
};

// ============= ANIMATIONS =============

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

const progressAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// ============= STYLED COMPONENTS =============

const SkillsContainer = styled.div`
  padding: 4rem 2rem;
  background: transparent;
  min-height: 100vh;
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SkillsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff6b6b 50%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.9;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const FilterButton = styled.button<{ $active: boolean; $color: string }>`
  background: ${props => props.$active ? props.$color : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  border: 2px solid ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.$color};
    color: white;
    border-color: ${props => props.$color};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => props.$color}40;
  }

  &:active {
    transform: translateY(0);
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SkillCard = styled.div<{ $category: string; $delay: number }>`
  background: transparent;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.8s ease-out ${props => props.$delay}s both;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background: transparent;
    border-color: #ff6b6b;
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.2);

    &:before {
      transform: scaleX(1);
    }

    .skill-icon {
      animation: ${float} 2s ease-in-out infinite;
    }
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SkillIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const SkillMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #888;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProgressContainer = styled.div`
  margin-bottom: 1rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProficiencyLevel = styled.span<{ $level: number }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => {
    if (props.$level >= 5) return '#4CAF50';
    if (props.$level >= 4) return '#2196F3';
    if (props.$level >= 3) return '#FF9800';
    return '#9E9E9E';
  }};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string; $delay: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.$color}, ${props => props.$color}dd);
  border-radius: 4px;
  width: ${props => props.$percentage}%;
  animation: ${progressAnimation} 1s ease-out ${props => props.$delay}s both;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const SkillDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const DetailItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #888;
  font-size: 1.1rem;
`;

// ============= MAIN COMPONENT =============

const DesignSkillsVisualization: React.FC<DesignSkillsVisualizationProps> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredSkills = selectedCategory === 'all' 
    ? designSkills 
    : designSkills.filter(skill => skill.category === selectedCategory);

  const getProficiencyLabel = (level: number): string => {
    const labels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Beginner';
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <SkillsContainer className={className}>
      <SkillsHeader>
        <Title>Design Expertise</Title>
        <Subtitle>
          Comprehensive design skills developed through diverse projects, 
          from brand identity creation to digital user experiences
        </Subtitle>
      </SkillsHeader>

      <FilterContainer>
        <FilterButton
          $active={selectedCategory === 'all'}
          $color="#fff"
          onClick={() => handleCategoryFilter('all')}
        >
          All Skills
        </FilterButton>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <FilterButton
            key={key}
            $active={selectedCategory === key}
            $color={categoryColors[key as keyof typeof categoryColors]}
            onClick={() => handleCategoryFilter(key)}
          >
            {label}
          </FilterButton>
        ))}
      </FilterContainer>

      {filteredSkills.length > 0 ? (
        <SkillsGrid>
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.name}
              $category={skill.category}
              $delay={0.6 + (index * 0.1)}
            >
              <SkillHeader>
                <SkillIcon className="skill-icon">
                  {skill.icon}
                </SkillIcon>
                <SkillInfo>
                  <SkillName>{skill.name}</SkillName>
                  <SkillMeta>
                    <MetaItem>
                      📅 {skill.years} {skill.years === 1 ? 'year' : 'years'}
                    </MetaItem>
                    <MetaItem>
                      🎯 {skill.projects} projects
                    </MetaItem>
                  </SkillMeta>
                </SkillInfo>
              </SkillHeader>

              <ProgressContainer>
                <ProgressLabel>
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>Proficiency</span>
                  <ProficiencyLevel $level={skill.proficiency}>
                    {getProficiencyLabel(skill.proficiency)}
                  </ProficiencyLevel>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill
                    $percentage={(skill.proficiency / 5) * 100}
                    $color={categoryColors[skill.category as keyof typeof categoryColors]}
                    $delay={0.8 + (index * 0.1)}
                  />
                </ProgressBar>
              </ProgressContainer>

              <SkillDetails>
                <DetailItem>
                  <DetailValue>{skill.proficiency}/5</DetailValue>
                  <DetailLabel>Level</DetailLabel>
                </DetailItem>
                <DetailItem>
                  <DetailValue>{skill.years}y</DetailValue>
                  <DetailLabel>Experience</DetailLabel>
                </DetailItem>
                <DetailItem>
                  <DetailValue>{skill.projects}</DetailValue>
                  <DetailLabel>Projects</DetailLabel>
                </DetailItem>
              </SkillDetails>
            </SkillCard>
          ))}
        </SkillsGrid>
      ) : (
        <EmptyState>
          No skills found for the selected category.
        </EmptyState>
      )}
    </SkillsContainer>
  );
};

export default DesignSkillsVisualization;
