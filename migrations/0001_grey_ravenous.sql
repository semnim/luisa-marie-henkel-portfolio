CREATE TYPE "public"."image_type" AS ENUM('hero', 'gallery', 'thumbnail');--> statement-breakpoint
CREATE TYPE "public"."image_variant" AS ENUM('desktop', 'mobile', 'both');--> statement-breakpoint
CREATE TYPE "public"."site_image_type" AS ENUM('home_hero', 'featured');--> statement-breakpoint
CREATE TABLE "site_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_type" "site_image_type" NOT NULL,
	"is_active" boolean DEFAULT true,
	"public_id" text NOT NULL,
	"image_url" text NOT NULL,
	"mobile_public_id" text,
	"mobile_image_url" text,
	"title" text,
	"alt_text" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "project_images" ADD COLUMN "mobile_public_id" text;--> statement-breakpoint
ALTER TABLE "project_images" ADD COLUMN "mobile_image_url" text;--> statement-breakpoint
ALTER TABLE "project_images" ADD COLUMN "image_type" "image_type" DEFAULT 'gallery';--> statement-breakpoint
ALTER TABLE "project_images" ADD COLUMN "variant" "image_variant" DEFAULT 'both';--> statement-breakpoint
ALTER TABLE "project_images" ADD COLUMN "alt_text" text;--> statement-breakpoint
ALTER TABLE "project_images" ADD COLUMN "caption" text;