#!/bin/bash

set -e

SOURCE_DIR="source_images"
OUTPUT_DIR="optimized_images"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: $SOURCE_DIR directory not found"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Process each project folder
for project_dir in "$SOURCE_DIR"/*; do
    if [ ! -d "$project_dir" ]; then
        continue
    fi

    project_name=$(basename "$project_dir")
    output_project_dir="$OUTPUT_DIR/$project_name"

    # Create project folder in output directory
    mkdir -p "$output_project_dir"

    echo "Processing project: $project_name"

    # Process each image in the project folder
    for image in "$project_dir"/*; do
        if [ ! -f "$image" ]; then
            continue
        fi

        filename=$(basename "$image")
        output_path="$output_project_dir/$filename"

        echo "  Optimizing: $filename"
        magick "$image" -strip -interlace Plane -gaussian-blur 0.05 -quality 85% "$output_path"
    done
done

echo "Optimization complete!"
