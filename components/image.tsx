'use client';

import { CldImage, CldImageProps } from 'next-cloudinary';

export const Image = (props: CldImageProps) => {
  return <CldImage format="avif" preload {...props} />;
};
