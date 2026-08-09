import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PLANS, PAYMENT_METHODS } from "../payments";

const SUBJECT_CODES = ["CL", "CDP", "TL", "PC"];
const SUBJECT_LABELS = Object.fromEntries(
  PLANS.filter((p) => p.id !== "BUNDLE").map((p) => [p.id, p.label])
);
const METHOD_LABELS = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label]));

const TRIAGE = {
  pending: { label: "Pending", dot: "bg-amber-500", chip: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400" },
  none: { label: "None", dot: "bg-slate-400", chip: "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400" },
  subscribed: { label: "Subscribed", dot: "bg-emerald-500", chip: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400" },
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

export default function AdminPanel() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [busyKey, setBusyKey] = useState(null);

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

  const toggleSubject = async (u, code) => {
    const key = u.uid + ":" + code;
    const nextValue = !u.subscriptions?.[code];
    setBusyKey(key);
    try {
      const ref = doc(db, "users", u.uid);
      const writePayload = { ["subscriptions." + code]: nextValue };
      let remainingPending = u.pendingPurchases || [];
      if (nextValue) {
        remainingPending = remainingPending.filter((p) => !(p.subjects || []).includes(code));
        writePayload.pendingPurchases = remainingPending;
      }
      await updateDoc(ref, writePayload);
      patchUser(u.uid, {
        subscriptions: { ...u.subscriptions, [code]: nextValue },
        pendingPurchases: remainingPending,
      });
    } catch (err) {
      console.warn("toggleSubject failed:", err);
      alert("May error sa pag-toggle. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  const setTriage = async (u, status) => {
    const key = u.uid + ":triage";
    setBusyKey(key);
    try {
      const ref = doc(db, "users", u.uid);
      await updateDoc(ref, { triageStatus: status });
      patchUser(u.uid, { triageStatus: status });
    } catch (err) {
      console.warn("setTriage failed:", err);
      alert("May error sa pag-set ng status. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-slate-50">👑 Admin Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          I-manage ang subscriptions at payment status ng users dito na, hindi na kailangan pumunta sa Firebase Console.
        </p>
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

      {users !== null && !error && filtered.length === 0 && (
        <p className="py-8 text-center text-slate-400">Walang nahanap na user.</p>
      )}

      <div className="space-y-3">
        {filtered.map((u) => {
          const triage = defaultTriage(u);
          const t = TRIAGE[triage] || TRIAGE.none;
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
                      className={"min-h-[34px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 " + (unlocked ? "bg-emerald-600 text-white active:bg-emerald-700" : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-900/40 dark:text-slate-300")}
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

              {(u.pendingPurchases || []).length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending Purchases</p>
                  {u.pendingPurchases.map((p, i) => {
                    const planLabel = PLANS.find((pl) => pl.id === p.plan)?.label || p.plan;
                    return (
                      <div key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-xs dark:bg-amber-950/20">
                        <p className="font-semibold text-navy-900 dark:text-amber-300">
                          {planLabel} · ₱{p.price} · {METHOD_LABELS[p.method] || p.method}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          Ref: {p.referenceCode} · {formatDateTime(p.requestedAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
