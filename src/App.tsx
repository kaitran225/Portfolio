import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './App.css';
import './styles/Layout.css';
import Terminal from './components/Terminal';
import MusicPlayer from './components/MusicPlayer';
import VideoEmbed from './components/VideoEmbed';
import ImageGallery from './components/ImageGallery';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Apply width provider to make the grid responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  const [currentFolder, setCurrentFolder] = useState<string>('Calantha');
  const portfolioFolders = ['Calantha', 'Zena', 'Slab', 'Personal', 'GateWay', 'Cloud'];
  
  // Rotate through portfolio folders every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFolder(prevFolder => {
        const currentIndex = portfolioFolders.indexOf(prevFolder);
        const nextIndex = (currentIndex + 1) % portfolioFolders.length;
        return portfolioFolders[nextIndex];
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Define initial layouts for each breakpoint
  const layouts = {
    lg: [
      { i: 'logo', x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
      { i: 'c', x: 0, y: 3, w: 3, h: 1, minW: 1, minH: 1 },
      { i: 'g', x: 3, y: 0, w: 3, h: 1, minW: 1, minH: 1 },
      { i: 'h', x: 3, y: 1, w: 3, h: 3, minW: 2, minH: 2 },
      { i: 'music', x: 0, y: 4, w: 6, h: 1, minW: 2, minH: 1 },
      { i: 'commandPrompt', x: 0, y: 5, w: 6, h: 2, minW: 2, minH: 2 },
      { i: 'd', x: 6, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'f', x: 6, y: 2, w: 2, h: 1, minW: 1, minH: 1 },
      { i: 'i', x: 6, y: 3, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'imgHolder', x: 8, y: 0, w: 4, h: 7, minW: 2, minH: 3 },
    ],
    md: [
      { i: 'logo', x: 0, y: 0, w: 3, h: 3 },
      { i: 'c', x: 0, y: 3, w: 3, h: 1 },
      { i: 'g', x: 3, y: 0, w: 3, h: 1 },
      { i: 'h', x: 3, y: 1, w: 3, h: 3 },
      { i: 'music', x: 0, y: 4, w: 6, h: 1 },
      { i: 'commandPrompt', x: 0, y: 5, w: 6, h: 2 },
      { i: 'd', x: 6, y: 0, w: 4, h: 2 },
      { i: 'f', x: 6, y: 2, w: 4, h: 1 },
      { i: 'i', x: 6, y: 3, w: 4, h: 4 },
      { i: 'imgHolder', x: 0, y: 7, w: 10, h: 4 },
    ],
    sm: [
      { i: 'logo', x: 0, y: 0, w: 3, h: 3 },
      { i: 'c', x: 3, y: 0, w: 3, h: 1 },
      { i: 'g', x: 0, y: 3, w: 3, h: 1 },
      { i: 'h', x: 3, y: 1, w: 3, h: 3 },
      { i: 'music', x: 0, y: 4, w: 6, h: 1 },
      { i: 'commandPrompt', x: 0, y: 5, w: 6, h: 2 },
      { i: 'd', x: 0, y: 7, w: 2, h: 2 },
      { i: 'f', x: 2, y: 7, w: 2, h: 2 },
      { i: 'i', x: 4, y: 7, w: 2, h: 2 },
      { i: 'imgHolder', x: 0, y: 9, w: 6, h: 4 },
    ]
  };

  return (
    <div className="App">
      <div id="bg"></div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable={true}
        isResizable={true}
        margin={[10, 10]}
        containerPadding={[10, 10]}
      >
        <div key="logo" className="container">
          <div className="logo">
            <VideoEmbed 
              videoId="R8OGWxJgNsY" 
              width="325" 
              height="325" 
              autoplay={true}
              mute={true}
              loop={true}
            />
          </div>
        </div>
        <div key="c" className="container">c</div>
        <div key="g" className="container">g</div>
        <div key="h" className="container">
          <video loop autoPlay muted>
            <source src={`${process.env.PUBLIC_URL}/assets/Calantha/Calantha.mp4`} type="video/mp4" />
          </video>
        </div>
        <div key="music" className="container">
          <MusicPlayer trackId="0OIed6UFpfT2nW4BffD7Js" />
        </div>
        <div key="commandPrompt" className="container">
          <Terminal />
        </div>
        <div key="d" className="container">d</div>
        <div key="f" className="container">f</div>
        <div key="i" className="container">i</div>
        <div key="imgHolder" className="container">
          <div className="imgHolder">
            <ImageGallery folder={currentFolder} />
          </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

export default App;
