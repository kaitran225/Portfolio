import React, { useEffect } from 'react';
import './App.css';
import './styles/Layout.css';
import Terminal from './components/Terminal';
import MusicPlayer from './components/MusicPlayer';
import VideoEmbed from './components/VideoEmbed';

function App() {
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
                  <source src={process.env.PUBLIC_URL + '/assets/Calantha.mp4'} type="video/mp4" />
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
          <div className="imgHolder"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
