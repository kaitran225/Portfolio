import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';
import { TimeSlot } from '../../../shared/types/portfolioTypes';

// ============= ENHANCED COMPACT CALENDAR COMPONENT =============

interface CompactCalendarProps {
  className?: string;
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if current time is within business hours (9 AM - 6 PM GMT+7)
      const hour = now.getHours();
      setIsBusinessHours(hour >= 9 && hour < 18);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Sample available time slots (in a real app, this would come from an API)
  const availableSlots = portfolioDataService.getAvailableSlots();

  const handleScheduleClick = () => {
    // Track calendar interaction
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calendar_interaction', {
        event_category: 'contact',
        event_label: 'schedule_call'
      });
    }
    
    window.open('https://calendly.com/kaitran225/30min', '_blank', 'noopener,noreferrer');
  };

  const handleInstantMeeting = () => {
    const subject = encodeURIComponent('Instant Meeting Request');
    const body = encodeURIComponent(`Hi Kai,

I'd like to schedule an instant meeting to discuss:
- Project requirements
- Collaboration opportunities
- Technical consultation

Please let me know your availability.

Best regards`);
    
    window.open(`mailto:kaitran225@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleConsultationRequest = () => {
    const subject = encodeURIComponent('Technical Consultation Request');
    const body = encodeURIComponent(`Hi Kai,

I'm interested in a technical consultation regarding:
- [ ] Web Development
- [ ] System Architecture
- [ ] DevOps & Cloud Infrastructure
- [ ] Code Review
- [ ] Performance Optimization

Project Details:
- Budget Range: 
- Timeline: 
- Brief Description: 

Looking forward to hearing from you.

Best regards`);
    
    window.open(`mailto:kaitran225@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <CalendarContainer className={className}>
      <CalendarHeader>
        <StatusIndicator $isOnline={isBusinessHours}>
          <StatusDot $isOnline={isBusinessHours} />
          <StatusText>
            {isBusinessHours ? 'Available Now' : 'Will respond within 6 hours'}
          </StatusText>
        </StatusIndicator>
        
        <Title>Quick Schedule</Title>
        <Subtitle>Professional consultation & collaboration</Subtitle>
        
        <CurrentTime>
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short' 
          })}
        </CurrentTime>
      </CalendarHeader>

      <ActionButtons>
        <PrimaryButton onClick={handleScheduleClick}>
          📅 Schedule Call
          <ButtonSubtext>30 min • Free consultation</ButtonSubtext>
        </PrimaryButton>
        
        {isBusinessHours && (
          <InstantButton onClick={handleInstantMeeting}>
            ⚡ Instant Meeting
            <ButtonSubtext>Available now</ButtonSubtext>
          </InstantButton>
        )}
        
        <SecondaryButton onClick={handleConsultationRequest}>
          � Technical Consultation
          <ButtonSubtext>Detailed project discussion</ButtonSubtext>
        </SecondaryButton>
      </ActionButtons>

      <QuickSlots>
        <SlotsTitle>Next Available</SlotsTitle>
        {availableSlots.slice(0, 2).map((slot, index) => (
          <TimeSlotComponent key={index} $available={slot.available}>
            <SlotTime>{slot.time}</SlotTime>
            <SlotType $type={slot.type}>
              {slot.type === 'call' && '📞'}
              {slot.type === 'meeting' && '💼'}
              {slot.type === 'consultation' && '🎯'}
            </SlotType>
          </TimeSlotComponent>
        ))}
      </QuickSlots>

      <AvailabilityNote>
        <strong>Timezone:</strong> GMT+7 (Ho Chi Minh City) <br/>
        <strong>Response:</strong> &lt; 6 hours during business days
      </AvailabilityNote>
    </CalendarContainer>
  );
};

// Animations
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Styled Components
const CalendarContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
  }
`;

const CalendarHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StatusIndicator = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.$isOnline 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(249, 115, 22, 0.1)'};
  border: 1px solid ${props => props.$isOnline 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(249, 115, 22, 0.3)'};
`;

const StatusDot = styled.div<{ $isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isOnline ? '#22c55e' : '#f97316'};
  animation: ${props => props.$isOnline ? pulse : 'none'} 2s infinite;
`;

const StatusText = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0 0 0.5rem 0;
`;

const CurrentTime = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  font-family: 'Monaco', 'Menlo', monospace;
  background: rgba(105, 51, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, var(--color-purple-primary), var(--color-purple-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:active {
    transform: translateY(0);
  }
`;

const InstantButton = styled.button`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  animation: ${slideUp} 0.3s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: var(--background-hover);
    border-color: var(--color-purple-primary);
  }
`;

const ButtonSubtext = styled.div`
  font-size: 0.7rem;
  font-weight: 400;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const QuickSlots = styled.div`
  margin-bottom: 1rem;
`;

const SlotsTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
`;

const TimeSlotComponent = styled.div<{ $available: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  background: ${props => props.$available 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(156, 163, 175, 0.1)'};
  border: 1px solid ${props => props.$available 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(156, 163, 175, 0.2)'};
  opacity: ${props => props.$available ? 1 : 0.6};
`;

const SlotTime = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-primary);
`;

const SlotType = styled.span<{ $type: 'call' | 'meeting' | 'consultation' }>`
  font-size: 0.9rem;
`;

const AvailabilityNote = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.4;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

export default CompactCalendar;
