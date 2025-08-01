import { css } from 'styled-components';

// ============= ADVANCED RESPONSIVE DESIGN SYSTEM =============

// Enhanced breakpoint system
export const breakpoints = {
  xs: '320px',    // Small phones
  sm: '480px',    // Large phones
  md: '768px',    // Tablets
  lg: '1024px',   // Small laptops
  xl: '1200px',   // Large laptops
  xxl: '1440px',  // Desktop
  xxxl: '1920px', // Large desktop
} as const;

// Container max-widths for each breakpoint
export const containerSizes = {
  xs: '100%',
  sm: '100%',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  xxl: '1320px',
  xxxl: '1400px',
} as const;

// Spacing scale (8px grid system)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
  xxxxl: '96px',
} as const;

// Typography scale with responsive adjustments
export const typography = {
  // Display styles (Hero sections)
  display1: {
    fontSize: {
      xs: '2.5rem',
      md: '3.5rem',
      xl: '4.5rem'
    },
    lineHeight: {
      xs: '1.1',
      md: '1.1',
      xl: '1.1'
    },
    fontWeight: 800,
  },
  display2: {
    fontSize: {
      xs: '2rem',
      md: '2.75rem',
      xl: '3.5rem'
    },
    lineHeight: '1.2',
    fontWeight: 700,
  },
  
  // Heading styles
  h1: {
    fontSize: {
      xs: '1.75rem',
      md: '2.25rem',
      xl: '2.75rem'
    },
    lineHeight: '1.3',
    fontWeight: 600,
  },
  h2: {
    fontSize: {
      xs: '1.5rem',
      md: '1.875rem',
      xl: '2.25rem'
    },
    lineHeight: '1.3',
    fontWeight: 600,
  },
  h3: {
    fontSize: {
      xs: '1.25rem',
      md: '1.5rem',
      xl: '1.875rem'
    },
    lineHeight: '1.4',
    fontWeight: 600,
  },
  h4: {
    fontSize: {
      xs: '1.125rem',
      md: '1.25rem',
      xl: '1.5rem'
    },
    lineHeight: '1.4',
    fontWeight: 500,
  },
  
  // Body text
  body1: {
    fontSize: {
      xs: '1rem',
      md: '1.125rem',
    },
    lineHeight: '1.6',
    fontWeight: 400,
  },
  body2: {
    fontSize: {
      xs: '0.875rem',
      md: '1rem',
    },
    lineHeight: '1.5',
    fontWeight: 400,
  },
  
  // Interface text
  button: {
    fontSize: {
      xs: '0.875rem',
      md: '1rem',
    },
    lineHeight: '1.2',
    fontWeight: 600,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: 400,
  },
} as const;

// Media query helpers
export const media = {
  up: (breakpoint: keyof typeof breakpoints) => (styles: any) => css`
    @media (min-width: ${breakpoints[breakpoint]}) {
      ${styles}
    }
  `,
  down: (breakpoint: keyof typeof breakpoints) => (styles: any) => css`
    @media (max-width: ${breakpoints[breakpoint]}) {
      ${styles}
    }
  `,
  between: (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => (styles: any) => css`
    @media (min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]}) {
      ${styles}
    }
  `,
  only: (breakpoint: keyof typeof breakpoints) => (styles: any) => {
    const breakpointKeys = Object.keys(breakpoints) as (keyof typeof breakpoints)[];
    const index = breakpointKeys.indexOf(breakpoint);
    const nextBreakpoint = breakpointKeys[index + 1];
    
    if (nextBreakpoint) {
      return css`
        @media (min-width: ${breakpoints[breakpoint]}) and (max-width: ${breakpoints[nextBreakpoint]}) {
          ${styles}
        }
      `;
    } else {
      return css`
        @media (min-width: ${breakpoints[breakpoint]}) {
          ${styles}
        }
      `;
    }
  },
} as const;

// Container mixin with responsive behavior
export const container = css`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${spacing.md};
  
  @media (min-width: ${breakpoints.sm}) {
    padding: 0 ${spacing.lg};
  }
  
  @media (min-width: ${breakpoints.md}) {
    max-width: ${containerSizes.md};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    max-width: ${containerSizes.lg};
  }
  
  @media (min-width: ${breakpoints.xl}) {
    max-width: ${containerSizes.xl};
  }
  
  @media (min-width: ${breakpoints.xxl}) {
    max-width: ${containerSizes.xxl};
  }
`;

// Responsive grid system
export const grid = {
  container: css`
    display: grid;
    gap: ${spacing.md};
    
    ${media.up('md')} {
      gap: ${spacing.lg};
    }
    
    ${media.up('xl')} {
      gap: ${spacing.xl};
    }
  `,
  
  columns: (
    xs: number = 1,
    sm?: number,
    md?: number,
    lg?: number,
    xl?: number
  ) => css`
    grid-template-columns: repeat(${xs}, 1fr);
    
    ${sm && media.up('sm')} {
      grid-template-columns: repeat(${sm}, 1fr);
    }
    
    ${md && media.up('md')} {
      grid-template-columns: repeat(${md}, 1fr);
    }
    
    ${lg && media.up('lg')} {
      grid-template-columns: repeat(${lg}, 1fr);
    }
    
    ${xl && media.up('xl')} {
      grid-template-columns: repeat(${xl}, 1fr);
    }
  `,
  
  autoFit: (minWidth: string = '300px') => css`
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
  `,
  
  autoFill: (minWidth: string = '300px') => css`
    grid-template-columns: repeat(auto-fill, minmax(${minWidth}, 1fr));
  `,
};

// Flexible responsive spacing
export const responsiveSpacing = {
  padding: {
    section: css`
      padding: ${spacing.xl} 0;
      
      ${media.up('md')} {
        padding: ${spacing.xxl} 0;
      }
      
      ${media.up('xl')} {
        padding: ${spacing.xxxl} 0;
      }
    `,
    
    container: css`
      padding: 0 ${spacing.md};
      
      ${media.up('md')} {
        padding: 0 ${spacing.lg};
      }
      
      ${media.up('xl')} {
        padding: 0 ${spacing.xl};
      }
    `,
  },
  
  margin: {
    section: css`
      margin-bottom: ${spacing.xl};
      
      ${media.up('md')} {
        margin-bottom: ${spacing.xxl};
      }
    `,
    
    element: css`
      margin-bottom: ${spacing.md};
      
      ${media.up('md')} {
        margin-bottom: ${spacing.lg};
      }
    `,
  },
};

// Responsive typography mixin
export const responsiveTypography = (variant: keyof typeof typography) => {
  const typeConfig = typography[variant];
  
  return css`
    font-weight: ${typeConfig.fontWeight};
    line-height: ${typeof typeConfig.lineHeight === 'object' 
      ? (typeConfig.lineHeight as any).xs 
      : typeConfig.lineHeight};
    
    font-size: ${typeof typeConfig.fontSize === 'object' 
      ? (typeConfig.fontSize as any).xs 
      : typeConfig.fontSize};
    
    ${typeof typeConfig.fontSize === 'object' && (typeConfig.fontSize as any).md && css`
      @media (min-width: ${breakpoints.md}) {
        font-size: ${(typeConfig.fontSize as any).md};
        ${typeof typeConfig.lineHeight === 'object' && (typeConfig.lineHeight as any).md && css`
          line-height: ${(typeConfig.lineHeight as any).md};
        `}
      }
    `}
    
    ${typeof typeConfig.fontSize === 'object' && (typeConfig.fontSize as any).xl && css`
      @media (min-width: ${breakpoints.xl}) {
        font-size: ${(typeConfig.fontSize as any).xl};
        ${typeof typeConfig.lineHeight === 'object' && (typeConfig.lineHeight as any).xl && css`
          line-height: ${(typeConfig.lineHeight as any).xl};
        `}
      }
    `}
  `;
};

// Mobile-first utilities
export const mobile = {
  stack: css`
    display: flex;
    flex-direction: column;
    gap: ${spacing.md};
    
    ${media.up('md')} {
      flex-direction: row;
      align-items: center;
    }
  `,
  
  center: css`
    text-align: center;
    
    ${media.up('md')} {
      text-align: left;
    }
  `,
  
  hideOn: (breakpoint: keyof typeof breakpoints) => css`
    ${media.up(breakpoint)} {
      display: none;
    }
  `,
  
  showOn: (breakpoint: keyof typeof breakpoints) => css`
    display: none;
    
    ${media.up(breakpoint)} {
      display: block;
    }
  `,
};

// Touch-friendly sizing for mobile
export const touch = {
  target: css`
    min-height: 44px;
    min-width: 44px;
    
    ${media.up('md')} {
      min-height: 32px;
      min-width: 32px;
    }
  `,
  
  spacing: css`
    margin: ${spacing.sm};
    
    ${media.up('md')} {
      margin: ${spacing.xs};
    }
  `,
};

// Performance-optimized responsive images
export const responsiveImage = css`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  /* Aspect ratio container for layout stability */
  aspect-ratio: 16 / 9;
  
  /* Optimize for different screen densities */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
  
  /* Prevent layout shift */
  content-visibility: auto;
  contain-intrinsic-size: 300px 200px;
`;

// Responsive card layout
export const responsiveCard = css`
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--card-border);
  padding: ${spacing.md};
  
  ${media.up('md')} {
    padding: ${spacing.lg};
    border-radius: 16px;
  }
  
  ${media.up('xl')} {
    padding: ${spacing.xl};
  }
`;

// Export all utilities
export const responsive = {
  breakpoints,
  containerSizes,
  spacing,
  typography,
  media,
  container,
  grid,
  responsiveSpacing,
  responsiveTypography,
  mobile,
  touch,
  responsiveImage,
  responsiveCard,
};

export default responsive;
