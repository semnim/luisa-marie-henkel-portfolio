ALTER TABLE "images" ADD CONSTRAINT "unique_variant_per_type" CHECK ((
        ("images"."variant" = 'both' AND NOT EXISTS (
          SELECT 1 FROM images i2
          WHERE i2.image_type = "images"."image_type"
          AND i2.id != "images"."id"
          AND i2.variant = 'both'
        ))
        OR
        ("images"."variant" IN ('desktop', 'mobile') AND NOT EXISTS (
          SELECT 1 FROM images i2
          WHERE i2.image_type = "images"."image_type"
          AND i2.id != "images"."id"
          AND i2.variant = "images"."variant"
        ))
      ));