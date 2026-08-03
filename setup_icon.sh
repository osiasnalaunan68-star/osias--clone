#!/usr/bin/env bash
set -e

if [ ! -f frontend/assets/icon-only.png ] || [ ! -f frontend/assets/icon-foreground.png ]; then
  echo "Missing frontend/assets/icon-only.png or icon-foreground.png."
  echo "Download both files from the chat first, then move them into frontend/assets/ with those exact names."
  exit 1
fi

if ! python3 -c "import PIL" 2>/dev/null; then
  echo "Pillow (Python image library) is not installed. Run this first, then re-run this script:"
  echo "  pkg install python-pillow -y"
  exit 1
fi

echo "== Generating icon-background.png + all web/PWA icon sizes =="
python3 << 'PYEOF'
from PIL import Image
import os

navy = (17, 36, 63)
icon = Image.open('frontend/assets/icon-only.png').convert('RGB')
fg = Image.open('frontend/assets/icon-foreground.png').convert('RGBA')

Image.new('RGB', (1024, 1024), navy).save('frontend/assets/icon-background.png', optimize=True)

os.makedirs('frontend/public/icons', exist_ok=True)

icon.resize((512, 512), Image.LANCZOS).save('frontend/public/icons/icon-512.png', optimize=True)
icon.resize((192, 192), Image.LANCZOS).save('frontend/public/icons/icon-192.png', optimize=True)
icon.resize((180, 180), Image.LANCZOS).save('frontend/public/icons/apple-touch-icon.png', optimize=True)
icon.resize((32, 32), Image.LANCZOS).save('frontend/public/icons/favicon-32.png', optimize=True)
icon.resize((16, 16), Image.LANCZOS).save('frontend/public/icons/favicon-16.png', optimize=True)
icon.save('frontend/public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])

bg512 = Image.new('RGBA', (512, 512), (*navy, 255))
bg512.alpha_composite(fg.resize((512, 512), Image.LANCZOS))
bg512.convert('RGB').save('frontend/public/icons/icon-maskable-512.png', optimize=True)

bg192 = Image.new('RGBA', (192, 192), (*navy, 255))
bg192.alpha_composite(fg.resize((192, 192), Image.LANCZOS))
bg192.convert('RGB').save('frontend/public/icons/icon-maskable-192.png', optimize=True)

print("Icon files generated.")
PYEOF

rm -f frontend/public/icon-source.svg

echo "== Updating manifest.json =="
cat > frontend/public/manifest.json << 'MANIFEOF'
{
  "name": "RA 10863 - Customs Modernization and Tariff Act",
  "short_name": "CMTA Law",
  "description": "Study and reference companion for the Customs Modernization and Tariff Act (RA 10863) of the Philippines, with search, highlights, and offline support.",
  "id": "./",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "icons/favicon-32.png", "sizes": "32x32", "type": "image/png", "purpose": "any" },
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
MANIFEOF

echo "== Updating index.html favicon links =="
python3 << 'PYEOF2'
path = 'frontend/index.html'
with open(path, encoding='utf-8') as f:
    html = f.read()

old = '    <link rel="manifest" href="%BASE_URL%manifest.json" />\n    <link rel="icon" type="image/svg+xml" href="%BASE_URL%icon-source.svg" />\n'
new = (
    '    <link rel="manifest" href="%BASE_URL%manifest.json" />\n'
    '    <link rel="icon" type="image/x-icon" href="%BASE_URL%favicon.ico" />\n'
    '    <link rel="icon" type="image/png" sizes="32x32" href="%BASE_URL%icons/favicon-32.png" />\n'
    '    <link rel="icon" type="image/png" sizes="16x16" href="%BASE_URL%icons/favicon-16.png" />\n'
    '    <link rel="apple-touch-icon" href="%BASE_URL%icons/apple-touch-icon.png" />\n'
)
if old not in html:
    raise SystemExit("index.html did not match the expected content -- update it manually instead (see chat for the exact lines).")
html = html.replace(old, new)
with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated.")
PYEOF2

echo "== Installing @capacitor/assets =="
(cd frontend && npm install @capacitor/assets --save-dev)

echo "== Updating codemagic.yaml to generate the Android icon on every build =="
cat > codemagic.yaml << 'YAMLEOF'
workflows:
  ra10863-android:
    name: RA10863 Android APK
    max_build_duration: 30
    environment:
      node: 22
      java: 21
    scripts:
      - name: Install dependencies
        script: |
          cd frontend
          npm install
      - name: Build web assets
        script: |
          cd frontend
          npm run build
      - name: Add Capacitor Android platform (if missing)
        script: |
          cd frontend
          if [ ! -d android ]; then
            npx cap add android
          fi
      - name: Sync Capacitor Android
        script: |
          cd frontend
          npx cap sync android
      - name: Generate app icon
        script: |
          cd frontend
          npx capacitor-assets generate --android
      - name: Build debug APK
        script: |
          cd frontend/android
          chmod +x gradlew
          ./gradlew assembleDebug
          echo "--- Searching for build output ---"
          find app/build/outputs -type f 2>/dev/null || echo "outputs dir missing"
    artifacts:
      - frontend/android/app/build/outputs/**/*.apk
      - frontend/android/app/build/outputs/**/output-metadata.json
    publishing:
      email:
        recipients:
          - osiasnalaunan68@gmail.com
        notify:
          success: true
          failure: true
YAMLEOF

echo ""
echo "All done. Review with: git status"
echo "Then: git add -A && git commit -m \"Add Customs Tech logo as app/web icon\" && git push"
