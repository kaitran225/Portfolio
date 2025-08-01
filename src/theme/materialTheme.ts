import { createTheme, ThemeOptions } from '@mui/material/styles';

// Material Design 3 Color Tokens
export const colorTokens = {
  // Primary Colors
  primary: {
    0: '#000000',
    10: '#001B3D',
    20: '#003258',
    25: '#003F66',
    30: '#004A77',
    35: '#00568A',
    40: '#00639B',
    50: '#0080C7',
    60: '#339DEB',
    70: '#5FB8FF',
    80: '#88D3FF',
    90: '#B8E7FF',
    95: '#DCF3FF',
    98: '#F6FBFF',
    99: '#FDFBFF',
    100: '#FFFFFF',
  },
  
  // Secondary Colors  
  secondary: {
    0: '#000000',
    10: '#0F1419',
    20: '#252A2F',
    25: '#30353A',
    30: '#3C4146',
    35: '#484D52',
    40: '#54595F',
    50: '#6D7278',
    60: '#878C93',
    70: '#A1A6AD',
    80: '#BDC1C8',
    90: '#D9DDE4',
    95: '#E7EBF2',
    98: '#F6FAFE',
    99: '#FAFCFF',
    100: '#FFFFFF',
  },
  
  // Tertiary Colors
  tertiary: {
    0: '#000000',
    10: '#2E1500',
    20: '#4A2800',
    25: '#583100',
    30: '#663A00',
    35: '#754400',
    40: '#844E00',
    50: '#A46200',
    60: '#C47C00',
    70: '#E59700',
    80: '#FFB648',
    90: '#FFCF70',
    95: '#FFEBB8',
    98: '#FFF8F0',
    99: '#FFFCF8',
    100: '#FFFFFF',
  },
  
  // Error Colors
  error: {
    0: '#000000',
    10: '#410002',
    20: '#690005',
    25: '#7E0007',
    30: '#93000A',
    35: '#A80710',
    40: '#BA1A1A',
    50: '#DE3730',
    60: '#FF5449',
    70: '#FF897D',
    80: '#FFB4AB',
    90: '#FFDAD6',
    95: '#FFEDEA',
    98: '#FFF8F7',
    99: '#FFFBFF',
    100: '#FFFFFF',
  },
  
  // Neutral Colors
  neutral: {
    0: '#000000',
    4: '#0F0F13',
    6: '#141318',
    10: '#1A1C1E',
    12: '#1F1F23',
    17: '#2A2A2E',
    20: '#2E3133',
    22: '#333438',
    24: '#38393D',
    25: '#3A3B3F',
    30: '#454649',
    35: '#515154',
    40: '#5D5E62',
    50: '#757679',
    60: '#8F9092',
    70: '#AAABAED',
    80: '#C6C6CA',
    87: '#D6D6DA',
    90: '#E2E2E6',
    92: '#E9E9ED',
    94: '#EFEFF3',
    95: '#F1F1F5',
    96: '#F4F4F8',
    98: '#F9F9FD',
    99: '#FDFBFF',
    100: '#FFFFFF',
  },
  
  // Neutral Variant Colors
  neutralVariant: {
    0: '#000000',
    10: '#16191C',
    20: '#2B2E31',
    25: '#36393C',
    30: '#424448',
    35: '#4E5054',
    40: '#5A5C60',
    50: '#737579',
    60: '#8D8F93',
    70: '#A7AAAE',
    80: '#C3C5CA',
    90: '#DFE1E6',
    95: '#EDEFFD4',
    98: '#F6F8FA',
    99: '#FAFCFF',
    100: '#FFFFFF',
  }
};

// Material Design 3 Typography Scale
export const typographyTokens = {
  // Display styles
  displayLarge: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '57px',
    fontWeight: 400,
    lineHeight: '64px',
    letterSpacing: '-0.25px',
  },
  displayMedium: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '45px',
    fontWeight: 400,
    lineHeight: '52px',
    letterSpacing: '0px',
  },
  displaySmall: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '36px',
    fontWeight: 400,
    lineHeight: '44px',
    letterSpacing: '0px',
  },
  
  // Headline styles
  headlineLarge: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '32px',
    fontWeight: 500,
    lineHeight: '40px',
    letterSpacing: '0px',
  },
  headlineMedium: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '28px',
    fontWeight: 500,
    lineHeight: '36px',
    letterSpacing: '0px',
  },
  headlineSmall: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '24px',
    fontWeight: 500,
    lineHeight: '32px',
    letterSpacing: '0px',
  },
  
  // Title styles
  titleLarge: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '22px',
    fontWeight: 500,
    lineHeight: '28px',
    letterSpacing: '0px',
  },
  titleMedium: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '0.15px',
  },
  titleSmall: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  
  // Label styles
  labelLarge: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  labelMedium: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
  labelSmall: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0.25px',
  },
  bodySmall: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },
};

// Create Material Design 3 Theme
export const createMaterialTheme = (mode: 'light' | 'dark' = 'light'): ThemeOptions => {
  const isLight = mode === 'light';
  
  return {
    palette: {
      mode,
      primary: {
        main: isLight ? colorTokens.primary[40] : colorTokens.primary[80],
        light: isLight ? colorTokens.primary[30] : colorTokens.primary[70],
        dark: isLight ? colorTokens.primary[50] : colorTokens.primary[90],
        contrastText: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      secondary: {
        main: isLight ? colorTokens.secondary[40] : colorTokens.secondary[80],
        light: isLight ? colorTokens.secondary[30] : colorTokens.secondary[70],
        dark: isLight ? colorTokens.secondary[50] : colorTokens.secondary[90],
        contrastText: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      tertiary: {
        main: isLight ? colorTokens.tertiary[40] : colorTokens.tertiary[80],
        light: isLight ? colorTokens.tertiary[30] : colorTokens.tertiary[70],
        dark: isLight ? colorTokens.tertiary[50] : colorTokens.tertiary[90],
        contrastText: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      error: {
        main: isLight ? colorTokens.error[40] : colorTokens.error[80],
        light: isLight ? colorTokens.error[30] : colorTokens.error[70],
        dark: isLight ? colorTokens.error[50] : colorTokens.error[90],
        contrastText: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      warning: {
        main: isLight ? colorTokens.tertiary[40] : colorTokens.tertiary[80],
        light: isLight ? colorTokens.tertiary[30] : colorTokens.tertiary[70],
        dark: isLight ? colorTokens.tertiary[50] : colorTokens.tertiary[90],
        contrastText: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      info: {
        main: isLight ? colorTokens.primary[40] : colorTokens.primary[80],
        light: isLight ? colorTokens.primary[30] : colorTokens.primary[70],
        dark: isLight ? colorTokens.primary[50] : colorTokens.primary[90],
        contrastText: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      success: {
        main: '#0D8943',
        light: '#4CAF50',
        dark: '#2E7D32',
        contrastText: colorTokens.neutral[99],
      },
      background: {
        default: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
        paper: isLight ? colorTokens.neutral[99] : colorTokens.neutral[12],
      },
      surface: {
        main: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
      },
      text: {
        primary: isLight ? colorTokens.neutral[10] : colorTokens.neutral[90],
        secondary: isLight ? colorTokens.neutral[30] : colorTokens.neutral[80],
        disabled: isLight ? colorTokens.neutral[50] : colorTokens.neutral[60],
      },
      divider: isLight ? colorTokens.neutralVariant[80] : colorTokens.neutralVariant[30],
      action: {
        active: isLight ? colorTokens.neutral[30] : colorTokens.neutral[80],
        hover: isLight ? colorTokens.primary[95] : colorTokens.primary[20],
        selected: isLight ? colorTokens.primary[90] : colorTokens.primary[30],
        disabled: isLight ? colorTokens.neutral[70] : colorTokens.neutral[50],
        disabledBackground: isLight ? colorTokens.neutral[90] : colorTokens.neutral[20],
      },
    },
    
    typography: {
      fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
      ...typographyTokens,
      h1: typographyTokens.displayLarge,
      h2: typographyTokens.displayMedium,
      h3: typographyTokens.displaySmall,
      h4: typographyTokens.headlineLarge,
      h5: typographyTokens.headlineMedium,
      h6: typographyTokens.headlineSmall,
      subtitle1: typographyTokens.titleLarge,
      subtitle2: typographyTokens.titleMedium,
      body1: typographyTokens.bodyLarge,
      body2: typographyTokens.bodyMedium,
      caption: typographyTokens.bodySmall,
      button: typographyTokens.labelLarge,
      overline: typographyTokens.labelSmall,
    },
    
    shape: {
      borderRadius: 8, // Material Design 3 default border radius
    },
    
    spacing: 8, // 8px grid system
    
    shadows: [
      'none',
      // Elevation 1
      '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      // Elevation 2
      '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
      // Elevation 3
      '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
      // Elevation 4
      '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
      // Elevation 5
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      // Continue pattern for remaining elevations...
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
    ],
    
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            padding: '10px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isLight ? colorTokens.neutralVariant[90] : colorTokens.neutralVariant[30]}`,
          },
        },
      },
      
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          },
        },
      },
      
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? colorTokens.neutral[99] : colorTokens.neutral[10],
            color: isLight ? colorTokens.neutral[10] : colorTokens.neutral[90],
            boxShadow: `0px 1px 0px ${isLight ? colorTokens.neutralVariant[90] : colorTokens.neutralVariant[30]}`,
          },
        },
      },
      
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  };
};

// Theme instances
export const lightTheme = createTheme(createMaterialTheme('light'));
export const darkTheme = createTheme(createMaterialTheme('dark'));

// Export for type augmentation
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surface: Palette['primary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surface?: PaletteOptions['primary'];
  }
}

export default { lightTheme, darkTheme, colorTokens, typographyTokens };
