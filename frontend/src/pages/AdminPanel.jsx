import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteField, Timestamp, runTransaction, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import AdminOverview from "./AdminOverview";
import { SUBJECT_LABELS, PAYMENT_METHODS, PROMO_PLAN } from "../payments";
import {
  TRIAL_DAYS, DAY_MS, serverNow, getTrialInfo, getAppAccessInfo,
  getAccess, formatTimeLeft, formatDateShort, getSubjectInfo,
} from "../access";

// Admin-only. One bundle now (PROMO_PLAN = All Access, ₱{price} / {days} days),
// so there is no more per-subject admin UI — granting/removing App Access also
// carries the subject flags along (see restartAccess / manualGrant below).
const SUBJECT_CODES = ["CL", "CDP", "TL", "PC", "TCP"];
// Months for old App Access requests that may still be waiting in pendingAccess.
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
  const [monthsInput, setMonthsInput] = useState({}); // uid -> typed string
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadUsers = async () => {
    setError(null);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.email || "").localeCompare(b.fullName || b.email || ""));
      setUsers(list);
      return list;
    } catch (err) {
      console.warn("AdminPanel load failed:", err);
      setError(err?.message || String(err));
      setUsers([]);
      return [];
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

  const setTriage = (u, status) =>
    run(u.uid + ":triage", u, { triageStatus: status }, { triageStatus: status });

  // ── Pending — All Access promo purchases (pendingPurchases) ──────────
  const approvePractice = async (u, p) => {
    const plan = p.plan === PROMO_PLAN.id ? PROMO_PLAN : undefined;
    if (!plan) { alert("Unknown plan: " + p.plan + ". Nothing was changed."); return; }
    const diff = plan.price !== p.price ? "⚠️ Price mismatch: the user paid ₱" + p.price + " but the plan is now ₱" + plan.price + " (older app version). " : "";
    if (!window.confirm(diff + "Approve " + plan.label + " ₱" + p.price + " for " + (u.fullName || u.email) + "?")) return;
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
        const days = plan.days || 30;
        const span = days * DAY_MS;
        const remaining = (d.pendingPurchases || []).filter((x) => x.referenceCode !== p.referenceCode);

        const subsPatch = {};
        const expPatch = { ...(d.subscriptionExpiry || {}) };
        const upd = {
          pendingPurchases: remaining,
          triageStatus: "subscribed",
          paymentHistory: arrayUnion({ kind: "practice", plan: p.plan, price: p.price, method: p.method, referenceCode: p.referenceCode, approvedAt: now, days }),
        };
        plan.subjects.forEach((code) => {
          const info = getSubjectInfo(d, code, now);
          if (info.lifetime) return; // never shorten a legacy lifetime subject
          const base = info.active ? info.expiresAt : now;
          const end = base + span;
          upd["subscriptions." + code] = true;
          upd["subscriptionExpiry." + code] = end;
          subsPatch[code] = true;
          expPatch[code] = end;
        });

        const curApp = getAppAccessInfo(d, now);
        const appExpiresAt = (curApp.active ? curApp.expiresAt : now) + span;
        upd.appAccess = { plan: p.plan, expiresAt: appExpiresAt };
        upd.appAccessHistory = arrayUnion({ plan: p.plan, price: 0, referenceCode: p.referenceCode, method: "practice-purchase", approvedAt: now, expiresAt: appExpiresAt, days });

        const patch = {
          pendingPurchases: remaining,
          triageStatus: "subscribed",
          subscriptions: { ...(d.subscriptions || {}), ...subsPatch },
          subscriptionExpiry: expPatch,
          appAccess: upd.appAccess,
        };
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
      const cur = getAppAccessInfo(d, now);
      const expiresAt = (cur.active ? cur.expiresAt : now);
      const base = new Date(expiresAt);
      base.setMonth(base.getMonth() + plan.months);
      const newExpiresAt = base.getTime();
      const appAccess = { plan: plan.id, expiresAt: newExpiresAt };
      const write = {
        appAccess,
        appAccessHistory: arrayUnion({ plan: plan.id, price: plan.price, referenceCode: pendingItem ? pendingItem.referenceCode : "MANUAL", method: pendingItem ? pendingItem.method : "manual", approvedAt: now, expiresAt: newExpiresAt }),
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

  // Typeable manual grant: admin types any whole number of months.
  const manualGrant = async (u, months) => {
    if (!window.confirm("Give " + (u.fullName || u.email) + " " + months + " month(s) of App Access?")) return;
    await grantAccess(u, { id: "M" + months, months, price: 0 }, null);
  };

  const doManualGrant = (u) => {
    const raw = (monthsInput[u.uid] ?? "").trim();
    const months = Math.floor(Number(raw));
    if (!raw || !Number.isFinite(months) || months <= 0) {
      alert("Type a whole number of months (1 or more) first.");
      return;
    }
    manualGrant(u, months);
  };

  // Restart: resets App Access + all All-Access subjects to EXACTLY 30 days from
  // now, replacing any remaining time (does not stack). Legacy lifetime subjects
  // are left untouched.
  const restartAccess = async (u) => {
    if (!window.confirm("Restart " + (u.fullName || u.email) + " to a fresh " + PROMO_PLAN.days + " days? Any remaining time will be replaced, not added to.")) return;
    await txn(u.uid + ":acc", u, (d) => {
      const now = serverNow();
      const expiresAt = now + PROMO_PLAN.days * DAY_MS;
      const subsPatch = {};
      const expPatch = { ...(d.subscriptionExpiry || {}) };
      const write = {
        appAccess: { plan: PROMO_PLAN.id, expiresAt },
        appAccessHistory: arrayUnion({ plan: PROMO_PLAN.id, price: 0, referenceCode: "MANUAL-RESTART", method: "manual-restart", approvedAt: now, expiresAt, days: PROMO_PLAN.days }),
      };
      PROMO_PLAN.subjects.forEach((code) => {
        const info = getSubjectInfo(d, code, now);
        if (info.lifetime) return;
        write["subscriptions." + code] = true;
        write["subscriptionExpiry." + code] = expiresAt;
        subsPatch[code] = true;
        expPatch[code] = expiresAt;
      });
      const patch = {
        appAccess: write.appAccess,
        subscriptions: { ...(d.subscriptions || {}), ...subsPatch },
        subscriptionExpiry: expPatch,
      };
      return { write, patch };
    });
  };

  const removeAccess = async (u) => {
    if (!window.confirm("Remove App Access for " + (u.fullName || u.email) + "?")) return;
    await run(u.uid + ":acc", u, { appAccess: deleteField() }, { appAccess: undefined });
  };

  // Bulk restart: every currently-paid (active App Access) user, one click.
  // Same rule as the per-user Restart: exactly PROMO_PLAN.days from now,
  // REPLACES remaining time (does not stack), never touches admins or
  // legacy lifetime subjects. Uses batched writes (not transactions) since
  // this can touch many docs at once; each user's own race window is small
  // because we reload fresh data right before computing who is eligible.
  const restartAllPaid = async () => {
    if (bulkBusy || busyKey) return;
    setBulkBusy(true);
    try {
      const fresh = await loadUsers();
      const now = serverNow();
      const expiresAt = now + PROMO_PLAN.days * DAY_MS;
      const eligible = fresh.filter((u) => !u.isAdmin && getAppAccessInfo(u, now).active);

      if (eligible.length === 0) {
        alert("Walang currently-paid user na ire-restart.");
        return;
      }
      if (!window.confirm(
        "Restart " + eligible.length + " paid user(s) to exactly " + PROMO_PLAN.days + " days from now?\n\n" +
        "Papalitan ang natitirang oras nila (hindi idadagdag). Legacy lifetime subjects ay hindi magagalaw. " +
        "Trial-only, expired, at admin accounts ay hindi kasama."
      )) return;

      const CHUNK = 450; // margin under Firestore's 500-write batch limit
      const patches = {};
      for (let i = 0; i < eligible.length; i += CHUNK) {
        const slice = eligible.slice(i, i + CHUNK);
        const batch = writeBatch(db);
        slice.forEach((u) => {
          const write = {
            appAccess: { plan: PROMO_PLAN.id, expiresAt },
            appAccessHistory: arrayUnion({ plan: PROMO_PLAN.id, price: 0, referenceCode: "BULK-RESTART", method: "manual-restart", approvedAt: now, expiresAt, days: PROMO_PLAN.days }),
          };
          const subsPatch = {};
          const expPatch = { ...(u.subscriptionExpiry || {}) };
          PROMO_PLAN.subjects.forEach((code) => {
            const info = getSubjectInfo(u, code, now);
            if (info.lifetime) return;
            write["subscriptions." + code] = true;
            write["subscriptionExpiry." + code] = expiresAt;
            subsPatch[code] = true;
            expPatch[code] = expiresAt;
          });
          batch.update(doc(db, "users", u.uid), write);
          patches[u.uid] = {
            appAccess: write.appAccess,
            subscriptions: { ...(u.subscriptions || {}), ...subsPatch },
            subscriptionExpiry: expPatch,
          };
        });
        await batch.commit();
      }

      setUsers((prev) => prev.map((u) => (patches[u.uid] ? { ...u, ...patches[u.uid] } : u)));
      alert("✅ Na-restart ang " + eligible.length + " paid user(s) sa " + PROMO_PLAN.days + " days.");
    } catch (err) {
      console.warn("restartAllPaid failed:", err);
      alert("May problema: " + (err?.message || err));
    } finally {
      setBulkBusy(false);
    }
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

  // ── Derived lists ───────────────────────────────────────────────────
  // All pending payments (promo purchases + any leftover legacy App Access
  // requests) in one combined list — there is only one bundle now.
  const pendingRows = useMemo(() => {
    const rows = [];
    filtered.forEach((u) => {
      (u.pendingPurchases || []).forEach((p) => rows.push({ u, p, kind: "practice" }));
      (u.pendingAccess || []).forEach((p) => rows.push({ u, p, kind: "access" }));
    });
    return rows.sort((a, b) => (a.p.requestedAt || 0) - (b.p.requestedAt || 0));
  }, [filtered]);

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

  const rawPendingCount = (users || []).reduce((n, u) => n + (u.pendingPurchases || []).length + (u.pendingAccess || []).length, 0);
  const paidCount = useMemo(() => (users || []).filter((u) => !u.isAdmin && getAppAccessInfo(u).active).length, [users]);

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
    { id: "pending", label: "💳 Pending", count: rawPendingCount },
    { id: "expiring", label: "⏳ Expiring", count: expiringRows.length },
    { id: "trial", label: "🎁 Trial" },
  ];

  const btn = "min-h-[34px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ";
  const btnGhost = btn + "border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700";
  const btnGreen = btn + "bg-emerald-600 text-white active:bg-emerald-700";
  const btnRed = btn + "border border-red-200 text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400";
  const inputCls = "w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-xs font-semibold dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

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
          One All Access bundle (₱{PROMO_PLAN.price} · {PROMO_PLAN.days} days) — grant months, restart to {PROMO_PLAN.days} days, or approve pending payments below.
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
          <div className="rounded-xl border-2 border-gold-400 bg-gold-50 p-3 dark:border-gold-600 dark:bg-slate-800/60">
            <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">🔁 Restart ALL paid users</p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              One click: resets App Access + All Access subjects of every currently-paid user to exactly {PROMO_PLAN.days} days from now. Replaces remaining time (hindi idinadagdag). Hindi kasama ang trial-only, expired, o admin accounts. Lifetime subjects untouched. Hindi apektado ng search box sa itaas.
            </p>
            <button onClick={restartAllPaid} disabled={bulkBusy || !!busyKey} className={btnGreen + " mt-2"}>
              {bulkBusy ? "Restarting…" : "↺ Restart " + PROMO_PLAN.days + "d for all paid (" + paidCount + ")"}
            </button>
          </div>

          {filtered.length === 0 && <p className="py-8 text-center text-slate-400">No users found.</p>}
          {filtered.map((u) => {
            const triage = defaultTriage(u);
            const t = TRIAGE[triage] || TRIAGE.none;
            const app = getAppAccessInfo(u);
            const busy = busyKey === u.uid + ":acc" || bulkBusy;
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">All Access</p>
                    <StateChip u={u} />
                  </div>
                  {app.exists && (
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      {app.active ? "Until " : "Ended on "}{formatDateShort(app.expiresAt)}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={monthsInput[u.uid] ?? ""}
                      onChange={(e) => setMonthsInput((prev) => ({ ...prev, [u.uid]: e.target.value }))}
                      placeholder="mo"
                      aria-label="Months to grant"
                      className={inputCls}
                    />
                    <button onClick={() => doManualGrant(u)} disabled={busy} className={btnGhost}>＋ Grant</button>
                    <button onClick={() => restartAccess(u)} disabled={busy} className={btnGreen}>↺ Restart {PROMO_PLAN.days}d</button>
                    {app.exists && <button onClick={() => removeAccess(u)} disabled={busy} className={btnRed}>Remove</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── PENDING ───────────── */}
      {tab === "pending" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">⏳ Pending approvals ({pendingRows.length})</p>
          {pendingRows.length === 0 && <p className="py-8 text-center text-slate-400">No pending payments. 🎉</p>}
          {pendingRows.map(({ u, p, kind }) => {
            if (kind === "access") {
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
            }
            return (
              <PendingCard
                key={u.uid + p.referenceCode}
                u={u}
                p={p}
                approveLabel="✅ Approve"
                onApprove={() => approvePractice(u, p)}
                onReject={() => rejectPractice(u, p)}
              />
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
