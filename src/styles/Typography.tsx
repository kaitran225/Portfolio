import styled, { css } from 'styled-components';

// ============= PROFESSIONAL TYPOGRAPHY SYSTEM =============
// Based on Material Design 3 and WCAG 2.1 guidelines for accessibility

// Typography Scale following Material Design 3
export const TypographyScale = {
  // Display styles - For hero sections and major headings
  displayLarge: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(3.5rem, 8vw, 5.7rem);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.25px;
  `,
  displayMedium: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    font-weight: 400;
    line-height: 1.16;
    letter-spacing: 0px;
  `,
  displaySmall: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(2.25rem, 5vw, 3.6rem);
    font-weight: 400;
    line-height: 1.22;
    letter-spacing: 0px;
  `,

  // Headline styles - For section headers and important content
  headlineLarge: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(1.75rem, 4vw, 2rem);
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: 0px;
  `,
  headlineMedium: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(1.5rem, 3.5vw, 1.75rem);
    font-weight: 400;
    line-height: 1.29;
    letter-spacing: 0px;
  `,
  headlineSmall: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: 400;
    line-height: 1.33;
    letter-spacing: 0px;
  `,

  // Title styles - For component headers and card titles
  titleLarge: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(1.125rem, 2.5vw, 1.375rem);
    font-weight: 500;
    line-height: 1.27;
    letter-spacing: 0px;
  `,
  titleMedium: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(1rem, 2vw, 1rem);
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.15px;
  `,
  titleSmall: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(0.875rem, 1.8vw, 0.875rem);
    font-weight: 500;
    line-height: 1.43;
    letter-spacing: 0.1px;
  `,

  // Label styles - For form labels, button text, and captions
  labelLarge: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.43;
    letter-spacing: 0.1px;
  `,
  labelMedium: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.33;
    letter-spacing: 0.5px;
  `,
  labelSmall: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1.45;
    letter-spacing: 0.5px;
  `,

  // Body styles - For main content and paragraphs
  bodyLarge: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(0.875rem, 2vw, 1rem);
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.5px;
  `,
  bodyMedium: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: clamp(0.75rem, 1.8vw, 0.875rem);
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: 0.25px;
  `,
  bodySmall: css`
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.33;
    letter-spacing: 0.4px;
  `,
};

// Professional Color Variants for Text
export const TextColors = {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  muted: 'var(--color-text-muted)',
  accent: 'var(--color-purple-primary)',
  success: '#2ed573',
  warning: '#ffa502',
  error: '#ff4757',
  inverse: 'var(--color-text-inverse)',
};

// Typography Components
export const DisplayLarge = styled.h1`
  ${TypographyScale.displayLarge}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 1.5rem 0;
`;

export const DisplayMedium = styled.h1`
  ${TypographyScale.displayMedium}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 1.25rem 0;
`;

export const DisplaySmall = styled.h1`
  ${TypographyScale.displaySmall}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 1rem 0;
`;

export const HeadlineLarge = styled.h2`
  ${TypographyScale.headlineLarge}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 1rem 0;
`;

export const HeadlineMedium = styled.h2`
  ${TypographyScale.headlineMedium}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 0.875rem 0;
`;

export const HeadlineSmall = styled.h3`
  ${TypographyScale.headlineSmall}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 0.75rem 0;
`;

export const TitleLarge = styled.h3`
  ${TypographyScale.titleLarge}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 0.75rem 0;
`;

export const TitleMedium = styled.h4`
  ${TypographyScale.titleMedium}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 0.5rem 0;
`;

export const TitleSmall = styled.h5`
  ${TypographyScale.titleSmall}
  color: ${props => props.color || TextColors.primary};
  margin: 0 0 0.5rem 0;
`;

export const BodyLarge = styled.p`
  ${TypographyScale.bodyLarge}
  color: ${props => props.color || TextColors.secondary};
  margin: 0 0 1rem 0;
`;

export const BodyMedium = styled.p`
  ${TypographyScale.bodyMedium}
  color: ${props => props.color || TextColors.secondary};
  margin: 0 0 0.875rem 0;
`;

export const BodySmall = styled.p`
  ${TypographyScale.bodySmall}
  color: ${props => props.color || TextColors.muted};
  margin: 0 0 0.75rem 0;
`;

export const LabelLarge = styled.span`
  ${TypographyScale.labelLarge}
  color: ${props => props.color || TextColors.primary};
`;

export const LabelMedium = styled.span`
  ${TypographyScale.labelMedium}
  color: ${props => props.color || TextColors.secondary};
`;

export const LabelSmall = styled.span`
  ${TypographyScale.labelSmall}
  color: ${props => props.color || TextColors.muted};
`;

// Professional Link Styles
export const ProfessionalLink = styled.a`
  ${TypographyScale.labelLarge}
  color: var(--color-purple-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--color-purple-secondary);
    border-bottom-color: var(--color-purple-secondary);
  }
  
  &:focus {
    outline: 2px solid var(--color-purple-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

// Accessibility Features
export const AccessibleText = styled.span<{ 
  level?: 'AA' | 'AAA';
  size?: 'small' | 'normal' | 'large';
}>`
  ${props => {
    switch (props.size) {
      case 'small': return TypographyScale.bodySmall;
      case 'large': return TypographyScale.bodyLarge;
      default: return TypographyScale.bodyMedium;
    }
  }}
  
  color: var(--color-text-primary);
  
  /* Ensure minimum contrast ratios for accessibility */
  ${props => props.level === 'AAA' && css`
    font-weight: 500;
    color: var(--color-text-primary);
  `}
`;

// Professional Code Typography
export const CodeText = styled.code`
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 400;
  background: rgba(105, 51, 255, 0.1);
  color: var(--color-purple-primary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  letter-spacing: 0;
`;

export const CodeBlock = styled.pre`
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 400;
  background: var(--background-secondary);
  color: var(--color-text-primary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow-x: auto;
  line-height: 1.5;
  letter-spacing: 0;
  margin: 1rem 0;
`;

// Resume/CV Specific Typography
export const ResumeHeading = styled.h2`
  ${TypographyScale.headlineMedium}
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-purple-primary);
  padding-bottom: 0.5rem;
  margin: 2rem 0 1rem 0;
`;

export const ResumeSubheading = styled.h3`
  ${TypographyScale.titleLarge}
  color: var(--color-purple-primary);
  margin: 1.5rem 0 0.5rem 0;
`;

export const ResumeBody = styled.p`
  ${TypographyScale.bodyMedium}
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

export const ResumeDate = styled.span`
  ${TypographyScale.labelMedium}
  color: var(--color-text-muted);
  font-style: italic;
`;

// HR-Optimized Professional Formatting
export const ProfessionalCard = styled.div`
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: var(--shadow-soft);
  
  h3 {
    ${TypographyScale.titleLarge}
    color: var(--color-text-primary);
    margin: 0 0 0.5rem 0;
  }
  
  p {
    ${TypographyScale.bodyMedium}
    color: var(--color-text-secondary);
    margin: 0 0 0.75rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// Export all typography utilities
export default {
  DisplayLarge,
  DisplayMedium,
  DisplaySmall,
  HeadlineLarge,
  HeadlineMedium,
  HeadlineSmall,
  TitleLarge,
  TitleMedium,
  TitleSmall,
  BodyLarge,
  BodyMedium,
  BodySmall,
  LabelLarge,
  LabelMedium,
  LabelSmall,
  ProfessionalLink,
  AccessibleText,
  CodeText,
  CodeBlock,
  ResumeHeading,
  ResumeSubheading,
  ResumeBody,
  ResumeDate,
  ProfessionalCard,
  TypographyScale,
  TextColors,
};
