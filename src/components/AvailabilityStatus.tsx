import React from 'react';
import styled from 'styled-components';
import { FiCalendar, FiClock, FiMapPin, FiCheck } from './IconWrapper';
import { motion } from 'framer-motion';

// ============= AVAILABILITY STATUS COMPONENT =============

interface AvailabilityStatusProps {
  className?: string;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({ className }) => {
  const availabilityData = {
    status: 'available',
    startDate: 'Available Now',
    location: 'Ho Chi Minh City, Vietnam',
    remote: true,
    types: ['Freelance', 'Full-time', 'Contract'],
    timezone: 'GMT+7 (ICT)',
    responseTime: '< 24 hours'
  };

  return (
    <AvailabilityContainer className={className}>
      <StatusHeader>
        <StatusIndicator $status={availabilityData.status}>
          <StatusDot $status={availabilityData.status} />
          <StatusText>Available for Opportunities</StatusText>
        </StatusIndicator>
        <UpdatedText>Last updated: {new Date().toLocaleDateString()}</UpdatedText>
      </StatusHeader>

      <AvailabilityGrid>
        <AvailabilityItem
          as={motion.div}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <ItemIcon>
            <FiCalendar />
          </ItemIcon>
          <ItemContent>
            <ItemLabel>Start Date</ItemLabel>
            <ItemValue>{availabilityData.startDate}</ItemValue>
          </ItemContent>
        </AvailabilityItem>

        <AvailabilityItem
          as={motion.div}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <ItemIcon>
            <FiMapPin />
          </ItemIcon>
          <ItemContent>
            <ItemLabel>Location</ItemLabel>
            <ItemValue>{availabilityData.location}</ItemValue>
            <ItemSubtext>Open to remote work</ItemSubtext>
          </ItemContent>
        </AvailabilityItem>

        <AvailabilityItem
          as={motion.div}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <ItemIcon>
            <FiClock />
          </ItemIcon>
          <ItemContent>
            <ItemLabel>Response Time</ItemLabel>
            <ItemValue>{availabilityData.responseTime}</ItemValue>
          </ItemContent>
        </AvailabilityItem>

        <OpportunityTypes>
          <TypesLabel>Interested Opportunities:</TypesLabel>
          <TypesList>
            {availabilityData.types.map(type => (
              <TypeTag key={type}>
                <FiCheck />
                {type}
              </TypeTag>
            ))}
          </TypesList>
        </OpportunityTypes>
      </AvailabilityGrid>

      <ContactPrompt>
        <ContactText>Ready to discuss your project or opportunity?</ContactText>
        <ContactActions>
          <ContactButton 
            href="mailto:kaitran225@gmail.com?subject=Professional Opportunity"
            $primary
          >
            Send Email
          </ContactButton>
          <ContactButton 
            href="https://calendly.com/kaitran225" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule Call
          </ContactButton>
        </ContactActions>
      </ContactPrompt>
    </AvailabilityContainer>
  );
};

// Styled Components
const AvailabilityContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const StatusIndicator = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusDot = styled.div<{ $status: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$status) {
      case 'available': return '#2ed573';
      case 'busy': return '#ffa502';
      case 'unavailable': return '#ff4757';
      default: return '#747d8c';
    }
  }};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 ${props => {
      switch (props.$status) {
        case 'available': return 'rgba(46, 213, 115, 0.7)';
        case 'busy': return 'rgba(255, 165, 2, 0.7)';
        case 'unavailable': return 'rgba(255, 71, 87, 0.7)';
        default: return 'rgba(116, 125, 140, 0.7)';
      }
    }}; }
    70% { box-shadow: 0 0 0 10px rgba(46, 213, 115, 0); }
    100% { box-shadow: 0 0 0 0 rgba(46, 213, 115, 0); }
  }
`;

const StatusText = styled.span`
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 1.1rem;
`;

const UpdatedText = styled.span`
  color: var(--color-text-muted);
  font-size: 0.85rem;
`;

const AvailabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const AvailabilityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-tertiary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--color-purple-primary);
    background: rgba(105, 51, 255, 0.05);
  }
`;

const ItemIcon = styled.div`
  color: var(--color-purple-primary);
  font-size: 1.25rem;
  margin-top: 0.25rem;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemLabel = styled.div`
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
`;

const ItemValue = styled.div`
  color: var(--color-text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemSubtext = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.8rem;
`;

const OpportunityTypes = styled.div`
  grid-column: 1 / -1;
  padding: 1rem;
  background: var(--background-tertiary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

const TypesLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const TypesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TypeTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(46, 213, 115, 0.1);
  color: #2ed573;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(46, 213, 115, 0.3);

  svg {
    font-size: 0.75rem;
  }
`;

const ContactPrompt = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(105, 51, 255, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(105, 51, 255, 0.2);
`;

const ContactText = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const ContactActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ContactButton = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid;

  ${props => props.$primary ? `
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);

    &:hover {
      background: var(--color-purple-secondary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
  ` : `
    background: transparent;
    color: var(--color-purple-primary);
    border-color: var(--color-purple-primary);

    &:hover {
      background: var(--color-purple-primary);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-soft);
    }
  `}
`;

export default AvailabilityStatus;
