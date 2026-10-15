// access.js — oras ng server, 3-day trial, at App Access plans (1/3/8 buwan).
// Pure functions lang (walang React) para magamit kahit saan.
//
// DALAWANG HIWALAY NA BAGAY:
//  1) APP ACCESS  -> pwede bang buksan ang app (trial / buwanang bayad)
//  2) PRACTICE QUESTIONS -> `subscriptions` (CL/TL/CDP/PC/TCP) — HINDI ito ginagalaw dito.

export const TRIAL_DAYS = 3;
export const DAY_MS = 24 * 60 * 60 * 1000;

// true  = kahit sinong may bayad na practice subject (luma o bago) ay laging
//         may access sa app (protektado ang mga "lifetime" na na-promise mo).
// false = lahat ng user (maliban admin) kailangan ng trial / App Access.
// TRANSITION: true hanggang matapos ang migration sa AdminPanel, tapos i-set sa false (patch-flip.cjs).
export const PRACTICE_BUYERS_KEEP_APP_ACCESS = false;

export const ACCESS_PLANS = [
  { id: "M1", kind: "access", months: 1, label: "App Access — 1 Month", price: 50, subjects: [] },
  { id: "M3", kind: "access", months: 3, label: "App Access — 3 Months", price: 139, subjects: [] },
  { id: "M8", kind: "access", months: 8, label: "App Access — 8 Months", price: 380, subjects: [] },
];

// ── Server clock ─────────────────────────────────────────────────────
// Hindi tayo nagtitiwala sa oras ng phone. Kapag online, kinukuha ang oras
// ng Firestore server at sine-save ang pagitan (offset). Hindi rin umaatras
// ang oras (maxSeen) para hindi madaya ng pag-atras ng clock offline.
const OFFSET_KEY = "cuble_clockOffset";
const MAXSEEN_KEY = "cuble_clockMaxSeen";

let offset = 0;
let maxSeen = 0;
try {
  offset = Number(localStorage.getItem(OFFSET_KEY)) || 0;
  maxSeen = Number(localStorage.getItem(MAXSEEN_KEY)) || 0;
} catch (_) {}

export function persistClock() {
  try {
    localStorage.setItem(OFFSET_KEY, String(offset));
    localStorage.setItem(MAXSEEN_KEY, String(maxSeen));
  } catch (_) {}
}

// Tawagin kapag nakuha na ang totoong oras ng server (ms).
export function setServerClock(serverMs) {
  offset = serverMs - Date.now();
  maxSeen = serverMs; // server ang masusunod, i-reset ang maxSeen
  persistClock();
}

export function serverNow() {
  const est = Date.now() + offset;
  if (est > maxSeen) maxSeen = est;
  return maxSeen;
}

// ── Helpers ──────────────────────────────────────────────────────────
// Tumatanggap ng ms number, Firestore Timestamp, o {seconds,nanoseconds}
// (ganyan ang itsura ng Timestamp kapag galing sa localStorage cache).
export function toMs(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (typeof v.seconds === "number") return v.seconds * 1000 + Math.floor((v.nanoseconds || 0) / 1e6);
  if (v instanceof Date) return v.getTime();
  return null;
}

export function hasAnyPractice(profile) {
  return Object.values((profile && profile.subscriptions) || {}).some(Boolean);
}

export function addMonths(ms, months) {
  const d = new Date(ms);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

export function formatTimeLeft(ms) {
  if (!ms || ms <= 0) return "tapos na";
  const d = Math.floor(ms / DAY_MS);
  const h = Math.floor((ms % DAY_MS) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (d > 0) return d + "d " + h + "h";
  if (h > 0) return h + "h " + m + "m";
  return Math.max(1, m) + "m";
}

export function formatDateShort(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch (_) {
    return "";
  }
}

// ── Trial / App Access info ──────────────────────────────────────────
// trial = { startedAt: Timestamp(server), days: number }
export function getTrialInfo(profile, now = serverNow()) {
  const t = profile && profile.trial;
  let start = t ? toMs(t.startedAt) : null;
  let days = t ? (Number(t.days) || 0) : 0;
  let fromCreated = false;
  // Fallback: kung walang trial field, ang createdAt ng account ang simula ng trial.
  if (start == null) { start = toMs(profile && profile.createdAt); days = TRIAL_DAYS; fromCreated = true; }
  if (start == null) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const endsAt = start + days * DAY_MS;
  if (fromCreated && endsAt <= now) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const msLeft = Math.max(0, endsAt - now);
  return { exists: true, active: msLeft > 0, endsAt, msLeft };
}

// appAccess = { plan: "M1"|"M3"|"M8", expiresAt: ms }
export function getAppAccessInfo(profile, now = serverNow()) {
  const a = profile && profile.appAccess;
  const exp = toMs(a && a.expiresAt);
  if (!a || exp == null) return { exists: false, active: false, plan: null, expiresAt: null, msLeft: 0 };
  const msLeft = Math.max(0, exp - now);
  return { exists: true, active: msLeft > 0, plan: a.plan || null, expiresAt: exp, msLeft };
}

// state: "none" | "loading" | "admin" | "paid" | "member" | "trial" | "expired"
export function getAccess(profile, opts) {
  const clockReady = !opts || opts.clockReady !== false;
  const now = serverNow();
  if (!profile) return { state: "none", trial: getTrialInfo(null, now), app: getAppAccessInfo(null, now), msLeft: 0 };
  const trial = getTrialInfo(profile, now);
  const app = getAppAccessInfo(profile, now);
  if (profile.isAdmin) return { state: "admin", trial, app, msLeft: 0 };
  if (app.active) return { state: "paid", trial, app, msLeft: app.msLeft };
  if (PRACTICE_BUYERS_KEEP_APP_ACCESS && hasAnyPractice(profile)) return { state: "member", trial, app, msLeft: 0 };
  if (trial.active) return { state: "trial", trial, app, msLeft: trial.msLeft };
  if (!trial.exists && !clockReady) return { state: "loading", trial, app, msLeft: 0 };
  return { state: "expired", trial, app, msLeft: 0 };
}

// ── RA 10863 (CL) time-based lock ──────────────────────────────────────
// Hiwalay sa generic FREE_LIMITS ng ibang subjects: CL_TRIAL_DAYS na FULL access trial
// (lahat ng item, hindi item-count based), tapos naka-lock LAHAT hanggang
// bumili ng CL (presyo: PLANS sa payments.js). clTrial = { startedAt: Timestamp(server), days }
export const CL_TRIAL_DAYS = 3;
// Ang presyo ng CL ay galing sa PLANS: tingnan ang CL_LIFETIME_PRICE sa payments.js.

export function getClTrialInfo(profile, now = serverNow()) {
  const t = profile && profile.clTrial;
  let start = t ? toMs(t.startedAt) : null;
  let days = t ? (Number(t.days) || 0) : 0;
  let fromCreated = false;
  if (start == null) { start = toMs(profile && profile.createdAt); days = CL_TRIAL_DAYS; fromCreated = true; }
  if (start == null) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const endsAt = start + days * DAY_MS;
  if (fromCreated && endsAt <= now) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const msLeft = Math.max(0, endsAt - now);
  return { exists: true, active: msLeft > 0, endsAt, msLeft };
}

// ── Bonus / stacking (shared ng approve, manual grant at migration) ──
export const THREE_SUBJECT_BONUS = { count: 3, months: 3 };
// Isang beses na migration ng lumang users: 3+ subjects = 3 buwan, 1-2 = 2 buwan, wala = trial.
export const MIGRATION = { months3: 3, months12: 2, trialDays: TRIAL_DAYS };

export function countSubjects(subs) {
  return Object.values(subs || {}).filter(Boolean).length;
}

// Idagdag sa dulo ng natitirang oras kung active pa; kung hindi, mula ngayon.
export function stackAccess(profile, months, now = serverNow()) {
  const cur = getAppAccessInfo(profile, now);
  return addMonths(cur.active ? cur.expiresAt : now, months);
}

// plan = { subjects: [...], bonusMonths?: number }
// months = buwan ng bundle, o +3 kapag SINGLE-subject purchase ang unang nagpaabot sa 3 subjects.
// flag = true kapag dapat markahang consumed ang bonuses.threeSubjects.
export function planAward(profile, plan) {
  const owned = (profile && profile.subscriptions) || {};
  const next = { ...owned };
  (plan.subjects || []).forEach((c) => { next[c] = true; });
  const reached = countSubjects(owned) < THREE_SUBJECT_BONUS.count && countSubjects(next) >= THREE_SUBJECT_BONUS.count;
  const consumed = !!(profile && profile.bonuses && profile.bonuses.threeSubjects);
  const flag = reached && !consumed;
  let months = plan.bonusMonths || 0;
  if (flag && !plan.bonusMonths && (plan.subjects || []).length === 1) months += THREE_SUBJECT_BONUS.months;
  return { months, flag };
}

export function isClUnlocked(profile, now = serverNow()) {
  if (!profile) return false;
  if (profile.isAdmin) return true;
  if (profile.subscriptions && profile.subscriptions.CL) return true;
  return getClTrialInfo(profile, now).active;
}
