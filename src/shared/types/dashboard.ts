import { Layout } from 'react-grid-layout';

export interface DashboardItem {
  id: string;
  title: string;
  type: 'terminal' | 'music' | 'video' | 'threejs' | 'about' | 'projects' | 'contact';
  minW?: number;
  minH?: number;
  content?: any;
}

export interface DashboardLayout extends Layout {
  id: string;
  type: DashboardItem['type'];
}

export interface DashboardState {
  items: DashboardItem[];
  layout: DashboardLayout[];
} 