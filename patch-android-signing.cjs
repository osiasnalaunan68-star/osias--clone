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
  patchFile('frontend/android/app/build.gradle', [
    [
      '    buildTypes {\n        release {\n            minifyEnabled false\n            proguardFiles getDefaultProguardFile(\'proguard-android.txt\'), \'proguard-rules.pro\'\n        }\n    }\n}',
      '    signingConfigs {\n        release {\n            if (System.getenv()["CM_KEYSTORE_PATH"]) {\n                storeFile file(System.getenv()["CM_KEYSTORE_PATH"])\n                storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]\n                keyAlias System.getenv()["CM_KEY_ALIAS"]\n                keyPassword System.getenv()["CM_KEY_PASSWORD"]\n            }\n        }\n    }\n    buildTypes {\n        release {\n            minifyEnabled false\n            proguardFiles getDefaultProguardFile(\'proguard-android.txt\'), \'proguard-rules.pro\'\n            signingConfig signingConfigs.release\n        }\n    }\n}',
    ],
  ]);

  patchFile('codemagic.yaml', [
    [
      '    environment:\n      node: 22\n      java: 21\n',
      '    environment:\n      node: 22\n      java: 21\n      android_signing:\n        - ra10863_keystore\n',
    ],
    [
      '      - name: Build debug APK\n        script: |\n          cd frontend/android\n          chmod +x gradlew\n          ./gradlew assembleDebug\n',
      '      - name: Build release APK\n        script: |\n          cd frontend/android\n          chmod +x gradlew\n          ./gradlew assembleRelease\n',
    ],
  ]);

  console.log('✅ Tapos na. Gagamitin na ng release build ang ra10863_keystore mula sa Codemagic (CM_KEYSTORE_PATH, etc).');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo ulit sa akin ang error.');
  process.exit(1);
}
