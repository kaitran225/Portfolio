import React from 'react';
import styled from 'styled-components';

// ============= COMPACT AVAILABILITY STATUS =============

interface CompactAvailabilityProps {
  className?: string;
}

const CompactAvailability: React.FC<CompactAvailabilityProps> = ({ className }) => {
  return (
    <AvailabilityContainer className={className}>
      <StatusHeader>
        <StatusIndicator>
          <StatusDot />
          <StatusText>Available for OJT</StatusText>
        </StatusIndicator>
        <StartDate>Fall 2025</StartDate>
      </StatusHeader>

      <QuickInfo>
        <InfoItem>
          <InfoLabel>Location:</InfoLabel>
          <InfoValue>Ho Chi Minh City</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Response:</InfoLabel>
          <InfoValue>&lt; 24 hours</InfoValue>
        </InfoItem>
      </QuickInfo>

      <OpportunityTags>
        <Tag>OJT</Tag>
        <Tag>Internship</Tag>
        <Tag>Full-time</Tag>
      </OpportunityTags>
    </AvailabilityContainer>
  );
};

// Styled Components
const AvailabilityContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatusText = styled.span`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.9rem;
`;

const StartDate = styled.span`
  font-size: 0.8rem;
  color: var(--color-purple-primary);
  font-weight: 600;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
`;

const QuickInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const InfoLabel = styled.span`
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  color: var(--color-text-primary);
  font-weight: 500;
`;

const OpportunityTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: rgba(102, 126, 234, 0.15);
  color: var(--color-purple-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export default CompactAvailability;
