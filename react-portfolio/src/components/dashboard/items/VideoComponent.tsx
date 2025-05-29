import React from 'react';
import styled from 'styled-components';

const VideoComponent: React.FC = () => {
  return (
    <VideoContainer>
      <VideoEmbed>
        <iframe
          width="100%"
          height="100%"
          src="https://youtube.com/embed/R8OGWxJgNsY?controls=0&autoplay=1&mute=1&loop=1&iv_load_policy=3&playlist=R8OGWxJgNsY"
          title="Portfolio Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </VideoEmbed>
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const VideoEmbed = styled.div`
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export default VideoComponent; 