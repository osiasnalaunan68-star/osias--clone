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
  patchFile('src/access.js', [
    [
      '  if (!trial.exists && !clockReady) return { state: "loading", trial, app, msLeft: 0 };\n  return { state: "expired", trial, app, msLeft: 0 };\n}',
      '  if (!trial.exists && !clockReady) return { state: "loading", trial, app, msLeft: 0 };\n  return { state: "expired", trial, app, msLeft: 0 };\n}\n' +
      '\n' +
      '// ── RA 10863 (CL) time-based lock ──────────────────────────────────────\n' +
      '// Hiwalay sa generic FREE_LIMITS ng ibang subjects: 7-day FULL access trial\n' +
      '// (lahat ng item, hindi item-count based), tapos naka-lock LAHAT hanggang\n' +
      '// bumili ng lifetime (₱99). clTrial = { startedAt: Timestamp(server), days }\n' +
      'export const CL_TRIAL_DAYS = 7;\n' +
      'export const CL_LIFETIME_PRICE = 99;\n' +
      '\n' +
      'export function getClTrialInfo(profile, now = serverNow()) {\n' +
      '  const t = profile && profile.clTrial;\n' +
      '  const start = toMs(t && t.startedAt);\n' +
      '  if (!t || start == null) return { exists: false, active: false, endsAt: null, msLeft: 0 };\n' +
      '  const endsAt = start + (Number(t.days) || 0) * DAY_MS;\n' +
      '  const msLeft = Math.max(0, endsAt - now);\n' +
      '  return { exists: true, active: msLeft > 0, endsAt, msLeft };\n' +
      '}\n' +
      '\n' +
      'export function isClUnlocked(profile, now = serverNow()) {\n' +
      '  if (!profile) return false;\n' +
      '  if (profile.isAdmin) return true;\n' +
      '  if (profile.subscriptions && profile.subscriptions.CL) return true;\n' +
      '  return getClTrialInfo(profile, now).active;\n' +
      '}',
    ],
  ]);

  patchFile('src/authContext.jsx', [
    [
      'import { setServerClock, persistClock, getAccess, hasAnyPractice, TRIAL_DAYS } from "./access";',
      'import { setServerClock, persistClock, getAccess, hasAnyPractice, TRIAL_DAYS, CL_TRIAL_DAYS } from "./access";',
    ],
    [
      '              if (!d.trial && !hasAnyPractice(d)) {\n                upd.trial = { startedAt: serverTimestamp(), days: TRIAL_DAYS };\n              }\n              tx.update(ref, upd);',
      '              if (!d.trial && !hasAnyPractice(d)) {\n                upd.trial = { startedAt: serverTimestamp(), days: TRIAL_DAYS };\n              }\n' +
      '              // Hiwalay na 7-day trial para sa RA 10863 (CL) — isang beses lang din,\n' +
      '              // maliban kung bumili na ng lifetime access (subscriptions.CL).\n' +
      '              if (!d.clTrial && !(d.subscriptions && d.subscriptions.CL)) {\n' +
      '                upd.clTrial = { startedAt: serverTimestamp(), days: CL_TRIAL_DAYS };\n' +
      '              }\n' +
      '              tx.update(ref, upd);',
    ],
    [
      '["subscriptions", "subscriptionExpiry", "appAccess", "trial", "pendingPurchases", "pendingAccess", "isAdmin"].forEach((k) => {',
      '["subscriptions", "subscriptionExpiry", "appAccess", "trial", "clTrial", "pendingPurchases", "pendingAccess", "isAdmin"].forEach((k) => {',
    ],
  ]);

  patchFile('src/payments.js', [
    [
      'export const PLANS = [\n  { id: "TL", label: "Tariff Law", price: 179,',
      'export const PLANS = [\n  { id: "CL", label: "RA 10863 (Customs Law)", price: 99, subjects: ["CL"] },\n  { id: "TL", label: "Tariff Law", price: 179,',
    ],
  ]);

  patchFile('src/pages/SubjectDashboard.jsx', [
    [
      '} from "../subjectQuizStore";',
      '} from "../subjectQuizStore";\nimport { isClUnlocked } from "../access";',
    ],
    [
      '// First N items (by sorted order) na libre bawat subject — lahat ng lagpas dito\n// ay naka-lock hanggang mag-subscribe. Tugma sa pricing table sa handoff doc.\nconst FREE_LIMITS = { cl: 10, cdp: 10, tl: 10, pc: 10, tcp: 10 };\n\nfunction isItemUnlocked(idx, subjectId, profile) {\n  const freeLimit = FREE_LIMITS[subjectId] ?? Infinity;\n  if (idx < freeLimit) return true;\n  return !!profile?.subscriptions?.[subjectId.toUpperCase()];\n}',
      '// First N items (by sorted order) na libre bawat subject — lahat ng lagpas dito\n// ay naka-lock hanggang mag-subscribe. Tugma sa pricing table sa handoff doc.\n// CL ang eksepsyon: 7-day FULL access trial (hindi item-count based) tapos\n// naka-lock LAHAT ng item hanggang mag-lifetime ₱99 — tingnan ang isClUnlocked().\nconst FREE_LIMITS = { cdp: 10, tl: 10, pc: 10, tcp: 10 };\n\nfunction isItemUnlocked(idx, subjectId, profile) {\n  if (subjectId === "cl") return isClUnlocked(profile);\n  const freeLimit = FREE_LIMITS[subjectId] ?? Infinity;\n  if (idx < freeLimit) return true;\n  return !!profile?.subscriptions?.[subjectId.toUpperCase()];\n}',
    ],
  ]);

  patchFile('src/pages/AdminPanel.jsx', [
    [
      'import {\n  ACCESS_PLANS, TRIAL_DAYS, DAY_MS, serverNow, getTrialInfo, getAppAccessInfo,\n  getAccess, addMonths, formatTimeLeft, formatDateShort,\n} from "../access";',
      'import {\n  ACCESS_PLANS, TRIAL_DAYS, DAY_MS, serverNow, getTrialInfo, getAppAccessInfo,\n  getAccess, addMonths, formatTimeLeft, formatDateShort, getClTrialInfo, CL_TRIAL_DAYS, CL_LIFETIME_PRICE,\n} from "../access";',
    ],
    [
      '  const [tab, setTab] = useState("users");\n  const [trialFilter, setTrialFilter] = useState("all");',
      '  const [tab, setTab] = useState("users");\n  const [trialFilter, setTrialFilter] = useState("all");\n  const [clFilter, setClFilter] = useState("all");',
    ],
    [
      '// "none" = wala pang trial (hindi pa nagbubukas ng app mula nang ma-update).\nfunction accessKey(u) {\n  const a = getAccess(u);\n  if (a.state === "expired" && !a.trial.exists) return "none";\n  return a.state;\n}',
      '// "none" = wala pang trial (hindi pa nagbubukas ng app mula nang ma-update).\nfunction accessKey(u) {\n  const a = getAccess(u);\n  if (a.state === "expired" && !a.trial.exists) return "none";\n  return a.state;\n}\n\n' +
      '// Parehong pattern para sa RA 10863 (CL): paid (lifetime) > trial > expired > none.\n' +
      'function clAccessKey(u) {\n' +
      '  if (u?.subscriptions?.CL) return "paid";\n' +
      '  const t = getClTrialInfo(u);\n' +
      '  if (!t.exists) return "none";\n' +
      '  return t.active ? "trial" : "expired";\n' +
      '}',
    ],
    [
      '  const endTrial = (u) => {\n    if (!window.confirm("Tapusin agad ang trial ni " + (u.fullName || u.email) + "?")) return;\n    return writeTrial(u, 0);\n  };\n\n  // ── Derived lists ───────────────────────────────────────────────────',
      '  const endTrial = (u) => {\n    if (!window.confirm("Tapusin agad ang trial ni " + (u.fullName || u.email) + "?")) return;\n    return writeTrial(u, 0);\n  };\n\n' +
      '  // ── RA 10863 (CL) Trial CRUD — kaparehong logic ng trial sa itaas ────\n' +
      '  const writeClTrial = (u, days) => {\n' +
      '    const startedAt = serverNow();\n' +
      '    return run(u.uid + ":cltrial", u, { clTrial: { startedAt: Timestamp.fromMillis(startedAt), days } }, { clTrial: { startedAt, days } });\n' +
      '  };\n' +
      '\n' +
      '  const grantClTrial = (u) => {\n' +
      '    if (!window.confirm("Simulan ulit ang " + CL_TRIAL_DAYS + "-day CL trial ni " + (u.fullName || u.email) + " mula ngayon?")) return;\n' +
      '    return writeClTrial(u, CL_TRIAL_DAYS);\n' +
      '  };\n' +
      '\n' +
      '  const extendClTrial = (u, extraDays) => {\n' +
      '    const left = getClTrialInfo(u).msLeft / DAY_MS;\n' +
      '    return writeClTrial(u, left + extraDays);\n' +
      '  };\n' +
      '\n' +
      '  const endClTrial = (u) => {\n' +
      '    if (!window.confirm("Tapusin agad ang CL trial ni " + (u.fullName || u.email) + "?")) return;\n' +
      '    return writeClTrial(u, 0);\n' +
      '  };\n' +
      '\n' +
      '  // ── Derived lists ───────────────────────────────────────────────────',
    ],
    [
      '  const trialRows = useMemo(() => {\n    return filtered.filter((u) => {\n      const k = accessKey(u);\n      if (trialFilter === "all") return true;\n      if (trialFilter === "trial") return k === "trial";\n      if (trialFilter === "expired") return k === "expired";\n      if (trialFilter === "none") return k === "none";\n      if (trialFilter === "paid") return k === "paid" || k === "member" || k === "admin";\n      return true;\n    });\n  }, [filtered, trialFilter, users]);\n\n  const rawPracticeCount',
      '  const trialRows = useMemo(() => {\n    return filtered.filter((u) => {\n      const k = accessKey(u);\n      if (trialFilter === "all") return true;\n      if (trialFilter === "trial") return k === "trial";\n      if (trialFilter === "expired") return k === "expired";\n      if (trialFilter === "none") return k === "none";\n      if (trialFilter === "paid") return k === "paid" || k === "member" || k === "admin";\n      return true;\n    });\n  }, [filtered, trialFilter, users]);\n\n' +
      '  const clRows = useMemo(() => {\n' +
      '    return filtered.filter((u) => {\n' +
      '      const k = clAccessKey(u);\n' +
      '      if (clFilter === "all") return true;\n' +
      '      return k === clFilter;\n' +
      '    });\n' +
      '  }, [filtered, clFilter, users]);\n' +
      '\n' +
      '  const rawPracticeCount',
    ],
    [
      '  const TABS = [\n    { id: "users", label: "👥 Users" },\n    { id: "practice", label: "💳 Practice", count: rawPracticeCount },\n    { id: "access", label: "⏱ Access", count: rawAccessCount },\n    { id: "trial", label: "🎁 Trial" },\n  ];',
      '  const TABS = [\n    { id: "users", label: "👥 Users" },\n    { id: "practice", label: "💳 Practice", count: rawPracticeCount },\n    { id: "access", label: "⏱ Access", count: rawAccessCount },\n    { id: "trial", label: "🎁 Trial" },\n    { id: "cl", label: "📜 CL" },\n  ];',
    ],
    [
      '                  {tr.exists && tr.active && <button onClick={() => endTrial(u)} disabled={busyKey === u.uid + ":trial"} className={btnRed}>End</button>}\n                </div>\n              </div>\n            );\n          })}\n        </div>\n      )}\n    </div>\n  );\n}',
      '                  {tr.exists && tr.active && <button onClick={() => endTrial(u)} disabled={busyKey === u.uid + ":trial"} className={btnRed}>End</button>}\n                </div>\n              </div>\n            );\n          })}\n        </div>\n      )}\n\n' +
      '      {/* ───────────── RA 10863 (CL) TRIAL + LIFETIME ───────────── */}\n' +
      '      {tab === "cl" && users !== null && !error && (\n' +
      '        <div className="space-y-3">\n' +
      '          <p className="text-xs text-slate-500 dark:text-slate-400">7-day free trial, tapos naka-lock hanggang bumili ng lifetime (₱{CL_LIFETIME_PRICE}).</p>\n' +
      '          <div className="flex flex-wrap gap-1.5">\n' +
      '            {[["all", "All"], ["trial", "On trial"], ["expired", "Expired"], ["none", "No trial yet"], ["paid", "Lifetime (paid)"]].map(([id, label]) => (\n' +
      '              <button key={id} onClick={() => setClFilter(id)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (clFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}>\n' +
      '                {label}\n' +
      '              </button>\n' +
      '            ))}\n' +
      '          </div>\n' +
      '          <p className="text-xs text-slate-400">{clRows.length} user(s)</p>\n' +
      '\n' +
      '          {clRows.map((u) => {\n' +
      '            const ct = getClTrialInfo(u);\n' +
      '            const paid = !!u.subscriptions?.CL;\n' +
      '            return (\n' +
      '              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">\n' +
      '                <div className="flex items-start justify-between gap-2">\n' +
      '                  <div className="min-w-0">\n' +
      '                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(walang pangalan)"}</p>\n' +
      '                    <p className="truncate text-xs text-slate-400">{u.email}</p>\n' +
      '                  </div>\n' +
      '                  <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + (paid ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" : ct.active ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>\n' +
      '                    {paid ? "👑 Lifetime" : ct.exists ? (ct.active ? "🎁 Trial" : "⏳ Expired") : "No trial yet"}\n' +
      '                  </span>\n' +
      '                </div>\n' +
      '                {ct.exists && !paid && (\n' +
      '                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">\n' +
      '                    {ct.active ? "CL trial hanggang " : "CL trial nagtapos noong "}{formatDateTime(ct.endsAt)}\n' +
      '                  </p>\n' +
      '                )}\n' +
      '                <div className="mt-2 flex flex-wrap gap-1.5">\n' +
      '                  {!paid && <button onClick={() => grantClTrial(u)} disabled={busyKey === u.uid + ":cltrial"} className={btnGreen}>{ct.exists ? "↺ Restart " + CL_TRIAL_DAYS + "d" : "＋ Grant " + CL_TRIAL_DAYS + "d"}</button>}\n' +
      '                  {!paid && <button onClick={() => extendClTrial(u, 1)} disabled={busyKey === u.uid + ":cltrial"} className={btnGhost}>+1 day</button>}\n' +
      '                  {!paid && ct.exists && ct.active && <button onClick={() => endClTrial(u)} disabled={busyKey === u.uid + ":cltrial"} className={btnRed}>End</button>}\n' +
      '                  {!paid && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnGhost + " border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"}>👑 Mark Lifetime (₱{CL_LIFETIME_PRICE})</button>}\n' +
      '                  {paid && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnRed}>Remove Lifetime</button>}\n' +
      '                </div>\n' +
      '              </div>\n' +
      '            );\n' +
      '          })}\n' +
      '        </div>\n' +
      '      )}\n' +
      '    </div>\n' +
      '  );\n' +
      '}',
    ],
  ]);

  console.log('✅ CL 7-day trial + lifetime lock wired up, Admin Panel has a new 📜 CL tab. Run npm run build next.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file sa step na \'yon — i-paste mo lang ulit sa akin ang exact section, aayusin ko ang anchor.');
  process.exit(1);
}
