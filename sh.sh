#!/bin/bash

# --------------------------------------------
# 1. CODE FILES → code.md
# --------------------------------------------
find . -type f \
  \( -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.yaml" -o -name "*.html" -o -name "*.svg" -o -name "*.config.js" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -path "*/docs/*" \
  ! -path "*/android/*" \
  ! -path "*/.git/*" \
  ! -name "package-lock.json" \
  -exec echo "## File: {}" \; \
  -exec echo '```' \; \
  -exec cat {} \; \
  -exec echo '```' \; \
  -exec echo "" \; > code.md

# --------------------------------------------
# 2. DATA FILES (JSON + DB) → data.md
# --------------------------------------------
find . -type f \
  \( -name "*.json" -o -name "*.db" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -path "*/docs/*" \
  ! -path "*/android/*" \
  ! -path "*/.git/*" \
  ! -name "package-lock.json" \
  -print0 | while IFS= read -r -d '' file; do
    if [[ "$file" == *.db ]]; then
      echo "## File: $file (binary, content skipped)"
      echo ""
    else
      echo "## File: $file"
      echo '```'
      cat "$file"
      echo '```'
      echo ""
    fi
  done > data.md

echo "✅ Done! Generated: code.md and data.md"