# React Portfolio with Resizable Dashboard

A modern portfolio website built with React, TypeScript, and Three.js featuring a resizable dashboard layout.

## Features

- Interactive resizable dashboard with draggable components
- 3D visualization using Three.js
- Terminal simulation for command-based interaction
- Responsive design that works on all devices
- Music player integration with Spotify
- Video player integration with YouTube
- Project showcase section
- Contact form

## Technologies Used

- React with TypeScript
- Three.js and React Three Fiber for 3D graphics
- react-grid-layout for the resizable dashboard
- Styled Components for styling
- GSAP for animations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd react-portfolio
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
react-portfolio/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── items/         # Individual dashboard items
│   │   │   ├── Dashboard.tsx  # Main dashboard layout
│   │   │   └── DashboardItem.tsx
│   │   └── three/             # Three.js components
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # Global styles
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main application component
│   └── index.tsx              # Entry point
└── ...
```

## Dashboard Items

The dashboard consists of several resizable and draggable components:

1. **Terminal** - Interactive command-line interface
2. **Music Player** - Embedded Spotify player
3. **Video Player** - YouTube video showcase
4. **3D View** - Three.js 3D visualization
5. **About Me** - Personal information and skills
6. **Projects** - Portfolio project showcase
7. **Contact** - Contact form and social links

## Customization

### Adding New Dashboard Items

1. Create a new component in `src/components/dashboard/items/`
2. Add the component type to the `DashboardItem` type in `src/types/dashboard.ts`
3. Import and add the component to the render function in `DashboardItem.tsx`
4. Add the item to the initial items in `useDashboard.ts`

### Changing the Layout

Modify the `initialLayout` array in `src/hooks/useDashboard.ts` to change the default positions and sizes of dashboard items.

## License

MIT
