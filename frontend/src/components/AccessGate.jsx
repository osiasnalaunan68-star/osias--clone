import { useState, useEffect, useRef } from "react";
import { useAuth } from "../authContext";
import ChapterBrowser from "../pages/ChapterBrowser";
import { ACCESS_PLANS, TRIAL_DAYS, DAY_MS, formatTimeLeft } from "../access";
import { PLANS } from "../payments";

const DEMO_SECONDS = 60;

// Tutorial + About para sa hindi pa naka-login. May "demo" ang bawat feature:
// pindutin ang Start at 1 minuto lang ang gamit, tapos balik dito.
const STEPS = [
  { icon: "⚖️", title: "Welcome to RA 10863", body: "Ang offline companion mo para sa Customs Modernization and Tariff Act (CMTA) — batas, notes, AI explanations, at practice questions para sa CuBLE." },
  { icon: "📚", title: "Browse the Law", body: "Buksan ang menu (☰). Lahat ng Title, Chapter at Section ay nakaayos ayon sa tamang pagkakasunod.", demo: { view: "browse", mode: "study" } },
  { icon: "📘", title: "Study Mode", body: "Isa-isang section para focused. May Expand All / Collapse All para mabilis sa buong chapter.", demo: { view: "browse", mode: "study" } },
  { icon: "📖", title: "Reading Mode", body: "Book-style na view para sa mahabang pagbabasa. Pindutin ang 🎯 Focus para tago ang toolbar.", demo: { view: "browse", mode: "reading" } },
  { icon: "🖍️", title: "Highlights", body: "I-select ang kahit anong text para i-highlight. Auto-save, gumagana kahit offline.", demo: { view: "browse", mode: "study" } },
  { icon: "📝", title: "Notes", body: "Pindutin ang \"Add Note\" sa ilalim ng kahit anong section para isulat ang sarili mong paliwanag.", demo: { view: "browse", mode: "study" } },
  { icon: "🤖", title: "Ask AI", body: "Instant offline explanation mula sa Osias 6.7 sa bawat section.", demo: { view: "browse", mode: "study" } },
  { icon: "🔍", title: "Search", body: "Hanapin agad ang kahit ano. Subukan ang \"102\" o \"smuggling\".", demo: { view: "search", mode: null } },
  { icon: "✍️", title: "Practice Quiz / Exam", body: "Subukan ang practice questions — 10 items bawat subject ang libre.", demo: { view: "quiz", mode: null } },
  { icon: "🎁", title: TRIAL_DAYS + "-Day Free Trial", body: "Mag-login gamit ang Google para magsimula ang " + TRIAL_DAYS + " araw na libreng gamit ng buong app. Pagkatapos, pumili ng plan para magpatuloy." },
];

function Splash({ text }) {
  return (
    <div className="safe-top flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center dark:bg-slate-950">
      <span className="text-4xl" aria-hidden>⚖️</span>
      <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
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
              ▶ Start — subukan ng 1 minuto
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
          {signingIn ? "Naghihintay sa Google..." : "🎁 Login with Google — simulan ang " + TRIAL_DAYS + "-day free trial"}
        </button>
      </div>
    </div>
  );
}

// ── Paywall: tapos na ang trial, plans lang ang makikita ─────────────
function Paywall() {
  const { user, profile, signOutUser, setOverlayOpen, setIntentPlanId } = useAuth();
  const pending = profile?.pendingAccess || [];

  const choose = (plan) => {
    setIntentPlanId(plan.id);
    setOverlayOpen(true);
  };

  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col items-center bg-slate-50 px-5 py-6 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <span className="text-4xl" aria-hidden>⏳</span>
          <h1 className="mt-2 text-xl font-bold text-navy-900 dark:text-slate-50">Tapos na ang free trial mo</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pumili ng App Access plan para magpatuloy. {user?.email}</p>
        </div>

        {pending.length > 0 && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            ⏳ May pending payment ka ({pending[pending.length - 1].referenceCode}). Hintayin lang ang confirmation.
          </div>
        )}

        <div className="space-y-2">
          {ACCESS_PLANS.map((p) => {
            const best = p.months === 8;
            return (
              <button key={p.id} onClick={() => choose(p)} className={"flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left active:opacity-80 " + (best ? "border-gold-500 bg-gold-50 dark:border-gold-400 dark:bg-slate-900" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900")}>
                <span>
                  <span className="block text-base font-bold text-navy-900 dark:text-slate-100">{p.months} {p.months === 1 ? "Month" : "Months"}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">₱{(p.price / p.months).toFixed(0)}/buwan{best ? " · Best value" : ""}</span>
                </span>
                <span className="text-2xl font-extrabold text-navy-900 dark:text-slate-50">₱{p.price}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Bundle — practice questions + App Access</p>
          {PLANS.filter((p) => p.bonusMonths).map((p) => (
            <button key={p.id} onClick={() => choose(p)} className="flex w-full items-center justify-between rounded-2xl border-2 border-gold-500 bg-gold-50 px-4 py-3 text-left active:opacity-80 dark:border-gold-400 dark:bg-slate-900">
              <span>
                <span className="block text-base font-bold text-navy-900 dark:text-slate-100">{p.label}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{p.subjects.join(" · ")} + {p.bonusMonths} months App Access</span>
              </span>
              <span className="text-2xl font-extrabold text-navy-900 dark:text-slate-50">₱{p.price}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">Bayad via GCash · Maya · MariBank. Ico-confirm manually ng admin.</p>
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
  else if (access.state === "paid" && access.msLeft < 3 * DAY_MS) label = "⏳ Access · " + formatTimeLeft(access.msLeft) + " left";
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

  if (loading || signingIn) return <Splash text="Sandali lang..." />;

  if (!user) {
    if (demo) return <DemoShell key={demo.key} feature={demo.feature} onEnd={() => setDemo(null)} />;
    return <GuestWelcome step={guestStep} setStep={setGuestStep} onStartDemo={(feature) => setDemo({ feature, key: Date.now() })} />;
  }

  if (!profile || needsFullName || deviceLimitReached) return <Splash text="Tinatapos ang setup ng account mo..." />;
  if (access.state === "loading") return <Splash text="Sinusuri ang trial mo..." />;
  if (access.state === "expired") return <Paywall />;

  return (
    <>
      <ChapterBrowser />
      <AccessPill access={access} />
    </>
  );
}
