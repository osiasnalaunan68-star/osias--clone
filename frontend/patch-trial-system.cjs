const fs = require('fs');
const path = require('path');

// All-or-nothing: kung may isang anchor na hindi tumama, walang file na masusulatan.
function loadFile(relPath) {
  const filePath = path.join(__dirname, relPath);
  return { relPath, filePath, original: fs.readFileSync(filePath, 'utf8') };
}

function applyEdits(file, edits) {
  let content = file.original;
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + file.relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 70).replace(/\n/g, '\\n'));
    }
    content = content.split(anchor).join(replacement);
  }
  return content;
}

try {
  const jobs = [];

  // ───────────── payments.js ─────────────
  jobs.push([loadFile('src/payments.js'), [
    [
      'import { db, auth } from "./firebase";',
      'import { db, auth } from "./firebase";\nimport { ACCESS_PLANS } from "./access";',
    ],
    [
      'price: 399, subjects: ["TCP"] },',
      'price: 299, subjects: ["TCP"] },',
    ],
    [
      'price: 99, subjects: ["CL", "TL", "CDP", "PC"] },',
      'price: 199, subjects: ["CL", "TL", "CDP", "PC"] },',
    ],
    [
      'price: 499, subjects: ["CL", "TL", "CDP", "PC", "TCP"] },',
      'price: 399, subjects: ["CL", "TL", "CDP", "PC", "TCP"] },',
    ],
    [
      '  const u = auth.currentUser;\n',
      '  const u = auth.currentUser;\n  // App Access plans (M1/M3/M8) ay may sariling pending list.\n  const field = ACCESS_PLANS.some((p) => p.id === planId) ? "pendingAccess" : "pendingPurchases";\n',
    ],
    [
      '      pendingPurchases: arrayUnion({',
      '      [field]: arrayUnion({',
    ],
  ]]);

  // ───────────── authContext.jsx ─────────────
  jobs.push([loadFile('src/authContext.jsx'), [
    [
      'import { createContext, useContext, useEffect, useState, useCallback } from "react";',
      'import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";',
    ],
    [
      'import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";',
      'import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot, runTransaction, getDocFromServer } from "firebase/firestore";',
    ],
    [
      'import { auth, db, googleProvider } from "./firebase";',
      'import { auth, db, googleProvider } from "./firebase";\nimport { setServerClock, persistClock, getAccess, hasAnyPractice, TRIAL_DAYS } from "./access";',
    ],
    [
      '  const currentDeviceId = getOrCreateDeviceId();\n',
      `  const currentDeviceId = getOrCreateDeviceId();

  // ── Trial / App Access (oras ng server, real-time) ──────────────────
  const [serverData, setServerData] = useState(null);
  const [clockReady, setClockReady] = useState(false);
  const [tick, setTick] = useState(0);
  const [intentPlanId, setIntentPlanId] = useState(null);
  const initDoneFor = useRef(null);
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (!uid) {
      setServerData(null);
      setClockReady(false);
      initDoneFor.current = null;
      return;
    }
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (snap) => {
        if (!snap.exists()) return;
        setServerData(snap.data());
        // Hintayin ang totoong datos ng server (hindi cache) bago gumawa ng trial.
        if (snap.metadata.fromCache || initDoneFor.current === uid) return;
        initDoneFor.current = uid;
        (async () => {
          try {
            await runTransaction(db, async (tx) => {
              const s = await tx.get(ref);
              if (!s.exists()) return;
              const d = s.data();
              const upd = { lastSeenAt: serverTimestamp() };
              // Isang beses lang ang trial bawat account; hindi na ulit kapag meron na
              // o kapag may bayad na practice subject na.
              if (!d.trial && !hasAnyPractice(d)) {
                upd.trial = { startedAt: serverTimestamp(), days: TRIAL_DAYS };
              }
              tx.update(ref, upd);
            });
            const fresh = await getDocFromServer(ref);
            const ls = fresh.data() && fresh.data().lastSeenAt;
            if (ls && ls.toMillis) setServerClock(ls.toMillis());
          } catch (e) {
            console.warn("trial/clock sync failed:", e);
          }
          setClockReady(true);
        })();
      },
      (err) => {
        console.warn("profile listener error:", err);
        setClockReady(true);
      }
    );
    const fallback = setTimeout(() => setClockReady(true), 6000);
    return () => { unsub(); clearTimeout(fallback); };
  }, [uid]);

  useEffect(() => {
    const id = setInterval(() => { setTick((t) => t + 1); persistClock(); }, 15000);
    return () => clearInterval(id);
  }, []);

  // Ang server data ang masusunod para sa access fields (real-time kapag nag-approve si admin).
  const mergedProfile = useMemo(() => {
    if (!profile || !serverData) return profile;
    const pick = {};
    ["subscriptions", "subscriptionExpiry", "appAccess", "trial", "pendingPurchases", "pendingAccess", "isAdmin"].forEach((k) => {
      pick[k] = serverData[k];
    });
    if (!pick.subscriptions) pick.subscriptions = profile.subscriptions;
    return { ...profile, ...pick };
  }, [profile, serverData]);

  const access = getAccess(mergedProfile, { clockReady });
`,
    ],
    [
      '    user, profile, loading, needsFullName, deviceLimitReached, currentDeviceId,',
      '    user, profile: mergedProfile, loading, needsFullName, deviceLimitReached, currentDeviceId,\n    access, clockReady, tick, intentPlanId, setIntentPlanId,',
    ],
  ]]);

  // ───────────── ChapterBrowser.jsx ─────────────
  jobs.push([loadFile('src/pages/ChapterBrowser.jsx'), [
    [
      'export default function ChapterBrowser() {\n  const { profile } = useAuth();\n  const [view, setView] = useState("browse");',
      'export default function ChapterBrowser({ initialView = "browse", initialMode = null, demo = false } = {}) {\n  const { profile } = useAuth();\n  const [view, setView] = useState(initialView);',
    ],
    [
      'const [mode, setMode] = useState(() => localStorage.getItem(MODE_KEY) || "study");',
      'const [mode, setMode] = useState(() => initialMode || localStorage.getItem(MODE_KEY) || "study");',
    ],
    [
      '    if (!hasTutorialBeenSeen()) {\n      setShowTutorial(true);\n    }',
      '    if (!demo && !hasTutorialBeenSeen()) {\n      setShowTutorial(true);\n    }',
    ],
  ]]);

  // ───────────── main.jsx ─────────────
  jobs.push([loadFile('src/main.jsx'), [
    [
      'import ChapterBrowser from "./pages/ChapterBrowser";',
      'import AccessGate from "./components/AccessGate";',
    ],
    [
      '        <ChapterBrowser />\n        <AccountOverlay />',
      '        <AccessGate />\n        <AccountOverlay />',
    ],
  ]]);

  // ───────────── AccountOverlay.jsx ─────────────
  jobs.push([loadFile('src/components/AccountOverlay.jsx'), [
    [
      'import { PLANS, PAYMENT_METHODS, generateReferenceCode, submitPendingPurchase } from "../payments";',
      'import { PLANS, PAYMENT_METHODS, generateReferenceCode, submitPendingPurchase } from "../payments";\nimport { ACCESS_PLANS, formatTimeLeft, formatDateShort } from "../access";',
    ],
    [
      '    profileError,\n  } = useAuth();',
      '    profileError, access, intentPlanId, setIntentPlanId,\n  } = useAuth();',
    ],
    [
      '  if (!overlayOpen) return null;\n',
      `  // Galing sa Paywall: diretso sa payment method ng napiling plan.
  useEffect(() => {
    if (!overlayOpen || !intentPlanId || !user || !profile) return;
    const plan = [...PLANS, ...ACCESS_PLANS].find((p) => p.id === intentPlanId);
    setIntentPlanId(null);
    if (!plan) return;
    setSelectedPlan(plan);
    setSelectedMethod(null);
    setSubmitted(false);
    setReferenceCode(generateReferenceCode(plan.id));
    setStep("payment-method");
  }, [overlayOpen, intentPlanId, user, profile]);

  if (!overlayOpen) return null;
`,
    ],
    [
      'Sign in para ma-unlock ang buong practice exam',
      'Mag-sign in gamit ang Google para masimulan ang 3-day free trial',
    ],
    [
      'text-slate-400">Subscription</p>',
      'text-slate-400">Practice Questions</p>',
    ],
    [
      `            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Devices ({(profile?.devices || []).length}/2)`,
      `            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
              <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                {access?.state === "admin" && <span>👑 Admin</span>}
                {access?.state === "member" && <span>✅ Lifetime access (practice subscriber)</span>}
                {access?.state === "paid" && <span>✅ Active hanggang {formatDateShort(access.app.expiresAt)} ({formatTimeLeft(access.msLeft)} left)</span>}
                {access?.state === "trial" && <span>🎁 Free trial: {formatTimeLeft(access.msLeft)} left</span>}
                {(access?.state === "expired" || access?.state === "loading") && <span>⏳ Tapos na ang trial. Pumili ng plan sa baba.</span>}
              </div>
              {(profile?.pendingAccess || []).length > 0 && (
                <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  ⏳ May pending App Access payment ({profile.pendingAccess[profile.pendingAccess.length - 1].referenceCode}) — hinihintay ang confirmation.
                </p>
              )}
              {access && access.state !== "admin" && access.state !== "member" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {ACCESS_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => startPurchase(p)}
                      className="rounded-lg border border-slate-200 px-2 py-2 text-center text-xs font-semibold text-navy-900 active:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:active:bg-slate-700"
                    >
                      {p.months} {p.months === 1 ? "month" : "months"}
                      <span className="block text-sm font-bold">₱{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Devices ({(profile?.devices || []).length}/2)`,
    ],
  ]]);

  // Lahat ng anchor tumama? Saka lang tayo magsusulat.
  const results = jobs.map(([file, edits]) => [file, applyEdits(file, edits)]);

  // AdminPanel: palitan ng bagong bersyon (may backup)
  const adminNew = path.join(__dirname, 'src/pages/AdminPanel.new.jsx');
  const adminOld = path.join(__dirname, 'src/pages/AdminPanel.jsx');
  if (!fs.existsSync(adminNew)) throw new Error('Wala ang src/pages/AdminPanel.new.jsx — i-create muna (Step 3).');

  for (const [file, content] of results) {
    fs.writeFileSync(file.filePath + '.bak', file.original);
    fs.writeFileSync(file.filePath, content);
    console.log('Patched ' + file.relPath + ' (backup: ' + file.relPath + '.bak)');
  }
  fs.copyFileSync(adminOld, adminOld + '.bak');
  fs.copyFileSync(adminNew, adminOld);
  fs.unlinkSync(adminNew);
  console.log('Replaced src/pages/AdminPanel.jsx (backup: AdminPanel.jsx.bak)');

  console.log('\n✅ Tapos na lahat ng patch. Susunod: npm run build');
} catch (err) {
  console.error('❌ Patch failed: ' + err.message);
  console.error('Walang na-touch na file. I-paste mo sa akin ang error na ito, aayusin ko ang anchor.');
  process.exit(1);
}
