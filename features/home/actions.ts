'use server';

import { db } from '@/lib/db';
import { images, projects, type Image } from '@/lib/schema';
import { v2 as cloudinary } from 'cloudinary';
import { eq, and } from 'drizzle-orm';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============ HERO ACTIONS ============

type HeroVariant = 'desktop' | 'mobile' | 'both';

interface HeroImages {
  desktop?: Image;
  mobile?: Image;
  both?: Image;
}

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Fetch current hero images from database
 */
export async function fetchCurrentHero(): Promise<ActionResult<HeroImages>> {
  try {
    const heroImages = await db
      .select()
      .from(images)
      .where(eq(images.imageType, 'home_hero'));

    const result: HeroImages = {};

    for (const img of heroImages) {
      if (img.variant === 'desktop') result.desktop = img;
      else if (img.variant === 'mobile') result.mobile = img;
      else if (img.variant === 'both') result.both = img;
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to fetch hero images:', error);
    return {
      success: false,
      error: 'Failed to fetch hero images',
    };
  }
}

/**
 * Upload hero image to Cloudinary and save to database
 */
export async function uploadHero(
  formData: FormData
): Promise<ActionResult<Image>> {
  try {
    const variant = formData.get('variant') as HeroVariant;
    const file = formData.get('file') as File;

    // Validation
    if (!variant || !['desktop', 'mobile', 'both'].includes(variant)) {
      return { success: false, error: 'Invalid variant' };
    }

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File size exceeds 10MB limit' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Allowed: JPEG, PNG, WebP',
      };
    }

    // Convert File to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
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
            folder: 'portfolio/hero',
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

    // Check if record exists
    const existingImage = await db
      .select()
      .from(images)
      .where(
        and(eq(images.imageType, 'home_hero'), eq(images.variant, variant))
      )
      .limit(1);

    let savedImage: Image;

    if (existingImage.length > 0) {
      // Update existing record
      const [updated] = await db
        .update(images)
        .set({
          publicId: uploadResult.public_id,
          imageUrl: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        })
        .where(eq(images.id, existingImage[0].id))
        .returning();

      savedImage = updated;

      // Delete old Cloudinary image if different
      if (
        existingImage[0].publicId &&
        existingImage[0].publicId !== uploadResult.public_id
      ) {
        try {
          await cloudinary.uploader.destroy(existingImage[0].publicId);
        } catch (error) {
          console.error('Failed to delete old Cloudinary image:', error);
          // Don't fail the request if cleanup fails
        }
      }
    } else {
      // Insert new record
      try {
        const [inserted] = await db
          .insert(images)
          .values({
            projectSlug: null,
            publicId: uploadResult.public_id,
            imageUrl: uploadResult.secure_url,
            imageType: 'home_hero',
            variant,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
          })
          .returning();

        savedImage = inserted;
      } catch (dbError) {
        // Rollback: Delete from Cloudinary if DB insert fails
        try {
          await cloudinary.uploader.destroy(uploadResult.public_id);
        } catch (cleanupError) {
          console.error('Failed to cleanup Cloudinary image:', cleanupError);
        }
        throw dbError;
      }
    }

    return { success: true, data: savedImage };
  } catch (error) {
    console.error('Failed to upload hero image:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to upload hero image',
    };
  }
}

/**
 * Convert "both" variant to either "desktop" or "mobile"
 * Keeps the same Cloudinary image but changes the variant in DB
 */
export async function convertHero(
  toVariant: 'desktop' | 'mobile'
): Promise<ActionResult<Image>> {
  try {
    if (!toVariant || !['desktop', 'mobile'].includes(toVariant)) {
      return { success: false, error: 'Invalid target variant' };
    }

    // Find the "both" image
    const bothImage = await db
      .select()
      .from(images)
      .where(and(eq(images.imageType, 'home_hero'), eq(images.variant, 'both')))
      .limit(1);

    if (bothImage.length === 0) {
      return { success: false, error: 'No "both" image found to convert' };
    }

    const sourceImage = bothImage[0];

    // Create new variant with same image data
    const [newImage] = await db
      .insert(images)
      .values({
        projectSlug: null,
        publicId: sourceImage.publicId,
        imageUrl: sourceImage.imageUrl,
        imageType: 'home_hero',
        variant: toVariant,
        width: sourceImage.width,
        height: sourceImage.height,
        format: sourceImage.format,
        altText: sourceImage.altText,
      })
      .returning();

    // Delete the "both" entry from database (but NOT from Cloudinary since we're reusing it)
    await db.delete(images).where(eq(images.id, sourceImage.id));

    return { success: true, data: newImage };
  } catch (error) {
    console.error('Failed to convert hero variant:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to convert hero variant',
    };
  }
}

/**
 * Delete hero image from Cloudinary and database
 */
export async function deleteHero(
  variant: HeroVariant
): Promise<ActionResult<void>> {
  try {
    if (!variant || !['desktop', 'mobile', 'both'].includes(variant)) {
      return { success: false, error: 'Invalid variant' };
    }

    // Find the image record
    const existingImage = await db
      .select()
      .from(images)
      .where(
        and(eq(images.imageType, 'home_hero'), eq(images.variant, variant))
      )
      .limit(1);

    if (existingImage.length === 0) {
      return { success: false, error: 'Image not found' };
    }

    const image = existingImage[0];

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with DB deletion even if Cloudinary fails
    }

    // Delete from database
    await db.delete(images).where(eq(images.id, image.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to delete hero image:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete hero image',
    };
  }
}

// ============ FEATURED ACTIONS ============

interface FeaturedProject {
  projectSlug: string;
  projectTitle: string;
  position: number;
  images: {
    desktop?: Image;
    mobile?: Image;
    both?: Image;
  };
}

/**
 * Fetch all featured projects with their images
 */
export async function fetchFeaturedProjects(): Promise<
  ActionResult<FeaturedProject[]>
> {
  try {
    // Query: Get all featured images with their project info
    const featuredImages = await db
      .select({
        image: images,
        project: projects,
      })
      .from(images)
      .leftJoin(projects, eq(images.projectSlug, projects.slug))
      .where(eq(images.imageType, 'featured'));

    // Group by project slug and position
    const projectsMap = new Map<string, FeaturedProject>();

    for (const row of featuredImages) {
      if (!row.project) continue;

      const key = `${row.project.slug}-${row.image.position}`;

      if (!projectsMap.has(key)) {
        projectsMap.set(key, {
          projectSlug: row.project.slug,
          projectTitle: row.project.title,
          position: row.image.position || 0,
          images: {},
        });
      }

      const project = projectsMap.get(key)!;

      if (row.image.variant === 'desktop') {
        project.images.desktop = row.image;
      } else if (row.image.variant === 'mobile') {
        project.images.mobile = row.image;
      } else if (row.image.variant === 'both') {
        project.images.both = row.image;
      }
    }

    // Convert to array and sort by position
    const result = Array.from(projectsMap.values()).sort(
      (a, b) => a.position - b.position
    );

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return {
      success: false,
      error: 'Failed to fetch featured projects',
    };
  }
}

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
