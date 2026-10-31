// access.js — server clock, 3-day trial, App Access plans, and per-subject expiry.
// Pure functions only (no React) so they can be used anywhere.
//
// TWO SEPARATE THINGS:
//  1) APP ACCESS      -> can the user open the app (trial / paid months)
//  2) PRACTICE ACCESS -> `subscriptions` (CL/TL/CDP/PC/TCP) + `subscriptionExpiry`.
//     A subject flag with NO expiry is a legacy "lifetime" subscription and never expires.

export const TRIAL_DAYS = 3;
export const DAY_MS = 24 * 60 * 60 * 1000;

// true  = anyone with a paid practice subject always has app access.
// false = everyone (except admin) needs a trial / App Access.
export const PRACTICE_BUYERS_KEEP_APP_ACCESS = false;



// ── Server clock ─────────────────────────────────────────────────────
// We do not trust the phone's clock. When online we read the Firestore server
// time and save the offset. Time never goes backwards (maxSeen), so rolling the
// phone clock back while offline cannot extend access.
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

// Call this once the real server time (ms) is known.
export function setServerClock(serverMs) {
  offset = serverMs - Date.now();
  maxSeen = serverMs;
  persistClock();
}

export function serverNow() {
  const est = Date.now() + offset;
  if (est > maxSeen) maxSeen = est;
  return maxSeen;
}

// ── Helpers ──────────────────────────────────────────────────────────
// Accepts ms number, Firestore Timestamp, or {seconds,nanoseconds}
// (the shape a Timestamp has after coming back from the localStorage cache).
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
  if (!ms || ms <= 0) return "Expired";
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
  // Fallback: no trial field -> the account's createdAt starts the trial.
  if (start == null) { start = toMs(profile && profile.createdAt); days = TRIAL_DAYS; fromCreated = true; }
  if (start == null) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const endsAt = start + days * DAY_MS;
  if (fromCreated && endsAt <= now) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const msLeft = Math.max(0, endsAt - now);
  return { exists: true, active: msLeft > 0, endsAt, msLeft };
}

// appAccess = { plan: "M1"|"M3"|"M8"|..., expiresAt: ms }
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

// ── Legacy RA 10863 (CL) free trial ───────────────────────────────────
// The CL trial is retired: new signups get Level 1 for free instead.
// Only trials that STARTED BEFORE the cutoff below are still honored, so users
// who are mid-trial when this update ships do not lose it. Older app versions
// may still create a clTrial for new signups — those are ignored.
// >>> Set the cutoff to the day you deploy this update. <<<
export const CL_TRIAL_DAYS = 3;
export const CL_TRIAL_HONOR_BEFORE_MS = Date.UTC(2026, 9, 21); // 2026-10-21 00:00 UTC (covers an Oct 20 deploy)

export function getClTrialInfo(profile, now = serverNow()) {
  const none = { exists: false, active: false, endsAt: null, msLeft: 0 };
  const t = profile && profile.clTrial;
  const start = t ? toMs(t.startedAt) : null;
  if (start == null || start >= CL_TRIAL_HONOR_BEFORE_MS) return none;
  const days = Number(t.days) || 0;
  const endsAt = start + days * DAY_MS;
  const msLeft = Math.max(0, endsAt - now);
  return { exists: true, active: msLeft > 0, endsAt, msLeft };
}

// ── Per-subject expiry ────────────────────────────────────────────────
// subscriptions       = { CL: true, ... }
// subscriptionExpiry  = { CL: ms, ... }
// Flag true + NO expiry entry = legacy lifetime (grandfathered, never expires).
export const SUBJECT_CODES = ["CL", "TL", "CDP", "PC", "TCP"];
export const SUBJECT_TERM_MONTHS = { CL: 4, TL: 3, CDP: 3, PC: 3, TCP: 3 };

// lifetime: true -> expiresAt is null and msLeft is 0 (ignore msLeft, check `lifetime` first).
export function getSubjectInfo(profile, code, now = serverNow()) {
  const owned = !!(profile && profile.subscriptions && profile.subscriptions[code]);
  if (!owned) return { owned: false, active: false, lifetime: false, expiresAt: null, msLeft: 0 };
  const exp = toMs(profile.subscriptionExpiry && profile.subscriptionExpiry[code]);
  if (exp == null) return { owned: true, active: true, lifetime: true, expiresAt: null, msLeft: 0 };
  const msLeft = Math.max(0, exp - now);
  return { owned: true, active: msLeft > 0, lifetime: false, expiresAt: exp, msLeft };
}

export function isSubjectUnlocked(profile, code, now = serverNow()) {
  if (!profile) return false;
  if (profile.isAdmin) return true;
  return getSubjectInfo(profile, code, now).active;
}

export function countActiveSubjects(profile, now = serverNow()) {
  return SUBJECT_CODES.filter((c) => getSubjectInfo(profile, c, now).active).length;
}

// RA 10863 5-level quiz: Level 1 is free for everyone; Levels 2-5 need CL.
export function isClUnlocked(profile, now = serverNow()) {
  if (!profile) return false;
  if (profile.isAdmin) return true;
  if (getSubjectInfo(profile, "CL", now).active) return true;
  return getClTrialInfo(profile, now).active;
}

export function isRaLevelUnlocked(profile, levelId, now = serverNow()) {
  if (levelId === "level1") return true;
  return isClUnlocked(profile, now);
}

// ── Bonus / stacking ─────────────────────────────────────────────────
export const THREE_SUBJECT_BONUS = { count: 3, months: 3 };
// Old one-time migration (already ran). Kept only so existing imports keep working.
export const MIGRATION = { months3: 3, months12: 2, trialDays: TRIAL_DAYS };

export function countSubjects(subs) {
  return Object.values(subs || {}).filter(Boolean).length;
}

// Used by App Access plans (M1/M3/M8) and manual grants: adds to the end of the
// remaining time if still active, otherwise from now.
export function stackAccess(profile, months, now = serverNow()) {
  const cur = getAppAccessInfo(profile, now);
  return addMonths(cur.active ? cur.expiresAt : now, months);
}

// LEGACY (old lifetime flow). Kept so the current AdminPanel still compiles
// until it is switched to computeGrant().
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

// NEW purchase flow (expiring subjects).
// plan = { subjects: [...], months: term in months, ... }
// Rules:
//  - Each purchased subject expires `months` after now, or after its current expiry
//    if still active (renewing early never loses days).
//  - Legacy lifetime subjects are never converted or shortened.
//  - App Access does NOT stack across subjects: it runs to the latest of
//    (current App Access end, latest purchased subject end).
//  - 3-subject bonus: counts ACTIVE subjects only, once per account, +3 months of
//    App Access only when a SINGLE-subject purchase is what reaches 3.
// Returns { termMonths, subjectExpiry: {CODE: ms}, appExpiresAt: ms|null, bonusFlag, bonusMonths }
export function computeGrant(profile, plan, now = serverNow()) {
  const term = plan.months || 0;
  const subjects = plan.subjects || [];
  const subjectExpiry = {};
  let latest = 0;

  subjects.forEach((code) => {
    const info = getSubjectInfo(profile, code, now);
    const base = info.active && !info.lifetime ? info.expiresAt : now;
    const end = addMonths(base, term);
    if (end > latest) latest = end;
    if (info.lifetime) return;
    subjectExpiry[code] = end;
  });

  const activeBefore = SUBJECT_CODES.filter((c) => getSubjectInfo(profile, c, now).active);
  const activeAfter = new Set(activeBefore.concat(subjects));
  const reached = activeBefore.length < THREE_SUBJECT_BONUS.count && activeAfter.size >= THREE_SUBJECT_BONUS.count;
  const consumed = !!(profile && profile.bonuses && profile.bonuses.threeSubjects);
  const bonusFlag = reached && !consumed;
  const bonusMonths = bonusFlag && subjects.length === 1 ? THREE_SUBJECT_BONUS.months : 0;

  if (subjects.length === 0 || term <= 0) {
    return { termMonths: term, subjectExpiry, appExpiresAt: null, bonusFlag: false, bonusMonths: 0 };
  }

  const cur = getAppAccessInfo(profile, now);
  let appEnd = Math.max(cur.active ? cur.expiresAt : 0, latest);
  if (bonusMonths > 0) appEnd = addMonths(appEnd, bonusMonths);
  const changed = !cur.active || appEnd > cur.expiresAt;

  return { termMonths: term, subjectExpiry, appExpiresAt: changed ? appEnd : null, bonusFlag, bonusMonths };
}


// ── PROMO "All Access" (days-based, hindi months) ─────────────────────
// - Bawat subject: +days. Kung active pa, idinadagdag sa dulo ng natitirang oras (walang nasasayang).
// - Legacy lifetime subjects: hindi ginagalaw.
// - App Access: idinadagdag din sa dulo kung active pa, kung hindi, mula ngayon.
// - Walang 3-subject bonus dito.
export function computePromoGrant(profile, plan, now = serverNow()) {
  const days = plan.days || 30;
  const span = days * DAY_MS;
  const subjectExpiry = {};
  (plan.subjects || []).forEach((code) => {
    const info = getSubjectInfo(profile, code, now);
    if (info.lifetime) return;
    const base = info.active ? info.expiresAt : now;
    subjectExpiry[code] = base + span;
  });
  const cur = getAppAccessInfo(profile, now);
  const appBase = cur.active ? cur.expiresAt : now;
  return { days, subjectExpiry, appExpiresAt: appBase + span, bonusFlag: false, bonusMonths: 0 };
}
