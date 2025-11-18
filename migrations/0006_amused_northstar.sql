CREATE TABLE "content_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" text NOT NULL,
	"section" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"position" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "unique_single_content_idx" ON "content_items" USING btree ("page","section","key") WHERE position IS NULL;--> statement-breakpoint
CREATE INDEX "unique_array_content_idx" ON "content_items" USING btree ("page","section","key","position") WHERE position IS NOT NULL;--> statement-breakpoint
CREATE INDEX "content_lookup_idx" ON "content_items" USING btree ("page","section");