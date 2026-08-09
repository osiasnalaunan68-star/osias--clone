const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak2', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 70));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak2)');
}

try {
  patchFile('src/authContext.jsx', [
    [
      'const PENDING_SIGNIN_KEY = "cuble_pendingSignIn";',
      'const PENDING_SIGNIN_KEY = "cuble_pendingSignIn";\nconst PROFILE_CACHE_KEY = "cuble_profileCache_";',
    ],
    [
      '    const data = snap.data();\n    const devices = data.devices || [];',
      '    const data = snap.data();\n    try { localStorage.setItem(PROFILE_CACHE_KEY + fbUser.uid, JSON.stringify(data)); } catch (_) {}\n    const devices = data.devices || [];',
    ],
    [
      '      await setDoc(ref, fresh);\n      setProfile(fresh);',
      '      await setDoc(ref, fresh);\n      setProfile(fresh);\n      try { localStorage.setItem(PROFILE_CACHE_KEY + fbUser.uid, JSON.stringify(fresh)); } catch (_) {}',
    ],
    [
      '    } catch (err) {\n      console.warn("syncProfile failed (offline?):", err);\n      setDeviceLimitReached(false);\n    }\n  }, [currentDeviceId]);',
      '    } catch (err) {\n      console.warn("syncProfile failed (offline?):", err);\n      try {\n        const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);\n        if (cached) setProfile(JSON.parse(cached));\n      } catch (_) {}\n      setDeviceLimitReached(false);\n    }\n  }, [currentDeviceId]);',
    ],
    [
      '  useEffect(() => {\n    const unsub = onAuthStateChanged(auth, async (fbUser) => {\n      setUser(fbUser);\n      if (fbUser) {\n        await syncProfile(fbUser);\n      } else {\n        setProfile(null);\n        setNeedsFullName(false);\n        setDeviceLimitReached(false);\n      }\n      setLoading(false);\n    });\n    return unsub;\n  }, [syncProfile]);',
      '  useEffect(() => {\n    const unsub = onAuthStateChanged(auth, async (fbUser) => {\n      setUser(fbUser);\n      if (fbUser) {\n        let hasCached = false;\n        try {\n          const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);\n          if (cached) {\n            const parsedCached = JSON.parse(cached);\n            setProfile(parsedCached);\n            setNeedsFullName(!parsedCached.fullName);\n            hasCached = true;\n          }\n        } catch (_) {}\n        if (hasCached) {\n          setLoading(false);\n          syncProfile(fbUser);\n        } else {\n          await syncProfile(fbUser);\n          setLoading(false);\n        }\n      } else {\n        setProfile(null);\n        setNeedsFullName(false);\n        setDeviceLimitReached(false);\n        setLoading(false);\n      }\n    });\n    return unsub;\n  }, [syncProfile]);',
    ],
  ]);

  console.log('Done. Run npm run build, then deploy.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  process.exit(1);
}
