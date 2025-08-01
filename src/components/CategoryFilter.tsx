import React from 'react';
import styled from 'styled-components';

// Icon Components
const WebIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const BackendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
  </svg>
);

const BrandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const UIUXIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
  </svg>
);

const PrintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
  </svg>
);

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDevelopment?: boolean;
  projects: any[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  isDevelopment = true,
  projects 
}) => {
  if (isDevelopment) {
    return (
      <FilterContainer>
        <FilterButton
          $active={selectedCategory === 'all'}
          $isDesign={!isDevelopment}
          onClick={() => onCategoryChange('all')}
        >
          All Development Projects ({projects.filter(p => p.category === 'development').length})
        </FilterButton>
        <FilterButton
          $active={selectedCategory === 'development'}
          $isDesign={!isDevelopment}
          onClick={() => onCategoryChange('development')}
        >
          <WebIcon /> Web Applications ({projects.filter(p => p.category === 'development' && p.tags.some((tag: string) => tag.includes('React') || tag.includes('Next'))).length})
        </FilterButton>
        <FilterButton
          $active={selectedCategory === 'backend'}
          $isDesign={!isDevelopment}
          onClick={() => onCategoryChange('backend')}
        >
          <BackendIcon /> Backend & APIs ({projects.filter(p => p.category === 'development' && p.tags.some((tag: string) => tag.includes('Node') || tag.includes('API'))).length})
        </FilterButton>
      </FilterContainer>
    );
  }

  return (
    <FilterContainer>
      <FilterButton
        $active={selectedCategory === 'all'}
        $isDesign={!isDevelopment}
        onClick={() => onCategoryChange('all')}
      >
        All Designs ({projects.length})
      </FilterButton>
      <FilterButton
        $active={selectedCategory === 'branding'}
        $isDesign={!isDevelopment}
        onClick={() => onCategoryChange('branding')}
      >
        <BrandIcon /> Branding ({projects.filter(p => p.tags.some((tag: string) => tag.includes('Brand') || tag.includes('Logo'))).length})
      </FilterButton>
      <FilterButton
        $active={selectedCategory === 'ui-ux'}
        $isDesign={!isDevelopment}
        onClick={() => onCategoryChange('ui-ux')}
      >
        <UIUXIcon /> UI/UX ({projects.filter(p => p.tags.some((tag: string) => tag.includes('UI') || tag.includes('UX'))).length})
      </FilterButton>
      <FilterButton
        $active={selectedCategory === 'print'}
        $isDesign={!isDevelopment}
        onClick={() => onCategoryChange('print')}
      >
        <PrintIcon /> Print Design ({projects.filter(p => p.tags.some((tag: string) => tag.includes('Print') || tag.includes('Package'))).length})
      </FilterButton>
    </FilterContainer>
  );
};

// Styled Components
const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean; $isDesign?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$active 
    ? (props.$isDesign ? '#ff6b6b' : 'var(--color-purple-primary)') 
    : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  border: 2px solid ${props => props.$active 
    ? (props.$isDesign ? '#ff6b6b' : 'var(--color-purple-primary)') 
    : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  svg {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }
  
  &:hover {
    background: ${props => props.$isDesign ? '#ff6b6b' : 'var(--color-purple-primary)'};
    color: white;
    border-color: ${props => props.$isDesign ? '#ff6b6b' : 'var(--color-purple-primary)'};
    transform: translateY(-2px);
    
    svg {
      opacity: 1;
    }
  }
`;

export default CategoryFilter;
