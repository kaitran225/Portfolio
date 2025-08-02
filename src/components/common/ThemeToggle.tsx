import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <ToggleContainer onClick={toggleTheme} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <ToggleTrack $isDark={isDark}>
        <ToggleThumb $isDark={isDark}>
          <IconContainer $isDark={isDark}>
            {isDark ? <MoonIcon /> : <SunIcon />}
          </IconContainer>
        </ToggleThumb>
        <BackgroundElements>
          <Star $delay={0} $isDark={isDark} />
          <Star $delay={1} $isDark={isDark} />
          <Star $delay={2} $isDark={isDark} />
          <Cloud $delay={0} $isDark={isDark} />
          <Cloud $delay={1} $isDark={isDark} />
        </BackgroundElements>
      </ToggleTrack>
    </ToggleContainer>
  );
};

// Icon components
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(2px) translateY(-2px); }
  50% { transform: translateX(-1px) translateY(-4px); }
  75% { transform: translateX(-2px) translateY(-1px); }
`;

// Styled components
const ToggleContainer = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-medium);
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    padding: 6px;
  }
`;

const ToggleTrack = styled.div<{ $isDark: boolean }>`
  width: 60px;
  height: 30px;
  border-radius: 15px;
  position: relative;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
    : 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 50px;
    height: 25px;
    border-radius: 12.5px;
  }
`;

const ToggleThumb = styled.div<{ $isDark: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 50%, #D8BFD8 100%)'
    : 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)'};
  position: absolute;
  top: 2px;
  left: ${props => props.$isDark ? '2px' : '32px'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  ${props => props.$isDark && css`
    animation: ${rotate} 20s linear infinite;
  `}

  @media (max-width: 768px) {
    width: 21px;
    height: 21px;
    left: ${props => props.$isDark ? '2px' : '27px'};
  }
`;

const IconContainer = styled.div<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#4A4A4A' : '#FF6B35'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    width: 14px;
    height: 14px;
    
    @media (max-width: 768px) {
      width: 12px;
      height: 12px;
    }
  }
`;

const BackgroundElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 15px;
`;

const Star = styled.div<{ $delay: number; $isDark: boolean }>`
  position: absolute;
  width: 2px;
  height: 2px;
  background: ${props => props.$isDark ? '#FFD700' : 'transparent'};
  border-radius: 50%;
  opacity: ${props => props.$isDark ? 0.8 : 0};
  ${props => css`
    animation: ${twinkle} 2s ease-in-out infinite;
    animation-delay: ${props.$delay * 0.7}s;
  `}
  transition: all 0.4s ease;
  
  &:nth-child(1) { top: 6px; left: 8px; }
  &:nth-child(2) { top: 12px; left: 45px; }
  &:nth-child(3) { top: 20px; left: 15px; }
`;

const Cloud = styled.div<{ $delay: number; $isDark: boolean }>`
  position: absolute;
  width: 12px;
  height: 6px;
  background: ${props => props.$isDark ? 'transparent' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 10px;
  opacity: ${props => props.$isDark ? 0 : 0.7};
  ${props => css`
    animation: ${float} 4s ease-in-out infinite;
    animation-delay: ${props.$delay * 1.2}s;
  `}
  transition: all 0.4s ease;
  
  &:nth-child(1) { top: 8px; left: 12px; }
  &:nth-child(2) { top: 16px; left: 35px; }
  
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: inherit;
    border-radius: 50%;
    top: -2px;
    left: 2px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    border-radius: 50%;
    top: -3px;
    right: 2px;
  }
`;

export default ThemeToggle;
