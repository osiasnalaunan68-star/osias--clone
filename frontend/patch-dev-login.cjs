const fs = require('fs');
const file = 'src/authContext.jsx';
let s = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file + '.bak', s);

function swap(anchor, replacement) {
  const n = s.split(anchor).length - 1;
  if (n !== 1) {
    console.error('Expected 1 match, found ' + n + ' for: ' + anchor);
    process.exit(1);
  }
  s = s.split(anchor).join(replacement);
}

swap(
  'signInWithRedirect, getRedirectResult,',
  'signInWithRedirect, signInWithPopup, getRedirectResult,'
);

swap(
  '        await signInWithRedirect(auth, googleProvider);',
  [
    '        const isLocalDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);',
    '        if (isLocalDev) {',
    '          // Dev only: redirect sign-in loops here because the Firebase handler is another origin.',
    '          await signInWithPopup(auth, googleProvider);',
    '          localStorage.removeItem(PENDING_SIGNIN_KEY);',
    '          setSigningIn(false);',
    '        } else {',
    '          await signInWithRedirect(auth, googleProvider);',
    '        }',
  ].join('\n')
);

fs.writeFileSync(file, s);
console.log('Patched ' + file + ' (backup: ' + file + '.bak)');
