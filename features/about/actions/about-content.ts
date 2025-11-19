'use server';

import { db } from '@/lib/db';
import { contentItems } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export interface AboutContent {
  paragraphs: string[];
}

export interface ActionResult {
  success: boolean;
  errors?: Array<{ field: string; message: string }>;
}

const PAGE = 'about';
const SECTION = 'intro';
const KEY = 'paragraph';

export async function fetchAboutContent(): Promise<AboutContent> {
  try {
    const paragraphs = await db.query.contentItems.findMany({
      where: and(
        eq(contentItems.page, PAGE),
        eq(contentItems.section, SECTION),
        eq(contentItems.key, KEY)
      ),
      orderBy: (contentItems, { asc }) => [asc(contentItems.position)],
    });

    return {
      paragraphs: paragraphs.map((p) => p.value),
    };
  } catch (error) {
    console.error('Error fetching about content:', error);
    return { paragraphs: [] };
  }
}

export async function updateAboutParagraphs(
  paragraphs: string[]
): Promise<ActionResult> {
  try {
    // Validate
    if (paragraphs.length === 0) {
      return {
        success: false,
        errors: [{ field: 'paragraphs', message: 'At least one paragraph required' }],
      };
    }

    // Check for empty paragraphs
    const hasEmpty = paragraphs.some((p) => p.trim().length === 0);
    if (hasEmpty) {
      return {
        success: false,
        errors: [{ field: 'paragraphs', message: 'Paragraphs cannot be empty' }],
      };
    }

    // Delete existing paragraphs
    await db.delete(contentItems).where(
      and(
        eq(contentItems.page, PAGE),
        eq(contentItems.section, SECTION),
        eq(contentItems.key, KEY)
      )
    );

    // Insert new paragraphs
    const values = paragraphs.map((value, index) => ({
      page: PAGE,
      section: SECTION,
      key: KEY,
      value: value.trim(),
      position: index + 1,
    }));

    await db.insert(contentItems).values(values);

    return { success: true };
  } catch (error) {
    console.error('Error updating about paragraphs:', error);
    return {
      success: false,
      errors: [{ field: '_general', message: 'Failed to update paragraphs' }],
    };
  }
}
