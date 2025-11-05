import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', ['editorial', 'commercial']);

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  publishedAt: timestamp('published_at').notNull(),
  category: categoryEnum('category').notNull(),

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

  // Optional metadata
  width: integer('width'),
  height: integer('height'),
  format: text('format'),
  order: integer('order').default(0),
});
