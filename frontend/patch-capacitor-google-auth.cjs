const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 60));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('src/authContext.jsx', [
    [
      'import {\n  signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut,\n  setPersistence, indexedDBLocalPersistence,\n} from "firebase/auth";',
      'import {\n  signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut,\n  setPersistence, indexedDBLocalPersistence, signInWithCredential, GoogleAuthProvider,\n} from "firebase/auth";',
    ],
    [
      'import { auth, db, googleProvider } from "./firebase";',
      'import { auth, db, googleProvider } from "./firebase";\nimport { FirebaseAuthentication } from "@capacitor-firebase/authentication";',
    ],
    [
      '    try {\n      await signInWithRedirect(auth, googleProvider);\n      // Page navigates away here — code after this line generally won\'t run.\n    } catch (err) {',
      '    const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();\n    try {\n      if (isNative) {\n        // APK: native Google Sign-In — pareho pa rin ang Firebase project + Google account,\n        // kaya pareho rin ang uid; hindi maaapektuhan ang subscriptions/trial ng existing users.\n        const result = await FirebaseAuthentication.signInWithGoogle();\n        const idToken = result.credential && result.credential.idToken;\n        if (!idToken) throw new Error("No idToken from native Google Sign-In.");\n        await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));\n        localStorage.removeItem(PENDING_SIGNIN_KEY);\n        setSigningIn(false);\n      } else {\n        await signInWithRedirect(auth, googleProvider);\n        // Page navigates away here — code after this line generally won\'t run.\n      }\n    } catch (err) {',
    ],
  ]);

  console.log('✅ Tapos na. Susunod: npx cap add android (kung wala pa), tapos SHA-1 + google-services.json.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo ulit sa akin ang error, aayusin ko ang anchor.');
  process.exit(1);
}
