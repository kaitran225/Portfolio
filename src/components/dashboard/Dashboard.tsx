import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardItem from './DashboardItem';

// Apply width provider to make the grid responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const { dashboardState, handleLayoutChange } = useDashboard();
  
  return (
    <DashboardWrapper>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: dashboardState.layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable
        isResizable
        onLayoutChange={(layout) => handleLayoutChange(layout)}
        draggableHandle=".drag-handle"
      >
        {dashboardState.items.map((item) => (
          <div key={item.id} data-grid={dashboardState.layout.find(l => l.i === item.id)}>
            <DashboardItem item={item} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #121212;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  
  .react-grid-item {
    transition: all 200ms ease;
    transition-property: left, top, width, height;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    
    &.react-grid-placeholder {
      background: #0984e3;
      opacity: 0.2;
      transition-duration: 100ms;
      z-index: 2;
      border-radius: 8px;
    }
    
    &.react-draggable-dragging {
      opacity: 0.8;
      z-index: 10;
    }
    
    &.resizing {
      opacity: 0.9;
      z-index: 10;
    }
  }
`;

export default Dashboard; 