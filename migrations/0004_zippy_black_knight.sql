ALTER TABLE "images" DROP CONSTRAINT "images_image_type_variant_unique";--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "uniqueImageTypeVariant" UNIQUE("image_type","variant");