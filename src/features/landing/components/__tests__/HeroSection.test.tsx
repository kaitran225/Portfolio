import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import theme from '../../../../theme/materialTheme';
import HeroSection from '../HeroSection';

// Mock the typed text hook
// jest.mock('../../../../hooks/useTypedText', () => ({
//   useTypedText: jest.fn(() => 'Full Stack Developer')
// }));

// Mock intersection observer for animations
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={{}}>
          {component}
        </StyledThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe.skip('HeroSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section with main content', () => {
    renderWithProviders(<HeroSection />);
    
    expect(screen.getByText('Hi, I\'m')).toBeInTheDocument();
    expect(screen.getByText('Mohamed Amine')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
  });

  it('displays the animated typed text', () => {
    const mockUseTypedText = require('../../../../hooks/useTypedText').useTypedText;
    mockUseTypedText.mockReturnValue('Software Engineer');
    
    renderWithProviders(<HeroSection />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithProviders(<HeroSection />);
    
    expect(screen.getByRole('button', { name: /view my work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /contact me/i })).toBeInTheDocument();
  });

  it('renders social media links', () => {
    renderWithProviders(<HeroSection />);
    
    // Check for social media links (assuming they exist in the component)
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('handles view work button click', async () => {
    renderWithProviders(<HeroSection />);
    
    const viewWorkButton = screen.getByRole('button', { name: /view my work/i });
    fireEvent.click(viewWorkButton);
    
    // Add assertions based on expected behavior
    // This might involve checking for navigation or scroll behavior
  });

  it('handles contact button click', async () => {
    renderWithProviders(<HeroSection />);
    
    const contactButton = screen.getByRole('button', { name: /contact me/i });
    fireEvent.click(contactButton);
    
    // Add assertions based on expected behavior
  });

  it('applies responsive styling correctly', () => {
    renderWithProviders(<HeroSection />);
    
    const heroContainer = screen.getByTestId('hero-section');
    expect(heroContainer).toHaveStyle('min-height: 100vh');
  });

  it('loads profile image correctly', () => {
    renderWithProviders(<HeroSection />);
    
    const profileImage = screen.getByAltText(/mohamed amine/i);
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src');
  });

  it('renders with proper accessibility attributes', () => {
    renderWithProviders(<HeroSection />);
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for proper link accessibility
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('handles keyboard navigation', () => {
    renderWithProviders(<HeroSection />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex');
    });
  });
});
