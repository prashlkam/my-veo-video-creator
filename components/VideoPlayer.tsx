import React from 'react';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        key={src} // Force re-render when src changes
        controls
        autoPlay
        loop
        className="w-full h-full object-contain"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
