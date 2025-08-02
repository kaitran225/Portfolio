import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCode, FiDatabase, FiLayers, FiTool, FiTrendingUp, FiStar } from './IconWrapper';

// ============= ENHANCED SKILLS VISUALIZATION =============

interface Skill {
  name: string;
  level: number; // 1-5
  experience: string; // "2+ years", "6 months", etc.
  projects: number;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'languages';
  icon?: string;
  lastUsed?: string;
  certified?: boolean;
}

interface SkillsVisualizationProps {
  className?: string;
}

const skillsData: Skill[] = [
  // Frontend
  { name: 'React', level: 5, experience: '2+ years', projects: 8, category: 'frontend', lastUsed: '2025-01', certified: false },
  { name: 'TypeScript', level: 5, experience: '1.5 years', projects: 6, category: 'frontend', lastUsed: '2025-01', certified: false },
  { name: 'JavaScript', level: 5, experience: '3+ years', projects: 12, category: 'frontend', lastUsed: '2025-01', certified: false },
  { name: 'HTML/CSS', level: 5, experience: '3+ years', projects: 15, category: 'frontend', lastUsed: '2025-01', certified: false },
  { name: 'Styled Components', level: 4, experience: '1 year', projects: 5, category: 'frontend', lastUsed: '2025-01', certified: false },
  { name: 'Three.js', level: 3, experience: '6 months', projects: 2, category: 'frontend', lastUsed: '2024-12', certified: false },
  
  // Backend
  { name: 'Node.js', level: 4, experience: '2 years', projects: 7, category: 'backend', lastUsed: '2025-01', certified: false },
  { name: 'Java', level: 4, experience: '2 years', projects: 6, category: 'backend', lastUsed: '2024-12', certified: false },
  { name: 'Spring Boot', level: 4, experience: '1.5 years', projects: 4, category: 'backend', lastUsed: '2024-12', certified: false },
  { name: 'Python', level: 4, experience: '1.5 years', projects: 5, category: 'backend', lastUsed: '2024-12', certified: false },
  { name: 'FastAPI', level: 3, experience: '6 months', projects: 2, category: 'backend', lastUsed: '2024-11', certified: false },
  { name: 'Express.js', level: 4, experience: '1.5 years', projects: 5, category: 'backend', lastUsed: '2024-12', certified: false },
  
  // Database
  { name: 'MySQL', level: 4, experience: '2 years', projects: 8, category: 'database', lastUsed: '2025-01', certified: false },
  { name: 'PostgreSQL', level: 3, experience: '1 year', projects: 3, category: 'database', lastUsed: '2024-10', certified: false },
  { name: 'MongoDB', level: 3, experience: '8 months', projects: 2, category: 'database', lastUsed: '2024-09', certified: false },
  
  // Tools
  { name: 'Docker', level: 4, experience: '1 year', projects: 6, category: 'tools', lastUsed: '2025-01', certified: false },
  { name: 'Git', level: 5, experience: '3+ years', projects: 20, category: 'tools', lastUsed: '2025-01', certified: false },
  { name: 'VS Code', level: 5, experience: '3+ years', projects: 20, category: 'tools', lastUsed: '2025-01', certified: false },
  { name: 'Postman', level: 4, experience: '2 years', projects: 10, category: 'tools', lastUsed: '2025-01', certified: false },
  { name: 'WebRTC', level: 3, experience: '6 months', projects: 2, category: 'tools', lastUsed: '2024-12', certified: false },
];

const categoryConfig = {
  frontend: { icon: FiCode, color: '#61DAFB', label: 'Frontend Development' },
  backend: { icon: FiDatabase, color: '#68D391', label: 'Backend Development' },
  database: { icon: FiLayers, color: '#F6AD55', label: 'Database Management' },
  tools: { icon: FiTool, color: '#FC8181', label: 'Development Tools' },
  languages: { icon: FiCode, color: '#9F7AEA', label: 'Programming Languages' }
};

const EnhancedSkillsVisualization: React.FC<SkillsVisualizationProps> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'level' | 'experience' | 'projects'>('level');

  const filteredSkills = skillsData
    .filter(skill => selectedCategory === 'all' || skill.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'level': return b.level - a.level;
        case 'projects': return b.projects - a.projects;
        case 'experience': return b.experience.localeCompare(a.experience);
        default: return 0;
      }
    });

  const categories = ['all', ...Object.keys(categoryConfig)];

  return (
    <SkillsContainer className={className}>
      <SkillsHeader>
        <Title>Technical Proficiency</Title>
        <Subtitle>
          Comprehensive skill assessment with real project experience and proficiency levels
        </Subtitle>
      </SkillsHeader>

      <FilterControls>
        <CategoryFilters>
          {categories.map(category => {
            const config = categoryConfig[category as keyof typeof categoryConfig];
            const Icon = config?.icon || FiStar;
            
            return (
              <CategoryButton
                key={category}
                $active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category !== 'all' && <Icon />}
                {category === 'all' ? 'All Skills' : config?.label || category}
              </CategoryButton>
            );
          })}
        </CategoryFilters>

        <SortControls>
          <SortLabel>Sort by:</SortLabel>
          <SortButton
            $active={sortBy === 'level'}
            onClick={() => setSortBy('level')}
          >
            Proficiency
          </SortButton>
          <SortButton
            $active={sortBy === 'projects'}
            onClick={() => setSortBy('projects')}
          >
            Projects
          </SortButton>
          <SortButton
            $active={sortBy === 'experience'}
            onClick={() => setSortBy('experience')}
          >
            Experience
          </SortButton>
        </SortControls>
      </FilterControls>

      <SkillsGrid>
        {filteredSkills.map((skill, index) => {
          const config = categoryConfig[skill.category];
          const Icon = config.icon;
          
          return (
            <SkillCard
              key={skill.name}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              $category={skill.category}
            >
              <SkillHeader>
                <SkillIcon $color={config.color}>
                  <Icon />
                </SkillIcon>
                <SkillInfo>
                  <SkillName>{skill.name}</SkillName>
                  <SkillCategory>{config.label}</SkillCategory>
                </SkillInfo>
                {skill.certified && (
                  <CertifiedBadge>
                    <FiStar />
                  </CertifiedBadge>
                )}
              </SkillHeader>

              <ProficiencySection>
                <ProficiencyLabel>
                  Proficiency Level
                  <ProficiencyText>{getLevelText(skill.level)}</ProficiencyText>
                </ProficiencyLabel>
                <ProficiencyBar>
                  <ProficiencyFill
                    as={motion.div}
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.level / 5) * 100}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
                    $level={skill.level}
                  />
                </ProficiencyBar>
              </ProficiencySection>

              <SkillMetrics>
                <Metric>
                  <MetricIcon>
                    <FiTrendingUp />
                  </MetricIcon>
                  <MetricValue>{skill.experience}</MetricValue>
                  <MetricLabel>Experience</MetricLabel>
                </Metric>

                <Metric>
                  <MetricIcon>
                    <FiLayers />
                  </MetricIcon>
                  <MetricValue>{skill.projects}</MetricValue>
                  <MetricLabel>Projects</MetricLabel>
                </Metric>
              </SkillMetrics>

              <LastUsed>
                Last used: {formatLastUsed(skill.lastUsed || '2024-12')}
              </LastUsed>
            </SkillCard>
          );
        })}
      </SkillsGrid>

      <SkillsSummary>
        <SummaryTitle>Skills Summary</SummaryTitle>
        <SummaryGrid>
          <SummaryItem>
            <SummaryNumber>{skillsData.length}</SummaryNumber>
            <SummaryLabel>Total Skills</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryNumber>{skillsData.filter(s => s.level >= 4).length}</SummaryNumber>
            <SummaryLabel>Advanced Skills</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryNumber>{skillsData.reduce((acc, s) => acc + s.projects, 0)}</SummaryNumber>
            <SummaryLabel>Total Projects</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryNumber>3+</SummaryNumber>
            <SummaryLabel>Years Experience</SummaryLabel>
          </SummaryItem>
        </SummaryGrid>
      </SkillsSummary>
    </SkillsContainer>
  );
};

// Helper functions
const getLevelText = (level: number): string => {
  switch (level) {
    case 5: return 'Expert';
    case 4: return 'Advanced';
    case 3: return 'Intermediate';
    case 2: return 'Beginner';
    case 1: return 'Learning';
    default: return 'Unknown';
  }
};

const formatLastUsed = (dateString: string): string => {
  const date = new Date(dateString + '-01');
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return 'This month';
  if (diffDays < 60) return 'Last month';
  if (diffDays < 90) return '2 months ago';
  return '3+ months ago';
};

// Styled Components
const SkillsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SkillsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: 2px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    border-color: var(--color-purple-primary);
    color: ${props => props.$active ? 'white' : 'var(--color-purple-primary)'};
  }

  svg {
    font-size: 1rem;
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.span`
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-right: 0.5rem;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;

  &:hover {
    border-color: var(--color-purple-primary);
    color: ${props => props.$active ? 'white' : 'var(--color-purple-primary)'};
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const SkillCard = styled.div<{ $category: string }>`
  background: var(--background-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-soft);

  &:hover {
    border-color: ${props => categoryConfig[props.$category as keyof typeof categoryConfig]?.color || 'var(--color-purple-primary)'};
    box-shadow: var(--shadow-medium);
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SkillIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const SkillCategory = styled.p`
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
`;

const CertifiedBadge = styled.div`
  background: #FFD700;
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProficiencySection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProficiencyLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const ProficiencyText = styled.span`
  color: var(--color-purple-primary);
  font-weight: 600;
`;

const ProficiencyBar = styled.div`
  height: 8px;
  background: var(--background-tertiary);
  border-radius: 4px;
  overflow: hidden;
`;

const ProficiencyFill = styled.div<{ $level: number }>`
  height: 100%;
  background: ${props => {
    if (props.$level >= 4) return 'linear-gradient(90deg, #2ed573, #1e90ff)';
    if (props.$level >= 3) return 'linear-gradient(90deg, #ffa502, #ff6348)';
    return 'linear-gradient(90deg, #747d8c, #57606f)';
  }};
  border-radius: 4px;
`;

const SkillMetrics = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricIcon = styled.div`
  color: var(--color-text-muted);
  font-size: 0.9rem;
`;

const MetricValue = styled.span`
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 0.9rem;
`;

const MetricLabel = styled.span`
  color: var(--color-text-muted);
  font-size: 0.8rem;
`;

const LastUsed = styled.div`
  color: var(--color-text-muted);
  font-size: 0.8rem;
  text-align: right;
`;

const SkillsSummary = styled.div`
  background: linear-gradient(135deg, rgba(105, 51, 255, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(105, 51, 255, 0.2);
`;

const SummaryTitle = styled.h3`
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryNumber = styled.div`
  color: var(--color-purple-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

export default EnhancedSkillsVisualization;
