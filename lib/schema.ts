import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
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

export const images = pgTable(
  'images',
  {
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
  },
  (table) => [
    // DB-level: Prevent duplicate (image_type, variant) combinations for non-gallery images
    // Application-level (hero.ts): Enforces "both" XOR "desktop+mobile" logic
    // Gallery images excluded via WHERE clause (multiple images per variant allowed)
    index('unique_image_type_variant_idx')
      .on(table.projectSlug, table.imageType, table.variant)
      .where(sql`image_type != 'gallery'`),
  ]
);

export const contentItems = pgTable(
  'content_items',
  {
    id: serial('id').primaryKey(),
    page: text('page').notNull(),
    section: text('section').notNull(),
    key: text('key').notNull(),
    value: text('value').notNull(),
    position: integer('position'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    // Single items: unique by page/section/key
    index('unique_single_content_idx')
      .on(table.page, table.section, table.key)
      .where(sql`position IS NULL`),

    // Array items: unique by page/section/key/position
    index('unique_array_content_idx')
      .on(table.page, table.section, table.key, table.position)
      .where(sql`position IS NOT NULL`),

    // Query optimization
    index('content_lookup_idx').on(table.page, table.section),
  ]
);

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(images),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  project: one(projects, {
    fields: [images.projectSlug],
    references: [projects.slug],
  }),
}));

// TypeScript type exports
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export type ProjectWithImages = Project & { images: Image[] };

export type Category = (typeof categoryEnum.enumValues)[number];
export type ImageType = (typeof imageTypeEnum.enumValues)[number];
export type ImageVariant = (typeof imageVariantEnum.enumValues)[number];

export type ContentItem = typeof contentItems.$inferSelect;
export type NewContentItem = typeof contentItems.$inferInsert;
