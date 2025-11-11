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
  'hero',
  'gallery',
  'thumbnail',
]);
export const imageVariantEnum = pgEnum('image_variant', [
  'desktop',
  'mobile',
  'both',
]);
export const siteImageTypeEnum = pgEnum('site_image_type', [
  'home_hero',
  'featured',
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

  // Cloudinary references
  thumbnailUrl: text('thumbnail_url').notNull(),
  thumbnailPublicId: text('thumbnail_public_id').notNull(),

  client: text('client'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projectImages = pgTable('project_images', {
  id: serial('id').primaryKey(),
  projectSlug: text('project_slug').references(() => projects.slug),

  // Cloudinary references
  imageUrl: text('image_url').notNull(),
  publicId: text('public_id').notNull(),

  // Mobile variant (optional)
  mobilePublicId: text('mobile_public_id'),
  mobileImageUrl: text('mobile_image_url'),

  // Image metadata
  imageType: imageTypeEnum('image_type').default('gallery'),
  variant: imageVariantEnum('variant').default('both'),
  altText: text('alt_text'),
  caption: text('caption'),

  // Optional metadata
  width: integer('width'),
  height: integer('height'),
  format: text('format'),
  order: integer('order').default(0),
});

export const siteImages = pgTable('site_images', {
  id: serial('id').primaryKey(),

  // Image type and status
  imageType: siteImageTypeEnum('image_type').notNull(),
  isActive: boolean('is_active').default(true),

  // Cloudinary references
  publicId: text('public_id').notNull(),
  imageUrl: text('image_url').notNull(),

  // Mobile variant (optional)
  mobilePublicId: text('mobile_public_id'),
  mobileImageUrl: text('mobile_image_url'),

  // Metadata
  title: text('title'),
  altText: text('alt_text'),
  order: integer('order').default(0),

  createdAt: timestamp('created_at').defaultNow(),
});

// TypeScript type exports
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectImage = typeof projectImages.$inferSelect;
export type NewProjectImage = typeof projectImages.$inferInsert;

export type SiteImage = typeof siteImages.$inferSelect;
export type NewSiteImage = typeof siteImages.$inferInsert;

export type Category = (typeof categoryEnum.enumValues)[number];
export type ImageType = (typeof imageTypeEnum.enumValues)[number];
export type ImageVariant = (typeof imageVariantEnum.enumValues)[number];
export type SiteImageType = (typeof siteImageTypeEnum.enumValues)[number];
