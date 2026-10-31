import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteField, Timestamp, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import AdminOverview from "./AdminOverview";
import { SUBJECT_LABELS, PAYMENT_METHODS, PROMO_PLAN } from "../payments";
import {
  TRIAL_DAYS, DAY_MS, serverNow, getTrialInfo, getAppAccessInfo,
  getAccess, addMonths, formatTimeLeft, formatDateShort,
  stackAccess, computeGrant, computePromoGrant, getSubjectInfo, SUBJECT_TERM_MONTHS,
} from "../access";

const SUBJECT_CODES = ["CL", "CDP", "TL", "PC", "TCP"];
// Admin-only: manual "+N mo" App Access buttons, and months for old
// App Access requests that may still be waiting in pendingAccess.
const MANUAL_GRANT_MONTHS = [1, 3, 8];
const LEGACY_ACCESS_MONTHS = { M1: 1, M3: 3, M8: 8 };
const METHOD_LABELS = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label]));
const ALL_PLAN_LABELS = { ...SUBJECT_LABELS, [PROMO_PLAN.id]: PROMO_PLAN.label };

const TRIAGE = {
  pending: { label: "Pending", dot: "bg-amber-500", chip: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400" },
  none: { label: "None", dot: "bg-slate-400", chip: "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400" },
  subscribed: { label: "Subscribed", dot: "bg-emerald-500", chip: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400" },
};

const STATE_UI = {
  admin: { label: "Admin", cls: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
  paid: { label: "App Access", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  member: { label: "Practice buyer", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  trial: { label: "On trial", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" },
  expired: { label: "Expired", cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" },
  none: { label: "No trial yet", cls: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
};

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function defaultTriage(userData) {
  if (userData.triageStatus) return userData.triageStatus;
  return (userData.pendingPurchases || []).length > 0 ? "pending" : "none";
}

// "none" = wala pang trial (hindi pa nagbubukas ng app mula nang ma-update).
function accessKey(u) {
  const a = getAccess(u);
  if (a.state === "expired" && !a.trial.exists) return "none";
  return a.state;
}

// RA 10863 (CL) status: "paid" = active (lifetime or not expired), "expired", or "none".
function clAccessKey(u) {
  const s = getSubjectInfo(u, "CL");
  if (!s.owned) return "none";
  return s.active ? "paid" : "expired";
}

function StateChip({ u }) {
  const key = accessKey(u);
  const a = getAccess(u);
  const ui = STATE_UI[key];
  let extra = "";
  if (key === "trial") extra = " · " + formatTimeLeft(a.msLeft);
  if (key === "paid") extra = " · " + formatTimeLeft(a.msLeft);
  return <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + ui.cls}>{ui.label}{extra}</span>;
}

export default function AdminPanel() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [busyKey, setBusyKey] = useState(null);
  const [tab, setTab] = useState("overview");
  const [trialFilter, setTrialFilter] = useState("all");
  const [clFilter, setClFilter] = useState("all");
  const [migMsg, setMigMsg] = useState("");

  const loadUsers = async () => {
    setError(null);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.email || "").localeCompare(b.fullName || b.email || ""));
      setUsers(list);
    } catch (err) {
      console.warn("AdminPanel load failed:", err);
      setError(err?.message || String(err));
      setUsers([]);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.fullName || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const patchUser = (uid, patch) => {
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));
  };

  // Isang lugar para sa lahat ng write: busy state + error alert + local patch.
  const run = async (key, u, payload, localPatch) => {
    setBusyKey(key);
    try {
      await updateDoc(doc(db, "users", u.uid), payload);
      patchUser(u.uid, localPatch);
    } catch (err) {
      console.warn("admin write failed:", err);
      alert("Something went wrong. Please try again:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  // Transaction helper: reads the latest user doc first, so an admin action can
  // never overwrite a request the user sent after this list was loaded.
  // build(d) returns { write, patch } or null (= already handled).
  const txn = async (key, u, build) => {
    setBusyKey(key);
    try {
      const ref = doc(db, "users", u.uid);
      const res = await runTransaction(db, async (t) => {
        const snap = await t.get(ref);
        if (!snap.exists()) throw new Error("User document no longer exists.");
        const out = build(snap.data());
        if (!out) return null;
        t.update(ref, out.write);
        return out.patch;
      });
      if (res) patchUser(u.uid, res);
      else { alert("Already handled or no longer pending. Refreshing the list."); await loadUsers(); }
    } catch (err) {
      console.warn("admin transaction failed:", err);
      alert("Something went wrong. Please try again:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  // ── Practice questions ──────────────────────────────────────────────
  // Manual unlock/remove. Unlocking grants the standard term (3 months, 4 for CL) from now;
  // removing clears the subject flag and its expiry.
  const toggleSubject = async (u, code) => {
    const owned = !!u.subscriptions?.[code];
    const key = u.uid + ":" + code;
    if (owned) {
      if (!window.confirm("Remove " + code + " from " + (u.fullName || u.email) + "?")) return;
      const exp = { ...(u.subscriptionExpiry || {}) };
      delete exp[code];
      await run(
        key, u,
        { ["subscriptions." + code]: false, ["subscriptionExpiry." + code]: deleteField() },
        { subscriptions: { ...u.subscriptions, [code]: false }, subscriptionExpiry: exp }
      );
      return;
    }
    const months = SUBJECT_TERM_MONTHS[code] || 3;
    if (!window.confirm("Unlock " + code + " for " + months + " months for " + (u.fullName || u.email) + "?")) return;
    const expiresAt = addMonths(serverNow(), months);
    await txn(key, u, (d) => {
      const remaining = (d.pendingPurchases || []).filter((p) => !((p.subjects || []).length === 1 && p.subjects[0] === code));
      return {
        write: { ["subscriptions." + code]: true, ["subscriptionExpiry." + code]: expiresAt, pendingPurchases: remaining },
        patch: { subscriptions: { ...(d.subscriptions || {}), [code]: true }, subscriptionExpiry: { ...(d.subscriptionExpiry || {}), [code]: expiresAt }, pendingPurchases: remaining },
      };
    });
  };

  // Admin extension: +N months on an expiring subject. Lifetime subjects are never touched.
  const extendSubject = async (u, code, months) => {
    const s = getSubjectInfo(u, code);
    if (!s.owned || s.lifetime) return;
    const expiresAt = addMonths(s.active ? s.expiresAt : serverNow(), months);
    await run(
      u.uid + ":" + code, u,
      { ["subscriptionExpiry." + code]: expiresAt },
      { subscriptionExpiry: { ...(u.subscriptionExpiry || {}), [code]: expiresAt } }
    );
  };

  const setTriage = (u, status) =>
    run(u.uid + ":triage", u, { triageStatus: status }, { triageStatus: status });

  const approvePractice = async (u, p) => {
    const plan = p.plan === PROMO_PLAN.id ? PROMO_PLAN : undefined;
    const diff = plan && plan.price !== p.price ? "⚠️ Price mismatch: the user paid ₱" + p.price + " but the plan is now ₱" + plan.price + " (older app version). " : "";
    if (!window.confirm(diff + "Approve " + (ALL_PLAN_LABELS[p.plan] || p.plan) + " ₱" + p.price + " for " + (u.fullName || u.email) + "?")) return;
    const ref = doc(db, "users", u.uid);
    setBusyKey(u.uid + ":pp:" + p.referenceCode);
    try {
      // One atomic transaction: it reads the latest doc, so a grant can never be doubled.
      const res = await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("User document no longer exists.");
        const d = snap.data();
        const done = (d.paymentHistory || []).some((h) => h.referenceCode === p.referenceCode);
        const pending = (d.pendingPurchases || []).some((x) => x.referenceCode === p.referenceCode);
        if (done || !pending) return null;
        const now = serverNow();
        const subjects = p.subjects || (plan ? plan.subjects : []);
        const term = plan ? plan.months : (subjects.length === 1 ? (SUBJECT_TERM_MONTHS[subjects[0]] || 3) : 6);
        const isPromo = !!plan && plan.kind === "promo";
        const g = isPromo ? computePromoGrant(d, plan, now) : computeGrant(d, { subjects, months: term }, now);
        const remaining = (d.pendingPurchases || []).filter((x) => x.referenceCode !== p.referenceCode);
        const upd = {
          pendingPurchases: remaining,
          triageStatus: "subscribed",
          paymentHistory: arrayUnion({ kind: "practice", plan: p.plan, price: p.price, method: p.method, referenceCode: p.referenceCode, approvedAt: now, months: term, ...(isPromo ? { days: plan.days } : {}) }),
        };
        const subsPatch = {};
        const expPatch = { ...(d.subscriptionExpiry || {}) };
        subjects.forEach((c) => { upd["subscriptions." + c] = true; subsPatch[c] = true; });
        Object.keys(g.subjectExpiry).forEach((c) => {
          upd["subscriptionExpiry." + c] = g.subjectExpiry[c];
          expPatch[c] = g.subjectExpiry[c];
        });
        const patch = {
          pendingPurchases: remaining,
          triageStatus: "subscribed",
          subscriptions: { ...(d.subscriptions || {}), ...subsPatch },
          subscriptionExpiry: expPatch,
        };
        if (g.appExpiresAt) {
          upd.appAccess = { plan: p.plan, expiresAt: g.appExpiresAt };
          upd.appAccessHistory = arrayUnion({ plan: p.plan, price: 0, referenceCode: p.referenceCode, method: "practice-purchase", approvedAt: now, expiresAt: g.appExpiresAt, months: term + g.bonusMonths, ...(isPromo ? { days: plan.days } : {}) });
          patch.appAccess = upd.appAccess;
        }
        if (g.bonusFlag) {
          upd["bonuses.threeSubjects"] = now;
          patch.bonuses = { ...(d.bonuses || {}), threeSubjects: now };
        }
        tx.update(ref, upd);
        return patch;
      });
      if (res) patchUser(u.uid, res);
      else { alert("Already approved or no longer pending (ref " + p.referenceCode + "). Nothing was changed."); await loadUsers(); }
    } catch (err) {
      console.warn("approvePractice failed:", err);
      alert("Something went wrong. Please try again:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  const rejectPractice = async (u, p) => {
    if (!window.confirm("Remove this pending request (ref " + p.referenceCode + ")?")) return;
    await txn(u.uid + ":pp:" + p.referenceCode, u, (d) => {
      const list = d.pendingPurchases || [];
      if (!list.some((x) => x.referenceCode === p.referenceCode)) return null;
      const remaining = list.filter((x) => x.referenceCode !== p.referenceCode);
      return { write: { pendingPurchases: remaining }, patch: { pendingPurchases: remaining } };
    });
  };

  // ── App Access (buwanang plan) ──────────────────────────────────────
  // Kapag may active pa, dinadagdag sa dulo ng natitirang oras (hindi nasasayang).
  const grantAccess = async (u, plan, pendingItem) => {
    const now = serverNow();
    await txn(u.uid + ":acc", u, (d) => {
      if (pendingItem && !(d.pendingAccess || []).some((x) => x.referenceCode === pendingItem.referenceCode)) return null;
      const expiresAt = stackAccess(d, plan.months, now);
      const appAccess = { plan: plan.id, expiresAt };
      const write = {
        appAccess,
        appAccessHistory: arrayUnion({ plan: plan.id, price: plan.price, referenceCode: pendingItem ? pendingItem.referenceCode : "MANUAL", method: pendingItem ? pendingItem.method : "manual", approvedAt: now, expiresAt }),
      };
      const patch = { appAccess };
      if (pendingItem) {
        const remaining = (d.pendingAccess || []).filter((x) => x.referenceCode !== pendingItem.referenceCode);
        write.pendingAccess = remaining;
        patch.pendingAccess = remaining;
      }
      return { write, patch };
    });
  };

  const approveAccess = async (u, p) => {
    const months = LEGACY_ACCESS_MONTHS[p.plan];
    if (!months) { alert("Unknown plan: " + p.plan); return; }
    const plan = { id: p.plan, months, price: Number(p.price) || 0 };
    if (!window.confirm("Approve " + months + " month(s) (₱" + plan.price + ") for " + (u.fullName || u.email) + "?")) return;
    await grantAccess(u, plan, p);
  };

  const manualGrant = async (u, months) => {
    if (!window.confirm("Give " + (u.fullName || u.email) + " " + months + " month(s) of App Access?")) return;
    await grantAccess(u, { id: "M" + months, months, price: 0 }, null);
  };

  const removeAccess = async (u) => {
    if (!window.confirm("Remove App Access for " + (u.fullName || u.email) + "?")) return;
    await run(u.uid + ":acc", u, { appAccess: deleteField() }, { appAccess: undefined });
  };

  const rejectAccess = async (u, p) => {
    if (!window.confirm("Remove this pending request (ref " + p.referenceCode + ")?")) return;
    await txn(u.uid + ":acc:" + p.referenceCode, u, (d) => {
      const list = d.pendingAccess || [];
      if (!list.some((x) => x.referenceCode === p.referenceCode)) return null;
      const remaining = list.filter((x) => x.referenceCode !== p.referenceCode);
      return { write: { pendingAccess: remaining }, patch: { pendingAccess: remaining } };
    });
  };

  // ── Trial CRUD ──────────────────────────────────────────────────────
  // Laging nire-reset ang startedAt sa "ngayon" at inaayos ang `days` para
  // tama ang natitirang oras. Oras ng server (serverNow), hindi ng phone.
  const writeTrial = (u, days) => {
    const startedAt = serverNow();
    return run(u.uid + ":trial", u, { trial: { startedAt: Timestamp.fromMillis(startedAt), days } }, { trial: { startedAt, days } });
  };

  const grantTrial = (u) => {
    if (!window.confirm("Restart the " + TRIAL_DAYS + "-day trial for " + (u.fullName || u.email) + " from now?")) return;
    return writeTrial(u, TRIAL_DAYS);
  };

  const extendTrial = (u, extraDays) => {
    const left = getTrialInfo(u).msLeft / DAY_MS;
    return writeTrial(u, left + extraDays);
  };

  const endTrial = (u) => {
    if (!window.confirm("End the trial for " + (u.fullName || u.email) + " now?")) return;
    return writeTrial(u, 0);
  };

  // (The RA 10863 free trial is retired. Level 1 is free for everyone instead.)

  // ── Derived lists ───────────────────────────────────────────────────
  const practicePending = useMemo(() => {
    const rows = [];
    filtered.forEach((u) => (u.pendingPurchases || []).forEach((p) => rows.push({ u, p })));
    return rows.sort((a, b) => (a.p.requestedAt || 0) - (b.p.requestedAt || 0));
  }, [filtered]);

  const accessPending = useMemo(() => {
    const rows = [];
    filtered.forEach((u) => (u.pendingAccess || []).forEach((p) => rows.push({ u, p })));
    return rows.sort((a, b) => (a.p.requestedAt || 0) - (b.p.requestedAt || 0));
  }, [filtered]);

  const activeSubscribers = useMemo(
    () =>
      filtered
        .filter((u) => getAppAccessInfo(u).exists)
        .sort((a, b) => getAppAccessInfo(a).expiresAt - getAppAccessInfo(b).expiresAt),
    [filtered, users]
  );

  const trialRows = useMemo(() => {
    return filtered.filter((u) => {
      const k = accessKey(u);
      if (trialFilter === "all") return true;
      if (trialFilter === "trial") return k === "trial";
      if (trialFilter === "expired") return k === "expired";
      if (trialFilter === "none") return k === "none";
      if (trialFilter === "paid") return k === "paid" || k === "member" || k === "admin";
      return true;
    });
  }, [filtered, trialFilter, users]);

  const clRows = useMemo(() => {
    return filtered.filter((u) => {
      const k = clAccessKey(u);
      if (clFilter === "all") return true;
      return k === clFilter;
    });
  }, [filtered, clFilter, users]);

  const rawPracticeCount = (users || []).reduce((n, u) => n + (u.pendingPurchases || []).length, 0);
  const rawAccessCount = (users || []).reduce((n, u) => n + (u.pendingAccess || []).length, 0);

  // Users whose App Access or any subject ends within 7 days.
  // Computed from the users already loaded, so it costs no extra Firestore reads.
  const expiringRows = useMemo(() => {
    const now = serverNow();
    const rows = [];
    filtered.forEach((u) => {
      if (u.isAdmin) return;
      const items = [];
      const app = getAppAccessInfo(u, now);
      if (app.active && app.msLeft <= 7 * DAY_MS) items.push({ label: "App Access", endsAt: app.expiresAt });
      SUBJECT_CODES.forEach((c) => {
        const s = getSubjectInfo(u, c, now);
        if (s.active && !s.lifetime && s.msLeft <= 7 * DAY_MS) items.push({ label: c, endsAt: s.expiresAt });
      });
      if (items.length) rows.push({ u, items, soonest: Math.min(...items.map((i) => i.endsAt)) });
    });
    return rows.sort((a, b) => a.soonest - b.soonest);
  }, [filtered, users]);

  const copyReminder = async (u, items) => {
    const first = (u.fullName || "there").split(" ")[0];
    const parts = items.map((i) => i.label + " (" + formatDateShort(i.endsAt) + ")").join(", ");
    const text = "Hi " + first + "! Your CuBLE access is ending soon: " + parts + ". You can renew anytime from your Profile. If you renew early, your remaining days are kept. Thank you!";
    try {
      await navigator.clipboard.writeText(text);
      alert("Reminder copied. Paste it into Messenger or SMS.");
    } catch (_) {
      window.prompt("Copy this message:", text);
    }
  };

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "users", label: "👥 Users" },
    { id: "practice", label: "💳 Practice", count: rawPracticeCount },
    { id: "access", label: "⏱ Access", count: rawAccessCount },
    { id: "expiring", label: "⏳ Expiring", count: expiringRows.length },
    { id: "trial", label: "🎁 Trial" },
    { id: "cl", label: "📜 RA 10863" },
  ];

  const btn = "min-h-[34px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ";
  const btnGhost = btn + "border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700";
  const btnGreen = btn + "bg-emerald-600 text-white active:bg-emerald-700";
  const btnRed = btn + "border border-red-200 text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400";

  const PendingCard = ({ u, p, onApprove, onReject, approveLabel }) => (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
      <p className="truncate text-xs text-slate-400">{u.email}</p>
      <p className="mt-2 text-sm font-semibold text-navy-900 dark:text-amber-300">
        {ALL_PLAN_LABELS[p.plan] || p.plan} · ₱{p.price} · {METHOD_LABELS[p.method] || p.method}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Ref: {p.referenceCode} · {formatDateTime(p.requestedAt)}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onApprove} disabled={!!busyKey} className={btnGreen}>{approveLabel}</button>
        <button onClick={onReject} disabled={!!busyKey} className={btnRed}>✕ Reject</button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-slate-50">👑 Admin Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Practice Questions and App Access have separate pending lists, and Trial has its own panel.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={"flex-shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors " + (tab === t.id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300")}
          >
            {t.label}
            {t.count > 0 && <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          onClick={loadUsers}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-500 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700"
          aria-label="Refresh"
        >
          ⟳
        </button>
      </div>

      {users === null && <p className="py-8 text-center text-slate-400">Loading users...</p>}

      {tab === "overview" && users !== null && !error && <AdminOverview users={users} />}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-bold">⚠️ Unable to load users</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ───────────── USERS ───────────── */}


      {tab === "users" && users !== null && !error && (
        <div className="space-y-3">
          {filtered.length === 0 && <p className="py-8 text-center text-slate-400">No users found.</p>}
          {filtered.map((u) => {
            const triage = defaultTriage(u);
            const t = TRIAGE[triage] || TRIAGE.none;
            const app = getAppAccessInfo(u);
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={"flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold " + t.chip}>
                    <span className={"h-2 w-2 rounded-full " + t.dot} aria-hidden />
                    {t.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SUBJECT_CODES.map((code) => {
                    const si = getSubjectInfo(u, code);
                    const busy = busyKey === u.uid + ":" + code;
                    const tone = si.active
                      ? "bg-emerald-600 text-white active:bg-emerald-700 "
                      : si.owned
                        ? "bg-amber-100 text-amber-800 active:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-300 "
                        : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-900/40 dark:text-slate-300 ";
                    return (
                      <button
                        key={code}
                        onClick={() => toggleSubject(u, code)}
                        disabled={busy}
                        title={SUBJECT_LABELS[code]}
                        className={btn + tone}
                      >
                        {code} {si.active ? (si.lifetime ? "∞" : "✓") : si.owned ? "⏳" : "✕"}
                      </button>
                    );
                  })}
                </div>

                {SUBJECT_CODES.some((c) => u.subscriptions?.[c]) && (
                  <div className="mt-2 space-y-1">
                    {SUBJECT_CODES.filter((c) => u.subscriptions?.[c]).map((c) => {
                      const si = getSubjectInfo(u, c);
                      return (
                        <div key={c} className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{c} · {si.lifetime ? "Lifetime" : (si.active ? "until " : "expired ") + formatDateShort(si.expiresAt)}</span>
                          {!si.lifetime && (
                            <button onClick={() => extendSubject(u, c, 1)} disabled={busyKey === u.uid + ":" + c} className={btnGhost}>+1 mo</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-3 flex gap-1.5">
                  {Object.entries(TRIAGE).map(([status, cfg]) => (
                    <button
                      key={status}
                      onClick={() => setTriage(u, status)}
                      disabled={busyKey === u.uid + ":triage"}
                      className={"flex-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 " + (triage === status ? cfg.chip + " bg-slate-50 dark:bg-slate-900/40" : "border-slate-200 text-slate-400 dark:border-slate-700")}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
                    <StateChip u={u} />
                  </div>
                  {app.exists && (
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      {app.active ? "Until " : "Ended on "}{formatDateShort(app.expiresAt)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {MANUAL_GRANT_MONTHS.map((m) => (
                      <button key={m} onClick={() => manualGrant(u, m)} disabled={busyKey === u.uid + ":acc"} className={btnGhost}>+{m} mo</button>
                    ))}
                    {app.exists && <button onClick={() => removeAccess(u)} disabled={busyKey === u.uid + ":acc"} className={btnRed}>Remove</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── PRACTICE PENDING ───────────── */}
      {tab === "practice" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">💳 Pending — Practice Questions ({practicePending.length})</p>
          {practicePending.length === 0 && <p className="py-8 text-center text-slate-400">No pending practice payments. 🎉</p>}
          {practicePending.map(({ u, p }) => (
            <PendingCard
              key={u.uid + p.referenceCode}
              u={u}
              p={p}
              approveLabel="✅ Approve"
              onApprove={() => approvePractice(u, p)}
              onReject={() => rejectPractice(u, p)}
            />
          ))}
        </div>
      )}

      {/* ───────────── ACCESS PENDING ───────────── */}
      {tab === "access" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">⏱ Pending — App Access ({accessPending.length})</p>
          {accessPending.length === 0 && <p className="py-6 text-center text-slate-400">No pending App Access payments. 🎉</p>}
          {accessPending.map(({ u, p }) => {
            const months = LEGACY_ACCESS_MONTHS[p.plan];
            return (
              <PendingCard
                key={u.uid + p.referenceCode}
                u={u}
                p={p}
                approveLabel={"✅ Approve " + (months ? months + " mo" : "")}
                onApprove={() => approveAccess(u, p)}
                onReject={() => rejectAccess(u, p)}
              />
            );
          })}

          <p className="pt-3 text-sm font-semibold text-navy-900 dark:text-slate-100">Active App Access ({activeSubscribers.length})</p>
          {activeSubscribers.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No one has App Access yet.</p>}
          {activeSubscribers.map((u) => {
            const app = getAppAccessInfo(u);
            return (
              <div key={u.uid} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || u.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.active ? formatTimeLeft(app.msLeft) + " left · until " : "Ended on "}{formatDateShort(app.expiresAt)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <button onClick={() => manualGrant(u, 1)} disabled={busyKey === u.uid + ":acc"} className={btnGhost}>+1 mo</button>
                  <button onClick={() => removeAccess(u)} disabled={busyKey === u.uid + ":acc"} className={btnRed}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── TRIAL CRUD ───────────── */}
      {tab === "trial" && users !== null && !error && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {[["all", "All"], ["trial", "On trial"], ["expired", "Expired"], ["none", "No trial yet"], ["paid", "Paid/Member"]].map(([id, label]) => (
              <button key={id} onClick={() => setTrialFilter(id)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (trialFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">{trialRows.length} user(s)</p>

          {trialRows.map((u) => {
            const tr = getTrialInfo(u);
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <StateChip u={u} />
                </div>
                {tr.exists && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {tr.active ? "Trial until " : "Trial ended on "}{formatDateTime(tr.endsAt)}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button onClick={() => grantTrial(u)} disabled={busyKey === u.uid + ":trial"} className={btnGreen}>{tr.exists ? "↺ Restart " + TRIAL_DAYS + "d" : "＋ Grant " + TRIAL_DAYS + "d"}</button>
                  <button onClick={() => extendTrial(u, 1)} disabled={busyKey === u.uid + ":trial"} className={btnGhost}>+1 day</button>
                  <button onClick={() => extendTrial(u, 3)} disabled={busyKey === u.uid + ":trial"} className={btnGhost}>+3 days</button>
                  {tr.exists && tr.active && <button onClick={() => endTrial(u)} disabled={busyKey === u.uid + ":trial"} className={btnRed}>End</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── RA 10863 (CL) + EXPIRING ───────────── */}
      {tab === "cl" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Level 1 is free for everyone. Levels 2–5 unlock with the All Access promo (₱{PROMO_PLAN.price}, {PROMO_PLAN.days} days). Old lifetime owners stay unlocked.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["all", "All"], ["paid", "Unlocked"], ["expired", "Expired"], ["none", "Not purchased"]].map(([id, label]) => (
              <button key={id} onClick={() => setClFilter(id)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (clFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">{clRows.length} user(s)</p>

          {clRows.map((u) => {
            const cs = getSubjectInfo(u, "CL");
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + (cs.active ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" : cs.owned ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>
                    {cs.active ? (cs.lifetime ? "♾️ Lifetime" : "👑 Active") : cs.owned ? "⏳ Expired" : "Not purchased"}
                  </span>
                </div>
                {cs.owned && !cs.lifetime && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {cs.active ? "Active until " : "Expired on "}{formatDateTime(cs.expiresAt)}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!cs.owned && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnGhost + " border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"}>👑 Unlock CL (4 mo)</button>}
                  {cs.owned && !cs.lifetime && <button onClick={() => extendSubject(u, "CL", 1)} disabled={busyKey === u.uid + ":CL"} className={btnGhost}>+1 mo</button>}
                  {cs.owned && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnRed}>Remove</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── EXPIRING SOON ───────────── */}
      {tab === "expiring" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            App Access or subjects ending within 7 days. Tap “Copy reminder” and paste it into Messenger or SMS.
          </p>
          {expiringRows.length === 0 && <p className="py-8 text-center text-slate-400">Nobody is expiring in the next 7 days. 🎉</p>}
          {expiringRows.map(({ u, items }) => (
            <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
              <p className="truncate text-xs text-slate-400">{u.email}</p>
              <ul className="mt-2 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                {items.map((i) => (
                  <li key={i.label}>{i.label} · ends {formatDateShort(i.endsAt)} ({formatTimeLeft(i.endsAt - serverNow())} left)</li>
                ))}
              </ul>
              <button onClick={() => copyReminder(u, items)} className={btnGreen + " mt-2"}>📋 Copy reminder</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
