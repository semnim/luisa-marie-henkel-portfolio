CREATE TYPE "public"."category" AS ENUM('editorial', 'commercial');--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_slug" text,
	"image_url" text NOT NULL,
	"public_id" text NOT NULL,
	"width" integer,
	"height" integer,
	"format" text,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"published_at" timestamp NOT NULL,
	"category" "category" NOT NULL,
	"thumbnail_url" text NOT NULL,
	"thumbnail_public_id" text NOT NULL,
	"client" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_slug_projects_slug_fk" FOREIGN KEY ("project_slug") REFERENCES "public"."projects"("slug") ON DELETE no action ON UPDATE no action;