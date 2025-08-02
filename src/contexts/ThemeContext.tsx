import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always default to light mode for professional appearance
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    }
    // Always default to light theme, ignoring system preference
    return 'light';
  });

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      // Light theme colors
      root.style.setProperty('--color-black-primary', '#FFFFFF');
      root.style.setProperty('--color-black-secondary', '#F8F9FA');
      root.style.setProperty('--color-black-tertiary', '#E9ECEF');
      root.style.setProperty('--color-gray-dark', '#6C757D');
      
      // Text colors for light theme
      root.style.setProperty('--color-text-primary', '#212529');
      root.style.setProperty('--color-text-secondary', '#495057');
      root.style.setProperty('--color-text-muted', '#6C757D');
      root.style.setProperty('--color-text-accent', '#6610F2');
      
      // Keep accent colors but adjust for light background
      root.style.setProperty('--color-purple-primary', '#6933FF');
      root.style.setProperty('--color-purple-secondary', '#7C4CFF');
      root.style.setProperty('--color-purple-light', '#8F66FF');
      root.style.setProperty('--color-purple-accent', '#A280FF');
      
      root.style.setProperty('--color-green-primary', '#28A745');
      root.style.setProperty('--color-green-secondary', '#F8F9FA');
      
      // Light theme specific colors
      root.style.setProperty('--color-design-primary', '#DC3545');
      root.style.setProperty('--color-design-secondary', '#17A2B8');
      
      // Background and border adjustments
      root.style.setProperty('--bg-blur', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#212529';
      
    } else {
      // Dark theme colors (original)
      root.style.setProperty('--color-black-primary', '#0E0E0E');
      root.style.setProperty('--color-black-secondary', '#191919');
      root.style.setProperty('--color-black-tertiary', '#333333');
      root.style.setProperty('--color-gray-dark', '#606060');
      
      root.style.setProperty('--color-text-primary', '#FFFFFF');
      root.style.setProperty('--color-text-secondary', '#F8F5FF');
      root.style.setProperty('--color-text-muted', '#B3B3B3');
      root.style.setProperty('--color-text-accent', '#C7B3FF');
      
      root.style.setProperty('--color-purple-primary', '#6933FF');
      root.style.setProperty('--color-purple-secondary', '#7C4CFF');
      root.style.setProperty('--color-purple-light', '#8F66FF');
      root.style.setProperty('--color-purple-accent', '#A280FF');
      
      root.style.setProperty('--color-green-primary', '#47D068');
      root.style.setProperty('--color-green-secondary', '#1C1C1C');
      
      // Design theme colors
      root.style.setProperty('--color-design-primary', '#ff6b6b');
      root.style.setProperty('--color-design-secondary', '#4ecdc4');
      
      // Background and border adjustments
      root.style.setProperty('--bg-blur', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--shadow-color', 'rgba(105, 51, 255, 0.3)');
      
      document.body.style.backgroundColor = '#0E0E0E';
      document.body.style.color = '#FFFFFF';
    }
    
    // Save to localStorage
    localStorage.setItem('portfolio-theme', theme);
    
    // Update data attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
    
  }, [theme]);

  // Listen for system theme changes (disabled to keep light as default)
  useEffect(() => {
    // Commenting out automatic theme switching based on system preference
    // to ensure light mode remains the default
    /*
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no manual preference is saved
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (!savedTheme) {
        // Default to light for professional appearance, only switch to dark if explicitly preferred
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
    */
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
