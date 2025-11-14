'use server';

import { db } from '@/lib/db';
import { images, type Image } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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
