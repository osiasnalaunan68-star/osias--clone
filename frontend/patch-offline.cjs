const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 70));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('src/firebase.js', [
    [
      'import { getFirestore } from "firebase/firestore";',
      'import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";',
    ],
    [
      'export const googleProvider = new GoogleAuthProvider();',
      'export const googleProvider = new GoogleAuthProvider();\n\n// Local IndexedDB cache para may bumabalik pang datos (profile, subscriptions)\n// kahit walang internet — kailangan lalo na sa APK offline-first na app.\nenableIndexedDbPersistence(db).catch((err) => {\n  console.warn("Firestore offline persistence not enabled:", err.code || err);\n});',
    ],
  ]);

  patchFile('src/authContext.jsx', [
    [
      'const syncProfile = useCallback(async (fbUser) => {\n    const ref = doc(db, "users", fbUser.uid);',
      'const syncProfile = useCallback(async (fbUser) => {\n    try {\n    const ref = doc(db, "users", fbUser.uid);',
    ],
    [
      '    setNeedsFullName(!data.fullName);\n  }, [currentDeviceId]);',
      '    setNeedsFullName(!data.fullName);\n    } catch (err) {\n      console.warn("syncProfile failed (offline?):", err);\n      setDeviceLimitReached(false);\n    }\n  }, [currentDeviceId]);',
    ],
  ]);

  console.log('Done. Run npm run build, then deploy.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  process.exit(1);
}
