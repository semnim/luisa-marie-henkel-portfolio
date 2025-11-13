# Image Compression

Simple, high-quality image compression targeting **≤500KB per image** (≤600KB for hero/featured/thumbnail).

## Results

- **Total Images:** 102
- **Average Size:** 336KB
- **Total Portfolio:** 33MB
- **Over 500KB:** 13 files (13%)
- **Over 600KB:** 4 gallery images only

## File Naming Conventions

| Name Pattern | Type | Max Width | Quality Priority |
|--------------|------|-----------|------------------|
| `hero-desktop.jpeg` | Hero (desktop) | 2400px | **HIGH** |
| `hero-mobile.jpeg` | Hero (mobile) | 1200px | **HIGH** |
| `featured.jpeg` | Featured showcase | 1600px | **HIGH** |
| `thumbnail.jpeg` | Portfolio overview | 1200px | **HIGH** |
| `gallery-x.jpeg` | Gallery images | 2000px | Standard |

## Compression Script

### `simple-compress.sh`

**Features:**

- Single-pass compression with adaptive quality (85 → 80 → 75 → 70)
- Conservative dimension limits to preserve quality
- Priority images can be up to 600KB (hero/featured/thumbnail)
- Gallery images target 500KB
- Automatically skips source images ≤1MB (already optimized)

**Usage:**

```bash
./scripts/simple-compress.sh
```

**Quality Levels:**

- **q85** - Very high quality (first attempt)
- **q80** - High quality
- **q75** - Medium quality
- **q70** - Minimum acceptable quality

**Input:** `resources/images/uncompressed/[project]/`
**Output:** `resources/images/compressed/[project]/[filename]_opt.webp`

## Quality Results

All priority images compressed at q80-85:

- **hero-desktop:** 208-553KB
- **featured:** 76-590KB
- **thumbnail:** 24-564KB

Only 4 gallery images exceed 600KB (673KB-1.1MB).

## Dependencies

- **cwebp** (WebP encoder)
  - macOS: `brew install webp`
  - Linux: `apt-get install webp`

## Workflow

1. Place images in `resources/images/uncompressed/[project]/`
2. Name files according to conventions above
3. Run `./scripts/simple-compress.sh`
4. Images converted to WebP format (source files ≤1MB automatically skipped)

**Note:** Skips source images already ≤1MB to avoid unnecessary recompression. Safe to run multiple times.
