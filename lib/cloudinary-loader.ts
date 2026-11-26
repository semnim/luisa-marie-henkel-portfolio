import type { ImageLoaderProps } from 'next/image';

const UPLOAD_SEGMENT = '/image/upload/';

export const isCloudinaryUrl = (src: unknown): src is string =>
  typeof src === 'string' &&
  src.includes('res.cloudinary.com') &&
  src.includes(UPLOAD_SEGMENT);

/**
 * next/image loader that lets Cloudinary resize and re-encode the image.
 * The uploads are stored at full size; without this every visitor downloads
 * the original, however small it is shown. `c_limit` never upscales, `f_auto`
 * picks AVIF or WebP by browser, `q_auto` picks the compression.
 */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  if (!isCloudinaryUrl(src)) return src;
  const transformation = `f_auto,q_${quality ?? 'auto'},c_limit,w_${width}`;
  return src.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transformation}/`);
}
