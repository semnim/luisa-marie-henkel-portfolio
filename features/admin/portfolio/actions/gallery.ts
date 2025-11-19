'use server';

import { db } from '@/lib/db';
import { projects, images } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import {
  validateImageFile,
  uploadImageToCloudinary,
  deleteImagesFromCloudinary,
} from '@/features/portfolio/lib/cloudinary-utils';
import {
  insertGalleryImages,
  deleteGalleryImages,
  updateGalleryPositions,
} from '@/features/portfolio/lib/image-repository';

export interface SaveGalleryData {
  newFiles: File[];
  deletedIds: number[];
  positions: Array<{ id: number | string; position: number }>;
}

export interface UploadResult {
  tempId: string;
  image?: {
    id: number;
    publicId: string;
    imageUrl: string;
    width: number;
    height: number;
    format: string;
  };
  error?: string;
}

export interface SaveGalleryResult {
  success: boolean;
  results?: {
    uploaded: UploadResult[];
    deleted: number;
  };
  error?: string;
}

/**
 * Save gallery images: upload new, delete marked, update positions
 */
export async function saveGalleryImages(
  projectId: number,
  data: SaveGalleryData
): Promise<SaveGalleryResult> {
  try {
    // Step 1: Validate all files upfront
    const validationErrors: Array<{ tempId: string; error: string }> = [];

    for (let i = 0; i < data.newFiles.length; i++) {
      const file = data.newFiles[i];
      const validation = validateImageFile(file);

      if (!validation.valid) {
        validationErrors.push({
          tempId: `new-${i}`,
          error: validation.error || 'Invalid file',
        });
      }
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Some files failed validation',
        results: {
          uploaded: validationErrors.map((err) => ({
            tempId: err.tempId,
            error: err.error,
          })),
          deleted: 0,
        },
      };
    }

    // Step 2: Fetch project to get slug and title
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return {
        success: false,
        error: 'Project not found',
      };
    }

    const projectSlug = project[0].slug;
    const projectTitle = project[0].title;

    // Sanitize title for folder name
    const folderName = projectTitle.toLowerCase().replace(/\s+/g, '-');
    const cloudinaryFolder = `portfolio/projects/${folderName}`;

    // Step 3: Delete marked images
    let deletedCount = 0;
    if (data.deletedIds.length > 0) {
      // Fetch images to get publicIds for Cloudinary deletion
      const imagesToDelete = await db
        .select()
        .from(images)
        .where(eq(images.projectSlug, projectSlug));

      const publicIdsToDelete = imagesToDelete
        .filter((img) => data.deletedIds.includes(img.id))
        .map((img) => img.publicId);

      // Delete from DB first
      await deleteGalleryImages(data.deletedIds);
      deletedCount = data.deletedIds.length;

      // Best-effort delete from Cloudinary
      if (publicIdsToDelete.length > 0) {
        const deleteResult = await deleteImagesFromCloudinary(publicIdsToDelete);
        if (deleteResult.failed.length > 0) {
          console.warn(
            'Some images failed to delete from Cloudinary:',
            deleteResult.failed
          );
        }
      }
    }

    // Step 4: Upload new images sequentially
    const uploadResults: UploadResult[] = [];

    for (let i = 0; i < data.newFiles.length; i++) {
      const file = data.newFiles[i];
      const tempId = `new-${i}`;

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadImageToCloudinary(
          file,
          cloudinaryFolder
        );

        // Insert to DB immediately
        const [inserted] = await insertGalleryImages(projectSlug, [
          {
            publicId: uploadResult.public_id,
            imageUrl: uploadResult.secure_url,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            position: 0, // Will update positions later
          },
        ]);

        uploadResults.push({
          tempId,
          image: {
            id: inserted.id,
            publicId: inserted.publicId,
            imageUrl: inserted.imageUrl,
            width: inserted.width || 0,
            height: inserted.height || 0,
            format: inserted.format || '',
          },
        });
      } catch (error) {
        console.error(`Failed to upload image ${i}:`, error);
        uploadResults.push({
          tempId,
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }
    }

    // Step 5: Update positions for all images
    if (data.positions.length > 0) {
      // Map tempIds to actual DB ids for newly uploaded images
      const tempIdToDbId = new Map<string, number>();
      uploadResults.forEach((result) => {
        if (result.image) {
          tempIdToDbId.set(result.tempId, result.image.id);
        }
      });

      // Convert positions with tempIds to DB ids
      const positionUpdates = data.positions
        .map((pos) => {
          // If it's a tempId, map to DB id
          if (typeof pos.id === 'string' && pos.id.startsWith('new-')) {
            const dbId = tempIdToDbId.get(pos.id);
            if (dbId) {
              return { id: dbId, position: pos.position };
            }
            return null;
          }
          // Otherwise it's already a DB id
          return { id: pos.id as number, position: pos.position };
        })
        .filter((pos): pos is { id: number; position: number } => pos !== null);

      // Update positions (non-critical, log errors but don't fail)
      try {
        await updateGalleryPositions(positionUpdates);
      } catch (error) {
        console.warn('Failed to update positions:', error);
        // Don't fail the whole operation if position update fails
      }
    }

    return {
      success: true,
      results: {
        uploaded: uploadResults,
        deleted: deletedCount,
      },
    };
  } catch (error) {
    console.error('Failed to save gallery images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save',
    };
  }
}
