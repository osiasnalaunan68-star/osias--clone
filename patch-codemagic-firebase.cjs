const fs = require('fs');

function patchFile(relPath, edits) {
  let content = fs.readFileSync(relPath, 'utf8');
  fs.writeFileSync(relPath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 60));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(relPath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('codemagic.yaml', [
    [
      '      - name: Add Capacitor Android platform (if missing)\n        script: |\n          cd frontend\n          if [ ! -d android ]; then\n            npx cap add android\n          fi\n      - name: Sync Capacitor Android',
      '      - name: Add Capacitor Android platform (if missing)\n        script: |\n          cd frontend\n          if [ ! -d android ]; then\n            npx cap add android\n          fi\n      - name: Add Firebase Android config\n        script: |\n          cd frontend\n          cp google-services.json android/app/google-services.json\n      - name: Sync Capacitor Android',
    ],
  ]);
  console.log('✅ Tapos na. google-services.json: frontend/google-services.json. codemagic.yaml: idinagdag na step para i-copy ito papunta sa android/app/ sa bawat build.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo ulit sa akin ang error.');
  process.exit(1);
}
