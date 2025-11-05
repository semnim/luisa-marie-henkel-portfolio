type Props = {
  children: React.ReactNode;
  url: string;
};
const DimmedOverlay = () => {
  return (
    <div className="absolute inset-0 bg-radial from-transparent to-black/25" />
  );
};

export const BackgroundVideo = ({ children, url }: Props) => {
  return (
    <>
      <DimmedOverlay />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={url} type="video/mp4" />
      </video>
      {children}
    </>
  );
};
