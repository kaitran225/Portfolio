import React from 'react';
import styled from 'styled-components';

// ============= COMPACT CALENDAR COMPONENT =============

interface CompactCalendarProps {
  className?: string;
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({ className }) => {
  const handleScheduleClick = () => {
    window.open('https://calendly.com/kaitran225/30min', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:kaitran225@gmail.com?subject=Portfolio%20Inquiry', '_blank');
  };

  return (
    <CalendarContainer className={className}>
      <CalendarHeader>
        <Title>Quick Schedule</Title>
        <Subtitle>Book a 30-min chat</Subtitle>
      </CalendarHeader>

      <ActionButtons>
        <PrimaryButton onClick={handleScheduleClick}>
          📅 Schedule Call
        </PrimaryButton>
        <SecondaryButton onClick={handleEmailClick}>
          📧 Send Email
        </SecondaryButton>
      </ActionButtons>

      <AvailabilityNote>
        Available Mon-Fri • GMT+7
      </AvailabilityNote>
    </CalendarContainer>
  );
};

// Styled Components
const CalendarContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  text-align: center;
`;

const CalendarHeader = styled.div`
  margin-bottom: 1.5rem;
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
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:active {
    transform: translateY(0);
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

const AvailabilityNote = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  opacity: 0.8;
`;

export default CompactCalendar;
