'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  url: string;
  poster?: string;
};

const DimmedOverlay = () => {
  return (
    <div className="absolute inset-0 bg-radial from-transparent to-black/25 z-10" />
  );
};

export const BackgroundVideo = ({ children, url, poster }: Props) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <>
      <DimmedOverlay />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Fallback poster image */}
        {poster && (
          <Image
            src={poster}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Vimeo iframe */}
        <iframe
          title="vimeo-player"
          src="https://player.vimeo.com/video/1026452324?autoplay=1&loop=1&muted=1&background=1#t=6s"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78dvh] h-dvh border-0 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          allow="autoplay; fullscreen; picture-in-picture"
          onLoad={() => {
            // Delay showing video to ensure Vimeo content is ready
            setTimeout(() => setIsVideoLoaded(true), 2000);
          }}
        />
      </div>
      {children}
    </>
  );
};
