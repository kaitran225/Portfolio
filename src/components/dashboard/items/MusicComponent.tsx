import React from 'react';
import styled from 'styled-components';

const MusicComponent: React.FC = () => {
  return (
    <MusicContainer>
      <SpotifyEmbed>
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/track/0OIed6UFpfT2nW4BffD7Js?utm_source=generator&theme=0"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Spotify Music Player"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </SpotifyEmbed>
    </MusicContainer>
  );
};

const MusicContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SpotifyEmbed = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export default MusicComponent; 