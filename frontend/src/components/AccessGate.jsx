import { useState, useEffect, useRef } from "react";
import { useAuth } from "../authContext";
import ChapterBrowser from "../pages/ChapterBrowser";
import { TRIAL_DAYS, DAY_MS, formatTimeLeft } from "../access";
import { PROMO_PLAN } from "../payments";

const DEMO_SECONDS = 60;

// Tutorial + About for signed-out users. Each feature has a demo:
// tap Start to try it for 1 minute, then return here.
const STEPS = [
  { icon: "⚖️", title: "Welcome to RA 10863", body: "Your offline companion for the Customs Modernization and Tariff Act (CMTA) — the law, notes, AI explanations, and practice questions for the CuBLE." },
  { icon: "📚", title: "Browse the Law", body: "Open the menu (☰). Every Title, Chapter, and Section is arranged in the correct order.", demo: { view: "browse", mode: "study" } },
  { icon: "📘", title: "Study Mode", body: "One section at a time, so you can stay focused. Use Expand All / Collapse All to move through a whole chapter quickly.", demo: { view: "browse", mode: "study" } },
  { icon: "📖", title: "Reading Mode", body: "A book-style view for long reading sessions. Tap 🎯 Focus to hide the toolbar.", demo: { view: "browse", mode: "reading" } },
  { icon: "🖍️", title: "Highlights", body: "Select any text to highlight it. Highlights save automatically and work offline.", demo: { view: "browse", mode: "study" } },
  { icon: "📝", title: "Notes", body: "Tap \"Add Note\" under any section to write your own explanation.", demo: { view: "browse", mode: "study" } },
  { icon: "🤖", title: "Ask AI", body: "Instant offline explanations from Osias 6.7 for every section.", demo: { view: "browse", mode: "study" } },
  { icon: "🔍", title: "Search", body: "Find anything fast. Try \"102\" or \"smuggling\".", demo: { view: "search", mode: null } },
  { icon: "✍️", title: "Practice Quiz / Exam", body: "Try the practice questions. RA 10863 Level 1 (Filipino version) is free, and so are the first 10 items of each other subject. Levels 2–5 are in English.", demo: { view: "quiz", mode: null } },
  { icon: "🎁", title: TRIAL_DAYS + "-Day Free Trial", body: "Sign in with Google to start " + TRIAL_DAYS + " days of free access to the whole app. After that, choose a plan to continue." },
];

function Splash({ text }) {
  return (
    <div className="safe-top flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center dark:bg-slate-950">
      <span className="text-4xl" aria-hidden>⚖️</span>
      <div
        className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-navy-900 dark:border-slate-700 dark:border-t-gold-400"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{text}</p>
      <p className="max-w-xs rounded-xl bg-white/80 px-4 py-3 text-xs leading-relaxed text-slate-500 shadow-sm dark:bg-slate-900/70 dark:text-slate-400">
        💡 Tip: If loading takes too long, turn Airplane Mode on, then off, and reopen the app for a faster reload.
      </p>
    </div>
  );
}

// ── Demo: 1 minuto bawat Start ───────────────────────────────────────
function DemoShell({ feature, onEnd }) {
  const { overlayOpen, setOverlayOpen } = useAuth();
  const [left, setLeft] = useState(DEMO_SECONDS);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    const endAt = Date.now() + DEMO_SECONDS * 1000;
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setLeft(s);
      if (s <= 0) {
        clearInterval(id);
        endRef.current();
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");

  return (
    <>
      <ChapterBrowser initialView={feature.view} initialMode={feature.mode} demo />
      {!overlayOpen && (
        <div className="safe-bottom fixed bottom-3 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy-900/95 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur dark:bg-slate-100/95 dark:text-navy-900">
          <span aria-hidden>⏱</span>
          <span>Demo {mm}:{ss}</span>
          <button onClick={() => setOverlayOpen(true)} className="rounded-full bg-gold-500 px-2.5 py-1 text-[11px] text-navy-900 active:bg-gold-600">Sign in</button>
          <button onClick={onEnd} className="rounded-full border border-white/40 px-2.5 py-1 text-[11px] dark:border-navy-900/40">Exit</button>
        </div>
      )}
    </>
  );
}

// ── Guest: About + Tutorial + Login ──────────────────────────────────
function GuestWelcome({ step, setStep, onStartDemo }) {
  const { signInWithGoogle, signingIn, authError } = useAuth();
  const total = STEPS.length;
  const cur = STEPS[step];
  const isLast = step === total - 1;

  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col bg-slate-50 dark:bg-slate-950">
      <div className="px-5 pb-2 pt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">RA 10863 · CMTA</p>
        <h1 className="text-xl font-bold text-navy-900 dark:text-slate-50">CuBLE Review App</h1>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} aria-label={"Step " + (i + 1)} className={"h-1.5 rounded-full transition-all duration-300 " + (i === step ? "w-6 bg-navy-900 dark:bg-slate-100" : "w-1.5 bg-slate-200 dark:bg-slate-700")} />
            ))}
          </div>
          <span className="mb-3 block text-5xl" aria-hidden>{cur.icon}</span>
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">{cur.title}</h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{cur.body}</p>

          {cur.demo && (
            <button onClick={() => onStartDemo(cur.demo)} className="mb-4 w-full rounded-xl border-2 border-gold-500 bg-gold-50 px-4 py-2.5 text-sm font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-800 dark:text-gold-400">
              ▶ Start — try it for 1 minute
            </button>
          )}

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-800">Back</button>
            )}
            <button onClick={() => setStep(isLast ? 0 : step + 1)} className="flex h-11 flex-[2] items-center justify-center rounded-xl bg-navy-900 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700">
              {isLast ? "🔄 Replay Tutorial" : "Next"}
            </button>
          </div>
        </div>
      </main>

      <div className="border-t border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        {authError && <p className="mb-2 text-center text-xs text-red-600 dark:text-red-400">{authError}</p>}
        <button onClick={signInWithGoogle} disabled={signingIn} className="mx-auto flex h-12 w-full max-w-md items-center justify-center rounded-xl bg-gold-500 text-sm font-bold text-navy-900 shadow-sm active:bg-gold-600 disabled:opacity-50">
          {signingIn ? "Waiting for Google..." : "🎁 Login with Google — start your " + TRIAL_DAYS + "-day free trial"}
        </button>
      </div>
    </div>
  );
}

// ── Paywall: tapos na ang trial, plans lang ang makikita ─────────────
function Paywall() {
  const { user, profile, signOutUser, setOverlayOpen, setIntentPlanId } = useAuth();
  // Promo purchases are saved in pendingPurchases, so read both lists.
  const pending = [...(profile?.pendingPurchases || []), ...(profile?.pendingAccess || [])]
    .sort((a, b) => (a.requestedAt || 0) - (b.requestedAt || 0));

  const choose = (plan) => {
    setIntentPlanId(plan.id);
    setOverlayOpen(true);
  };

  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col items-center bg-slate-50 px-5 py-6 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <span className="text-4xl" aria-hidden>⏳</span>
          <h1 className="mt-2 text-xl font-bold text-navy-900 dark:text-slate-50">Your free trial has ended</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get the All Access promo to continue. It is the only plan available right now. {user?.email}</p>
        </div>

        {pending.length > 0 && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            ⏳ You have a pending payment ({pending[pending.length - 1].referenceCode}). Please wait for confirmation.
          </div>
        )}

        <div className="space-y-2">
          <button onClick={() => choose(PROMO_PLAN)} className="w-full rounded-2xl border-2 border-gold-500 bg-gold-50 px-4 py-4 text-left active:opacity-80 dark:border-gold-400 dark:bg-slate-900">
            <span className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-base font-extrabold text-navy-900 dark:text-slate-100">🔥 {PROMO_PLAN.label}</span>
                <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{PROMO_PLAN.tagline}</span>
                <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">Unlocks everything: RA 10863 (all levels) · CDP · TL · PC · TCP + full App Access</span>
                <span className="mt-1 block text-xs font-semibold text-gold-600 dark:text-gold-400">⏳ Valid for {PROMO_PLAN.days} days only</span>
              </span>
              <span className="text-3xl font-extrabold text-navy-900 dark:text-slate-50">₱{PROMO_PLAN.price}</span>
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">Pay via GCash · Maya · MariBank. Payments are confirmed manually by the admin.</p>
        <button onClick={signOutUser} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300">Sign out</button>
      </div>
    </div>
  );
}

// ── Maliit na pill: natitirang oras ──────────────────────────────────
function AccessPill({ access }) {
  const { overlayOpen, setOverlayOpen } = useAuth();
  if (overlayOpen) return null;
  let label = null;
  if (access.state === "trial") label = "🎁 Free trial · " + formatTimeLeft(access.msLeft) + " left";
  else if (access.state === "paid" && access.msLeft < 7 * DAY_MS) label = "⏳ Access · " + formatTimeLeft(access.msLeft) + " left";
  if (!label) return null;
  return (
    <button onClick={() => setOverlayOpen(true)} className="safe-bottom fixed bottom-3 left-3 z-40 rounded-full bg-navy-900/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur active:bg-navy-800 dark:bg-slate-100/90 dark:text-navy-900">
      {label}
    </button>
  );
}

export default function AccessGate() {
  const { user, profile, loading, signingIn, needsFullName, deviceLimitReached, access, overlayOpen, setOverlayOpen } = useAuth();
  const [demo, setDemo] = useState(null);
  const [guestStep, setGuestStep] = useState(0);

  // Kapag kulang ang setup (pangalan / device limit), buksan ang account overlay.
  useEffect(() => {
    if (user && (needsFullName || deviceLimitReached) && !overlayOpen) setOverlayOpen(true);
  }, [user, needsFullName, deviceLimitReached, overlayOpen, setOverlayOpen]);

  if (loading || signingIn) return <Splash text="Loading…" />;

  if (!user) {
    if (demo) return <DemoShell key={demo.key} feature={demo.feature} onEnd={() => setDemo(null)} />;
    return <GuestWelcome step={guestStep} setStep={setGuestStep} onStartDemo={(feature) => setDemo({ feature, key: Date.now() })} />;
  }

  if (!profile || needsFullName || deviceLimitReached) return <Splash text="Finishing your account setup…" />;
  if (access.state === "loading") return <Splash text="Checking your trial…" />;
  if (access.state === "expired") return <Paywall />;

  return (
    <>
      <ChapterBrowser />
      <AccessPill access={access} />
    </>
  );
}
