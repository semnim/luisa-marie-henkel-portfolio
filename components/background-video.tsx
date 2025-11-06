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
        {/* {poster && (
          <Image
            src={poster}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        )} */}

        <Image
          src={'/assets/hero_fallback.webp'}
          className="object-cover"
          fill
          alt="fallback"
        />
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source
            src={
              'https://res.cloudinary.com/luisa-marie-henkel/video/upload/q_auto:best,fps_24/v1762423988/hero-bg-trimmed_hbsmrn.webm'
            }
            type="video/mp4"
          />
          <source
            src={
              'https://res.cloudinary.com/luisa-marie-henkel/video/upload/q_auto:best,fps_24/v1762423988/hero-bg-trimmed_hbsmrn.mp4'
            }
            type="video/mp4"
          />
        </video> */}
      </div>
      {children}
    </>
  );
};
