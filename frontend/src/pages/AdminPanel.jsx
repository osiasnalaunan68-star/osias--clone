import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteField, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { PLANS, PAYMENT_METHODS } from "../payments";
import {
  ACCESS_PLANS, TRIAL_DAYS, DAY_MS, serverNow, getTrialInfo, getAppAccessInfo,
  getAccess, addMonths, formatTimeLeft, formatDateShort, getClTrialInfo, CL_TRIAL_DAYS, CL_LIFETIME_PRICE,
} from "../access";

const SUBJECT_CODES = ["CL", "CDP", "TL", "PC", "TCP"];
const SUBJECT_LABELS = {
  CL: "RA 10863 (Customs Law)",
  ...Object.fromEntries(
    PLANS.filter((p) => p.id !== "BUNDLE" && p.id !== "ALL").map((p) => [p.id, p.label])
  ),
};
const METHOD_LABELS = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label]));
const ALL_PLAN_LABELS = Object.fromEntries([...PLANS, ...ACCESS_PLANS].map((p) => [p.id, p.label]));

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

// Parehong pattern para sa RA 10863 (CL): paid (lifetime) > trial > expired > none.
function clAccessKey(u) {
  if (u?.subscriptions?.CL) return "paid";
  const t = getClTrialInfo(u);
  if (!t.exists) return "none";
  return t.active ? "trial" : "expired";
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
  const [tab, setTab] = useState("users");
  const [trialFilter, setTrialFilter] = useState("all");
  const [clFilter, setClFilter] = useState("all");

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
      alert("May error. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  // ── Practice questions ──────────────────────────────────────────────
  const toggleSubject = async (u, code) => {
    const nextValue = !u.subscriptions?.[code];
    const payload = { ["subscriptions." + code]: nextValue };
    const patch = { subscriptions: { ...u.subscriptions, [code]: nextValue } };
    if (nextValue) {
      const remaining = (u.pendingPurchases || []).filter((p) => !(p.subjects || []).includes(code));
      payload.pendingPurchases = remaining;
      patch.pendingPurchases = remaining;
    }
    await run(u.uid + ":" + code, u, payload, patch);
  };

  const setTriage = (u, status) =>
    run(u.uid + ":triage", u, { triageStatus: status }, { triageStatus: status });

  const approvePractice = async (u, p) => {
    if (!window.confirm("I-approve ang " + (ALL_PLAN_LABELS[p.plan] || p.plan) + " ₱" + p.price + " para kay " + (u.fullName || u.email) + "?")) return;
    const subjects = p.subjects || [];
    const remaining = (u.pendingPurchases || []).filter((x) => x.referenceCode !== p.referenceCode);
    const payload = {
      pendingPurchases: remaining,
      triageStatus: "subscribed",
      paymentHistory: arrayUnion({ kind: "practice", plan: p.plan, price: p.price, method: p.method, referenceCode: p.referenceCode, approvedAt: Date.now() }),
    };
    const subsPatch = {};
    subjects.forEach((c) => { payload["subscriptions." + c] = true; subsPatch[c] = true; });
    await run(u.uid + ":pp:" + p.referenceCode, u, payload, {
      pendingPurchases: remaining,
      triageStatus: "subscribed",
      subscriptions: { ...u.subscriptions, ...subsPatch },
    });
  };

  const rejectPractice = async (u, p) => {
    if (!window.confirm("Tanggalin ang pending na ito (ref " + p.referenceCode + ")?")) return;
    const remaining = (u.pendingPurchases || []).filter((x) => x.referenceCode !== p.referenceCode);
    await run(u.uid + ":pp:" + p.referenceCode, u, { pendingPurchases: remaining }, { pendingPurchases: remaining });
  };

  // ── App Access (buwanang plan) ──────────────────────────────────────
  // Kapag may active pa, dinadagdag sa dulo ng natitirang oras (hindi nasasayang).
  const grantAccess = async (u, plan, pendingItem) => {
    const now = serverNow();
    const cur = getAppAccessInfo(u, now);
    const base = cur.active ? cur.expiresAt : now;
    const expiresAt = addMonths(base, plan.months);
    const appAccess = { plan: plan.id, expiresAt };
    const payload = {
      appAccess,
      appAccessHistory: arrayUnion({ plan: plan.id, price: plan.price, referenceCode: pendingItem ? pendingItem.referenceCode : "MANUAL", method: pendingItem ? pendingItem.method : "manual", approvedAt: now, expiresAt }),
    };
    const patch = { appAccess };
    if (pendingItem) {
      const remaining = (u.pendingAccess || []).filter((x) => x.referenceCode !== pendingItem.referenceCode);
      payload.pendingAccess = remaining;
      patch.pendingAccess = remaining;
    }
    await run(u.uid + ":acc", u, payload, patch);
  };

  const approveAccess = async (u, p) => {
    const plan = ACCESS_PLANS.find((x) => x.id === p.plan);
    if (!plan) { alert("Hindi kilalang plan: " + p.plan); return; }
    if (!window.confirm("I-approve ang " + plan.months + " buwan (₱" + plan.price + ") para kay " + (u.fullName || u.email) + "?")) return;
    await grantAccess(u, plan, p);
  };

  const manualGrant = async (u, plan) => {
    if (!window.confirm("Bigyan si " + (u.fullName || u.email) + " ng " + plan.months + " buwan na App Access?")) return;
    await grantAccess(u, plan, null);
  };

  const removeAccess = async (u) => {
    if (!window.confirm("Tanggalin ang App Access ni " + (u.fullName || u.email) + "?")) return;
    await run(u.uid + ":acc", u, { appAccess: deleteField() }, { appAccess: undefined });
  };

  const rejectAccess = async (u, p) => {
    if (!window.confirm("Tanggalin ang pending na ito (ref " + p.referenceCode + ")?")) return;
    const remaining = (u.pendingAccess || []).filter((x) => x.referenceCode !== p.referenceCode);
    await run(u.uid + ":acc:" + p.referenceCode, u, { pendingAccess: remaining }, { pendingAccess: remaining });
  };

  // ── Trial CRUD ──────────────────────────────────────────────────────
  // Laging nire-reset ang startedAt sa "ngayon" at inaayos ang `days` para
  // tama ang natitirang oras. Oras ng server (serverNow), hindi ng phone.
  const writeTrial = (u, days) => {
    const startedAt = serverNow();
    return run(u.uid + ":trial", u, { trial: { startedAt: Timestamp.fromMillis(startedAt), days } }, { trial: { startedAt, days } });
  };

  const grantTrial = (u) => {
    if (!window.confirm("Simulan ulit ang " + TRIAL_DAYS + "-day trial ni " + (u.fullName || u.email) + " mula ngayon?")) return;
    return writeTrial(u, TRIAL_DAYS);
  };

  const extendTrial = (u, extraDays) => {
    const left = getTrialInfo(u).msLeft / DAY_MS;
    return writeTrial(u, left + extraDays);
  };

  const endTrial = (u) => {
    if (!window.confirm("Tapusin agad ang trial ni " + (u.fullName || u.email) + "?")) return;
    return writeTrial(u, 0);
  };

  // ── RA 10863 (CL) Trial CRUD — kaparehong logic ng trial sa itaas ────
  const writeClTrial = (u, days) => {
    const startedAt = serverNow();
    return run(u.uid + ":cltrial", u, { clTrial: { startedAt: Timestamp.fromMillis(startedAt), days } }, { clTrial: { startedAt, days } });
  };

  const grantClTrial = (u) => {
    if (!window.confirm("Simulan ulit ang " + CL_TRIAL_DAYS + "-day CL trial ni " + (u.fullName || u.email) + " mula ngayon?")) return;
    return writeClTrial(u, CL_TRIAL_DAYS);
  };

  const extendClTrial = (u, extraDays) => {
    const left = getClTrialInfo(u).msLeft / DAY_MS;
    return writeClTrial(u, left + extraDays);
  };

  const endClTrial = (u) => {
    if (!window.confirm("Tapusin agad ang CL trial ni " + (u.fullName || u.email) + "?")) return;
    return writeClTrial(u, 0);
  };

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

  const TABS = [
    { id: "users", label: "👥 Users" },
    { id: "practice", label: "💳 Practice", count: rawPracticeCount },
    { id: "access", label: "⏱ Access", count: rawAccessCount },
    { id: "trial", label: "🎁 Trial" },
    { id: "cl", label: "📜 CL" },
  ];

  const btn = "min-h-[34px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ";
  const btnGhost = btn + "border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700";
  const btnGreen = btn + "bg-emerald-600 text-white active:bg-emerald-700";
  const btnRed = btn + "border border-red-200 text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400";

  const PendingCard = ({ u, p, onApprove, onReject, approveLabel }) => (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(walang pangalan)"}</p>
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
          Hiwalay ang pending ng Practice Questions at ng App Access, at may sariling Trial panel.
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
          placeholder="Maghanap ng pangalan o email..."
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-bold">⚠️ Hindi ma-load ang users</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ───────────── USERS ───────────── */}
      {tab === "users" && users !== null && !error && (
        <div className="space-y-3">
          {filtered.length === 0 && <p className="py-8 text-center text-slate-400">Walang nahanap na user.</p>}
          {filtered.map((u) => {
            const triage = defaultTriage(u);
            const t = TRIAGE[triage] || TRIAGE.none;
            const app = getAppAccessInfo(u);
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(walang pangalan)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={"flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold " + t.chip}>
                    <span className={"h-2 w-2 rounded-full " + t.dot} aria-hidden />
                    {t.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SUBJECT_CODES.map((code) => {
                    const unlocked = !!u.subscriptions?.[code];
                    const busy = busyKey === u.uid + ":" + code;
                    return (
                      <button
                        key={code}
                        onClick={() => toggleSubject(u, code)}
                        disabled={busy}
                        title={SUBJECT_LABELS[code]}
                        className={btn + (unlocked ? "bg-emerald-600 text-white active:bg-emerald-700" : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-900/40 dark:text-slate-300")}
                      >
                        {code} {unlocked ? "✓" : "✕"}
                      </button>
                    );
                  })}
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
                    <StateChip u={u} />
                  </div>
                  {app.exists && (
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      {app.active ? "Hanggang " : "Nagtapos noong "}{formatDateShort(app.expiresAt)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {ACCESS_PLANS.map((p) => (
                      <button key={p.id} onClick={() => manualGrant(u, p)} disabled={busyKey === u.uid + ":acc"} className={btnGhost}>+{p.months} mo</button>
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
          {practicePending.length === 0 && <p className="py-8 text-center text-slate-400">Walang pending na practice payment. 🎉</p>}
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
          {accessPending.length === 0 && <p className="py-6 text-center text-slate-400">Walang pending na App Access payment. 🎉</p>}
          {accessPending.map(({ u, p }) => {
            const plan = ACCESS_PLANS.find((x) => x.id === p.plan);
            return (
              <PendingCard
                key={u.uid + p.referenceCode}
                u={u}
                p={p}
                approveLabel={"✅ Approve " + (plan ? plan.months + " mo" : "")}
                onApprove={() => approveAccess(u, p)}
                onReject={() => rejectAccess(u, p)}
              />
            );
          })}

          <p className="pt-3 text-sm font-semibold text-navy-900 dark:text-slate-100">Active App Access ({activeSubscribers.length})</p>
          {activeSubscribers.length === 0 && <p className="py-4 text-center text-sm text-slate-400">Wala pang may App Access.</p>}
          {activeSubscribers.map((u) => {
            const app = getAppAccessInfo(u);
            return (
              <div key={u.uid} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || u.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.active ? formatTimeLeft(app.msLeft) + " left · hanggang " : "Nagtapos noong "}{formatDateShort(app.expiresAt)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <button onClick={() => manualGrant(u, ACCESS_PLANS[0])} disabled={busyKey === u.uid + ":acc"} className={btnGhost}>+1 mo</button>
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
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(walang pangalan)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <StateChip u={u} />
                </div>
                {tr.exists && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {tr.active ? "Trial hanggang " : "Trial nagtapos noong "}{formatDateTime(tr.endsAt)}
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

      {/* ───────────── RA 10863 (CL) TRIAL + LIFETIME ───────────── */}
      {tab === "cl" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">7-day free trial, tapos naka-lock hanggang bumili ng lifetime (₱{CL_LIFETIME_PRICE}).</p>
          <div className="flex flex-wrap gap-1.5">
            {[["all", "All"], ["trial", "On trial"], ["expired", "Expired"], ["none", "No trial yet"], ["paid", "Lifetime (paid)"]].map(([id, label]) => (
              <button key={id} onClick={() => setClFilter(id)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (clFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">{clRows.length} user(s)</p>

          {clRows.map((u) => {
            const ct = getClTrialInfo(u);
            const paid = !!u.subscriptions?.CL;
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(walang pangalan)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + (paid ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" : ct.active ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>
                    {paid ? "👑 Lifetime" : ct.exists ? (ct.active ? "🎁 Trial" : "⏳ Expired") : "No trial yet"}
                  </span>
                </div>
                {ct.exists && !paid && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {ct.active ? "CL trial hanggang " : "CL trial nagtapos noong "}{formatDateTime(ct.endsAt)}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!paid && <button onClick={() => grantClTrial(u)} disabled={busyKey === u.uid + ":cltrial"} className={btnGreen}>{ct.exists ? "↺ Restart " + CL_TRIAL_DAYS + "d" : "＋ Grant " + CL_TRIAL_DAYS + "d"}</button>}
                  {!paid && <button onClick={() => extendClTrial(u, 1)} disabled={busyKey === u.uid + ":cltrial"} className={btnGhost}>+1 day</button>}
                  {!paid && ct.exists && ct.active && <button onClick={() => endClTrial(u)} disabled={busyKey === u.uid + ":cltrial"} className={btnRed}>End</button>}
                  {!paid && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnGhost + " border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"}>👑 Mark Lifetime (₱{CL_LIFETIME_PRICE})</button>}
                  {paid && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnRed}>Remove Lifetime</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
