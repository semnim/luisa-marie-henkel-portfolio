CREATE TYPE "public"."category" AS ENUM('editorial', 'commercial');--> statement-breakpoint
CREATE TABLE "shooting_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"shooting_id" integer,
	"image_url" text NOT NULL,
	"public_id" text NOT NULL,
	"width" integer,
	"height" integer,
	"format" text,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "shootings" (
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
	CONSTRAINT "shootings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "shooting_images" ADD CONSTRAINT "shooting_images_shooting_id_shootings_id_fk" FOREIGN KEY ("shooting_id") REFERENCES "public"."shootings"("id") ON DELETE no action ON UPDATE no action;