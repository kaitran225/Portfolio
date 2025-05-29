import React from 'react';

interface VideoEmbedProps {
  videoId: string;
  width: string | number;
  height: string | number;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({
  videoId,
  width,
  height,
  autoplay = false,
  mute = false,
  loop = false,
}) => {
  let src = `https://youtube.com/embed/${videoId}?controls=0`;
  
  if (autoplay) src += '&autoplay=1';
  if (mute) src += '&mute=1';
  if (loop) {
    src += '&loop=1&playlist=' + videoId;
  }
  src += '&iv_load_policy=3';
  
  return (
    <iframe
      width={width}
      height={height}
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
};

export default VideoEmbed; 