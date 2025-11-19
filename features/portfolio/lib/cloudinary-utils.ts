import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file size and type
 */
export function validateImageFile(
  file: File,
  maxSize: number = MAX_IMAGE_SIZE
): ValidationResult {
  if (file.size > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds ${maxMB}MB limit`,
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: JPEG, PNG, WebP',
    };
  }

  return { valid: true };
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload image to Cloudinary with optional progress tracking
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  // Convert File to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary with progress simulation
  // Note: Cloudinary Node SDK doesn't expose real upload progress
  // We simulate progress for better UX
  if (onProgress) {
    onProgress(30);
  }

  const result = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              if (onProgress) {
                onProgress(100);
              }
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
              });
            } else {
              reject(new Error('Upload failed - no result'));
            }
          }
        )
        .end(buffer);
    }
  );

  return result;
}

/**
 * Delete single image from Cloudinary
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
    throw error;
  }
}

export interface BatchDeleteResult {
  success: string[];
  failed: string[];
}

/**
 * Delete multiple images from Cloudinary (best-effort)
 */
export async function deleteImagesFromCloudinary(
  publicIds: string[]
): Promise<BatchDeleteResult> {
  const result: BatchDeleteResult = {
    success: [],
    failed: [],
  };

  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId);
      result.success.push(publicId);
    } catch (error) {
      console.warn(`Failed to delete ${publicId}:`, error);
      result.failed.push(publicId);
    }
  }

  return result;
}
