'use server';

import { db } from '@/lib/db';
import { images } from '@/lib/schema';
import { v2 as cloudinary } from 'cloudinary';
import { and, eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Save all featured images in batch
 */
export async function saveAllFeatured(
  data: Array<{
    projectSlug: string;
    position: number;
    desktop?: File;
    mobile?: File;
    both?: File;
  }>
): Promise<ActionResult<void>> {
  try {
    for (const item of data) {
      const { projectSlug, position, desktop, mobile, both } = item;

      // Validation: desktop XOR mobile not allowed
      if ((desktop && !mobile) || (!desktop && mobile)) {
        return {
          success: false,
          error: `Project ${projectSlug}: Both desktop and mobile required`,
        };
      }

      // Validate file types and sizes
      const filesToCheck = [desktop, mobile, both].filter(
        (f) => f !== undefined
      ) as File[];

      for (const file of filesToCheck) {
        if (file.size > MAX_FILE_SIZE) {
          return {
            success: false,
            error: `File ${file.name} exceeds 10MB limit`,
          };
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          return {
            success: false,
            error: `File ${file.name} has invalid type. Allowed: JPEG, PNG, WebP`,
          };
        }
      }

      // Delete old Cloudinary folder
      try {
        await cloudinary.api.delete_resources_by_prefix(
          `portfolio/featured/${projectSlug}/`
        );
        await cloudinary.api.delete_folder(`portfolio/featured/${projectSlug}`);
      } catch (error) {
        console.warn('Failed to delete old folder:', error);
        // Continue even if deletion fails (folder might not exist)
      }

      // Delete old DB records
      await db
        .delete(images)
        .where(
          and(eq(images.projectSlug, projectSlug), eq(images.imageType, 'featured'))
        );

      // Upload and save based on mode
      if (both) {
        // Both mode: single image for desktop + mobile
        const arrayBuffer = await both.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{
          public_id: string;
          secure_url: string;
          width: number;
          height: number;
          format: string;
        }>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: `portfolio/featured/${projectSlug}`,
                public_id: 'both',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else reject(new Error('Upload failed'));
              }
            )
            .end(buffer);
        });

        await db.insert(images).values({
          projectSlug,
          publicId: uploadResult.public_id,
          imageUrl: uploadResult.secure_url,
          imageType: 'featured',
          variant: 'both',
          position,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        });
      } else if (desktop && mobile) {
        // Separate mode: upload desktop
        const desktopBuffer = Buffer.from(await desktop.arrayBuffer());
        const desktopResult = await new Promise<{
          public_id: string;
          secure_url: string;
          width: number;
          height: number;
          format: string;
        }>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: `portfolio/featured/${projectSlug}`,
                public_id: 'desktop',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else reject(new Error('Upload failed'));
              }
            )
            .end(desktopBuffer);
        });

        // Upload mobile
        const mobileBuffer = Buffer.from(await mobile.arrayBuffer());
        const mobileResult = await new Promise<{
          public_id: string;
          secure_url: string;
          width: number;
          height: number;
          format: string;
        }>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: `portfolio/featured/${projectSlug}`,
                public_id: 'mobile',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else reject(new Error('Upload failed'));
              }
            )
            .end(mobileBuffer);
        });

        // Insert both records
        await db.insert(images).values([
          {
            projectSlug,
            publicId: desktopResult.public_id,
            imageUrl: desktopResult.secure_url,
            imageType: 'featured',
            variant: 'desktop',
            position,
            width: desktopResult.width,
            height: desktopResult.height,
            format: desktopResult.format,
          },
          {
            projectSlug,
            publicId: mobileResult.public_id,
            imageUrl: mobileResult.secure_url,
            imageType: 'featured',
            variant: 'mobile',
            position,
            width: mobileResult.width,
            height: mobileResult.height,
            format: mobileResult.format,
          },
        ]);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to save featured images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save',
    };
  }
}

/**
 * Delete featured images for a project
 */
export async function deleteFeaturedImages(
  projectSlug: string
): Promise<ActionResult<void>> {
  try {
    // Get existing images
    const existingImages = await db
      .select()
      .from(images)
      .where(
        and(eq(images.projectSlug, projectSlug), eq(images.imageType, 'featured'))
      );

    // Delete from Cloudinary
    for (const img of existingImages) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (error) {
        console.warn('Failed to delete from Cloudinary:', error);
      }
    }

    // Delete folder
    try {
      await cloudinary.api.delete_folder(`portfolio/featured/${projectSlug}`);
    } catch (error) {
      console.warn('Failed to delete folder:', error);
    }

    // Delete from DB
    await db
      .delete(images)
      .where(
        and(eq(images.projectSlug, projectSlug), eq(images.imageType, 'featured'))
      );

    return { success: true };
  } catch (error) {
    console.error('Failed to delete featured images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete',
    };
  }
}
