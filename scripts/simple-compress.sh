#!/bin/bash

# Simple image compression - targets ≤500KB with minimal quality loss
# Prioritizes quality for hero, featured, and thumbnail images

set -e

SOURCE_DIR="resources/images/uncompressed"
OUTPUT_DIR="resources/images/compressed"

# Target: 500KB, but acceptable up to 600KB for priority images
TARGET_SIZE=524288      # 500KB
PRIORITY_MAX=614400     # 600KB (acceptable for hero/featured/thumbnail)
SKIP_SOURCE_THRESHOLD=1048576  # 1MB - skip if source is already this small

# Max widths - conservative to preserve quality
HERO_DESKTOP_WIDTH=2400
HERO_MOBILE_WIDTH=1200
FEATURED_WIDTH=1600
THUMBNAIL_WIDTH=1200
GALLERY_WIDTH=2000

# Quality levels - start high, reduce only if needed
Q_VERY_HIGH=85
Q_HIGH=80
Q_MEDIUM=75
Q_LOW=70

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check dependencies
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}Error: cwebp not installed${NC}"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Get file size
get_size() {
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null
}

# Compress with specific quality
compress() {
    local input="$1"
    local output="$2"
    local width="$3"
    local quality="$4"

    cwebp "$input" -o "$output" -resize "$width" 0 -q "$quality" -m 6 -mt 2>/dev/null
    get_size "$output"
}

# Optimize a single file
optimize() {
    local input="$1"
    local output="$2"
    local max_width="$3"
    local is_priority="$4"

    local temp="${output}.tmp"
    local acceptable_size=$TARGET_SIZE

    # Priority images can be slightly larger
    if [ "$is_priority" = "true" ]; then
        acceptable_size=$PRIORITY_MAX
    fi

    # Try q85 (very high quality)
    local size=$(compress "$input" "$temp" "$max_width" "$Q_VERY_HIGH")
    if [ "$size" -le "$acceptable_size" ]; then
        mv "$temp" "$output"
        echo -e "${GREEN}✓${NC} q$Q_VERY_HIGH → $((size/1024))KB"
        return 0
    fi

    # Try q80
    size=$(compress "$input" "$temp" "$max_width" "$Q_HIGH")
    if [ "$size" -le "$acceptable_size" ]; then
        mv "$temp" "$output"
        echo -e "${GREEN}✓${NC} q$Q_HIGH → $((size/1024))KB"
        return 0
    fi

    # Try q75
    size=$(compress "$input" "$temp" "$max_width" "$Q_MEDIUM")
    if [ "$size" -le "$acceptable_size" ]; then
        mv "$temp" "$output"
        echo -e "${YELLOW}✓${NC} q$Q_MEDIUM → $((size/1024))KB"
        return 0
    fi

    # Last resort: q70
    size=$(compress "$input" "$temp" "$max_width" "$Q_LOW")
    mv "$temp" "$output"

    if [ "$size" -le "$acceptable_size" ]; then
        echo -e "${YELLOW}✓${NC} q$Q_LOW → $((size/1024))KB"
    else
        echo -e "${YELLOW}~${NC} q$Q_LOW → $((size/1024))KB (over target)"
    fi
    return 0
}

echo -e "${BLUE}Simple Image Compression${NC}"
echo "Target: ≤500KB (≤600KB for hero/featured/thumbnail)"
echo "Source: $SOURCE_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

total=0
success=0
skipped=0

# Process all projects
for project_dir in "$SOURCE_DIR"/*; do
    if [ ! -d "$project_dir" ]; then
        continue
    fi

    project_name=$(basename "$project_dir")
    output_project_dir="$OUTPUT_DIR/$project_name"
    mkdir -p "$output_project_dir"

    echo -e "${BLUE}━━━ $project_name ━━━${NC}"

    # Process images
    for input_file in "$project_dir"/*; do
        if [ ! -f "$input_file" ]; then
            continue
        fi

        filename=$(basename "$input_file")
        name="${filename%.*}"

        # Skip already processed files
        if [[ "$name" == *"_opt" ]]; then
            continue
        fi

        output_file="$output_project_dir/${name}_opt.webp"

        total=$((total + 1))

        # Detect image type and set parameters
        if [[ "$name" == "hero-desktop" ]]; then
            max_width=$HERO_DESKTOP_WIDTH
            is_priority="true"
            type="hero-desktop"
        elif [[ "$name" == "hero-mobile" ]]; then
            max_width=$HERO_MOBILE_WIDTH
            is_priority="true"
            type="hero-mobile"
        elif [[ "$name" == "featured" ]]; then
            max_width=$FEATURED_WIDTH
            is_priority="true"
            type="featured"
        elif [[ "$name" == "thumbnail" ]]; then
            max_width=$THUMBNAIL_WIDTH
            is_priority="true"
            type="thumbnail"
        elif [[ "$name" == gallery-* ]]; then
            max_width=$GALLERY_WIDTH
            is_priority="false"
            type="gallery"
        else
            # Unknown type - treat as gallery
            max_width=$GALLERY_WIDTH
            is_priority="false"
            type="other"
        fi

        # Skip if source is already <= 1MB
        source_size=$(get_size "$input_file")
        if [ "$source_size" -le "$SKIP_SOURCE_THRESHOLD" ]; then
            skipped=$((skipped + 1))
            echo -e "  $filename ($type) ... ${GREEN}⊘${NC} Source already small ($((source_size/1024))KB, skipped)"
            continue
        fi

        echo -n "  $filename ($type, ≤${max_width}px) ... "

        if optimize "$input_file" "$output_file" "$max_width" "$is_priority"; then
            success=$((success + 1))
        fi
    done

    echo ""
done

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "Total: $total images"
if [ $skipped -gt 0 ]; then
    echo -e "Skipped (source ≤1MB): ${GREEN}$skipped${NC}"
fi
echo -e "Compressed: ${GREEN}$success${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Done!${NC}"
