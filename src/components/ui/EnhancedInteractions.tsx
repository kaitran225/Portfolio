import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= ENHANCED MICRO-INTERACTIONS LIBRARY =============

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'lift' | 'glow' | 'bounce' | 'pulse' | 'rotate' | 'magnetic';
  intensity?: 'subtle' | 'medium' | 'strong';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

// Keyframe animations
const liftAnimation = keyframes`
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-8px) scale(1.02); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(105, 51, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(105, 51, 255, 0.6); }
`;

const bounceIn = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const gentleRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(5deg); }
`;

const magneticMove = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(2px, -2px); }
  50% { transform: translate(-1px, 2px); }
  75% { transform: translate(-2px, -1px); }
  100% { transform: translate(0, 0); }
`;

// Enhanced micro-interaction component
const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'lift',
  intensity = 'medium',
  disabled = false,
  onClick,
  className
}) => {
  return (
    <InteractionWrapper
      $type={type}
      $intensity={intensity}
      $disabled={disabled}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </InteractionWrapper>
  );
};

const InteractionWrapper = styled.div<{
  $type: string;
  $intensity: string;
  $disabled: boolean;
}>`
  display: inline-block;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  ${props => !props.$disabled && css`
    &:hover {
      ${props.$type === 'lift' && css`
        transform: translateY(-${props.$intensity === 'subtle' ? '4px' : props.$intensity === 'medium' ? '8px' : '12px'}) 
                   scale(${props.$intensity === 'subtle' ? '1.01' : props.$intensity === 'medium' ? '1.02' : '1.03'});
        box-shadow: 0 ${props.$intensity === 'subtle' ? '8px' : props.$intensity === 'medium' ? '15px' : '25px'} 
                   ${props.$intensity === 'subtle' ? '25px' : props.$intensity === 'medium' ? '40px' : '50px'} 
                   rgba(0, 0, 0, 0.15);
      `}
      
      ${props.$type === 'glow' && css`
        animation: ${glowPulse} 2s ease-in-out infinite;
        filter: brightness(${props.$intensity === 'subtle' ? '1.1' : props.$intensity === 'medium' ? '1.2' : '1.3'});
      `}
      
      ${props.$type === 'bounce' && css`
        animation: ${bounceIn} 0.3s ease-out;
      `}
      
      ${props.$type === 'pulse' && css`
        transform: scale(${props.$intensity === 'subtle' ? '1.02' : props.$intensity === 'medium' ? '1.05' : '1.08'});
        animation: ${glowPulse} 1.5s ease-in-out infinite;
      `}
      
      ${props.$type === 'rotate' && css`
        transform: rotate(${props.$intensity === 'subtle' ? '2deg' : props.$intensity === 'medium' ? '5deg' : '8deg'});
      `}
      
      ${props.$type === 'magnetic' && css`
        animation: ${magneticMove} 0.6s ease-in-out;
      `}
    }
    
    &:active {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
  `}
  
  &:focus-visible {
    outline: 2px solid var(--color-purple-primary);
    outline-offset: 4px;
    border-radius: 8px;
  }
`;

// Enhanced Button Component with built-in micro-interactions
interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $loading={loading}
      $disabled={disabled || loading}
      $fullWidth={fullWidth}
      onClick={onClick}
      className={className}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && <IconWrapper>{icon}</IconWrapper>}
      <ButtonText $hasIcon={!!icon && !loading}>{children}</ButtonText>
      {!loading && icon && iconPosition === 'right' && <IconWrapper>{icon}</IconWrapper>}
      <ButtonRipple />
    </StyledButton>
  );
};

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
`;

const ButtonText = styled.span<{ $hasIcon: boolean }>`
  position: relative;
  z-index: 2;
  ${props => props.$hasIcon && 'margin: 0 8px;'}
`;

const ButtonRipple = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 1;
`;

const StyledButton = styled.button<{
  $variant: string;
  $size: string;
  $loading: boolean;
  $disabled: boolean;
  $fullWidth: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  border: none;
  outline: none;
  
  ${props => props.$fullWidth && 'width: 100%;'}
  
  /* Size variants */
  ${props => props.$size === 'small' && css`
    padding: 8px 16px;
    font-size: 0.875rem;
    min-height: 36px;
  `}
  
  ${props => props.$size === 'medium' && css`
    padding: 12px 24px;
    font-size: 1rem;
    min-height: 44px;
  `}
  
  ${props => props.$size === 'large' && css`
    padding: 16px 32px;
    font-size: 1.125rem;
    min-height: 52px;
  `}
  
  /* Style variants */
  ${props => props.$variant === 'primary' && css`
    background: linear-gradient(135deg, var(--color-purple-primary) 0%, var(--color-purple-secondary) 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(105, 51, 255, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(105, 51, 255, 0.4);
      
      ${ButtonRipple} {
        width: 100px;
        height: 100px;
      }
      
      ${IconWrapper} {
        transform: translateX(2px);
      }
    }
  `}
  
  ${props => props.$variant === 'secondary' && css`
    background: var(--bg-secondary);
    color: var(--color-text-primary);
    border: 2px solid var(--border-color);
    
    &:hover:not(:disabled) {
      border-color: var(--color-purple-primary);
      background: rgba(105, 51, 255, 0.1);
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.$variant === 'outline' && css`
    background: transparent;
    color: var(--color-purple-primary);
    border: 2px solid var(--color-purple-primary);
    
    &:hover:not(:disabled) {
      background: var(--color-purple-primary);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(105, 51, 255, 0.3);
    }
  `}
  
  ${props => props.$variant === 'ghost' && css`
    background: transparent;
    color: var(--color-text-secondary);
    
    &:hover:not(:disabled) {
      background: rgba(105, 51, 255, 0.1);
      color: var(--color-purple-primary);
    }
  `}
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    transform: none;
    box-shadow: none;
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-purple-primary);
    outline-offset: 2px;
  }
`;

// Enhanced Card Component with hover effects
interface EnhancedCardProps {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  elevation = 'medium',
  interactive = false,
  className,
  onClick
}) => {
  return (
    <StyledCard
      $elevation={elevation}
      $interactive={interactive}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
      {interactive && <CardShine />}
    </StyledCard>
  );
};

const CardShine = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s ease;
  pointer-events: none;
`;

const StyledCard = styled.div<{
  $elevation: string;
  $interactive: boolean;
}>`
  position: relative;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--card-border);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${props => props.$elevation === 'low' && css`
    box-shadow: var(--shadow-soft);
  `}
  
  ${props => props.$elevation === 'medium' && css`
    box-shadow: var(--shadow-medium);
  `}
  
  ${props => props.$elevation === 'high' && css`
    box-shadow: var(--shadow-strong);
  `}
  
  ${props => props.$interactive && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      border-color: var(--color-purple-primary);
      
      ${CardShine} {
        left: 100%;
      }
    }
    
    &:active {
      transform: translateY(-4px) scale(1.01);
    }
  `}
  
  &:focus-visible {
    outline: 2px solid var(--color-purple-primary);
    outline-offset: 4px;
  }
`;

export {
  MicroInteraction,
  EnhancedButton,
  EnhancedCard
};
