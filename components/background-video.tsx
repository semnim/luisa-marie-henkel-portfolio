'use client';

type Props = {
  children: React.ReactNode;
  url: string;
};

const DimmedOverlay = () => {
  return (
    <div className="absolute inset-0 bg-radial from-transparent to-black/25 z-10" />
  );
};

export const BackgroundVideo = ({ children }: Props) => {
  return (
    <>
      <DimmedOverlay />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
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
        </video>
      </div>
      {children}
    </>
  );
};
