const normalizeSrc = (src: string) => src.replace(/^\//, '');

export default function cloudinaryLoader({
  src,
  quality,
  width,
}: {
  src: string;
  quality: number;
  width?: number;
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error(
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required in the environment'
    );
  }
  const optionalParams = [width ? `w_${width}` : null].filter(Boolean);
  const params = [
    'f_auto',
    'c_limit',
    `q_${quality || 'auto'}`,
    ...optionalParams,
  ];

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(
    ','
  )}/${normalizeSrc(src)}`;
}
