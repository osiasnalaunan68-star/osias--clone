find . -type f \
  \( -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.json" -o -name "*.yaml" -o -name "*.html" -o -name "*.svg" -o -name "*.db" -o -name "*.config.js" \) \
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
  -exec echo "" \; > combined.md
