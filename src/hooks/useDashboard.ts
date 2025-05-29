import { useState, useCallback } from 'react';
import { Layout } from 'react-grid-layout';
import { DashboardItem, DashboardLayout, DashboardState } from '../types/dashboard';

// Initial dashboard items
const initialItems: DashboardItem[] = [
  { id: 'terminal', title: 'Terminal', type: 'terminal', minW: 2, minH: 2 },
  { id: 'music', title: 'Music Player', type: 'music', minW: 2, minH: 1 },
  { id: 'video', title: 'Video', type: 'video', minW: 2, minH: 2 },
  { id: 'threejs', title: '3D View', type: 'threejs', minW: 3, minH: 3 },
  { id: 'about', title: 'About Me', type: 'about', minW: 2, minH: 2 },
  { id: 'projects', title: 'Projects', type: 'projects', minW: 2, minH: 2 },
  { id: 'contact', title: 'Contact', type: 'contact', minW: 2, minH: 1 },
];

// Initial layout
const initialLayout: DashboardLayout[] = [
  { i: 'terminal', x: 0, y: 0, w: 3, h: 3, id: 'terminal', type: 'terminal' },
  { i: 'music', x: 3, y: 0, w: 3, h: 2, id: 'music', type: 'music' },
  { i: 'video', x: 6, y: 0, w: 3, h: 3, id: 'video', type: 'video' },
  { i: 'threejs', x: 0, y: 3, w: 6, h: 4, id: 'threejs', type: 'threejs' },
  { i: 'about', x: 6, y: 3, w: 3, h: 4, id: 'about', type: 'about' },
  { i: 'projects', x: 0, y: 7, w: 6, h: 3, id: 'projects', type: 'projects' },
  { i: 'contact', x: 6, y: 7, w: 3, h: 2, id: 'contact', type: 'contact' },
];

export const useDashboard = () => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    items: initialItems,
    layout: initialLayout,
  });

  // Handle layout changes
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setDashboardState((prevState) => ({
      ...prevState,
      layout: newLayout.map((layoutItem) => {
        const existingItem = prevState.layout.find((item) => item.i === layoutItem.i);
        return {
          ...layoutItem,
          id: layoutItem.i,
          type: existingItem?.type || 'terminal', // Default to terminal if type not found
        };
      }),
    }));
  }, []);

  // Add a new item to the dashboard
  const addItem = useCallback((item: DashboardItem, layoutItem: Layout) => {
    setDashboardState((prevState) => ({
      items: [...prevState.items, item],
      layout: [
        ...prevState.layout,
        { ...layoutItem, i: item.id, id: item.id, type: item.type },
      ],
    }));
  }, []);

  // Remove an item from the dashboard
  const removeItem = useCallback((id: string) => {
    setDashboardState((prevState) => ({
      items: prevState.items.filter((item) => item.id !== id),
      layout: prevState.layout.filter((item) => item.i !== id),
    }));
  }, []);

  return {
    dashboardState,
    handleLayoutChange,
    addItem,
    removeItem,
  };
}; 