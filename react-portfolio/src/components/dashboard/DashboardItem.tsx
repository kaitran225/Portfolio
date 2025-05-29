import React from 'react';
import styled from 'styled-components';
import { DashboardItem as DashboardItemType } from '../../types/dashboard';
import TerminalComponent from './items/TerminalComponent';
import MusicComponent from './items/MusicComponent';
import VideoComponent from './items/VideoComponent';
import ThreeJSComponent from '../three/ThreeJSComponent';
import AboutComponent from './items/AboutComponent';
import ProjectsComponent from './items/ProjectsComponent';
import ContactComponent from './items/ContactComponent';

interface DashboardItemProps {
  item: DashboardItemType;
}

const DashboardItem: React.FC<DashboardItemProps> = ({ item }) => {
  // Render the appropriate component based on type
  const renderComponent = () => {
    switch (item.type) {
      case 'terminal':
        return <TerminalComponent />;
      case 'music':
        return <MusicComponent />;
      case 'video':
        return <VideoComponent />;
      case 'threejs':
        return <ThreeJSComponent />;
      case 'about':
        return <AboutComponent />;
      case 'projects':
        return <ProjectsComponent />;
      case 'contact':
        return <ContactComponent />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <ItemContainer>
      <ItemHeader className="drag-handle">
        <ItemTitle>{item.title}</ItemTitle>
        <ItemControls>
          <ControlButton>⚙️</ControlButton>
          <ControlButton>🗕</ControlButton>
          <ControlButton>🗖</ControlButton>
          <ControlButton>✕</ControlButton>
        </ItemControls>
      </ItemHeader>
      <ItemContent>
        {renderComponent()}
      </ItemContent>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #333;
  cursor: move;
  user-select: none;
`;

const ItemTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
`;

const ItemControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ItemContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 12px;
  background-color: #1e1e1e;
`;

export default DashboardItem; 