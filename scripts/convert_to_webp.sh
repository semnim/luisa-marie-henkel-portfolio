#!/bin/bash

mkdir -p "$1/opt"

for file in "$1"/*; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")
  name="${filename%.*}"
  cwebp -preset photo "$file" -o "$1/opt/${name}_opt.webp"
done