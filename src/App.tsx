import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/Layout.css';
import Terminal from './assets/components/Terminal';
import MusicPlayer from './assets/components/MusicPlayer';
import VideoEmbed from './assets/components/VideoEmbed';
import ImageGallery from './assets/components/ImageGallery';

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
  }, [portfolioFolders]);

  return (
    <div className="App">
      <div id="bg"></div>
      <div className="base">
        <div className="CC">
          <div className="group_I">
            <div className="c_I">
              <div id="j" className="container">
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
              <div id="c" className="container">c</div>
            </div>
            <div className="c_II">
              <div id="g" className="container">g</div>
              <div id="h" className="container">
                <video loop autoPlay muted>
                  <source src={`${process.env.PUBLIC_URL}/assets/Calantha/Calantha.mp4`} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <div id="music" className="container">
            <MusicPlayer trackId="0OIed6UFpfT2nW4BffD7Js" />
          </div>
          <div id="commandPrompt" className="container">
            <Terminal />
          </div>
        </div>
        <div className="DD">
          <div id="d" className="container">d</div>
          <div id="f" className="container">f</div>
          <div id="i" className="container">i</div>
        </div>
        <div className="FF">
          <div className="imgHolder">
            <ImageGallery folder={currentFolder} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
