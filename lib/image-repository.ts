import { db } from '@/lib/db';
import { images, Image } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export interface NewGalleryImage {
  publicId: string;
  imageUrl: string;
  width: number;
  height: number;
  format: string;
  position: number;
}

/**
 * Fetch all gallery images for a project
 */
export async function fetchGalleryImages(
  projectSlug: string
): Promise<Image[]> {
  const galleryImages = await db
    .select()
    .from(images)
    .where(
      and(
        eq(images.projectSlug, projectSlug),
        eq(images.imageType, 'gallery')
      )
    )
    .orderBy(images.position);

  return galleryImages;
}

/**
 * Insert multiple gallery images for a project
 */
export async function insertGalleryImages(
  projectSlug: string,
  imageData: NewGalleryImage[]
): Promise<Image[]> {
  if (imageData.length === 0) {
    return [];
  }

  const insertValues = imageData.map((img) => ({
    projectSlug,
    publicId: img.publicId,
    imageUrl: img.imageUrl,
    imageType: 'gallery' as const,
    variant: 'both' as const, // Gallery images don't need separate variants
    width: img.width,
    height: img.height,
    format: img.format,
    position: img.position,
    altText: null,
    caption: null,
  }));

  const inserted = await db.insert(images).values(insertValues).returning();

  return inserted;
}

/**
 * Delete gallery images by IDs
 */
export async function deleteGalleryImages(
  imageIds: number[]
): Promise<void> {
  if (imageIds.length === 0) {
    return;
  }

  // Drizzle doesn't have native IN operator, so we delete one by one
  // or use sql`` for more complex queries
  for (const id of imageIds) {
    await db.delete(images).where(eq(images.id, id));
  }
}

export interface PositionUpdate {
  id: number;
  position: number;
}

/**
 * Update positions for gallery images (for reordering)
 */
export async function updateGalleryPositions(
  updates: PositionUpdate[]
): Promise<void> {
  if (updates.length === 0) {
    return;
  }

  // Update positions one by one
  // Could be optimized with batch update in future
  for (const update of updates) {
    await db
      .update(images)
      .set({ position: update.position })
      .where(eq(images.id, update.id));
  }
}

// ========== PROJECT MEDIA (HERO/THUMBNAIL) FUNCTIONS ==========

export interface NewProjectMediaImage {
  publicId: string;
  imageUrl: string;
  width: number;
  height: number;
  format: string;
  variant: 'desktop' | 'mobile' | 'both';
}

/**
 * Fetch project hero or thumbnail images
 */
export async function fetchProjectMediaImages(
  projectSlug: string,
  imageType: 'project_hero' | 'thumbnail'
): Promise<Image[]> {
  const mediaImages = await db
    .select()
    .from(images)
    .where(
      and(
        eq(images.projectSlug, projectSlug),
        eq(images.imageType, imageType)
      )
    );

  return mediaImages;
}

/**
 * Insert project media images (hero or thumbnail)
 */
export async function insertProjectMediaImages(
  projectSlug: string,
  imageType: 'project_hero' | 'thumbnail',
  imageData: NewProjectMediaImage[]
): Promise<Image[]> {
  if (imageData.length === 0) {
    return [];
  }

  const insertValues = imageData.map((img) => ({
    projectSlug,
    publicId: img.publicId,
    imageUrl: img.imageUrl,
    imageType,
    variant: img.variant,
    width: img.width,
    height: img.height,
    format: img.format,
    position: 0, // Position not used for hero/thumbnail
    altText: null,
    caption: null,
  }));

  const inserted = await db.insert(images).values(insertValues).returning();

  return inserted;
}

/**
 * Delete project media images by IDs
 */
export async function deleteProjectMediaImages(
  imageIds: number[]
): Promise<void> {
  if (imageIds.length === 0) {
    return;
  }

  for (const id of imageIds) {
    await db.delete(images).where(eq(images.id, id));
  }
}
