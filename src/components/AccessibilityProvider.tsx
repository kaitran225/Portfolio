import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

// ============= ACCESSIBILITY ENHANCEMENT SYSTEM =============

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  focusVisible: boolean;
  screenReader: boolean;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    focusVisible: true,
    screenReader: false,
  });

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      // Reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // High contrast preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      // Large text preference
      const prefersLargeText = window.matchMedia('(prefers-font-size: large)').matches;
      
      // Screen reader detection
      const screenReader = navigator.userAgent.includes('NVDA') || 
                          navigator.userAgent.includes('JAWS') || 
                          navigator.userAgent.includes('VoiceOver');

      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        largeText: prefersLargeText,
        screenReader,
      }));
    };

    detectSystemPreferences();

    // Listen for preference changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-font-size: large)'),
    ];

    const handleChange = () => detectSystemPreferences();
    
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));
    
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties based on settings
    root.style.setProperty('--a11y-reduced-motion', settings.reducedMotion ? '1' : '0');
    root.style.setProperty('--a11y-high-contrast', settings.highContrast ? '1' : '0');
    root.style.setProperty('--a11y-large-text', settings.largeText ? '1.2' : '1');
    root.style.setProperty('--a11y-focus-visible', settings.focusVisible ? '1' : '0');
    
    // Add CSS classes for styling
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('screen-reader', settings.screenReader);
    
    // Announce changes to screen readers
    if (settings.screenReader) {
      announceToScreenReader('Accessibility settings updated');
    }
  }, [settings]);

  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return (
    <>
      {children}
      <AccessibilityControls settings={settings} setSettings={setSettings} />
    </>
  );
};

// Accessibility control panel
interface AccessibilityControlsProps {
  settings: AccessibilitySettings;
  setSettings: (settings: AccessibilitySettings) => void;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ 
  settings, 
  setSettings 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <ControlsContainer>
      <ToggleButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Controls"
        aria-expanded={isOpen}
        title="Accessibility Controls"
      >
        ♿
      </ToggleButton>
      
      {isOpen && (
        <ControlsPanel role="dialog" aria-label="Accessibility Settings">
          <PanelHeader>
            <PanelTitle>Accessibility Settings</PanelTitle>
            <CloseButton
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility panel"
            >
              ×
            </CloseButton>
          </PanelHeader>
          
          <ControlsList>
            <ControlItem>
              <ControlLabel>
                <ControlCheckbox
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={() => toggleSetting('reducedMotion')}
                  aria-describedby="reduced-motion-desc"
                />
                Reduce Motion
              </ControlLabel>
              <ControlDescription id="reduced-motion-desc">
                Minimizes animations and transitions
              </ControlDescription>
            </ControlItem>
            
            <ControlItem>
              <ControlLabel>
                <ControlCheckbox
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={() => toggleSetting('highContrast')}
                  aria-describedby="high-contrast-desc"
                />
                High Contrast
              </ControlLabel>
              <ControlDescription id="high-contrast-desc">
                Increases color contrast for better visibility
              </ControlDescription>
            </ControlItem>
            
            <ControlItem>
              <ControlLabel>
                <ControlCheckbox
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={() => toggleSetting('largeText')}
                  aria-describedby="large-text-desc"
                />
                Large Text
              </ControlLabel>
              <ControlDescription id="large-text-desc">
                Increases text size for better readability
              </ControlDescription>
            </ControlItem>
            
            <ControlItem>
              <ControlLabel>
                <ControlCheckbox
                  type="checkbox"
                  checked={settings.focusVisible}
                  onChange={() => toggleSetting('focusVisible')}
                  aria-describedby="focus-visible-desc"
                />
                Enhanced Focus
              </ControlLabel>
              <ControlDescription id="focus-visible-desc">
                Makes keyboard focus indicators more visible
              </ControlDescription>
            </ControlItem>
          </ControlsList>
        </ControlsPanel>
      )}
    </ControlsContainer>
  );
};

// Skip links component
const SkipLinks: React.FC = () => {
  return (
    <SkipLinksContainer>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#footer">Skip to footer</SkipLink>
    </SkipLinksContainer>
  );
};

// Focus trap hook for modals
const useFocusTrap = (isActive: boolean) => {
  const containerRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Allow parent to handle escape
        container.dispatchEvent(new CustomEvent('escapeFocusTrap'));
      }
    };

    container.addEventListener('keydown', handleTabKey);
    container.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element when trap activates
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
};

// Styled components
const ControlsContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  
  @media (max-width: 768px) {
    top: 70px;
    right: 15px;
  }
`;

const ToggleButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-purple-primary);
  color: white;
  border: 2px solid white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
  
  &:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 3px;
  }
`;

const ControlsPanel = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 300px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 10001;
  
  @media (max-width: 768px) {
    width: 280px;
    right: -10px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const PanelTitle = styled.h3`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--color-text-primary);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-purple-primary);
    outline-offset: 2px;
  }
`;

const ControlsList = styled.div`
  padding: 1rem;
`;

const ControlItem = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ControlLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-primary);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    color: var(--color-purple-primary);
  }
`;

const ControlCheckbox = styled.input`
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  
  &:checked {
    background: var(--color-purple-primary);
    border-color: var(--color-purple-primary);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-purple-primary);
    outline-offset: 2px;
  }
`;

const ControlDescription = styled.p`
  margin: 0.5rem 0 0 2.25rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
`;

const SkipLinksContainer = styled.div`
  position: absolute;
  top: -1000px;
  left: 0;
  z-index: 10000;
  
  &:focus-within {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--bg-primary);
    padding: 1rem;
    border-bottom: 2px solid var(--color-purple-primary);
  }
`;

const SkipLink = styled.a`
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  background: var(--color-purple-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

export {
  AccessibilityProvider,
  SkipLinks,
  useFocusTrap,
};

export default AccessibilityProvider;
