import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import portfolioDataService from '../../../shared/services/data/portfolioDataService';

// ============= CALENDAR INTEGRATION COMPONENT =============

interface CalendarIntegrationProps {
  className?: string;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ className }) => {
  const calendarData = portfolioDataService.getCalendarData();

  const handleCalendlyClick = () => {
    // Load Calendly inline widget
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: calendarData.calendlyUrl
      });
    } else {
      // Fallback to direct link
      window.open(calendarData.calendlyUrl, '_blank');
    }
  };

  const scheduleOptions = calendarData.scheduleOptions;

  return (
    <CalendarContainer className={className}>
      <CalendarHeader>
        <Title>Schedule a Meeting</Title>
        <Subtitle>Choose a time that works best for you</Subtitle>
      </CalendarHeader>

      <ScheduleOptions>
        {scheduleOptions.map((option, index) => (
          <ScheduleOption
            key={option.type}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            $popular={option.popular}
            onClick={handleCalendlyClick}
          >
            {option.popular && <PopularBadge>Most Popular</PopularBadge>}
            <OptionHeader>
              <OptionTitle>{option.title}</OptionTitle>
              <OptionDuration>{option.duration}</OptionDuration>
            </OptionHeader>
            <OptionDescription>{option.description}</OptionDescription>
            <ScheduleButton $popular={option.popular}>
              Select Time
            </ScheduleButton>
          </ScheduleOption>
        ))}
      </ScheduleOptions>

      <QuickActions>
        <QuickAction href="mailto:kaitran225@gmail.com?subject=Portfolio%20Inquiry">
          📧 Send Email Instead
        </QuickAction>
        <QuickAction href="https://linkedin.com/in/kaitran225" target="_blank">
          💼 Connect on LinkedIn
        </QuickAction>
      </QuickActions>

      <TimezoneNote>
        <strong>Timezone:</strong> Ho Chi Minh City (GMT+7) • 
        Available Mon-Fri, 9 AM - 6 PM
      </TimezoneNote>
    </CalendarContainer>
  );
};

// Styled Components
const CalendarContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
`;

const CalendarHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0;
`;

const ScheduleOptions = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScheduleOption = styled.div<{ $popular?: boolean }>`
  position: relative;
  padding: 1.5rem;
  background: var(--background-tertiary);
  border-radius: 12px;
  border: 2px solid ${props => props.$popular ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-purple-primary);
    background: rgba(105, 51, 255, 0.05);
    box-shadow: var(--shadow-medium);
  }

  ${props => props.$popular && `
    background: linear-gradient(135deg, rgba(105, 51, 255, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -8px;
  right: 16px;
  background: var(--color-purple-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const OptionTitle = styled.h4`
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const OptionDuration = styled.span`
  color: var(--color-purple-primary);
  font-weight: 600;
  font-size: 0.9rem;
`;

const OptionDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ScheduleButton = styled.button<{ $popular?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$popular ? `
    background: var(--color-purple-primary);
    color: white;

    &:hover {
      background: var(--color-purple-secondary);
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: var(--color-purple-primary);
    border: 2px solid var(--color-purple-primary);

    &:hover {
      background: var(--color-purple-primary);
      color: white;
    }
  `}
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const QuickAction = styled.a`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-purple-primary);
    background: rgba(105, 51, 255, 0.1);
  }
`;

const TimezoneNote = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  padding: 1rem;
  background: var(--background-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

// Add Calendly script to head
if (typeof window !== 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  document.head.appendChild(script);
}

export default CalendarIntegration;
