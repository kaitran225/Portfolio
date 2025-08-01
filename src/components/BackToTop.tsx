import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= BACK TO TOP BUTTON WITH PROGRESS =============

// Animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// Styled Components
const BackToTopButton = styled.button<{ visible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  
  ${props => css`
    opacity: ${props.visible ? 1 : 0};
    visibility: ${props.visible ? 'visible' : 'hidden'};
    transform: ${props.visible ? 'translateY(0)' : 'translateY(20px)'};
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    animation: ${pulse} 1s ease-in-out;
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

const ProgressRing = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const ProgressCircle = styled.circle<{ progress: number }>`
  fill: none;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 3;
`;

const ProgressPath = styled.circle<{ progress: number }>`
  fill: none;
  stroke: #ffffff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: ${2 * Math.PI * 26}; // Circumference
  stroke-dashoffset: ${props => 2 * Math.PI * 26 * (1 - props.progress / 100)};
  transition: stroke-dashoffset 0.3s ease;
`;

const ArrowIcon = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

// Component
interface BackToTopProps {
  threshold?: number;
}

const BackToTop: React.FC<BackToTopProps> = ({ threshold = 300 }) => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    setScrollProgress(Math.min(progress, 100));
    setVisible(scrollTop > threshold);
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollProgress]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <BackToTopButton
      visible={visible}
      onClick={scrollToTop}
      aria-label="Back to top"
      title={`Back to top (${Math.round(scrollProgress)}% complete)`}
    >
      <ProgressRing width="60" height="60">
        <ProgressCircle
          cx="30"
          cy="30"
          r="26"
          progress={scrollProgress}
        />
        <ProgressPath
          cx="30"
          cy="30"
          r="26"
          progress={scrollProgress}
        />
      </ProgressRing>
      <ArrowIcon>↑</ArrowIcon>
    </BackToTopButton>
  );
};

export default BackToTop;
