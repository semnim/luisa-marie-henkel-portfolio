'use server';

import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import {
  validateImageFile,
  uploadImageToCloudinary,
  deleteImagesFromCloudinary,
} from '@/lib/cloudinary-utils';
import {
  fetchProjectMediaImages,
  insertProjectMediaImages,
  deleteProjectMediaImages,
} from '@/lib/image-repository';

export interface SaveProjectMediaFiles {
  desktop?: File;
  mobile?: File;
}

export interface SaveProjectMediaResult {
  success: boolean;
  error?: string;
  uploadedImages?: Array<{
    variant: 'desktop' | 'mobile' | 'both';
    imageUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  }>;
}

/**
 * Save project media (hero or thumbnail):
 * - Validate files
 * - Fetch existing images
 * - Upload new to Cloudinary
 * - Delete old from Cloudinary (best-effort)
 * - Delete old from DB
 * - Insert new to DB
 * 
 * Variant logic:
 * - Single upload (desktop OR mobile) → variant='both'
 * - Dual upload (desktop AND mobile) → separate desktop/mobile variants
 */
export async function saveProjectMedia(
  projectId: number,
  mediaType: 'project_hero' | 'thumbnail',
  files: SaveProjectMediaFiles
): Promise<SaveProjectMediaResult> {
  try {
    // Validate at least one file provided
    if (!files.desktop && !files.mobile) {
      return {
        success: false,
        error: 'No files selected',
      };
    }

    // Validate files
    if (files.desktop) {
      const validation = validateImageFile(files.desktop);
      if (!validation.valid) {
        return {
          success: false,
          error: `Desktop: ${validation.error}`,
        };
      }
    }

    if (files.mobile) {
      const validation = validateImageFile(files.mobile);
      if (!validation.valid) {
        return {
          success: false,
          error: `Mobile: ${validation.error}`,
        };
      }
    }

    // Fetch project to get slug and title
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

    // Sanitize title for Cloudinary folder name
    const folderName = projectTitle.toLowerCase().replace(/\s+/g, '-');
    const cloudinaryFolder = `portfolio/projects/${folderName}`;

    // Fetch existing media images
    const existingImages = await fetchProjectMediaImages(projectSlug, mediaType);

    // Determine variant logic
    const uploadBoth = files.desktop && files.mobile;

    // Upload new images to Cloudinary
    const uploadedImages: Array<{
      variant: 'desktop' | 'mobile' | 'both';
      imageUrl: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
    }> = [];

    if (uploadBoth) {
      // Upload desktop
      const desktopResult = await uploadImageToCloudinary(
        files.desktop!,
        cloudinaryFolder
      );
      uploadedImages.push({
        variant: 'desktop',
        imageUrl: desktopResult.secure_url,
        publicId: desktopResult.public_id,
        width: desktopResult.width,
        height: desktopResult.height,
        format: desktopResult.format,
      });

      // Upload mobile
      const mobileResult = await uploadImageToCloudinary(
        files.mobile!,
        cloudinaryFolder
      );
      uploadedImages.push({
        variant: 'mobile',
        imageUrl: mobileResult.secure_url,
        publicId: mobileResult.public_id,
        width: mobileResult.width,
        height: mobileResult.height,
        format: mobileResult.format,
      });
    } else {
      // Upload single file as 'both'
      const file = files.desktop || files.mobile!;
      const uploadResult = await uploadImageToCloudinary(file, cloudinaryFolder);
      uploadedImages.push({
        variant: 'both',
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      });
    }

    // Delete old images from Cloudinary (best-effort)
    if (existingImages.length > 0) {
      const publicIdsToDelete = existingImages.map((img) => img.publicId);
      const deleteResult = await deleteImagesFromCloudinary(publicIdsToDelete);

      if (deleteResult.failed.length > 0) {
        console.warn(
          `Failed to delete some ${mediaType} images from Cloudinary:`,
          deleteResult.failed
        );
      }
    }

    // Delete old images from DB
    if (existingImages.length > 0) {
      const imageIdsToDelete = existingImages.map((img) => img.id);
      await deleteProjectMediaImages(imageIdsToDelete);
    }

    // Insert new images to DB
    await insertProjectMediaImages(projectSlug, mediaType, uploadedImages);

    return {
      success: true,
      uploadedImages,
    };
  } catch (error) {
    console.error(`Failed to save ${mediaType}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save',
    };
  }
}
