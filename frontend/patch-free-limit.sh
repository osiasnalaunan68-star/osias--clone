#!/bin/bash
set -e

FILE="src/pages/SubjectDashboard.jsx"
OLD='const FREE_LIMITS = { cl: 100, cdp: 100, tl: 100, pc: 150 };'
NEW='const FREE_LIMITS = { cl: 10, cdp: 10, tl: 10, pc: 10 };'

if [ ! -f "$FILE" ]; then
  echo "❌ File not found: $FILE (patakbuhin mula sa loob ng frontend/ folder)"
  exit 1
fi

COUNT=$(grep -c -F "$OLD" "$FILE")
if [ "$COUNT" -ne 1 ]; then
  echo "❌ Expected 1 match, found $COUNT. Walang na-touch na file — i-check natin ulit."
  exit 1
fi

cp "$FILE" "$FILE.bak"
sed -i "s|$OLD|$NEW|" "$FILE"
echo "✅ Patched $FILE (backup: $FILE.bak)"
echo "FREE_LIMITS ngayon: cl=10, cdp=10, tl=10, pc=10"
