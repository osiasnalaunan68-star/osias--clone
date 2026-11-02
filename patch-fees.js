const fs = require("fs");
const path = require("path");

const base = fs.existsSync("frontend/src/pages/ChapterBrowser.jsx")
  ? "frontend/src"
  : fs.existsSync("src/pages/ChapterBrowser.jsx")
  ? "src"
  : null;
if (!base) {
  console.error("❌ Hindi makita ang ChapterBrowser.jsx. I-run sa project root.");
  process.exit(1);
}

const file = path.join(base, "pages", "ChapterBrowser.jsx");
let cb = fs.readFileSync(file, "utf8");

if (cb.includes("function FeesView")) {
  console.log("ℹ️ Na-patch na ito dati. Walang binago.");
  process.exit(0);
}

function swap(src, find, repl, label) {
  const i = src.indexOf(find);
  if (i === -1) {
    console.error("❌ Hindi makita ang anchor: " + label + " (walang binago)");
    process.exit(1);
  }
  if (src.indexOf(find, i + 1) !== -1) {
    console.error("❌ Higit sa 1 match: " + label + " (walang binago)");
    process.exit(1);
  }
  return src.slice(0, i) + repl + src.slice(i + find.length);
}

// 1) imports
cb = swap(
  cb,
  'import { useAuth } from "../authContext";',
  'import { useAuth } from "../authContext";\n' +
    'import { PROMO_PLAN, PAYMENT_METHODS, SUBJECT_LABELS } from "../payments";\n' +
    'import { formatTimeLeft, formatDateShort } from "../access";',
  "import authContext"
);

// 2) tag icon
cb = swap(
  cb,
  '  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,',
  '  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,\n' +
    '  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" /></>,',
  "NAV_ICONS x"
);

// 3) header title
cb = swap(
  cb,
  'quiz: "Quiz", settings: "Settings",',
  'quiz: "Quiz", fees: "Fees", settings: "Settings",',
  "VIEW_TITLES"
);

// 4) bottom nav item (after Quiz)
cb = swap(
  cb,
  '    { id: "quiz", label: "Quiz", icon: "quiz" },',
  '    { id: "quiz", label: "Quiz", icon: "quiz" },\n    { id: "fees", label: "Fees", icon: "tag" },',
  "BottomNav items"
);

// 5) render the Fees view
cb = swap(
  cb,
  'view === "quiz" ? null : view === "update" ?',
  'view === "fees" ? <FeesView /> : view === "quiz" ? null : view === "update" ?',
  "render chain"
);

// 6) the FeesView component
const FEES = String.raw`function FeesView() {
  const { user, profile, access, setOverlayOpen, setIntentPlanId } = useAuth();
  const pending = [...(profile?.pendingPurchases || []), ...(profile?.pendingAccess || [])]
    .sort((a, b) => (a.requestedAt || 0) - (b.requestedAt || 0));
  const isPaid = access?.state === "paid";

  // Same shortcut the Paywall uses: opens the payment-method step directly.
  const payNow = () => {
    if (user) setIntentPlanId(PROMO_PLAN.id);
    setOverlayOpen(true);
  };

  let status = null;
  if (access?.state === "admin") status = "👑 Admin — everything is unlocked.";
  else if (isPaid) status = "✅ Active until " + formatDateShort(access.app.expiresAt) + " (" + formatTimeLeft(access.msLeft) + " left). Renew early and your remaining days are kept.";
  else if (access?.state === "trial") status = "🎁 Free trial: " + formatTimeLeft(access.msLeft) + " left";
  else if (access?.state === "expired") status = "⏳ Your trial has ended. Get the promo to continue.";

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Fees</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">The promo bundle and where to pay.</p>
      </div>

      {status && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{status}</div>
      )}

      {pending.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          ⏳ Payment pending ({pending[pending.length - 1].referenceCode}) — waiting for confirmation.
        </div>
      )}

      <section className="rounded-2xl border-2 border-gold-500 bg-white p-4 shadow-card dark:bg-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-extrabold text-navy-900 dark:text-slate-100">🔥 {PROMO_PLAN.label}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{PROMO_PLAN.tagline}</p>
          </div>
          <span className="flex-shrink-0 text-3xl font-extrabold text-navy-900 dark:text-slate-50">₱{PROMO_PLAN.price}</span>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-200">
          {PROMO_PLAN.subjects.map((code) => (
            <li key={code}>✅ {SUBJECT_LABELS[code] || code}</li>
          ))}
          <li>✅ Full app access</li>
        </ul>
        <p className="mt-3 text-xs font-semibold text-gold-600 dark:text-gold-400">⏳ Valid for {PROMO_PLAN.days} days only</p>
        <button onClick={payNow} className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-navy-900 px-4 py-3 text-sm font-bold text-white active:bg-navy-800 dark:bg-navy-700">
          {user ? (isPaid ? "Renew" : "Pay now") + " · ₱" + PROMO_PLAN.price : "Sign in to get started"}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">How to pay</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <span key={m.id} className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">{m.label}</span>
          ))}
        </div>
        <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>1. Tap <b>Pay now</b> above and choose GCash, Maya, or MariBank.</li>
          <li>2. Scan the QR code and pay ₱{PROMO_PLAN.price}. Write your <b>email address</b> and the <b>reference code</b> in the payment note.</li>
          <li>3. Tap <b>I've paid</b>. Payments are confirmed manually by the admin within a few hours.</li>
        </ol>
      </section>
    </div>
  );
}

`;

cb = swap(
  cb,
  'export default function ChapterBrowser({ initialView = "browse", initialMode = null, demo = false } = {}) {',
  FEES + 'export default function ChapterBrowser({ initialView = "browse", initialMode = null, demo = false } = {}) {',
  "ChapterBrowser export"
);

if (!fs.existsSync(file + ".bak")) fs.copyFileSync(file, file + ".bak");
fs.writeFileSync(file, cb);

console.log("✅ Tapos na! Nadagdag ang Fees tab.");
console.log("   • " + file + "  (backup: .bak)");
console.log("Susunod: cd frontend && npm run build   (o i-push na sa Codemagic)");
