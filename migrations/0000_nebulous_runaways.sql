CREATE TYPE "public"."image_type" AS ENUM('home_hero', 'featured', 'thumbnail', 'project_hero', 'gallery');--> statement-breakpoint
CREATE TYPE "public"."image_variant" AS ENUM('desktop', 'mobile', 'both');--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_slug" text,
	"public_id" text NOT NULL,
	"image_url" text NOT NULL,
	"image_type" "image_type" NOT NULL,
	"variant" "image_variant" NOT NULL,
	"alt_text" text,
	"caption" text,
	"position" integer DEFAULT 0,
	"width" integer,
	"height" integer,
	"format" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_project_slug_projects_slug_fk" FOREIGN KEY ("project_slug") REFERENCES "public"."projects"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint