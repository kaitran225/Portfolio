import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, 
  FiType, 
  FiZoomIn, 
  FiZoomOut,
  FiMousePointer,
  FiActivity,
  FiVolume2,
  FiSettings,
  FiX
} from '../ui/IconWrapper';

// ============= ACCESSIBILITY ENHANCEMENT COMPONENT =============

interface AccessibilityOptions {
  fontSize: number; // Base multiplier (0.8 - 1.4)
  contrast: 'normal' | 'high' | 'inverted';
  reducedMotion: boolean;
  focusVisible: boolean;
  screenReader: boolean;
  keyboardNav: boolean;
  cursorSize: 'normal' | 'large' | 'extra-large';
}

interface AccessibilityControlsProps {
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  autoHide?: boolean;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  className,
  position = 'bottom-left',
  autoHide = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AccessibilityOptions>({
    fontSize: 1,
    contrast: 'normal',
    reducedMotion: false,
    focusVisible: true,
    screenReader: false,
    keyboardNav: true,
    cursorSize: 'normal'
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOptions(parsed);
        applyAccessibilityOptions(parsed);
      } catch (e) {
        console.warn('Failed to parse accessibility preferences');
      }
    }

    // Check for system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOptions(prev => ({ ...prev, reducedMotion: true }));
    }

    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setOptions(prev => ({ ...prev, contrast: 'high' }));
    }

    // Keyboard navigation detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const applyAccessibilityOptions = (opts: AccessibilityOptions) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--accessibility-font-scale', opts.fontSize.toString());
    
    // Contrast
    root.setAttribute('data-contrast', opts.contrast);
    
    // Reduced motion
    if (opts.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Focus visibility
    root.setAttribute('data-focus-visible', opts.focusVisible.toString());
    
    // Cursor size
    root.setAttribute('data-cursor-size', opts.cursorSize);
    
    // Screen reader optimization
    if (opts.screenReader) {
      root.setAttribute('data-screen-reader', 'true');
    } else {
      root.removeAttribute('data-screen-reader');
    }
  };

  const updateOption = <K extends keyof AccessibilityOptions>(
    key: K, 
    value: AccessibilityOptions[K]
  ) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    applyAccessibilityOptions(newOptions);
    localStorage.setItem('accessibility-preferences', JSON.stringify(newOptions));
  };

  const resetToDefaults = () => {
    const defaults: AccessibilityOptions = {
      fontSize: 1,
      contrast: 'normal',
      reducedMotion: false,
      focusVisible: true,
      screenReader: false,
      keyboardNav: true,
      cursorSize: 'normal'
    };
    setOptions(defaults);
    applyAccessibilityOptions(defaults);
    localStorage.removeItem('accessibility-preferences');
  };

  const announceToScreenReader = (message: string) => {
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
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <AccessibilityContainer
      className={className}
      $position={position}
      data-accessibility-controls
    >
      <AccessibilityToggle
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility controls"
        aria-expanded={isOpen}
        $isOpen={isOpen}
      >
        <FiSettings />
      </AccessibilityToggle>

      <AnimatePresence>
        {isOpen && (
          <AccessibilityPanel
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <PanelHeader>
              <PanelTitle>Accessibility Options</PanelTitle>
              <CloseButton
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility controls"
              >
                <FiX />
              </CloseButton>
            </PanelHeader>

            <PanelContent>
              {/* Font Size Control */}
              <ControlGroup>
                <ControlLabel>
                  <FiType />
                  Text Size
                </ControlLabel>
                <FontSizeControls>
                  <FontButton
                    onClick={() => {
                      const newSize = Math.max(0.8, options.fontSize - 0.1);
                      updateOption('fontSize', newSize);
                      announceToScreenReader(`Text size decreased to ${Math.round(newSize * 100)}%`);
                    }}
                    disabled={options.fontSize <= 0.8}
                    aria-label="Decrease text size"
                  >
                    <FiZoomOut />
                  </FontButton>
                  <FontSizeDisplay>{Math.round(options.fontSize * 100)}%</FontSizeDisplay>
                  <FontButton
                    onClick={() => {
                      const newSize = Math.min(1.4, options.fontSize + 0.1);
                      updateOption('fontSize', newSize);
                      announceToScreenReader(`Text size increased to ${Math.round(newSize * 100)}%`);
                    }}
                    disabled={options.fontSize >= 1.4}
                    aria-label="Increase text size"
                  >
                    <FiZoomIn />
                  </FontButton>
                </FontSizeControls>
              </ControlGroup>

              {/* Contrast Control */}
              <ControlGroup>
                <ControlLabel>
                  <FiEye />
                  Contrast
                </ControlLabel>
                <ContrastOptions>
                  {(['normal', 'high', 'inverted'] as const).map(contrast => (
                    <ContrastOption
                      key={contrast}
                      $active={options.contrast === contrast}
                      onClick={() => {
                        updateOption('contrast', contrast);
                        announceToScreenReader(`Contrast set to ${contrast}`);
                      }}
                      aria-label={`Set contrast to ${contrast}`}
                    >
                      {contrast}
                    </ContrastOption>
                  ))}
                </ContrastOptions>
              </ControlGroup>

              {/* Motion Control */}
              <ControlGroup>
                <ToggleControl>
                  <ToggleLabel>
                    <FiMousePointer />
                    Reduce Motion
                  </ToggleLabel>
                  <ToggleSwitch
                    $active={options.reducedMotion}
                    onClick={() => {
                      const newValue = !options.reducedMotion;
                      updateOption('reducedMotion', newValue);
                      announceToScreenReader(`Motion ${newValue ? 'reduced' : 'enabled'}`);
                    }}
                    role="switch"
                    aria-checked={options.reducedMotion}
                    aria-label="Toggle reduced motion"
                  >
                    <ToggleThumb $active={options.reducedMotion} />
                  </ToggleSwitch>
                </ToggleControl>
              </ControlGroup>

              {/* Focus Visibility */}
              <ControlGroup>
                <ToggleControl>
                  <ToggleLabel>
                    <FiActivity />
                    Enhanced Focus
                  </ToggleLabel>
                  <ToggleSwitch
                    $active={options.focusVisible}
                    onClick={() => {
                      const newValue = !options.focusVisible;
                      updateOption('focusVisible', newValue);
                      announceToScreenReader(`Enhanced focus ${newValue ? 'enabled' : 'disabled'}`);
                    }}
                    role="switch"
                    aria-checked={options.focusVisible}
                    aria-label="Toggle enhanced focus indicators"
                  >
                    <ToggleThumb $active={options.focusVisible} />
                  </ToggleSwitch>
                </ToggleControl>
              </ControlGroup>

              {/* Screen Reader Mode */}
              <ControlGroup>
                <ToggleControl>
                  <ToggleLabel>
                    <FiVolume2 />
                    Screen Reader Mode
                  </ToggleLabel>
                  <ToggleSwitch
                    $active={options.screenReader}
                    onClick={() => {
                      const newValue = !options.screenReader;
                      updateOption('screenReader', newValue);
                      announceToScreenReader(`Screen reader mode ${newValue ? 'enabled' : 'disabled'}`);
                    }}
                    role="switch"
                    aria-checked={options.screenReader}
                    aria-label="Toggle screen reader optimizations"
                  >
                    <ToggleThumb $active={options.screenReader} />
                  </ToggleSwitch>
                </ToggleControl>
              </ControlGroup>

              {/* Cursor Size */}
              <ControlGroup>
                <ControlLabel>
                  <FiMousePointer />
                  Cursor Size
                </ControlLabel>
                <CursorOptions>
                  {(['normal', 'large', 'extra-large'] as const).map(size => (
                    <CursorOption
                      key={size}
                      $active={options.cursorSize === size}
                      onClick={() => {
                        updateOption('cursorSize', size);
                        announceToScreenReader(`Cursor size set to ${size}`);
                      }}
                      aria-label={`Set cursor size to ${size}`}
                    >
                      {size.replace('-', ' ')}
                    </CursorOption>
                  ))}
                </CursorOptions>
              </ControlGroup>
            </PanelContent>

            <PanelFooter>
              <ResetButton
                onClick={() => {
                  resetToDefaults();
                  announceToScreenReader('Accessibility settings reset to defaults');
                }}
                aria-label="Reset all accessibility settings to defaults"
              >
                Reset to Defaults
              </ResetButton>
            </PanelFooter>
          </AccessibilityPanel>
        )}
      </AnimatePresence>
    </AccessibilityContainer>
  );
};

// Styled Components
const AccessibilityContainer = styled.div<{ $position: string }>`
  position: fixed;
  ${props => {
    const [vPos, hPos] = props.$position.split('-');
    return `
      ${vPos}: 20px;
      ${hPos}: 20px;
    `;
  }}
  z-index: 2000;
`;

const AccessibilityToggle = styled.button<{ $isOpen: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$isOpen ? 'var(--color-purple-primary)' : 'var(--background-secondary)'};
  color: ${props => props.$isOpen ? 'white' : 'var(--color-text-primary)'};
  border: 2px solid ${props => props.$isOpen ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-medium);

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 3px solid var(--color-purple-primary);
    outline-offset: 2px;
  }
`;

const AccessibilityPanel = styled.div`
  position: absolute;
  bottom: 70px;
  left: 0;
  width: 320px;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-large);
  backdrop-filter: blur(20px);
  overflow: hidden;

  @media (max-width: 480px) {
    width: 280px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const PanelTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--background-tertiary);
  color: var(--color-text-muted);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }
`;

const PanelContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ControlLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.9rem;
`;

const FontSizeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FontButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--background-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FontSizeDisplay = styled.span`
  color: var(--color-text-primary);
  font-weight: 600;
  min-width: 50px;
  text-align: center;
`;

const ContrastOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ContrastOption = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--background-tertiary)'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-primary)'};
  border: 1px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }
`;

const ToggleControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.9rem;
`;

const ToggleSwitch = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--background-tertiary)'};
  border: 1px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? 'var(--color-purple-secondary)' : 'var(--color-purple-primary)20'};
  }
`;

const ToggleThumb = styled.div<{ $active: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: ${props => props.$active ? '27px' : '3px'};
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const CursorOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CursorOption = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--background-tertiary)'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-primary)'};
  border: 1px solid ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
  }
`;

const PanelFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--background-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: var(--color-danger);
    color: white;
    border-color: var(--color-danger);
  }
`;

export default AccessibilityControls;
