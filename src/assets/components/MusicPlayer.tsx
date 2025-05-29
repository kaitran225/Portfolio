import React, { useEffect } from 'react';

interface MusicPlayerProps {
  trackId: string;
  theme?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ trackId, theme = '0' }) => {
  useEffect(() => {
    // Load Spotify embed API if needed
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe 
      style={{ borderRadius: '12px' }}
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=${theme}`} 
      width="100%"
      height="170" 
      frameBorder="0" 
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy"
    ></iframe>
  );
};

export default MusicPlayer; 