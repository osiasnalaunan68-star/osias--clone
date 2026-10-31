import { useMemo, useState } from "react";
import { SUBJECT_LABELS } from "../payments";
import { getAccess, serverNow, toMs, DAY_MS, getSubjectInfo } from "../access";

// Admin Overview — read-only dashboard. Walang bagong Firestore read/write:
// kino-compute lang mula sa `users` array na na-load na ng AdminPanel.
// Share mode = para sa screenshot (FB post). Naka-mask ang email, nakatago
// ang pending payments, at (optional) ang revenue.

const APP_NAME = "CuBLE";
const SUBJECT_CODES = ["CL", "TL", "CDP", "PC", "TCP"];
const CHART_DAYS = 14;

const STATUS_ROWS = [
  { key: "paid", label: "Paid access", light: "bg-gold-500", dark: "dark:bg-gold-400" },
  { key: "trial", label: "On free trial", light: "bg-navy-700", dark: "dark:bg-sky-400" },
  { key: "expired", label: "Trial or access ended", light: "bg-slate-400", dark: "dark:bg-slate-500" },
  { key: "none", label: "No trial yet", light: "bg-slate-300", dark: "dark:bg-slate-600" },
];

// os****68@gmail.com — unang 2 + huling 2 ng pangalan sa email, kita ang domain.
export function maskEmail(email) {
  if (!email || email.indexOf("@") < 1) return email || "";
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length <= 4) return local.slice(0, 1) + "****" + domain;
  return local.slice(0, 2) + "****" + local.slice(-2) + domain;
}

function accessKey(u) {
  const a = getAccess(u);
  if (a.state === "expired" && !a.trial.exists) return "none";
  return a.state;
}

function dayKey(d) {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function shortDate(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch (_) {
    return "";
  }
}

function ago(ms, now) {
  if (!ms) return "never";
  const m = Math.floor((now - ms) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

const CHIP_SLATE = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
const CHIP_PAID = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
const STATUS_CHIP = {
  paid: ["Paid", CHIP_PAID],
  member: ["Paid", CHIP_PAID],
  trial: ["Trial", "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"],
  expired: ["Ended", CHIP_SLATE],
  none: ["No trial", CHIP_SLATE],
};

const NEW_FILTERS = [["24h", "24 hrs", 1], ["7d", "7 days", 7], ["30d", "30 days", 30], ["all", "All", null]];

function compute(users) {
  const now = serverNow();
  const members = users.filter((u) => !u.isAdmin);

  const days = [];
  const dayIndex = {};
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS);
    dayIndex[dayKey(d)] = days.length;
    days.push({ ms: d.getTime(), count: 0 });
  }

  const status = { paid: 0, trial: 0, expired: 0, none: 0 };
  const subjects = {};
  SUBJECT_CODES.forEach((c) => { subjects[c] = 0; });

  let active7 = 0, new7 = 0, new30 = 0, revenue = 0, payers = 0;

  members.forEach((u) => {
    const seen = toMs(u.lastSeenAt);
    if (seen && now - seen <= 7 * DAY_MS) active7++;

    const created = toMs(u.createdAt);
    if (created) {
      const age = now - created;
      if (age <= 7 * DAY_MS) new7++;
      if (age <= 30 * DAY_MS) new30++;
      const k = dayKey(new Date(created));
      if (k in dayIndex) days[dayIndex[k]].count++;
    }

    const key = accessKey(u);
    if (key === "paid" || key === "member") status.paid++;
    else if (key === "trial") status.trial++;
    else if (key === "expired") status.expired++;
    else status.none++;

    // Count only ACTIVE subjects (expired ones no longer count as subscribed).
    SUBJECT_CODES.forEach((c) => { if (getSubjectInfo(u, c, now).active) subjects[c]++; });

    // Revenue: bayad lang (price > 0). Hindi kasama ang manual grant / migration.
    let spent = 0;
    [].concat(u.paymentHistory || [], u.appAccessHistory || []).forEach((h) => {
      const p = Number(h && h.price) || 0;
      if (p > 0 && h.method !== "manual") spent += p;
    });
    if (spent > 0) { revenue += spent; payers++; }
  });

  // Lahat ng user (pinakabago muna). Ang walang createdAt ay nasa dulo.
  const all = members
    .map((u) => ({ u, created: toMs(u.createdAt), seen: toMs(u.lastSeenAt), key: accessKey(u) }))
    .sort((a, b) => (b.created || 0) - (a.created || 0));
  const recent = all.filter((r) => r.created).slice(0, 5);

  const pendingPractice = users.reduce((n, u) => n + (u.pendingPurchases || []).length, 0);
  const pendingAccess = users.reduce((n, u) => n + (u.pendingAccess || []).length, 0);

  return {
    now, total: members.length, active7, new7, new30, status, subjects,
    days, revenue, payers, recent, all, pendingPractice, pendingAccess,
  };
}

function Bar({ label, sub, value, max, barClass, trackClass, labelClass }) {
  const pct = max > 0 && value > 0 ? Math.max(3, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
        <span className={"min-w-0 truncate " + labelClass}>
          {label}
          {sub && <span className="ml-1.5 text-xs opacity-60">{sub}</span>}
        </span>
        <span className="flex-shrink-0 font-semibold tabular-nums">{value}</span>
      </div>
      <div className={"h-2.5 w-full overflow-hidden rounded-full " + trackClass}>
        <div className={"h-full rounded-full " + barClass} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

export default function AdminOverview({ users }) {
  const [share, setShare] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [newFilter, setNewFilter] = useState("7d");
  const [shown, setShown] = useState(20);
  const s = useMemo(() => compute(users), [users]);
  const inRange = (r, d) => d == null || (r.created && s.now - r.created <= d * DAY_MS);
  const newCounts = Object.fromEntries(NEW_FILTERS.map(([id, , d]) => [id, s.all.filter((r) => inRange(r, d)).length]));
  const newList = s.all.filter((r) => inRange(r, NEW_FILTERS.find((f) => f[0] === newFilter)[2]));

  // Sa share mode, light theme lang (malinis sa screenshot kahit dark ang app).
  const t = (light, dark) => (share ? light : light + " " + dark);

  const revenueVisible = !share || showRevenue;
  const maxStatus = Math.max(1, ...Object.values(s.status));
  const maxSubject = Math.max(1, ...Object.values(s.subjects));
  const maxDay = Math.max(1, ...s.days.map((d) => d.count));
  const payRate = s.total > 0 ? Math.round((s.payers / s.total) * 100) : 0;

  const track = t("bg-slate-100", "dark:bg-slate-700");
  const labelCls = t("text-slate-700", "dark:text-slate-300");
  const barNavy = t("bg-navy-700", "dark:bg-sky-400");
  const muted = t("text-slate-500", "dark:text-slate-400");
  const asOf = new Date(s.now).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

  const switchBtn = (on) =>
    "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors " +
    (on ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600");
  const switchKnob = (on) =>
    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all " + (on ? "left-[22px]" : "left-0.5");

  return (
    <div className="space-y-3">
      {/* Controls (labas ng card — hindi kasama sa screenshot) */}
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">Share mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {share
                ? "Emails are masked and pending items are hidden. Screenshot the card below."
                : "Off: full names, emails, and pending items are visible (for you only)."}
            </p>
          </div>
          <button onClick={() => setShare(!share)} className={switchBtn(share)} role="switch" aria-checked={share} aria-label="Share mode">
            <span className={switchKnob(share)} />
          </button>
        </div>
        {share && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300">Show revenue</p>
            <button onClick={() => setShowRevenue(!showRevenue)} className={switchBtn(showRevenue)} role="switch" aria-checked={showRevenue} aria-label="Show revenue">
              <span className={switchKnob(showRevenue)} />
            </button>
          </div>
        )}
      </div>

      {/* Report card (ito ang i-screenshot) */}
      <div className={"overflow-hidden rounded-2xl border " + t("border-slate-200 bg-white text-slate-900", "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100")}>
        <div className="h-1.5 bg-gold-500" />
        <div className="space-y-6 p-5">
          <div>
            <h2 className={"font-serif text-xl font-bold " + t("text-navy-900", "dark:text-slate-50")}>{APP_NAME} user overview</h2>
            <p className={"text-xs " + muted}>As of {asOf}</p>
          </div>

          {/* Headline numbers */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {[
              ["Total users", s.total],
              ["Active in 7 days", s.active7],
              ["New this week", s.new7],
              ["New in 30 days", s.new30],
            ].map(([label, value]) => (
              <div key={label}>
                <p className={"font-serif text-3xl font-bold tabular-nums " + t("text-navy-900", "dark:text-slate-50")}>{value}</p>
                <p className={"text-sm " + muted}>{label}</p>
              </div>
            ))}
          </div>

          {/* Access status */}
          <div className="space-y-3">
            <p className={"text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>Access status</p>
            {STATUS_ROWS.map((r) => (
              <Bar
                key={r.key}
                label={r.label}
                value={s.status[r.key]}
                max={maxStatus}
                barClass={t(r.light, r.dark)}
                trackClass={track}
                labelClass={labelCls}
              />
            ))}
          </div>

          {/* Subscribers per subject */}
          <div className="space-y-3">
            <p className={"text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>Practice subscribers per subject</p>
            {SUBJECT_CODES.map((code) => {
              return (
                <Bar
                  key={code}
                  label={code}
                  sub={SUBJECT_LABELS[code] || ""}
                  value={s.subjects[code]}
                  max={maxSubject}
                  barClass={barNavy}
                  trackClass={track}
                  labelClass={labelCls + " font-medium"}
                />
              );
            })}
          </div>

          {/* Sign-ups growth */}
          <div>
            <p className={"mb-3 text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>New sign-ups, last {CHART_DAYS} days</p>
            <div className="flex h-24 items-end gap-1">
              {s.days.map((d) => (
                <div key={d.ms} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-0.5">
                  {d.count > 0 && <span className={"text-[10px] font-semibold tabular-nums " + muted}>{d.count}</span>}
                  <div
                    className={"w-full rounded-t " + (d.count > 0 ? barNavy : t("bg-slate-200", "dark:bg-slate-700"))}
                    style={{ height: d.count > 0 ? Math.max(6, Math.round((d.count / maxDay) * 100)) + "%" : "3px" }}
                  />
                </div>
              ))}
            </div>
            <div className={"mt-1.5 flex justify-between text-[11px] " + muted}>
              <span>{shortDate(s.days[0].ms)}</span>
              <span>{shortDate(s.days[s.days.length - 1].ms)}</span>
            </div>
          </div>

          {/* Revenue (optional sa share mode) */}
          {revenueVisible && (
            <div className={"rounded-xl border p-4 " + t("border-gold-100 bg-gold-50", "dark:border-slate-700 dark:bg-slate-800")}>
              <p className={"text-sm " + muted}>Estimated revenue</p>
              <p className={"font-serif text-3xl font-bold tabular-nums " + t("text-navy-900", "dark:text-slate-50")}>
                ₱{s.revenue.toLocaleString()}
              </p>
              <p className={"mt-1 text-xs " + muted}>
                {s.payers} paying user{s.payers === 1 ? "" : "s"} · {payRate}% of all users
              </p>
            </div>
          )}

          {/* New users: lahat ng user, may filter (hindi lalabas sa share mode) */}
          {!share && (
            <div>
              <p className="mb-2 text-sm font-semibold text-navy-900 dark:text-slate-100">New users</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {NEW_FILTERS.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => { setNewFilter(id); setShown(20); }}
                    className={"rounded-full border px-3 py-1 text-xs font-semibold " + (newFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}
                  >
                    {label} ({newCounts[id]})
                  </button>
                ))}
              </div>
              {newList.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No users in this range.</p>}
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {newList.slice(0, shown).map(({ u, created, seen, key }) => {
                  const chip = STATUS_CHIP[key] || STATUS_CHIP.none;
                  return (
                    <li key={u.uid} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{u.fullName || "(no name)"}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                        <p className="text-[11px] text-slate-400">{created ? "Joined " + shortDate(created) : "Joined: unknown"} · seen {ago(seen, s.now)}</p>
                      </div>
                      <span className={"flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold " + chip[1]}>{chip[0]}</span>
                    </li>
                  );
                })}
              </ul>
              {newList.length > shown && (
                <button onClick={() => setShown(shown + 20)} className="mt-2 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  Show more ({newList.length - shown} left)
                </button>
              )}
            </div>
          )}

          {/* Recent sign-ups (compact, para sa share mode / screenshot) */}
          {share && s.recent.length > 0 && (
            <div>
              <p className={"mb-2 text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>Recent sign-ups</p>
              <ul className={"divide-y " + t("divide-slate-100", "dark:divide-slate-700")}>
                {s.recent.map(({ u, created }) => (
                  <li key={u.uid} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.fullName || "(no name)"}</p>
                      <p className={"truncate text-xs " + muted}>{share ? maskEmail(u.email) : u.email}</p>
                    </div>
                    <span className={"flex-shrink-0 text-xs " + muted}>{shortDate(created)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pending — admin lang, hindi lalabas sa share mode */}
          {!share && (s.pendingPractice > 0 || s.pendingAccess > 0) && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              ⏳ Pending approvals: {s.pendingPractice} practice · {s.pendingAccess} access
            </div>
          )}

          <p className={"border-t pt-3 text-[11px] " + t("border-slate-100 text-slate-400", "dark:border-slate-700 dark:text-slate-500")}>
            Counts come from the app's actual user records. Admin accounts are excluded.
          </p>
        </div>
      </div>
    </div>
  );
}
