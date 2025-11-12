import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', ['editorial', 'commercial']);
export const imageTypeEnum = pgEnum('image_type', [
  'home_hero',
  'featured',
  'thumbnail',
  'project_hero',
  'gallery',
]);
export const imageVariantEnum = pgEnum('image_variant', [
  'desktop',
  'mobile',
  'both',
]);

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  publishedAt: timestamp('published_at'),
  category: categoryEnum('category').notNull(),
  team: jsonb('team')
    .$type<Array<{ role: string; name: string }>>()
    .default([]),
  client: text('client'),
  createdAt: timestamp('created_at').defaultNow(),
  isFeatured: boolean('is_featured').default(false),
});

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  projectSlug: text('project_slug').references(() => projects.slug), // nullable for home_hero

  // Cloudinary references
  publicId: text('public_id').notNull(),
  imageUrl: text('image_url').notNull(),

  // Image metadata
  imageType: imageTypeEnum('image_type').notNull(),
  variant: imageVariantEnum('variant').notNull(),
  altText: text('alt_text'),
  caption: text('caption'),

  // For featured slots (1-4) and gallery ordering
  position: integer('position').default(0),

  // Optional metadata
  width: integer('width'),
  height: integer('height'),
  format: text('format'),

  createdAt: timestamp('created_at').defaultNow(),
});

// TypeScript type exports
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export type Category = (typeof categoryEnum.enumValues)[number];
export type ImageType = (typeof imageTypeEnum.enumValues)[number];
export type ImageVariant = (typeof imageVariantEnum.enumValues)[number];
